import api from '../api';

export const CampaignsService = {
  getCampaigns: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/campaigns?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCampaignById: async (campaignId) => {
    try {
      const response = await api.get(`/superadmin/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response = await api.post('/superadmin/campaigns', campaignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCampaign: async (campaignId, campaignData) => {
    try {
      const response = await api.put(`/superadmin/campaigns/${campaignId}`, campaignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCampaign: async (campaignId) => {
    try {
      const response = await api.delete(`/superadmin/campaigns/${campaignId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default CampaignsService;
