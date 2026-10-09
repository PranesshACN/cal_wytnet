import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';
import LandingPage from './components/landing/LandingPage';
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

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
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
