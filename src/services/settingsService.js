import api from './api';

/**
 * Settings Service
 * Handles all settings-related API calls for Super Admin
 */
export const settingsService = {
  /**
   * Get system settings
   */
  getSettings: async () => {
    try {
      const response = await api.get('/superadmin/settings');
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch settings',
      };
    }
  },

  /**
   * Update system settings
   */
  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/superadmin/settings', settingsData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update settings',
      };
    }
  },

  /**
   * Get admin profile
   */
  getProfile: async () => {
    try {
      const response = await api.get('/superadmin/profile');
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile',
      };
    }
  },

  /**
   * Update admin profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/superadmin/profile', profileData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update profile',
      };
    }
  },

  /**
   * Get audit logs
   */
  getAuditLogs: async (page = 1, limit = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/settings/audit-logs?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch audit logs',
      };
    }
  },

  /**
   * Get system health
   */
  getSystemHealth: async () => {
    try {
      const response = await api.get('/superadmin/settings/health');
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch system health',
      };
    }
  },

  /**
   * Get backup status
   */
  getBackupStatus: async () => {
    try {
      const response = await api.get('/superadmin/settings/backup');
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch backup status',
      };
    }
  },

  /**
   * Trigger backup
   */
  triggerBackup: async () => {
    try {
      const response = await api.post('/superadmin/settings/backup/trigger');
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to trigger backup',
      };
    }
  },
};

export default settingsService;
