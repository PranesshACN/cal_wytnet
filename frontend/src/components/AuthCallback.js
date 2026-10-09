import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { exchangeWytpassToken } from '../api';
import { Shield, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

function AuthCallback({ setToken }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Verifying authorization with WytPass...');
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    const existingToken = localStorage.getItem('token');
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      setError(errorDescription || `WytPass authentication error: ${errorParam}`);
      return;
    }

    if (!code) {
      if (existingToken) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
      return;
    }

    // Guard against React 18 StrictMode double-invocation
    if (hasExecutedRef.current) return;
    hasExecutedRef.current = true;

    const handleCallback = async () => {
      try {
        // 1. Verify CSRF State
        const savedState = sessionStorage.getItem('oauth_state') || localStorage.getItem('oauth_state');
        if (savedState && state && savedState !== state) {
          throw new Error('State mismatch detected. Potential CSRF security violation.');
        }

        // 2. Retrieve cryptographic PKCE verifier
        const verifier = sessionStorage.getItem('pkce_verifier') || localStorage.getItem('pkce_verifier');
        if (!verifier) {
          if (existingToken) {
            navigate('/dashboard', { replace: true });
            return;
          }
          throw new Error('PKCE code verifier not found. Please click "Return to Login" to sign in again.');
        }

        setStatusMessage('Exchanging authorization code for secure session tokens...');

        // 3. Exchange authorization code with backend proxy
        const data = await exchangeWytpassToken(code, verifier);

        // 4. Cleanup temporary storage
        sessionStorage.removeItem('pkce_verifier');
        sessionStorage.removeItem('oauth_state');
        localStorage.removeItem('pkce_verifier');
        localStorage.removeItem('oauth_state');

        if (data?.access_token) {
          setToken(data.access_token);
          localStorage.setItem('token', data.access_token);
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('WytPass Callback Error:', err);
        // If a valid token is present from a concurrent exchange, navigate gracefully
        if (localStorage.getItem('token')) {
          navigate('/dashboard', { replace: true });
          return;
        }
        const detail = err.response?.data?.detail || err.message || 'Failed to complete WytPass authentication.';
        setError(detail);
      }
    };

    handleCallback();
  }, [searchParams, setToken, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-badge">
          <Shield size={14} className="badge-icon" />
          <span>WytPass Single Sign-On</span>
        </div>
        <h2>{error ? 'Authentication Failed' : 'Completing Sign-In'}</h2>
      </div>

      {error ? (
        <div className="callback-error-wrapper">
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <p className="callback-error-note">
            Could not verify your token with the centralized identity server.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
            <ArrowLeft size={16} />
            <span>Return to Login</span>
          </Link>
        </div>
      ) : (
        <div className="callback-loading-wrapper">
          <Loader2 size={36} className="spinner" />
          <p className="loading-text">{statusMessage}</p>
          <span className="subtext">Validating cryptographic RS256 / PKCE token exchange</span>
        </div>
      )}

      <div className="auth-footer-note">
        <Shield size={12} />
        <span>Centralized OIDC authorization via WytNet IdP</span>
      </div>
    </div>
  );
}

export default AuthCallback;
