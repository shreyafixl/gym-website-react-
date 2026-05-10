import api from './api';

/**
 * Report Service
 * Handles all report-related API calls for Super Admin
 */
export const reportService = {
  /**
   * Get all reports
   */
  getAllReports: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/reports?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch reports',
      };
    }
  },

  /**
   * Get report by ID
   */
  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/superadmin/reports/${reportId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch report',
      };
    }
  },

  /**
   * Generate custom report
   */
  generateReport: async (reportConfig) => {
    try {
      const response = await api.post('/superadmin/reports/generate', reportConfig);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to generate report',
      };
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
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to export report',
      };
    }
  },

  /**
   * Get member statistics
   */
  getMemberStatistics: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(`/superadmin/reports/statistics/members?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch member statistics',
      };
    }
  },

  /**
   * Get financial statistics
   */
  getFinancialStatistics: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(`/superadmin/reports/statistics/financial?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch financial statistics',
      };
    }
  },

  /**
   * Get attendance statistics
   */
  getAttendanceStatistics: async (startDate, endDate, branchId = null) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      if (branchId) params.append('branchId', branchId);

      const response = await api.get(`/superadmin/reports/statistics/attendance?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch attendance statistics',
      };
    }
  },
};

export default reportService;
