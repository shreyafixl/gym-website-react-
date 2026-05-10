import api from '../api';

export const ContentService = {
  getContent: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/content?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createContent: async (contentData) => {
    try {
      const response = await api.post('/superadmin/content', contentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getContentById: async (contentId) => {
    try {
      const response = await api.get(`/superadmin/content/${contentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateContent: async (contentId, contentData) => {
    try {
      const response = await api.put(`/superadmin/content/${contentId}`, contentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  publishContent: async (contentId) => {
    try {
      const response = await api.put(`/superadmin/content/${contentId}/publish`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteContent: async (contentId) => {
    try {
      const response = await api.delete(`/superadmin/content/${contentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ContentService;
