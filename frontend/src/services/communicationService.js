import api from './api';

/**
 * Communication Service
 * Handles all communication-related API calls for Super Admin
 */
export const communicationService = {
  /**
   * Get all notifications
   */
  getNotifications: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/communication/notifications?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch notifications',
      };
    }
  },

  /**
   * Send notification
   */
  sendNotification: async (notificationData) => {
    try {
      const response = await api.post('/superadmin/communication/notifications', notificationData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send notification',
      };
    }
  },

  /**
   * Get all campaigns
   */
  getCampaigns: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/communication/campaigns?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch campaigns',
      };
    }
  },

  /**
   * Create campaign
   */
  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/superadmin/communication/campaigns', campaignData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create campaign',
      };
    }
  },

  /**
   * Update campaign
   */
  updateCampaign: async (campaignId, campaignData) => {
    try {
      const response = await api.put(
        `/superadmin/communication/campaigns/${campaignId}`,
        campaignData
      );
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update campaign',
      };
    }
  },

  /**
   * Delete campaign
   */
  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(`/superadmin/communication/campaigns/${campaignId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete campaign',
      };
    }
  },

  /**
   * Get all messages
   */
  getMessages: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/communication/messages?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch messages',
      };
    }
  },

  /**
   * Send message
   */
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/superadmin/communication/messages', messageData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message',
      };
    }
  },
};

export default communicationService;
