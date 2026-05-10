import api from '../api';

export const SupportService = {
  getTickets: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/support/tickets?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/superadmin/support/tickets', ticketData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTicketById: async (ticketId) => {
    try {
      const response = await api.get(`/superadmin/support/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTicket: async (ticketId, ticketData) => {
    try {
      const response = await api.put(`/superadmin/support/tickets/${ticketId}`, ticketData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  closeTicket: async (ticketId, resolution) => {
    try {
      const response = await api.put(`/superadmin/support/tickets/${ticketId}/close`, { resolution });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFeedback: async (page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage });
      const response = await api.get(`/superadmin/support/feedback?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  markFeedbackReviewed: async (feedbackId) => {
    try {
      const response = await api.put(`/superadmin/support/feedback/${feedbackId}/mark-reviewed`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteFeedback: async (feedbackId) => {
    try {
      const response = await api.delete(`/superadmin/support/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default SupportService;
