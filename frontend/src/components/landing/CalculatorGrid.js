import React from 'react';
import { Activity, CalendarDays, Receipt, Zap } from 'lucide-react';
import CalculatorCard from './CalculatorCard';

function CalculatorGrid({ onSelectCalculator }) {
  const calculators = [
    {
      id: 'bmi',
      icon: Activity,
      category: 'HEALTH & WELLNESS',
      title: 'BMI Calculator',
      description: 'Understand your body mass index and explore your weight category with precision.',
      accentClass: 'accent-blue-teal',
      ctaText: 'Calculate BMI →',
      previewContent: (
        <div className="mini-preview-bmi">
          <div className="bmi-mini-tags">
            <span className="bmi-pill-under">Under</span>
            <span className="bmi-pill-norm active-pill">Normal</span>
            <span className="bmi-pill-over">Over</span>
            <span className="bmi-pill-obese">Obese</span>
          </div>
          <div className="bmi-mini-bar">
            <div className="bmi-bar-segment bar-blue" />
            <div className="bmi-bar-segment bar-emerald" />
            <div className="bmi-bar-segment bar-amber" />
            <div className="bmi-bar-segment bar-rose" />
            <div className="bmi-pointer-dot" />
          </div>
          <div className="bmi-metric-text">Healthy BMI: 18.5 – 24.9</div>
        </div>
      ),
    },
    {
      id: 'age',
      icon: CalendarDays,
      category: 'DATE & TIME',
      title: 'Age Calculator',
      description: 'Discover your exact age in years, months, and days with birthday countdowns.',
      accentClass: 'accent-violet-lavender',
      ctaText: 'Calculate Age →',
      previewContent: (
        <div className="mini-preview-age">
          <div className="age-dob-chip">
            <span className="dob-label">DOB</span>
            <span className="dob-val">15 Aug 1998</span>
          </div>
          <div className="age-results-summary">
            <div className="age-metric-badge">
              <span className="age-val">28</span>
              <span className="age-unit">Years</span>
            </div>
            <div className="age-metric-badge">
              <span className="age-val">1</span>
              <span className="age-unit">Mo</span>
            </div>
            <div className="age-metric-badge">
              <span className="age-val">24</span>
              <span className="age-unit">Days</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'gst',
      icon: Receipt,
      category: 'FINANCE & TAX',
      title: 'GST Calculator',
      description: 'Calculate inclusive or exclusive GST with flexible tax rates and CGST/SGST splits.',
      accentClass: 'accent-indigo-blue',
      ctaText: 'Calculate GST →',
      previewContent: (
        <div className="mini-preview-gst">
          <div className="gst-mini-row">
            <span>Base Price</span>
            <span className="font-mono">₹1,000.00</span>
          </div>
          <div className="gst-mini-row text-violet">
            <span>GST (18%)</span>
            <span className="font-mono">+ ₹180.00</span>
          </div>
          <div className="gst-mini-divider" />
          <div className="gst-mini-row font-semibold">
            <span>Total Payable</span>
            <span className="font-mono text-emerald">₹1,180.00</span>
          </div>
        </div>
      ),
    },
    {
      id: 'eb',
      icon: Zap,
      category: 'UTILITIES',
      title: 'EB Bill Calculator',
      description: 'Estimate electricity charges using configurable rates and consumption slabs.',
      accentClass: 'accent-amber-violet',
      ctaText: 'Calculate Bill →',
      previewContent: (
        <div className="mini-preview-eb">
          <div className="eb-meter-header">
            <span>Meter: 150 kWh</span>
            <span className="eb-rate-badge">₹6.50/unit</span>
          </div>
          <div className="eb-meter-track">
            <div className="eb-meter-fill" style={{ width: '45%' }} />
          </div>
          <div className="eb-meter-result">
            <span>Energy + 5% Fixed:</span>
            <span className="eb-est-cost">₹1,023.75</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="calculator-collection-section" id="calculators">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header-centered">
          <span className="section-tag-pill">THE TOOLKIT</span>
          <h2 className="section-main-heading">One Suite. Four Smart Tools.</h2>
          <p className="section-sub-copy">
            Everything you need for everyday calculations, thoughtfully designed in one place.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="calculator-cards-grid">
          {calculators.map((calc) => (
            <CalculatorCard
              key={calc.id}
              icon={calc.icon}
              category={calc.category}
              title={calc.title}
              description={calc.description}
              accentClass={calc.accentClass}
              ctaText={calc.ctaText}
              previewContent={calc.previewContent}
              onClick={() => onSelectCalculator(calc.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CalculatorGrid;
