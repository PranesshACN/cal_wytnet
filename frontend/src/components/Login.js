import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, wytpassLoginUrl } from '../api';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const successMessage = queryParams.get('message');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      setToken(data.access_token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWytPassLogin = async () => {
    try {
      setSsoLoading(true);
      setError('');
      const url = await wytpassLoginUrl();
      window.location.href = url;
    } catch (err) {
      console.error('Failed to initiate WytPass OAuth flow:', err);
      setError('Could not connect to WytPass identity provider.');
      setSsoLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-badge">
          <Shield size={14} className="badge-icon" />
          <span>WytNet Centralized Identity</span>
        </div>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account or authenticate via WytPass IdP</p>
      </div>

      {successMessage && (
        <div className="success-message">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* FLOW B: Continue with WytPass (Prominent Single Sign-On) */}
      <button
        type="button"
        onClick={handleWytPassLogin}
        className="btn btn-wytpass"
        disabled={ssoLoading || loading}
        id="continue-with-wytpass-btn"
      >
        <span className="wytpass-brand-icon">✦</span>
        <span>{ssoLoading ? 'Redirecting to WytPass...' : 'Continue with WytPass'}</span>
      </button>

      <div className="divider">
        <span>OR SIGN IN WITH EMAIL</span>
      </div>

      {/* FLOW A: Direct Email + Password Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={16} className="input-icon" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="login-password">Password</label>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon" />
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading || ssoLoading}>
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="auth-switch">
        <span>Don't have an account? </span>
        <Link to="/signup">Create an account</Link>
      </div>

      <div className="auth-footer-note">
        <Shield size={12} />
        <span>Secured by WytNet Identity Layer • RS256 / PKCE OIDC</span>
      </div>
    </div>
  );
}

export default Login;
