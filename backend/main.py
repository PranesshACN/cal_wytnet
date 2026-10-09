"""
Calculator API - Centralized Authentication with WytNet / WytPass IdP
All local credential storage and local verification have been completely removed.
Identity, registration, password lifecycle, and tokens are delegated to WytNet.
"""
import os
import re
import logging
import traceback
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

_startup_error = None

# Database Setup
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'calculator.db')}")
if DATABASE_URL == "sqlite:///./calculator.db":
    DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'calculator.db').replace('\\', '/')}"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Ensure IPv4 connection pooler is used for Supabase to prevent IPv6 DNS failures on Vercel/serverless
if "supabase.co" in DATABASE_URL and "pooler.supabase.com" not in DATABASE_URL:
    m = re.match(r"(postgresql(?:\+psycopg2)?):\/\/([^:]+):([^@]+)@db\.([^\.]+)\.supabase\.co(?::\d+)?\/(.+)", DATABASE_URL)
    if m:
        proto, user, password, ref, dbname = m.groups()
        pooler_user = user if user.endswith(f".{ref}") else f"postgres.{ref}"
        DATABASE_URL = f"{proto}://{pooler_user}:{password}@aws-0-ap-northeast-2.pooler.supabase.com:5432/{dbname}"

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://kalzy.vercel.app")
IS_PROD = ENVIRONMENT.lower() == "production"

engine_kwargs = {}
if "sqlite" in DATABASE_URL:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300

try:
    engine = create_engine(DATABASE_URL, **engine_kwargs)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    _startup_error = traceback.format_exc()
    logger.error("Error initializing database engine: %s", _startup_error)
    # Fail-safe memory engine so module import never crashes serverless functions
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
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


try:
    Base.metadata.create_all(bind=engine)
except Exception as ex:
    logger.warning("Base.metadata.create_all deferred: %s", ex)


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


class EMIRequest(BaseModel):
    principal: float
    annual_rate: float
    tenure_years: float


class MortgageRequest(BaseModel):
    home_value: float
    down_payment_percent: float = 20.0
    annual_rate: float = 6.5
    term_years: float = 30.0
    property_tax_rate: float = 1.2
    annual_insurance: float = 1200.0


class LoanCompareItem(BaseModel):
    principal: float
    rate: float
    tenure_years: float


class LoanComparisonRequest(BaseModel):
    loan_a: LoanCompareItem
    loan_b: LoanCompareItem


class RetirementRequest(BaseModel):
    current_age: float
    retirement_age: float
    current_savings: float = 0.0
    monthly_contribution: float = 0.0
    annual_return_rate: float = 8.0


class CreditCardRequest(BaseModel):
    balance: float
    rate_apr: float
    monthly_payment: float


class SavingsGoalRequest(BaseModel):
    target_amount: float
    current_savings: float = 0.0
    years: float = 3.0
    expected_return_rate: float = 7.0


class InflationRequest(BaseModel):
    current_amount: float
    inflation_rate: float = 6.0
    years: float = 10.0


class NetWorthRequest(BaseModel):
    assets: Dict[str, float] = {}
    liabilities: Dict[str, float] = {}


class SimpleInterestRequest(BaseModel):
    principal: float
    annual_rate: float
    tenure_years: float


class DownPaymentRequest(BaseModel):
    property_price: float
    down_payment_percent: float = 20.0
    closing_cost_percent: float = 3.0


class CompoundInterestRequest(BaseModel):
    principal: float
    annual_rate: float
    tenure_years: float
    frequency: int = 1
    monthly_deposit: float = 0.0


class SIPRequest(BaseModel):
    monthly_investment: float
    expected_return_rate: float
    tenure_years: float


class ROIRequest(BaseModel):
    initial_investment: float
    final_value: float
    duration_years: float = 1.0


class FDRequest(BaseModel):
    principal: float
    annual_rate: float
    tenure_years: float
    compounding_frequency: int = 4


class CAGRRequest(BaseModel):
    beginning_value: float
    ending_value: float
    tenure_years: float


class SalaryRequest(BaseModel):
    gross_amount: float
    frequency: str = "annual"
    hours_per_week: float = 40.0
    weeks_per_year: float = 52.0


class IncomeTaxRequest(BaseModel):
    gross_income: float
    deductions: float = 50000.0


class HourlyToSalaryRequest(BaseModel):
    hourly_wage: float
    hours_per_week: float = 40.0
    paid_weeks: float = 52.0
    overtime_hours: float = 0.0
    overtime_multiplier: float = 1.5


class BudgetRequest(BaseModel):
    monthly_income: float
    needs_amount: float = 0.0
    wants_amount: float = 0.0
    savings_amount: float = 0.0


class CalorieRequest(BaseModel):
    age: float
    gender: str = "male"
    weight: float
    height: float
    activity_level: str = "moderate"


class IdealWeightRequest(BaseModel):
    height: float
    gender: str = "male"


class BodyFatRequest(BaseModel):
    gender: str = "male"
    height: float
    waist: float
    neck: float
    hip: float = 0.0


class PregnancyDueDateRequest(BaseModel):
    lmp_date: str


class WaterIntakeRequest(BaseModel):
    weight: float
    activity_minutes: float = 30.0


class SleepRequest(BaseModel):
    target_time: str = "07:00"
    mode: str = "wake"


class TargetHeartRateRequest(BaseModel):
    age: float
    resting_heart_rate: float = 70.0




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
        "version": "2.0.0",
        "status": "healthy" if not _startup_error else "degraded",
        "startup_error": _startup_error
    }


@app.get("/api/debug")
def read_debug():
    return {
        "database_url_configured": bool(os.getenv("DATABASE_URL")),
        "database_host": DATABASE_URL.split("@")[-1].split("/")[0] if "@" in DATABASE_URL else "local_sqlite",
        "environment": ENVIRONMENT,
        "is_prod": IS_PROD,
        "startup_error": _startup_error
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


# ==============================================================================
# 10 FINANCE & LOAN CALCULATION ENDPOINTS
# ==============================================================================

@app.post("/calculate/emi")
async def calculate_emi(req: EMIRequest, current_user: User = Depends(get_current_user)):
    r = req.annual_rate / (12 * 100)
    n = req.tenure_years * 12
    emi = (req.principal * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
    total_payment = emi * n
    total_interest = total_payment - req.principal
    return {
        "monthly_emi": round(emi, 2),
        "total_interest": round(total_interest, 2),
        "total_payment": round(total_payment, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/mortgage")
async def calculate_mortgage(req: MortgageRequest, current_user: User = Depends(get_current_user)):
    down_payment = (req.home_value * req.down_payment_percent) / 100
    loan_amount = req.home_value - down_payment
    r = req.annual_rate / (12 * 100)
    n = req.term_years * 12
    monthly_pi = (loan_amount * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1) if loan_amount > 0 else 0
    monthly_tax = (req.home_value * (req.property_tax_rate / 100)) / 12
    monthly_ins = req.annual_insurance / 12
    total_monthly = monthly_pi + monthly_tax + monthly_ins
    return {
        "loan_amount": round(loan_amount, 2),
        "down_payment_amount": round(down_payment, 2),
        "monthly_principal_interest": round(monthly_pi, 2),
        "monthly_tax": round(monthly_tax, 2),
        "monthly_insurance": round(monthly_ins, 2),
        "total_monthly_payment": round(total_monthly, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/loan-comparison")
async def calculate_loan_comparison(req: LoanComparisonRequest, current_user: User = Depends(get_current_user)):
    def compute(p, rate, y):
        r = rate / (12 * 100)
        n = y * 12
        emi = (p * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
        tot = emi * n
        return emi, tot - p, tot

    emi_a, int_a, tot_a = compute(req.loan_a.principal, req.loan_a.rate, req.loan_a.tenure_years)
    emi_b, int_b, tot_b = compute(req.loan_b.principal, req.loan_b.rate, req.loan_b.tenure_years)
    diff = int_a - int_b
    return {
        "loan_a": {"monthly_emi": round(emi_a, 2), "total_interest": round(int_a, 2), "total_payment": round(tot_a, 2)},
        "loan_b": {"monthly_emi": round(emi_b, 2), "total_interest": round(int_b, 2), "total_payment": round(tot_b, 2)},
        "cheaper_loan": "Loan B" if diff > 0 else "Loan A" if diff < 0 else "Equal",
        "savings_amount": round(abs(diff), 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/retirement")
async def calculate_retirement(req: RetirementRequest, current_user: User = Depends(get_current_user)):
    years = max(1.0, req.retirement_age - req.current_age)
    months = int(years * 12)
    r_monthly = (req.annual_return_rate / 100) / 12
    fv_savings = req.current_savings * ((1 + r_monthly) ** months)
    fv_contributions = req.monthly_contribution * (((1 + r_monthly) ** months - 1) / r_monthly) if r_monthly > 0 else req.monthly_contribution * months
    total_corpus = fv_savings + fv_contributions
    return {
        "years_to_retire": round(years, 1),
        "total_corpus": round(total_corpus, 2),
        "monthly_pension_4pct": round((total_corpus * 0.04) / 12, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/credit-card")
async def calculate_credit_card(req: CreditCardRequest, current_user: User = Depends(get_current_user)):
    r = (req.rate_apr / 100) / 12
    if req.monthly_payment <= req.balance * r:
        raise HTTPException(status_code=400, detail="Monthly payment must exceed monthly interest charges")
    curr = req.balance
    months = 0
    tot_int = 0
    while curr > 0.01 and months < 600:
        interest = curr * r
        tot_int += interest
        curr = curr + interest - req.monthly_payment
        months += 1
    return {
        "months_needed": months,
        "total_interest_paid": round(tot_int, 2),
        "total_amount_paid": round(req.balance + tot_int, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/savings-goal")
async def calculate_savings_goal(req: SavingsGoalRequest, current_user: User = Depends(get_current_user)):
    n = req.years * 12
    r = (req.expected_return_rate / 100) / 12
    fv_init = req.current_savings * ((1 + r) ** n)
    rem = max(0.0, req.target_amount - fv_init)
    pmt = (rem * r) / (((1 + r) ** n) - 1) if r > 0 else rem / n
    return {
        "required_monthly_savings": round(pmt, 2),
        "target_amount": round(req.target_amount, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/inflation")
async def calculate_inflation(req: InflationRequest, current_user: User = Depends(get_current_user)):
    i = req.inflation_rate / 100
    future_cost = req.current_amount * ((1 + i) ** req.years)
    purchasing_power = req.current_amount / ((1 + i) ** req.years)
    return {
        "future_equivalent_cost": round(future_cost, 2),
        "future_purchasing_power": round(purchasing_power, 2),
        "purchasing_power_loss_percent": round((1 - (purchasing_power / req.current_amount)) * 100, 1),
        "user_sub": current_user.sub
    }


@app.post("/calculate/net-worth")
async def calculate_net_worth(req: NetWorthRequest, current_user: User = Depends(get_current_user)):
    tot_assets = sum(req.assets.values())
    tot_liab = sum(req.liabilities.values())
    return {
        "total_assets": round(tot_assets, 2),
        "total_liabilities": round(tot_liab, 2),
        "net_worth": round(tot_assets - tot_liab, 2),
        "debt_to_asset_ratio": round((tot_liab / tot_assets) * 100, 1) if tot_assets > 0 else 0,
        "user_sub": current_user.sub
    }


@app.post("/calculate/simple-interest")
async def calculate_simple_interest(req: SimpleInterestRequest, current_user: User = Depends(get_current_user)):
    interest = (req.principal * req.annual_rate * req.tenure_years) / 100
    return {
        "principal": round(req.principal, 2),
        "interest_earned": round(interest, 2),
        "total_amount": round(req.principal + interest, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/down-payment")
async def calculate_down_payment(req: DownPaymentRequest, current_user: User = Depends(get_current_user)):
    dp_amt = (req.property_price * req.down_payment_percent) / 100
    closing_amt = (req.property_price * req.closing_cost_percent) / 100
    return {
        "down_payment_amount": round(dp_amt, 2),
        "loan_required": round(req.property_price - dp_amt, 2),
        "estimated_closing_costs": round(closing_amt, 2),
        "total_upfront_cash": round(dp_amt + closing_amt, 2),
        "user_sub": current_user.sub
    }


# Investment Endpoints
@app.post("/calculate/compound-interest")
async def calculate_compound_interest(req: CompoundInterestRequest, current_user: User = Depends(get_current_user)):
    r = req.annual_rate / 100
    n = req.frequency or 1
    total_months = round(req.tenure_years * 12)
    m_rate = ((1 + r / n) ** (n / 12)) - 1
    
    current_balance = req.principal
    for _ in range(total_months):
        current_balance = current_balance * (1 + m_rate) + req.monthly_deposit

    total_deposited = req.principal + (req.monthly_deposit * total_months)
    total_interest = max(0.0, current_balance - total_deposited)
    return {
        "initial_principal": round(req.principal, 2),
        "total_deposited": round(total_deposited, 2),
        "future_value": round(current_balance, 2),
        "total_interest": round(total_interest, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/sip")
async def calculate_sip(req: SIPRequest, current_user: User = Depends(get_current_user)):
    i = (req.expected_return_rate / 100) / 12
    n = round(req.tenure_years * 12)
    total_value = req.monthly_investment * (((1 + i) ** n - 1) / i) * (1 + i) if i > 0 else req.monthly_investment * n
    total_invested = req.monthly_investment * n
    return {
        "total_invested": round(total_invested, 2),
        "estimated_returns": round(total_value - total_invested, 2),
        "total_value": round(total_value, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/roi")
async def calculate_roi(req: ROIRequest, current_user: User = Depends(get_current_user)):
    profit = req.final_value - req.initial_investment
    roi_pct = (profit / req.initial_investment) * 100 if req.initial_investment > 0 else 0
    annualized = (((req.final_value / req.initial_investment) ** (1 / req.duration_years)) - 1) * 100 if (req.duration_years > 0 and req.final_value > 0 and req.initial_investment > 0) else roi_pct
    return {
        "net_profit": round(profit, 2),
        "roi_percentage": round(roi_pct, 2),
        "annualized_roi": round(annualized, 2),
        "multiplier": round(req.final_value / req.initial_investment, 2) if req.initial_investment > 0 else 0,
        "user_sub": current_user.sub
    }


@app.post("/calculate/fd")
async def calculate_fd(req: FDRequest, current_user: User = Depends(get_current_user)):
    n = req.compounding_frequency or 4
    r = (req.annual_rate / 100) / n
    periods = n * req.tenure_years
    maturity = req.principal * ((1 + r) ** periods)
    return {
        "principal": round(req.principal, 2),
        "maturity_amount": round(maturity, 2),
        "total_interest": round(maturity - req.principal, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/cagr")
async def calculate_cagr(req: CAGRRequest, current_user: User = Depends(get_current_user)):
    if req.beginning_value <= 0 or req.tenure_years <= 0 or req.ending_value <= 0:
        cagr_val = 0.0
    else:
        cagr_val = (((req.ending_value / req.beginning_value) ** (1 / req.tenure_years)) - 1) * 100
    abs_return = ((req.ending_value - req.beginning_value) / req.beginning_value) * 100 if req.beginning_value > 0 else 0
    return {
        "cagr": round(cagr_val, 2),
        "total_gain": round(req.ending_value - req.beginning_value, 2),
        "absolute_return": round(abs_return, 2),
        "user_sub": current_user.sub
    }


# Tax & Salary Endpoints
@app.post("/calculate/salary")
async def calculate_salary(req: SalaryRequest, current_user: User = Depends(get_current_user)):
    hours = req.hours_per_week or 40.0
    weeks = req.weeks_per_year or 52.0
    freq = req.frequency.lower()
    
    annual = req.gross_amount
    if freq == "monthly": annual = req.gross_amount * 12
    elif freq == "semi-monthly": annual = req.gross_amount * 24
    elif freq == "bi-weekly": annual = req.gross_amount * 26
    elif freq == "weekly": annual = req.gross_amount * weeks
    elif freq == "hourly": annual = req.gross_amount * hours * weeks

    return {
        "annual": round(annual, 2),
        "monthly": round(annual / 12, 2),
        "semi_monthly": round(annual / 24, 2),
        "bi_weekly": round(annual / 26, 2),
        "weekly": round(annual / weeks, 2),
        "daily": round(annual / (weeks * 5), 2),
        "hourly": round(annual / (weeks * hours), 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/income-tax")
async def calculate_income_tax(req: IncomeTaxRequest, current_user: User = Depends(get_current_user)):
    taxable = max(0.0, req.gross_income - (req.deductions or 0.0))
    tax = 0.0
    if taxable <= 300000:
        tax = 0.0
    elif taxable <= 700000:
        tax = 0.0  # Rebate up to 7L
    else:
        tax += 400000 * 0.05
        if taxable <= 1000000:
            tax += (taxable - 700000) * 0.10
        else:
            tax += 300000 * 0.10
            if taxable <= 1200000:
                tax += (taxable - 1000000) * 0.15
            else:
                tax += 200000 * 0.15
                if taxable <= 1500000:
                    tax += (taxable - 1200000) * 0.20
                else:
                    tax += 300000 * 0.20
                    tax += (taxable - 1500000) * 0.30
    cess = tax * 0.04
    tot_tax = tax + cess
    return {
        "gross_income": round(req.gross_income, 2),
        "taxable_income": round(taxable, 2),
        "base_tax": round(tax, 2),
        "cess": round(cess, 2),
        "total_tax": round(tot_tax, 2),
        "effective_rate": round((tot_tax / req.gross_income) * 100, 2) if req.gross_income > 0 else 0,
        "take_home_annual": round(req.gross_income - tot_tax, 2),
        "take_home_monthly": round((req.gross_income - tot_tax) / 12, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/hourly-to-salary")
async def calculate_hourly_to_salary(req: HourlyToSalaryRequest, current_user: User = Depends(get_current_user)):
    regular = req.hourly_wage * req.hours_per_week
    overtime = req.overtime_hours * (req.hourly_wage * req.overtime_multiplier)
    weekly = regular + overtime
    annual = weekly * req.paid_weeks
    return {
        "hourly_wage": round(req.hourly_wage, 2),
        "regular_weekly": round(regular, 2),
        "overtime_weekly": round(overtime, 2),
        "total_weekly": round(weekly, 2),
        "annual_salary": round(annual, 2),
        "monthly_salary": round(annual / 12, 2),
        "bi_weekly_salary": round(annual / 26, 2),
        "user_sub": current_user.sub
    }


@app.post("/calculate/budget")
async def calculate_budget(req: BudgetRequest, current_user: User = Depends(get_current_user)):
    needs = req.needs_amount
    wants = req.wants_amount
    savings = req.savings_amount
    total_spent = needs + wants + savings
    return {
        "monthly_income": round(req.monthly_income, 2),
        "needs": round(needs, 2),
        "wants": round(wants, 2),
        "savings": round(savings, 2),
        "total_spent": round(total_spent, 2),
        "remaining": round(req.monthly_income - total_spent, 2),
        "needs_percent": round((needs / req.monthly_income) * 100, 1) if req.monthly_income > 0 else 0,
        "wants_percent": round((wants / req.monthly_income) * 100, 1) if req.monthly_income > 0 else 0,
        "savings_percent": round((savings / req.monthly_income) * 100, 1) if req.monthly_income > 0 else 0,
        "user_sub": current_user.sub
    }


# Health & Fitness Endpoints
@app.post("/calculate/calorie")
async def calculate_calorie(req: CalorieRequest, current_user: User = Depends(get_current_user)):
    bmr = 10 * req.weight + 6.25 * req.height - 5 * req.age
    if req.gender.lower() == "female":
        bmr -= 161
    else:
        bmr += 5
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    mult = multipliers.get(req.activity_level.lower(), 1.55)
    maintenance = round(bmr * mult)
    return {
        "bmr": round(bmr),
        "maintenance_calories": maintenance,
        "mild_weight_loss": maintenance - 250,
        "weight_loss": maintenance - 500,
        "mild_weight_gain": maintenance + 250,
        "weight_gain": maintenance + 500,
        "user_sub": current_user.sub
    }


@app.post("/calculate/ideal-weight")
async def calculate_ideal_weight(req: IdealWeightRequest, current_user: User = Depends(get_current_user)):
    inches = max(0.0, (req.height / 2.54) - 60)
    devine = 45.5 + 2.3 * inches if req.gender.lower() == "female" else 50.0 + 2.3 * inches
    hm = req.height / 100
    min_bmi_wt = 18.5 * (hm ** 2)
    max_bmi_wt = 24.9 * (hm ** 2)
    return {
        "height_cm": round(req.height, 1),
        "ideal_weight_kg": round(devine, 1),
        "min_healthy_weight_kg": round(min_bmi_wt, 1),
        "max_healthy_weight_kg": round(max_bmi_wt, 1),
        "user_sub": current_user.sub
    }


@app.post("/calculate/body-fat")
async def calculate_body_fat(req: BodyFatRequest, current_user: User = Depends(get_current_user)):
    import math
    if req.gender.lower() == "female":
        val = req.waist + req.hip - req.neck
        bf = 495 / (1.29579 - 0.35004 * math.log10(val) + 0.22100 * math.log10(req.height)) - 450 if (val > 0 and req.height > 0) else 0
    else:
        val = req.waist - req.neck
        bf = 495 / (1.0324 - 0.19077 * math.log10(val) + 0.15456 * math.log10(req.height)) - 450 if (val > 0 and req.height > 0) else 0
    bf = max(2.0, min(65.0, bf))
    return {
        "body_fat_percentage": round(bf, 1),
        "lean_mass_percentage": round(100.0 - bf, 1),
        "user_sub": current_user.sub
    }


@app.post("/calculate/pregnancy-due-date")
async def calculate_pregnancy_due_date(req: PregnancyDueDateRequest, current_user: User = Depends(get_current_user)):
    from datetime import datetime, timedelta
    try:
        lmp = datetime.strptime(req.lmp_date, "%Y-%m-%d")
        due_date = lmp + timedelta(days=280)
        today = datetime.now()
        diff = (today - lmp).days
        weeks = max(0, diff // 7)
        days = max(0, diff % 7)
        rem = max(0, 280 - diff)
        return {
            "due_date": due_date.strftime("%Y-%m-%d"),
            "current_gestation": f"{weeks} weeks, {days} days",
            "days_remaining": rem,
            "user_sub": current_user.sub
        }
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")


@app.post("/calculate/water-intake")
async def calculate_water_intake(req: WaterIntakeRequest, current_user: User = Depends(get_current_user)):
    base_ml = req.weight * 35
    act_ml = (req.activity_minutes / 30) * 350
    tot_ml = base_ml + act_ml
    return {
        "liters_per_day": round(tot_ml / 1000, 2),
        "milliliters_per_day": round(tot_ml),
        "glasses_per_day": round(tot_ml / 250),
        "user_sub": current_user.sub
    }


@app.post("/calculate/sleep")
async def calculate_sleep(req: SleepRequest, current_user: User = Depends(get_current_user)):
    from datetime import datetime, timedelta
    try:
        t = datetime.strptime(req.target_time, "%H:%M")
        suggestions = []
        for cycles in [6, 5, 4, 3]:
            mins = cycles * 90 + 15
            calc_t = (t - timedelta(minutes=mins)) if req.mode == "wake" else (t + timedelta(minutes=mins))
            suggestions.append({
                "cycles": cycles,
                "hours": cycles * 1.5,
                "time": calc_t.strftime("%I:%M %p"),
                "is_recommended": cycles == 5
            })
        return {
            "target_time": req.target_time,
            "mode": req.mode,
            "suggestions": suggestions,
            "user_sub": current_user.sub
        }
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM")


@app.post("/calculate/target-heart-rate")
async def calculate_target_heart_rate(req: TargetHeartRateRequest, current_user: User = Depends(get_current_user)):
    mhr = 220 - req.age
    hrr = max(0.0, mhr - req.resting_heart_rate)
    return {
        "max_heart_rate": round(mhr),
        "resting_heart_rate": round(req.resting_heart_rate),
        "fat_burn_zone": f"{round(req.resting_heart_rate + hrr * 0.60)} - {round(req.resting_heart_rate + hrr * 0.70)} bpm",
        "cardio_zone": f"{round(req.resting_heart_rate + hrr * 0.70)} - {round(req.resting_heart_rate + hrr * 0.80)} bpm",
        "peak_zone": f"{round(req.resting_heart_rate + hrr * 0.80)} - {round(mhr)} bpm",
        "user_sub": current_user.sub
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


