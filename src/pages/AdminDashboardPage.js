import { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import {
  adminInfo, kpiData, revenueData, memberGrowthData,
  members, trainers, classes, enquiries,
  equipmentLog, pendingPayments, dueRenewals,
  attendanceData, popularClasses,
} from "../data/adminDashboardData";
import "../admin-dashboard.css";

// ── Sidebar nav ──────────────────────────────────────────────
const NAV = [
  { id:"overview",  icon:"📊", label:"Overview"       },
  { id:"members",   icon:"👥", label:"Members"        },
  { id:"trainers",  icon:"🏋️", label:"Staff"          },
  { id:"classes",   icon:"📅", label:"Classes"        },
  { id:"enquiries", icon:"📋", label:"Enquiries"      },
  { id:"reports",   icon:"📈", label:"Reports"        },
  { id:"equipment", icon:"🔧", label:"Operations"     },
  { id:"billing",   icon:"💳", label:"Billing"        },
];

// ── Shared badge ─────────────────────────────────────────────
const ABadge = memo(({ s }) => {
  const m = {
    active:"ad-green", expired:"ad-red", suspended:"ad-yellow",
    new:"ad-blue", contacted:"ad-yellow", converted:"ad-green",
    not_interested:"ad-gray", operational:"ad-green",
    maintenance:"ad-yellow", out_of_order:"ad-red",
    paid:"ad-green", on_leave:"ad-yellow", inactive:"ad-gray",
  };
  return <span className={`ad-badge ${m[s] || "ad-gray"}`}>{s?.replace(/_/g," ")}</span>;
});

// ── Bar chart (reusable) ─────────────────────────────────────
function BarChart({ data, labels, color = "var(--accent)", height = 130 }) {
  const max = Math.max(...data);
  return (
    <div className="ad-bar-chart" style={{ height }}>
      {data.map((v, i) => (
        <div className="ad-bar-col" key={i}>
          <span className="ad-bar-val">{typeof v === "number" && v >= 1000 ? `$${(v/1000).toFixed(0)}k` : v}</span>
          <div className="ad-bar" style={{ height:`${(v/max)*100}%`, background: color }} />
          <span className="ad-bar-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Horizontal progress bar ──────────────────────────────────
function ProgressBar({ value, max = 100, color = "var(--accent)" }) {
  return (
    <div style={{ background:"var(--bg-primary)", borderRadius:4, height:8, overflow:"hidden" }}>
      <div style={{ width:`${(value/max)*100}%`, height:"100%", background:color, borderRadius:4, transition:"width .4s" }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// A. OVERVIEW
// ════════════════════════════════════════════════════════════
function AdminOverview() {
  const months  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const mShort  = ["J","F","M","A","M","J","J","A","S","O","N","D"];

  return (
    <div className="ad-section">
      {/* KPI grid */}
      <div className="ad-kpi-grid">
        {kpiData.map((k, i) => (
          <div className="ad-kpi-card" key={i}>
            <div className="ad-kpi-icon" style={{ background: k.color + "22" }}>{k.icon}</div>
            <div>
              <strong>{k.value}</strong>
              <span>{k.label}</span>
              <small>{k.change}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue + Member Growth */}
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>💰 Revenue Trend (12 months)</h3></div>
          <BarChart data={revenueData} labels={months} color="var(--accent)" />
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>📈 New Member Growth</h3></div>
          <BarChart data={memberGrowthData} labels={mShort} color="#22c55e" />
        </div>
      </div>

      {/* Attendance + Heatmap */}
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>🏃 Weekly Attendance</h3></div>
          <BarChart
            data={attendanceData.map(d => d.checkins)}
            labels={attendanceData.map(d => d.day)}
            color="#3b82f6"
            height={110}
          />
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>🔥 Class Occupancy Heatmap</h3></div>
          <div className="ad-heatmap">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
              <div className="ad-heatmap-row" key={d}>
                <span>{d}</span>
                {["6AM","8AM","10AM","12PM","3PM","5PM","7PM","9PM"].map(t => {
                  const v = Math.floor(Math.random() * 100);
                  return <div key={t} className="ad-heat-cell" style={{ background:`rgba(232,98,42,${v/100})` }} title={`${d} ${t}: ${v}%`} />;
                })}
              </div>
            ))}
            <div className="ad-heatmap-times">
              {["6AM","8AM","10AM","12PM","3PM","5PM","7PM","9PM"].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Due renewals quick view */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>⚠️ Due Renewals</h3>
          <span className="ad-badge ad-red">{pendingPayments.length} overdue</span>
        </div>
        <table className="ad-table">
          <thead><tr><th>Member</th><th>Plan</th><th>Amount</th><th>Due Date</th><th>Days Overdue</th><th>Action</th></tr></thead>
          <tbody>
            {pendingPayments.map((p, i) => (
              <tr key={i}>
                <td><strong>{p.member}</strong></td>
                <td>{p.plan}</td>
                <td><strong>{p.amount}</strong></td>
                <td>{p.due}</td>
                <td><span className="ad-badge ad-red">{p.days} days</span></td>
                <td><button className="ad-link-btn">Send Reminder</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// B. MEMBER MANAGEMENT
// ════════════════════════════════════════════════════════════
function AdminMembers() {
  const [list, setList]       = useState(members);
  const [search, setSearch]   = useState("");
  const [planF, setPlanF]     = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [viewMember, setViewMember] = useState(null);
  const [newMember, setNewMember]   = useState({ name:"", email:"", phone:"", plan:"Monthly" });

  const plans   = ["all", "Monthly", "Quarterly", "Half-Yearly", "Annual"];
  const statuses = ["all", "active", "expired", "suspended"];

  const filtered = list.filter(m =>
    (statusF === "all" || m.status === statusF) &&
    (planF   === "all" || m.plan   === planF) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleStatus = (id) => {
    setList(prev => prev.map(m =>
      m.id === id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m
    ));
  };

  const addMember = () => {
    if (!newMember.name || !newMember.email) return;
    setList(prev => [...prev, { ...newMember, id: Date.now(), status:"active", expiry:"—", joined:"May 2025", checkins:0, trainer:"—" }]);
    setNewMember({ name:"", email:"", phone:"", plan:"Monthly" });
    setShowAdd(false);
  };

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>👥 Member Management</h2>
        <div className="ad-head-actions">
          <button className="btn btn-primary ad-btn-sm" onClick={() => setShowAdd(true)}>+ Add Member</button>
          <button className="btn btn-outline ad-btn-sm">⬇ Export CSV</button>
        </div>
      </div>

      {/* Filters */}
      <div className="ad-filters">
        <input className="ad-input" placeholder="🔍 Search name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:220 }} />
        <div className="ad-filter-group">
          <span className="ad-filter-label">Plan:</span>
          {plans.map(f => (
            <button key={f} className={`ad-filter-btn ${planF === f ? "ad-filter-active" : ""}`} onClick={() => setPlanF(f)}>{f}</button>
          ))}
        </div>
        <div className="ad-filter-group">
          <span className="ad-filter-label">Status:</span>
          {statuses.map(f => (
            <button key={f} className={`ad-filter-btn ${statusF === f ? "ad-filter-active" : ""}`} onClick={() => setStatusF(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className="ad-card">
        <div className="ad-card-head">
          <h3>Showing {filtered.length} of {list.length} members</h3>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Name</th><th>Email</th><th>Plan</th><th>Status</th><th>Expiry</th><th>Check-ins</th><th>Trainer</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td style={{ fontSize:".8rem" }}>{m.email}</td>
                  <td>{m.plan}</td>
                  <td><ABadge s={m.status} /></td>
                  <td>{m.expiry}</td>
                  <td>{m.checkins}</td>
                  <td style={{ fontSize:".8rem" }}>{m.trainer}</td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="ad-link-btn" onClick={() => setViewMember(m)}>View</button>
                      <button className="ad-link-btn" style={{ color: m.status === "active" ? "#ef4444" : "#22c55e" }} onClick={() => toggleStatus(m.id)}>
                        {m.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAdd && (
        <div className="ad-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-head">
              <h3>Add New Member</h3>
              <button onClick={() => setShowAdd(false)}>✕</button>
            </div>
            <div className="ad-modal-body">
              {[["Full Name","name","text"],["Email","email","email"],["Phone","phone","tel"]].map(([label, key, type]) => (
                <div className="ad-form-group" key={key}>
                  <label>{label}</label>
                  <input className="ad-input" type={type} placeholder={label}
                    value={newMember[key]} onChange={e => setNewMember(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div className="ad-form-group">
                <label>Membership Plan</label>
                <select className="ad-input" value={newMember.plan} onChange={e => setNewMember(p => ({ ...p, plan: e.target.value }))}>
                  {["Monthly","Quarterly","Half-Yearly","Annual"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={addMember}>Add Member</button>
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {viewMember && (
        <div className="ad-modal-overlay" onClick={() => setViewMember(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-head">
              <h3>Member Details</h3>
              <button onClick={() => setViewMember(null)}>✕</button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-member-detail-grid">
                {[
                  ["Name",     viewMember.name],
                  ["Email",    viewMember.email],
                  ["Phone",    viewMember.phone],
                  ["Plan",     viewMember.plan],
                  ["Status",   viewMember.status],
                  ["Expiry",   viewMember.expiry],
                  ["Joined",   viewMember.joined],
                  ["Check-ins",viewMember.checkins],
                  ["Trainer",  viewMember.trainer],
                ].map(([l, v]) => (
                  <div key={l} className="ad-detail-row">
                    <span className="ad-detail-label">{l}</span>
                    <span className="ad-detail-val">{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, marginTop:12 }}>
                <button className="btn btn-primary ad-btn-sm">Edit Member</button>
                <button className="btn btn-outline ad-btn-sm" onClick={() => setViewMember(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// C. TRAINER & STAFF MANAGEMENT
// ════════════════════════════════════════════════════════════
function AdminTrainers() {
  const [assignModal, setAssignModal] = useState(null); // member to assign

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>🏋️ Trainer & Staff Management</h2>
        <button className="btn btn-primary ad-btn-sm">+ Add Staff</button>
      </div>

      {/* Staff cards */}
      <div className="ad-staff-grid">
        {trainers.map(t => (
          <div className="ad-card ad-staff-card" key={t.id}>
            <div className="ad-staff-header">
              <div className="ad-avatar" style={{ width:46, height:46, fontSize:".85rem" }}>{t.avatar}</div>
              <div>
                <strong>{t.name}</strong>
                <span style={{ fontSize:".75rem", color:"var(--text-secondary)", display:"block" }}>{t.role}</span>
                <ABadge s={t.status} />
              </div>
            </div>
            <p style={{ fontSize:".8rem", color:"var(--text-secondary)", margin:"10px 0 12px" }}>{t.specialization}</p>
            <div className="ad-staff-stats">
              <div><strong>{t.clients}</strong><span>Clients</span></div>
              <div><strong>{t.sessions}</strong><span>Sessions</span></div>
              <div><strong>{t.rating}⭐</strong><span>Rating</span></div>
            </div>
            <div style={{ marginTop:12, display:"flex", gap:8 }}>
              <button className="btn btn-outline ad-btn-sm">View Profile</button>
              {t.role !== "Reception" && (
                <button className="btn btn-primary ad-btn-sm" onClick={() => setAssignModal(t)}>Assign Client</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Performance summary table */}
      <div className="ad-card">
        <div className="ad-card-head"><h3>📊 Performance Summary</h3></div>
        <table className="ad-table">
          <thead><tr><th>Trainer</th><th>Clients</th><th>Sessions/Month</th><th>Rating</th><th>Revenue Generated</th><th>Status</th></tr></thead>
          <tbody>
            {trainers.map(t => (
              <tr key={t.id}>
                <td><strong>{t.name}</strong><div style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>{t.specialization}</div></td>
                <td>{t.clients}</td>
                <td>{t.sessions}</td>
                <td>{"⭐".repeat(Math.round(t.rating))} {t.rating}</td>
                <td>${(t.sessions * 590 / 62).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,",")}</td>
                <td><ABadge s={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign modal */}
      {assignModal && (
        <div className="ad-modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-head">
              <h3>Assign Client to {assignModal.name}</h3>
              <button onClick={() => setAssignModal(null)}>✕</button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-form-group">
                <label>Select Member</label>
                <select className="ad-input">
                  <option value="">— Choose member —</option>
                  {members.filter(m => m.status === "active").map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.plan})</option>
                  ))}
                </select>
              </div>
              <div className="ad-form-group">
                <label>Session Type</label>
                <select className="ad-input">
                  <option>Personal Training</option>
                  <option>Group Class</option>
                  <option>Nutrition Coaching</option>
                </select>
              </div>
              <div className="ad-form-group">
                <label>Start Date</label>
                <input className="ad-input" type="date" />
              </div>
              <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={() => setAssignModal(null)}>
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// D. CLASS & SCHEDULE MANAGEMENT
// ════════════════════════════════════════════════════════════
function AdminClasses() {
  const [classList, setClassList] = useState(classes);
  const [showAdd, setShowAdd]     = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [newClass, setNewClass]   = useState({ name:"", category:"Cardio", trainer:"", time:"", days:"", capacity:15 });

  const categories = ["all", ...new Set(classes.map(c => c.category))];

  const filtered = classList.filter(c => catFilter === "all" || c.category === catFilter);

  const toggleClass = (id) => {
    setClassList(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c));
  };

  const addClass = () => {
    if (!newClass.name) return;
    setClassList(prev => [...prev, { ...newClass, id: Date.now(), enrolled: 0, status:"active" }]);
    setNewClass({ name:"", category:"Cardio", trainer:"", time:"", days:"", capacity:15 });
    setShowAdd(false);
  };

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>📅 Class & Schedule Management</h2>
        <div className="ad-head-actions">
          <button className="btn btn-primary ad-btn-sm" onClick={() => setShowAdd(true)}>+ Add Class</button>
          <button className="btn btn-outline ad-btn-sm">📋 Bulk Schedule</button>
        </div>
      </div>

      {/* Category filter */}
      <div className="ad-filters">
        {categories.map(c => (
          <button key={c} className={`ad-filter-btn ${catFilter === c ? "ad-filter-active" : ""}`} onClick={() => setCatFilter(c)}>{c}</button>
        ))}
      </div>

      {/* Class cards */}
      <div className="ad-class-grid">
        {filtered.map(c => (
          <div className="ad-card ad-class-card" key={c.id} style={{ opacity: c.status === "inactive" ? 0.6 : 1 }}>
            <div className="ad-class-header">
              <div>
                <strong>{c.name}</strong>
                <span className="ad-class-cat">{c.category}</span>
              </div>
              <ABadge s={c.status} />
            </div>
            <div className="ad-class-meta">
              <span>🏋️ {c.trainer}</span>
              <span>🕐 {c.time}</span>
              <span>📆 {c.days}</span>
            </div>
            <div className="ad-class-fill">
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".75rem", marginBottom:4 }}>
                <span>Enrollment</span>
                <span>{c.enrolled}/{c.capacity}</span>
              </div>
              <ProgressBar value={c.enrolled} max={c.capacity} color={c.enrolled/c.capacity > 0.8 ? "#ef4444" : "var(--accent)"} />
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <button className="ad-link-btn">Edit</button>
              <button className="ad-link-btn" style={{ color: c.status === "active" ? "#ef4444" : "#22c55e" }} onClick={() => toggleClass(c.id)}>
                {c.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAdd && (
        <div className="ad-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-head"><h3>Add New Class</h3><button onClick={() => setShowAdd(false)}>✕</button></div>
            <div className="ad-modal-body">
              {[["Class Name","name","text"],["Time","time","text"],["Days","days","text"]].map(([l,k,t]) => (
                <div className="ad-form-group" key={k}>
                  <label>{l}</label>
                  <input className="ad-input" type={t} placeholder={l} value={newClass[k]} onChange={e => setNewClass(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
              <div className="ad-form-group">
                <label>Category</label>
                <select className="ad-input" value={newClass.category} onChange={e => setNewClass(p => ({ ...p, category: e.target.value }))}>
                  {["Cardio","Strength","Yoga","Dance","CrossFit","Flexibility"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="ad-form-group">
                <label>Trainer</label>
                <select className="ad-input" value={newClass.trainer} onChange={e => setNewClass(p => ({ ...p, trainer: e.target.value }))}>
                  <option value="">— Select trainer —</option>
                  {trainers.filter(t => t.role !== "Reception").map(t => <option key={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="ad-form-group">
                <label>Capacity</label>
                <input className="ad-input" type="number" value={newClass.capacity} onChange={e => setNewClass(p => ({ ...p, capacity: +e.target.value }))} />
              </div>
              <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={addClass}>Add Class</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// E. ENQUIRIES & LEADS
// ════════════════════════════════════════════════════════════
function AdminEnquiries() {
  const [enqs, setEnqs]       = useState(enquiries);
  const [statusF, setStatusF] = useState("all");
  const [search, setSearch]   = useState("");

  const convert  = id => setEnqs(p => p.map(e => e.id === id ? { ...e, status:"converted" } : e));
  const followUp = id => setEnqs(p => p.map(e => e.id === id ? { ...e, status:"contacted" } : e));

  const filtered = enqs.filter(e =>
    (statusF === "all" || e.status === statusF) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const counts = { new: enqs.filter(e => e.status === "new").length, contacted: enqs.filter(e => e.status === "contacted").length, converted: enqs.filter(e => e.status === "converted").length };

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>📋 Enquiries & Leads</h2>
        <div className="ad-head-actions">
          <span className="ad-badge ad-blue">{counts.new} new</span>
          <span className="ad-badge ad-yellow">{counts.contacted} follow-up</span>
          <span className="ad-badge ad-green">{counts.converted} converted</span>
        </div>
      </div>

      <div className="ad-filters">
        <input className="ad-input" placeholder="🔍 Search…" value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth:200 }} />
        {["all","new","contacted","converted","not_interested"].map(f => (
          <button key={f} className={`ad-filter-btn ${statusF === f ? "ad-filter-active" : ""}`} onClick={() => setStatusF(f)}>{f.replace("_"," ")}</button>
        ))}
      </div>

      <div className="ad-card">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Name</th><th>Contact</th><th>Interest</th><th>Date</th><th>Status</th><th>Follow-up Note</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td>
                    <div style={{ fontSize:".8rem" }}>{e.email}</div>
                    <div style={{ fontSize:".75rem", color:"var(--text-secondary)" }}>{e.phone}</div>
                  </td>
                  <td>{e.interest}</td>
                  <td style={{ fontSize:".8rem" }}>{e.date}</td>
                  <td><ABadge s={e.status} /></td>
                  <td style={{ fontSize:".78rem", color:"var(--text-secondary)" }}>{e.followUp || "—"}</td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      {e.status === "new" && <button className="ad-link-btn" onClick={() => followUp(e.id)}>Follow Up</button>}
                      {e.status !== "converted" && e.status !== "not_interested" && (
                        <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => convert(e.id)}>Convert →</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// F. REPORTS & ANALYTICS
// ════════════════════════════════════════════════════════════
function AdminReports() {
  const [period, setPeriod] = useState("monthly");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const dailyRev  = [1200,1450,1100,1600,1380,1720,1550,1800,1650,1900,1750,1600,1850,2000,1700,1950,1800,2100,1900,2200,2050,2300,2100,2400,2200,2500,2300,2600,2400,2700];
  const dailyLabels = Array.from({length:30},(_,i)=>`${i+1}`);

  const retentionData  = [92,89,91,88,90,87,89,91,88,90,89,91];

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>📈 Reports & Analytics</h2>
        <div className="ad-head-actions">
          <button className="btn btn-outline ad-btn-sm">⬇ Export PDF</button>
          <button className="btn btn-outline ad-btn-sm">⬇ Export CSV</button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        {[
          { icon:"🏃", label:"Avg Daily Check-ins", value:"138",      color:"#3b82f6" },
          { icon:"🔄", label:"Member Retention",    value:"89%",      color:"#22c55e" },
          { icon:"🏆", label:"Top Class",           value:"HIIT Blast",color:"var(--accent)" },
        ].map((k,i) => (
          <div className="ad-kpi-card" key={i}>
            <div className="ad-kpi-icon" style={{ background: k.color+"22" }}>{k.icon}</div>
            <div><strong>{k.value}</strong><span>{k.label}</span></div>
          </div>
        ))}
      </div>

      {/* Period toggle + Revenue chart */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>💰 Revenue Report</h3>
          <div style={{ display:"flex", gap:6 }}>
            {["daily","monthly","yearly"].map(p => (
              <button key={p} className={`ad-filter-btn ${period === p ? "ad-filter-active" : ""}`} onClick={() => setPeriod(p)} style={{ padding:"4px 10px", fontSize:".75rem" }}>{p}</button>
            ))}
          </div>
        </div>
        {period === "daily"   && <BarChart data={dailyRev}   labels={dailyLabels} color="var(--accent)" height={120} />}
        {period === "monthly" && <BarChart data={revenueData} labels={months}      color="var(--accent)" height={120} />}
        {period === "yearly"  && <BarChart data={[320000,385000,428000,481000,520000]} labels={["2021","2022","2023","2024","2025"]} color="var(--accent)" height={120} />}
      </div>

      <div className="ad-two-col">
        {/* Member growth */}
        <div className="ad-card">
          <div className="ad-card-head"><h3>📊 New Member Growth</h3></div>
          <BarChart data={memberGrowthData} labels={months.map(m=>m[0])} color="#22c55e" height={110} />
        </div>

        {/* Retention */}
        <div className="ad-card">
          <div className="ad-card-head"><h3>🔄 Retention Rate (%)</h3></div>
          <BarChart data={retentionData} labels={months.map(m=>m[0])} color="#3b82f6" height={110} />
        </div>
      </div>

      {/* Popular classes */}
      <div className="ad-card">
        <div className="ad-card-head"><h3>🏆 Popular Classes</h3></div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {popularClasses.map((c, i) => (
            <div key={i}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:5 }}>
                <span><strong>{i+1}. {c.name}</strong></span>
                <span style={{ color:"var(--text-secondary)" }}>{c.bookings} bookings · {c.fill}% fill</span>
              </div>
              <ProgressBar value={c.fill} color={i === 0 ? "var(--accent)" : "#3b82f6"} />
            </div>
          ))}
        </div>
      </div>

      {/* Attendance report */}
      <div className="ad-card">
        <div className="ad-card-head"><h3>🏃 Weekly Attendance Report</h3></div>
        <BarChart data={attendanceData.map(d=>d.checkins)} labels={attendanceData.map(d=>d.day)} color="#8b5cf6" height={110} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// G. OPERATIONS
// ════════════════════════════════════════════════════════════
function AdminOperations() {
  const [equip, setEquip]   = useState(equipmentLog);
  const [showLog, setShowLog] = useState(false);
  const [logItem, setLogItem] = useState(null);

  const updateStatus = (id, status) => {
    setEquip(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    setShowLog(false);
  };

  const statusCounts = {
    operational: equip.filter(e => e.status === "operational").length,
    maintenance:  equip.filter(e => e.status === "maintenance").length,
    out_of_order: equip.filter(e => e.status === "out_of_order").length,
  };

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>🔧 Operations</h2>
        <button className="btn btn-primary ad-btn-sm" onClick={() => { setLogItem(null); setShowLog(true); }}>+ Log Issue</button>
      </div>

      {/* Equipment status summary */}
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        {[
          { label:"Operational", value: statusCounts.operational, color:"#22c55e", icon:"✅" },
          { label:"Maintenance",  value: statusCounts.maintenance,  color:"#f59e0b", icon:"🔧" },
          { label:"Out of Order", value: statusCounts.out_of_order, color:"#ef4444", icon:"❌" },
        ].map((k,i) => (
          <div className="ad-kpi-card" key={i}>
            <div className="ad-kpi-icon" style={{ background: k.color+"22" }}>{k.icon}</div>
            <div><strong>{k.value}</strong><span>{k.label}</span></div>
          </div>
        ))}
      </div>

      {/* Equipment table */}
      <div className="ad-card">
        <div className="ad-card-head"><h3>Equipment Status</h3></div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Equipment</th><th>Category</th><th>Status</th><th>Last Service</th><th>Next Service</th><th>Issue</th><th>Action</th></tr></thead>
            <tbody>
              {equip.map(e => (
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.category}</td>
                  <td><ABadge s={e.status} /></td>
                  <td style={{ fontSize:".8rem" }}>{e.lastService}</td>
                  <td style={{ fontSize:".8rem", color: e.nextService === "ASAP" ? "#ef4444" : "inherit" }}>{e.nextService}</td>
                  <td style={{ fontSize:".78rem", color:"#ef4444" }}>{e.issue || "—"}</td>
                  <td>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="ad-link-btn" onClick={() => { setLogItem(e); setShowLog(true); }}>Update</button>
                      {e.status !== "operational" && (
                        <button className="ad-link-btn" style={{ color:"#22c55e" }} onClick={() => updateStatus(e.id, "operational")}>Mark Fixed</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facility usage */}
      <div className="ad-card">
        <div className="ad-card-head"><h3>🏢 Facility Usage Overview</h3></div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { area:"Main Gym Floor",    usage:78, peak:"6–8 PM" },
            { area:"Cardio Zone",       usage:65, peak:"7–9 AM" },
            { area:"Yoga Studio",       usage:55, peak:"7–9 AM" },
            { area:"CrossFit Area",     usage:82, peak:"6–8 PM" },
            { area:"Swimming Pool",     usage:40, peak:"8–10 AM" },
            { area:"Locker Rooms",      usage:60, peak:"6–8 PM" },
          ].map((f, i) => (
            <div key={i}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:4 }}>
                <span><strong>{f.area}</strong></span>
                <span style={{ color:"var(--text-secondary)" }}>{f.usage}% · Peak: {f.peak}</span>
              </div>
              <ProgressBar value={f.usage} color={f.usage > 75 ? "#ef4444" : "var(--accent)"} />
            </div>
          ))}
        </div>
      </div>

      {/* Announcement form */}
      <div className="ad-card">
        <div className="ad-card-head"><h3>📢 Send Announcement</h3></div>
        <div className="ad-form-group"><label>Title</label><input className="ad-input" placeholder="Announcement title" /></div>
        <div className="ad-form-group"><label>Message</label><textarea className="ad-textarea" rows={3} placeholder="Write your message…" /></div>
        <div className="ad-form-group">
          <label>Target Audience</label>
          <select className="ad-input">
            <option>All Members</option>
            <option>Active Members Only</option>
            <option>Trainers Only</option>
            <option>Expired Members</option>
          </select>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:10 }}>
          <button className="btn btn-primary ad-btn-sm">📲 Push Notification</button>
          <button className="btn btn-outline ad-btn-sm">📧 Email All</button>
          <button className="btn btn-outline ad-btn-sm">💬 SMS Blast</button>
        </div>
      </div>

      {/* Log Issue Modal */}
      {showLog && (
        <div className="ad-modal-overlay" onClick={() => setShowLog(false)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-head">
              <h3>{logItem ? `Update: ${logItem.name}` : "Log New Issue"}</h3>
              <button onClick={() => setShowLog(false)}>✕</button>
            </div>
            <div className="ad-modal-body">
              {!logItem && (
                <div className="ad-form-group">
                  <label>Equipment Name</label>
                  <input className="ad-input" placeholder="e.g. Treadmill #4" />
                </div>
              )}
              <div className="ad-form-group">
                <label>Status</label>
                <select className="ad-input" defaultValue={logItem?.status || "maintenance"}>
                  <option value="operational">Operational</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="out_of_order">Out of Order</option>
                </select>
              </div>
              <div className="ad-form-group">
                <label>Issue Description</label>
                <textarea className="ad-textarea" rows={3} defaultValue={logItem?.issue || ""} placeholder="Describe the issue…" />
              </div>
              <div className="ad-form-group">
                <label>Next Service Date</label>
                <input className="ad-input" type="date" />
              </div>
              <button className="btn btn-primary" style={{ width:"100%", marginTop:8 }} onClick={() => setShowLog(false)}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// H. BILLING OVERVIEW
// ════════════════════════════════════════════════════════════
function AdminBilling() {
  const totalOverdue = pendingPayments.reduce((s, p) => s + parseFloat(p.amount.replace("$","")), 0);

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>💳 Billing Overview</h2>
        <div className="ad-head-actions">
          <button className="btn btn-outline ad-btn-sm">⬇ Export</button>
        </div>
      </div>

      {/* Summary */}
      <div className="ad-kpi-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        {[
          { icon:"⚠️", label:"Overdue Payments",  value: pendingPayments.length,  color:"#ef4444" },
          { icon:"💰", label:"Total Overdue Amt",  value:`$${totalOverdue}`,       color:"#f59e0b" },
          { icon:"🔄", label:"Due for Renewal",    value: dueRenewals.length,      color:"#3b82f6" },
        ].map((k,i) => (
          <div className="ad-kpi-card" key={i}>
            <div className="ad-kpi-icon" style={{ background: k.color+"22" }}>{k.icon}</div>
            <div><strong>{k.value}</strong><span>{k.label}</span></div>
          </div>
        ))}
      </div>

      {/* Overdue payments */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>🚨 Overdue Payments</h3>
          <span className="ad-badge ad-red">{pendingPayments.length} urgent</span>
        </div>
        <table className="ad-table">
          <thead><tr><th>Member</th><th>Email</th><th>Plan</th><th>Amount</th><th>Due Date</th><th>Days Overdue</th><th>Actions</th></tr></thead>
          <tbody>
            {pendingPayments.map((p, i) => (
              <tr key={i} style={{ background: p.days >= 3 ? "rgba(239,68,68,0.04)" : "inherit" }}>
                <td><strong>{p.member}</strong></td>
                <td style={{ fontSize:".78rem" }}>{p.email}</td>
                <td>{p.plan}</td>
                <td><strong style={{ color:"var(--accent)" }}>{p.amount}</strong></td>
                <td>{p.due}</td>
                <td>
                  <span className={`ad-badge ${p.days >= 3 ? "ad-red" : "ad-yellow"}`}>{p.days} days</span>
                </td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="ad-link-btn">📧 Remind</button>
                    <button className="ad-link-btn" style={{ color:"#22c55e" }}>✅ Mark Paid</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Due renewals */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>🔄 Upcoming Renewals</h3>
          <span className="ad-badge ad-blue">{dueRenewals.length} members</span>
        </div>
        <table className="ad-table">
          <thead><tr><th>Member</th><th>Plan</th><th>Expiry</th><th>Days Left</th><th>Action</th></tr></thead>
          <tbody>
            {dueRenewals.map((r, i) => (
              <tr key={i}>
                <td><strong>{r.member}</strong></td>
                <td>{r.plan}</td>
                <td>{r.expiry}</td>
                <td>
                  <span className={`ad-badge ${r.daysLeft === 0 ? "ad-red" : r.daysLeft <= 10 ? "ad-yellow" : "ad-blue"}`}>
                    {r.daysLeft === 0 ? "Expired" : `${r.daysLeft} days`}
                  </span>
                </td>
                <td>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="ad-link-btn">📧 Remind</button>
                    <button className="ad-link-btn" style={{ color:"#22c55e" }}>Renew</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revenue summary */}
      <div className="ad-card">
        <div className="ad-card-head"><h3>💰 Monthly Revenue Breakdown</h3></div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { label:"Monthly Plans",     amount:3900,  count:10 },
            { label:"Quarterly Plans",   amount:8910,  count:9  },
            { label:"Half-Yearly Plans", amount:14320, count:8  },
            { label:"Annual Plans",      amount:21070, count:7  },
          ].map((r, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:4 }}>
                  <span>{r.label} <span style={{ color:"var(--text-secondary)", fontSize:".75rem" }}>({r.count} members)</span></span>
                  <strong>${r.amount.toLocaleString()}</strong>
                </div>
                <ProgressBar value={r.amount} max={21070} color="var(--accent)" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN DASHBOARD PAGE
// ════════════════════════════════════════════════════════════
export default function AdminDashboardPage() {
  const [active, setActive] = useState("overview");
  const [open,   setOpen]   = useState(false);
  const go = useCallback(id => { setActive(id); setOpen(false); }, []);

  const sections = {
    overview:  <AdminOverview />,
    members:   <AdminMembers />,
    trainers:  <AdminTrainers />,
    classes:   <AdminClasses />,
    enquiries: <AdminEnquiries />,
    reports:   <AdminReports />,
    equipment: <AdminOperations />,
    billing:   <AdminBilling />,
  };

  return (
    <div className="ad-layout">
      {/* ── Sidebar ── */}
      <aside className={`ad-sidebar ${open ? "ad-sidebar-open" : ""}`}>
        <div className="ad-sidebar-brand">⚡ FitZone <span>Admin</span></div>
        <div className="ad-sidebar-user">
          <div className="ad-avatar">{adminInfo.avatar}</div>
          <div>
            <strong>{adminInfo.name}</strong>
            <span>{adminInfo.role}</span>
          </div>
        </div>
        <nav className="ad-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`ad-nav-item ${active === n.id ? "ad-nav-active" : ""}`}
              onClick={() => go(n.id)}
            >
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="ad-sidebar-foot">
          <Link to="/" className="ad-nav-item">🏠 Back to Site</Link>
          <Link to="/dashboard/superadmin" className="ad-nav-item">🔑 Super Admin</Link>
        </div>
      </aside>

      {open && <div className="ad-overlay" onClick={() => setOpen(false)} />}

      {/* ── Main content ── */}
      <div className="ad-main">
        <header className="ad-topbar">
          <button className="ad-menu-btn" onClick={() => setOpen(true)}>☰</button>
          <span className="ad-topbar-title">Admin Dashboard · {adminInfo.branch}</span>
          <div className="ad-topbar-right">
            <span>🔔</span>
            <div className="ad-avatar ad-avatar-sm">{adminInfo.avatar}</div>
          </div>
        </header>
        <main className="ad-content">
          {sections[active]}
        </main>
      </div>
    </div>
  );
}
