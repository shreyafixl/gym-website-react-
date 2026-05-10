import { useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaSearch, FaSync } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { useAdminData, useAdminPaginatedData, useAdminRealTimeData } from '../../hooks/useAdminData';

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

const EmptyState = ({ icon = "📭", title = "No data found", desc = "Nothing to display here yet." }) => (
  <div className="ad-empty">
    <div className="ad-empty-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '40px' }}>
    <div className="ad-spinner" />
    <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Loading attendance data...</p>
  </div>
);

const CheckInCard = ({ checkIn, onCheckOut }) => {
  const handleCheckOut = async () => {
    try {
      await adminService.attendance.checkOut(checkIn._id);
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Failed to check out:', error);
    }
  };

  return (
    <div className="ad-checkin-row">
      <div className="ad-avatar" style={{ width: 36, height: 36, fontSize: '.7rem' }}>
        {checkIn.member?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: '.88rem' }}>{checkIn.member?.fullName || 'Unknown Member'}</strong>
        <div style={{ fontSize: '.75rem', color: 'var(--text-secondary)' }}>
          {checkIn.classType || 'General Workout'}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '.82rem', color: '#22c55e', fontWeight: 700 }}>
          {new Date(checkIn.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div style={{ fontSize: '.72rem', color: 'var(--text-secondary)' }}>
          {checkIn.duration || 'Active'}
        </div>
        {checkIn.checkOutTime === null && (
          <button 
            className="ad-link-btn" 
            onClick={handleCheckOut}
            style={{ fontSize: '.7rem', marginTop: '2px' }}
          >
            Check Out
          </button>
        )}
      </div>
    </div>
  );
};

const AdminAttendance = () => {
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch today's stats
  const { data: todayStats, loading: todayLoading, refetch: refetchToday } = useAdminData(
    adminService.attendance.getTodayStats,
    [],
    { immediate: true }
  );

  // Fetch weekly stats
  const { data: weeklyStats, loading: weeklyLoading, refetch: refetchWeekly } = useAdminData(
    adminService.attendance.getWeeklyStats,
    [],
    { immediate: true }
  );

  // Fetch attendance logs with pagination
  const { items: logs, pagination, loading: logsLoading, updateParams, refresh: refreshLogs } = useAdminPaginatedData(
    adminService.attendance.getLogs,
    {
      search,
      dateFrom: selectedDate,
      dateTo: selectedDate,
      limit: 6,
    }
  );

  // Fetch live check-ins (real-time)
  const { data: liveCheckIns, loading: liveLoading, refresh: refreshLive } = useAdminRealTimeData(
    adminService.attendance.getLiveCheckins,
    30000 // Update every 30 seconds
  );

  const handleSearch = (value) => {
    setSearch(value);
    updateParams({ search: value, page: 1 });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    updateParams({ dateFrom: date, dateTo: date, page: 1 });
  };

  const handlePageChange = (page) => {
    updateParams({ page });
  };

  const handleManualCheckIn = async (memberId) => {
    try {
      await adminService.attendance.checkIn(memberId);
      refreshLive();
      refreshLogs();
    } catch (error) {
      console.error('Failed to check in member:', error);
    }
  };

  const formatDuration = (checkInTime, checkOutTime) => {
    if (!checkInTime) return '—';
    
    const start = new Date(checkInTime);
    const end = checkOutTime ? new Date(checkOutTime) : new Date();
    const duration = Math.floor((end - start) / (1000 * 60)); // minutes
    
    if (duration < 60) {
      return `${duration}m`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = weeklyStats?.dailyStats || [];

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>📅 Attendance</h2>
        <div className="ad-head-actions">
          <input
            type="date"
            className="ad-input"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            style={{ width: 'auto', padding: '4px 8px' }}
          />
          <button className="btn btn-outline ad-btn-sm" onClick={() => {
            refetchToday();
            refetchWeekly();
            refreshLogs();
            refreshLive();
          }}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="ad-kpi-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <KpiCard
          icon="🏃"
          label="Today Check-ins"
          value={todayStats?.todayCount || 0}
          change={todayStats?.growth ? `+${todayStats.growth} vs yesterday` : 'No data'}
          color="#3b82f6"
          loading={todayLoading}
        />
        <KpiCard
          icon="📅"
          label="This Week"
          value={weeklyStats?.weeklyTotal || 0}
          change={weeklyStats?.dailyAverage ? `Avg ${weeklyStats.dailyAverage}/day` : 'No data'}
          color="#22c55e"
          loading={weeklyLoading}
        />
        <KpiCard
          icon="📊"
          label="This Month"
          value={todayStats?.monthlyCount || 0}
          change={todayStats?.monthlyAverage ? `Avg ${todayStats.monthlyAverage}/day` : 'No data'}
          color="var(--accent)"
          loading={todayLoading}
        />
      </div>

      {/* Weekly Calendar View */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>📆 Weekly Calendar View</h3>
        </div>
        <div className="ad-week-grid">
          {days.map(day => {
            const dayData = weeklyData.find(d => d.day === day);
            const count = dayData?.checkins || 0;
            return (
              <div key={day} className="ad-week-day">
                <div className="ad-week-day-label">{day}</div>
                <div className="ad-week-day-count" style={{ 
                  color: count > 150 ? "#22c55e" : count > 100 ? "var(--accent)" : "#ef4444" 
                }}>
                  {count}
                </div>
                <div style={{ fontSize: ".65rem", color: "var(--text-secondary)" }}>
                  check-ins
                </div>
                <div style={{ marginTop: 6 }}>
                  <div style={{ 
                    background: "var(--bg-primary)", 
                    borderRadius: 4, 
                    height: 8, 
                    overflow: "hidden" 
                  }}>
                    <div style={{ 
                      width: `${Math.min((count / 200) * 100, 100)}%`, 
                      height: "100%", 
                      background: count > 150 ? "#22c55e" : "var(--accent)",
                      borderRadius: 4,
                      transition: "width .4s"
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Check-in Feed */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>🔴 Live Check-in Feed</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ 
              width: 8, 
              height: 8, 
              borderRadius: "50%", 
              background: "#22c55e", 
              animation: "ad-pulse 1.5s infinite" 
            }} />
            <span style={{ fontSize: ".75rem", color: "#22c55e", fontWeight: 700 }}>
              LIVE
            </span>
            <span className="ad-badge ad-green">
              {liveCheckIns?.length || 0} active
            </span>
          </div>
        </div>
        
        {liveLoading ? (
          <LoadingSpinner />
        ) : liveCheckIns?.length > 0 ? (
          liveCheckIns.map(checkIn => (
            <CheckInCard key={checkIn._id} checkIn={checkIn} />
          ))
        ) : (
          <EmptyState title="No active check-ins" desc="Members will appear here when they check in." />
        )}
      </div>

      {/* Attendance Logs */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>📋 Attendance Logs</h3>
        </div>
        
        <div className="ad-filters" style={{ marginBottom: 12 }}>
          <div className="ad-search-box">
            <FaSearch className="ad-search-icon" />
            <input
              className="ad-input"
              placeholder="Search member..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: 220 }}
            />
          </div>
        </div>

        {logsLoading ? (
          <LoadingSpinner />
        ) : logs.length === 0 ? (
          <EmptyState title="No attendance records found" desc="Try adjusting your search or date filter." />
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Date</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Duration</th>
                  <th>Class Type</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id}>
                    <td><strong>{log.member?.fullName || 'Unknown'}</strong></td>
                    <td style={{ fontSize: ".8rem" }}>
                      {new Date(log.checkInTime).toLocaleDateString()}
                    </td>
                    <td style={{ color: "#22c55e", fontWeight: 700 }}>
                      {new Date(log.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {log.checkOutTime ? 
                        new Date(log.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
                        '—'
                      }
                    </td>
                    <td>
                      <span className="ad-badge ad-blue">
                        {formatDuration(log.checkInTime, log.checkOutTime)}
                      </span>
                    </td>
                    <td>{log.classType || 'General Workout'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="ad-pagination">
          <button 
            disabled={pagination.currentPage === 1} 
            onClick={() => handlePageChange(pagination.currentPage - 1)} 
            className="ad-page-btn"
          >
            ‹
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button 
              key={i} 
              className={`ad-page-btn ${pagination.currentPage === i+1 ? "ad-page-active" : ""}`} 
              onClick={() => handlePageChange(i+1)}
            >
              {i+1}
            </button>
          ))}
          <button 
            disabled={pagination.currentPage === pagination.totalPages} 
            onClick={() => handlePageChange(pagination.currentPage + 1)} 
            className="ad-page-btn"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
