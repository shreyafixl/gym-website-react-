import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardService from '../services/superadmin/DashboardService';
import {
  FaHome,
  FaSync,
  FaExclamationCircle,
  FaCheckCircle,
  FaUsers,
  FaMoneyBillWave,
  FaBuilding,
  FaChartBar,
  FaSpinner,
} from 'react-icons/fa';
import '../superadmin-dashboard.css';

/**
 * Dashboard Overview Page
 * Displays real-time system statistics from backend
 */
const DashboardOverviewPage = () => {
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Check authentication
  if (!isLoggedIn || user?.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  // Fetch dashboard overview data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await DashboardService.getOverview();
      setDashboardData(response.data || response);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to load dashboard data';
      setError(errorMessage);
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh dashboard data
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await DashboardService.getOverview();
      setDashboardData(response.data || response);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error refreshing dashboard:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to refresh dashboard data';
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Retry on error
  const handleRetry = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  // Load data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Format time
  const formatTime = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleTimeString();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="sa-page">
        <div className="sa-loading-container">
          <FaSpinner className="sa-spinner-icon" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !dashboardData) {
    return (
      <div className="sa-page">
        <div className="sa-error-container">
          <FaExclamationCircle className="sa-error-icon" />
          <h3>Failed to Load Dashboard</h3>
          <p>{error}</p>
          <button onClick={handleRetry} className="sa-btn sa-btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Extract statistics from response
  const stats = dashboardData?.statistics || dashboardData || {};
  const totalUsers = stats.totalUsers || stats.total_users || 0;
  const activeMembers = stats.activeMembers || stats.active_members || 0;
  const totalRevenue = stats.totalRevenue || stats.total_revenue || 0;
  const totalBranches = stats.totalBranches || stats.total_branches || 0;

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div className="sa-page-title">
          <FaHome className="sa-page-icon" />
          <h1>Dashboard Overview</h1>
        </div>
        <div className="sa-page-actions">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="sa-btn sa-btn-secondary"
            title="Refresh dashboard data"
          >
            <FaSync className={refreshing ? 'sa-spinning' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && dashboardData && (
        <div className="sa-alert sa-alert-warning">
          <FaExclamationCircle />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="sa-alert-close">×</button>
        </div>
      )}

      <div className="sa-last-refresh">
        Last updated: {formatTime(lastRefresh)}
      </div>

      {/* KPI Cards */}
      <div className="sa-kpi-grid">
        <div className="sa-kpi-card">
          <div className="sa-kpi-icon" style={{ background: '#3b82f622' }}>
            <FaUsers style={{ color: '#3b82f6' }} />
          </div>
          <div className="sa-kpi-content">
            <div className="sa-kpi-value">{totalUsers}</div>
            <div className="sa-kpi-label">Total Users</div>
            <div className="sa-kpi-change">All system users</div>
          </div>
        </div>

        <div className="sa-kpi-card">
          <div className="sa-kpi-icon" style={{ background: '#10b98122' }}>
            <FaCheckCircle style={{ color: '#10b981' }} />
          </div>
          <div className="sa-kpi-content">
            <div className="sa-kpi-value">{activeMembers}</div>
            <div className="sa-kpi-label">Active Members</div>
            <div className="sa-kpi-change">Currently active</div>
          </div>
        </div>

        <div className="sa-kpi-card">
          <div className="sa-kpi-icon" style={{ background: '#f5970b22' }}>
            <FaMoneyBillWave style={{ color: '#f59e0b' }} />
          </div>
          <div className="sa-kpi-content">
            <div className="sa-kpi-value">${(totalRevenue / 1000).toFixed(1)}k</div>
            <div className="sa-kpi-label">Total Revenue</div>
            <div className="sa-kpi-change">All time</div>
          </div>
        </div>

        <div className="sa-kpi-card">
          <div className="sa-kpi-icon" style={{ background: '#8b5cf622' }}>
            <FaBuilding style={{ color: '#8b5cf6' }} />
          </div>
          <div className="sa-kpi-content">
            <div className="sa-kpi-value">{totalBranches}</div>
            <div className="sa-kpi-label">Total Branches</div>
            <div className="sa-kpi-change">Active locations</div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      {stats.additionalStats && (
        <div className="sa-stats-section">
          <h2>Additional Statistics</h2>
          <div className="sa-stats-grid">
            {Object.entries(stats.additionalStats).map(([key, value]) => (
              <div key={key} className="sa-stat-item">
                <span className="sa-stat-label">{key}</span>
                <span className="sa-stat-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="sa-system-status">
        <h2>System Status</h2>
        <div className="sa-status-items">
          <div className="sa-status-item">
            <FaCheckCircle style={{ color: '#10b981' }} />
            <span>All Systems Operational</span>
          </div>
          <div className="sa-status-item">
            <FaCheckCircle style={{ color: '#10b981' }} />
            <span>Database Connected</span>
          </div>
          <div className="sa-status-item">
            <FaCheckCircle style={{ color: '#10b981' }} />
            <span>API Responding</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
