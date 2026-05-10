import { useState } from "react";
import { FaBoxOpen, FaPlus, FaToggleOn, FaToggleOff, FaTrash, FaCog, FaCheckCircle } from "react-icons/fa";
import "../styles/form-modal.css";
import "../styles/user-management.css";

export default function ThirdPartyAppsPage() {
  const [apps, setApps] = useState([
    { id: 1, name: "Stripe Payment", status: "connected", enabled: true, version: "1.2.0", lastSync: "2026-05-06 10:30 AM" },
    { id: 2, name: "Google Analytics", status: "connected", enabled: true, version: "2.0.1", lastSync: "2026-05-06 09:15 AM" },
    { id: 3, name: "Slack Notifications", status: "connected", enabled: false, version: "1.5.0", lastSync: "2026-05-05 03:00 PM" },
    { id: 4, name: "Mailchimp Email", status: "disconnected", enabled: false, version: "1.0.0", lastSync: "Never" },
  ]);

  const [showConfig, setShowConfig] = useState(null);
  const [configData, setConfigData] = useState({});

  const handleToggle = (id) => {
    setApps(apps.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const handleDisconnect = (id) => {
    if (window.confirm("Are you sure you want to disconnect this app?")) {
      setApps(apps.map(a => a.id === id ? { ...a, status: "disconnected", enabled: false } : a));
    }
  };

  const handleOpenConfig = (app) => {
    setShowConfig(app.id);
    setConfigData({ apiKey: "", secret: "", webhookUrl: "" });
  };

  const handleSaveConfig = () => {
    setApps(apps.map(a => a.id === showConfig ? { ...a, status: "connected", lastSync: new Date().toLocaleString() } : a));
    setShowConfig(null);
  };

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaBoxOpen style={{ marginRight: 8 }} />Third-Party Apps</h2>
        <button className="btn btn-primary sa-btn-sm"><FaPlus style={{ marginRight: 6 }} />Browse Apps</button>
      </div>

      <div className="sa-card">
        <div className="sa-card-head"><h3>Connected Apps</h3></div>
        {apps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            <FaBoxOpen style={{ fontSize: "2rem", marginBottom: 12, opacity: 0.5 }} />
            <p>No apps connected yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {apps.map(app => (
              <div key={app.id} style={{ padding: 12, background: "var(--bg-primary)", borderRadius: 8, border: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <strong>{app.name}</strong>
                    <span className={`sa-badge ${app.status === "connected" ? "sa-green" : "sa-gray"}`}>{app.status}</span>
                  </div>
                  <div style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>
                    <span>v{app.version}</span> • <span>Last sync: {app.lastSync}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {app.status === "connected" && (
                    <>
                      <button className="sa-link-btn" onClick={() => handleOpenConfig(app)} title="Configure"><FaCog /></button>
                      <div className={`sa-toggle ${app.enabled ? "sa-toggle-on" : ""}`} onClick={() => handleToggle(app.id)} style={{ cursor: "pointer" }} />
                      <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => handleDisconnect(app.id)} title="Disconnect"><FaTrash /></button>
                    </>
                  )}
                  {app.status === "disconnected" && (
                    <button className="btn btn-outline sa-btn-sm">Connect</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sa-card">
        <div className="sa-card-head"><h3>Available Apps</h3></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {[
            { name: "Twilio SMS", desc: "Send SMS notifications" },
            { name: "AWS S3", desc: "Cloud storage integration" },
            { name: "SendGrid Email", desc: "Email delivery service" },
            { name: "Zapier", desc: "Workflow automation" },
          ].map((app, i) => (
            <div key={i} style={{ padding: 12, background: "var(--bg-primary)", borderRadius: 8, border: "1px solid var(--border-color)", textAlign: "center" }}>
              <strong style={{ display: "block", marginBottom: 4 }}>{app.name}</strong>
              <p style={{ fontSize: ".75rem", color: "var(--text-secondary)", margin: "0 0 8px" }}>{app.desc}</p>
              <button className="btn btn-outline sa-btn-sm" style={{ width: "100%" }}>Install</button>
            </div>
          ))}
        </div>
      </div>

      {showConfig && (
        <div className="sa-modal-overlay" onClick={() => setShowConfig(null)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <div className="sa-modal-head">
              <h3>Configure {apps.find(a => a.id === showConfig)?.name}</h3>
              <button className="sa-modal-close" onClick={() => setShowConfig(null)}>×</button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-form-group">
                <label>API Key</label>
                <input className="sa-input" type="password" value={configData.apiKey} onChange={e => setConfigData({ ...configData, apiKey: e.target.value })} placeholder="Enter API key" />
              </div>
              <div className="sa-form-group">
                <label>Secret</label>
                <input className="sa-input" type="password" value={configData.secret} onChange={e => setConfigData({ ...configData, secret: e.target.value })} placeholder="Enter secret" />
              </div>
              <div className="sa-form-group">
                <label>Webhook URL</label>
                <input className="sa-input" value={configData.webhookUrl} onChange={e => setConfigData({ ...configData, webhookUrl: e.target.value })} placeholder="https://your-domain.com/webhooks" />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-primary sa-btn-sm" onClick={handleSaveConfig}>Save Configuration</button>
                <button className="btn btn-outline sa-btn-sm" onClick={() => setShowConfig(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
