import React from 'react';
import { Zap, Sparkles, ShieldCheck, Smartphone } from 'lucide-react';

function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'See calculated results immediately after entering valid values with zero latency and smooth reactivity.',
    },
    {
      icon: Sparkles,
      title: 'Simple by Design',
      description: 'Enjoy clear inputs, understandable outputs, and minimal friction crafted specifically for everyday utility.',
    },
    {
      icon: ShieldCheck,
      title: 'Reliable Logic',
      description: 'Use consistent mathematical formulas and standard tax & health parameters verified for mathematical accuracy.',
    },
    {
      icon: Smartphone,
      title: 'Ready Anywhere',
      description: 'Access the suite effortlessly from desktop, tablet, or mobile with responsive layouts and touch-friendly controls.',
    },
  ];

  return (
    <section className="features-section" id="features">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-centered">
          <span className="section-tag-pill">PRODUCT EXCELLENCE</span>
          <h2 className="section-main-heading">Designed for Everyday Clarity.</h2>
          <p className="section-sub-copy">
            A refined toolkit built with focus on speed, accessibility, and uncompromised precision.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-grid">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="feature-item-card">
                <div className="feature-icon-bubble">
                  <Icon size={24} className="feature-icon" />
                </div>
                <h3 className="feature-item-title">{feat.title}</h3>
                <p className="feature-item-desc">{feat.description}</p>
                <div className="feature-card-accent-line" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
