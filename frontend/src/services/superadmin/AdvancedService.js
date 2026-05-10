import api from '../api';

export const AdvancedService = {
  getAiInsights: async (page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage });
      const response = await api.get(`/superadmin/advanced/ai-insights?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generateAiInsight: async (insightData) => {
    try {
      const response = await api.post('/superadmin/advanced/ai-insights/generate', insightData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFeatureFlags: async () => {
    try {
      const response = await api.get('/superadmin/advanced/feature-flags');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createFeatureFlag: async (flagData) => {
    try {
      const response = await api.post('/superadmin/advanced/feature-flags', flagData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateFeatureFlag: async (flagId, flagData) => {
    try {
      const response = await api.put(`/superadmin/advanced/feature-flags/${flagId}`, flagData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLiveMonitoring: async () => {
    try {
      const response = await api.get('/superadmin/advanced/monitoring');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMonitoringDetails: async () => {
    try {
      const response = await api.get('/superadmin/advanced/monitoring/details');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AdvancedService;
