import React from 'react';
import {
  Heart,
  Scale,
  Flame,
  Activity,
  PlusCircle,
  Droplet,
  Moon,
  HeartPulse,
  ArrowRight,
} from 'lucide-react';
import './HealthFitnessSection.css';

export const HEALTH_FITNESS_CALCULATORS = [
  {
    id: 'bmi',
    title: 'BMI Calculator',
    description: 'Body Mass Index and healthy weight range',
    icon: Scale,
    isPopular: true,
  },
  {
    id: 'calorie',
    title: 'Calorie Calculator',
    description: 'Daily calorie needs based on age, height and activity',
    icon: Flame,
    isPopular: true,
  },
  {
    id: 'ideal-weight',
    title: 'Ideal Weight Calculator',
    description: 'Ideal body weight by height and gender',
    icon: Heart,
  },
  {
    id: 'body-fat',
    title: 'Body Fat Calculator',
    description: 'Estimate body fat percentage with Navy method',
    icon: Activity,
  },
  {
    id: 'pregnancy-due-date',
    title: 'Pregnancy Due Date Calculator',
    description: 'Calculate pregnancy due date from LMP',
    icon: PlusCircle,
  },
  {
    id: 'water-intake',
    title: 'Water Intake Calculator',
    description: 'Daily water intake recommendation by weight',
    icon: Droplet,
    isActive: true, // matches top green indicator in user screenshot
  },
  {
    id: 'sleep',
    title: 'Sleep Calculator',
    description: 'Best wake-up times based on sleep cycles',
    icon: Moon,
  },
  {
    id: 'target-heart-rate',
    title: 'Target Heart Rate Calculator',
    description: 'Max and target heart rate zones for workouts',
    icon: HeartPulse,
  },
];

function HealthFitnessSection({ onSelectCalculator }) {
  return (
    <section className="health-fitness-section" id="health-fitness-tools">
      <div className="health-fitness-container">
        {/* Header Row */}
        <div className="health-fitness-header-row">
          <div className="health-fitness-title-group">
            <div className="health-fitness-header-icon-box">
              <Heart size={22} className="health-fitness-header-icon" />
            </div>
            <div>
              <h2 className="health-fitness-section-title">Health & Fitness</h2>
              <span className="health-fitness-section-subtitle">8 calculators</span>
            </div>
          </div>

          <button
            type="button"
            className="health-fitness-view-all-link"
            onClick={() => onSelectCalculator('bmi')}
          >
            <span>View all</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 8 Cards Grid */}
        <div className="health-fitness-cards-grid">
          {HEALTH_FITNESS_CALCULATORS.map((calc) => {
            const IconComponent = calc.icon;
            return (
              <div
                key={calc.id}
                className={`health-fitness-card ${calc.isActive ? 'card-has-emerald-indicator' : ''}`}
                onClick={() => onSelectCalculator(calc.id)}
              >
                {/* Top Row: Icon + Popular Badge */}
                <div className="health-fitness-card-top">
                  <div className="health-fitness-card-icon-wrap">
                    <IconComponent size={20} className="health-fitness-card-icon" />
                  </div>
                  {calc.isPopular && (
                    <span className="health-fitness-popular-pill">Popular</span>
                  )}
                </div>

                {/* Content */}
                <div className="health-fitness-card-body">
                  <h3 className="health-fitness-card-title">{calc.title}</h3>
                  <p className="health-fitness-card-desc">{calc.description}</p>
                </div>

                {/* Action Link */}
                <div className="health-fitness-card-footer">
                  <span className="health-fitness-card-open-link">
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

export default HealthFitnessSection;
