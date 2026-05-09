import { useState, useCallback, memo } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaTachometerAlt, FaUsers, FaCodeBranch, FaFileAlt, FaTags,
  FaChartLine, FaCog, FaShieldAlt, FaHome, FaUserShield,
  FaBell, FaDownload, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt,
  FaMoneyBillWave, FaHeartbeat, FaServer, FaChevronDown, FaChevronRight,
  FaReceipt, FaChartBar, FaUsers as FaUsersAlt, FaBullhorn, FaEnvelope,
  FaTools, FaBuilding, FaWrench, FaPlug, FaDatabase, FaRobot,
  FaFlag, FaEye, FaLock, FaHistory, FaExclamationTriangle,
  FaTicketAlt, FaStar, FaSearch, FaFilter, FaSync, FaUpload,
  FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaInfoCircle,
  FaToggleOn, FaToggleOff, FaLightbulb, FaSignal, FaCloudUploadAlt,
  FaCloudDownloadAlt, FaShieldVirus, FaComments, FaSms, FaAngleDown,
  FaAngleRight, FaBoxOpen, FaStore, FaCalendarAlt, FaUserClock,
  FaChartPie, FaWallet, FaCreditCard, FaFileInvoiceDollar,
} from "react-icons/fa";
import {
  globalStats, branches, allUsers, membershipPlans, auditLog,
  loginHistory, systemLogs, financialReports, transactions, subscriptions,
  memberGrowth, notifications, campaigns, equipment, vendors,
  maintenanceLogs, integrations, featureFlags, supportTickets,
  feedbackData, liveMonitoring, aiInsights, systemSettings,
} from "../data/superAdminData";
import FormModal from "../components/FormModal";
import { FormRenderer, formTitles } from "../components/DynamicForms";
import { useFormModal } from "../hooks/useFormModal";
import DashboardThemeSwitcher, { useDashboardTheme } from "../components/DashboardThemeSwitcher";
import "../superadmin-dashboard.css";

// ─── NAV STRUCTURE ────────────────────────────────────────────────────────────
// Dashboard is a DIRECT link — no dropdown, no children
const DASHBOARD_ITEM = { 
  id: "overview", 
  icon: <FaHome />, 
  label: "Dashboard",
  color: "#ef4444",
};

const NAV_GROUPS = [
  {
    label: "Management",
    icon: <FaUsers />,
    color: "#3b82f6",
    items: [
      { id: "users",    icon: <FaUsers />,       label: "User Management", color: "#3b82f6" },
      { id: "branches", icon: <FaCodeBranch />,  label: "Branches",        color: "#0ea5e9" },
      { id: "content",  icon: <FaFileAlt />,     label: "Content",         color: "#06b6d4" },
    ],
  },
  {
    label: "Finance",
    icon: <FaMoneyBillWave />,
    color: "#10b981",
    items: [
      { id: "billing",      icon: <FaReceipt />,           label: "Billing",         color: "#10b981" },
      { id: "revenue",      icon: <FaChartBar />,          label: "Revenue",         color: "#34d399" },
      { id: "transactions", icon: <FaCreditCard />,        label: "Transactions",    color: "#14b8a6" },
      { id: "plans",        icon: <FaTags />,              label: "Plans & Pricing", color: "#2dd4bf" },
    ],
  },
  {
    label: "Analytics",
    icon: <FaChartLine />,
    color: "#6366f1",
    items: [
      { id: "reports",           icon: <FaFileInvoiceDollar />, label: "Reports",             color: "#6366f1" },
      { id: "members-analytics", icon: <FaUsers />,             label: "Member Analytics",    color: "#818cf8" },
      { id: "fin-analytics",     icon: <FaChartPie />,          label: "Financial Analytics", color: "#a5b4fc" },
    ],
  },
  {
    label: "Engagement",
    icon: <FaBell />,
    color: "#ec4899",
    items: [
      { id: "notifications-center", icon: <FaBell />,      label: "Notifications", color: "#ec4899" },
      { id: "campaigns",            icon: <FaBullhorn />,  label: "Campaigns",     color: "#f43f5e" },
      { id: "communication",        icon: <FaEnvelope />,  label: "Communication", color: "#fb7185" },
    ],
  },
  {
    label: "Operations",
    icon: <FaTools />,
    color: "#f97316",
    items: [
      { id: "equipment",   icon: <FaTools />,  label: "Equipment",   color: "#f97316" },
      { id: "vendors",     icon: <FaStore />,  label: "Vendors",     color: "#fb923c" },
      { id: "maintenance", icon: <FaWrench />, label: "Maintenance", color: "#fbbf24" },
    ],
  },
  {
    label: "Integrations",
    icon: <FaPlug />,
    color: "#8b5cf6",
    items: [
      { id: "api-settings", icon: <FaPlug />,    label: "API Settings",     color: "#8b5cf6" },
      { id: "third-party",  icon: <FaBoxOpen />, label: "Third-party Apps", color: "#a78bfa" },
    ],
  },
  {
    label: "Data Center",
    icon: <FaDatabase />,
    color: "#0ea5e9",
    items: [
      { id: "import-data", icon: <FaCloudUploadAlt />,   label: "Import Data", color: "#0ea5e9" },
      { id: "export-data", icon: <FaCloudDownloadAlt />, label: "Export Data", color: "#38bdf8" },
      { id: "backups",     icon: <FaDatabase />,         label: "Backups",     color: "#7dd3fc" },
    ],
  },
  {
    label: "Advanced",
    icon: <FaRobot />,
    color: "#f59e0b",
    items: [
      { id: "ai-insights",     icon: <FaRobot />,  label: "AI Insights",    color: "#f59e0b" },
      { id: "feature-flags",   icon: <FaFlag />,   label: "Feature Flags",  color: "#fbbf24" },
      { id: "live-monitoring", icon: <FaSignal />, label: "Live Monitoring", color: "#22c55e" },
    ],
  },
  {
    label: "Security",
    icon: <FaShieldAlt />,
    color: "#ef4444",
    items: [
      { id: "audit",         icon: <FaShieldAlt />,          label: "Audit & Logs",  color: "#ef4444" },
      { id: "login-history", icon: <FaUserClock />,          label: "Login History", color: "#f87171" },
      { id: "system-logs",   icon: <FaExclamationTriangle />,label: "System Logs",   color: "#fca5a5" },
    ],
  },
  {
    label: "Settings",
    icon: <FaCog />,
    color: "#64748b",
    items: [
      { id: "settings",       icon: <FaCog />,    label: "General Settings",     color: "#64748b" },
      { id: "notif-settings", icon: <FaBell />,   label: "Notifications",        color: "#94a3b8" },
      { id: "sys-config",     icon: <FaServer />, label: "System Configuration", color: "#475569" },
    ],
  },
  {
    label: "Support",
    icon: <FaTicketAlt />,
    color: "#06b6d4",
    items: [
      { id: "tickets",  icon: <FaTicketAlt />, label: "Tickets",  color: "#06b6d4" },
      { id: "feedback", icon: <FaStar />,      label: "Feedback", color: "#fbbf24" },
    ],
  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const SABadge = memo(({ s }) => {
  const m = {
    active:"sa-green", inactive:"sa-gray", planned:"sa-yellow", new:"sa-blue",
    member:"sa-blue", trainer:"sa-orange", admin:"sa-purple", superadmin:"sa-red",
    reception:"sa-gray", success:"sa-green", failed:"sa-red", refunded:"sa-yellow",
    working:"sa-green", maintenance:"sa-yellow", broken:"sa-red",
    open:"sa-red", "in-progress":"sa-yellow", closed:"sa-green",
    high:"sa-red", medium:"sa-yellow", low:"sa-blue",
    completed:"sa-green", pending:"sa-yellow", blocked:"sa-red",
    expiring:"sa-yellow", expired:"sa-gray", draft:"sa-gray",
    error:"sa-red", warning:"sa-yellow", info:"sa-blue", system:"sa-purple",
    enabled:"sa-green", disabled:"sa-gray",
    production:"sa-green", beta:"sa-yellow", alpha:"sa-orange",
  };
  return <span className={`sa-badge ${m[s] || "sa-gray"}`}>{s}</span>;
});

const Toast = memo(({ msg, onClose }) => (
  <div className="sa-toast">
    <FaCheckCircle style={{ color: "#22c55e", marginRight: 8 }} />
    {msg}
    <button onClick={onClose} className="sa-toast-close">×</button>
  </div>
));

function useToast() {
  const [toast, setToast] = useState(null);
  const show = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);
  return { toast, show };
}

const MiniBarChart = ({ data, color = "#ef4444" }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="sa-mini-bar-chart">
      {data.map((d, i) => (
        <div key={i} className="sa-mini-bar-col">
          <div className="sa-mini-bar" style={{ height: `${(d.value / max) * 100}%`, background: color }} />
          <span className="sa-mini-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data, color = "#ef4444", height = 100 }) => {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;
  const w = 100 / (data.length - 1);
  const points = data.map((d, i) => `${i * w},${height - ((d.value - min) / range) * (height - 10) - 5}`).join(" ");
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      {data.map((d, i) => (
        <circle key={i} cx={i * w} cy={height - ((d.value - min) / range) * (height - 10) - 5} r="2" fill={color} />
      ))}
    </svg>
  );
};

const KpiCard = ({ icon, label, value, change, color, trend }) => (
  <div className="sa-kpi-card">
    <div className="sa-kpi-icon" style={{ background: color + "22" }}>{icon}</div>
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
      {change && <small style={{ color: trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "var(--text-secondary)" }}>{change}</small>}
    </div>
  </div>
);

const EmptyState = ({ icon, title, desc }) => (
  <div className="sa-empty">
    <div className="sa-empty-icon">{icon || <FaBoxOpen />}</div>
    <h4>{title || "No data found"}</h4>
    <p>{desc || "Nothing to display here yet."}</p>
  </div>
);

const LoadingState = () => (
  <div className="sa-loading">
    <div className="sa-spinner" />
    <span>Loading...</span>
  </div>
);

function SAModal({ title, onClose, children }) {
  return (
    <div className="sa-modal-overlay" onClick={onClose}>
      <div className="sa-modal" onClick={e => e.stopPropagation()}>
        <div className="sa-modal-head">
          <h3>{title}</h3>
          <button className="sa-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="sa-modal-body">{children}</div>
      </div>
    </div>
  );
}

function Pagination({ total, page, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="sa-pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className="sa-page-btn">‹</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} className={`sa-page-btn ${page === i + 1 ? "sa-page-active" : ""}`} onClick={() => onChange(i + 1)}>{i + 1}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)} className="sa-page-btn">›</button>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function SAOverview() {
  const rev = financialReports.monthly;
  const maxRev = Math.max(...rev.map(r => r.revenue));
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaTachometerAlt style={{ marginRight: 8 }} />System Overview</h2>
        <span className="sa-badge sa-green">All Systems Operational</span>
      </div>
      <div className="sa-kpi-grid">
        {globalStats.map((k, i) => (
          <div className="sa-kpi-card" key={i}>
            <div className="sa-kpi-icon" style={{ background: k.color + "22", fontSize: "1.4rem" }}>{k.icon}</div>
            <div>
              <strong>{k.value}</strong>
              <span>{k.label}</span>
              <small style={{ color: "var(--text-secondary)" }}>{k.change}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3><FaMoneyBillWave style={{ marginRight: 6 }} />Global Revenue Trend</h3></div>
          <div className="sa-bar-chart">
            {rev.map((v, i) => (
              <div className="sa-bar-col" key={i}>
                <span className="sa-bar-val">${(v.revenue / 1000).toFixed(0)}k</span>
                <div className="sa-bar" style={{ height: `${(v.revenue / maxRev) * 100}%` }} />
                <span className="sa-bar-label">{v.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3><FaCodeBranch style={{ marginRight: 6 }} />Branch Performance</h3></div>
          {branches.map(b => (
            <div className="sa-branch-row" key={b.id}>
              <div><strong>{b.name}</strong><span>{b.city}</span></div>
              <div className="sa-branch-stats">
                <span><FaUsers style={{ marginRight: 4 }} />{b.members}</span>
                <span>{b.revenue}</span>
                <span style={{ color: "#22c55e", fontWeight: 700 }}>{b.growth}</span>
                <SABadge s={b.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3><FaServer style={{ marginRight: 6 }} />Platform Health</h3></div>
        <div className="sa-health-grid">
          {[["API Server","99.9%","#22c55e"],["Database","99.8%","#22c55e"],["CDN","100%","#22c55e"],["Email Service","98.2%","#f97316"],["SMS Gateway","97.5%","#f97316"],["Backup System","100%","#22c55e"]].map(([s, v, c]) => (
            <div className="sa-health-item" key={s}>
              <div className="sa-health-dot" style={{ background: c }} />
              <span>{s}</span>
              <strong style={{ color: c }}>{v}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3><FaBell style={{ marginRight: 6 }} />Recent Alerts</h3></div>
        {notifications.filter(n => !n.read).map(n => (
          <div key={n.id} className="sa-alert-row">
            <div className={`sa-alert-dot ${n.type === "payment" || n.type === "alert" ? "sa-red" : "sa-yellow"}`} />
            <div><strong>{n.title}</strong><span>{n.message}</span></div>
            <small>{n.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────
function SAUsers({ openForm }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { toast, show } = useToast();
  const PER = 5;
  const filtered = allUsers.filter(u =>
    (roleFilter === "all" || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * PER, page * PER);
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaUsers style={{ marginRight: 8 }} />User Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("createUser")}><FaPlus style={{ marginRight: 6 }} />Add User</button>
          <button className="btn btn-outline sa-btn-sm" onClick={() => show("Users exported!")}><FaDownload style={{ marginRight: 6 }} />Export</button>
        </div>
      </div>
      <div className="sa-filters">
        <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search users..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
        {["all", "member", "trainer", "admin", "superadmin"].map(r => (
          <button key={r} className={`sa-filter-btn ${roleFilter === r ? "sa-filter-active" : ""}`} onClick={() => { setRoleFilter(r); setPage(1); }}>{r}</button>
        ))}
      </div>
      <div className="sa-card">
        {paged.length === 0 ? <EmptyState title="No users found" desc="Try adjusting your search or filters." /> : (
          <table className="sa-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {paged.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                  <td><SABadge s={u.role} /></td>
                  <td>{u.branch}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: ".78rem" }}>{u.lastLogin}</td>
                  <td><SABadge s={u.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="sa-link-btn" onClick={() => show(`Editing ${u.name}`)}><FaEdit /></button>
                      <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => show(`${u.name} removed`)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
      </div>
      {showModal && (
        <SAModal title="Add New User" onClose={() => setShowModal(false)}>
          <div className="sa-form-group"><label>Full Name</label><input className="sa-input" placeholder="Enter name" /></div>
          <div className="sa-form-group"><label>Email</label><input className="sa-input" placeholder="Enter email" /></div>
          <div className="sa-form-group"><label>Role</label>
            <select className="sa-input"><option>member</option><option>trainer</option><option>admin</option></select>
          </div>
          <div className="sa-form-group"><label>Branch</label>
            <select className="sa-input">{branches.map(b => <option key={b.id}>{b.name}</option>)}</select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={() => { setShowModal(false); show("User added successfully!"); }}>Add User</button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </SAModal>
      )}
    </div>
  );
}

// ─── BRANCHES ─────────────────────────────────────────────────────────────────
function SABranches({ openForm }) {
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaCodeBranch style={{ marginRight: 8 }} />Branch Management</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("createBranch")}><FaPlus style={{ marginRight: 6 }} />Add Branch</button>
      </div>
      <div className="sa-branches-grid">
        {branches.map(b => (
          <div className="sa-branch-card sa-card" key={b.id}>
            <div className="sa-branch-card-head"><h4>{b.name}</h4><SABadge s={b.status} /></div>
            <p className="sa-branch-city"><FaMapMarkerAlt style={{ marginRight: 4 }} />{b.city}</p>
            <div className="sa-branch-kpis">
              <div><strong>{b.members}</strong><span>Members</span></div>
              <div><strong>{b.revenue}</strong><span>Revenue</span></div>
              <div><strong>{b.trainers}</strong><span>Trainers</span></div>
            </div>
            <div className="sa-branch-growth"><FaChartLine style={{ marginRight: 4, color: "#22c55e" }} /><span style={{ color: "#22c55e", fontWeight: 700 }}>{b.growth}</span><span style={{ color: "var(--text-secondary)", fontSize: ".75rem" }}> growth</span></div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn btn-outline sa-btn-sm">View</button>
              <button className="btn btn-outline sa-btn-sm" onClick={() => show(`Editing ${b.name}`)}><FaEdit style={{ marginRight: 4 }} />Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CONTENT ──────────────────────────────────────────────────────────────────
function SAContent({ openForm }) {
  const { toast, show } = useToast();
  const items = [
    { id: 1, title: "Summer Fitness Tips", type: "Blog", status: "published", date: "May 1, 2026" },
    { id: 2, title: "New Equipment Arrival", type: "Announcement", status: "published", date: "Apr 28, 2026" },
    { id: 3, title: "Yoga Class Schedule", type: "Schedule", status: "draft", date: "Apr 25, 2026" },
    { id: 4, title: "Member Success Story", type: "Blog", status: "published", date: "Apr 20, 2026" },
  ];
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaFileAlt style={{ marginRight: 8 }} />Content Management</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("newContent")}><FaPlus style={{ marginRight: 6 }} />New Content</button>
      </div>
      <div className="sa-card">
        <table className="sa-table">
          <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td><strong>{c.title}</strong></td>
                <td><SABadge s={c.type.toLowerCase()} /></td>
                <td><SABadge s={c.status} /></td>
                <td style={{ color: "var(--text-secondary)", fontSize: ".78rem" }}>{c.date}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="sa-link-btn" onClick={() => show("Editing content...")}><FaEdit /></button>
                    <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => show("Content deleted")}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── FINANCE: BILLING ─────────────────────────────────────────────────────────
function SABilling() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 5;
  const filtered = subscriptions.filter(s =>
    (filter === "all" || s.status === filter) &&
    s.user.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * PER, page * PER);
  const active = subscriptions.filter(s => s.status === "active").length;
  const expired = subscriptions.filter(s => s.status === "expired").length;
  const expiring = subscriptions.filter(s => s.status === "expiring").length;
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaReceipt style={{ marginRight: 8 }} />Billing</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export</button>
      </div>
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
        <table className="sa-table">
          <thead><tr><th>Member</th><th>Plan</th><th>Start</th><th>Expiry</th><th>Days Left</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {paged.map(s => (
              <tr key={s.id}>
                <td><strong>{s.user}</strong></td>
                <td>{s.plan}</td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{s.start}</td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{s.expiry}</td>
                <td>
                  <span style={{ color: s.daysLeft <= 7 ? "#ef4444" : s.daysLeft <= 30 ? "#f97316" : "#22c55e", fontWeight: 700 }}>
                    {s.daysLeft > 0 ? `${s.daysLeft}d` : "—"}
                  </span>
                </td>
                <td><SABadge s={s.status} /></td>
                <td><button className="sa-link-btn">Renew</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
      </div>
    </div>
  );
}

// ─── FINANCE: REVENUE ─────────────────────────────────────────────────────────
function SARevenue() {
  const [period, setPeriod] = useState("monthly");
  const data = financialReports.monthly;
  const maxRev = Math.max(...data.map(d => d.revenue));
  const totalRev = data.reduce((a, b) => a + b.revenue, 0);
  const totalProfit = data.reduce((a, b) => a + b.profit, 0);
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
      <div className="sa-kpi-grid">
        <KpiCard icon={<FaMoneyBillWave />} label="Total Revenue (12mo)" value={`$${(totalRev / 1000).toFixed(0)}k`} color="#22c55e" change="+22% YoY" trend="up" />
        <KpiCard icon={<FaChartLine />} label="Net Profit (12mo)" value={`$${(totalProfit / 1000).toFixed(0)}k`} color="#3b82f6" change="+18% YoY" trend="up" />
        <KpiCard icon={<FaChartPie />} label="Avg Monthly Revenue" value={`$${(totalRev / data.length / 1000).toFixed(1)}k`} color="#8b5cf6" />
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
                  <div className="sa-bar" style={{ height: `${(v.expenses / maxRev) * 100}%`, background: "#3b82f6", flex: 1 }} />
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
          {financialReports.branchRevenue.map((b, i) => {
            const max = Math.max(...financialReports.branchRevenue.map(x => x.revenue));
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
          {financialReports.forecast.map((f, i) => {
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
    </div>
  );
}

// ─── FINANCE: TRANSACTIONS ────────────────────────────────────────────────────
function SATransactions() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER = 5;
  const filtered = transactions.filter(t =>
    (filter === "all" || t.status === filter) &&
    (t.user.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * PER, page * PER);
  const total = transactions.filter(t => t.status === "success").reduce((a, b) => a + b.amount, 0);
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaCreditCard style={{ marginRight: 8 }} />Transactions</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export CSV</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <KpiCard icon={<FaCheckCircle />} label="Successful" value={transactions.filter(t => t.status === "success").length} color="#22c55e" />
        <KpiCard icon={<FaTimesCircle />} label="Failed" value={transactions.filter(t => t.status === "failed").length} color="#ef4444" />
        <KpiCard icon={<FaSync />} label="Refunded" value={transactions.filter(t => t.status === "refunded").length} color="#f97316" />
        <KpiCard icon={<FaWallet />} label="Total Collected" value={`$${total}`} color="#8b5cf6" />
      </div>
      <div className="sa-filters">
        <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search by user or TXN ID..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} /></div>
        {["all", "success", "failed", "refunded"].map(f => (
          <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => { setFilter(f); setPage(1); }}>{f}</button>
        ))}
      </div>
      <div className="sa-card">
        {paged.length === 0 ? <EmptyState title="No transactions found" /> : (
          <table className="sa-table">
            <thead><tr><th>TXN ID</th><th>User</th><th>Plan</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {paged.map(t => (
                <tr key={t.id}>
                  <td><code style={{ fontSize: ".75rem", color: "var(--accent)" }}>{t.id}</code></td>
                  <td><strong>{t.user}</strong></td>
                  <td>{t.plan}</td>
                  <td><strong style={{ color: t.status === "failed" ? "#ef4444" : "var(--text-primary)" }}>${t.amount}</strong></td>
                  <td style={{ color: "var(--text-secondary)", fontSize: ".8rem" }}>{t.method}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: ".78rem" }}>{t.date}</td>
                  <td><SABadge s={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination total={filtered.length} page={page} perPage={PER} onChange={setPage} />
      </div>
    </div>
  );
}

// ─── FINANCE: PLANS & PRICING ─────────────────────────────────────────────────
function SAPlans({ openForm }) {
  const [plans, setPlans] = useState(membershipPlans);
  const [showModal, setShowModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", duration: "", features: "" });
  const { toast, show } = useToast();
  const openAdd = () => { setEditPlan(null); setForm({ name: "", price: "", duration: "", features: "" }); setShowModal(true); };
  const openEdit = (p) => { setEditPlan(p); setForm({ name: p.name, price: p.price, duration: p.duration, features: p.features.join(", ") }); setShowModal(true); };
  const save = () => {
    if (editPlan) {
      setPlans(prev => prev.map(p => p.id === editPlan.id ? { ...p, ...form, price: Number(form.price), features: form.features.split(",").map(f => f.trim()) } : p));
      show("Plan updated!");
    } else {
      setPlans(prev => [...prev, { id: Date.now(), ...form, price: Number(form.price), features: form.features.split(",").map(f => f.trim()), members: 0, status: "active", popular: false }]);
      show("Plan created!");
    }
    setShowModal(false);
  };
  const del = (id) => { setPlans(prev => prev.filter(p => p.id !== id)); show("Plan deleted!"); };
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaTags style={{ marginRight: 8 }} />Plans & Pricing</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("createPlan")}><FaPlus style={{ marginRight: 6 }} />Add Plan</button>
      </div>
      <div className="sa-plans-grid">
        {plans.map(p => (
          <div className={`sa-plan-card sa-card ${p.popular ? "sa-plan-popular" : ""}`} key={p.id}>
            {p.popular && <div className="sa-plan-badge">Most Popular</div>}
            <div className="sa-plan-head">
              <h4>{p.name}</h4>
              <SABadge s={p.status} />
            </div>
            <div className="sa-plan-price">${p.price}<span>/{p.duration}</span></div>
            <ul className="sa-plan-features">
              {p.features.map((f, i) => <li key={i}><FaCheckCircle style={{ color: "#22c55e", marginRight: 6 }} />{f}</li>)}
            </ul>
            <div className="sa-plan-members"><FaUsers style={{ marginRight: 4 }} />{p.members} members</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn btn-outline sa-btn-sm" onClick={() => openEdit(p)}><FaEdit style={{ marginRight: 4 }} />Edit</button>
              <button className="btn btn-outline sa-btn-sm" style={{ color: "#ef4444", borderColor: "#ef4444" }} onClick={() => del(p.id)}><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <SAModal title={editPlan ? "Edit Plan" : "Add New Plan"} onClose={() => setShowModal(false)}>
          <div className="sa-form-group"><label>Plan Name</label><input className="sa-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Monthly" /></div>
          <div className="sa-form-group"><label>Price ($)</label><input className="sa-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 39" /></div>
          <div className="sa-form-group"><label>Duration</label><input className="sa-input" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 1 month" /></div>
          <div className="sa-form-group"><label>Features (comma-separated)</label><textarea className="sa-input" rows={3} value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder="Gym Access, Locker, ..." /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={save}>Save Plan</button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </SAModal>
      )}
    </div>
  );
}

// ─── ANALYTICS: REPORTS ───────────────────────────────────────────────────────
function SAReports() {
  const { toast, show } = useToast();
  const summaries = [
    { label: "Total Members", value: "4,820", change: "+312 this month", color: "#22c55e" },
    { label: "Monthly Revenue", value: "$51.4k", change: "+8.9% vs last month", color: "#3b82f6" },
    { label: "Avg Session/Member", value: "8.4", change: "Per month", color: "#8b5cf6" },
    { label: "Retention Rate", value: "96.8%", change: "+0.8% vs last month", color: "#f97316" },
  ];
  const reports = [
    { name: "Monthly Revenue Report", type: "Financial", date: "May 2026", size: "2.4 MB" },
    { name: "Member Growth Report", type: "Analytics", date: "May 2026", size: "1.8 MB" },
    { name: "Branch Performance", type: "Operations", date: "Apr 2026", size: "3.1 MB" },
    { name: "Trainer Utilization", type: "HR", date: "Apr 2026", size: "1.2 MB" },
    { name: "Equipment Status", type: "Operations", date: "Apr 2026", size: "0.9 MB" },
  ];
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaFileInvoiceDollar style={{ marginRight: 8 }} />Reports</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => show("Generating report...")}><FaPlus style={{ marginRight: 6 }} />Generate Report</button>
      </div>
      <div className="sa-kpi-grid">
        {summaries.map((s, i) => (
          <div className="sa-kpi-card" key={i}>
            <div className="sa-kpi-icon" style={{ background: s.color + "22", fontSize: "1.2rem" }}>📊</div>
            <div><strong>{s.value}</strong><span>{s.label}</span><small style={{ color: "var(--text-secondary)" }}>{s.change}</small></div>
          </div>
        ))}
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Available Reports</h3></div>
        <table className="sa-table">
          <thead><tr><th>Report Name</th><th>Type</th><th>Period</th><th>Size</th><th>Actions</th></tr></thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i}>
                <td><strong>{r.name}</strong></td>
                <td><SABadge s={r.type.toLowerCase()} /></td>
                <td style={{ color: "var(--text-secondary)", fontSize: ".78rem" }}>{r.date}</td>
                <td style={{ color: "var(--text-secondary)", fontSize: ".78rem" }}>{r.size}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="sa-link-btn" onClick={() => show(`Downloading ${r.name} as PDF...`)}><FaDownload /> PDF</button>
                    <button className="sa-link-btn" onClick={() => show(`Downloading ${r.name} as CSV...`)}><FaDownload /> CSV</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ANALYTICS: MEMBER ANALYTICS ─────────────────────────────────────────────
function SAMemberAnalytics() {
  const maxActive = Math.max(...memberGrowth.map(d => d.active));
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaUsersAlt style={{ marginRight: 8 }} />Member Analytics</h2>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <KpiCard icon={<FaUsers />} label="Total Members" value="4,820" color="#22c55e" change="+260 this month" trend="up" />
        <KpiCard icon={<FaCheckCircle />} label="Active Members" value="4,640" color="#3b82f6" change="96.3% active rate" trend="up" />
        <KpiCard icon={<FaTimesCircle />} label="Inactive Members" value="260" color="#ef4444" change="-3.7% vs last month" trend="up" />
        <KpiCard icon={<FaChartLine />} label="Retention Rate" value="96.8%" color="#8b5cf6" change="+0.8% vs last month" trend="up" />
      </div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3>Member Growth (12 Months)</h3></div>
          <div className="sa-bar-chart" style={{ height: 140 }}>
            {memberGrowth.map((d, i) => (
              <div className="sa-bar-col" key={i}>
                <div style={{ display: "flex", gap: 1, alignItems: "flex-end", height: "100%" }}>
                  <div className="sa-bar" style={{ height: `${(d.active / maxActive) * 100}%`, background: "#22c55e", flex: 2 }} />
                  <div className="sa-bar" style={{ height: `${(d.inactive / maxActive) * 100}%`, background: "#ef4444", flex: 1 }} />
                </div>
                <span className="sa-bar-label">{d.month}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: ".75rem" }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#22c55e", borderRadius: 2, marginRight: 4 }} />Active</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#ef4444", borderRadius: 2, marginRight: 4 }} />Inactive</span>
          </div>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3>New Member Acquisitions</h3></div>
          <div className="sa-bar-chart" style={{ height: 140 }}>
            {memberGrowth.map((d, i) => {
              const maxNew = Math.max(...memberGrowth.map(x => x.new));
              return (
                <div className="sa-bar-col" key={i}>
                  <span className="sa-bar-val">{d.new}</span>
                  <div className="sa-bar" style={{ height: `${(d.new / maxNew) * 100}%`, background: "#8b5cf6" }} />
                  <span className="sa-bar-label">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Retention Rate Trend</h3></div>
        <div style={{ padding: "8px 0" }}>
          {[["Jun","94.2%",94.2],["Aug","95.1%",95.1],["Oct","95.8%",95.8],["Dec","96.0%",96.0],["Feb","96.4%",96.4],["May","96.8%",96.8]].map(([m, v, pct]) => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ width: 32, fontSize: ".78rem", color: "var(--text-secondary)" }}>{m}</span>
              <div style={{ flex: 1, background: "var(--bg-primary)", borderRadius: 4, height: 10 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "#22c55e", borderRadius: 4 }} />
              </div>
              <strong style={{ width: 48, fontSize: ".82rem", color: "#22c55e" }}>{v}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS: FINANCIAL ANALYTICS ──────────────────────────────────────────
function SAFinancialAnalytics() {
  const data = financialReports.monthly;
  const maxProfit = Math.max(...data.map(d => d.profit));
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaChartPie style={{ marginRight: 8 }} />Financial Analytics</h2>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <KpiCard icon={<FaMoneyBillWave />} label="Total Revenue" value="$1.84M" color="#22c55e" change="+22% YoY" trend="up" />
        <KpiCard icon={<FaChartLine />} label="Net Profit" value="$193k" color="#3b82f6" change="+18% YoY" trend="up" />
        <KpiCard icon={<FaChartPie />} label="Profit Margin" value="38.2%" color="#8b5cf6" change="+2.1% vs last year" trend="up" />
        <KpiCard icon={<FaChartPie />} label="MoM Growth" value="+8.9%" color="#f97316" change="May vs April" trend="up" />
      </div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3>Profit Trend (12 Months)</h3></div>
          <div className="sa-bar-chart" style={{ height: 140 }}>
            {data.map((d, i) => (
              <div className="sa-bar-col" key={i}>
                <span className="sa-bar-val">${(d.profit / 1000).toFixed(0)}k</span>
                <div className="sa-bar" style={{ height: `${(d.profit / maxProfit) * 100}%`, background: "#22c55e" }} />
                <span className="sa-bar-label">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3>Revenue Forecast</h3></div>
          <div className="sa-bar-chart" style={{ height: 140 }}>
            {financialReports.forecast.map((f, i) => (
              <div className="sa-bar-col" key={i}>
                <span className="sa-bar-val">${(f.forecast / 1000).toFixed(0)}k</span>
                <div className="sa-bar" style={{ height: `${(f.forecast / 65000) * 100}%`, background: f.actual ? "#ef4444" : "#8b5cf6", opacity: f.actual ? 1 : 0.65 }} />
                <span className="sa-bar-label">{f.month}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: ".72rem", color: "var(--text-secondary)", marginTop: 8 }}>Purple = Forecast · Red = Actual</p>
        </div>
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Revenue Breakdown by Plan</h3></div>
        {membershipPlans.map((p, i) => {
          const rev = p.price * p.members;
          const maxRev = Math.max(...membershipPlans.map(x => x.price * x.members));
          const colors = ["#ef4444","#3b82f6","#22c55e","#8b5cf6","#f97316","#06b6d4"];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ width: 90, fontSize: ".8rem" }}>{p.name}</span>
              <div style={{ flex: 1, background: "var(--bg-primary)", borderRadius: 4, height: 10 }}>
                <div style={{ width: `${(rev / maxRev) * 100}%`, height: "100%", background: colors[i % colors.length], borderRadius: 4 }} />
              </div>
              <strong style={{ width: 64, fontSize: ".8rem", textAlign: "right" }}>${(rev / 1000).toFixed(1)}k</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ENGAGEMENT: NOTIFICATIONS ────────────────────────────────────────────────
function SANotificationsCenter() {
  const [notifs, setNotifs] = useState(notifications);
  const { toast, show } = useToast();
  const markRead = (id) => { setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); };
  const markAll = () => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); show("All marked as read"); };
  const typeIcon = { expiry: <FaCalendarAlt />, payment: <FaCreditCard />, system: <FaServer />, alert: <FaExclamationTriangle />, info: <FaInfoCircle /> };
  const typeColor = { expiry: "#f97316", payment: "#ef4444", system: "#3b82f6", alert: "#ef4444", info: "#22c55e" };
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaBell style={{ marginRight: 8 }} />Notifications</h2>
        <button className="btn btn-outline sa-btn-sm" onClick={markAll}>Mark All Read</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaBell />} label="Total Alerts" value={notifs.length} color="#3b82f6" />
        <KpiCard icon={<FaExclamationCircle />} label="Unread" value={notifs.filter(n => !n.read).length} color="#ef4444" />
        <KpiCard icon={<FaCheckCircle />} label="Read" value={notifs.filter(n => n.read).length} color="#22c55e" />
      </div>
      <div className="sa-card">
        {notifs.map(n => (
          <div key={n.id} className={`sa-notif-row ${!n.read ? "sa-notif-unread" : ""}`}>
            <div className="sa-notif-icon" style={{ background: (typeColor[n.type] || "#6b7280") + "22", color: typeColor[n.type] || "#6b7280" }}>
              {typeIcon[n.type] || <FaBell />}
            </div>
            <div className="sa-notif-body">
              <strong>{n.title}</strong>
              <span>{n.message}</span>
            </div>
            <div className="sa-notif-meta">
              <small>{n.time}</small>
              {!n.read && <button className="sa-link-btn" style={{ fontSize: ".7rem" }} onClick={() => markRead(n.id)}>Mark read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ENGAGEMENT: CAMPAIGNS ────────────────────────────────────────────────────
function SACampaigns({ openForm }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "email", target: "", discount: "" });
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaBullhorn style={{ marginRight: 8 }} />Campaigns</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("createCampaign")}><FaPlus style={{ marginRight: 6 }} />Create Campaign</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaBullhorn />} label="Active Campaigns" value={campaigns.filter(c => c.status === "active").length} color="#22c55e" />
        <KpiCard icon={<FaEnvelope />} label="Total Sent" value={campaigns.reduce((a, b) => a + b.sent, 0).toLocaleString()} color="#3b82f6" />
        <KpiCard icon={<FaEye />} label="Total Opens" value={campaigns.reduce((a, b) => a + b.opens, 0).toLocaleString()} color="#8b5cf6" />
      </div>
      <div className="sa-card">
        <table className="sa-table">
          <thead><tr><th>Campaign</th><th>Type</th><th>Target</th><th>Discount</th><th>Sent</th><th>Opens</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td><SABadge s={c.type} /></td>
                <td style={{ fontSize: ".8rem", color: "var(--text-secondary)" }}>{c.target}</td>
                <td>{c.discount !== "—" ? <span style={{ color: "#22c55e", fontWeight: 700 }}>{c.discount}</span> : "—"}</td>
                <td>{c.sent.toLocaleString()}</td>
                <td>{c.opens.toLocaleString()}</td>
                <td><SABadge s={c.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="sa-link-btn" onClick={() => show(`Editing ${c.name}`)}><FaEdit /></button>
                    <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => show("Campaign deleted")}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <SAModal title="Create Campaign" onClose={() => setShowModal(false)}>
          <div className="sa-form-group"><label>Campaign Name</label><input className="sa-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Summer Offer" /></div>
          <div className="sa-form-group"><label>Type</label>
            <select className="sa-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="email">Email</option><option value="sms">SMS</option><option value="discount">Discount</option>
            </select>
          </div>
          <div className="sa-form-group"><label>Target Audience</label><input className="sa-input" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} placeholder="e.g. All Members" /></div>
          {form.type === "discount" && <div className="sa-form-group"><label>Discount %</label><input className="sa-input" value={form.discount} onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} placeholder="e.g. 20" /></div>}
          <div className="sa-form-group"><label>Message</label><textarea className="sa-input" rows={3} placeholder="Enter campaign message..." /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={() => { setShowModal(false); show("Campaign created!"); }}>Launch Campaign</button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </SAModal>
      )}
    </div>
  );
}

// ─── ENGAGEMENT: COMMUNICATION ────────────────────────────────────────────────
function SACommunication() {
  const [tab, setTab] = useState("email");
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaEnvelope style={{ marginRight: 8 }} />Communication</h2></div>
      <div className="sa-tabs">
        {[["email", <FaEnvelope />, "Email"], ["sms", <FaSms />, "SMS"], ["announcement", <FaBullhorn />, "Announcement"]].map(([id, icon, label]) => (
          <button key={id} className={`sa-tab-btn ${tab === id ? "sa-tab-active" : ""}`} onClick={() => setTab(id)}>{icon}<span style={{ marginLeft: 6 }}>{label}</span></button>
        ))}
      </div>
      <div className="sa-card">
        <div className="sa-form-group"><label>To</label>
          <select className="sa-input"><option>All Members</option><option>Active Members</option><option>Expiring Soon</option><option>Inactive Members</option><option>Trainers</option></select>
        </div>
        {tab !== "sms" && <div className="sa-form-group"><label>Subject</label><input className="sa-input" placeholder={`Enter ${tab} subject...`} /></div>}
        <div className="sa-form-group"><label>Message</label><textarea className="sa-input" rows={5} placeholder={`Compose your ${tab} message here...`} /></div>
        {tab === "email" && (
          <div className="sa-form-group"><label>Template</label>
            <select className="sa-input"><option>None</option><option>Renewal Reminder</option><option>Welcome Email</option><option>Offer Announcement</option></select>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn btn-primary sa-btn-sm" onClick={() => show(`${tab.charAt(0).toUpperCase() + tab.slice(1)} sent successfully!`)}>Send {tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
          <button className="btn btn-outline sa-btn-sm" onClick={() => show("Saved as draft")}>Save Draft</button>
        </div>
      </div>
    </div>
  );
}

// ─── OPERATIONS: EQUIPMENT ────────────────────────────────────────────────────
function SAEquipment({ openForm }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { toast, show } = useToast();
  const filtered = equipment.filter(e =>
    (filter === "all" || e.status === filter) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaTools style={{ marginRight: 8 }} />Equipment</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("addEquipment")}><FaPlus style={{ marginRight: 6 }} />Add Equipment</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaCheckCircle />} label="Working" value={equipment.filter(e => e.status === "working").length} color="#22c55e" />
        <KpiCard icon={<FaWrench />} label="Under Maintenance" value={equipment.filter(e => e.status === "maintenance").length} color="#f97316" />
        <KpiCard icon={<FaTimesCircle />} label="Broken" value={equipment.filter(e => e.status === "broken").length} color="#ef4444" />
      </div>
      <div className="sa-filters">
        <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search equipment..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        {["all", "working", "maintenance", "broken"].map(f => (
          <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="sa-card">
        {filtered.length === 0 ? <EmptyState title="No equipment found" /> : (
          <table className="sa-table">
            <thead><tr><th>Equipment</th><th>Category</th><th>Branch</th><th>Status</th><th>Last Service</th><th>Next Service</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td><SABadge s={e.category.toLowerCase()} /></td>
                  <td>{e.branch}</td>
                  <td><SABadge s={e.status} /></td>
                  <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{e.lastService}</td>
                  <td style={{ fontSize: ".78rem", color: e.nextService === "ASAP" ? "#ef4444" : "var(--text-secondary)", fontWeight: e.nextService === "ASAP" ? 700 : 400 }}>{e.nextService}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="sa-link-btn" onClick={() => show(`Editing ${e.name}`)}><FaEdit /></button>
                      <button className="sa-link-btn" onClick={() => show(`Scheduling maintenance for ${e.name}`)}><FaWrench /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── OPERATIONS: VENDORS ──────────────────────────────────────────────────────
function SAVendors({ openForm }) {
  const [showModal, setShowModal] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaStore style={{ marginRight: 8 }} />Vendors</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("addVendor")}><FaPlus style={{ marginRight: 6 }} />Add Vendor</button>
      </div>
      <div className="sa-card">
        <table className="sa-table">
          <thead><tr><th>Vendor</th><th>Category</th><th>Contact</th><th>Phone</th><th>Last Order</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {vendors.map(v => (
              <tr key={v.id}>
                <td><strong>{v.name}</strong></td>
                <td><SABadge s={v.category.toLowerCase()} /></td>
                <td>{v.contact}</td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{v.phone}</td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{v.lastOrder}</td>
                <td><SABadge s={v.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="sa-link-btn" onClick={() => { setEditVendor(v); setShowModal(true); }}><FaEdit /></button>
                    <button className="sa-link-btn" style={{ color: "#ef4444" }} onClick={() => show(`${v.name} removed`)}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <SAModal title={editVendor ? "Edit Vendor" : "Add Vendor"} onClose={() => setShowModal(false)}>
          <div className="sa-form-group"><label>Vendor Name</label><input className="sa-input" defaultValue={editVendor?.name} placeholder="Company name" /></div>
          <div className="sa-form-group"><label>Category</label>
            <select className="sa-input" defaultValue={editVendor?.category}>
              <option>Equipment</option><option>Cleaning</option><option>Maintenance</option><option>Nutrition</option>
            </select>
          </div>
          <div className="sa-form-group"><label>Contact Person</label><input className="sa-input" defaultValue={editVendor?.contact} placeholder="Contact name" /></div>
          <div className="sa-form-group"><label>Phone</label><input className="sa-input" defaultValue={editVendor?.phone} placeholder="+91 XXXXX XXXXX" /></div>
          <div className="sa-form-group"><label>Email</label><input className="sa-input" defaultValue={editVendor?.email} placeholder="vendor@email.com" /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={() => { setShowModal(false); show(editVendor ? "Vendor updated!" : "Vendor added!"); }}>Save</button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </SAModal>
      )}
    </div>
  );
}

// ─── OPERATIONS: MAINTENANCE ──────────────────────────────────────────────────
function SAMaintenance({ openForm }) {
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaWrench style={{ marginRight: 8 }} />Maintenance</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("scheduleMaintenance")}><FaPlus style={{ marginRight: 6 }} />Schedule Maintenance</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaCheckCircle />} label="Completed" value={maintenanceLogs.filter(m => m.status === "completed").length} color="#22c55e" />
        <KpiCard icon={<FaSync />} label="In Progress" value={maintenanceLogs.filter(m => m.status === "in-progress").length} color="#f97316" />
        <KpiCard icon={<FaExclamationCircle />} label="Pending" value={maintenanceLogs.filter(m => m.status === "pending").length} color="#ef4444" />
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Maintenance Log</h3></div>
        <table className="sa-table">
          <thead><tr><th>Equipment</th><th>Type</th><th>Technician</th><th>Date</th><th>Cost</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {maintenanceLogs.map(m => (
              <tr key={m.id}>
                <td><strong>{m.equipment}</strong></td>
                <td><SABadge s={m.type.toLowerCase()} /></td>
                <td>{m.technician}</td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{m.date}</td>
                <td style={{ fontWeight: 700 }}>{m.cost}</td>
                <td><SABadge s={m.status} /></td>
                <td><button className="sa-link-btn" onClick={() => show("Updating status...")}><FaEdit /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── INTEGRATIONS: API SETTINGS ───────────────────────────────────────────────
function SAApiSettings() {
  const [intgs, setIntgs] = useState(integrations);
  const { toast, show } = useToast();
  const toggle = (id) => {
    setIntgs(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
    const item = intgs.find(i => i.id === id);
    show(`${item.name} ${item.enabled ? "disabled" : "enabled"}`);
  };
  const cats = [...new Set(intgs.map(i => i.category))];
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaPlug style={{ marginRight: 8 }} />API Settings</h2>
        <button className="btn btn-outline sa-btn-sm" onClick={() => show("API keys refreshed!")}><FaSync style={{ marginRight: 6 }} />Refresh Keys</button>
      </div>
      {cats.map(cat => (
        <div className="sa-card" key={cat}>
          <div className="sa-card-head"><h3>{cat} Services</h3></div>
          {intgs.filter(i => i.category === cat).map(i => (
            <div key={i.id} className="sa-integration-row">
              <div className="sa-integration-icon">{i.icon}</div>
              <div className="sa-integration-info">
                <strong>{i.name}</strong>
                <span>{i.description}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <SABadge s={i.enabled ? "enabled" : "disabled"} />
                <div className={`sa-toggle ${i.enabled ? "sa-toggle-on" : ""}`} onClick={() => toggle(i.id)} style={{ cursor: "pointer" }} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── INTEGRATIONS: THIRD-PARTY APPS ──────────────────────────────────────────
function SAThirdParty() {
  const [intgs, setIntgs] = useState(integrations);
  const { toast, show } = useToast();
  const toggle = (id) => {
    setIntgs(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
    const item = intgs.find(i => i.id === id);
    show(`${item.name} ${item.enabled ? "disconnected" : "connected"}`);
  };
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaBoxOpen style={{ marginRight: 8 }} />Third-party Apps</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => show("Browse integrations marketplace...")}><FaPlus style={{ marginRight: 6 }} />Add Integration</button>
      </div>
      <div className="sa-integrations-grid">
        {intgs.map(i => (
          <div className="sa-card sa-integration-card" key={i.id}>
            <div className="sa-integration-card-icon">{i.icon}</div>
            <h4>{i.name}</h4>
            <span className="sa-integration-cat">{i.category}</span>
            <p>{i.description}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
              <SABadge s={i.enabled ? "enabled" : "disabled"} />
              <button className={`sa-btn-sm ${i.enabled ? "btn btn-outline" : "btn btn-primary"}`} style={{ padding: "5px 12px", fontSize: ".78rem" }} onClick={() => toggle(i.id)}>
                {i.enabled ? "Disconnect" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DATA CENTER ──────────────────────────────────────────────────────────────
function SAImportData() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaCloudUploadAlt style={{ marginRight: 8 }} />Import Data</h2></div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Upload CSV / Excel File</h3></div>
        <div
          className={`sa-dropzone ${dragging ? "sa-dropzone-active" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); show("File ready to import!"); }}
        >
          <FaCloudUploadAlt style={{ fontSize: "2.5rem", color: "var(--accent)", marginBottom: 12 }} />
          <p>Drag & drop your CSV file here</p>
          <span>or</span>
          <label className="btn btn-outline sa-btn-sm" style={{ marginTop: 8, cursor: "pointer" }}>
            Browse File <input type="file" accept=".csv,.xlsx" style={{ display: "none" }} onChange={e => { setFile(e.target.files[0]); show("File selected!"); }} />
          </label>
          {file && <p style={{ marginTop: 12, color: "#22c55e", fontWeight: 600 }}>✓ {file.name}</p>}
        </div>
        <div className="sa-form-group" style={{ marginTop: 16 }}><label>Import Type</label>
          <select className="sa-input"><option>Members</option><option>Transactions</option><option>Equipment</option><option>Attendance</option></select>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn btn-primary sa-btn-sm" onClick={() => show("Import started! Processing...")} disabled={!file}>Start Import</button>
          <button className="btn btn-outline sa-btn-sm" onClick={() => show("Template downloaded!")}>Download Template</button>
        </div>
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Recent Imports</h3></div>
        <table className="sa-table">
          <thead><tr><th>File</th><th>Type</th><th>Records</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { file: "members_may2026.csv", type: "Members", records: 312, date: "May 1, 2026", status: "completed" },
              { file: "transactions_apr.csv", type: "Transactions", records: 1840, date: "Apr 30, 2026", status: "completed" },
              { file: "equipment_list.xlsx", type: "Equipment", records: 24, date: "Apr 15, 2026", status: "completed" },
            ].map((r, i) => (
              <tr key={i}>
                <td><strong>{r.file}</strong></td>
                <td><SABadge s={r.type.toLowerCase()} /></td>
                <td>{r.records.toLocaleString()}</td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{r.date}</td>
                <td><SABadge s={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SAExportData() {
  const { toast, show } = useToast();
  const exports = [
    { name: "All Members", desc: "Full member list with details", icon: <FaUsers />, color: "#3b82f6" },
    { name: "Transactions", desc: "Payment history & logs", icon: <FaCreditCard />, color: "#22c55e" },
    { name: "Revenue Report", desc: "Monthly revenue breakdown", icon: <FaMoneyBillWave />, color: "#f97316" },
    { name: "Equipment List", desc: "All equipment with status", icon: <FaTools />, color: "#8b5cf6" },
    { name: "Audit Logs", desc: "System activity history", icon: <FaShieldAlt />, color: "#ef4444" },
    { name: "Attendance Data", desc: "Check-in/check-out records", icon: <FaCalendarAlt />, color: "#06b6d4" },
  ];
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaCloudDownloadAlt style={{ marginRight: 8 }} />Export Data</h2></div>
      <div className="sa-export-grid">
        {exports.map((e, i) => (
          <div className="sa-card sa-export-card" key={i}>
            <div className="sa-export-icon" style={{ background: e.color + "22", color: e.color }}>{e.icon}</div>
            <h4>{e.name}</h4>
            <p>{e.desc}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn btn-outline sa-btn-sm" onClick={() => show(`Exporting ${e.name} as CSV...`)}><FaDownload style={{ marginRight: 4 }} />CSV</button>
              <button className="btn btn-outline sa-btn-sm" onClick={() => show(`Exporting ${e.name} as PDF...`)}><FaDownload style={{ marginRight: 4 }} />PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SABackups() {
  const { toast, show } = useToast();
  const backups = [
    { name: "Daily Backup", date: "May 6, 2026 3:00 AM", size: "2.4 GB", type: "auto", status: "completed" },
    { name: "Daily Backup", date: "May 5, 2026 3:00 AM", size: "2.3 GB", type: "auto", status: "completed" },
    { name: "Manual Backup", date: "May 3, 2026 2:15 PM", size: "2.3 GB", type: "manual", status: "completed" },
    { name: "Weekly Backup", date: "Apr 28, 2026 3:00 AM", size: "2.1 GB", type: "auto", status: "completed" },
  ];
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaDatabase style={{ marginRight: 8 }} />Backups</h2></div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaDatabase />} label="Last Backup" value="Today 3:00 AM" color="#22c55e" change="2.4 GB" />
        <KpiCard icon={<FaServer />} label="Total Backups" value={backups.length} color="#3b82f6" change="Last 30 days" />
        <KpiCard icon={<FaCheckCircle />} label="Success Rate" value="100%" color="#22c55e" />
      </div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3>Backup Actions</h3></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="btn btn-primary sa-btn-sm" onClick={() => show("Manual backup started...")}>
              <FaDatabase style={{ marginRight: 8 }} />Create Manual Backup
            </button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => show("Restore wizard coming soon...")}>
              <FaSync style={{ marginRight: 8 }} />Restore from Backup
            </button>
            <button className="btn btn-outline sa-btn-sm" onClick={() => show("Downloading latest backup...")}>
              <FaDownload style={{ marginRight: 8 }} />Download Latest
            </button>
          </div>
          <div className="sa-toggle-row" style={{ marginTop: 16 }}>
            <span>Auto Daily Backup</span>
            <div className="sa-toggle sa-toggle-on" />
          </div>
          <div className="sa-toggle-row">
            <span>Weekly Full Backup</span>
            <div className="sa-toggle sa-toggle-on" />
          </div>
          <div className="sa-toggle-row">
            <span>Cloud Sync (AWS S3)</span>
            <div className="sa-toggle sa-toggle-on" />
          </div>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3>Backup History</h3></div>
          {backups.map((b, i) => (
            <div key={i} className="sa-backup-row">
              <div>
                <strong>{b.name}</strong>
                <span>{b.date}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>{b.size}</span>
                <SABadge s={b.type} />
                <button className="sa-link-btn" onClick={() => show("Downloading...")}><FaDownload /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADVANCED: AI INSIGHTS ────────────────────────────────────────────────────
function SAAIInsights() {
  const { toast, show } = useToast();
  const typeColor = { revenue: "#22c55e", churn: "#ef4444", equipment: "#f97316", growth: "#3b82f6", finance: "#8b5cf6" };
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaRobot style={{ marginRight: 8 }} />AI Insights</h2>
        <button className="btn btn-outline sa-btn-sm" onClick={() => show("Refreshing AI analysis...")}><FaSync style={{ marginRight: 6 }} />Refresh</button>
      </div>
      <div className="sa-card" style={{ background: "linear-gradient(135deg, rgba(239,68,68,.08), rgba(139,92,246,.08))", border: "1px solid rgba(139,92,246,.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <FaRobot style={{ fontSize: "1.5rem", color: "#8b5cf6" }} />
          <div>
            <strong style={{ color: "var(--text-primary)" }}>AI Analysis Engine</strong>
            <p style={{ margin: 0, fontSize: ".8rem", color: "var(--text-secondary)" }}>Last analyzed: Today at 6:00 AM · 5 insights generated</p>
          </div>
          <span className="sa-badge sa-green" style={{ marginLeft: "auto" }}>Active</span>
        </div>
      </div>
      <div className="sa-ai-grid">
        {aiInsights.map(insight => (
          <div className="sa-card sa-ai-card" key={insight.id} style={{ borderLeft: `3px solid ${typeColor[insight.type] || "#6b7280"}` }}>
            <div className="sa-ai-card-head">
              <span className="sa-ai-icon">{insight.icon}</span>
              <h4>{insight.title}</h4>
            </div>
            <p>{insight.insight}</p>
            <button className="btn btn-outline sa-btn-sm" style={{ marginTop: 12 }} onClick={() => show(`Action: ${insight.action}`)}>{insight.action} →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADVANCED: FEATURE FLAGS ──────────────────────────────────────────────────
function SAFeatureFlags({ openForm }) {
  const [flags, setFlags] = useState(featureFlags);
  const { toast, show } = useToast();
  const toggle = (id) => {
    const flag = flags.find(f => f.id === id);
    setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    show(`${flag.name} ${flag.enabled ? "disabled" : "enabled"}`);
  };
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaFlag style={{ marginRight: 8 }} />Feature Flags</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("addFeatureFlag")}><FaPlus style={{ marginRight: 6 }} />Add Flag</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaToggleOn />} label="Enabled Features" value={flags.filter(f => f.enabled).length} color="#22c55e" />
        <KpiCard icon={<FaToggleOff />} label="Disabled Features" value={flags.filter(f => !f.enabled).length} color="#6b7280" />
        <KpiCard icon={<FaFlag />} label="Total Flags" value={flags.length} color="#3b82f6" />
      </div>
      <div className="sa-card">
        <table className="sa-table">
          <thead><tr><th>Feature</th><th>Key</th><th>Environment</th><th>Description</th><th>Status</th><th>Toggle</th></tr></thead>
          <tbody>
            {flags.map(f => (
              <tr key={f.id}>
                <td><strong>{f.name}</strong></td>
                <td><code style={{ fontSize: ".72rem", color: "var(--accent)" }}>{f.key}</code></td>
                <td><SABadge s={f.env} /></td>
                <td style={{ fontSize: ".8rem", color: "var(--text-secondary)", maxWidth: 220 }}>{f.description}</td>
                <td><SABadge s={f.enabled ? "enabled" : "disabled"} /></td>
                <td>
                  <div className={`sa-toggle ${f.enabled ? "sa-toggle-on" : ""}`} onClick={() => toggle(f.id)} style={{ cursor: "pointer" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADVANCED: LIVE MONITORING ────────────────────────────────────────────────
function SALiveMonitoring() {
  const [tick, setTick] = useState(0);
  const { toast, show } = useToast();
  // Simulate live updates
  const activeNow = liveMonitoring.activeUsers + Math.floor(Math.sin(tick) * 5);
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaSignal style={{ marginRight: 8 }} />Live Monitoring</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "sa-pulse 1.5s infinite" }} />
          <span style={{ fontSize: ".8rem", color: "#22c55e", fontWeight: 700 }}>LIVE</span>
          <button className="btn btn-outline sa-btn-sm" onClick={() => show("Refreshed!")}><FaSync /></button>
        </div>
      </div>
      <div className="sa-kpi-grid">
        <KpiCard icon={<FaUsers />} label="Active Users Now" value={activeNow} color="#22c55e" change="Real-time" />
        <KpiCard icon={<FaCalendarAlt />} label="Check-ins Today" value={liveMonitoring.checkInsToday} color="#3b82f6" change="Across all branches" />
        <KpiCard icon={<FaHeartbeat />} label="Peak Hour" value={liveMonitoring.peakHour} color="#f97316" />
        <KpiCard icon={<FaServer />} label="Server Load" value={`${liveMonitoring.currentLoad}%`} color={liveMonitoring.currentLoad > 80 ? "#ef4444" : "#22c55e"} change={liveMonitoring.currentLoad > 80 ? "High load!" : "Normal"} />
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Branch Live Status</h3></div>
        {liveMonitoring.branchLive.map((b, i) => (
          <div key={i} className="sa-live-row">
            <div className="sa-live-dot" />
            <strong style={{ width: 120 }}>{b.branch}</strong>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", marginBottom: 4 }}>
                <span>{b.active} active now</span>
                <span>{b.checkins} check-ins today</span>
              </div>
              <div style={{ background: "var(--bg-primary)", borderRadius: 4, height: 8 }}>
                <div style={{ width: `${(b.active / 80) * 100}%`, height: "100%", background: "#22c55e", borderRadius: 4, transition: "width .5s" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>System Load</h3></div>
        <div className="sa-health-grid">
          {[["CPU","68%","#22c55e"],["Memory","72%","#f97316"],["Disk","45%","#22c55e"],["Network","38%","#22c55e"],["DB Connections","82%","#f97316"],["Cache Hit","94%","#22c55e"]].map(([s, v, c]) => (
            <div className="sa-health-item" key={s}>
              <div className="sa-health-dot" style={{ background: c }} />
              <span>{s}</span>
              <strong style={{ color: c }}>{v}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECURITY: AUDIT LOGS ─────────────────────────────────────────────────────
function SAAudit() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = auditLog.filter(a =>
    (filter === "all" || a.type === filter) &&
    (a.user.toLowerCase().includes(search.toLowerCase()) || a.action.toLowerCase().includes(search.toLowerCase()))
  );
  const typeColor = { create: "#22c55e", update: "#3b82f6", delete: "#ef4444", system: "#8b5cf6" };
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaShieldAlt style={{ marginRight: 8 }} />Audit & Logs</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export Log</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <KpiCard icon={<FaShieldAlt />} label="Total Events" value={auditLog.length} color="#3b82f6" />
        <KpiCard icon={<FaPlus />} label="Create Events" value={auditLog.filter(a => a.type === "create").length} color="#22c55e" />
        <KpiCard icon={<FaEdit />} label="Update Events" value={auditLog.filter(a => a.type === "update").length} color="#f97316" />
        <KpiCard icon={<FaTrash />} label="Delete Events" value={auditLog.filter(a => a.type === "delete").length} color="#ef4444" />
      </div>
      <div className="sa-filters">
        <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        {["all", "create", "update", "delete", "system"].map(f => (
          <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="sa-card">
        {filtered.length === 0 ? <EmptyState title="No audit events found" /> : (
          <table className="sa-table">
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Target</th><th>IP</th><th>Type</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontSize: ".75rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{a.time}</td>
                  <td><strong>{a.user}</strong></td>
                  <td>{a.action}</td>
                  <td style={{ color: "var(--text-secondary)", fontSize: ".8rem" }}>{a.target}</td>
                  <td><code style={{ fontSize: ".72rem", color: "var(--accent)" }}>{a.ip}</code></td>
                  <td><span className="sa-badge" style={{ background: (typeColor[a.type] || "#6b7280") + "22", color: typeColor[a.type] || "#6b7280" }}>{a.type}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── SECURITY: LOGIN HISTORY ──────────────────────────────────────────────────
function SALoginHistory() {
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaUserClock style={{ marginRight: 8 }} />Login History</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaCheckCircle />} label="Successful Logins" value={loginHistory.filter(l => l.status === "success").length} color="#22c55e" />
        <KpiCard icon={<FaTimesCircle />} label="Failed Attempts" value={loginHistory.filter(l => l.status === "failed").length} color="#ef4444" />
        <KpiCard icon={<FaShieldVirus />} label="Blocked" value={loginHistory.filter(l => l.status === "blocked").length} color="#8b5cf6" />
      </div>
      <div className="sa-card">
        <table className="sa-table">
          <thead><tr><th>User</th><th>Role</th><th>Time</th><th>Device</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>
            {loginHistory.map(l => (
              <tr key={l.id}>
                <td><strong>{l.user}</strong></td>
                <td><SABadge s={l.role === "—" ? "gray" : l.role} /></td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{l.time}</td>
                <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{l.device}</td>
                <td style={{ fontSize: ".78rem" }}><FaMapMarkerAlt style={{ marginRight: 4, color: "var(--text-secondary)" }} />{l.location}</td>
                <td><SABadge s={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SECURITY: SYSTEM LOGS ────────────────────────────────────────────────────
function SASystemLogs() {
  const [filter, setFilter] = useState("all");
  const filtered = systemLogs.filter(l => filter === "all" || l.level === filter);
  const levelIcon = { error: <FaTimesCircle />, warning: <FaExclamationTriangle />, info: <FaInfoCircle /> };
  const levelColor = { error: "#ef4444", warning: "#f97316", info: "#3b82f6" };
  return (
    <div className="sa-section">
      <div className="sa-section-head">
        <h2><FaExclamationTriangle style={{ marginRight: 8 }} />System Logs</h2>
        <button className="btn btn-outline sa-btn-sm"><FaDownload style={{ marginRight: 6 }} />Export Logs</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaTimesCircle />} label="Errors" value={systemLogs.filter(l => l.level === "error").length} color="#ef4444" />
        <KpiCard icon={<FaExclamationTriangle />} label="Warnings" value={systemLogs.filter(l => l.level === "warning").length} color="#f97316" />
        <KpiCard icon={<FaInfoCircle />} label="Info" value={systemLogs.filter(l => l.level === "info").length} color="#3b82f6" />
      </div>
      <div className="sa-filters">
        {["all", "error", "warning", "info"].map(f => (
          <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="sa-card">
        {filtered.map(l => (
          <div key={l.id} className="sa-log-row" style={{ borderLeft: `3px solid ${levelColor[l.level]}` }}>
            <div style={{ color: levelColor[l.level], fontSize: "1rem", flexShrink: 0 }}>{levelIcon[l.level]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: ".85rem" }}>{l.message}</strong>
                <small style={{ color: "var(--text-secondary)" }}>{l.time}</small>
              </div>
              <span style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>{l.service}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SASettings() {
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaCog style={{ marginRight: 8 }} />General Settings</h2></div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3>Gym Information</h3></div>
          {[["Gym Name", systemSettings.gymName], ["Support Email", systemSettings.email], ["Phone", systemSettings.phone], ["Timezone", systemSettings.timezone], ["Currency", systemSettings.currency]].map(([l, v]) => (
            <div className="sa-form-group" key={l}><label>{l}</label><input className="sa-input" defaultValue={v} /></div>
          ))}
          <button className="btn btn-primary sa-btn-sm" style={{ marginTop: 8 }} onClick={() => show("Settings saved!")}>Save Changes</button>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3>Branding</h3></div>
          <div className="sa-form-group"><label>Logo URL</label><input className="sa-input" placeholder="https://..." /></div>
          <div className="sa-form-group"><label>Primary Color</label><input className="sa-input" defaultValue="#ef4444" type="color" style={{ height: 42 }} /></div>
          <div className="sa-form-group"><label>Tagline</label><input className="sa-input" defaultValue="Transform Your Body" /></div>
          <button className="btn btn-primary sa-btn-sm" style={{ marginTop: 8 }} onClick={() => show("Branding updated!")}>Update Branding</button>
        </div>
      </div>
    </div>
  );
}

function SANotifSettings() {
  const [settings, setSettings] = useState({
    emailNotif: true, smsAlerts: false, pushNotif: false, weeklyReports: true,
    paymentAlerts: true, expiryReminders: true, systemAlerts: true, marketingEmails: false,
  });
  const { toast, show } = useToast();
  const toggle = (key) => { setSettings(s => ({ ...s, [key]: !s[key] })); show("Setting updated!"); };
  const rows = [
    ["emailNotif", "Email Notifications", "Receive alerts via email"],
    ["smsAlerts", "SMS Alerts", "Receive alerts via SMS"],
    ["pushNotif", "Push Notifications", "Browser push notifications"],
    ["weeklyReports", "Weekly Reports", "Automated weekly summary"],
    ["paymentAlerts", "Payment Alerts", "Failed/successful payment alerts"],
    ["expiryReminders", "Expiry Reminders", "Member subscription expiry alerts"],
    ["systemAlerts", "System Alerts", "Server & platform alerts"],
    ["marketingEmails", "Marketing Emails", "Promotional campaign emails"],
  ];
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaBell style={{ marginRight: 8 }} />Notification Settings</h2></div>
      <div className="sa-card">
        {rows.map(([key, label, desc]) => (
          <div key={key} className="sa-toggle-row">
            <div><strong style={{ display: "block", fontSize: ".88rem" }}>{label}</strong><span style={{ fontSize: ".75rem", color: "var(--text-secondary)" }}>{desc}</span></div>
            <div className={`sa-toggle ${settings[key] ? "sa-toggle-on" : ""}`} onClick={() => toggle(key)} style={{ cursor: "pointer" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SASysConfig() {
  const { toast, show } = useToast();
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head"><h2><FaServer style={{ marginRight: 8 }} />System Configuration</h2></div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3>Performance</h3></div>
          {[["Cache TTL (seconds)", "3600"], ["Max Upload Size (MB)", "50"], ["Session Timeout (min)", "30"], ["API Rate Limit (req/min)", "100"]].map(([l, v]) => (
            <div className="sa-form-group" key={l}><label>{l}</label><input className="sa-input" defaultValue={v} type="number" /></div>
          ))}
          <button className="btn btn-primary sa-btn-sm" style={{ marginTop: 8 }} onClick={() => show("Config saved!")}>Save Config</button>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3>System Toggles</h3></div>
          {[["Maintenance Mode", false], ["Debug Logging", false], ["Two-Factor Auth", true], ["IP Whitelist", false], ["Auto-Scaling", true]].map(([l, v]) => (
            <div key={l} className="sa-toggle-row">
              <span>{l}</span>
              <div className={`sa-toggle ${v ? "sa-toggle-on" : ""}`} onClick={() => show(`${l} toggled`)} style={{ cursor: "pointer" }} />
            </div>
          ))}
        </div>
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Danger Zone</h3></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn sa-btn-sm" style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }} onClick={() => show("Clearing cache...")}>Clear Cache</button>
          <button className="btn sa-btn-sm" style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }} onClick={() => show("Flushing sessions...")}>Flush Sessions</button>
          <button className="btn sa-btn-sm" style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444" }} onClick={() => show("Rebuilding search index...")}>Rebuild Index</button>
        </div>
      </div>
    </div>
  );
}

// ─── SUPPORT: TICKETS ─────────────────────────────────────────────────────────
function SATickets({ openForm }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { toast, show } = useToast();
  const filtered = supportTickets.filter(t =>
    (filter === "all" || t.status === filter) &&
    (t.user.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="sa-section">
      {toast && <Toast msg={toast} onClose={() => {}} />}
      <div className="sa-section-head">
        <h2><FaTicketAlt style={{ marginRight: 8 }} />Support Tickets</h2>
        <button className="btn btn-primary sa-btn-sm" onClick={() => openForm("createTicket")}><FaPlus style={{ marginRight: 6 }} />New Ticket</button>
      </div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaExclamationCircle />} label="Open" value={supportTickets.filter(t => t.status === "open").length} color="#ef4444" />
        <KpiCard icon={<FaSync />} label="In Progress" value={supportTickets.filter(t => t.status === "in-progress").length} color="#f97316" />
        <KpiCard icon={<FaCheckCircle />} label="Closed" value={supportTickets.filter(t => t.status === "closed").length} color="#22c55e" />
      </div>
      <div className="sa-filters">
        <div className="sa-search-wrap"><FaSearch className="sa-search-icon" /><input className="sa-input sa-input-search" placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        {["all", "open", "in-progress", "closed"].map(f => (
          <button key={f} className={`sa-filter-btn ${filter === f ? "sa-filter-active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="sa-card">
        {filtered.length === 0 ? <EmptyState title="No tickets found" /> : (
          <table className="sa-table">
            <thead><tr><th>ID</th><th>User</th><th>Subject</th><th>Priority</th><th>Assigned</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td><code style={{ fontSize: ".72rem", color: "var(--accent)" }}>{t.id}</code></td>
                  <td><strong>{t.user}</strong></td>
                  <td style={{ maxWidth: 180 }}>{t.subject}</td>
                  <td><SABadge s={t.priority} /></td>
                  <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{t.assigned}</td>
                  <td style={{ fontSize: ".78rem", color: "var(--text-secondary)" }}>{t.created}</td>
                  <td><SABadge s={t.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="sa-link-btn" onClick={() => show(`Viewing ticket ${t.id}`)}>View</button>
                      <button className="sa-link-btn" onClick={() => show(`Assigning ${t.id}`)}>Assign</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── SUPPORT: FEEDBACK ────────────────────────────────────────────────────────
function SAFeedback() {
  const avgRating = (feedbackData.reduce((a, b) => a + b.rating, 0) / feedbackData.length).toFixed(1);
  return (
    <div className="sa-section">
      <div className="sa-section-head"><h2><FaStar style={{ marginRight: 8 }} />Feedback</h2></div>
      <div className="sa-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard icon={<FaStar />} label="Average Rating" value={`${avgRating}/5`} color="#f97316" />
        <KpiCard icon={<FaComments />} label="Total Reviews" value={feedbackData.length} color="#3b82f6" />
        <KpiCard icon={<FaCheckCircle />} label="5-Star Reviews" value={feedbackData.filter(f => f.rating === 5).length} color="#22c55e" />
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Rating Distribution</h3></div>
        {[5, 4, 3, 2, 1].map(r => {
          const count = feedbackData.filter(f => f.rating === r).length;
          return (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ width: 20, fontSize: ".82rem", fontWeight: 700 }}>{r}★</span>
              <div style={{ flex: 1, background: "var(--bg-primary)", borderRadius: 4, height: 10 }}>
                <div style={{ width: `${(count / feedbackData.length) * 100}%`, height: "100%", background: "#f97316", borderRadius: 4 }} />
              </div>
              <span style={{ width: 20, fontSize: ".78rem", color: "var(--text-secondary)" }}>{count}</span>
            </div>
          );
        })}
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Recent Feedback</h3></div>
        {feedbackData.map(f => (
          <div key={f.id} className="sa-feedback-row">
            <div className="sa-feedback-head">
              <strong>{f.user}</strong>
              <div style={{ display: "flex", gap: 2 }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar key={i} style={{ color: i < f.rating ? "#f97316" : "var(--border-color)", fontSize: ".8rem" }} />
                ))}
              </div>
              <SABadge s={f.category.toLowerCase()} />
              <small style={{ color: "var(--text-secondary)", marginLeft: "auto" }}>{f.date}</small>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: ".85rem", color: "var(--text-secondary)" }}>{f.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, open, onClose }) {
  const [expanded, setExpanded] = useState(() => {
    const group = NAV_GROUPS.find(g => g.items.some(i => i.id === active));
    return group ? group.label : null;
  });
  const [collapsed, setCollapsed] = useState(false);

  const toggleGroup = (label) => {
    if (collapsed) { setCollapsed(false); setExpanded(label); return; }
    setExpanded(prev => prev === label ? null : label);
  };

  return (
    <>
      <aside className={`sa-sidebar ${open ? "sa-sidebar-open" : ""} ${collapsed ? "sa-sidebar-collapsed" : ""}`}>
        {/* Brand */}
        <div className="sa-sidebar-brand">
          <span className="sa-brand-icon">⚡</span>
          {!collapsed && <span className="sa-brand-text">FitZone <em>Super Admin</em></span>}
          <button
            className="sa-sidebar-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FaAngleDown style={{ transform: "rotate(-90deg)" }} /> : <FaAngleDown style={{ transform: "rotate(90deg)" }} />}
          </button>
        </div>

        {/* User */}
        {!collapsed && (
          <div className="sa-sidebar-user">
            <div className="sa-avatar">SA</div>
            <div>
              <strong>Super Admin</strong>
              <span>System Owner</span>
            </div>
          </div>
        )}

        <nav className="sa-nav">
          {/* ── Dashboard: direct link, no dropdown ── */}
          <div className="sa-nav-direct">
            <button
              className={`sa-nav-item sa-nav-direct-item ${active === DASHBOARD_ITEM.id ? "sa-nav-active" : ""}`}
              onClick={() => { onNav(DASHBOARD_ITEM.id); onClose(); }}
              title={collapsed ? DASHBOARD_ITEM.label : undefined}
            >
              <span
                className="sa-nav-icon-bubble"
                style={{ background: `${DASHBOARD_ITEM.color}22`, color: DASHBOARD_ITEM.color }}
              >
                {DASHBOARD_ITEM.icon}
              </span>
              {!collapsed && <span>{DASHBOARD_ITEM.label}</span>}
            </button>
          </div>

          {/* ── Grouped dropdown items ── */}
          {NAV_GROUPS.map(group => {
            const isOpen = !collapsed && expanded === group.label;
            const hasActive = group.items.some(i => i.id === active);
            return (
              <div key={group.label} className={`sa-nav-group ${hasActive ? "sa-nav-group-has-active" : ""}`}>
                <button
                  className={`sa-nav-group-header ${isOpen ? "sa-nav-group-header-open" : ""} ${hasActive ? "sa-nav-group-header-has-active" : ""}`}
                  onClick={() => toggleGroup(group.label)}
                  aria-expanded={isOpen}
                  title={collapsed ? group.label : undefined}
                >
                  <span
                    className="sa-nav-icon-bubble"
                    style={{ background: `${group.color}22`, color: group.color }}
                  >
                    {group.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="sa-nav-group-label">{group.label}</span>
                      <span className={`sa-nav-chevron ${isOpen ? "sa-nav-chevron-open" : ""}`}>
                        <FaAngleDown />
                      </span>
                    </>
                  )}
                </button>
                {!collapsed && (
                  <div className={`sa-nav-group-items ${isOpen ? "sa-nav-group-items-open" : ""}`}>
                    {group.items.map(n => (
                      <button
                        key={n.id}
                        className={`sa-nav-item ${active === n.id ? "sa-nav-active" : ""}`}
                        onClick={() => { onNav(n.id); onClose(); }}
                      >
                        <span
                          className="sa-nav-icon-bubble sa-nav-icon-bubble-sm"
                          style={{ background: `${n.color}22`, color: n.color }}
                        >
                          {n.icon}
                        </span>
                        <span>{n.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sa-sidebar-foot">
          <Link to="/" className="sa-nav-item" title={collapsed ? "Back to Site" : undefined}>
            <span className="sa-nav-icon-bubble" style={{ background: "rgba(100,116,139,.15)", color: "#64748b" }}><FaHome /></span>
            {!collapsed && <span>Back to Site</span>}
          </Link>
          <Link to="/dashboard/admin" className="sa-nav-item" title={collapsed ? "Admin View" : undefined}>
            <span className="sa-nav-icon-bubble" style={{ background: "rgba(239,68,68,.15)", color: "#ef4444" }}><FaUserShield /></span>
            {!collapsed && <span>Admin View</span>}
          </Link>
        </div>
      </aside>
      {open && <div className="sa-overlay" onClick={onClose} />}
    </>
  );
}

// ─── SECTION ROUTER ───────────────────────────────────────────────────────────
function renderSection(active, openForm) {
  const map = {
    overview:             <SAOverview />,
    users:                <SAUsers openForm={openForm} />,
    branches:             <SABranches openForm={openForm} />,
    content:              <SAContent openForm={openForm} />,
    billing:              <SABilling />,
    revenue:              <SARevenue />,
    transactions:         <SATransactions />,
    plans:                <SAPlans openForm={openForm} />,
    reports:              <SAReports />,
    "members-analytics":  <SAMemberAnalytics />,
    "fin-analytics":      <SAFinancialAnalytics />,
    "notifications-center": <SANotificationsCenter />,
    campaigns:            <SACampaigns openForm={openForm} />,
    communication:        <SACommunication />,
    equipment:            <SAEquipment openForm={openForm} />,
    vendors:              <SAVendors openForm={openForm} />,
    maintenance:          <SAMaintenance openForm={openForm} />,
    "api-settings":       <SAApiSettings />,
    "third-party":        <SAThirdParty />,
    "import-data":        <SAImportData />,
    "export-data":        <SAExportData />,
    backups:              <SABackups />,
    "ai-insights":        <SAAIInsights />,
    "feature-flags":      <SAFeatureFlags openForm={openForm} />,
    "live-monitoring":    <SALiveMonitoring />,
    audit:                <SAAudit />,
    "login-history":      <SALoginHistory />,
    "system-logs":        <SASystemLogs />,
    settings:             <SASettings />,
    "notif-settings":     <SANotifSettings />,
    "sys-config":         <SASysConfig />,
    tickets:              <SATickets openForm={openForm} />,
    feedback:             <SAFeedback />,
  };
  return map[active] || (
    <div className="sa-section">
      <div className="sa-card" style={{ textAlign: "center", padding: "60px", color: "var(--text-secondary)" }}>
        <FaCog style={{ fontSize: "3rem", marginBottom: 12, opacity: .4 }} />
        <p>Section under development.</p>
      </div>
    </div>
  );
}

// ─── TOPBAR NOTIFICATION BELL ─────────────────────────────────────────────────
function TopbarBell({ onNav }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div style={{ position: "relative" }}>
      <button style={{ background: "none", border: "none", cursor: "pointer", position: "relative", color: "var(--text-secondary)", fontSize: "1.1rem" }} onClick={() => setOpen(o => !o)}>
        <FaBell />
        {unread > 0 && <span className="sa-notif-badge">{unread}</span>}
      </button>
      {open && (
        <div className="sa-notif-dropdown">
          <div className="sa-notif-dropdown-head">
            <strong>Notifications</strong>
            <span className="sa-badge sa-red">{unread} new</span>
          </div>
          {notifications.slice(0, 4).map(n => (
            <div key={n.id} className={`sa-notif-item ${!n.read ? "sa-notif-item-unread" : ""}`}>
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <small>{n.time}</small>
            </div>
          ))}
          <button className="sa-notif-view-all" onClick={() => { setOpen(false); onNav("notifications-center"); }}>View All Notifications</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function SuperAdminDashboardPage() {
  const { user, isLoggedIn } = useAuth();
  const [active, setActive] = useState(DASHBOARD_ITEM.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeForm, formData, openForm, closeForm, isOpen } = useFormModal();
  const [toast, setToast] = useState(null);
  const { themeId, setThemeId, themes } = useDashboardTheme();
  const go = useCallback(id => setActive(id), []);

  // Check if user is super admin
  if (!isLoggedIn || user?.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  const allItems = [DASHBOARD_ITEM, ...NAV_GROUPS.flatMap(g => g.items)];
  const currentLabel = allItems.find(i => i.id === active)?.label || "Dashboard";

  const handleFormSubmit = () => {
    closeForm();
    setToast(`✅ ${formTitles[activeForm] || "Action"} completed successfully!`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="sa-layout">
      <Sidebar active={active} onNav={go} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sa-main">
        <header className="sa-topbar">
          <button className="sa-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="sa-topbar-title">Super Admin · {currentLabel}</span>
          <div className="sa-topbar-right">
            <DashboardThemeSwitcher themeId={themeId} setThemeId={setThemeId} themes={themes} />
            <TopbarBell onNav={go} />
            <div className="sa-avatar sa-avatar-sm">SA</div>
          </div>
        </header>
        <main className="sa-content">
          {renderSection(active, openForm)}
        </main>
      </div>

      {/* Global Form Modal */}
      <FormModal
        isOpen={isOpen}
        onClose={closeForm}
        title={formTitles[activeForm] || "Form"}
        size="md"
      >
        <FormRenderer
          formType={activeForm}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          accentColor="#ef4444"
          data={formData}
        />
      </FormModal>

      {/* Global Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 10000,
          background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
          borderLeft: "4px solid #22c55e", borderRadius: 10,
          padding: "14px 20px", fontSize: ".88rem", color: "var(--text-primary)",
          boxShadow: "0 8px 24px rgba(0,0,0,.2)", animation: "slideUp 0.3s ease-out",
          display: "flex", alignItems: "center", gap: 10, maxWidth: 360,
        }}>
          {toast}
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", marginLeft: "auto", fontSize: "1.1rem" }}>×</button>
        </div>
      )}
    </div>
  );
}
