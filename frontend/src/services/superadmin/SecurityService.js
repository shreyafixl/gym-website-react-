import api from '../api';

export const SecurityService = {
  getAuditLogs: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/security/audit-logs?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAuditLogById: async (logId) => {
    try {
      const response = await api.get(`/superadmin/security/audit-logs/${logId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getLoginHistory: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/security/login-history?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSystemLogs: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/security/system-logs?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSecurityStats: async () => {
    try {
      const response = await api.get('/superadmin/security/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default SecurityService;
