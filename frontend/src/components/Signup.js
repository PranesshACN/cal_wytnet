import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, login, wytpassLoginUrl } from '../api';
import { Shield, Lock, Mail, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';

function Signup({ setToken }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      // Register centrally with WytNet
      await signup(name, email, password, phone || null);

      // Attempt automatic login
      try {
        const loginData = await login(email, password);
        setToken(loginData.access_token);
        navigate('/dashboard');
      } catch (loginErr) {
        // If auto-login fails, redirect to login page with notice
        navigate('/login?message=Registration successful! Please sign in with your credentials.');
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many requests. Please try again in a few minutes.');
      } else {
        setError(err.response?.data?.detail || 'Registration failed. Please check your details.');
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
        <h2>Create an Account</h2>
        <p className="auth-subtitle">Register your centralized profile powered by WytPass</p>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* FLOW B: Continue with WytPass */}
      <button
        type="button"
        onClick={handleWytPassLogin}
        className="btn btn-wytpass"
        disabled={ssoLoading || loading}
        id="signup-continue-with-wytpass-btn"
      >
        <span className="wytpass-brand-icon">✦</span>
        <span>{ssoLoading ? 'Redirecting to WytPass...' : 'Continue with WytPass'}</span>
      </button>

      <div className="divider">
        <span>OR REGISTER WITH EMAIL</span>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="signup-name">Full Name</label>
          <div className="input-wrapper">
            <User size={16} className="input-icon" />
            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Alexander Wright"
              autoComplete="name"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="signup-email">Email Address</label>
          <div className="input-wrapper">
            <Mail size={16} className="input-icon" />
            <input
              id="signup-email"
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
          <label htmlFor="signup-phone">Phone Number (Optional)</label>
          <div className="input-wrapper">
            <Phone size={16} className="input-icon" />
            <input
              id="signup-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon" />
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <div className="input-wrapper">
            <Lock size={16} className="input-icon" />
            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter password"
              autoComplete="new-password"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading || ssoLoading}>
          <span>{loading ? 'Creating Centralized Account...' : 'Create Account'}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="auth-switch">
        <span>Already have an account? </span>
        <Link to="/login">Sign In</Link>
      </div>

      <div className="auth-footer-note">
        <Shield size={12} />
        <span>Credentials encrypted & managed centrally by WytNet</span>
      </div>
    </div>
  );
}

export default Signup;
