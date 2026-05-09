import api from './api';

/**
 * Super Admin Service
 * Handles all API calls for Super Admin Dashboard
 */

export const superAdminService = {
  // ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────
  getOverview: async (startDate, endDate) => {
    try {
      const response = await api.get('/superadmin/analytics/dashboard', {
        params: { startDate, endDate },
      });
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error fetching overview:', error);
      throw error;
    }
  },

  // ─── USERS ────────────────────────────────────────────────────────────────
  getUsers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/superadmin/users', {
        params: { page, limit, ...filters },
      });
      return response.data.success ? response.data.data : { users: [], total: 0 };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/superadmin/users', userData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/superadmin/users/${userId}`, userData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/superadmin/users/${userId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // ─── BRANCHES ─────────────────────────────────────────────────────────────
  getBranches: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/superadmin/branches', {
        params: { page, limit },
      });
      return response.data.success ? response.data.data : { branches: [], total: 0 };
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  createBranch: async (branchData) => {
    try {
      const response = await api.post('/superadmin/branches', branchData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  },

  updateBranch: async (branchId, branchData) => {
    try {
      const response = await api.put(`/superadmin/branches/${branchId}`, branchData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  },

  deleteBranch: async (branchId) => {
    try {
      const response = await api.delete(`/superadmin/branches/${branchId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  },

  // ─── TRAINERS ─────────────────────────────────────────────────────────────
  getTrainers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/superadmin/trainers', {
        params: { page, limit, ...filters },
      });
      return response.data.success ? response.data.data : { trainers: [], total: 0 };
    } catch (error) {
      console.error('Error fetching trainers:', error);
      throw error;
    }
  },

  createTrainer: async (trainerData) => {
    try {
      const response = await api.post('/superadmin/trainers', trainerData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error creating trainer:', error);
      throw error;
    }
  },

  updateTrainer: async (trainerId, trainerData) => {
    try {
      const response = await api.put(`/superadmin/trainers/${trainerId}`, trainerData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating trainer:', error);
      throw error;
    }
  },

  deleteTrainer: async (trainerId) => {
    try {
      const response = await api.delete(`/superadmin/trainers/${trainerId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting trainer:', error);
      throw error;
    }
  },

  // ─── MEMBERSHIPS ──────────────────────────────────────────────────────────
  getMemberships: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/superadmin/memberships', {
        params: { page, limit },
      });
      return response.data.success ? response.data.data : { memberships: [], total: 0 };
    } catch (error) {
      console.error('Error fetching memberships:', error);
      throw error;
    }
  },

  createMembership: async (membershipData) => {
    try {
      const response = await api.post('/superadmin/memberships', membershipData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error creating membership:', error);
      throw error;
    }
  },

  updateMembership: async (membershipId, membershipData) => {
    try {
      const response = await api.put(`/superadmin/memberships/${membershipId}`, membershipData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating membership:', error);
      throw error;
    }
  },

  deleteMembership: async (membershipId) => {
    try {
      const response = await api.delete(`/superadmin/memberships/${membershipId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting membership:', error);
      throw error;
    }
  },

  // ─── MEMBERSHIP PLANS ──────────────────────────────────────────────────────
  getMembershipPlans: async () => {
    try {
      const response = await api.get('/superadmin/membership-plans');
      return response.data.success ? response.data.data : { plans: [] };
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      throw error;
    }
  },

  createMembershipPlan: async (planData) => {
    try {
      const response = await api.post('/superadmin/membership-plans', planData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error creating membership plan:', error);
      throw error;
    }
  },

  updateMembershipPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/superadmin/membership-plans/${planId}`, planData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating membership plan:', error);
      throw error;
    }
  },

  deleteMembershipPlan: async (planId) => {
    try {
      const response = await api.delete(`/superadmin/membership-plans/${planId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting membership plan:', error);
      throw error;
    }
  },

  // ─── WORKOUTS ─────────────────────────────────────────────────────────────
  getWorkouts: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/superadmin/workouts', {
        params: { page, limit, ...filters },
      });
      return response.data.success ? response.data.data : { workouts: [], total: 0 };
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw error;
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const response = await api.post('/superadmin/workouts', workoutData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  },

  updateWorkout: async (workoutId, workoutData) => {
    try {
      const response = await api.put(`/superadmin/workouts/${workoutId}`, workoutData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  },

  deleteWorkout: async (workoutId) => {
    try {
      const response = await api.delete(`/superadmin/workouts/${workoutId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },

  // ─── ATTENDANCE ────────────────────────────────────────────────────────────
  getAttendance: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/superadmin/attendance', {
        params: { page, limit, ...filters },
      });
      return response.data.success ? response.data.data : { attendance: [], total: 0 };
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  // ─── FINANCIAL REPORTS ────────────────────────────────────────────────────
  getFinancialReports: async (period = 'monthly') => {
    try {
      const response = await api.get('/superadmin/financial', {
        params: { period },
      });
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error fetching financial reports:', error);
      throw error;
    }
  },

  // ─── ANALYTICS ─────────────────────────────────────────────────────────────
  getAnalytics: async (type = 'overview', startDate, endDate) => {
    try {
      const response = await api.get('/superadmin/analytics', {
        params: { type, startDate, endDate },
      });
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────
  getNotifications: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/superadmin/communication/notifications', {
        params: { page, limit },
      });
      return response.data.success ? response.data.data : { notifications: [], total: 0 };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  sendNotification: async (notificationData) => {
    try {
      const response = await api.post('/superadmin/communication/notifications', notificationData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },

  // ─── CAMPAIGNS ─────────────────────────────────────────────────────────────
  getCampaigns: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/superadmin/communication/campaigns', {
        params: { page, limit },
      });
      return response.data.success ? response.data.data : { campaigns: [], total: 0 };
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/superadmin/communication/campaigns', campaignData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  updateCampaign: async (campaignId, campaignData) => {
    try {
      const response = await api.put(`/superadmin/communication/campaigns/${campaignId}`, campaignData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  },

  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(`/superadmin/communication/campaigns/${campaignId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  },

  // ─── SUPPORT TICKETS ──────────────────────────────────────────────────────
  getSupportTickets: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/superadmin/support/tickets', {
        params: { page, limit, ...filters },
      });
      return response.data.success ? response.data.data : { tickets: [], total: 0 };
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      throw error;
    }
  },

  updateTicket: async (ticketId, ticketData) => {
    try {
      const response = await api.put(`/superadmin/support/tickets/${ticketId}`, ticketData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // ─── SETTINGS ──────────────────────────────────────────────────────────────
  getSettings: async () => {
    try {
      const response = await api.get('/superadmin/settings');
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/superadmin/settings', settingsData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // ─── AUDIT LOGS ────────────────────────────────────────────────────────────
  getAuditLogs: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/superadmin/settings/audit-logs', {
        params: { page, limit },
      });
      return response.data.success ? response.data.data : { logs: [], total: 0 };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  // ─── LOGIN HISTORY ────────────────────────────────────────────────────────
  getLoginHistory: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/superadmin/settings/login-history', {
        params: { page, limit },
      });
      return response.data.success ? response.data.data : { history: [], total: 0 };
    } catch (error) {
      console.error('Error fetching login history:', error);
      throw error;
    }
  },
};

export default superAdminService;
