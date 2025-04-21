import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const features = [
    {
      title: 'Expert Language Mentors',
      description: 'Learn from experienced native speakers who are passionate about teaching their language.',
      icon: '🎓'
    },
    {
      title: 'Flexible Learning',
      description: 'Choose your preferred schedule and learning style. Learn at your own pace.',
      icon: '⏰'
    },
    {
      title: 'Multiple Languages',
      description: 'Access mentors for various languages including English, Spanish, French, and more.',
      icon: '🌍'
    },
    {
      title: 'Personalized Approach',
      description: 'Get customized lessons tailored to your goals and current language level.',
      icon: '🎯'
    }
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Language Mentor</h1>
          <p>Connect with expert language mentors and achieve your learning goals</p>
          <Link to="/mentors" className="cta-button">
            Find a Mentor
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="get-started">
        <h2>Ready to Start Your Language Journey?</h2>
        <p>Browse our selection of experienced mentors and take the first step towards language mastery.</p>
        <Link to="/mentors" className="cta-button">
          Get Started Now
        </Link>
      </section>
    </div>
  );
}

export default Home;
