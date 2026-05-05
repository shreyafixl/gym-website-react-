import { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import "../superadmin-dashboard.css";

const NAV = [
  { id:"overview",  icon:"??", label:"System Overview"   },
  { id:"users",     icon:"??", label:"User Management"   },
  { id:"branches",  icon:"??", label:"Branches"          },
  { id:"content",   icon:"??", label:"Content"           },
  { id:"plans",     icon:"??", label:"Plans & Pricing"   },
  { id:"analytics", icon:"??", label:"Analytics"         },
  { id:"settings",  icon:"??", label:"Settings"          },
  { id:"audit",     icon:"??", label:"Audit & Security"  },
];

const globalStats = [
  { icon:"??", label:"Total Branches",  value:3,       color:"#f97316" },
  { icon:"??", label:"Total Members",   value:"3,842", color:"#22c55e" },
  { icon:"??", label:"Total Revenue",   value:"$142k", color:"#8b5cf6" },
  { icon:"??", label:"Growth Rate",     value:"+18%",  color:"#3b82f6" },
  { icon:"???", label:"Total Trainers",  value:24,      color:"#f59e0b" },
  { icon:"?", label:"Platform Health", value:"99.8%", color:"#22c55e" },
];

const branches = [
  { id:1, name:"FitZone Main",    city:"Mumbai",    members:1247, revenue:"$48.2k", trainers:9,  status:"active"   },
  { id:2, name:"FitZone North",   city:"Delhi",     members:1089, revenue:"$41.5k", trainers:8,  status:"active"   },
  { id:3, name:"FitZone South",   city:"Bangalore", members:506,  revenue:"$19.8k", trainers:5,  status:"active"   },
  { id:4, name:"FitZone West",    city:"Pune",      members:0,    revenue:"$0",     trainers:0,  status:"planned"  },
];

const users = [
  { id:1, name:"Aryan Mehta",   email:"aryan@email.com",  role:"member",     branch:"Main",  lastLogin:"Today",    status:"active"   },
  { id:2, name:"Vikram Singh",  email:"vikram@email.com", role:"trainer",    branch:"Main",  lastLogin:"Today",    status:"active"   },
  { id:3, name:"Rajesh Kumar",  email:"rajesh@email.com", role:"admin",      branch:"Main",  lastLogin:"Yesterday",status:"active"   },
  { id:4, name:"Priya Sharma",  email:"priya@email.com",  role:"member",     branch:"North", lastLogin:"2 days ago",status:"active"  },
  { id:5, name:"Amit Patel",    email:"amit@email.com",   role:"member",     branch:"Main",  lastLogin:"1 week ago",status:"inactive"},
];

const auditLog = [
  { time:"10:32 AM", user:"Rajesh Kumar", action:"Updated pricing plan - Half-Yearly",  ip:"192.168.1.10" },
  { time:"9:15 AM",  user:"Vikram Singh", action:"Added new client - Deepak Singh",     ip:"192.168.1.22" },
  { time:"8:50 AM",  user:"System",       action:"Automated backup completed",           ip:"localhost"    },
  { time:"Yesterday",user:"Super Admin",  action:"Created new branch - FitZone West",   ip:"192.168.1.1"  },
  { time:"Yesterday",user:"Rajesh Kumar", action:"Suspended member - Karan Mehta",      ip:"192.168.1.10" },
];

const SABadge = memo(({ s }) => {
  const m = { active:"sa-green", inactive:"sa-gray", planned:"sa-yellow", member:"sa-blue", trainer:"sa-orange", admin:"sa-purple", superadmin:"sa-red" };
  return <span className={`sa-badge ${m[s]||"sa-gray"}`}>{s}</span>;
});

function SAOverview() {
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const rev = [38,45,42,51,48,58,55,63,60,68,65,71];
  return (
    <div className="sa-section">
      <div className="sa-kpi-grid">
        {globalStats.map((k,i)=>(
          <div className="sa-kpi-card" key={i}>
            <div className="sa-kpi-icon" style={{background:k.color+"22"}}>{k.icon}</div>
            <div><strong>{k.value}</strong><span>{k.label}</span></div>
          </div>
        ))}
      </div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3>?? Global Revenue Trend</h3></div>
          <div className="sa-bar-chart">
            {rev.map((v,i)=>(
              <div className="sa-bar-col" key={i}>
                <span className="sa-bar-val">${v}k</span>
                <div className="sa-bar" style={{height:`${(v/71)*100}%`}} />
                <span className="sa-bar-label">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3>?? Branch Performance</h3></div>
          {branches.filter(b=>b.status==="active").map(b=>(
            <div className="sa-branch-row" key={b.id}>
              <div><strong>{b.name}</strong><span>{b.city}</span></div>
              <div className="sa-branch-stats">
                <span>?? {b.members}</span>
                <span>?? {b.revenue}</span>
                <SABadge s={b.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Platform Health */}
      <div className="sa-card">
        <div className="sa-card-head"><h3>??? Platform Health</h3></div>
        <div className="sa-health-grid">
          {[["API Server","99.9%","#22c55e"],["Database","99.8%","#22c55e"],["CDN","100%","#22c55e"],["Email Service","98.2%","#f97316"],["SMS Gateway","97.5%","#f97316"],["Backup System","100%","#22c55e"]].map(([s,v,c])=>(
            <div className="sa-health-item" key={s}>
              <div className="sa-health-dot" style={{background:c}} />
              <span>{s}</span>
              <strong style={{color:c}}>{v}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SAUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const filtered = users.filter(u =>
    (roleFilter==="all" || u.role===roleFilter) &&
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="sa-section">
      <div className="sa-section-head"><h2>?? User Management</h2>
        <div style={{display:"flex",gap:"8px"}}>
          <button className="btn btn-primary sa-btn-sm">+ Add User</button>
          <button className="btn btn-outline sa-btn-sm">? Export</button>
        </div>
      </div>
      <div className="sa-filters">
        <input className="sa-input" placeholder="?? Search users..." value={search} onChange={e=>setSearch(e.target.value)} />
        {["all","member","trainer","admin","superadmin"].map(r=>(
          <button key={r} className={`sa-filter-btn ${roleFilter===r?"sa-filter-active":""}`} onClick={()=>setRoleFilter(r)}>{r}</button>
        ))}
      </div>
      <div className="sa-card">
        <table className="sa-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(u=>(
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td><SABadge s={u.role} /></td>
                <td>{u.branch}</td>
                <td>{u.lastLogin}</td>
                <td><SABadge s={u.status} /></td>
                <td>
                  <div style={{display:"flex",gap:"6px"}}>
                    <button className="sa-link-btn">Edit</button>
                    <button className="sa-link-btn">Role</button>
                    <button className="sa-link-btn" style={{color:"#ef4444"}}>Delete</button>
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

function SABranches() {
  return (
    <div className="sa-section">
      <div className="sa-section-head"><h2>?? Branch Management</h2><button className="btn btn-primary sa-btn-sm">+ Add Branch</button></div>
      <div className="sa-branches-grid">
        {branches.map(b=>(
          <div className="sa-branch-card sa-card" key={b.id}>
            <div className="sa-branch-card-head">
              <h4>{b.name}</h4>
              <SABadge s={b.status} />
            </div>
            <p className="sa-branch-city">?? {b.city}</p>
            <div className="sa-branch-kpis">
              <div><strong>{b.members}</strong><span>Members</span></div>
              <div><strong>{b.revenue}</strong><span>Revenue</span></div>
              <div><strong>{b.trainers}</strong><span>Trainers</span></div>
            </div>
            <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
              <button className="btn btn-outline sa-btn-sm">View</button>
              <button className="btn btn-outline sa-btn-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SASettings() {
  return (
    <div className="sa-section">
      <div className="sa-section-head"><h2>?? System Settings</h2></div>
      <div className="sa-two-col">
        <div className="sa-card">
          <div className="sa-card-head"><h3>General Settings</h3></div>
          {[["Gym Name","FitZone Fitness"],["Tagline","Transform Your Body"],["Support Email","support@fitzone.com"],["Phone","+91 98765 43210"]].map(([l,v])=>(
            <div className="sa-form-group" key={l}><label>{l}</label><input className="sa-input" defaultValue={v} /></div>
          ))}
          <button className="btn btn-primary sa-btn-sm" style={{marginTop:"8px"}}>Save Changes</button>
        </div>
        <div className="sa-card">
          <div className="sa-card-head"><h3>Notification Settings</h3></div>
          {[["Email Notifications","Enabled"],["SMS Alerts","Enabled"],["Push Notifications","Disabled"],["Weekly Reports","Enabled"]].map(([l,v])=>(
            <div className="sa-toggle-row" key={l}>
              <span>{l}</span>
              <div className={`sa-toggle ${v==="Enabled"?"sa-toggle-on":""}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Backup & Restore</h3></div>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
          <button className="btn btn-primary sa-btn-sm">?? Create Backup</button>
          <button className="btn btn-outline sa-btn-sm">?? Restore Backup</button>
          <button className="btn btn-outline sa-btn-sm">? Download Backup</button>
        </div>
        <p style={{fontSize:".8rem",color:"var(--text-secondary)",marginTop:"10px"}}>Last backup: Today at 3:00 AM · Size: 2.4 GB</p>
      </div>
    </div>
  );
}

function SAAudit() {
  return (
    <div className="sa-section">
      <div className="sa-section-head"><h2>?? Audit & Security</h2></div>
      <div className="sa-kpi-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[{icon:"??",label:"Failed Logins (24h)",value:3,color:"#ef4444"},{icon:"?",label:"Successful Logins",value:142,color:"#22c55e"},{icon:"??",label:"Audit Events Today",value:28,color:"#3b82f6"}].map((k,i)=>(
          <div className="sa-kpi-card" key={i}><div className="sa-kpi-icon" style={{background:k.color+"22"}}>{k.icon}</div><div><strong>{k.value}</strong><span>{k.label}</span></div></div>
        ))}
      </div>
      <div className="sa-card">
        <div className="sa-card-head"><h3>Audit Trail</h3><button className="btn btn-outline sa-btn-sm">? Export Log</button></div>
        <table className="sa-table">
          <thead><tr><th>Time</th><th>User</th><th>Action</th><th>IP Address</th></tr></thead>
          <tbody>
            {auditLog.map((a,i)=>(
              <tr key={i}>
                <td style={{color:"var(--text-secondary)",fontSize:".78rem"}}>{a.time}</td>
                <td><strong>{a.user}</strong></td>
                <td>{a.action}</td>
                <td><code style={{fontSize:".75rem",color:"var(--accent)"}}>{a.ip}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PlaceholderSA = ({title}) => (
  <div className="sa-section">
    <div className="sa-section-head"><h2>{title}</h2></div>
    <div className="sa-card" style={{textAlign:"center",padding:"60px",color:"var(--text-secondary)"}}>
      <div style={{fontSize:"3rem",marginBottom:"12px"}}>??</div><p>Under development.</p>
    </div>
  </div>
);

export default function SuperAdminDashboardPage() {
  const [active, setActive] = useState("overview");
  const [open, setOpen] = useState(false);
  const go = useCallback(id=>{ setActive(id); setOpen(false); },[]);
  const sections = { overview:<SAOverview/>, users:<SAUsers/>, branches:<SABranches/>, content:<PlaceholderSA title="?? Content Management"/>, plans:<PlaceholderSA title="?? Plans & Pricing"/>, analytics:<PlaceholderSA title="?? Advanced Analytics"/>, settings:<SASettings/>, audit:<SAAudit/> };
  return (
    <div className="sa-layout">
      <aside className={`sa-sidebar ${open?"sa-sidebar-open":""}`}>
        <div className="sa-sidebar-brand">? FitZone <span>Super Admin</span></div>
        <div className="sa-sidebar-user">
          <div className="sa-avatar">SA</div>
          <div><strong>Super Admin</strong><span>System Owner</span></div>
        </div>
        <nav className="sa-nav">
          {NAV.map(n=>(
            <button key={n.id} className={`sa-nav-item ${active===n.id?"sa-nav-active":""}`} onClick={()=>go(n.id)}>
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="sa-sidebar-foot">
          <Link to="/" className="sa-nav-item">? Back to Site</Link>
          <Link to="/dashboard/admin" className="sa-nav-item">?? Admin View</Link>
        </div>
      </aside>
      {open && <div className="sa-overlay" onClick={()=>setOpen(false)} />}
      <div className="sa-main">
        <header className="sa-topbar">
          <button className="sa-menu-btn" onClick={()=>setOpen(true)}>?</button>
          <span className="sa-topbar-title">Super Admin — Global Control Panel</span>
          <div className="sa-topbar-right"><span>??</span><div className="sa-avatar sa-avatar-sm">SA</div></div>
        </header>
        <main className="sa-content">{sections[active]}</main>
      </div>
    </div>
  );
}
