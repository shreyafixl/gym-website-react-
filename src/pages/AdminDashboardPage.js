import { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { adminInfo, kpiData, revenueData, members, enquiries, equipmentLog, pendingPayments } from "../data/adminDashboardData";
import "../admin-dashboard.css";

const NAV = [
  { id:"overview",  icon:"??", label:"Overview"       },
  { id:"members",   icon:"??", label:"Members"        },
  { id:"trainers",  icon:"???", label:"Staff"          },
  { id:"classes",   icon:"??", label:"Classes"        },
  { id:"enquiries", icon:"??", label:"Enquiries"      },
  { id:"reports",   icon:"??", label:"Reports"        },
  { id:"equipment", icon:"??", label:"Operations"     },
  { id:"billing",   icon:"??", label:"Billing"        },
];

const ABadge = memo(({ s }) => {
  const m = { active:"ad-green", expired:"ad-red", suspended:"ad-yellow", new:"ad-blue", contacted:"ad-yellow", converted:"ad-green", not_interested:"ad-gray", operational:"ad-green", maintenance:"ad-yellow", out_of_order:"ad-red", paid:"ad-green" };
  return <span className={`ad-badge ${m[s]||"ad-gray"}`}>{s?.replace("_"," ")}</span>;
});

/* Overview */
function AdminOverview() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const maxRev = Math.max(...revenueData);
  return (
    <div className="ad-section">
      <div className="ad-kpi-grid">
        {kpiData.map((k,i) => (
          <div className="ad-kpi-card" key={i}>
            <div className="ad-kpi-icon" style={{background:k.color+"22"}}>{k.icon}</div>
            <div><strong>{k.value}</strong><span>{k.label}</span><small>{k.change}</small></div>
          </div>
        ))}
      </div>
      <div className="ad-two-col">
        <div className="ad-card">
          <div className="ad-card-head"><h3>?? Revenue Trend (12 months)</h3></div>
          <div className="ad-bar-chart">
            {revenueData.map((v,i) => (
              <div className="ad-bar-col" key={i}>
                <span className="ad-bar-val">${(v/1000).toFixed(0)}k</span>
                <div className="ad-bar" style={{height:`${(v/maxRev)*100}%`}} />
                <span className="ad-bar-label">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ad-card">
          <div className="ad-card-head"><h3>?? Class Occupancy Heatmap</h3></div>
          <div className="ad-heatmap">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
              <div className="ad-heatmap-row" key={d}>
                <span>{d}</span>
                {["6AM","8AM","10AM","12PM","3PM","5PM","7PM","9PM"].map(t => {
                  const v = Math.floor(Math.random()*100);
                  return <div key={t} className="ad-heat-cell" style={{background:`rgba(249,115,22,${v/100})`}} title={`${d} ${t}: ${v}%`} />;
                })}
              </div>
            ))}
            <div className="ad-heatmap-times">
              {["6AM","8AM","10AM","12PM","3PM","5PM","7PM","9PM"].map(t=><span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
      {/* Pending Payments */}
      <div className="ad-card">
        <div className="ad-card-head"><h3>?? Due Renewals</h3><span className="ad-badge ad-red">{pendingPayments.length} due</span></div>
        <table className="ad-table">
          <thead><tr><th>Member</th><th>Plan</th><th>Amount</th><th>Due Date</th><th>Days Overdue</th><th>Action</th></tr></thead>
          <tbody>
            {pendingPayments.map((p,i) => (
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

/* Members */
function AdminMembers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const filtered = members.filter(m =>
    (filter==="all" || m.status===filter) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>?? Member Management</h2>
        <div className="ad-head-actions">
          <button className="btn btn-primary ad-btn-sm" onClick={()=>setShowAdd(true)}>+ Add Member</button>
          <button className="btn btn-outline ad-btn-sm">? Export CSV</button>
        </div>
      </div>
      <div className="ad-filters">
        <input className="ad-input" placeholder="?? Search members..." value={search} onChange={e=>setSearch(e.target.value)} />
        {["all","active","expired","suspended"].map(f=>(
          <button key={f} className={`ad-filter-btn ${filter===f?"ad-filter-active":""}`} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="ad-card">
        <table className="ad-table">
          <thead><tr><th>Name</th><th>Email</th><th>Plan</th><th>Status</th><th>Expiry</th><th>Check-ins</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                <td><strong>{m.name}</strong></td>
                <td>{m.email}</td>
                <td>{m.plan}</td>
                <td><ABadge s={m.status} /></td>
                <td>{m.expiry}</td>
                <td>{m.checkins}</td>
                <td>
                  <div style={{display:"flex",gap:"6px"}}>
                    <button className="ad-link-btn">Edit</button>
                    <button className="ad-link-btn" style={{color:"#ef4444"}}>Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAdd && (
        <div className="ad-modal-overlay" onClick={()=>setShowAdd(false)}>
          <div className="ad-modal" onClick={e=>e.stopPropagation()}>
            <div className="ad-modal-head"><h3>Add New Member</h3><button onClick={()=>setShowAdd(false)}>?</button></div>
            <div className="ad-modal-body">
              {["Full Name","Email","Phone","Plan"].map(f=>(
                <div className="ad-form-group" key={f}><label>{f}</label><input className="ad-input" placeholder={f} /></div>
              ))}
              <button className="btn btn-primary" style={{width:"100%"}} onClick={()=>setShowAdd(false)}>Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Enquiries */
function AdminEnquiries() {
  const [enqs, setEnqs] = useState(enquiries);
  const convert = id => setEnqs(p=>p.map(e=>e.id===id?{...e,status:"converted"}:e));
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>?? Enquiries & Leads</h2><span className="ad-badge ad-blue">{enqs.filter(e=>e.status==="new").length} new</span></div>
      <div className="ad-card">
        <table className="ad-table">
          <thead><tr><th>Name</th><th>Contact</th><th>Interest</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {enqs.map(e=>(
              <tr key={e.id}>
                <td><strong>{e.name}</strong></td>
                <td><div>{e.email}</div><div style={{fontSize:".75rem",color:"var(--text-secondary)"}}>{e.phone}</div></td>
                <td>{e.interest}</td>
                <td>{e.date}</td>
                <td><ABadge s={e.status} /></td>
                <td>
                  <div style={{display:"flex",gap:"6px"}}>
                    <button className="ad-link-btn">Follow Up</button>
                    {e.status!=="converted" && <button className="ad-link-btn" style={{color:"#22c55e"}} onClick={()=>convert(e.id)}>Convert</button>}
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

/* Operations */
function AdminOperations() {
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>?? Operations</h2></div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Equipment Status</h3><button className="btn btn-primary ad-btn-sm">+ Log Issue</button></div>
        <table className="ad-table">
          <thead><tr><th>Equipment</th><th>Status</th><th>Last Service</th><th>Next Service</th><th>Issue</th><th>Action</th></tr></thead>
          <tbody>
            {equipmentLog.map(e=>(
              <tr key={e.id}>
                <td><strong>{e.name}</strong></td>
                <td><ABadge s={e.status} /></td>
                <td>{e.lastService}</td>
                <td>{e.nextService}</td>
                <td style={{color:"#ef4444",fontSize:".8rem"}}>{e.issue||"—"}</td>
                <td><button className="ad-link-btn">Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>?? Send Announcement</h3></div>
        <div className="ad-form-group"><label>Title</label><input className="ad-input" placeholder="Announcement title" /></div>
        <div className="ad-form-group"><label>Message</label><textarea className="ad-textarea" rows={3} placeholder="Write your message..." /></div>
        <div style={{display:"flex",gap:"10px",marginTop:"10px"}}>
          <button className="btn btn-primary ad-btn-sm">?? Push Notification</button>
          <button className="btn btn-outline ad-btn-sm">?? Email All Members</button>
        </div>
      </div>
    </div>
  );
}

/* Reports */
function AdminReports() {
  return (
    <div className="ad-section">
      <div className="ad-section-head"><h2>?? Reports & Analytics</h2>
        <div className="ad-head-actions">
          <button className="btn btn-outline ad-btn-sm">? Export PDF</button>
          <button className="btn btn-outline ad-btn-sm">? Export CSV</button>
        </div>
      </div>
      <div className="ad-kpi-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[
          {icon:"??",label:"Avg Daily Check-ins",value:"138",color:"#3b82f6"},
          {icon:"??",label:"Member Retention",value:"89%",color:"#22c55e"},
          {icon:"??",label:"Popular Class",value:"HIIT Blast",color:"#f97316"},
        ].map((k,i)=>(
          <div className="ad-kpi-card" key={i}>
            <div className="ad-kpi-icon" style={{background:k.color+"22"}}>{k.icon}</div>
            <div><strong>{k.value}</strong><span>{k.label}</span></div>
          </div>
        ))}
      </div>
      <div className="ad-card">
        <div className="ad-card-head"><h3>Member Growth (New Members per Month)</h3></div>
        <div className="ad-bar-chart">
          {[8,12,15,10,18,22,19,25,21,28,23,23].map((v,i)=>{
            const months=["J","F","M","A","M","J","J","A","S","O","N","D"];
            return (
              <div className="ad-bar-col" key={i}>
                <span className="ad-bar-val">{v}</span>
                <div className="ad-bar" style={{height:`${(v/28)*100}%`,background:"#22c55e"}} />
                <span className="ad-bar-label">{months[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Placeholder sections */
const PlaceholderSection = ({title}) => (
  <div className="ad-section">
    <div className="ad-section-head"><h2>{title}</h2></div>
    <div className="ad-card" style={{textAlign:"center",padding:"60px",color:"var(--text-secondary)"}}>
      <div style={{fontSize:"3rem",marginBottom:"12px"}}>??</div>
      <p>This section is under development.</p>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [active, setActive] = useState("overview");
  const [open, setOpen] = useState(false);
  const go = useCallback(id => { setActive(id); setOpen(false); }, []);

  const sections = { overview:<AdminOverview/>, members:<AdminMembers/>, trainers:<PlaceholderSection title="??? Staff Management"/>, classes:<PlaceholderSection title="?? Class Management"/>, enquiries:<AdminEnquiries/>, reports:<AdminReports/>, equipment:<AdminOperations/>, billing:<PlaceholderSection title="?? Billing Overview"/> };

  return (
    <div className="ad-layout">
      <aside className={`ad-sidebar ${open?"ad-sidebar-open":""}`}>
        <div className="ad-sidebar-brand">? FitZone <span>Admin</span></div>
        <div className="ad-sidebar-user">
          <div className="ad-avatar">{adminInfo.avatar}</div>
          <div><strong>{adminInfo.name}</strong><span>{adminInfo.role}</span></div>
        </div>
        <nav className="ad-nav">
          {NAV.map(n=>(
            <button key={n.id} className={`ad-nav-item ${active===n.id?"ad-nav-active":""}`} onClick={()=>go(n.id)}>
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="ad-sidebar-foot">
          <Link to="/" className="ad-nav-item">? Back to Site</Link>
          <Link to="/dashboard/superadmin" className="ad-nav-item">?? Super Admin</Link>
        </div>
      </aside>
      {open && <div className="ad-overlay" onClick={()=>setOpen(false)} />}
      <div className="ad-main">
        <header className="ad-topbar">
          <button className="ad-menu-btn" onClick={()=>setOpen(true)}>?</button>
          <span className="ad-topbar-title">Admin Dashboard — {adminInfo.branch}</span>
          <div className="ad-topbar-right"><span>??</span><div className="ad-avatar ad-avatar-sm">{adminInfo.avatar}</div></div>
        </header>
        <main className="ad-content">{sections[active]}</main>
      </div>
    </div>
  );
}
