import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api';
import { Shield, KeyRound, Lock, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, newPassword, confirmPassword);
      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many attempts. Please wait a moment before trying again.');
      } else {
        setError(err.response?.data?.detail || 'Password reset failed. Token may be invalid or expired.');
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
          <span>WytNet Identity Security</span>
        </div>
        <h2>Create New Password</h2>
        <p className="auth-subtitle">
          Submit your reset token and define a new secure password for your centralized account.
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
          <h3>Password Updated</h3>
          <p className="success-desc">
            Your WytNet credentials have been updated securely. You can now log in with your new password.
          </p>
          <button
            onClick={() => navigate('/login?message=Password updated successfully!')}
            className="btn btn-primary"
          >
            <span>Proceed to Login</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reset-token">Reset Token</label>
            <div className="input-wrapper">
              <KeyRound size={16} className="input-icon" />
              <input
                id="reset-token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                placeholder="Enter reset token from email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reset-new-password">New Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="reset-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reset-confirm-password">Confirm New Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <span>{loading ? 'Updating Credentials...' : 'Set New Password'}</span>
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
        <span>Password verification processed centrally by WytNet</span>
      </div>
    </div>
  );
}

export default ResetPassword;
