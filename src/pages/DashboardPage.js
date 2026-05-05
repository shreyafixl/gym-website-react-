import { useState, useCallback, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { userData } from "../data/dashboardData";
import "../dashboard.css";

const DashboardOverview   = lazy(() => import("../dashboard/DashboardOverview"));
const DashboardBookings   = lazy(() => import("../dashboard/DashboardBookings"));
const DashboardProgress   = lazy(() => import("../dashboard/DashboardProgress"));
const DashboardHistory    = lazy(() => import("../dashboard/DashboardHistory"));
const DashboardSchedule   = lazy(() => import("../dashboard/DashboardSchedule"));
const DashboardTrainer    = lazy(() => import("../dashboard/DashboardTrainer"));
const DashboardBilling    = lazy(() => import("../dashboard/DashboardBilling"));
const DashboardMemberCard = lazy(() => import("../dashboard/DashboardMemberCard"));

const NAV = [
  { id: "overview", icon: "🏠", label: "Overview"        },
  { id: "bookings", icon: "📅", label: "My Bookings"     },
  { id: "progress", icon: "📈", label: "Progress"        },
  { id: "history",  icon: "🕐", label: "Workout History" },
  { id: "schedule", icon: "🗓️", label: "Class Schedule"  },
  { id: "trainer",  icon: "👤", label: "My Trainer"      },
  { id: "billing",  icon: "💳", label: "Billing"         },
  { id: "card",     icon: "🪪", label: "Member Card"     },
];

const SECTIONS = {
  overview: <DashboardOverview />,
  bookings: <DashboardBookings />,
  progress: <DashboardProgress />,
  history:  <DashboardHistory />,
  schedule: <DashboardSchedule />,
  trainer:  <DashboardTrainer />,
  billing:  <DashboardBilling />,
  card:     <DashboardMemberCard />,
};

function SectionLoader() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"40vh" }}>
      <div className="loader-spinner" />
    </div>
  );
}

export default function DashboardPage() {
  const [active, setActive]   = useState("overview");
  const [open,   setOpen]     = useState(false);

  const go = useCallback((id) => { setActive(id); setOpen(false); }, []);
  const current = NAV.find(n => n.id === active);

  return (
    <div className="db-layout">

      {/* ── Sidebar ── */}
      <aside className={`db-sidebar ${open ? "db-sidebar--open" : ""}`}>
        <div className="db-sidebar-brand">
          <span className="db-brand-logo">⚡ FitZone</span>
        </div>

        <div className="db-sidebar-user">
          <div className="db-avatar">{userData.avatar}</div>
          <div className="db-user-meta">
            <strong>{userData.name}</strong>
            <span>{userData.membershipPlan} Member</span>
          </div>
        </div>

        <nav className="db-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`db-nav-item ${active === item.id ? "db-nav-item--active" : ""}`}
              onClick={() => go(item.id)}
            >
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <Link to="/" className="db-nav-item">
            <span className="db-nav-icon">←</span>
            <span className="db-nav-label">Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="db-overlay" onClick={() => setOpen(false)} />}

      {/* ── Main ── */}
      <div className="db-main">
        {/* Top bar */}
        <header className="db-topbar">
          <button className="db-menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">☰</button>
          <div className="db-topbar-title">{current?.icon} {current?.label}</div>
          <div className="db-topbar-right">
            <button className="db-notif-btn" aria-label="Notifications">🔔</button>
            <div className="db-avatar db-avatar-sm">{userData.avatar}</div>
          </div>
        </header>

        {/* Content */}
        <main className="db-content">
          <Suspense fallback={<SectionLoader />}>
            {SECTIONS[active]}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
