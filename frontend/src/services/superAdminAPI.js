import api from './api';

/**
 * Super Admin API Service
 * Centralized API calls for all Super Admin Dashboard modules
 */

// ─── DASHBOARD & ANALYTICS ────────────────────────────────────────────────────
export const dashboardAPI = {
  getOverview: async () => {
    try {
      const response = await api.get('/superadmin/analytics/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/superadmin/analytics/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMemberGrowth: async (period = 'monthly') => {
    try {
      const response = await api.get(`/superadmin/analytics/member-growth?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRevenue: async (period = 'monthly') => {
    try {
      const response = await api.get(`/superadmin/analytics/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getActivity: async () => {
    try {
      const response = await api.get('/superadmin/analytics/activity');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────
export const userAPI = {
  getAllUsers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, limit, ...filters });
      const response = await api.get(`/superadmin/users?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/superadmin/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/superadmin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserStats: async () => {
    try {
      const response = await api.get('/superadmin/users/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bulkUpdateUsers: async (userIds, updateData) => {
    try {
      const response = await api.put('/superadmin/users/bulk-update', {
        userIds,
        updateData,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportUsers: async (format = 'csv') => {
    try {
      const response = await api.get(`/superadmin/users/export?format=${format}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── BRANCH MANAGEMENT ────────────────────────────────────────────────────────
export const branchAPI = {
  getAllBranches: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/superadmin/branches?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBranchById: async (branchId) => {
    try {
      const response = await api.get(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBranch: async (branchData) => {
    try {
      const response = await api.post('/superadmin/branches', branchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBranch: async (branchId, branchData) => {
    try {
      const response = await api.put(`/superadmin/branches/${branchId}`, branchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBranch: async (branchId) => {
    try {
      const response = await api.delete(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBranchStats: async (branchId) => {
    try {
      const response = await api.get(`/superadmin/branches/${branchId}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── TRAINER MANAGEMENT ───────────────────────────────────────────────────────
export const trainerAPI = {
  getAllTrainers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, limit, ...filters });
      const response = await api.get(`/superadmin/trainers?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTrainerById: async (trainerId) => {
    try {
      const response = await api.get(`/superadmin/trainers/${trainerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTrainer: async (trainerData) => {
    try {
      const response = await api.post('/superadmin/trainers', trainerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTrainer: async (trainerId, trainerData) => {
    try {
      const response = await api.put(`/superadmin/trainers/${trainerId}`, trainerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTrainer: async (trainerId) => {
    try {
      const response = await api.delete(`/superadmin/trainers/${trainerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTrainerStats: async () => {
    try {
      const response = await api.get('/superadmin/trainers/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── MEMBERSHIP MANAGEMENT ────────────────────────────────────────────────────
export const membershipAPI = {
  getAllMemberships: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/superadmin/memberships?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMembershipById: async (membershipId) => {
    try {
      const response = await api.get(`/superadmin/memberships/${membershipId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllPlans: async () => {
    try {
      const response = await api.get('/superadmin/membership-plans');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPlanById: async (planId) => {
    try {
      const response = await api.get(`/superadmin/membership-plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPlan: async (planData) => {
    try {
      const response = await api.post('/superadmin/membership-plans', planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePlan: async (planId, planData) => {
    try {
      const response = await api.put(`/superadmin/membership-plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePlan: async (planId) => {
    try {
      const response = await api.delete(`/superadmin/membership-plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMembershipStats: async () => {
    try {
      const response = await api.get('/superadmin/memberships/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── WORKOUT MANAGEMENT ───────────────────────────────────────────────────────
export const workoutAPI = {
  getAllWorkouts: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, limit, ...filters });
      const response = await api.get(`/superadmin/workouts?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getWorkoutById: async (workoutId) => {
    try {
      const response = await api.get(`/superadmin/workouts/${workoutId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createWorkout: async (workoutData) => {
    try {
      const response = await api.post('/superadmin/workouts', workoutData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateWorkout: async (workoutId, workoutData) => {
    try {
      const response = await api.put(`/superadmin/workouts/${workoutId}`, workoutData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteWorkout: async (workoutId) => {
    try {
      const response = await api.delete(`/superadmin/workouts/${workoutId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── ATTENDANCE MANAGEMENT ────────────────────────────────────────────────────
export const attendanceAPI = {
  getAllAttendance: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, limit, ...filters });
      const response = await api.get(`/superadmin/attendance?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceById: async (attendanceId) => {
    try {
      const response = await api.get(`/superadmin/attendance/${attendanceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceStats: async (period = 'monthly') => {
    try {
      const response = await api.get(`/superadmin/attendance/stats?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMemberAttendance: async (memberId) => {
    try {
      const response = await api.get(`/superadmin/attendance/member/${memberId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── COMMUNICATION & NOTIFICATIONS ────────────────────────────────────────────
export const communicationAPI = {
  getAllNotifications: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/superadmin/communication/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendNotification: async (notificationData) => {
    try {
      const response = await api.post('/superadmin/communication/notifications', notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllCampaigns: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/superadmin/communication/campaigns?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/superadmin/communication/campaigns', campaignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCampaign: async (campaignId, campaignData) => {
    try {
      const response = await api.put(`/superadmin/communication/campaigns/${campaignId}`, campaignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(`/superadmin/communication/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllMessages: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/superadmin/communication/messages?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/superadmin/communication/messages', messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── REPORTS & ANALYTICS ──────────────────────────────────────────────────────
export const reportsAPI = {
  getFinancialReports: async (period = 'monthly') => {
    try {
      const response = await api.get(`/superadmin/reports/financial?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMemberAnalytics: async (period = 'monthly') => {
    try {
      const response = await api.get(`/superadmin/reports/members?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceReports: async (period = 'monthly') => {
    try {
      const response = await api.get(`/superadmin/reports/attendance?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRevenueReports: async (period = 'monthly') => {
    try {
      const response = await api.get(`/superadmin/reports/revenue?period=${period}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportReport: async (reportType, format = 'pdf') => {
    try {
      const response = await api.get(`/superadmin/reports/export?type=${reportType}&format=${format}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── SETTINGS & PROFILE ───────────────────────────────────────────────────────
export const settingsAPI = {
  getSettings: async () => {
    try {
      const response = await api.get('/superadmin/settings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/superadmin/settings', settingsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/superadmin/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/superadmin/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/superadmin/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAuditLogs: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/superadmin/settings/audit-logs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLoginHistory: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/superadmin/settings/login-history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// ─── SUPPORT & TICKETS ────────────────────────────────────────────────────────
export const supportAPI = {
  getAllTickets: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, limit, ...filters });
      const response = await api.get(`/superadmin/support/tickets?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const response = await api.get(`/superadmin/support/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTicket: async (ticketId, ticketData) => {
    try {
      const response = await api.put(`/superadmin/support/tickets/${ticketId}`, ticketData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addTicketResponse: async (ticketId, responseData) => {
    try {
      const response = await api.post(`/superadmin/support/tickets/${ticketId}/responses`, responseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  closeTicket: async (ticketId) => {
    try {
      const response = await api.put(`/superadmin/support/tickets/${ticketId}/close`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default {
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
};
