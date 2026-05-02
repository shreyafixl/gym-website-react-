import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero" aria-label="Hero section">
      <div className="hero-content">
        <span className="hero-badge">🏆 #1 Rated Gym in the City</span>
        <h1 className="hero-title">
          Transform Your Body,<br />
          <span className="hero-accent">Build Your Strength</span>
        </h1>
        <p className="hero-subtitle">
          Join a modern gym with certified trainers, premium equipment, and flexible
          fitness programs designed to help you reach your goals — faster.
        </p>

        <div className="hero-cta-group">
          <Link to="/classes" className="btn btn-primary">
            Explore Classes
          </Link>
          <Link to="/pricing" className="btn btn-secondary">
            View Membership Plans
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <strong>5,000+</strong>
            <span>Active Members</span>
          </div>
          <div className="hero-stat">
            <strong>50+</strong>
            <span>Expert Trainers</span>
          </div>
          <div className="hero-stat">
            <strong>100+</strong>
            <span>Weekly Classes</span>
          </div>
          <div className="hero-stat">
            <strong>10+</strong>
            <span>Years of Excellence</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
