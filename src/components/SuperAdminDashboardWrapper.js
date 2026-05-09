import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSuperAdmin } from '../contexts/SuperAdminContext';
import SuperAdminDashboardPage from '../pages/SuperAdminDashboardPage';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';

/**
 * Super Admin Dashboard Wrapper
 * Integrates the dashboard with real backend data
 */
const SuperAdminDashboardWrapper = () => {
  const { user, isLoggedIn } = useAuth();
  const {
    fetchDashboard,
    fetchUsers,
    fetchBranches,
    fetchTrainers,
    fetchMemberships,
    fetchWorkouts,
    fetchAttendance,
    fetchNotifications,
    fetchCampaigns,
    fetchReports,
    fetchSettings,
    dashboardLoading,
    dashboardError,
  } = useSuperAdmin();

  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        setInitialError(null);

        // Load all initial data in parallel
        await Promise.all([
          fetchDashboard(),
          fetchUsers(1, 10),
          fetchBranches(1, 10),
          fetchTrainers(1, 10),
          fetchMemberships(1, 10),
          fetchWorkouts(1, 10),
          fetchAttendance(1, 10),
          fetchNotifications(1, 10),
          fetchCampaigns(1, 10),
          fetchSettings(),
        ]);
      } catch (error) {
        setInitialError(error.message || 'Failed to load dashboard data');
      } finally {
        setInitialLoading(false);
      }
    };

    if (isLoggedIn && user?.role === 'superadmin') {
      loadInitialData();
    }
  }, [isLoggedIn, user, fetchDashboard, fetchUsers, fetchBranches, fetchTrainers, fetchMemberships, fetchWorkouts, fetchAttendance, fetchNotifications, fetchCampaigns, fetchSettings]);

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  if (initialError) {
    return <ErrorAlert message={initialError} />;
  }

  return <SuperAdminDashboardPage />;
};

export default SuperAdminDashboardWrapper;
