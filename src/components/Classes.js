import { Link } from "react-router-dom";
import classesData from "../data/classesData";

function Classes({ preview = false }) {
  const displayClasses = preview ? classesData.slice(0, 3) : classesData;

  const difficultyColor = {
    Beginner: "#22c55e",
    Intermediate: "#f97316",
    Advanced: "#ef4444"
  };

  return (
    <section className="classes-section" aria-labelledby="classes-heading">
      <div className="section-container">
        <div className="section-header">
          <h2 id="classes-heading" className="section-title">
            {preview ? "Popular Classes" : "All Classes"}
          </h2>
          <p className="section-subtitle">
            From high-intensity cardio to mindful yoga — we have a class for every goal and fitness level.
          </p>
        </div>

        <div className="class-grid">
          {displayClasses.map((cls) => (
            <article className="class-card" key={cls.id}>
              <div className="class-card-img-wrap">
                <img src={cls.image} alt={cls.name} loading="lazy" />
                <span
                  className="difficulty-badge"
                  style={{ backgroundColor: difficultyColor[cls.difficulty] }}
                >
                  {cls.difficulty}
                </span>
              </div>
              <div className="class-card-body">
                <span className="class-category">{cls.category}</span>
                <h3>{cls.name}</h3>
                <p>{cls.description}</p>
                <div className="class-meta">
                  <span>⏱ {cls.duration}</span>
                  <span>👤 {cls.trainer}</span>
                </div>
                <div className="class-benefits">
                  {cls.benefits.map((b, i) => (
                    <span className="benefit-tag" key={i}>{b}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {preview && (
          <div className="section-cta">
            <Link to="/classes" className="btn btn-primary">View All Classes</Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Classes;
