import React from 'react';
import {
  TrendingUp,
  LineChart,
  BarChart3,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import './InvestmentSection.css';

export const INVESTMENT_CALCULATORS = [
  {
    id: 'compound-interest',
    title: 'Compound Interest Calculator',
    description: 'See how money grows with compounding',
    icon: TrendingUp,
    isPopular: true,
  },
  {
    id: 'sip',
    title: 'SIP Calculator',
    description: 'Calculate mutual fund SIP returns',
    icon: LineChart,
    isPopular: true,
  },
  {
    id: 'roi',
    title: 'ROI Calculator',
    description: 'Measure return on investment percentage',
    icon: BarChart3,
  },
  {
    id: 'fd',
    title: 'FD Calculator',
    description: 'Fixed deposit maturity amount and interest',
    icon: CreditCard,
  },
  {
    id: 'cagr',
    title: 'CAGR Calculator',
    description: 'Compound annual growth rate for any investment',
    icon: LineChart,
  },
];

function InvestmentSection({ onSelectCalculator }) {
  return (
    <section className="investment-section" id="investment-tools">
      <div className="investment-container">
        {/* Header Row */}
        <div className="investment-header-row">
          <div className="investment-title-group">
            <div className="investment-header-icon-box">
              <TrendingUp size={22} className="investment-header-icon" />
            </div>
            <div>
              <h2 className="investment-section-title">Investment</h2>
              <span className="investment-section-subtitle">5 calculators</span>
            </div>
          </div>

          <button
            type="button"
            className="investment-view-all-link"
            onClick={() => onSelectCalculator('compound-interest')}
          >
            <span>View all</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 5 Cards Grid */}
        <div className="investment-cards-grid">
          {INVESTMENT_CALCULATORS.map((calc) => {
            const IconComponent = calc.icon;
            return (
              <div
                key={calc.id}
                className="investment-card"
                onClick={() => onSelectCalculator(calc.id)}
              >
                {/* Top Row: Icon + Popular Badge */}
                <div className="investment-card-top">
                  <div className="investment-card-icon-wrap">
                    <IconComponent size={20} className="investment-card-icon" />
                  </div>
                  {calc.isPopular && (
                    <span className="investment-popular-pill">Popular</span>
                  )}
                </div>

                {/* Content */}
                <div className="investment-card-body">
                  <h3 className="investment-card-title">{calc.title}</h3>
                  <p className="investment-card-desc">{calc.description}</p>
                </div>

                {/* Action Link */}
                <div className="investment-card-footer">
                  <span className="investment-card-open-link">
                    Open <span className="open-arrow">→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default InvestmentSection;
