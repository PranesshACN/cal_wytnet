import React, { useState } from 'react';
import { Activity, Receipt, Zap, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';

function FloatingCalculatorPreview() {
  const [activePreviewTab, setActivePreviewTab] = useState('gst');

  return (
    <div className="hero-floating-composition" aria-label="Calculator Preview Showcase">
      {/* Ambient decorative glowing orbs */}
      <div className="ambient-glow orb-violet" />
      <div className="ambient-glow orb-blue" />
      <div className="ambient-glow orb-lavender" />

      {/* Main Large Dashboard Preview Card */}
      <div className="main-floating-card">
        <div className="card-glass-header">
          <div className="card-header-left">
            <div className="card-icon-pill">
              <Sparkles size={14} className="sparkle-icon" />
              <span>Quick Calculator</span>
            </div>
          </div>
          <div className="card-status-pill">
            <span className="status-dot-pulse" />
            <span className="status-text">Ready to calculate</span>
          </div>
        </div>

        {/* Tab pills inside preview */}
        <div className="preview-tab-row">
          <button 
            type="button"
            className={`preview-tab-pill ${activePreviewTab === 'gst' ? 'active' : ''}`}
            onClick={() => setActivePreviewTab('gst')}
          >
            GST Tax
          </button>
          <button 
            type="button"
            className={`preview-tab-pill ${activePreviewTab === 'bmi' ? 'active' : ''}`}
            onClick={() => setActivePreviewTab('bmi')}
          >
            BMI Health
          </button>
          <button 
            type="button"
            className={`preview-tab-pill ${activePreviewTab === 'eb' ? 'active' : ''}`}
            onClick={() => setActivePreviewTab('eb')}
          >
            EB Energy
          </button>
        </div>

        {/* Dynamic preview content based on active tab */}
        {activePreviewTab === 'gst' && (
          <div className="preview-calc-body">
            <div className="preview-field-group">
              <div className="field-label-row">
                <span className="preview-label">Transaction Amount</span>
                <span className="preview-subtext">Tax Exclusive</span>
              </div>
              <div className="preview-input-display">
                <span className="currency-prefix">₹</span>
                <span className="amount-val">50,000.00</span>
                <span className="tax-badge">18% GST</span>
              </div>
            </div>

            <div className="preview-result-container">
              <div className="result-metric">
                <span className="metric-title">Tax (CGST + SGST)</span>
                <span className="metric-val text-violet">+ ₹9,000.00</span>
              </div>
              <div className="metric-divider" />
              <div className="result-metric">
                <span className="metric-title">Final Invoice Total</span>
                <span className="metric-val font-bold text-gradient">₹59,000.00</span>
              </div>
            </div>
          </div>
        )}

        {activePreviewTab === 'bmi' && (
          <div className="preview-calc-body">
            <div className="preview-field-group">
              <div className="field-label-row">
                <span className="preview-label">Height & Weight Inputs</span>
                <span className="preview-subtext">Metric Unit</span>
              </div>
              <div className="preview-input-display">
                <span className="param-chip">68 kg</span>
                <span className="param-separator">•</span>
                <span className="param-chip">174 cm</span>
                <span className="badge-normal-mini">Normal</span>
              </div>
            </div>

            <div className="preview-result-container">
              <div className="result-metric">
                <span className="metric-title">Calculated Index</span>
                <span className="metric-val text-emerald">22.46 BMI</span>
              </div>
              <div className="metric-divider" />
              <div className="result-metric">
                <span className="metric-title">Optimal Range</span>
                <span className="metric-val font-medium">56.0 - 75.3 kg</span>
              </div>
            </div>
          </div>
        )}

        {activePreviewTab === 'eb' && (
          <div className="preview-calc-body">
            <div className="preview-field-group">
              <div className="field-label-row">
                <span className="preview-label">Power Consumption</span>
                <span className="preview-subtext">Domestic Tariff</span>
              </div>
              <div className="preview-input-display">
                <span className="amount-val">245 kWh</span>
                <span className="tax-badge">₹6.50 / unit</span>
              </div>
            </div>

            <div className="preview-result-container">
              <div className="result-metric">
                <span className="metric-title">Energy Charges</span>
                <span className="metric-val">₹1,592.50</span>
              </div>
              <div className="metric-divider" />
              <div className="result-metric">
                <span className="metric-title">Estimated Total (5% Fixed)</span>
                <span className="metric-val font-bold text-gradient">₹1,672.13</span>
              </div>
            </div>
          </div>
        )}

        <div className="preview-footer-row">
          <div className="verified-badge">
            <CheckCircle2 size={13} className="text-emerald" />
            <span>Precise financial grade accuracy</span>
          </div>
          <span className="subtle-calc-id">v2.4 Live</span>
        </div>
      </div>

      {/* Floating Card 1 — BMI Score */}
      <div className="satellite-card card-bmi-float">
        <div className="satellite-header">
          <div className="sat-icon-circle sat-icon-bmi">
            <Activity size={16} />
          </div>
          <div className="sat-title-group">
            <span className="sat-label">BMI Score</span>
            <span className="sat-sub">Adult metrics</span>
          </div>
        </div>
        <div className="sat-value-row">
          <span className="sat-big-val">22.4</span>
          <span className="sat-status-tag normal-tag">Normal</span>
        </div>
        {/* Mini horizontal color-coded BMI scale */}
        <div className="mini-bmi-scale" title="BMI Categories: Underweight, Normal, Overweight, Obese">
          <div className="scale-segment seg-underweight" />
          <div className="scale-segment seg-normal" />
          <div className="scale-segment seg-overweight" />
          <div className="scale-segment seg-obese" />
          <div className="scale-pointer" style={{ left: '38%' }} />
        </div>
      </div>

      {/* Floating Card 2 — GST Summary */}
      <div className="satellite-card card-gst-float">
        <div className="satellite-header">
          <div className="sat-icon-circle sat-icon-gst">
            <Receipt size={16} />
          </div>
          <div className="sat-title-group">
            <span className="sat-label">GST Summary</span>
            <span className="sat-sub">18% Standard GST</span>
          </div>
        </div>
        <div className="sat-gst-details">
          <div className="sat-gst-row">
            <span className="sat-gst-item">Base</span>
            <span className="sat-gst-num">₹45,000</span>
          </div>
          <div className="sat-gst-row">
            <span className="sat-gst-item">Tax (18%)</span>
            <span className="sat-gst-num sat-gst-tax">+ ₹8,100</span>
          </div>
          <div className="sat-gst-divider" />
          <div className="sat-gst-row sat-gst-total-row">
            <span className="sat-gst-item font-semibold">Total</span>
            <span className="sat-gst-total">₹53,100</span>
          </div>
        </div>
      </div>

      {/* Floating Card 3 — Electricity Energy Estimate */}
      <div className="satellite-card card-eb-float">
        <div className="satellite-header">
          <div className="sat-icon-circle sat-icon-eb">
            <Zap size={16} />
          </div>
          <div className="sat-title-group">
            <span className="sat-label">Energy Estimate</span>
            <span className="sat-sub">Domestic Billing</span>
          </div>
        </div>
        <div className="sat-eb-content">
          <div className="sat-eb-consumption">
            <TrendingUp size={13} className="text-violet" />
            <span>245 kWh consumed</span>
          </div>
          <div className="sat-eb-price-row">
            <span className="sat-eb-total font-bold">₹1,672.13</span>
            <span className="sat-eb-badge">Est. Bill</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingCalculatorPreview;
