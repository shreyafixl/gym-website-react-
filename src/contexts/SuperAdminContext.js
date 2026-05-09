import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  dashboardAPI,
  userAPI,
  branchAPI,
  trainerAPI,
  membershipAPI,
  workoutAPI,
  attendanceAPI,
  communicationAPI,
  reportsAPI,
  settingsAPI,
  supportAPI,
} from '../services/superAdminAPI';

/**
 * Super Admin Context
 * Manages state and API calls for Super Admin Dashboard
 */
const SuperAdminContext = createContext(null);

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within SuperAdminProvider');
  }
  return context;
};

export const SuperAdminProvider = ({ children }) => {
  // Dashboard state
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [usersPagination, setUsersPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Branches state
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState(null);
  const [branchesPagination, setBranchesPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Trainers state
  const [trainers, setTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [trainersError, setTrainersError] = useState(null);
  const [trainersPagination, setTrainersPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Memberships state
  const [memberships, setMemberships] = useState([]);
  const [membershipsLoading, setMembershipsLoading] = useState(false);
  const [membershipsError, setMembershipsError] = useState(null);
  const [membershipsPagination, setMembershipsPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Workouts state
  const [workouts, setWorkouts] = useState([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [workoutsError, setWorkoutsError] = useState(null);

  // Attendance state
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState(null);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  // Campaigns state
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [campaignsError, setCampaignsError] = useState(null);

  // Reports state
  const [reports, setReports] = useState(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState(null);

  // Settings state
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState(null);

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    try {
      setDashboardLoading(true);
      setDashboardError(null);
      const response = await dashboardAPI.getOverview();
      setDashboardData(response.data || response);
    } catch (error) {
      setDashboardError(error.response?.data?.message || error.message || 'Failed to fetch dashboard');
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setUsersLoading(true);
      setUsersError(null);
      const response = await userAPI.getAllUsers(page, limit, filters);
      const data = response.data || response;
      setUsers(data.data || data.users || []);
      setUsersPagination({
        page: data.pagination?.current_page || page,
        limit: data.pagination?.per_page || limit,
        total: data.pagination?.total_count || data.total || 0,
      });
    } catch (error) {
      setUsersError(error.response?.data?.message || error.message || 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Fetch branches
  const fetchBranches = useCallback(async (page = 1, limit = 10) => {
    try {
      setBranchesLoading(true);
      setBranchesError(null);
      const response = await branchAPI.getAllBranches(page, limit);
      const data = response.data || response;
      setBranches(data.data || data.branches || []);
      setBranchesPagination({
        page: data.pagination?.current_page || page,
        limit: data.pagination?.per_page || limit,
        total: data.pagination?.total_count || data.total || 0,
      });
    } catch (error) {
      setBranchesError(error.response?.data?.message || error.message || 'Failed to fetch branches');
    } finally {
      setBranchesLoading(false);
    }
  }, []);

  // Fetch trainers
  const fetchTrainers = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setTrainersLoading(true);
      setTrainersError(null);
      const response = await trainerAPI.getAllTrainers(page, limit, filters);
      const data = response.data || response;
      setTrainers(data.data || data.trainers || []);
      setTrainersPagination({
        page: data.pagination?.current_page || page,
        limit: data.pagination?.per_page || limit,
        total: data.pagination?.total_count || data.total || 0,
      });
    } catch (error) {
      setTrainersError(error.response?.data?.message || error.message || 'Failed to fetch trainers');
    } finally {
      setTrainersLoading(false);
    }
  }, []);

  // Fetch memberships
  const fetchMemberships = useCallback(async (page = 1, limit = 10) => {
    try {
      setMembershipsLoading(true);
      setMembershipsError(null);
      const response = await membershipAPI.getAllMemberships(page, limit);
      const data = response.data || response;
      setMemberships(data.data || data.memberships || []);
      setMembershipsPagination({
        page: data.pagination?.current_page || page,
        limit: data.pagination?.per_page || limit,
        total: data.pagination?.total_count || data.total || 0,
      });
    } catch (error) {
      setMembershipsError(error.response?.data?.message || error.message || 'Failed to fetch memberships');
    } finally {
      setMembershipsLoading(false);
    }
  }, []);

  // Fetch workouts
  const fetchWorkouts = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setWorkoutsLoading(true);
      setWorkoutsError(null);
      const response = await workoutAPI.getAllWorkouts(page, limit, filters);
      const data = response.data || response;
      setWorkouts(data.data || data.workouts || []);
    } catch (error) {
      setWorkoutsError(error.response?.data?.message || error.message || 'Failed to fetch workouts');
    } finally {
      setWorkoutsLoading(false);
    }
  }, []);

  // Fetch attendance
  const fetchAttendance = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setAttendanceLoading(true);
      setAttendanceError(null);
      const response = await attendanceAPI.getAllAttendance(page, limit, filters);
      const data = response.data || response;
      setAttendance(data.data || data.attendance || []);
    } catch (error) {
      setAttendanceError(error.response?.data?.message || error.message || 'Failed to fetch attendance');
    } finally {
      setAttendanceLoading(false);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 10) => {
    try {
      setNotificationsLoading(true);
      setNotificationsError(null);
      const response = await communicationAPI.getAllNotifications(page, limit);
      const data = response.data || response;
      setNotifications(data.data || data.notifications || []);
    } catch (error) {
      setNotificationsError(error.response?.data?.message || error.message || 'Failed to fetch notifications');
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  // Fetch campaigns
  const fetchCampaigns = useCallback(async (page = 1, limit = 10) => {
    try {
      setCampaignsLoading(true);
      setCampaignsError(null);
      const response = await communicationAPI.getAllCampaigns(page, limit);
      const data = response.data || response;
      setCampaigns(data.data || data.campaigns || []);
    } catch (error) {
      setCampaignsError(error.response?.data?.message || error.message || 'Failed to fetch campaigns');
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  // Fetch reports
  const fetchReports = useCallback(async (reportType = 'financial', period = 'monthly') => {
    try {
      setReportsLoading(true);
      setReportsError(null);
      let response;
      switch (reportType) {
        case 'financial':
          response = await reportsAPI.getFinancialReports(period);
          break;
        case 'members':
          response = await reportsAPI.getMemberAnalytics(period);
          break;
        case 'attendance':
          response = await reportsAPI.getAttendanceReports(period);
          break;
        case 'revenue':
          response = await reportsAPI.getRevenueReports(period);
          break;
        default:
          response = await reportsAPI.getFinancialReports(period);
      }
      setReports(response.data || response);
    } catch (error) {
      setReportsError(error.response?.data?.message || error.message || 'Failed to fetch reports');
    } finally {
      setReportsLoading(false);
    }
  }, []);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    try {
      setSettingsLoading(true);
      setSettingsError(null);
      const response = await settingsAPI.getSettings();
      setSettings(response.data || response);
    } catch (error) {
      setSettingsError(error.response?.data?.message || error.message || 'Failed to fetch settings');
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  // Create user
  const createUser = useCallback(async (userData) => {
    try {
      const response = await userAPI.createUser(userData);
      await fetchUsers(usersPagination.page, usersPagination.limit);
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchUsers, usersPagination]);

  // Update user
  const updateUser = useCallback(async (userId, userData) => {
    try {
      const response = await userAPI.updateUser(userId, userData);
      await fetchUsers(usersPagination.page, usersPagination.limit);
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchUsers, usersPagination]);

  // Delete user
  const deleteUser = useCallback(async (userId) => {
    try {
      const response = await userAPI.deleteUser(userId);
      await fetchUsers(usersPagination.page, usersPagination.limit);
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchUsers, usersPagination]);

  // Create branch
  const createBranch = useCallback(async (branchData) => {
    try {
      const response = await branchAPI.createBranch(branchData);
      await fetchBranches(branchesPagination.page, branchesPagination.limit);
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchBranches, branchesPagination]);

  // Update branch
  const updateBranch = useCallback(async (branchId, branchData) => {
    try {
      const response = await branchAPI.updateBranch(branchId, branchData);
      await fetchBranches(branchesPagination.page, branchesPagination.limit);
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchBranches, branchesPagination]);

  // Delete branch
  const deleteBranch = useCallback(async (branchId) => {
    try {
      const response = await branchAPI.deleteBranch(branchId);
      await fetchBranches(branchesPagination.page, branchesPagination.limit);
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchBranches, branchesPagination]);

  // Create trainer
  const createTrainer = useCallback(async (trainerData) => {
    try {
      const response = await trainerAPI.createTrainer(trainerData);
      await fetchTrainers(trainersPagination.page, trainersPagination.limit);
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchTrainers, trainersPagination]);

  // Update trainer
  const updateTrainer = useCallback(async (trainerId, trainerData) => {
    try {
      const response = await trainerAPI.updateTrainer(trainerId, trainerData);
      await fetchTrainers(trainersPagination.page, trainersPagination.limit);
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchTrainers, trainersPagination]);

  // Delete trainer
  const deleteTrainer = useCallback(async (trainerId) => {
    try {
      const response = await trainerAPI.deleteTrainer(trainerId);
      await fetchTrainers(trainersPagination.page, trainersPagination.limit);
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchTrainers, trainersPagination]);

  // Send notification
  const sendNotification = useCallback(async (notificationData) => {
    try {
      const response = await communicationAPI.sendNotification(notificationData);
      await fetchNotifications();
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchNotifications]);

  // Create campaign
  const createCampaign = useCallback(async (campaignData) => {
    try {
      const response = await communicationAPI.createCampaign(campaignData);
      await fetchCampaigns();
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchCampaigns]);

  // Update settings
  const updateSettings = useCallback(async (settingsData) => {
    try {
      const response = await settingsAPI.updateSettings(settingsData);
      await fetchSettings();
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchSettings]);

  const value = {
    // Dashboard
    dashboardData,
    dashboardLoading,
    dashboardError,
    fetchDashboard,

    // Users
    users,
    usersLoading,
    usersError,
    usersPagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,

    // Branches
    branches,
    branchesLoading,
    branchesError,
    branchesPagination,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,

    // Trainers
    trainers,
    trainersLoading,
    trainersError,
    trainersPagination,
    fetchTrainers,
    createTrainer,
    updateTrainer,
    deleteTrainer,

    // Memberships
    memberships,
    membershipsLoading,
    membershipsError,
    membershipsPagination,
    fetchMemberships,

    // Workouts
    workouts,
    workoutsLoading,
    workoutsError,
    fetchWorkouts,

    // Attendance
    attendance,
    attendanceLoading,
    attendanceError,
    fetchAttendance,

    // Notifications
    notifications,
    notificationsLoading,
    notificationsError,
    fetchNotifications,

    // Campaigns
    campaigns,
    campaignsLoading,
    campaignsError,
    fetchCampaigns,

    // Reports
    reports,
    reportsLoading,
    reportsError,
    fetchReports,

    // Settings
    settings,
    settingsLoading,
    settingsError,
    fetchSettings,
    updateSettings,

    // Communication
    sendNotification,
    createCampaign,
  };

  return (
    <SuperAdminContext.Provider value={value}>
      {children}
    </SuperAdminContext.Provider>
  );
};

export default SuperAdminContext;
