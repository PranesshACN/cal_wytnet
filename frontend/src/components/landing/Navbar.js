import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, ArrowRight } from 'lucide-react';

function Navbar({ token }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`landing-nav-wrapper ${scrolled ? 'nav-scrolled' : ''}`}>
      <nav className="landing-nav" aria-label="Main Navigation">
        {/* Brand Logo (Trovix Style) */}
        <Link to="/" className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="logo-sparkle-mark">✦</span>
          <span className="brand-title">Kal<span className="brand-accent">zy</span></span>
        </Link>

        {/* Center Nav Links */}
        <div className="nav-links desktop-only">
          <button type="button" className="nav-link-btn" onClick={() => scrollToSection('hero')}>
            Home
          </button>
          <button type="button" className="nav-link-btn" onClick={() => scrollToSection('calculators')}>
            Calculators
          </button>
          <button type="button" className="nav-link-btn" onClick={() => scrollToSection('features')}>
            Features
          </button>
          <button type="button" className="nav-link-btn" onClick={() => scrollToSection('how-it-works')}>
            How It Works
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="nav-actions desktop-only">
          {token ? (
            <button 
              type="button" 
              className="btn-trovix-nav-login"
              onClick={() => navigate('/dashboard')}
            >
              <span>Dashboard</span>
            </button>
          ) : (
            <Link to="/login" className="btn-trovix-nav-login">
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button 
          type="button" 
          className="mobile-toggle-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('hero')}>
              Home
            </button>
            <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('calculators')}>
              Calculators
            </button>
            <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('features')}>
              Features
            </button>
            <button type="button" className="mobile-nav-link" onClick={() => scrollToSection('how-it-works')}>
              How It Works
            </button>
          </div>
          <div className="mobile-nav-actions">
            {token ? (
              <button 
                type="button" 
                className="btn-dashboard-nav full-width"
                onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
              >
                <LayoutDashboard size={16} />
                <span>Open Dashboard</span>
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn-signin-nav full-width text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <button 
                  type="button" 
                  className="btn-dashboard-nav full-width"
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                >
                  <span>Open Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
