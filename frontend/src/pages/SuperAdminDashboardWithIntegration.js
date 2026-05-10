import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SuperAdminProvider } from '../contexts/SuperAdminContext';
import ProtectedSuperAdminRoute from '../components/ProtectedSuperAdminRoute';
import {
  DashboardOverviewModule,
  UserManagementModule,
  BranchManagementModule,
  MembershipManagementModule,
  TrainerManagementModule,
  AttendanceManagementModule,
} from '../components/SuperAdminModules';
import { FaHome, FaUsers, FaBuilding, FaTags, FaHeartbeat, FaUserClock, FaSignOutAlt } from 'react-icons/fa';
import '../superadmin-dashboard.css';

/**
 * Super Admin Dashboard with Full Backend Integration
 * All modules connected to real APIs
 */
const SuperAdminDashboardWithIntegration = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState('overview');

  const modules = [
    { id: 'overview', label: 'Dashboard', icon: <FaHome />, component: DashboardOverviewModule },
    { id: 'users', label: 'Users', icon: <FaUsers />, component: UserManagementModule },
    { id: 'branches', label: 'Branches', icon: <FaBuilding />, component: BranchManagementModule },
    { id: 'trainers', label: 'Trainers', icon: <FaHeartbeat />, component: TrainerManagementModule },
    { id: 'memberships', label: 'Memberships', icon: <FaTags />, component: MembershipManagementModule },
    { id: 'attendance', label: 'Attendance', icon: <FaUserClock />, component: AttendanceManagementModule },
  ];

  const ActiveModule = modules.find((m) => m.id === activeModule)?.component;

  return (
    <ProtectedSuperAdminRoute>
      <SuperAdminProvider>
        <div className="super-admin-dashboard">
          <aside className="sidebar">
            <div className="sidebar-header">
              <h1>FitZone Admin</h1>
              <p>Super Admin Panel</p>
            </div>

            <nav className="sidebar-nav">
              {modules.map((module) => (
                <button
                  key={module.id}
                  className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
                  onClick={() => setActiveModule(module.id)}
                >
                  {module.icon}
                  <span>{module.label}</span>
                </button>
              ))}
            </nav>

            <div className="sidebar-footer">
              <div className="user-info">
                <p className="user-name">{user?.name || 'Admin'}</p>
                <p className="user-role">{user?.role || 'Super Admin'}</p>
              </div>
              <button className="btn btn-logout" onClick={logout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </aside>

          <main className="main-content">
            <header className="dashboard-header">
              <h2>{modules.find((m) => m.id === activeModule)?.label}</h2>
              <div className="header-actions">
                <p className="timestamp">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </header>

            <div className="module-wrapper">
              {ActiveModule ? <ActiveModule /> : <div>Module not found</div>}
            </div>
          </main>
        </div>
      </SuperAdminProvider>
    </ProtectedSuperAdminRoute>
  );
};

export default SuperAdminDashboardWithIntegration;
