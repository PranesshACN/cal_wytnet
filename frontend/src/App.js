import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';
import LandingPage from './components/landing/LandingPage';
import { logout } from './api';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogout = async () => {
    await logout();
    setToken(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<LandingPage token={token} />} 
          />
          <Route 
            path="/login" 
            element={!token ? (
              <div className="auth-page-container">
                <Login setToken={setToken} />
              </div>
            ) : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/signup" 
            element={!token ? (
              <div className="auth-page-container">
                <Signup setToken={setToken} />
              </div>
            ) : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/forgot-password" 
            element={!token ? (
              <div className="auth-page-container">
                <ForgotPassword />
              </div>
            ) : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/reset-password" 
            element={!token ? (
              <div className="auth-page-container">
                <ResetPassword />
              </div>
            ) : <Navigate to="/dashboard" />} 
          />
          {/* WytPass OIDC Redirect URI callbacks */}
          <Route 
            path="/api/auth/callback/whitenet" 
            element={
              <div className="auth-page-container">
                <AuthCallback setToken={setToken} />
              </div>
            } 
          />
          <Route 
            path="/callback" 
            element={
              <div className="auth-page-container">
                <AuthCallback setToken={setToken} />
              </div>
            } 
          />
          <Route 
            path="/dashboard" 
            element={token ? (
              <div className="dashboard-page-container">
                <Dashboard token={token} onLogout={handleLogout} />
              </div>
            ) : <Navigate to="/login" />} 
          />
          {/* Fallback to landing */}
          <Route 
            path="*" 
            element={<Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
