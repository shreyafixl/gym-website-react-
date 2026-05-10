import api from '../api';

export const SettingsService = {
  getGeneralSettings: async () => {
    try {
      const response = await api.get('/superadmin/settings/general');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateGeneralSettings: async (settings) => {
    try {
      const response = await api.put('/superadmin/settings/general', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNotificationSettings: async () => {
    try {
      const response = await api.get('/superadmin/settings/notifications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put('/superadmin/settings/notifications', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSystemConfig: async () => {
    try {
      const response = await api.get('/superadmin/settings/system-config');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSystemConfig: async (config) => {
    try {
      const response = await api.put('/superadmin/settings/system-config', config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default SettingsService;
