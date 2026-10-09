import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FinanceLoanSection from './FinanceLoanSection';
import InvestmentSection from './InvestmentSection';
import TaxSalarySection from './TaxSalarySection';
import HealthFitnessSection from './HealthFitnessSection';
import CalculatorGrid from './CalculatorGrid';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import CTASection from './CTASection';
import Footer from './Footer';
import './LandingPage.css';

function LandingPage({ token }) {
  const navigate = useNavigate();

  const handleSelectCalculatorFromGrid = (calcId) => {
    if (token) {
      navigate(`/dashboard?tool=${calcId}`);
    } else {
      navigate(`/login?redirect=/dashboard?tool=${calcId}`);
    }
  };

  const handleExploreCalculators = () => {
    const element = document.getElementById('finance-tools') || document.getElementById('calculators');
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleOpenDashboard = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page-root">
      {/* Sticky Glassmorphic Navbar */}
      <Navbar token={token} />

      {/* Hero Section with Floating UI Composition */}
      <HeroSection
        onExploreCalculators={handleExploreCalculators}
        onOpenDashboard={handleOpenDashboard}
      />

      {/* Finance & Loan 10 Calculators Section */}
      <FinanceLoanSection
        onSelectCalculator={handleSelectCalculatorFromGrid}
      />

      {/* Investment 5 Calculators Section */}
      <InvestmentSection
        onSelectCalculator={handleSelectCalculatorFromGrid}
      />

      {/* Tax & Salary 5 Calculators Section */}
      <TaxSalarySection
        onSelectCalculator={handleSelectCalculatorFromGrid}
      />

      {/* Health & Fitness 8 Calculators Section */}
      <HealthFitnessSection
        onSelectCalculator={handleSelectCalculatorFromGrid}
      />

      {/* Everyday Utilities Toolkit */}
      <CalculatorGrid
        onSelectCalculator={handleSelectCalculatorFromGrid}
      />

      {/* Core Fintech Features Section */}
      <FeaturesSection />

      {/* 3-Step Process: How It Works */}
      <HowItWorksSection />

      {/* Final Gradient CTA Section */}
      <CTASection
        onExplore={handleExploreCalculators}
        onGoToDashboard={handleOpenDashboard}
      />

      {/* Clean Fintech Footer */}
      <Footer token={token} />
    </div>
  );
}

export default LandingPage;
