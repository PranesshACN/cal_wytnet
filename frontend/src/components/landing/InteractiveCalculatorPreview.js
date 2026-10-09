import React, { useState } from 'react';
import {
  Activity,
  CalendarDays,
  Receipt,
  Zap,
  RotateCcw,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  calculateBMILogic,
  calculateAgeLogic,
  calculateGSTLogic,
  calculateEBBillLogic,
} from '../../utils/calculatorLogic';

function InteractiveCalculatorPreview({ activeTab, onSelectTab, onOpenFullSuite }) {
  // BMI State
  const [bmiWeight, setBmiWeight] = useState('70');
  const [bmiHeight, setBmiHeight] = useState('175');

  // Age State (Default: 25 years ago)
  const defaultDob = new Date();
  defaultDob.setFullYear(defaultDob.getFullYear() - 24);
  defaultDob.setMonth(3);
  defaultDob.setDate(15);
  const [birthDate, setBirthDate] = useState(defaultDob.toISOString().split('T')[0]);

  // GST State
  const [gstAmount, setGstAmount] = useState('25000');
  const [gstRate, setGstRate] = useState('18');
  const [isInclusive, setIsInclusive] = useState(false);

  // EB Bill State
  const [ebUnits, setEbUnits] = useState('220');
  const [ebRate, setEbRate] = useState('6.5');

  // Computed results
  const bmiResult = calculateBMILogic(parseFloat(bmiWeight), parseFloat(bmiHeight));
  const ageResult = calculateAgeLogic(birthDate);
  const gstResult = calculateGSTLogic(gstAmount, gstRate, isInclusive);
  const ebResult = calculateEBBillLogic(ebUnits, ebRate);

  // Reset Handlers
  const handleReset = () => {
    if (activeTab === 'bmi') {
      setBmiWeight('70');
      setBmiHeight('175');
    } else if (activeTab === 'age') {
      setBirthDate(defaultDob.toISOString().split('T')[0]);
    } else if (activeTab === 'gst') {
      setGstAmount('25000');
      setGstRate('18');
      setIsInclusive(false);
    } else if (activeTab === 'eb') {
      setEbUnits('220');
      setEbRate('6.5');
    }
  };

  const tabs = [
    { id: 'bmi', label: 'BMI Calculator', icon: Activity, tag: 'Health' },
    { id: 'age', label: 'Age Calculator', icon: CalendarDays, tag: 'Time' },
    { id: 'gst', label: 'GST Calculator', icon: Receipt, tag: 'Tax & Finance' },
    { id: 'eb', label: 'EB Bill Calculator', icon: Zap, tag: 'Utilities' },
  ];

  return (
    <section className="interactive-preview-section" id="interactive-preview">
      <div className="section-container">
        {/* Header */}
        <div className="section-header-centered">
          <span className="section-tag-pill">LIVE PLAYGROUND</span>
          <h2 className="section-main-heading">A Quick Preview. A Smarter Way to Calculate.</h2>
          <p className="section-sub-copy">
            Try the tools right here. No complicated forms, just straightforward answers.
          </p>
        </div>

        {/* Calculator Workspace */}
        <div className="calculator-workspace-card">
          {/* Vertical Sidebar on Desktop, Horizontal Scroll on Mobile */}
          <aside className="workspace-sidebar" aria-label="Choose Calculator">
            <div className="sidebar-header-label">CHOOSE TOOL</div>
            <div className="sidebar-tab-list">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`sidebar-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectTab(tab.id)}
                  >
                    <div className="tab-btn-icon-wrap">
                      <Icon size={18} />
                    </div>
                    <div className="tab-btn-text-wrap">
                      <span className="tab-btn-title">{tab.label}</span>
                      <span className="tab-btn-tag">{tab.tag}</span>
                    </div>
                    {isActive && <div className="tab-active-indicator" />}
                  </button>
                );
              })}
            </div>

            <div className="sidebar-hint-box">
              <Sparkles size={16} className="hint-icon" />
              <p>Instant client-side calculation with zero latency.</p>
            </div>
          </aside>

          {/* Main Workspace Body */}
          <main className="workspace-main-panel">
            <div className="workspace-top-bar">
              <div className="workspace-active-meta">
                <span className="active-calc-badge">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </span>
                <span className="live-status-pill">
                  <span className="pulse-dot" /> Live calculation active
                </span>
              </div>
              <button
                type="button"
                className="btn-reset"
                onClick={handleReset}
                title="Reset input fields"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            <div className="workspace-io-layout">
              {/* Left: Input Controls */}
              <div className="workspace-input-column">
                {activeTab === 'bmi' && (
                  <div className="calc-form-container">
                    <div className="input-group-modern">
                      <div className="label-with-helper">
                        <label htmlFor="bmi-weight">Weight (kg)</label>
                        <span className="helper-label">In kilograms</span>
                      </div>
                      <div className="input-field-wrapper">
                        <input
                          id="bmi-weight"
                          type="number"
                          step="0.5"
                          min="1"
                          max="300"
                          value={bmiWeight}
                          onChange={(e) => setBmiWeight(e.target.value)}
                          placeholder="e.g. 70"
                          className="modern-input"
                        />
                        <span className="input-affix">kg</span>
                      </div>
                    </div>

                    <div className="input-group-modern">
                      <div className="label-with-helper">
                        <label htmlFor="bmi-height">Height (cm)</label>
                        <span className="helper-label">In centimeters</span>
                      </div>
                      <div className="input-field-wrapper">
                        <input
                          id="bmi-height"
                          type="number"
                          step="0.5"
                          min="30"
                          max="260"
                          value={bmiHeight}
                          onChange={(e) => setBmiHeight(e.target.value)}
                          placeholder="e.g. 175"
                          className="modern-input"
                        />
                        <span className="input-affix">cm</span>
                      </div>
                    </div>

                    <div className="input-quick-presets">
                      <span className="presets-label">Common Presets:</span>
                      <button type="button" className="preset-chip" onClick={() => { setBmiWeight('65'); setBmiHeight('170'); }}>65kg / 170cm</button>
                      <button type="button" className="preset-chip" onClick={() => { setBmiWeight('75'); setBmiHeight('180'); }}>75kg / 180cm</button>
                      <button type="button" className="preset-chip" onClick={() => { setBmiWeight('85'); setBmiHeight('175'); }}>85kg / 175cm</button>
                    </div>
                  </div>
                )}

                {activeTab === 'age' && (
                  <div className="calc-form-container">
                    <div className="input-group-modern">
                      <div className="label-with-helper">
                        <label htmlFor="age-dob">Date of Birth</label>
                        <span className="helper-label">Select your birth date</span>
                      </div>
                      <div className="input-field-wrapper">
                        <input
                          id="age-dob"
                          type="date"
                          max={new Date().toISOString().split('T')[0]}
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="modern-input modern-date-input"
                        />
                      </div>
                    </div>

                    <div className="input-info-card">
                      <Info size={16} className="info-icon" />
                      <p>
                        Precise breakdown calculating exact leap years, elapsed days, and the exact countdown to your next birthday.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'gst' && (
                  <div className="calc-form-container">
                    <div className="input-group-modern">
                      <div className="label-with-helper">
                        <label htmlFor="gst-amount">Base Amount (₹)</label>
                        <span className="helper-label">Transaction amount</span>
                      </div>
                      <div className="input-field-wrapper">
                        <span className="input-prefix">₹</span>
                        <input
                          id="gst-amount"
                          type="number"
                          step="100"
                          min="0"
                          value={gstAmount}
                          onChange={(e) => setGstAmount(e.target.value)}
                          placeholder="e.g. 25000"
                          className="modern-input pl-prefix"
                        />
                      </div>
                    </div>

                    <div className="input-group-modern">
                      <div className="label-with-helper">
                        <label>GST Rate</label>
                        <span className="helper-label">Standard GST brackets</span>
                      </div>
                      <div className="rate-selector-grid">
                        {['5', '12', '18', '28'].map((r) => (
                          <button
                            key={r}
                            type="button"
                            className={`rate-selector-btn ${gstRate === r ? 'active' : ''}`}
                            onClick={() => setGstRate(r)}
                          >
                            {r}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="input-group-modern">
                      <div className="label-with-helper">
                        <label>Calculation Mode</label>
                      </div>
                      <div className="tax-mode-toggle">
                        <button
                          type="button"
                          className={`tax-mode-btn ${!isInclusive ? 'active' : ''}`}
                          onClick={() => setIsInclusive(false)}
                        >
                          Exclusive (+ GST)
                        </button>
                        <button
                          type="button"
                          className={`tax-mode-btn ${isInclusive ? 'active' : ''}`}
                          onClick={() => setIsInclusive(true)}
                        >
                          Inclusive (Included)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'eb' && (
                  <div className="calc-form-container">
                    <div className="input-group-modern">
                      <div className="label-with-helper">
                        <label htmlFor="eb-units">Units Consumed (kWh)</label>
                        <span className="helper-label">From electricity meter</span>
                      </div>
                      <div className="input-field-wrapper">
                        <input
                          id="eb-units"
                          type="number"
                          step="1"
                          min="0"
                          value={ebUnits}
                          onChange={(e) => setEbUnits(e.target.value)}
                          placeholder="e.g. 220"
                          className="modern-input"
                        />
                        <span className="input-affix">kWh</span>
                      </div>
                    </div>

                    <div className="input-group-modern">
                      <div className="label-with-helper">
                        <label htmlFor="eb-rate">Rate per Unit (₹)</label>
                        <span className="helper-label">Default tariff rate</span>
                      </div>
                      <div className="input-field-wrapper">
                        <span className="input-prefix">₹</span>
                        <input
                          id="eb-rate"
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={ebRate}
                          onChange={(e) => setEbRate(e.target.value)}
                          className="modern-input pl-prefix"
                        />
                        <span className="input-affix">/ kWh</span>
                      </div>
                    </div>

                    <div className="input-info-card">
                      <Info size={16} className="info-icon" />
                      <p>
                        Includes base energy charges plus a standard 5% regulatory/fixed charge provision.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Rich Animated Result Panel */}
              <div className="workspace-result-column">
                <div className="result-glass-display">
                  {/* BMI Result View */}
                  {activeTab === 'bmi' && (
                    <>
                      {bmiResult ? (
                        <div className="result-content-body animate-fade-in">
                          <div className="result-kpi-header">
                            <span className="kpi-label">Body Mass Index</span>
                            <div className="kpi-value-row">
                              <span className="kpi-hero-number">{bmiResult.bmi}</span>
                              <span className={`kpi-status-badge ${bmiResult.badgeClass}`}>
                                {bmiResult.category}
                              </span>
                            </div>
                          </div>

                          {/* Visual BMI Range Gauge */}
                          <div className="bmi-gauge-card">
                            <div className="gauge-labels-row">
                              <span>Underweight</span>
                              <span>Normal</span>
                              <span>Overweight</span>
                              <span>Obese</span>
                            </div>
                            <div className="gauge-track-bar">
                              <div className="gauge-seg bg-blue" />
                              <div className="gauge-seg bg-emerald" />
                              <div className="gauge-seg bg-amber" />
                              <div className="gauge-seg bg-rose" />
                              {/* Position needle indicator based on BMI */}
                              <div
                                className="gauge-needle"
                                style={{
                                  left: `${Math.min(
                                    Math.max(((bmiResult.bmi - 14) / (38 - 14)) * 100, 2),
                                    98
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="gauge-footer-row">
                              <span>&lt; 18.5</span>
                              <span>18.5 - 24.9</span>
                              <span>25 - 29.9</span>
                              <span>&gt;= 30</span>
                            </div>
                          </div>

                          <div className="result-breakdown-table">
                            <div className="breakdown-row">
                              <span className="text-secondary">Input Weight</span>
                              <span className="font-semibold">{bmiResult.weight} kg</span>
                            </div>
                            <div className="breakdown-row">
                              <span className="text-secondary">Input Height</span>
                              <span className="font-semibold">{bmiResult.height} cm</span>
                            </div>
                            <div className="breakdown-row highlight-row">
                              <span className="text-secondary">Optimal Normal Range</span>
                              <span className="font-semibold text-emerald">
                                {bmiResult.minNormalWeight} - {bmiResult.maxNormalWeight} kg
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="result-empty-state">
                          <ShieldAlert size={32} className="empty-icon" />
                          <p>Please enter valid weight and height values to calculate your BMI.</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Age Result View */}
                  {activeTab === 'age' && (
                    <>
                      {ageResult ? (
                        <div className="result-content-body animate-fade-in">
                          <div className="result-kpi-header">
                            <span className="kpi-label">Your Exact Chronological Age</span>
                            <div className="age-triad-display">
                              <div className="triad-item">
                                <span className="triad-num">{ageResult.years}</span>
                                <span className="triad-label">Years</span>
                              </div>
                              <div className="triad-item">
                                <span className="triad-num">{ageResult.months}</span>
                                <span className="triad-label">Months</span>
                              </div>
                              <div className="triad-item">
                                <span className="triad-num">{ageResult.days}</span>
                                <span className="triad-label">Days</span>
                              </div>
                            </div>
                          </div>

                          <div className="birthday-countdown-card">
                            <div className="countdown-icon-wrap">
                              <Sparkles size={18} className="text-violet" />
                            </div>
                            <div className="countdown-text-wrap">
                              <span className="countdown-title">Next Birthday Countdown</span>
                              <span className="countdown-days">
                                In <strong>{ageResult.daysUntilNextBirthday}</strong> days
                              </span>
                            </div>
                          </div>

                          <div className="result-breakdown-table">
                            <div className="breakdown-row">
                              <span className="text-secondary">Total Elapsed Days</span>
                              <span className="font-mono font-semibold">
                                {ageResult.totalDays.toLocaleString()} days
                              </span>
                            </div>
                            <div className="breakdown-row">
                              <span className="text-secondary">Total Elapsed Weeks</span>
                              <span className="font-mono font-semibold">
                                {ageResult.totalWeeks.toLocaleString()} weeks
                              </span>
                            </div>
                            <div className="breakdown-row">
                              <span className="text-secondary">Approximate Hours</span>
                              <span className="font-mono font-semibold">
                                {ageResult.totalHours.toLocaleString()} hours
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="result-empty-state">
                          <ShieldAlert size={32} className="empty-icon" />
                          <p>Please select a valid date of birth (today or past date).</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* GST Result View */}
                  {activeTab === 'gst' && (
                    <>
                      {gstResult ? (
                        <div className="result-content-body animate-fade-in">
                          <div className="result-kpi-header">
                            <span className="kpi-label">
                              {gstResult.isInclusive ? 'Net Base (Pre-Tax)' : 'Total Invoice Amount'}
                            </span>
                            <div className="kpi-value-row">
                              <span className="kpi-hero-number text-gradient">
                                ₹{gstResult.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                              <span className="kpi-status-badge badge-normal">
                                {gstResult.gstRate}% GST
                              </span>
                            </div>
                          </div>

                          <div className="result-breakdown-table">
                            <div className="breakdown-row">
                              <span className="text-secondary">Net Base Amount</span>
                              <span className="font-mono font-semibold">
                                ₹{gstResult.baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="breakdown-row">
                              <span className="text-secondary">CGST ({gstResult.gstRate / 2}%)</span>
                              <span className="font-mono font-semibold text-violet">
                                ₹{gstResult.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="breakdown-row">
                              <span className="text-secondary">SGST ({gstResult.gstRate / 2}%)</span>
                              <span className="font-mono font-semibold text-violet">
                                ₹{gstResult.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="breakdown-row highlight-row">
                              <span className="font-semibold text-main">Total Tax Amount</span>
                              <span className="font-mono font-bold text-violet">
                                ₹{gstResult.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>

                          <div className="tax-compliance-pill">
                            <CheckCircle2 size={14} className="text-emerald" />
                            <span>Compliant with standard Indian Goods & Services Tax formulas</span>
                          </div>
                        </div>
                      ) : (
                        <div className="result-empty-state">
                          <ShieldAlert size={32} className="empty-icon" />
                          <p>Please enter a valid amount and tax rate.</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* EB Bill Result View */}
                  {activeTab === 'eb' && (
                    <>
                      {ebResult ? (
                        <div className="result-content-body animate-fade-in">
                          <div className="result-kpi-header">
                            <span className="kpi-label">Estimated Electricity Bill</span>
                            <div className="kpi-value-row">
                              <span className="kpi-hero-number text-gradient">
                                ₹{ebResult.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                              <span className="kpi-status-badge badge-estimate">
                                Tariff Estimate
                              </span>
                            </div>
                          </div>

                          <div className="result-breakdown-table">
                            <div className="breakdown-row">
                              <span className="text-secondary">Consumption</span>
                              <span className="font-mono font-semibold">{ebResult.units} kWh</span>
                            </div>
                            <div className="breakdown-row">
                              <span className="text-secondary">Tariff Rate</span>
                              <span className="font-mono font-semibold">₹{ebResult.ratePerUnit.toFixed(2)} / unit</span>
                            </div>
                            <div className="breakdown-row">
                              <span className="text-secondary">Energy Charges</span>
                              <span className="font-mono font-semibold">
                                ₹{ebResult.energyCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="breakdown-row">
                              <span className="text-secondary">Fixed / Standing Charge (5%)</span>
                              <span className="font-mono font-semibold text-violet">
                                ₹{ebResult.fixedCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="breakdown-row highlight-row">
                              <span className="font-semibold text-main">Total Payable (Est.)</span>
                              <span className="font-mono font-bold text-gradient">
                                ₹{ebResult.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>

                          <div className="tax-compliance-pill alert-subtle">
                            <Info size={14} className="text-violet" />
                            <span>
                              Note: This is an estimated tariff calculation based on configurable unit pricing and provisional fixed charges. Official utility board tariffs may vary.
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="result-empty-state">
                          <ShieldAlert size={32} className="empty-icon" />
                          <p>Please enter valid units consumed and rate per unit.</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Bottom Action inside Results Panel */}
                  <div className="result-footer-action">
                    <button
                      type="button"
                      className="btn-open-suite"
                      onClick={onOpenFullSuite}
                    >
                      <span>Open in Full Dashboard</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export default InteractiveCalculatorPreview;
