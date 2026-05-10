import api from '../api';

export const IntegrationService = {
  getApiSettings: async () => {
    try {
      const response = await api.get('/superadmin/integrations/api-settings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateApiSettings: async (settings) => {
    try {
      const response = await api.put('/superadmin/integrations/api-settings', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generateApiKey: async (keyData) => {
    try {
      const response = await api.post('/superadmin/integrations/api-keys/generate', keyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getThirdPartyApps: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/integrations/apps?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  installApp: async (appData) => {
    try {
      const response = await api.post('/superadmin/integrations/apps', appData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAppConfig: async (appId, config) => {
    try {
      const response = await api.put(`/superadmin/integrations/apps/${appId}/config`, { config });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uninstallApp: async (appId) => {
    try {
      const response = await api.delete(`/superadmin/integrations/apps/${appId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default IntegrationService;
