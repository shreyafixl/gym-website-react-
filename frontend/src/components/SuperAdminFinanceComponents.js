import { useState, useEffect, useCallback } from 'react';
import {
  FaReceipt, FaChartBar, FaWrench, FaSearch, FaDownload,
  FaCheckCircle, FaExclamationCircle, FaTimesCircle,
  FaMoneyBillWave, FaChartLine, FaChartPie, FaCodeBranch,
} from 'react-icons/fa';
import BillingService from '../services/superadmin/BillingService';
import RevenueService from '../services/superadmin/RevenueService';
import MaintenanceService from '../services/superadmin/MaintenanceService';

// Helper components (assuming these exist in the main file)
const SABadge = ({ s }) => {
  const m = {
    active: "sa-green", inactive: "sa-gray", planned: "sa-yellow", new: "sa-blue",
    member: "sa-blue", trainer: "sa-orange", admin: "sa-purple", superadmin: "sa-red",
    reception: "sa-gray", success: "sa-green", failed: "sa-red", refunded: "sa-yellow",
    working: "sa-green", maintenance: "sa-yellow", broken: "sa-red",
    open: "sa-red", "in-progress": "sa-yellow", closed: "sa-green",
    high: "sa-red", medium: "sa-yellow", low: "sa-blue",
    completed: "sa-green", pending: "sa-yellow", blocked: "sa-red",
    expiring: "sa-yellow", expired: "sa-gray", draft: "sa-gray",
    error: "sa-red", warning: "sa-yellow", info: "sa-blue", system: "sa-purple",
    enabled: "sa-green", disabled: "sa-gray",
    production: "sa-green", beta: "sa-yellow", alpha: "sa-orange",
  };
  return <span className={`sa-badge ${m[s] || "sa-gray"}`}>{s}</span>;
};

const KpiCard = ({ icon, label, value, change, color, trend }) => (
  <div className="sa-kpi-card" style={{ borderLeftColor: color }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: ".75rem", color: "var(--text-secondary)", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>{value}</div>
        {change && <div style={{ fontSize: ".75rem", color: trend === "up" ? "#22c55e" : "#ef4444", marginTop: 4 }}>{change}</div>}
      </div>
      <div style={{ fontSize: "1.5rem", color, opacity: 0.3 }}>{icon}</div>
    </div>
  </div>
);

const EmptyState = ({ icon, title, desc }) => (
  <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-secondary)" }}>
    <div style={{ fontSize: "3rem", marginBottom: 12, opacity: 0.5 }}>{icon}</div>
    <h3 style={{ marginBottom: 8, color: "var(--text-primary)" }}>{title}</h3>
    <p style={{ fontSize: ".9rem" }}>{desc}</p>
  </div>
);

const LoadingState = () => (
  <div style={{ textAlign: "center", padding: "40px 20px" }}>
    <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
    <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
  </div>
);

const Pagination = ({ total, page, perPage, onChange }) => {
  const totalPages = Math.ceil(total / perPage);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, fontSize: ".85rem", color: "var(--text-secondary)" }}>
      <span>Page {page} of {totalPages}</span>
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={page === 1} onClick={() => onChange(page - 1)} className="sa-btn-sm">← Prev</button>
        <button disabled={page === totalPages} onClick={() => onChange(page + 1)} className="sa-btn-sm">Next →</button>
      </div>
    </div>
  );
};

// ─── BILLING COMPONENT ────────────────────────────────────────────────────────
export function SABillingIntegrated({ subscriptions = [] }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billingData, setBillingData] = useState([]);
  const PER = 5;

  // Fetch billing data on mount
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await BillingService.getAll({ page: 1, perPage: 100 });
        if (response?.data) {
          setBillingData(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Error fetching billing data:", err);
        setError("Failed to load billing records");
      } finally {
        setLoading(false);
      }
    };
    fetchBillingData();
  }, []);

  // Use real data or fallback to props
  const dataSource = billingData.length > 0 ? billingData : subscriptions;
  const subsArray = Array.isArray(dataSource) ? dataSource : [];

  const filtered = subsArray.filter(s => {
    try {
      return (filter === "all" || s?.status === filter) &&
        ((s?.user || "").toLowerCase().includes(search.toLowerCase()));
    } catch (e) {
      console.error("Error filtering billing records:", e);
      return false;
    }
  });
  const paged = filtered.slice((page - 1) * PER, page * PER);
  const active = subsArray.filter(s => s?.status === "active").length;
  const expired = subsArray.filter(s => s?.status === "expired").length;
  const expiring = subsArray.filter(s => s?.status === "expiring").length;

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaReceipt style={{ marginRight: 8 }} />Billing</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export</button>
      </div>
      {error && <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "16px" }}>{error}</div>}
      {loading && <LoadingState />}
      {!loading && (
        <>
          <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <KpiCard icon={<FaCheckCircle />} label="Active Subscriptions" value={active} color="#22c55e" />
            <KpiCard icon={<FaExclamationCircle />} label="Expiring Soon" value={expiring} color="#f97316" change="Within 7 days" trend="down" />
            <KpiCard icon={<FaTimesCircle />} label="Expired Plans" value={expired} color="#ef4444" />
          </div>
          <div className="sa-filters">
            <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search member..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            {["all", "active", "expiring", "expired"].map(f => (
              <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
            ))}
          </div>
          <div className="sa-card">
            {subsArray.length === 0 ? (
              <EmptyState icon={<FaReceipt />} title="No Billing Records" desc="No billing records found. Create one to get started." />
            ) : (
              <>
                <table className="sa-table">
                  <thead><tr><th>Member</th><th>Plan</th><th>Start</th><th>Expiry</th><th>Days Left</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {paged.map(s => (
                      <tr key={s.id || s._id}>
                        <td><strong>{s.user || "—"}</strong></td>
                        <td>{s.plan || "—"}</td>
                        <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{s.start || "—"}</td>
                        <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{s.expiry || "—"}</td>
                        <td>
                          <span style={{ color: (s.daysLeft || 0) <= 7 ? "#ef4444" : (s.daysLeft || 0) <= 30 ? "#f97316" : "#22c55e", fontWeight: 700 }}>
                            {(s.daysLeft || 0) > 0 ? `${s.daysLeft}d` : "—"}
                          </span>
                        </td>
                        <td><SABadge s={s.status || "pending"} /></td>
                        <td><button className="sa-link-btn">Renew</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── REVENUE COMPONENT ────────────────────────────────────────────────────────
export function SARevenueIntegrated({ financialReports = { monthly: [] } }) {
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState(null);

  // Fetch revenue data on mount and when period changes
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [summary, trends] = await Promise.all([
          RevenueService.getRevenueSummary({ period }),
          RevenueService.getRevenueTrends(30),
        ]);
        setRevenueData({ summary, trends });
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError("Failed to load revenue data");
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueData();
  }, [period]);

  // Use real data or fallback to props
  const reports = revenueData?.summary || financialReports || {};
  const data = Array.isArray(reports.monthly) ? reports.monthly : [];

  const maxRev = data.length > 0 ? Math.max(...data.map(d => d?.revenue || 0)) : 1;
  const totalRev = data.reduce((a, b) => a + (b?.revenue || 0), 0);
  const totalProfit = data.reduce((a, b) => a + (b?.profit || 0), 0);

  // Safe defaults for optional data
  const branchRevenue = reports.branchRevenue || [
    { branch: "FitZone Main", revenue: 42800 },
    { branch: "FitZone North", revenue: 38500 },
    { branch: "FitZone South", revenue: 35200 },
  ];

  const forecast = reports.forecast || [
    { month: "Jun", forecast: 58000, actual: true },
    { month: "Jul", forecast: 60000, actual: false },
    { month: "Aug", forecast: 62000, actual: false },
    { month: "Sep", forecast: 64000, actual: false },
  ];

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaChartBar style={{ marginRight: 8 }} />Revenue</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["monthly", "quarterly", "yearly"].map(p => (
            <button key={p} className={`sa-filter-btn ${period === p ? "sa-filter-active" : ""}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>
      {error && <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "16px" }}>{error}</div>}
      {loading && <LoadingState />}
      {!loading && (
        <>
          <div className="sa-kpi-grid">
            <KpiCard icon={<FaMoneyBillWave />} label="Total Revenue (12mo)" value={`${(totalRev / 1000).toFixed(0)}k`} color="#22c55e" change="+22% YoY" trend="up" />
            <KpiCard icon={<FaChartLine />} label="Net Profit (12mo)" value={`${(totalProfit / 1000).toFixed(0)}k`} color="#3b82f6" change="+18% YoY" trend="up" />
            <KpiCard icon={<FaChartPie />} label="Avg Monthly Revenue" value={`${data.length > 0 ? (totalRev / data.length / 1000).toFixed(1) : 0}k`} color="#8b5cf6" />
            <KpiCard icon={<FaCodeBranch />} label="Best Branch" value="FitZone Main" color="#f97316" change="$42.8K/mo" />
          </div>
          <div className="sa-two-col">
            <div className="sa-card">
              <div className="sa-card-head"><h3>Revenue vs Expenses</h3></div>
              <div className="sa-bar-chart" style={{ height: 140 }}>
                {data.map((v, i) => (
                  <div className="sa-bar-col" key={i}>
                    <div style={{ display: "flex", gap: 1, alignItems: "flex-end", height: "100%" }}>
                      <div className="sa-bar" style={{ height: `${(v.revenue / maxRev) * 100}%`, background: "#ef4444", flex: 1 }} />
                      <div className="sa-bar" style={{ height: `${((v.expenses || 0) / maxRev) * 100}%`, background: "#3b82f6", flex: 1 }} />
                    </div>
                    <span className="sa-bar-label">{v.month}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: ".75rem" }}>
                <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#ef4444", borderRadius: 2, marginRight: 4 }} />Revenue</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#3b82f6", borderRadius: 2, marginRight: 4 }} />Expenses</span>
              </div>
            </div>
            <div className="sa-card">
              <div className="sa-card-head"><h3>Branch-wise Revenue</h3></div>
              {branchRevenue.map((b, i) => {
                const max = Math.max(...branchRevenue.map(x => x.revenue || 0));
                return (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".82rem", marginBottom: 4 }}>
                      <span>{b.branch}</span><strong>${(b.revenue / 1000).toFixed(1)}k</strong>
                    </div>
                    <div style={{ background: "var(--bg-primary)", borderRadius: 4, height: 8 }}>
                      <div style={{ width: `${(b.revenue / max) * 100}%`, height: "100%", background: "#ef4444", borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="sa-card">
            <div className="sa-card-head"><h3>Revenue Forecast (Next 4 Months)</h3></div>
            <div className="sa-bar-chart" style={{ height: 120 }}>
              {forecast.map((f, i) => {
                const max = 65000;
                return (
                  <div className="sa-bar-col" key={i}>
                    <span className="sa-bar-val">${(f.forecast / 1000).toFixed(0)}k</span>
                    <div className="sa-bar" style={{ height: `${(f.forecast / max) * 100}%`, background: f.actual ? "#ef4444" : "#8b5cf6", opacity: f.actual ? 1 : 0.6 }} />
                    <span className="sa-bar-label">{f.month}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: ".75rem", color: "var(--text-secondary)", marginTop: 8 }}>
              <span style={{ display: "inline-block", width: 10, height: 10, background: "#ef4444", borderRadius: 2, marginRight: 4 }} />Actual
              <span style={{ display: "inline-block", width: 10, height: 10, background: "#8b5cf6", borderRadius: 2, marginRight: 4, marginLeft: 12 }} />Forecast
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAINTENANCE COMPONENT ───────────────────────────────────────────────────
export function SAMaintenanceIntegrated() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const PER = 5;

  // Fetch maintenance data on mount
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await MaintenanceService.getMaintenanceRecords(1, 100);
        if (response?.data) {
          setMaintenanceData(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Error fetching maintenance data:", err);
        setError("Failed to load maintenance records");
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenanceData();
  }, []);

  const maintenanceArray = Array.isArray(maintenanceData) ? maintenanceData : [];

  const filtered = maintenanceArray.filter(m => {
    try {
      return (filter === "all" || m?.status === filter) &&
        ((m?.equipment || "").toLowerCase().includes(search.toLowerCase()));
    } catch (e) {
      console.error("Error filtering maintenance records:", e);
      return false;
    }
  });
  const paged = filtered.slice((page - 1) * PER, page * PER);
  const pending = maintenanceArray.filter(m => m?.status === "pending").length;
  const inProgress = maintenanceArray.filter(m => m?.status === "in-progress").length;
  const completed = maintenanceArray.filter(m => m?.status === "completed").length;

  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaWrench style={{ marginRight: 8 }} />Maintenance</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export</button>
      </div>
      {error && <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "16px" }}>{error}</div>}
      {loading && <LoadingState />}
      {!loading && (
        <>
          <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            <KpiCard icon={<FaExclamationCircle />} label="Pending" value={pending} color="#f97316" />
            <KpiCard icon={<FaCheckCircle />} label="In Progress" value={inProgress} color="#3b82f6" />
            <KpiCard icon={<FaCheckCircle />} label="Completed" value={completed} color="#22c55e" />
          </div>
          <div className="sa-filters">
            <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search equipment..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
            {["all", "pending", "in-progress", "completed"].map(f => (
              <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
            ))}
          </div>
          <div className="sa-card">
            {maintenanceArray.length === 0 ? (
              <EmptyState icon={<FaWrench />} title="No Maintenance Records" desc="No maintenance records found. Create one to get started." />
            ) : (
              <>
                <table className="sa-table">
                  <thead><tr><th>Equipment</th><th>Type</th><th>Technician</th><th>Date</th><th>Cost</th><th>Status</th><th>Action</th></tr></thead>
                  <tbody>
                    {paged.map(m => (
                      <tr key={m.id || m._id}>
                        <td><strong>{m.equipment || "—"}</strong></td>
                        <td>{m.type || "—"}</td>
                        <td>{m.technician || "—"}</td>
                        <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{m.date || "—"}</td>
                        <td><strong>{m.cost || "—"}</strong></td>
                        <td><SABadge s={m.status || "pending"} /></td>
                        <td><button className="sa-link-btn">Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
