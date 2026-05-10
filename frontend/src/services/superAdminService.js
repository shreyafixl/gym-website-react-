import api from './api';

/**
 * Super Admin Service
 * Handles all API calls for Super Admin Dashboard
 */

export const superAdminService = {
  // ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────
  getOverview: async (startDate, endDate) => {
    try {
      const token = localStorage.getItem('gym-auth-token');
      console.log('📊 [superAdminService] getOverview called:', {
        hasToken: !!token,
        endpoint: '/superadmin/analytics/dashboard',
        storageKey: 'gym-auth-token',
      });
      
      const response = await api.get('/superadmin/analytics/dashboard', {
        params: { startDate, endDate },
      });
      
      console.log('✅ [superAdminService] getOverview response:', {
        success: response.data.success,
        status: response.status,
        hasData: !!response.data.data,
        dataKeys: response.data.data ? Object.keys(response.data.data) : [],
      });
      
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] getOverview error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        isNetworkError: !error.response,
        endpoint: '/superadmin/analytics/dashboard',
      });

      // Network error
      if (!error.response) {
        console.error('❌ [superAdminService] Network Error in getOverview:', error.message);
        throw new Error('Network error - Cannot reach server');
      }

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
      const response = await api.get('/trainers', {
        params: { page, limit, ...filters },
      });
      return response.data.success ? response.data.data : { trainers: [], total: 0 };
    } catch (error) {
      console.error('❌ [superAdminService] Error fetching trainers:', error.message);
      throw error;
    }
  },

  createTrainer: async (trainerData) => {
    try {
      const response = await api.post('/trainers', trainerData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error creating trainer:', error.message);
      throw error;
    }
  },

  updateTrainer: async (trainerId, trainerData) => {
    try {
      const response = await api.put(`/trainers/${trainerId}`, trainerData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error updating trainer:', error.message);
      throw error;
    }
  },

  deleteTrainer: async (trainerId) => {
    try {
      const response = await api.delete(`/trainers/${trainerId}`);
      return response.data.success;
    } catch (error) {
      console.error('❌ [superAdminService] Error deleting trainer:', error.message);
      throw error;
    }
  },

  // ─── MEMBERSHIPS ──────────────────────────────────────────────────────────
  getMemberships: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/memberships', {
        params: { page, limit },
      });
      return response.data.success ? response.data.data : { memberships: [], total: 0 };
    } catch (error) {
      console.error('❌ [superAdminService] Error fetching memberships:', error.message);
      throw error;
    }
  },

  createMembership: async (membershipData) => {
    try {
      const response = await api.post('/memberships', membershipData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error creating membership:', error.message);
      throw error;
    }
  },

  updateMembership: async (membershipId, membershipData) => {
    try {
      const response = await api.put(`/memberships/${membershipId}`, membershipData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error updating membership:', error.message);
      throw error;
    }
  },

  deleteMembership: async (membershipId) => {
    try {
      const response = await api.delete(`/memberships/${membershipId}`);
      return response.data.success;
    } catch (error) {
      console.error('❌ [superAdminService] Error deleting membership:', error.message);
      throw error;
    }
  },

  // ─── MEMBERSHIP PLANS ──────────────────────────────────────────────────────
  getMembershipPlans: async () => {
    try {
      const response = await api.get('/membership-plans');
      return response.data.success ? response.data.data : { plans: [] };
    } catch (error) {
      console.error('❌ [superAdminService] Error fetching membership plans:', error.message);
      // Return empty array instead of throwing to prevent dashboard crash
      return { plans: [] };
    }
  },

  createMembershipPlan: async (planData) => {
    try {
      const response = await api.post('/membership-plans', planData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error creating membership plan:', error.message);
      throw error;
    }
  },

  updateMembershipPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/membership-plans/${planId}`, planData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error updating membership plan:', error.message);
      throw error;
    }
  },

  deleteMembershipPlan: async (planId) => {
    try {
      const response = await api.delete(`/membership-plans/${planId}`);
      return response.data.success;
    } catch (error) {
      console.error('❌ [superAdminService] Error deleting membership plan:', error.message);
      throw error;
    }
  },

  // ─── WORKOUTS ─────────────────────────────────────────────────────────────
  getWorkouts: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/workouts', {
        params: { page, limit, ...filters },
      });
      return response.data.success ? response.data.data : { workouts: [], total: 0 };
    } catch (error) {
      console.error('❌ [superAdminService] Error fetching workouts:', error.message);
      throw error;
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const response = await api.post('/workouts', workoutData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error creating workout:', error.message);
      throw error;
    }
  },

  updateWorkout: async (workoutId, workoutData) => {
    try {
      const response = await api.put(`/workouts/${workoutId}`, workoutData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error updating workout:', error.message);
      throw error;
    }
  },

  deleteWorkout: async (workoutId) => {
    try {
      const response = await api.delete(`/workouts/${workoutId}`);
      return response.data.success;
    } catch (error) {
      console.error('❌ [superAdminService] Error deleting workout:', error.message);
      throw error;
    }
  },

  // ─── ATTENDANCE ────────────────────────────────────────────────────────────
  getAttendance: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/attendance', {
        params: { page, limit, ...filters },
      });
      return response.data.success ? response.data.data : { attendance: [], total: 0 };
    } catch (error) {
      console.error('❌ [superAdminService] Error fetching attendance:', error.message);
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
      // Note: Campaigns endpoint not yet implemented in backend
      // Using announcements as alternative or returning empty for now
      console.warn('⚠️  [superAdminService] Campaigns endpoint not available, returning empty data');
      return { campaigns: [], total: 0 };
    } catch (error) {
      console.error('❌ [superAdminService] Error fetching campaigns:', error.message);
      return { campaigns: [], total: 0 };
    }
  },

  createCampaign: async (campaignData) => {
    try {
      console.warn('⚠️  [superAdminService] Campaigns endpoint not available');
      return null;
    } catch (error) {
      console.error('❌ [superAdminService] Error creating campaign:', error.message);
      throw error;
    }
  },

  updateCampaign: async (campaignId, campaignData) => {
    try {
      console.warn('⚠️  [superAdminService] Campaigns endpoint not available');
      return null;
    } catch (error) {
      console.error('❌ [superAdminService] Error updating campaign:', error.message);
      throw error;
    }
  },

  deleteCampaign: async (campaignId) => {
    try {
      console.warn('⚠️  [superAdminService] Campaigns endpoint not available');
      return false;
    } catch (error) {
      console.error('❌ [superAdminService] Error deleting campaign:', error.message);
      throw error;
    }
  },

  // ─── SUPPORT TICKETS ──────────────────────────────────────────────────────
  getSupportTickets: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/support', {
        params: { page, limit, ...filters },
      });
      return response.data.success ? response.data.data : { tickets: [], total: 0 };
    } catch (error) {
      console.error('❌ [superAdminService] Error fetching support tickets:', error.message);
      // Return empty array instead of throwing to prevent dashboard crash
      return { tickets: [], total: 0 };
    }
  },

  updateTicket: async (ticketId, ticketData) => {
    try {
      const response = await api.put(`/support/${ticketId}`, ticketData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error updating ticket:', error.message);
      throw error;
    }
  },

  // ─── SETTINGS ──────────────────────────────────────────────────────────────
  getSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error fetching settings:', error.message);
      // Return empty object instead of throwing to prevent dashboard crash
      return {};
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/settings', settingsData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('❌ [superAdminService] Error updating settings:', error.message);
      throw error;
    }
  },

  // ─── AUDIT LOGS ────────────────────────────────────────────────────────────
  getAuditLogs: async (page = 1, limit = 10) => {
    try {
      // Placeholder - audit logs endpoint not yet mounted
      // Return empty array for now
      return { logs: [], total: 0 };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  // ─── LOGIN HISTORY ────────────────────────────────────────────────────────
  getLoginHistory: async (page = 1, limit = 10) => {
    try {
      // Placeholder - login history endpoint not yet mounted
      // Return empty array for now
      return { history: [], total: 0 };
    } catch (error) {
      console.error('Error fetching login history:', error);
      throw error;
    }
  },
};

export default superAdminService;
