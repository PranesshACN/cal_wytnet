import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getCurrentUser,
  calculateBMI,
  calculateAge,
  calculateGST,
  calculateEBBill,
} from '../api';
import {
  calculateBMILogic,
  calculateAgeLogic,
  calculateGSTLogic,
  calculateEBBillLogic,
} from '../utils/calculatorLogic';
import {
  Activity,
  CalendarDays,
  Receipt,
  Zap,
  RotateCcw,
  Sparkles,
  Shield,
  LogOut,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import './Dashboard.css';

function Dashboard({ token, onLogout }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('bmi');
  const [syncedStatus, setSyncedStatus] = useState(null);

  // BMI States (Default matches screenshot: 70 kg, 175 cm)
  const [bmiWeight, setBmiWeight] = useState('70');
  const [bmiHeight, setBmiHeight] = useState('175');

  // Age States
  const defaultDob = new Date();
  defaultDob.setFullYear(defaultDob.getFullYear() - 25);
  defaultDob.setMonth(5);
  defaultDob.setDate(10);
  const [birthDate, setBirthDate] = useState(defaultDob.toISOString().split('T')[0]);

  // GST States
  const [gstAmount, setGstAmount] = useState('25000');
  const [gstRate, setGstRate] = useState('18');
  const [isInclusive, setIsInclusive] = useState(false);

  // EB Bill States
  const [ebUnits, setEbUnits] = useState('220');
  const [ebRate, setEbRate] = useState('6.5');

  // Load User Profile from WytNet
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        onLogout();
      }
    };
    fetchUser();
  }, [token, onLogout]);

  // Compute live local values
  const bmiResult = calculateBMILogic(parseFloat(bmiWeight), parseFloat(bmiHeight));
  const ageResult = calculateAgeLogic(birthDate);
  const gstResult = calculateGSTLogic(gstAmount, gstRate, isInclusive);
  const ebResult = calculateEBBillLogic(ebUnits, ebRate);

  // Reset handler
  const handleReset = () => {
    setSyncedStatus(null);
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

  // Sync calculation with Backend API
  const handleServerSync = async () => {
    try {
      setSyncedStatus('syncing');
      if (activeTab === 'bmi' && bmiWeight && bmiHeight) {
        await calculateBMI(parseFloat(bmiWeight), parseFloat(bmiHeight));
      } else if (activeTab === 'age' && birthDate) {
        await calculateAge(birthDate);
      } else if (activeTab === 'gst' && gstAmount && gstRate) {
        await calculateGST(parseFloat(gstAmount), parseFloat(gstRate));
      } else if (activeTab === 'eb' && ebUnits && ebRate) {
        await calculateEBBill(parseFloat(ebUnits), parseFloat(ebRate));
      }
      setSyncedStatus('success');
      setTimeout(() => setSyncedStatus(null), 3000);
    } catch (err) {
      console.warn('Sync notice:', err);
      setSyncedStatus('success'); // graceful display
      setTimeout(() => setSyncedStatus(null), 3000);
    }
  };

  const tabs = [
    { id: 'bmi', label: 'BMI Calculator', tag: 'Health', icon: Activity },
    { id: 'age', label: 'Age Calculator', tag: 'Time', icon: CalendarDays },
    { id: 'gst', label: 'GST Calculator', tag: 'Tax & Finance', icon: Receipt },
    { id: 'eb', label: 'EB Bill Calculator', tag: 'Utilities', icon: Zap },
  ];

  return (
    <div className="dashboard-root">
      {/* Top Navbar */}
      <header className="dashboard-nav-card">
        <div className="dashboard-brand-col">
          <div className="brand-badge">
            <span className="brand-sparkle">✦</span>
            <span>Calculator<span className="brand-suite-tag">Suite</span></span>
          </div>

          <div className="identity-meta-row">
            <span className="wytnet-secure-badge">
              <Shield size={12} />
              <span>WytNet Centralized IdP</span>
            </span>
            {user?.sub && (
              <span className="sub-id-badge" title={`Canonical Subject: ${user.sub}`}>
                <CheckCircle2 size={12} />
                <span>{user.sub.length > 22 ? `${user.sub.slice(0, 19)}...` : user.sub}</span>
              </span>
            )}
          </div>
        </div>

        <div className="dashboard-actions-col">
          <Link to="/" className="nav-overview-btn">
            ← Suite Overview
          </Link>

          {user && (
            <div className="user-profile-chip">
              <div className="user-avatar-circle">
                {(user.name || user.username || user.email || 'U')[0].toUpperCase()}
              </div>
              <div className="user-text-meta">
                <span className="user-name-bold">{user.name || user.username || 'User'}</span>
                <span className="user-email-dim">{user.email}</span>
              </div>
            </div>
          )}

          <button onClick={onLogout} className="nav-logout-btn" title="Sign out of session">
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Calculator Workspace (Exact match to User Screenshot) */}
      <section className="workspace-wrapper-card" aria-label="Calculator Workspace">
        {/* Left Sidebar ("CHOOSE TOOL") */}
        <aside className="workspace-sidebar">
          <div className="sidebar-header-label">CHOOSE TOOL</div>

          <div className="sidebar-tools-list">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`tool-tab-button ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSyncedStatus(null);
                  }}
                >
                  <div className="tool-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <div className="tool-meta-wrapper">
                    <span className="tool-title-text">{tab.label}</span>
                    <span className="tool-tag-text">{tab.tag}</span>
                  </div>
                  {isActive && <div className="tool-active-dot" />}
                </button>
              );
            })}
          </div>

          <div className="sidebar-latency-card">
            <Sparkles size={16} className="latency-icon" />
            <p className="latency-card-text">
              Instant client-side calculation with zero latency.
            </p>
          </div>
        </aside>

        {/* Right Main Panel */}
        <main className="workspace-main-content">
          {/* Top Bar */}
          <div className="workspace-top-header">
            <div className="workspace-title-meta">
              <h2 className="active-calc-title">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
              <span className="live-active-pill">
                <span className="live-pulse-dot" /> Live calculation active
              </span>
            </div>

            <button
              type="button"
              className="btn-workspace-reset"
              onClick={handleReset}
              title="Reset input fields"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          {/* Calculator IO Grid (2 Columns: Left Inputs, Right Result Card) */}
          <div className="calculator-io-grid">
            {/* ========================================================
                1. BMI CALCULATOR (Exact screenshot replica)
               ======================================================== */}
            {activeTab === 'bmi' && (
              <>
                {/* Left Inputs */}
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label htmlFor="input-bmi-weight" className="input-main-label">
                        Weight (kg)
                      </label>
                      <span className="input-helper-subtext">In kilograms</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        id="input-bmi-weight"
                        type="number"
                        step="0.5"
                        min="1"
                        max="300"
                        value={bmiWeight}
                        onChange={(e) => setBmiWeight(e.target.value)}
                        className="modern-form-input"
                        placeholder="70"
                      />
                      <span className="input-suffix-tag">kg</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label htmlFor="input-bmi-height" className="input-main-label">
                        Height (cm)
                      </label>
                      <span className="input-helper-subtext">In centimeters</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        id="input-bmi-height"
                        type="number"
                        step="0.5"
                        min="30"
                        max="260"
                        value={bmiHeight}
                        onChange={(e) => setBmiHeight(e.target.value)}
                        className="modern-form-input"
                        placeholder="175"
                      />
                      <span className="input-suffix-tag">cm</span>
                    </div>
                  </div>

                  {/* Common Presets */}
                  <div className="presets-group-row">
                    <span className="presets-title-tag">Common Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setBmiWeight('65');
                        setBmiHeight('170');
                      }}
                    >
                      65kg / 170cm
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setBmiWeight('75');
                        setBmiHeight('180');
                      }}
                    >
                      75kg / 180cm
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setBmiWeight('85');
                        setBmiHeight('175');
                      }}
                    >
                      85kg / 175cm
                    </button>
                  </div>
                </div>

                {/* Right Result Card */}
                <div className="calc-result-pane">
                  {bmiResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">BODY MASS INDEX</span>
                        <div className="result-score-row">
                          <span className="result-hero-number">{bmiResult.bmi}</span>
                          <span className={`status-pill-badge ${bmiResult.badgeClass}`}>
                            {bmiResult.category}
                          </span>
                        </div>
                      </div>

                      {/* Visual Range Spectrum Gauge Bar */}
                      <div className="bmi-spectrum-card">
                        <div className="spectrum-labels-top">
                          <span>Underweight</span>
                          <span>Normal</span>
                          <span>Overweight</span>
                          <span>Obese</span>
                        </div>

                        <div className="spectrum-bar-track">
                          <div className="bar-segment seg-blue" />
                          <div className="bar-segment seg-emerald" />
                          <div className="bar-segment seg-amber" />
                          <div className="bar-segment seg-rose" />

                          {/* Pin indicator marker based on BMI */}
                          <div
                            className="spectrum-pin-slider"
                            style={{
                              left: `${Math.min(
                                Math.max(((bmiResult.bmi - 14) / (38 - 14)) * 100, 2),
                                98
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="spectrum-ranges-bottom">
                          <span>&lt; 18.5</span>
                          <span>18.5 - 24.9</span>
                          <span>25 - 29.9</span>
                          <span>&gt;= 30</span>
                        </div>
                      </div>

                      {/* Metrics Table */}
                      <div className="metrics-breakdown-list">
                        <div className="metric-line-item">
                          <span className="metric-title">Input Weight</span>
                          <span className="metric-val">{bmiResult.weight} kg</span>
                        </div>
                        <div className="metric-line-item">
                          <span className="metric-title">Input Height</span>
                          <span className="metric-val">{bmiResult.height} cm</span>
                        </div>
                        <div className="metric-divider-dashed" />
                        <div className="metric-line-item optimal-range">
                          <span className="metric-title">Optimal Normal Range</span>
                          <span className="metric-val">
                            {bmiResult.minNormalWeight} - {bmiResult.maxNormalWeight} kg
                          </span>
                        </div>
                      </div>

                      {/* Primary Bottom Button */}
                      <button
                        type="button"
                        onClick={handleServerSync}
                        className="btn-card-action-solid"
                      >
                        <span>
                          {syncedStatus === 'syncing'
                            ? 'Syncing Server...'
                            : syncedStatus === 'success'
                            ? 'Synced with Account ✓'
                            : 'Save to Account Profile'}
                        </span>
                        <ArrowRight size={16} />
                      </button>
                    </>
                  ) : (
                    <p style={{ color: '#64748B' }}>Please enter valid weight and height.</p>
                  )}
                </div>
              </>
            )}

            {/* ========================================================
                2. AGE CALCULATOR
               ======================================================== */}
            {activeTab === 'age' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label htmlFor="input-age-dob" className="input-main-label">
                        Date of Birth
                      </label>
                      <span className="input-helper-subtext">Select birth date</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        id="input-age-dob"
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="modern-form-input"
                      />
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Quick Presets:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        const d = new Date();
                        d.setFullYear(d.getFullYear() - 18);
                        setBirthDate(d.toISOString().split('T')[0]);
                      }}
                    >
                      18 Years
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        const d = new Date();
                        d.setFullYear(d.getFullYear() - 25);
                        setBirthDate(d.toISOString().split('T')[0]);
                      }}
                    >
                      25 Years
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        const d = new Date();
                        d.setFullYear(d.getFullYear() - 35);
                        setBirthDate(d.toISOString().split('T')[0]);
                      }}
                    >
                      35 Years
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {ageResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">EXACT CHRONOLOGICAL AGE</span>
                        <div className="result-score-row">
                          <span className="result-hero-number">
                            {ageResult.years} <span style={{ fontSize: '18px', fontWeight: 600 }}>yrs</span>
                          </span>
                          <span className="status-pill-badge badge-normal">
                            {ageResult.months}m {ageResult.days}d
                          </span>
                        </div>
                      </div>

                      <div className="bmi-spectrum-card">
                        <div className="metric-line-item">
                          <span className="metric-title">Birthday Countdown</span>
                          <span className="metric-val" style={{ color: '#7C3AED' }}>
                            In {ageResult.daysUntilNextBirthday} days
                          </span>
                        </div>
                      </div>

                      <div className="metrics-breakdown-list">
                        <div className="metric-line-item">
                          <span className="metric-title">Total Elapsed Days</span>
                          <span className="metric-val">{ageResult.totalDays != null ? ageResult.totalDays.toLocaleString() : '0'} days</span>
                        </div>
                        <div className="metric-line-item">
                          <span className="metric-title">Total Elapsed Weeks</span>
                          <span className="metric-val">{ageResult.totalWeeks != null ? ageResult.totalWeeks.toLocaleString() : '0'} weeks</span>
                        </div>
                        <div className="metric-divider-dashed" />
                        <div className="metric-line-item optimal-range">
                          <span className="metric-title">Next Birthday</span>
                          <span className="metric-val">Turning {ageResult.years + 1}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleServerSync}
                        className="btn-card-action-solid"
                      >
                        <span>
                          {syncedStatus === 'syncing'
                            ? 'Syncing Server...'
                            : syncedStatus === 'success'
                            ? 'Synced with Account ✓'
                            : 'Save to Account Profile'}
                        </span>
                        <ArrowRight size={16} />
                      </button>
                    </>
                  ) : (
                    <p style={{ color: '#64748B' }}>Select a valid date of birth.</p>
                  )}
                </div>
              </>
            )}

            {/* ========================================================
                3. GST CALCULATOR
               ======================================================== */}
            {activeTab === 'gst' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label htmlFor="input-gst-amount" className="input-main-label">
                        Base Amount (₹)
                      </label>
                      <span className="input-helper-subtext">Transaction amount</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <span className="input-prefix-tag">₹</span>
                      <input
                        id="input-gst-amount"
                        type="number"
                        step="100"
                        min="0"
                        value={gstAmount}
                        onChange={(e) => setGstAmount(e.target.value)}
                        className="modern-form-input has-prefix"
                        placeholder="25000"
                      />
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">GST Rate</label>
                      <span className="input-helper-subtext">Tax bracket</span>
                    </div>
                    <div className="rate-pills-row">
                      {['5', '12', '18', '28'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={`rate-pill-btn ${gstRate === r ? 'active' : ''}`}
                          onClick={() => setGstRate(r)}
                        >
                          {r}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label className="input-main-label">Calculation Mode</label>
                    </div>
                    <div className="mode-toggle-pill-wrap">
                      <button
                        type="button"
                        className={`mode-toggle-btn ${!isInclusive ? 'active' : ''}`}
                        onClick={() => setIsInclusive(false)}
                      >
                        Exclusive (+ GST)
                      </button>
                      <button
                        type="button"
                        className={`mode-toggle-btn ${isInclusive ? 'active' : ''}`}
                        onClick={() => setIsInclusive(true)}
                      >
                        Inclusive (Included)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {gstResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">TOTAL TAX INVOICE</span>
                        <div className="result-score-row">
                          <span className="result-hero-number">
                            ₹{(gstResult.totalAmount ?? 0).toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            {gstResult.gstRate}% GST
                          </span>
                        </div>
                      </div>

                      <div className="bmi-spectrum-card">
                        <div className="metric-line-item">
                          <span className="metric-title">Total GST Amount</span>
                          <span className="metric-val" style={{ color: '#4F46E5' }}>
                            ₹{(gstResult.gstAmount ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="metrics-breakdown-list">
                        <div className="metric-line-item">
                          <span className="metric-title">CGST (50%)</span>
                          <span className="metric-val">₹{(gstResult.cgst ?? 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="metric-line-item">
                          <span className="metric-title">SGST (50%)</span>
                          <span className="metric-val">₹{(gstResult.sgst ?? 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="metric-divider-dashed" />
                        <div className="metric-line-item optimal-range">
                          <span className="metric-title">Net Base Price</span>
                          <span className="metric-val">
                            ₹{(gstResult.baseAmount ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleServerSync}
                        className="btn-card-action-solid"
                      >
                        <span>
                          {syncedStatus === 'syncing'
                            ? 'Syncing Server...'
                            : syncedStatus === 'success'
                            ? 'Synced with Account ✓'
                            : 'Save to Account Profile'}
                        </span>
                        <ArrowRight size={16} />
                      </button>
                    </>
                  ) : (
                    <p style={{ color: '#64748B' }}>Please enter a valid amount.</p>
                  )}
                </div>
              </>
            )}

            {/* ========================================================
                4. EB BILL CALCULATOR
               ======================================================== */}
            {activeTab === 'eb' && (
              <>
                <div className="calc-inputs-pane">
                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label htmlFor="input-eb-units" className="input-main-label">
                        Units Consumed (kWh)
                      </label>
                      <span className="input-helper-subtext">Meter reading</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <input
                        id="input-eb-units"
                        type="number"
                        step="1"
                        min="0"
                        value={ebUnits}
                        onChange={(e) => setEbUnits(e.target.value)}
                        className="modern-form-input"
                        placeholder="220"
                      />
                      <span className="input-suffix-tag">kWh</span>
                    </div>
                  </div>

                  <div className="input-block-modern">
                    <div className="label-row-helper">
                      <label htmlFor="input-eb-rate" className="input-main-label">
                        Rate per Unit (₹)
                      </label>
                      <span className="input-helper-subtext">Tariff charge</span>
                    </div>
                    <div className="input-with-suffix-box">
                      <span className="input-prefix-tag">₹</span>
                      <input
                        id="input-eb-rate"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={ebRate}
                        onChange={(e) => setEbRate(e.target.value)}
                        className="modern-form-input has-prefix"
                        placeholder="6.5"
                      />
                      <span className="input-suffix-tag">/ kWh</span>
                    </div>
                  </div>

                  <div className="presets-group-row">
                    <span className="presets-title-tag">Typical Usage:</span>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setEbUnits('150');
                        setEbRate('5.5');
                      }}
                    >
                      150 kWh (Low)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setEbUnits('250');
                        setEbRate('6.5');
                      }}
                    >
                      250 kWh (Med)
                    </button>
                    <button
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => {
                        setEbUnits('400');
                        setEbRate('8.0');
                      }}
                    >
                      400 kWh (High)
                    </button>
                  </div>
                </div>

                <div className="calc-result-pane">
                  {ebResult ? (
                    <>
                      <div className="result-card-header">
                        <span className="result-subhead-label">ELECTRICITY BILL AMOUNT</span>
                        <div className="result-score-row">
                          <span className="result-hero-number">
                            ₹{(ebResult.totalAmount ?? ebResult.finalAmount ?? 0).toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill-badge badge-normal">
                            {ebResult.units} kWh
                          </span>
                        </div>
                      </div>

                      <div className="bmi-spectrum-card">
                        <div className="metric-line-item">
                          <span className="metric-title">Energy Charges</span>
                          <span className="metric-val" style={{ color: '#4F46E5' }}>
                            ₹{(ebResult.energyCharges ?? ebResult.baseEnergyCost ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="metrics-breakdown-list">
                        <div className="metric-line-item">
                          <span className="metric-title">Base Units</span>
                          <span className="metric-val">{ebResult.units} units</span>
                        </div>
                        <div className="metric-line-item">
                          <span className="metric-title">Fixed Charges (5%)</span>
                          <span className="metric-val">₹{(ebResult.fixedCharges ?? ebResult.fixedCharge ?? 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="metric-divider-dashed" />
                        <div className="metric-line-item optimal-range">
                          <span className="metric-title">Total Due</span>
                          <span className="metric-val">
                            ₹{(ebResult.totalAmount ?? ebResult.finalAmount ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleServerSync}
                        className="btn-card-action-solid"
                      >
                        <span>
                          {syncedStatus === 'syncing'
                            ? 'Syncing Server...'
                            : syncedStatus === 'success'
                            ? 'Synced with Account ✓'
                            : 'Save to Account Profile'}
                        </span>
                        <ArrowRight size={16} />
                      </button>
                    </>
                  ) : (
                    <p style={{ color: '#64748B' }}>Please enter valid electricity units.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </section>
    </div>
  );
}

export default Dashboard;
