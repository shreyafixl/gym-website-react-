import { monthlyProgress, userData, userGoals } from "../data/dashboardData";

function BarChart({ data, labels, color="var(--accent)", height=140 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height, padding:"8px 0" }}>
      {data.map((v,i) => (
        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flex:1 }}>
          <span style={{ fontSize:".58rem", color:"var(--text-secondary)" }}>{v>=1000?`${(v/1000).toFixed(1)}k`:v}</span>
          <div style={{ width:"100%", background:color, borderRadius:"4px 4px 0 0", height:`${(v/max)*85}%`, minHeight:8, opacity:.8 }} />
          <span style={{ fontSize:".6rem", color:"var(--text-secondary)" }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value, max=100, color="var(--accent)", height=8 }) {
  return (
    <div style={{ background:"var(--border-color)", borderRadius:4, height, overflow:"hidden" }}>
      <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", background:color, borderRadius:4, transition:"width .5s" }} />
    </div>
  );
}

export default function DashboardReports() {
  const m = monthlyProgress;
  return (
    <div className="db-section">
      <div className="db-section-header">
        <h2>Progress Reports</h2>
        <button className="btn btn-outline db-btn-sm">Download PDF</button>
      </div>

      <div className="db-stats-grid">
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(249,115,22,.15)" }}>Sessions</div><div className="db-stat-info"><span className="db-stat-value">{m.sessions.reduce((a,b)=>a+b,0)}</span><span className="db-stat-label">Total Sessions</span><span className="db-stat-sub">Avg {Math.round(m.sessions.reduce((a,b)=>a+b,0)/12)}/month</span></div></div>
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(239,68,68,.15)" }}>Cal</div><div className="db-stat-info"><span className="db-stat-value">{(m.calories.reduce((a,b)=>a+b,0)/1000).toFixed(0)}k</span><span className="db-stat-label">Calories Burned</span><span className="db-stat-sub">12-month total</span></div></div>
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(34,197,94,.15)" }}>Weight</div><div className="db-stat-info"><span className="db-stat-value">-{(m.weight[0]-m.weight[m.weight.length-1]).toFixed(1)} kg</span><span className="db-stat-label">Weight Lost</span><span className="db-stat-sub">{m.weight[0]} to {m.weight[m.weight.length-1]} kg</span></div></div>
        <div className="db-stat-card"><div className="db-stat-icon" style={{ background:"rgba(59,130,246,.15)" }}>Goals</div><div className="db-stat-info"><span className="db-stat-value">{userGoals.filter(g=>g.status==="achieved").length}/{userGoals.length}</span><span className="db-stat-label">Goals Achieved</span></div></div>
      </div>

      <div className="db-card">
        <div className="db-card-header"><h3>Monthly Sessions</h3><span className="db-badge badge-blue">12 months</span></div>
        <BarChart data={m.sessions} labels={m.months} color="var(--accent)" height={140} />
      </div>

      <div className="db-cards-row">
        <div className="db-card">
          <div className="db-card-header"><h3>Calories Burned</h3></div>
          <BarChart data={m.calories} labels={m.months} color="#ef4444" height={120} />
        </div>
        <div className="db-card">
          <div className="db-card-header"><h3>Weight Trend</h3></div>
          <BarChart data={m.weight} labels={m.months} color="#3b82f6" height={120} />
        </div>
      </div>

      <div className="db-card">
        <div className="db-card-header"><h3>Goal Progress Overview</h3></div>
        {userGoals.map(g => (
          <div key={g.id} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:".85rem", marginBottom:5 }}>
              <span><strong>{g.title}</strong> <span style={{ fontSize:".72rem", color:"var(--text-secondary)" }}>({g.type.replace("_"," ")})</span></span>
              <span style={{ color:g.progress>70?"#22c55e":g.progress>40?"var(--accent)":"#ef4444", fontWeight:700 }}>{g.progress}%</span>
            </div>
            <ProgressBar value={g.progress} color={g.progress>70?"#22c55e":g.progress>40?"var(--accent)":"#ef4444"} />
          </div>
        ))}
      </div>
    </div>
  );
}
