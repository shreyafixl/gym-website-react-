import api from '../api';

/**
 * Reports Service
 * Handles all reports API calls
 */
export const ReportsService = {
  /**
   * Get all reports with pagination
   */
  getReports: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/reports?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generate a new report
   */
  generateReport: async (reportData) => {
    try {
      const response = await api.post('/superadmin/reports/generate', reportData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get report by ID
   */
  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/superadmin/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export report
   */
  exportReport: async (reportId, format = 'pdf') => {
    try {
      const response = await api.get(`/superadmin/reports/${reportId}/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete report
   */
  deleteReport: async (reportId) => {
    try {
      const response = await api.delete(`/superadmin/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default ReportsService;
