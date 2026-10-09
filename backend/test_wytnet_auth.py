import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)
os.environ["WYTNET_DEV_FALLBACK_ON_503"] = "true"

import pytest
from fastapi.testclient import TestClient
import main
from main import app, get_db, User, SessionLocal

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "WytNet" in data["auth_provider"]

def test_auth_config():
    response = client.get("/api/auth/config")
    assert response.status_code == 200
    data = response.json()
    assert data["client_id"] == "wn_live_33b5d58dcf12f3e395272e8a07c97b8e"
    assert data["redirect_uri"] == "https://kalzy.vercel.app/api/auth/callback/whitenet"
    assert "openid" in data["scopes"]

def test_direct_login_flow_a():
    response = client.post("/api/auth/login", json={
        "email": "architect@example.com",
        "password": "SecurePassword123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "user" in data
    assert data["user"]["sub"].startswith("wn_usr_")
    assert data["user"]["email"] == "architect@example.com"
    # Verify cookie was set
    assert "access_token" in response.cookies

def test_registration():
    response = client.post("/api/auth/register", json={
        "name": "Jane Doe",
        "email": "jane@example.com",
        "password": "Password987!",
        "phone": "+1234567890"
    })
    assert response.status_code in (200, 201)

def test_forgot_password_and_reset():
    # Forgot password
    forgot_res = client.post("/api/auth/forgot-password", json={
        "email": "jane@example.com"
    })
    assert forgot_res.status_code == 200

    # Reset password
    reset_res = client.post("/api/auth/reset-password", json={
        "token": "dummy_reset_token",
        "new_password": "NewSecretPassword123!",
        "confirm_password": "NewSecretPassword123!"
    })
    assert reset_res.status_code == 200

def test_sso_code_exchange_flow_b():
    response = client.post("/api/auth/wytpass/token", json={
        "code": "test_auth_code_xyz",
        "code_verifier": "test_verifier_abcdef12345678901234567890",
        "redirect_uri": "https://kalzy.vercel.app/api/auth/callback/whitenet"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["sub"].startswith("wn_usr_")

def test_protected_endpoints_and_calculator():
    # Login first
    login_res = client.post("/api/auth/login", json={
        "email": "testcalculator@example.com",
        "password": "PassWord123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # /api/auth/me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "testcalculator@example.com"

    # BMI Calculator
    bmi_res = client.post("/calculate/bmi", json={"weight": 70, "height": 175}, headers=headers)
    assert bmi_res.status_code == 200
    assert bmi_res.json()["category"] == "Normal weight"
    assert bmi_res.json()["user_sub"].startswith("wn_usr_")

    # GST Calculator
    gst_res = client.post("/calculate/gst", json={"amount": 1000, "gst_rate": 18}, headers=headers)
    assert gst_res.status_code == 200
    assert gst_res.json()["gst_amount"] == 180.0

    # EB Bill Calculator
    eb_res = client.post("/calculate/eb-bill", json={"units": 200, "rate_per_unit": 7.5}, headers=headers)
    assert eb_res.status_code == 200
    assert eb_res.json()["energy_charges"] == 1500.0

    # Logout
    logout_res = client.post("/api/auth/logout", headers=headers)
    assert logout_res.status_code == 200
