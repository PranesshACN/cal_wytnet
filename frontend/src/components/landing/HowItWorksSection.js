import React from 'react';
import { MousePointerClick, SlidersHorizontal, CheckCheck } from 'lucide-react';

function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      icon: MousePointerClick,
      title: 'Choose Your Tool',
      description: 'Select the calculator you need for wellness metrics, age countdown, GST tax, or utility bills.',
    },
    {
      num: '02',
      icon: SlidersHorizontal,
      title: 'Enter Your Details',
      description: 'Provide relevant values with guided input helpers, real-time validations, and adaptive presets.',
    },
    {
      num: '03',
      icon: CheckCheck,
      title: 'Get Your Result',
      description: 'View the calculation instantly with comprehensive breakdowns, visual charts, and actionable insights.',
    },
  ];

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-centered">
          <span className="section-tag-pill">SEAMLESS WORKFLOW</span>
          <h2 className="section-main-heading">Simple Steps. Instant Answers.</h2>
          <p className="section-sub-copy">
            Designed to get you the numbers you need without complicated setup or unnecessary steps.
          </p>
        </div>

        {/* Steps Horizontal Row */}
        <div className="how-steps-timeline">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="timeline-step-card">
                <div className="step-top-row">
                  <div className="step-badge-number">{step.num}</div>
                  <div className="step-icon-wrap">
                    <Icon size={20} className="step-lucide-icon" />
                  </div>
                </div>

                <h3 className="step-card-title">{step.title}</h3>
                <p className="step-card-desc">{step.description}</p>

                {/* Connecting Line (hidden on last step) */}
                {index < steps.length - 1 && (
                  <div className="step-connector-desktop" aria-hidden="true">
                    <div className="connector-dot" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
