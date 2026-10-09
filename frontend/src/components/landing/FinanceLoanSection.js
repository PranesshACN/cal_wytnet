import React from 'react';
import {
  Layers,
  Home,
  Columns2,
  Users,
  CreditCard,
  PiggyBank,
  TrendingDown,
  Briefcase,
  Percent,
  Building,
  ArrowRight,
} from 'lucide-react';
import './FinanceLoanSection.css';

export const FINANCE_CALCULATORS = [
  {
    id: 'emi',
    title: 'EMI Calculator',
    description: 'Calculate monthly loan installments for any loan',
    icon: Layers,
    isPopular: true,
  },
  {
    id: 'mortgage',
    title: 'Mortgage Calculator',
    description: 'Monthly payment and full amortization schedule',
    icon: Home,
    isPopular: true,
  },
  {
    id: 'loan-compare',
    title: 'Loan Comparison Calculator',
    description: 'Compare two loan offers side by side',
    icon: Columns2,
  },
  {
    id: 'retirement',
    title: 'Retirement Calculator',
    description: 'Plan your retirement savings corpus',
    icon: Users,
  },
  {
    id: 'credit-card',
    title: 'Credit Card Payoff Calculator',
    description: 'How long to pay off your credit card debt',
    icon: CreditCard,
  },
  {
    id: 'savings-goal',
    title: 'Savings Goal Calculator',
    description: 'Monthly savings needed to reach your goal',
    icon: PiggyBank,
    isActive: true, // matches screenshot top blue highlight indicator
  },
  {
    id: 'inflation',
    title: 'Inflation Calculator',
    description: 'How inflation erodes purchasing power over time',
    icon: TrendingDown,
  },
  {
    id: 'net-worth',
    title: 'Net Worth Calculator',
    description: 'Calculate total net worth from assets and liabilities',
    icon: Briefcase,
  },
  {
    id: 'simple-interest',
    title: 'Simple Interest Calculator',
    description: 'Calculate simple interest on any loan or deposit',
    icon: Percent,
  },
  {
    id: 'down-payment',
    title: 'Down Payment Calculator',
    description: 'Calculate down payment needed for a property',
    icon: Building,
  },
];

function FinanceLoanSection({ onSelectCalculator }) {
  return (
    <section className="finance-loan-section" id="finance-tools">
      <div className="finance-loan-container">
        {/* Section Header */}
        <div className="finance-header-row">
          <div className="finance-title-group">
            <div className="finance-header-icon-box">
              <Layers size={22} className="finance-header-icon" />
            </div>
            <div>
              <h2 className="finance-section-title">Finance & Loan</h2>
              <span className="finance-section-subtitle">10 calculators</span>
            </div>
          </div>

          <button
            type="button"
            className="finance-view-all-link"
            onClick={() => onSelectCalculator('emi')}
          >
            <span>View all</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 10 Calculators Cards Grid */}
        <div className="finance-cards-grid">
          {FINANCE_CALCULATORS.map((calc) => {
            const IconComponent = calc.icon;
            return (
              <div
                key={calc.id}
                className={`finance-card ${calc.isActive ? 'card-has-top-indicator' : ''}`}
                onClick={() => onSelectCalculator(calc.id)}
              >
                {/* Top Row: Icon + Popular Badge */}
                <div className="finance-card-top">
                  <div className="finance-card-icon-wrap">
                    <IconComponent size={20} className="finance-card-icon" />
                  </div>
                  {calc.isPopular && (
                    <span className="finance-popular-pill">Popular</span>
                  )}
                </div>

                {/* Content */}
                <div className="finance-card-body">
                  <h3 className="finance-card-title">{calc.title}</h3>
                  <p className="finance-card-desc">{calc.description}</p>
                </div>

                {/* Action Link */}
                <div className="finance-card-footer">
                  <span className="finance-card-open-link">
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

export default FinanceLoanSection;
