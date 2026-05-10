import api from '../api';

export const CommunicationService = {
  getMessages: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/communication?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/superadmin/communication/send', messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMessageHistory: async (userId, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ userId, page, per_page: perPage });
      const response = await api.get(`/superadmin/communication/history?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/superadmin/communication/${messageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCommunicationStats: async () => {
    try {
      const response = await api.get('/superadmin/communication/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default CommunicationService;
