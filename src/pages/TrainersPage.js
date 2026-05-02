import { Link } from "react-router-dom";
import trainersData from "../data/trainersData";

function TrainersPage() {
  return (
    <main className="trainers-page">

      <section className="page-hero" aria-labelledby="trainers-heading">
        <div className="section-container">
          <h1 id="trainers-heading">Meet Our Expert Trainers</h1>
          <p>
            Our certified coaches bring years of experience, passion, and proven results.
            They are here to guide, motivate, and push you to your best.
          </p>
        </div>
      </section>

      <section className="trainers-content-section" aria-labelledby="trainers-list-heading">
        <div className="section-container">
          <h2 id="trainers-list-heading" className="sr-only">Trainer Profiles</h2>
          <div className="trainers-grid">
            {trainersData.map((trainer) => (
              <article className="trainer-card" key={trainer.id}>
                <div className="trainer-card-img-wrap">
                  <img src={trainer.image} alt={`${trainer.name}, ${trainer.specialization} trainer`} loading="lazy" />
                </div>
                <div className="trainer-card-body">
                  <h3>{trainer.name}</h3>
                  <span className="trainer-specialization">{trainer.specialization}</span>
                  <div className="trainer-meta">
                    <span>🏅 {trainer.experience} Experience</span>
                    <span>📜 {trainer.certification}</span>
                  </div>
                  <p className="trainer-bio">{trainer.bio}</p>
                  <a
                    href={trainer.social}
                    className="btn btn-outline trainer-social-btn"
                    aria-label={`View ${trainer.name}'s social profile`}
                  >
                    View Profile
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner" aria-labelledby="trainers-cta-heading">
        <div className="section-container cta-banner-content">
          <h2 id="trainers-cta-heading">Train with the Best</h2>
          <p>Book a personal training session and start your transformation today.</p>
          <Link to="/contact" className="btn btn-primary">Book a Session</Link>
        </div>
      </section>

    </main>
  );
}

export default TrainersPage;
