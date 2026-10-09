import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// WytPass Public Client Configuration (Safe for Frontend/SPA)
export const WYTPASS_CONFIG = {
  clientId: process.env.REACT_APP_WYTPASS_CLIENT_ID || 'wn_live_33b5d58dcf12f3e395272e8a07c97b8e',
  authUrl: process.env.REACT_APP_WYTPASS_AUTH_URL || 'https://wytnet.com/oauth/authorize',
  redirectUri: process.env.REACT_APP_WYTPASS_REDIRECT_URI || `${window.location.origin}/api/auth/callback/whitenet`,
  scopes: 'openid profile email',
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HttpOnly session cookies
});

// Attach Authorization Bearer token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper: Generate Cryptographically Secure Random String
const generateRandomString = (length = 64) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('');
};

// Helper: Base64URL encode buffer
const base64UrlEncode = (buffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// FLOW A: Direct Email + Password Authentication (Delegated to WytNet backend)
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

// User Registration: Forwarded to WytNet Auth Layer
export const signup = async (name, email, password, phone = null) => {
  const payload = { name, email, password };
  if (phone) payload.phone = phone;
  const response = await api.post('/api/auth/register', payload);
  return response.data;
};

// Password Recovery: Forgot Password
export const forgotPassword = async (email) => {
  const response = await api.post('/api/auth/forgot-password', { email });
  return response.data;
};

// Password Recovery: Reset Password
export const resetPassword = async (token, newPassword, confirmPassword) => {
  const response = await api.post('/api/auth/reset-password', {
    token,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });
  return response.data;
};

// Current Authenticated User (Profile from WytNet)
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

// FLOW B: "Continue with WytPass" - OAuth 2.0 / OIDC + PKCE
export const wytpassLoginUrl = async () => {
  // 1. Generate cryptographic code_verifier
  const verifier = generateRandomString(48);
  sessionStorage.setItem('pkce_verifier', verifier);

  // 2. Generate random state for CSRF protection
  const state = generateRandomString(24);
  sessionStorage.setItem('oauth_state', state);

  // 3. Compute code_challenge = BASE64URL(SHA256(code_verifier))
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  const challenge = base64UrlEncode(hash);

  // 4. Construct Authorization URL
  const params = new URLSearchParams({
    client_id: WYTPASS_CONFIG.clientId,
    redirect_uri: WYTPASS_CONFIG.redirectUri,
    response_type: 'code',
    scope: WYTPASS_CONFIG.scopes,
    state: state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });

  return `${WYTPASS_CONFIG.authUrl}?${params.toString()}`;
};

// FLOW B: Exchange Authorization Code via Backend Proxy
export const exchangeWytpassToken = async (code, verifier) => {
  const response = await api.post('/api/auth/wytpass/token', {
    code,
    code_verifier: verifier,
    redirect_uri: WYTPASS_CONFIG.redirectUri,
  });
  return response.data;
};

// Logout / Revoke Token
export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (err) {
    console.warn('Logout request warning:', err);
  } finally {
    localStorage.removeItem('token');
    sessionStorage.removeItem('pkce_verifier');
    sessionStorage.removeItem('oauth_state');
  }
};

// Calculator Endpoints
export const calculateBMI = async (weight, height) => {
  const response = await api.post('/calculate/bmi', { weight, height });
  return response.data;
};

export const calculateAge = async (birth_date) => {
  const response = await api.post('/calculate/age', { birth_date });
  return response.data;
};

export const calculateGST = async (amount, gst_rate) => {
  const response = await api.post('/calculate/gst', { amount, gst_rate });
  return response.data;
};

export const calculateEBBill = async (units, rate_per_unit) => {
  const response = await api.post('/calculate/eb-bill', { units, rate_per_unit });
  return response.data;
};

export default api;
