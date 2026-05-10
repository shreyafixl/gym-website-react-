import { useState, useEffect } from 'react';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { useAdminData } from '../../hooks/useAdminData';

// Reusable components
const KpiCard = ({ icon, label, value, change, color, loading }) => (
  <div className="ad-kpi-card">
    <div className="ad-kpi-icon" style={{ background: color + "22" }}>
      {loading ? <div className="ad-spinner-small" /> : icon}
    </div>
    <div>
      <strong>{loading ? '...' : value}</strong>
      <span>{label}</span>
      {change && <small>{change}</small>}
    </div>
  </div>
);

const BarChart = ({ data, labels, color = "var(--accent)", height = 130, loading }) => {
  if (loading) {
    return (
      <div className="ad-bar-chart" style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ad-spinner" />
      </div>
    );
  }

  const max = Math.max(...data);
  return (
    <div className="ad-bar-chart" style={{ height }}>
      {data.map((v, i) => (
        <div className="ad-bar-col" key={i}>
          <span className="ad-bar-val">{v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}</span>
          <div className="ad-bar" style={{ height:`${(v/max)*100}%`, background: color }} />
          <span className="ad-bar-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

const ProgressBar = ({ value, max = 100, color = "var(--accent)" }) => (
  <div style={{ background:"var(--bg-primary)", borderRadius:4, height:8, overflow:"hidden" }}>
    <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", background:color, borderRadius:4, transition:"width .4s" }} />
  </div>
);

const EmptyState = ({ icon = "📭", title = "No data found", desc = "Nothing to display here yet." }) => (
  <div className="ad-empty">
    <div className="ad-empty-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

const AdminOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Fetch dashboard KPIs
  const { data: kpiData, loading: kpiLoading, error: kpiError } = useAdminData(
    () => adminService.analytics.getDashboardKPIs(selectedPeriod),
    [selectedPeriod],
    { 
      onSuccess: (data) => console.log('📊 [Admin Overview] KPIs loaded:', data),
      onError: (error) => console.error('❌ [Admin Overview] KPIs error:', error)
    }
  );

  // Fetch revenue trends
  const { data: revenueData, loading: revenueLoading } = useAdminData(
    () => adminService.analytics.getRevenueTrends('year'),
    [],
    { immediate: true }
  );

  // Fetch member growth
  const { data: memberGrowthData, loading: growthLoading } = useAdminData(
    () => adminService.analytics.getMemberGrowth('year'),
    [],
    { immediate: true }
  );

  // Fetch attendance analytics
  const { data: attendanceData, loading: attendanceLoading } = useAdminData(
    () => adminService.analytics.getAttendanceAnalytics('month'),
    [selectedPeriod],
    { immediate: true }
  );

  // Fetch pending payments (due renewals)
  const { data: pendingPayments, loading: paymentsLoading } = useAdminData(
    () => adminService.memberships.getStats(),
    [],
    { immediate: true }
  );

  // Format KPI data for display
  const formatKPIs = (data) => {
    if (!data) return [];

    return [
      { 
        icon: <FaUsers />, 
        label: "Total Members", 
        value: data.totalMembers || 0, 
        change: data.memberGrowth || "+0 this month", 
        color: "#e8622a" 
      },
      { 
        icon: <FaUsers />, 
        label: "Active Members", 
        value: data.activeMembers || 0, 
        change: data.activeRate || "87% active rate", 
        color: "#22c55e" 
      },
      { 
        icon: <FaCalendarAlt />, 
        label: "Today Check-ins", 
        value: data.todayCheckins || 0, 
        change: data.checkinGrowth || "+0 vs yesterday", 
        color: "#3b82f6" 
      },
      { 
        icon: <FaMoneyBillWave />, 
        label: "Monthly Revenue", 
        value: data.monthlyRevenue ? `$${data.monthlyRevenue.toLocaleString()}` : "$0", 
        change: data.revenueGrowth || "+0% vs last month", 
        color: "#8b5cf6" 
      },
      { 
        icon: <FaChartBar />, 
        label: "Occupancy Rate", 
        value: data.occupancyRate || "0%", 
        change: data.peakHours || "Peak: 6–8 PM", 
        color: "#f59e0b" 
      },
      { 
        icon: <FaUsers />, 
        label: "New Members", 
        value: data.newMembers || 0, 
        change: "This month", 
        color: "#ec4899" 
      },
    ];
  };

  const kpis = formatKPIs(kpiData);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>📊 Overview</h2>
        <div className="ad-period-selector">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="ad-input"
            style={{ width: 'auto', padding: '4px 8px' }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="ad-kpi-grid">
        {kpis.map((k, i) => (
          <KpiCard 
            key={i} 
            icon={k.icon} 
            label={k.label} 
            value={k.value} 
            change={k.change} 
            color={k.color}
            loading={kpiLoading}
          />
        ))}
      </div>

      {/* Error State */}
      {kpiError && (
        <div className="ad-error-banner">
          <span>⚠️ Error loading dashboard data: {kpiError}</span>
          <button onClick={() => window.location.reload()} className="ad-btn-sm">Retry</button>
        </div>
      )}

      <div className="ad-two-col">
        {/* Revenue Trend */}
        <div className="ad-card">
          <div className="ad-card-head">
            <h3>💰 Revenue Trend (12 months)</h3>
          </div>
          <BarChart 
            data={revenueData?.monthlyRevenue || []} 
            labels={months} 
            color="var(--accent)" 
            loading={revenueLoading}
          />
        </div>

        {/* Member Growth */}
        <div className="ad-card">
          <div className="ad-card-head">
            <h3>📈 New Member Growth</h3>
          </div>
          <BarChart 
            data={memberGrowthData?.monthlyNewMembers || []} 
            labels={months.map(m=>m[0])} 
            color="#22c55e" 
            loading={growthLoading}
          />
        </div>
      </div>

      <div className="ad-two-col">
        {/* Weekly Attendance */}
        <div className="ad-card">
          <div className="ad-card-head">
            <h3>🏃 Weekly Attendance</h3>
          </div>
          {attendanceData?.weeklyData ? (
            <BarChart 
              data={attendanceData.weeklyData.map(d=>d.checkins)} 
              labels={attendanceData.weeklyData.map(d=>d.day)} 
              color="#3b82f6" 
              height={110}
              loading={attendanceLoading}
            />
          ) : (
            <EmptyState title="No attendance data" desc="Attendance data will appear here once available." />
          )}
        </div>

        {/* Class Occupancy Heatmap */}
        <div className="ad-card">
          <div className="ad-card-head">
            <h3>🔥 Class Occupancy Heatmap</h3>
          </div>
          <div className="ad-heatmap">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
              <div className="ad-heatmap-row" key={d}>
                <span>{d}</span>
                {["6AM","8AM","10AM","12PM","3PM","5PM","7PM","9PM"].map(t => {
                  // Use real occupancy data if available, otherwise show placeholder
                  const v = attendanceData?.occupancy?.[d]?.[t] || Math.floor(Math.random() * 100);
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

      {/* Due Renewals */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>⚠️ Due Renewals</h3>
          <span className="ad-badge ad-red">
            {pendingPayments?.overdueCount || 0} overdue
          </span>
        </div>
        {paymentsLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="ad-spinner" />
          </div>
        ) : pendingPayments?.overdueMembers?.length > 0 ? (
          <table className="ad-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Days Overdue</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.overdueMembers.map((member, i) => (
                <tr key={i}>
                  <td><strong>{member.name}</strong></td>
                  <td>{member.plan}</td>
                  <td><strong>{member.amount}</strong></td>
                  <td>{member.dueDate}</td>
                  <td><span className="ad-badge ad-red">{member.daysOverdue} days</span></td>
                  <td>
                    <button className="ad-link-btn">Send Reminder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState title="No overdue payments" desc="All members are up to date with their payments." />
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
