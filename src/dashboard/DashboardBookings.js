import { useState, useCallback } from "react";
import { upcomingBookings } from "../data/dashboardData";
import classesData from "../data/classesData";

export default function DashboardBookings() {
  const [bookings, setBookings] = useState(upcomingBookings);
  const [showBook, setShowBook] = useState(false);
  const [booked, setBooked]     = useState(null);

  const cancelBooking = useCallback((id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  }, []);

  const bookClass = useCallback((cls) => {
    const newBooking = {
      id: Date.now(),
      date: "2026-05-12",
      time: "07:00 AM",
      class: cls.name,
      trainer: cls.trainer,
      duration: cls.duration,
      status: "confirmed",
      type: "class",
    };
    setBookings(prev => [...prev, newBooking]);
    setBooked(cls.name);
    setShowBook(false);
    setTimeout(() => setBooked(null), 3000);
  }, []);

  return (
    <div className="db-section">
      <div className="db-section-header">
        <h2>My Bookings</h2>
        <button className="btn btn-primary" onClick={() => setShowBook(s => !s)}>
          {showBook ? "✕ Close" : "+ Book New Class"}
        </button>
      </div>

      {booked && (
        <div className="db-toast">✅ Successfully booked <strong>{booked}</strong>!</div>
      )}

      {/* Book New Class Panel */}
      {showBook && (
        <div className="db-book-panel">
          <h3>Available Classes</h3>
          <div className="db-book-grid">
            {classesData.slice(0, 6).map(cls => (
              <div className="db-book-card" key={cls.id}>
                <img src={cls.image} alt={cls.name} />
                <div className="db-book-info">
                  <strong>{cls.name}</strong>
                  <span>{cls.trainer} · {cls.duration}</span>
                  <span className="db-difficulty">{cls.difficulty}</span>
                </div>
                <button className="btn btn-primary" onClick={() => bookClass(cls)}>Book</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Bookings */}
      <h3 className="db-sub-heading">Upcoming Sessions</h3>
      {bookings.length === 0 ? (
        <p className="db-empty">No upcoming bookings. Book a class above!</p>
      ) : (
        <div className="db-bookings-list">
          {bookings.map(b => (
            <div className="db-booking-item" key={b.id}>
              <div className="db-booking-type-icon">
                {b.type === "pt" ? "🏅" : "🏃"}
              </div>
              <div className="db-booking-details">
                <strong>{b.class}</strong>
                <span>👤 {b.trainer}</span>
                <span>📅 {b.date} · ⏰ {b.time} · ⏱ {b.duration}</span>
              </div>
              <div className="db-booking-right">
                <span className={`db-status db-status--${b.status}`}>{b.status}</span>
                <button
                  className="db-cancel-btn"
                  onClick={() => cancelBooking(b.id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
