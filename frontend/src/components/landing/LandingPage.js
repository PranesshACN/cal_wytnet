import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
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
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleExploreCalculators = () => {
    const element = document.getElementById('calculators');
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

      {/* 4 Calculator Cards Collection */}
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
