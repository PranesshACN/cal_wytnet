import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowUpRight } from 'lucide-react';

function Footer({ token }) {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="landing-footer">
      <div className="section-container">
        <div className="footer-top-grid">
          {/* Brand Info Column */}
          <div className="footer-brand-col">
            <div className="footer-brand-logo">
              <div className="logo-icon-box small">
                <Calculator className="brand-icon" size={18} />
              </div>
              <span className="brand-accent">Kalzy</span>
            </div>
            <p className="footer-brand-desc">
              A modern fintech calculation platform engineered for speed, mathematical rigor, and effortless everyday clarity.
            </p>
            <div className="footer-status-tag">
              <span className="footer-dot-green" />
              <span>All 4 Calculator Engines Operational</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => scrollToSection('hero')}>
                  Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('calculators')}>
                  Calculators
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('interactive-preview')}>
                  Interactive Preview
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('features')}>
                  Features
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('how-it-works')}>
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Calculators Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Calculators</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => scrollToSection('interactive-preview')}>
                  BMI Calculator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('interactive-preview')}>
                  Age Calculator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('interactive-preview')}>
                  GST Calculator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('interactive-preview')}>
                  EB Bill Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Account & App Access */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Platform Access</h4>
            <ul className="footer-links-list">
              {token ? (
                <li>
                  <Link to="/dashboard" className="footer-external-link">
                    <span>Open Dashboard</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="footer-external-link">
                      <span>Sign In</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="footer-external-link">
                      <span>Create Account</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="footer-external-link">
                      <span>Full Dashboard</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {currentYear} Kalzy . All rights reserved. Crafted with precision and clarity.
          </p>
          <div className="footer-badges">
            <span className="badge-build">FastAPI + React 18</span>
            <span className="badge-build">WytPass SSO Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
