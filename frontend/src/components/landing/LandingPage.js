import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import CalculatorGrid from './CalculatorGrid';
import InteractiveCalculatorPreview from './InteractiveCalculatorPreview';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import CTASection from './CTASection';
import Footer from './Footer';
import './LandingPage.css';

function LandingPage({ token }) {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState('bmi');
  const navigate = useNavigate();

  const handleSelectCalculatorFromGrid = (calcId) => {
    setActiveInteractiveTab(calcId);
    const element = document.getElementById('interactive-preview');
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
        behavior: 'smooth'
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

      {/* Embedded Live Interactive Calculator Preview Workspace */}
      <InteractiveCalculatorPreview
        activeTab={activeInteractiveTab}
        onSelectTab={setActiveInteractiveTab}
        onOpenFullSuite={handleOpenDashboard}
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
