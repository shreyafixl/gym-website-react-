import React, { useEffect, useState } from 'react';
import { FaUsers, FaBuilding, FaHeartbeat, FaMoneyBillWave, FaSync } from 'react-icons/fa';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import LoadingSpinner from '../LoadingSpinner';
import ErrorAlert from '../ErrorAlert';
import { formatCurrency, formatNumber } from '../../utils/apiUtils';

const DashboardOverviewModule = () => {
  const {
    dashboardData,
    dashboardLoading,
    dashboardError,
    fetchDashboard,
  } = useSuperAdmin();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDashboard();
    } finally {
      setRefreshing(false);
    }
  };

  if (dashboardLoading) return <LoadingSpinner />;

  const stats = dashboardData?.stats || {
    totalMembers: 0,
    activeMemberships: 0,
    totalBranches: 0,
    totalTrainers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    attendanceRate: 0,
    memberGrowth: 0,
  };

  const statCards = [
    {
      icon: <FaUsers />,
      label: 'Total Members',
      value: formatNumber(stats.totalMembers),
      color: '#3b82f6',
      trend: `${stats.memberGrowth}% growth`,
    },
    {
      icon: <FaHeartbeat />,
      label: 'Active Memberships',
      value: formatNumber(stats.activeMemberships),
      color: '#10b981',
      trend: 'This month',
    },
    {
      icon: <FaBuilding />,
      label: 'Total Branches',
      value: formatNumber(stats.totalBranches),
      color: '#f59e0b',
      trend: 'Across network',
    },
    {
      icon: <FaMoneyBillWave />,
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      color: '#8b5cf6',
      trend: `Monthly: ${formatCurrency(stats.monthlyRevenue)}`,
    },
  ];

  return (
    <div className="dashboard-overview">
      {dashboardError && <ErrorAlert message={dashboardError} />}

      <div className="overview-header">
        <h2>Dashboard Overview</h2>
        <button
          className="btn btn-secondary"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <FaSync /> {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-trend">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {dashboardData?.charts && (
        <div className="charts-section">
          <div className="chart-container">
            <h3>Member Growth</h3>
            {dashboardData.charts.memberGrowth && (
              <div className="chart-placeholder">
                {/* Chart component would go here */}
                <p>Member growth chart data available</p>
              </div>
            )}
          </div>

          <div className="chart-container">
            <h3>Revenue Trend</h3>
            {dashboardData.charts.revenue && (
              <div className="chart-placeholder">
                {/* Chart component would go here */}
                <p>Revenue trend chart data available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {dashboardData?.recentActivity && (
        <div className="activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {dashboardData.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="activity-item">
                <p className="activity-description">{activity.description}</p>
                <p className="activity-time">{activity.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverviewModule;
