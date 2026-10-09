"""
Calculator API - Centralized Authentication with WytNet / WytPass IdP
All local credential storage and local verification have been completely removed.
Identity, registration, password lifecycle, and tokens are delegated to WytNet.
"""
import os
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, Request, Response, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Explicitly load .env from current directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(dotenv_path=env_path, override=True)

from wytnet_client import (
    wytnet_client,
    WYTPASS_CLIENT_ID,
    WYTNET_AUTH_URL,
    WYTPASS_REDIRECT_URI,
    WYTPASS_SCOPES,
    ENVIRONMENT
)

logger = logging.getLogger("calculator_api")
logging.basicConfig(level=logging.INFO)

# Database Setup
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'calculator.db')}")
if DATABASE_URL == "sqlite:///./calculator.db":
    DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'calculator.db').replace('\\', '/')}"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Ensure IPv4 connection pooler is used for Supabase to prevent IPv6 DNS failures
if "db.ekaileporclbujbfxfos.supabase.co" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace(
        "postgres:Pranessh123@db.ekaileporclbujbfxfos.supabase.co:5432",
        "postgres.ekaileporclbujbfxfos:Pranessh123@aws-0-ap-northeast-2.pooler.supabase.com:5432"
    )

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://kalzy.vercel.app")
IS_PROD = ENVIRONMENT.lower() == "production"

engine_kwargs = {}
if "sqlite" in DATABASE_URL:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Database Models
class User(Base):
    """
    Decoupled application user model.
    Primary key is WytNet's canonical user subject identifier 'sub' (wn_usr_<uuid>).
    No passwords, password hashes, or salt fields are stored locally.
    """
    __tablename__ = "users"

    sub = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    username = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


Base.metadata.create_all(bind=engine)


# Pydantic Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
    confirm_password: str


class TokenExchangeRequest(BaseModel):
    code: str
    code_verifier: str
    redirect_uri: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    sub: str
    email: str
    name: Optional[str] = None
    username: Optional[str] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    id_token: Optional[str] = None
    token_type: str = "Bearer"
    expires_in: Optional[int] = 3600
    user: Optional[UserResponse] = None


class BMIRequest(BaseModel):
    weight: float
    height: float


class AgeRequest(BaseModel):
    birth_date: str


class GSTRequest(BaseModel):
    amount: float
    gst_rate: float


class EBBillRequest(BaseModel):
    units: float
    rate_per_unit: float


# FastAPI App
app = FastAPI(
    title="Calculator API - WytNet Centralized Identity",
    description="Application backend migrated to WytNet Centralized Authentication (WytPass IdP)",
    version="2.0.0"
)

# CORS Configuration
allowed_origins = [
    FRONTEND_URL,
    "https://kalzy.vercel.app",
    "http://127.0.0.1:3000",
    "https://wytnet.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if IS_PROD else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security_scheme = HTTPBearer(auto_error=False)


# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# User Sync & Session Cookie Helper
def sync_user_record(db: Session, sub: str, email: str, name: Optional[str] = None) -> User:
    """Synchronize user profile in local database indexed by canonical WytNet 'sub'"""
    user = db.query(User).filter(User.sub == sub).first()
    if not user:
        # Check by email if user previously existed
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.sub = sub
            if name:
                user.name = name
            db.commit()
            db.refresh(user)
            return user

        user = User(
            sub=sub,
            email=email,
            name=name,
            username=name or email.split("@")[0]
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update profile info if changed
        updated = False
        if name and user.name != name:
            user.name = name
            updated = True
        if email and user.email != email:
            user.email = email
            updated = True
        if updated:
            db.commit()
            db.refresh(user)
    return user


def set_auth_cookies(response: Response, access_token: str, refresh_token: Optional[str] = None):
    """Store tokens in secure HttpOnly SameSite=Lax cookies"""
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=IS_PROD,
        max_age=3600
    )
    if refresh_token:
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            samesite="lax",
            secure=IS_PROD,
            max_age=30 * 86400
        )


def clear_auth_cookies(response: Response):
    """Clear session cookies upon logout"""
    response.delete_cookie(key="access_token", httponly=True, samesite="lax")
    response.delete_cookie(key="refresh_token", httponly=True, samesite="lax")


# Current User Authentication Dependency
async def get_current_user(
    request: Request,
    auth_credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Validates token via RS256 JWKS public key verification or WytNet introspection API.
    Supports both Authorization: Bearer <token> header and secure HttpOnly cookie.
    """
    token = None
    if auth_credentials:
        token = auth_credentials.credentials
    elif "access_token" in request.cookies:
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    claims = await wytnet_client.verify_token(token)
    sub = claims.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing subject identifier ('sub')",
            headers={"WWW-Authenticate": "Bearer"}
        )

    email = claims.get("email") or f"{sub}@wytnet.id"
    name = claims.get("name")
    user = sync_user_record(db, sub=sub, email=email, name=name)
    return user


# ==============================================================================
# AUTHENTICATION ROUTES (Centralized with WytNet)
# ==============================================================================

@app.get("/")
def read_root():
    return {
        "message": "Calculator API is running with WytNet Centralized Identity",
        "auth_provider": "WytNet (WytPass IdP)",
        "version": "2.0.0"
    }


@app.get("/api/auth/config")
def get_auth_config():
    """Returns public WytPass client configuration for frontend OAuth PKCE flow"""
    return {
        "client_id": WYTPASS_CLIENT_ID,
        "auth_url": WYTNET_AUTH_URL,
        "redirect_uri": WYTPASS_REDIRECT_URI,
        "scopes": WYTPASS_SCOPES
    }


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    FLOW A: Direct Email + Password Authentication
    Forwards credentials to WytNet POST /auth-layer/authenticate.
    Stores session tokens in secure HttpOnly cookies.
    """
    auth_result = await wytnet_client.direct_authenticate(
        email=credentials.email,
        password=credentials.password
    )

    access_token = auth_result.get("access_token")
    refresh_token = auth_result.get("refresh_token")
    user_data = auth_result.get("user", {})

    sub = user_data.get("sub") or auth_result.get("sub")
    email = user_data.get("email", credentials.email)
    name = user_data.get("name")

    db_user = sync_user_record(db, sub=sub, email=email, name=name)
    set_auth_cookies(response, access_token=access_token, refresh_token=refresh_token)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        id_token=auth_result.get("id_token"),
        token_type=auth_result.get("token_type", "Bearer"),
        expires_in=auth_result.get("expires_in", 3600),
        user=UserResponse(
            sub=db_user.sub,
            email=db_user.email,
            name=db_user.name,
            username=db_user.username
        )
    )


# Backwards compatibility endpoint for OAuth2 form / Swagger UI
@app.post("/token", response_model=TokenResponse)
async def legacy_token_login(
    response: Response,
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    credentials = LoginRequest(email=username, password=password)
    return await login(credentials, response, db)


@app.post("/api/auth/register")
async def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    User Registration:
    Delegates user creation to WytNet POST /auth-layer/register.
    """
    result = await wytnet_client.register(
        name=req.name,
        email=req.email,
        password=req.password,
        phone=req.phone
    )

    # If user object returned, sync locally
    user_info = result.get("user")
    if user_info and user_info.get("sub"):
        sync_user_record(
            db,
            sub=user_info["sub"],
            email=user_info.get("email", req.email),
            name=user_info.get("name", req.name)
        )

    return result


@app.post("/signup")
async def legacy_signup(req: UserRegisterRequest, db: Session = Depends(get_db)):
    return await register(req, db)


@app.post("/api/auth/wytpass/token", response_model=TokenResponse)
async def wytpass_token_exchange(
    req: TokenExchangeRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """
    FLOW B: "Continue with WytPass" (OAuth 2.0 / OIDC + PKCE)
    Exchanges authorization code and code_verifier at WytNet POST /oauth/token.
    """
    redirect_uri = req.redirect_uri or WYTPASS_REDIRECT_URI
    token_data = await wytnet_client.exchange_code(
        code=req.code,
        code_verifier=req.code_verifier,
        redirect_uri=redirect_uri
    )

    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")
    user_info = token_data.get("user") or {}

    sub = user_info.get("sub")
    if not sub:
        # Verify access token or decode claims to extract sub
        claims = await wytnet_client.verify_token(access_token)
        sub = claims.get("sub")
        email = claims.get("email", "user@wytnet.id")
        name = claims.get("name")
    else:
        email = user_info.get("email", f"{sub}@wytnet.id")
        name = user_info.get("name")

    db_user = sync_user_record(db, sub=sub, email=email, name=name)
    set_auth_cookies(response, access_token=access_token, refresh_token=refresh_token)

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        id_token=token_data.get("id_token"),
        token_type=token_data.get("token_type", "Bearer"),
        expires_in=token_data.get("expires_in", 3600),
        user=UserResponse(
            sub=db_user.sub,
            email=db_user.email,
            name=db_user.name,
            username=db_user.username
        )
    )


@app.post("/auth/wytpass/token")
async def legacy_wytpass_token(
    code: str,
    code_verifier: str,
    response: Response,
    db: Session = Depends(get_db)
):
    req = TokenExchangeRequest(code=code, code_verifier=code_verifier)
    return await wytpass_token_exchange(req, response, db)


@app.post("/api/auth/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    """Forgot Password: Requests reset token via WytNet POST /auth-layer/forgot-password"""
    return await wytnet_client.forgot_password(email=req.email)


@app.post("/api/auth/reset-password")
async def reset_password(req: ResetPasswordRequest):
    """Reset Password: Submits new password via WytNet POST /auth-layer/reset-password"""
    return await wytnet_client.reset_password(
        token=req.token,
        new_password=req.new_password,
        confirm_password=req.confirm_password
    )


@app.post("/api/auth/refresh")
async def refresh_token(
    req: RefreshTokenRequest,
    response: Response
):
    """Refreshes expired access token via WytNet POST /oauth/token"""
    result = await wytnet_client.refresh_access_token(req.refresh_token)
    new_access_token = result.get("access_token")
    new_refresh_token = result.get("refresh_token")
    if new_access_token:
        set_auth_cookies(response, access_token=new_access_token, refresh_token=new_refresh_token)
    return result


@app.post("/api/auth/logout")
async def logout(
    request: Request,
    response: Response,
    auth_credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
):
    """Logout & Token Revocation: Revokes token at WytNet POST /oauth/revoke and clears cookies"""
    token = None
    if auth_credentials:
        token = auth_credentials.credentials
    elif "access_token" in request.cookies:
        token = request.cookies.get("access_token")

    if token:
        await wytnet_client.revoke_token(token)

    clear_auth_cookies(response)
    return {"message": "Successfully logged out from WytNet identity session."}


@app.get("/api/auth/me", response_model=UserResponse)
@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Fetch current user authenticated via WytNet"""
    return current_user


# ==============================================================================
# CALCULATOR ENDPOINTS (Protected with WytNet authentication)
# ==============================================================================

@app.post("/calculate/bmi")
async def calculate_bmi(request: BMIRequest, current_user: User = Depends(get_current_user)):
    height_m = request.height / 100
    bmi = request.weight / (height_m ** 2)

    if bmi < 18.5:
        category = "Underweight"
    elif 18.5 <= bmi < 25:
        category = "Normal weight"
    elif 25 <= bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"

    return {
        "bmi": round(bmi, 2),
        "category": category,
        "weight": request.weight,
        "height": request.height,
        "user_sub": current_user.sub
    }


@app.post("/calculate/age")
async def calculate_age(request: AgeRequest, current_user: User = Depends(get_current_user)):
    try:
        birth_date = datetime.strptime(request.birth_date, "%Y-%m-%d")
        today = datetime.now()

        years = today.year - birth_date.year
        months = today.month - birth_date.month
        days = today.day - birth_date.day

        if days < 0:
            months -= 1
            if today.month == 1:
                prev_month = 12
                prev_year = today.year - 1
            else:
                prev_month = today.month - 1
                prev_year = today.year
            days_in_prev_month = (datetime(prev_year, prev_month + 1, 1) - timedelta(days=1)).day if prev_month < 12 else 31
            days += days_in_prev_month

        if months < 0:
            years -= 1
            months += 12

        total_days = (today - birth_date).days

        return {
            "years": years,
            "months": months,
            "days": days,
            "total_days": total_days,
            "birth_date": request.birth_date,
            "user_sub": current_user.sub
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")


@app.post("/calculate/gst")
async def calculate_gst(request: GSTRequest, current_user: User = Depends(get_current_user)):
    gst_amount = request.amount * (request.gst_rate / 100)
    total_amount = request.amount + gst_amount

    return {
        "original_amount": round(request.amount, 2),
        "gst_rate": request.gst_rate,
        "gst_amount": round(gst_amount, 2),
        "total_amount": round(total_amount, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/eb-bill")
async def calculate_eb_bill(request: EBBillRequest, current_user: User = Depends(get_current_user)):
    total_cost = request.units * request.rate_per_unit
    fixed_charges = total_cost * 0.05
    final_amount = total_cost + fixed_charges

    return {
        "units": request.units,
        "rate_per_unit": request.rate_per_unit,
        "energy_charges": round(total_cost, 2),
        "fixed_charges": round(fixed_charges, 2),
        "total_amount": round(final_amount, 2),
        "user_sub": current_user.sub
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
