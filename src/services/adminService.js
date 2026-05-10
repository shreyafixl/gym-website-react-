import api from './api';

/**
 * Admin Service Layer
 * Handles all API calls for admin dashboard operations
 */

// ─── ANALYTICS / DASHBOARD ────────────────────────────────────────────────────
export const adminAnalyticsAPI = {
  // Get dashboard overview data (KPIs, charts, etc.)
  getDashboardOverview: async () => {
    try {
      const response = await api.get('/admin/analytics/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get member analytics
  getMemberAnalytics: async (period = 'monthly') => {
    try {
      const response = await api.get('/admin/analytics/members', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (period = 'yearly', year = new Date().getFullYear()) => {
    try {
      const response = await api.get('/admin/analytics/revenue', {
        params: { period, year }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get attendance analytics
  getAttendanceAnalytics: async (branchId = null, period = 'weekly') => {
    try {
      const response = await api.get('/admin/analytics/attendance', {
        params: { branchId, period }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get class performance analytics
  getClassPerformance: async () => {
    try {
      const response = await api.get('/admin/analytics/classes/performance');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ─── USER / MEMBER MANAGEMENT ─────────────────────────────────────────────────
export const adminUserAPI = {
  // Get all users/members with pagination and filtering
  getAllUsers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/admin/users', {
        params: {
          page,
          limit,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new user/member
  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user/member
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete user/member
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/admin/users/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ─── TRAINER MANAGEMENT ───────────────────────────────────────────────────────
export const adminTrainerAPI = {
  // Get all trainers with pagination and filtering
  getAllTrainers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/admin/trainers', {
        params: {
          page,
          limit,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single trainer by ID
  getTrainerById: async (trainerId) => {
    try {
      const response = await api.get(`/admin/trainers/${trainerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new trainer
  createTrainer: async (trainerData) => {
    try {
      const response = await api.post('/admin/trainers', trainerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update trainer
  updateTrainer: async (trainerId, trainerData) => {
    try {
      const response = await api.put(`/admin/trainers/${trainerId}`, trainerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete trainer
  deleteTrainer: async (trainerId) => {
    try {
      const response = await api.delete(`/admin/trainers/${trainerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Assign members to trainer
  assignMembers: async (trainerId, memberIds) => {
    try {
      const response = await api.post(`/admin/trainers/${trainerId}/assign-members`, {
        memberIds
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update trainer availability
  updateAvailability: async (trainerId, availability) => {
    try {
      const response = await api.put(`/admin/trainers/${trainerId}/availability`, {
        availability
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ─── ATTENDANCE MANAGEMENT ────────────────────────────────────────────────────
export const adminAttendanceAPI = {
  // Get all attendance records with pagination and filtering
  getAllAttendance: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/admin/attendance', {
        params: {
          page,
          limit,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single attendance record by ID
  getAttendanceById: async (attendanceId) => {
    try {
      const response = await api.get(`/admin/attendance/${attendanceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create attendance record (check-in)
  createAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/admin/attendance', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update attendance record (check-out, status, etc.)
  updateAttendance: async (attendanceId, attendanceData) => {
    try {
      const response = await api.put(`/admin/attendance/${attendanceId}`, attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete attendance record
  deleteAttendance: async (attendanceId) => {
    try {
      const response = await api.delete(`/admin/attendance/${attendanceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get attendance statistics
  getAttendanceStats: async (branchId = null, period = 'monthly') => {
    try {
      const response = await api.get('/admin/attendance/stats', {
        params: { branchId, period }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk mark attendance
  bulkMarkAttendance: async (attendanceRecords) => {
    try {
      const response = await api.post('/admin/attendance/bulk', {
        attendanceRecords
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// ─── COMMUNICATION ────────────────────────────────────────────────────────────
export const adminCommunicationAPI = {
  // Create notification
  createNotification: async (notificationData) => {
    try {
      const response = await api.post('/admin/communication/notifications', notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all notifications
  getAllNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/admin/communication/notifications', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create announcement
  createAnnouncement: async (announcementData) => {
    try {
      const response = await api.post('/admin/communication/announcements', announcementData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/admin/communication/messages', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk notifications
  bulkNotifications: async (notifications) => {
    try {
      const response = await api.post('/admin/communication/notifications/bulk', {
        notifications
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default {
  adminAnalyticsAPI,
  adminUserAPI,
  adminTrainerAPI,
  adminAttendanceAPI,
  adminCommunicationAPI,
};
