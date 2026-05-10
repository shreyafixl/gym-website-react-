import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import {
  FaHome,
  FaUsers,
  FaCodeBranch,
  FaSync,
  FaExclamationCircle,
  FaChartBar,
  FaMoneyBillWave,
  FaUserTie,
  FaBuilding,
} from 'react-icons/fa';
import '../superadmin-dashboard.css';

/**
 * Super Admin Dashboard - Integrated with Backend APIs
 * Displays real data from MongoDB collections
 */
const SuperAdminDashboardIntegrated = () => {
  const { user, isLoggedIn } = useAuth();
  const [activeModule, setActiveModule] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);

  // Check authentication
  if (!isLoggedIn || user?.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  // Fetch dashboard overview data
  const fetchOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/superadmin/analytics/dashboard');
      setDashboardData(response.data?.data || response.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/superadmin/users?page=1&limit=10');
      setUsers(response.data?.data?.users || response.data?.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch branches
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/superadmin/branches?page=1&limit=10');
      setBranches(response.data?.data?.branches || response.data?.data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when module changes
  useEffect(() => {
    if (activeModule === 'overview') {
      fetchOverview();
    } else if (activeModule === 'users') {
      fetchUsers();
    } else if (activeModule === 'branches') {
      fetchBranches();
    }
  }, [activeModule]);

  // Render Overview
  const renderOverview = () => {
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    const stats = [];
    if (dashboardData?.overview) {
      stats.push(
        { label: 'Total Members', value: dashboardData.overview.totalMembers || 0, icon: '👥', color: '#3b82f6' },
        { label: 'Active Members', value: dashboardData.overview.activeMembers || 0, icon: '✅', color: '#10b981' },
        { label: 'Total Trainers', value: dashboardData.overview.totalTrainers || 0, icon: '🏋️', color: '#f97316' },
        { label: 'Total Branches', value: dashboardData.overview.totalBranches || 0, icon: '🏢', color: '#8b5cf6' }
      );
    }

    if (dashboardData?.revenue) {
      stats.push(
        { label: 'Total Revenue', value: `₹${(dashboardData.revenue.total || 0).toLocaleString()}`, icon: '💰', color: '#f59e0b' },
        { label: 'Transactions', value: dashboardData.revenue.transactions || 0, icon: '📊', color: '#ec4899' }
      );
    }

    return (
      <div className="sa-module">
        <div className="sa-module-header">
          <h2>Dashboard Overview</h2>
          <button onClick={fetchOverview} className="sa-btn-icon" title="Refresh">
            <FaSync />
          </button>
        </div>

        <div className="sa-stats-grid">
          {stats.length > 0 ? (
            stats.map((stat, idx) => (
              <div key={idx} className="sa-stat-card" style={{ borderLeftColor: stat.color }}>
                <div className="sa-stat-icon">{stat.icon}</div>
                <div className="sa-stat-content">
                  <h3>{stat.label}</h3>
                  <p className="sa-stat-value">{stat.value}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="sa-empty">No data available</p>
          )}
        </div>
      </div>
    );
  };

  // Render Users
  const renderUsers = () => {
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
      <div className="sa-module">
        <div className="sa-module-header">
          <h2>User Management</h2>
          <button onClick={fetchUsers} className="sa-btn-icon" title="Refresh">
            <FaSync />
          </button>
        </div>

        <div className="sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>{u.fullName || u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="sa-badge">{u.role}</span></td>
                    <td>{u.phone || '-'}</td>
                    <td><span className={`sa-status sa-status-${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="sa-empty">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Branches
  const renderBranches = () => {
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
      <div className="sa-module">
        <div className="sa-module-header">
          <h2>Branch Management</h2>
          <button onClick={fetchBranches} className="sa-btn-icon" title="Refresh">
            <FaSync />
          </button>
        </div>

        <div className="sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>City</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {branches.length > 0 ? (
                branches.map((b) => (
                  <tr key={b._id || b.id}>
                    <td>{b.branchName || b.name}</td>
                    <td>{b.city}</td>
                    <td>{b.contactNumber || b.phone || '-'}</td>
                    <td><span className={`sa-status sa-status-${b.isActive ? 'active' : 'inactive'}`}>{b.isActive ? 'Active' : 'Inactive'}</span></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="sa-empty">No branches found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="sa-dashboard">
      <div className="sa-container">
        {/* Sidebar */}
        <aside className="sa-sidebar">
          <div className="sa-sidebar-header">
            <h2>Super Admin</h2>
          </div>

          <nav className="sa-sidebar-nav">
            <button
              className={`sa-nav-item ${activeModule === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveModule('overview')}
            >
              <FaHome /> Dashboard
            </button>
            <button
              className={`sa-nav-item ${activeModule === 'users' ? 'active' : ''}`}
              onClick={() => setActiveModule('users')}
            >
              <FaUsers /> Users
            </button>
            <button
              className={`sa-nav-item ${activeModule === 'branches' ? 'active' : ''}`}
              onClick={() => setActiveModule('branches')}
            >
              <FaCodeBranch /> Branches
            </button>
          </nav>

          <div className="sa-sidebar-footer">
            <p>Logged in as: <strong>{user?.name}</strong></p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="sa-content">
          {activeModule === 'overview' && renderOverview()}
          {activeModule === 'users' && renderUsers()}
          {activeModule === 'branches' && renderBranches()}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboardIntegrated;
