import os
from unittest.mock import patch, AsyncMock
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)

import pytest
from fastapi.testclient import TestClient
from main import app, wytnet_client

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
    assert "redirect_uri" in data
    assert "openid" in data["scopes"]

@patch.object(wytnet_client, "direct_authenticate", new_callable=AsyncMock)
def test_direct_login_flow_a(mock_auth):
    mock_auth.return_value = {
        "access_token": "mock_token_123",
        "refresh_token": "mock_refresh_123",
        "user": {
            "sub": "wn_usr_1111-2222-3333",
            "email": "architect@example.com",
            "name": "Architect"
        }
    }
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
    assert "access_token" in response.cookies

@patch.object(wytnet_client, "register", new_callable=AsyncMock)
def test_registration(mock_reg):
    mock_reg.return_value = {
        "status": "success",
        "user": {
            "sub": "wn_usr_jane_doe",
            "email": "jane@example.com",
            "name": "Jane Doe"
        }
    }
    response = client.post("/api/auth/register", json={
        "name": "Jane Doe",
        "email": "jane@example.com",
        "password": "Password987!",
        "phone": "+1234567890"
    })
    assert response.status_code in (200, 201)

@patch.object(wytnet_client, "forgot_password", new_callable=AsyncMock)
@patch.object(wytnet_client, "reset_password", new_callable=AsyncMock)
def test_forgot_password_and_reset(mock_reset, mock_forgot):
    mock_forgot.return_value = {"message": "Reset instructions sent", "status": "success"}
    mock_reset.return_value = {"message": "Password reset successful", "status": "success"}

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

@patch.object(wytnet_client, "exchange_code", new_callable=AsyncMock)
def test_sso_code_exchange_flow_b(mock_exchange):
    mock_exchange.return_value = {
        "access_token": "mock_sso_token_456",
        "refresh_token": "mock_sso_refresh_456",
        "user": {
            "sub": "wn_usr_sso_test",
            "email": "sso@example.com",
            "name": "SSO Test User"
        }
    }
    response = client.post("/api/auth/wytpass/token", json={
        "code": "test_auth_code_xyz",
        "code_verifier": "test_verifier_abcdef12345678901234567890",
        "redirect_uri": "http://localhost:3000/api/auth/callback/whitenet"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["sub"].startswith("wn_usr_")

@patch.object(wytnet_client, "direct_authenticate", new_callable=AsyncMock)
@patch.object(wytnet_client, "verify_token", new_callable=AsyncMock)
@patch.object(wytnet_client, "revoke_token", new_callable=AsyncMock)
def test_protected_endpoints_and_calculator(mock_revoke, mock_verify, mock_auth):
    mock_auth.return_value = {
        "access_token": "calc_token",
        "user": {
            "sub": "wn_usr_calculator_user",
            "email": "testcalculator@example.com",
            "name": "Calc User"
        }
    }
    mock_verify.return_value = {
        "sub": "wn_usr_calculator_user",
        "email": "testcalculator@example.com",
        "name": "Calc User"
    }
    mock_revoke.return_value = True

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
