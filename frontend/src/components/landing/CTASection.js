import React from 'react';
import { ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';

function CTASection({ onExplore, onGoToDashboard }) {
  return (
    <section className="final-cta-section" id="cta-banner">
      {/* Background ambient lighting orbs */}
      <div className="cta-ambient-glow cta-glow-left" />
      <div className="cta-ambient-glow cta-glow-right" />

      <div className="section-container">
        <div className="final-cta-card">
          <div className="cta-badge-pill">
            <Sparkles size={14} className="text-lavender" />
            <span>START CALCULATING TODAY</span>
          </div>

          <h2 className="cta-headline">
            Make Every Calculation Effortless.
          </h2>

          <p className="cta-subtext">
            Your everyday calculators are just one click away. Experience fast, clean, and reliable utility in a single suite.
          </p>

          <div className="cta-actions-row">
            <button
              type="button"
              className="btn-cta-primary"
              onClick={onExplore}
            >
              <span>Explore Calculator Suite</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn-cta-secondary"
              onClick={onGoToDashboard}
            >
              <LayoutDashboard size={18} />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
