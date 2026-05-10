import { useState } from "react";
import { FaPlug, FaKey, FaSync, FaTrash, FaCopy, FaCheckCircle } from "react-icons/fa";
import "../styles/form-modal.css";
import "../styles/user-management.css";

export default function ApiSettingsPage() {
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "Production API Key", key: "sk_live_51234567890abcdef", created: "2026-01-15", lastUsed: "2026-05-06", status: "active" },
    { id: 2, name: "Development API Key", key: "sk_test_98765432109fedcba", created: "2026-02-20", lastUsed: "2026-05-05", status: "active" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copied, setCopied] = useState(null);

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const newKey = `sk_${Math.random().toString(36).substr(2, 20)}`;
    setApiKeys([...apiKeys, {
      id: Date.now(),
      name: newKeyName,
      key: newKey,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      status: "active"
    }]);
    setNewKeyName("");
    setShowForm(false);
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRevokeKey = (id) => {
    if (window.confirm("Are you sure you want to revoke this API key?")) {
      setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: "revoked" } : k));
    }
  };

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaPlug style={{ marginRight: 8 }} />API Settings</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => setShowForm(true)}><FaKey style={{ marginRight: 6 }} />Generate New Key</button>
      </div>

      <div className="sa-card">
        <div className="sa-card-head"><h3>API Keys</h3></div>
        {apiKeys.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
            <FaKey style={{ fontSize: "2rem", marginBottom: 12, opacity: 0.5 }} />
            <p>No API keys generated yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {apiKeys.map(k => (
              <div key={k.id} style={{ padding: 12, background: "var(--bg-primary)", borderRadius: 8, border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <strong>{k.name}</strong>
                    <span className={`sa-badge ${k.status === "active" ? "sa-green" : "sa-gray"}`} style={{ marginLeft: 8 }}>{k.status}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="sa-link-btn" onClick={() => handleCopyKey(k.key)} title="Copy key">
                      {copied === k.key ? <FaCheckCircle style={{ color: "#22c55e" }} /> : <FaCopy />}
                    </button>
                    <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => handleRevokeKey(k.id)} title="Revoke key"><FaTrash /></button>
                  </div>
                </div>
                <code style={{ display: "block", padding: 8, background: "rgba(0,0,0,.2)", borderRadius: 4, fontSize: ".75rem", wordBreak: "break-all", marginBottom: 8 }}>{k.key}</code>
                <div style={{ display: "flex", gap: 16, fontSize: ".75rem", color: "var(--text-secondary)" }}>
                  <span>Created: {k.created}</span>
                  <span>Last Used: {k.lastUsed}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sa-card">
        <div className="sa-card-head"><h3>API Configuration</h3></div>
        <div className="sa-form-group">
          <label>API Base URL</label>
          <input className="sa-input" defaultValue="https://api.fitzone.com/v1" readOnly />
        </div>
        <div className="sa-form-group">
          <label>Rate Limit (requests/minute)</label>
          <input className="sa-input" type="number" defaultValue="1000" />
        </div>
        <div className="sa-form-group">
          <label>Webhook URL</label>
          <input className="sa-input" placeholder="https://your-domain.com/webhooks" />
        </div>
        <button className="btn btn-primary sa-btn-sm" style={{ marginTop: 8 }}>Save Configuration</button>
      </div>

      {showForm && (
        <div className="sa-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="sa-modal" onClick={e => e.stopPropagation()}>
            <div className="sa-modal-head">
              <h3>Generate New API Key</h3>
              <button className="sa-modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="sa-modal-body">
              <div className="sa-form-group">
                <label>Key Name *</label>
                <input className="sa-input" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="e.g., Production API Key" />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-primary sa-btn-sm" onClick={handleGenerateKey}>Generate Key</button>
                <button className="btn btn-outline sa-btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
