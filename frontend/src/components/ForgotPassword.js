import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api';
import { Shield, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      setSuccess(true);
      setMessage(res.message || 'Password reset link sent to your registered email address.');
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many reset attempts. Please wait a few minutes before trying again.');
      } else {
        setError(err.response?.data?.detail || 'Failed to request password reset. Please verify your email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-badge">
          <Shield size={14} className="badge-icon" />
          <span>WytNet Identity Recovery</span>
        </div>
        <h2>Reset Password</h2>
        <p className="auth-subtitle">
          Enter your email and WytNet will send instructions to securely recover your account.
        </p>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="auth-success-state">
          <div className="success-icon-box">
            <CheckCircle2 size={40} className="success-icon" />
          </div>
          <h3>Check your inbox</h3>
          <p className="success-desc">
            {message}
          </p>
          <div className="auth-action-stack">
            <Link to="/reset-password" className="btn btn-primary">
              <span>Enter Reset Token</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-secondary">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="forgot-email">Registered Email Address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <span>{loading ? 'Requesting Reset...' : 'Send Reset Instructions'}</span>
            <ArrowRight size={16} />
          </button>

          <div className="auth-switch">
            <Link to="/login" className="back-link">
              <ArrowLeft size={14} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}

      <div className="auth-footer-note">
        <Shield size={12} />
        <span>Centralized credential recovery delegated to WytPass</span>
      </div>
    </div>
  );
}

export default ForgotPassword;
