import React from 'react';
import {
  MoreVertical,
  ArrowUpRight,
  Receipt,
  Zap,
  Activity,
  FileText,
  Star,
  TrendingUp,
  Percent,
} from 'lucide-react';

function HeroPhoneShowcase() {
  return (
    <div className="trovix-phone-composition-wrapper" aria-label="Kalzy Interactive Mobile Showcase">
      {/* Background ambient lighting */}
      <div className="trovix-center-glow" />

      {/* Outer Floating Layout */}
      <div className="trovix-floating-container">
        {/* Floating Card: Top-Left User Reviews Pill */}
        <div className="float-card pill-users-review">
          <div className="avatar-stack">
            <span className="avatar-circle av-1">AJ</span>
            <span className="avatar-circle av-2">SR</span>
            <span className="avatar-circle av-3">MK</span>
          </div>
          <div className="users-review-text">
            <span className="review-title">12,000+</span>
            <span className="review-sub">users review</span>
          </div>
          <div className="gold-star-badge">
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
          </div>
        </div>

        {/* Floating Card: Top-Right Balance / EB Energy */}
        <div className="float-card card-top-balance">
          <div className="balance-icon-wrap">
            <FileText size={18} className="text-emerald" />
          </div>
          <div className="balance-content">
            <div className="balance-top-row">
              <span className="balance-label">Balance</span>
              <MoreVertical size={13} className="more-menu-icon" />
            </div>
            <span className="balance-amount">₹32,300.00</span>
          </div>
        </div>

        {/* Floating Card: Bottom-Left Gauge Card (BMI Health / Metric Fund) */}
        <div className="float-card card-gauge-wellness">
          <div className="card-mini-head">
            <span className="card-mini-title">Wellness Fund</span>
            <MoreVertical size={13} className="more-menu-icon" />
          </div>
          {/* Semicircular SVG Gauge */}
          <div className="svg-gauge-box">
            <svg viewBox="0 0 160 90" className="gauge-svg">
              <path
                d="M 20 80 A 60 60 0 0 1 140 80"
                fill="none"
                stroke="#EDE9FE"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 20 80 A 60 60 0 0 1 140 80"
                fill="none"
                stroke="url(#violetGaugeGrad)"
                strokeWidth="14"
                strokeDasharray="188.5"
                strokeDashoffset="82"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="violetGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="gauge-center-stat">
              <span className="gauge-percentage">43%</span>
              <span className="gauge-sub">$4,200<span className="gauge-sub-max">/$10,000</span></span>
            </div>
          </div>
        </div>

        {/* Floating Card: Inner-Left Targets Met / Calculation Hit-Rates */}
        <div className="float-card card-targets-met">
          <div className="card-mini-head">
            <span className="card-mini-title">Targets met</span>
            <div className="trend-arrow-green">
              <ArrowUpRight size={13} />
            </div>
          </div>

          <div className="targets-item-row">
            <div className="target-icon-wrap bg-amber-light">
              <TrendingUp size={15} className="text-amber" />
            </div>
            <div className="target-info">
              <span className="target-bold-num">68%</span>
              <span className="target-sub-desc">In this year's hit rate</span>
            </div>
            <MoreVertical size={12} className="more-menu-icon" />
          </div>

          <div className="targets-item-row">
            <div className="target-icon-wrap bg-violet-light">
              <Percent size={15} className="text-violet" />
            </div>
            <div className="target-info">
              <span className="target-bold-num">48%</span>
              <span className="target-sub-desc">The best deals for this year</span>
            </div>
            <MoreVertical size={12} className="more-menu-icon" />
          </div>
        </div>

        {/* =================================================================
            CENTER PHONE MOCKUP (iPhone with Dynamic Island & Inside UI)
            ================================================================= */}
        <div className="phone-device-frame">
          {/* Outer bezel highlights & speaker */}
          <div className="phone-outer-bezel">
            <div className="phone-screen-glass">
              {/* Status bar */}
              <div className="phone-status-bar">
                <span className="phone-time">9:41</span>
                <div className="dynamic-island-pill">
                  <div className="dynamic-camera-lens" />
                </div>
                <div className="phone-signals">
                  <span className="signal-bars">•••</span>
                  <span className="wifi-icon">📶</span>
                  <span className="battery-icon">🔋</span>
                </div>
              </div>

              {/* Inside Phone Content */}
              <div className="phone-inner-content">
                {/* Header User Profile */}
                <div className="phone-user-header">
                  <div className="phone-user-left">
                    <div className="phone-avatar-thumb">
                      <span>AG</span>
                    </div>
                    <div className="phone-user-meta">
                      <span className="phone-username">Ahmad Gouse</span>
                      <span className="phone-user-status">Verified Kalzy User</span>
                    </div>
                  </div>
                  <div className="phone-notif-bell">
                    <span className="notif-dot" />
                    <span>🔔</span>
                  </div>
                </div>

                {/* In-Phone Mini Widget Card */}
                <div className="phone-calc-hero-card">
                  <span className="phone-widget-tag">Quick Kalzy </span>
                  <div className="phone-widget-val-row">
                    <span className="phone-widget-big">₹59,000.00</span>
                    <span className="phone-widget-badge">18% GST</span>
                  </div>
                  <div className="phone-widget-bar">
                    <div className="phone-bar-fill" />
                  </div>
                </div>

                {/* 3 Metric Summary Chips */}
                <div className="phone-stat-chips-row">
                  <div className="phone-stat-chip">
                    <span className="chip-num">5 yr+</span>
                    <span className="chip-lbl">Experience</span>
                  </div>
                  <div className="phone-stat-chip">
                    <span className="chip-num">320,000</span>
                    <span className="chip-lbl">Users</span>
                  </div>
                  <div className="phone-stat-chip">
                    <span className="chip-num">4.9</span>
                    <span className="chip-lbl">Ratings</span>
                  </div>
                </div>

                {/* Bottom App Bar / CTA */}
                <div className="phone-bottom-action">
                  <button type="button" className="phone-action-btn">
                    <span>Let's Calculate</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Card: Center-Right Transactions / Calculations List */}
        <div className="float-card card-transactions-list">
          <div className="card-mini-head">
            <span className="card-mini-title">Transaction</span>
            <MoreVertical size={13} className="more-menu-icon" />
          </div>

          <div className="trans-items-col">
            <div className="trans-row">
              <div className="trans-icon-box bg-violet-soft">
                <Receipt size={14} className="text-violet" />
              </div>
              <div className="trans-desc-box">
                <span className="trans-name">Donate to local</span>
                <span className="trans-sub">The best deals for this year</span>
              </div>
              <span className="trans-cost text-rose">-$14.00</span>
            </div>

            <div className="trans-row">
              <div className="trans-icon-box bg-amber-soft">
                <Zap size={14} className="text-amber" />
              </div>
              <div className="trans-desc-box">
                <span className="trans-name">Half sleave a t-shirt</span>
                <span className="trans-sub">The best deals for this year</span>
              </div>
              <span className="trans-cost text-emerald">+$13.00</span>
            </div>

            <div className="trans-row">
              <div className="trans-icon-box bg-orange-soft">
                <Activity size={14} className="text-orange" />
              </div>
              <div className="trans-desc-box">
                <span className="trans-name">Fried Chicken oregano</span>
                <span className="trans-sub">The best deals for this year</span>
              </div>
              <span className="trans-cost text-emerald">+$15.00</span>
            </div>
          </div>
        </div>

        {/* Floating Card: Far-Right Income Summary Card */}
        <div className="float-card card-income-summary">
          <div className="card-mini-head">
            <span className="card-mini-title">Income</span>
            <MoreVertical size={13} className="more-menu-icon" />
          </div>
          <div className="income-amount-display">
            $12,350.00
          </div>
          <div className="income-trend-row">
            <div className="trend-badge-emerald">
              <ArrowUpRight size={12} />
              <span>5.4%</span>
            </div>
            <span className="income-trend-text">vs previous months</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroPhoneShowcase;
