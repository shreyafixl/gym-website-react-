import { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import {
  FaHome, FaUsers, FaCalendarAlt, FaDumbbell, FaClipboardList,
  FaEnvelope, FaChartBar, FaCheckCircle, FaClock, FaBell,
  FaArrowLeft, FaSearch, FaPlus, FaStickyNote, FaPaperPlane,
  FaEdit, FaStar, FaUserCircle
} from "react-icons/fa";
import { trainerInfo, todaySchedule, pendingTasks, clients, clientProgressNotes, exerciseLibrary, workoutTemplates, trainerMessages, trainerReports, calendarEvents } from "../data/trainerDashboardData";
import "../trainer-dashboard.css";

const NAV = [
  { id:"home",     icon:<FaHome />,          label:"Dashboard Home" },
  { id:"clients",  icon:<FaUsers />,          label:"My Clients"     },
  { id:"schedule", icon:<FaCalendarAlt />,    label:"Schedule"       },
  { id:"classes",  icon:<FaDumbbell />,       label:"Classes"        },
  { id:"plans",    icon:<FaClipboardList />,  label:"Workout Plans"  },
  { id:"messages", icon:<FaEnvelope />,       label:"Messages"       },
  { id:"reports",  icon:<FaChartBar />,       label:"Reports"        },
];

const TBadge = memo(({ s }) => {
  const m = { completed:"td-badge-green", ongoing:"td-badge-orange", upcoming:"td-badge-blue", active:"td-badge-green", inactive:"td-badge-gray", high:"td-badge-red", medium:"td-badge-orange", low:"td-badge-blue" };
  return <span className={`td-badge ${m[s]||"td-badge-gray"}`}>{s}</span>;
});

/* -- A. Home -- */
function TrainerHome({ setSection, setSelectedClient }) {
  const [tasks, setTasks] = useState(pendingTasks);
  const toggle = id => setTasks(p => p.map(t => t.id===id ? {...t,done:!t.done} : t));
  return (
    <div className="td-section">
      <div className="td-kpi-grid">
        {[
          { icon:<FaUsers />,       label:"Total Clients",   value:trainerInfo.totalClients,  sub:"All time",         color:"#e8622a" },
          { icon:<FaCheckCircle />, label:"Active Clients",  value:trainerInfo.activeClients, sub:"Currently active", color:"#22c55e" },
          { icon:<FaChartBar />,    label:"Today's Revenue", value:`$${trainerInfo.todayRevenue}`, sub:"From PT sessions", color:"#3b82f6" },
          { icon:<FaStar />,        label:"Rating",          value:trainerInfo.rating,        sub:"Average score",    color:"#f59e0b" },
        ].map((k,i) => (
          <div className="td-kpi-card" key={i}>
            <div className="td-kpi-icon" style={{background:k.color+"22"}}>{k.icon}</div>
            <div><strong>{k.value}</strong><span>{k.label}</span><small>{k.sub}</small></div>
          </div>
        ))}
      </div>

      <div className="td-two-col">
        <div className="td-card">
          <div className="td-card-head"><h3><FaCalendarAlt style={{marginRight:6}} />Today's Schedule</h3></div>
          <div className="td-timeline">
            {todaySchedule.map(s => (
              <div className={`td-timeline-item td-tl-${s.status}`} key={s.id}>
                <div className="td-tl-time">{s.time}</div>
                <div className="td-tl-dot" />
                <div className="td-tl-body">
                  <strong>{s.client}</strong>
                  <span>{s.type} · {s.duration}</span>
                  <TBadge s={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="td-card">
          <div className="td-card-head">
            <h3><FaClock style={{marginRight:6}} />Pending Tasks</h3>
            <span className="td-badge td-badge-red">{tasks.filter(t=>!t.done).length} pending</span>
          </div>
          <div className="td-tasks">
            {tasks.map(t => (
              <div className={`td-task ${t.done?"td-task-done":""}`} key={t.id}>
                <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} />
                <span className="td-task-text">{t.task}</span>
                <TBadge s={t.priority} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="td-card">
        <div className="td-card-head">
          <h3><FaUsers style={{marginRight:6}} />Active Clients</h3>
          <button className="td-link-btn" onClick={()=>setSection("clients")}>View All →</button>
        </div>
        <div className="td-client-mini-grid">
          {clients.filter(c=>c.status==="active").slice(0,4).map(c => (
            <div className="td-client-mini" key={c.id} onClick={()=>{setSelectedClient(c);setSection("clientProfile");}}>
              <img src={c.photo} alt={c.name} />
              <strong>{c.name}</strong>
              <span>{c.plan}</span>
              <div className="td-mini-progress"><div style={{width:`${c.progress}%`}} /><span>{c.progress}%</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -- B. Clients -- */
function TrainerClients({ setSection, setSelectedClient }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = clients.filter(c =>
    (filter==="all" || c.status===filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaUsers style={{marginRight:8}} />My Clients</h2></div>
      <div className="td-filters">
        <div style={{position:"relative"}}>
          <FaSearch style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--text-secondary)",fontSize:".8rem"}} />
          <input className="td-input" placeholder="Search clients..." value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:30}} />
        </div>
        {["all","active","inactive"].map(f => (
          <button key={f} className={`td-filter-btn ${filter===f?"td-filter-active":""}`} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="td-clients-grid">
        {filtered.map(c => (
          <div className="td-client-card" key={c.id} onClick={()=>{setSelectedClient(c);setSection("clientProfile");}}>
            <div className="td-client-card-top">
              <img src={c.photo} alt={c.name} className="td-client-photo" />
              <TBadge s={c.status} />
            </div>
            <h4>{c.name}</h4>
            <span className="td-client-plan">{c.plan}</span>
            <div className="td-client-meta">
              <span><FaCalendarAlt style={{marginRight:4}} />{c.lastVisit}</span>
              <span><FaDumbbell style={{marginRight:4}} />{c.sessions} sessions</span>
              <span><FaCheckCircle style={{marginRight:4}} />{c.goal}</span>
            </div>
            <div className="td-progress-row">
              <span>Progress</span><span>{c.progress}%</span>
            </div>
            <div className="td-progress-bar"><div className="td-progress-fill" style={{width:`${c.progress}%`}} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -- C. Client Profile -- */
function ClientProfile({ client, setSection }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(clientProgressNotes);
  const addNote = () => { if(!note.trim()) return; setNotes(p=>[{date:"Today",note,trainer:"Vikram"},...p]); setNote(""); };
  if(!client) return <div className="td-section"><p>No client selected.</p></div>;
  return (
    <div className="td-section">
      <div className="td-section-head">
        <button className="td-back-btn" onClick={()=>setSection("clients")}><FaArrowLeft style={{marginRight:6}} />Back</button>
        <h2>Client Profile</h2>
      </div>
      <div className="td-profile-grid">
        <div className="td-card td-profile-left">
          <img src={client.photo} alt={client.name} className="td-profile-photo" />
          <h3>{client.name}</h3>
          <TBadge s={client.status} />
          <div className="td-profile-stats">
            {[["Plan",client.plan],["Goal",client.goal],["Weight",client.weight],["Sessions",client.sessions],["Joined",client.joined],["Last Visit",client.lastVisit]].map(([l,v])=>(
              <div key={l}><span>{l}</span><strong>{v}</strong></div>
            ))}
          </div>
          <div className="td-progress-row"><span>Overall Progress</span><span>{client.progress}%</span></div>
          <div className="td-progress-bar"><div className="td-progress-fill" style={{width:`${client.progress}%`}} /></div>
          <div className="td-profile-actions">
            <button className="btn btn-primary td-btn-sm"><FaClipboardList style={{marginRight:6}} />Assign Plan</button>
            <button className="btn btn-outline td-btn-sm"><FaEnvelope style={{marginRight:6}} />Message</button>
          </div>
        </div>
        <div className="td-profile-right">
          <div className="td-card">
            <div className="td-card-head"><h3><FaChartBar style={{marginRight:6}} />Performance Chart</h3></div>
            <div className="td-perf-chart">
              {[["Strength",78],["Cardio",65],["Flexibility",55],["Consistency",88],["Nutrition",70]].map(([l,v])=>(
                <div className="td-perf-row" key={l}>
                  <span>{l}</span>
                  <div className="td-perf-bar-wrap"><div className="td-perf-bar" style={{width:`${v}%`}} /></div>
                  <span>{v}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="td-card">
            <div className="td-card-head"><h3><FaStickyNote style={{marginRight:6}} />Progress Notes</h3></div>
            <div className="td-notes-list">
              {notes.map((n,i)=>(
                <div className="td-note" key={i}>
                  <div className="td-note-head"><strong>{n.date}</strong><span>{n.trainer}</span></div>
                  <p>{n.note}</p>
                </div>
              ))}
            </div>
            <div className="td-note-input">
              <textarea className="td-textarea" placeholder="Add progress note..." value={note} onChange={e=>setNote(e.target.value)} rows={3} />
              <button className="btn btn-primary td-btn-sm" onClick={addNote}>Add Note</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -- D. Schedule -- */
function TrainerSchedule() {
  const days = ["Mon 5","Tue 6","Wed 7","Thu 8","Fri 9","Sat 10","Sun 11"];
  const [selected, setSelected] = useState(null);
  return (
    <div className="td-section">
      <div className="td-section-head">
        <h2><FaCalendarAlt style={{marginRight:8}} />Schedule Management</h2>
        <button className="btn btn-primary td-btn-sm"><FaPlus style={{marginRight:6}} />New Session</button>
      </div>
      <div className="td-calendar-grid">
        {days.map((day,di) => (
          <div className="td-cal-day" key={day}>
            <div className="td-cal-day-head">{day}</div>
            {calendarEvents.filter((_,i)=>i%7===di).map(ev=>(
              <div className={`td-cal-event td-ev-${ev.type}`} key={ev.id} onClick={()=>setSelected(ev)}>
                <span>{ev.time}</span>
                <span>{ev.title}</span>
              </div>
            ))}
            <button className="td-add-slot"><FaPlus style={{marginRight:4}} />Add</button>
          </div>
        ))}
      </div>
      {selected && (
        <div className="td-card td-event-detail">
          <div className="td-card-head"><h3>Session Details</h3><button onClick={()=>setSelected(null)}>✕</button></div>
          <p><strong>Title:</strong> {selected.title}</p>
          <p><strong>Date:</strong> {selected.date}</p>
          <p><strong>Time:</strong> {selected.time}</p>
          <p><strong>Type:</strong> {selected.type}</p>
        </div>
      )}
    </div>
  );
}

/* -- E. Classes -- */
function TrainerClasses() {
  const [attendance, setAttendance] = useState({});
  const classList = [
    { id:1, name:"HIIT Blast",       date:"May 5",  time:"9:00 AM",  enrolled:12, attended:10 },
    { id:2, name:"Strength Builder", date:"May 5",  time:"5:30 PM",  enrolled:15, attended:0  },
    { id:3, name:"CrossFit",         date:"May 6",  time:"6:00 PM",  enrolled:8,  attended:0  },
    { id:4, name:"Boxing Basics",    date:"May 7",  time:"7:00 PM",  enrolled:10, attended:9  },
  ];
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaDumbbell style={{marginRight:8}} />Class Management</h2></div>
      <div className="td-classes-list">
        {classList.map(c => (
          <div className="td-class-item td-card" key={c.id}>
            <div className="td-class-info">
              <h4>{c.name}</h4>
              <span><FaCalendarAlt style={{marginRight:4}} />{c.date} · <FaClock style={{marginRight:4}} />{c.time}</span>
              <span><FaUsers style={{marginRight:4}} />{c.enrolled} enrolled</span>
            </div>
            <div className="td-class-attendance">
              <span>Attended: <strong>{attendance[c.id]??c.attended}/{c.enrolled}</strong></span>
              <div className="td-progress-bar" style={{width:"120px"}}>
                <div className="td-progress-fill" style={{width:`${((attendance[c.id]??c.attended)/c.enrolled)*100}%`}} />
              </div>
            </div>
            <div className="td-class-actions">
              <button className="btn btn-primary td-btn-sm" onClick={()=>setAttendance(p=>({...p,[c.id]:c.enrolled}))}>Mark All Present</button>
              <button className="btn btn-outline td-btn-sm"><FaStickyNote style={{marginRight:6}} />Notes</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -- F. Workout Plans -- */
function WorkoutPlans() {
  const [tab, setTab] = useState("templates");
  const [search, setSearch] = useState("");
  const filtered = exerciseLibrary.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="td-section">
      <div className="td-section-head">
        <h2><FaClipboardList style={{marginRight:8}} />Workout Plan Builder</h2>
        <button className="btn btn-primary td-btn-sm"><FaPlus style={{marginRight:6}} />Create Plan</button>
      </div>
      <div className="td-tabs">
        {[["templates","Templates"],["library","Exercise Library"]].map(([id,l])=>(
          <button key={id} className={`td-tab ${tab===id?"td-tab-active":""}`} onClick={()=>setTab(id)}>{l}</button>
        ))}
      </div>
      {tab==="templates" && (
        <div className="td-templates-grid">
          {workoutTemplates.map(t=>(
            <div className="td-template-card td-card" key={t.id}>
              <div className="td-template-level">{t.level}</div>
              <h4>{t.name}</h4>
              <div className="td-template-meta">
                <span><FaCalendarAlt style={{marginRight:4}} />{t.days} days/week</span>
                <span><FaDumbbell style={{marginRight:4}} />{t.exercises} exercises</span>
                <span><FaUsers style={{marginRight:4}} />{t.clients} clients</span>
              </div>
              <div className="td-template-actions">
                <button className="btn btn-primary td-btn-sm">Assign</button>
                <button className="btn btn-outline td-btn-sm"><FaEdit style={{marginRight:4}} />Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==="library" && (
        <div className="td-card">
          <div style={{position:"relative",marginBottom:16}}>
            <FaSearch style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--text-secondary)",fontSize:".8rem"}} />
            <input className="td-input" placeholder="Search exercises..." value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:30}} />
          </div>
          <table className="td-table">
            <thead><tr><th>Exercise</th><th>Muscle</th><th>Equipment</th><th>Sets</th><th>Rest</th><th></th></tr></thead>
            <tbody>
              {filtered.map(e=>(
                <tr key={e.id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.muscle}</td>
                  <td>{e.equipment}</td>
                  <td>{e.sets}</td>
                  <td>{e.rest}</td>
                  <td><button className="td-link-btn"><FaPlus style={{marginRight:4}} />Add</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* -- G. Messages -- */
function TrainerMessages() {
  const [active, setActive] = useState(trainerMessages[0]);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState({ [trainerMessages[0].client]: [{from:"client",text:trainerMessages[0].lastMsg,time:trainerMessages[0].time}] });
  const send = () => {
    if(!input.trim()) return;
    setChats(p=>({...p,[active.client]:[...(p[active.client]||[]),{from:"trainer",text:input,time:"Just now"}]}));
    setInput("");
  };
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaEnvelope style={{marginRight:8}} />Messages</h2></div>
      <div className="td-messages-layout">
        <div className="td-inbox">
          {trainerMessages.map(m=>(
            <div className={`td-inbox-item ${active.id===m.id?"td-inbox-active":""}`} key={m.id} onClick={()=>setActive(m)}>
              <div className="td-inbox-avatar">{m.avatar}</div>
              <div className="td-inbox-info">
                <strong>{m.client}</strong>
                <span>{m.lastMsg}</span>
                <small>{m.time}</small>
              </div>
              {m.unread>0 && <span className="td-unread">{m.unread}</span>}
            </div>
          ))}
        </div>
        <div className="td-chat-panel td-card">
          <div className="td-chat-head">
            <strong>{active.client}</strong>
            <span className="td-badge td-badge-green">Online</span>
          </div>
          <div className="td-chat-msgs">
            {(chats[active.client]||[]).map((m,i)=>(
              <div key={i} className={`td-chat-msg ${m.from==="trainer"?"td-msg-me":""}`}>
                <div className="td-msg-bubble">{m.text}</div>
                <span className="td-msg-time">{m.time}</span>
              </div>
            ))}
          </div>
          <div className="td-chat-input">
            <input className="td-input" placeholder="Type a message..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} />
            <button className="btn btn-primary td-btn-sm" onClick={send}><FaPaperPlane style={{marginRight:6}} />Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -- H. Reports -- */
function TrainerReports() {
  const r = trainerReports;
  return (
    <div className="td-section">
      <div className="td-section-head"><h2><FaChartBar style={{marginRight:8}} />Reports</h2></div>
      <div className="td-kpi-grid">
        {[
          { icon:<FaCheckCircle />, label:"Attendance Rate",    value:`${r.attendanceRate}%`,  color:"#22c55e" },
          { icon:<FaUsers />,       label:"Client Retention",   value:`${r.clientRetention}%`, color:"#3b82f6" },
          { icon:<FaStar />,        label:"Avg Session Rating", value:r.avgSessionRating,      color:"#f59e0b" },
          { icon:<FaChartBar />,    label:"Monthly Revenue",    value:`$${r.monthlyRevenue[r.monthlyRevenue.length-1]}`, color:"#e8622a" },
        ].map((k,i)=>(
          <div className="td-kpi-card" key={i}>
            <div className="td-kpi-icon" style={{background:k.color+"22"}}>{k.icon}</div>
            <div><strong>{k.value}</strong><span>{k.label}</span></div>
          </div>
        ))}
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Monthly Revenue Trend</h3></div>
        <div className="td-bar-chart">
          {r.monthlyRevenue.map((v,i)=>{
            const max=Math.max(...r.monthlyRevenue);
            const months=["J","F","M","A","M","J","J","A","S","O","N","D"];
            return (
              <div className="td-bar-col" key={i}>
                <span className="td-bar-val">${(v/1000).toFixed(1)}k</span>
                <div className="td-bar" style={{height:`${(v/max)*100}%`}} />
                <span className="td-bar-label">{months[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="td-card">
        <div className="td-card-head"><h3>Class Attendance Rate</h3></div>
        <table className="td-table">
          <thead><tr><th>Class</th><th>Sessions</th><th>Attendance Rate</th><th>Performance</th></tr></thead>
          <tbody>
            {r.classAttendance.map((c,i)=>(
              <tr key={i}>
                <td><strong>{c.class}</strong></td>
                <td>{c.sessions}</td>
                <td>{c.rate}%</td>
                <td>
                  <div className="td-progress-bar" style={{width:"120px"}}>
                    <div className="td-progress-fill" style={{width:`${c.rate}%`,background:c.rate>90?"#22c55e":c.rate>80?"#e8622a":"#ef4444"}} />
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

/* -- Main -- */
export default function TrainerDashboardPage() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const go = useCallback(id => { setActive(id); setOpen(false); }, []);

  const section = active==="clientProfile"
    ? <ClientProfile client={selectedClient} setSection={setActive} />
    : active==="home"     ? <TrainerHome setSection={setActive} setSelectedClient={setSelectedClient} />
    : active==="clients"  ? <TrainerClients setSection={setActive} setSelectedClient={setSelectedClient} />
    : active==="schedule" ? <TrainerSchedule />
    : active==="classes"  ? <TrainerClasses />
    : active==="plans"    ? <WorkoutPlans />
    : active==="messages" ? <TrainerMessages />
    : active==="reports"  ? <TrainerReports />
    : null;

  return (
    <div className="td-layout">
      <aside className={`td-sidebar ${open?"td-sidebar-open":""}`}>
        <div className="td-sidebar-brand">⚡ FitZone <span>Trainer</span></div>
        <div className="td-sidebar-user">
          <div className="td-avatar">{trainerInfo.avatar}</div>
          <div><strong>{trainerInfo.name}</strong><span>{trainerInfo.specialization}</span></div>
        </div>
        <nav className="td-nav">
          {NAV.map(n=>(
            <button
              key={n.id}
              className={`td-nav-item ${(active===n.id)||(active==="clientProfile"&&n.id==="clients")?"td-nav-active":""}`}
              onClick={()=>go(n.id)}
            >
              <span className="td-nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="td-sidebar-foot">
          <Link to="/" className="td-nav-item"><FaHome style={{marginRight:8}} />Back to Site</Link>
          <Link to="/dashboard" className="td-nav-item"><FaUserCircle style={{marginRight:8}} />Member View</Link>
        </div>
      </aside>
      {open && <div className="td-overlay" onClick={()=>setOpen(false)} />}
      <div className="td-main">
        <header className="td-topbar">
          <button className="td-menu-btn" onClick={()=>setOpen(true)}>☰</button>
          <span className="td-topbar-title">Trainer Dashboard</span>
          <div className="td-topbar-right">
            <FaBell style={{fontSize:"1.1rem",color:"var(--text-secondary)"}} />
            <div className="td-avatar td-avatar-sm">{trainerInfo.avatar}</div>
          </div>
        </header>
        <main className="td-content">{section}</main>
      </div>
    </div>
  );
}
