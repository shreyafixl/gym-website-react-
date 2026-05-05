import { useState } from "react";
import { assignedTrainer } from "../data/dashboardData";

export default function DashboardTrainer() {
  const t = assignedTrainer;
  const [msgs, setMsgs] = useState(t.messages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMsgs(prev => [...prev, { from: "user", text: input, time: "Just now" }]);
    setInput("");
    setTimeout(() => {
      setMsgs(prev => [...prev, { from: "trainer", text: "Got it! I'll keep that in mind for our next session 💪", time: "Just now" }]);
    }, 1000);
  };

  return (
    <div className="db-section">
      <div className="db-section-header"><h2>My Trainer</h2></div>

      <div className="db-trainer-full-card db-card">
        <img src={t.image} alt={t.name} className="db-trainer-img" />
        <div className="db-trainer-details">
          <h3>{t.name}</h3>
          <span className="db-trainer-spec">{t.specialization}</span>
          <div className="db-trainer-badges">
            <span className="db-badge badge-blue">🏅 {t.experience}</span>
            <span className="db-badge badge-green">⭐ {t.rating} Rating</span>
            <span className="db-badge badge-blue">🏋️ {t.totalSessions} Sessions</span>
          </div>
          <p className="db-trainer-cert">📜 {t.certification}</p>
          <div className="db-next-session-box">
            <span>📅 Next Session</span>
            <strong>{t.nextSession}</strong>
          </div>
          <div className="db-trainer-btns">
            <button className="btn btn-primary">📅 Book PT Session</button>
            <button className="btn btn-outline">📋 View Program</button>
          </div>
        </div>
      </div>

      <div className="db-card db-chat-card">
        <div className="db-card-header">
          <h3>💬 Message {t.name.split(" ")[0]}</h3>
          <span className="db-badge badge-green">● Online</span>
        </div>
        <div className="db-messages">
          {msgs.map((m, i) => (
            <div key={i} className={`db-msg ${m.from === "user" ? "db-msg-user" : "db-msg-trainer"}`}>
              {m.from === "trainer" && <div className="db-msg-avatar">V</div>}
              <div className="db-msg-wrap">
                <div className="db-msg-bubble">{m.text}</div>
                <span className="db-msg-time">{m.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="db-msg-input-row">
          <input className="db-input" placeholder="Type a message..." value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()} />
          <button className="btn btn-primary db-btn-sm" onClick={send}>Send ➤</button>
        </div>
      </div>
    </div>
  );
}
