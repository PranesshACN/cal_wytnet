import React from 'react';
import HeroPhoneShowcase from './HeroPhoneShowcase';

function HeroSection({ onExploreCalculators, onOpenDashboard }) {
  return (
    <section className="trovix-hero-section" id="hero">
      <div className="trovix-hero-container">
        {/* Top Centered Pill Badge */}
        <div className="trovix-badge-pill" role="button" tabIndex={0} onClick={onExploreCalculators}>
          <span className="trovix-pill-icon">✦</span>
          <span className="trovix-pill-text">All finance & calculations in one place</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="trovix-main-headline">
          Unlock calculation<br />
          clarity with Calculator Suite
        </h1>

        {/* Subtitle Copy */}
        <p className="trovix-sub-headline">
          Empower your everyday decisions with automated calculations, accurate tax forecasting,
          and wellness insights that scale with your life.
        </p>

        {/* Action Buttons */}
        <div className="trovix-hero-cta-group">
          <button
            type="button"
            className="btn-trovix-primary"
            onClick={onExploreCalculators}
          >
            <span>Get Started</span>
            <span className="btn-double-arrow">»</span>
          </button>

          <button
            type="button"
            className="btn-trovix-secondary"
            onClick={onOpenDashboard}
          >
            <span>Try Demo</span>
          </button>
        </div>

        {/* The Realistic Center Phone Showcase with Floating Cards */}
        <div className="trovix-showcase-mount">
          <HeroPhoneShowcase />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
