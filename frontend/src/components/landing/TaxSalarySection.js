import React from 'react';
import {
  DollarSign,
  FileText,
  Clock,
  Percent,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';
import './TaxSalarySection.css';

export const TAX_SALARY_CALCULATORS = [
  {
    id: 'salary',
    title: 'Salary Calculator',
    description: 'Annual, monthly, weekly and hourly pay breakdown',
    icon: DollarSign,
    isPopular: true,
    isActive: true, // orange top indicator from screenshot
  },
  {
    id: 'income-tax',
    title: 'Income Tax Calculator',
    description: 'Estimate federal income tax liability',
    icon: FileText,
    isPopular: true,
  },
  {
    id: 'hourly-to-salary',
    title: 'Hourly to Salary Calculator',
    description: 'Convert hourly wage to annual salary',
    icon: Clock,
  },
  {
    id: 'gst',
    title: 'GST Calculator',
    description: 'Add or remove GST from any amount instantly',
    icon: Percent,
  },
  {
    id: 'budget',
    title: 'Budget Calculator',
    description: 'Plan monthly income vs expenses',
    icon: FileSpreadsheet,
  },
];

function TaxSalarySection({ onSelectCalculator }) {
  return (
    <section className="tax-salary-section" id="tax-salary-tools">
      <div className="tax-salary-container">
        {/* Header Row */}
        <div className="tax-salary-header-row">
          <div className="tax-salary-title-group">
            <div className="tax-salary-header-icon-box">
              <DollarSign size={22} className="tax-salary-header-icon" />
            </div>
            <div>
              <h2 className="tax-salary-section-title">Tax & Salary</h2>
              <span className="tax-salary-section-subtitle">5 calculators</span>
            </div>
          </div>

          <button
            type="button"
            className="tax-salary-view-all-link"
            onClick={() => onSelectCalculator('salary')}
          >
            <span>View all</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 5 Cards Grid */}
        <div className="tax-salary-cards-grid">
          {TAX_SALARY_CALCULATORS.map((calc) => {
            const IconComponent = calc.icon;
            return (
              <div
                key={calc.id}
                className={`tax-salary-card ${calc.isActive ? 'card-has-orange-indicator' : ''}`}
                onClick={() => onSelectCalculator(calc.id)}
              >
                {/* Top Row: Icon + Popular Badge */}
                <div className="tax-salary-card-top">
                  <div className="tax-salary-card-icon-wrap">
                    <IconComponent size={20} className="tax-salary-card-icon" />
                  </div>
                  {calc.isPopular && (
                    <span className="tax-salary-popular-pill">Popular</span>
                  )}
                </div>

                {/* Content */}
                <div className="tax-salary-card-body">
                  <h3 className="tax-salary-card-title">{calc.title}</h3>
                  <p className="tax-salary-card-desc">{calc.description}</p>
                </div>

                {/* Action Link */}
                <div className="tax-salary-card-footer">
                  <span className="tax-salary-card-open-link">
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

export default TaxSalarySection;
