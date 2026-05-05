import { Link } from "react-router-dom";
import { userData, paymentHistory } from "../data/dashboardData";

export default function DashboardBilling() {
  const pct = Math.round((userData.daysLeft / 180) * 100);

  return (
    <div className="db-section">
      <div className="db-section-header">
        <h2>Billing & Payments</h2>
        <Link to="/pricing" className="btn btn-primary db-btn-sm">Renew Membership</Link>
      </div>

      {/* Plan Summary */}
      <div className="db-card db-billing-summary">
        <div className="db-billing-row">
          <div><span>Current Plan</span><strong>{userData.membershipPlan}</strong></div>
          <div><span>Expires</span><strong>{userData.planExpiry}</strong></div>
          <div><span>Days Left</span><strong>{userData.daysLeft} days</strong></div>
          <div><span>Status</span><span className="db-badge badge-green">Active</span></div>
        </div>
        <div className="db-progress-bar-wrap" style={{ marginTop: "1rem" }}>
          <div className="db-progress-bar"><div className="db-progress-fill" style={{ width: `${pct}%` }} /></div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{pct}% remaining</span>
        </div>
      </div>

      {/* Payment History */}
      <div className="db-card">
        <div className="db-card-header"><h3>Payment History</h3></div>
        <table className="db-table">
          <thead>
            <tr><th>Invoice</th><th>Date</th><th>Plan</th><th>Amount</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {paymentHistory.map(p => (
              <tr key={p.id}>
                <td><code style={{ color: "var(--accent)", fontSize: "0.8rem" }}>{p.id}</code></td>
                <td>{p.date}</td>
                <td>{p.plan}</td>
                <td><strong>{p.amount}</strong></td>
                <td><span className="db-badge badge-green">{p.status}</span></td>
                <td><button className="db-btn-link">⬇ PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
