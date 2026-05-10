import api from '../api';

/**
 * Notifications Service
 * Handles all notifications API calls
 */
export const NotificationsService = {
  /**
   * Get all notifications with pagination and filtering
   */
  getNotifications: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/notifications?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get notification by ID
   */
  getNotificationById: async (notificationId) => {
    try {
      const response = await api.get(`/superadmin/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new notification
   */
  createNotification: async (notificationData) => {
    try {
      const response = await api.post('/superadmin/notifications', notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update notification
   */
  updateNotification: async (notificationId, notificationData) => {
    try {
      const response = await api.put(`/superadmin/notifications/${notificationId}`, notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/superadmin/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send bulk notifications
   */
  sendBulkNotifications: async (notificationData) => {
    try {
      const response = await api.post('/superadmin/notifications/bulk-send', notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get notification statistics
   */
  getNotificationStats: async () => {
    try {
      const response = await api.get('/superadmin/notifications/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default NotificationsService;
