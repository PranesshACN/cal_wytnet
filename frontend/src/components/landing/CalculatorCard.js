import React from 'react';
import { ArrowRight } from 'lucide-react';

function CalculatorCard({
  icon: Icon,
  category,
  title,
  description,
  previewContent,
  ctaText,
  accentClass,
  onClick,
}) {
  return (
    <div 
      className={`calculator-collection-card ${accentClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <div className="card-top-row">
        <div className="card-icon-container">
          <Icon size={22} className="card-collection-icon" />
        </div>
        <span className="card-category-tag">{category}</span>
      </div>

      <h3 className="card-collection-title">{title}</h3>
      <p className="card-collection-desc">{description}</p>

      {/* Mini Feature Preview Box */}
      <div className="card-mini-preview-container">
        {previewContent}
      </div>

      {/* Bottom CTA Row */}
      <div className="card-cta-row">
        <span className="card-cta-text">{ctaText}</span>
        <div className="card-cta-arrow-circle">
          <ArrowRight size={15} className="card-hover-arrow" />
        </div>
      </div>
    </div>
  );
}

export default CalculatorCard;
