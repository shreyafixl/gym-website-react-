import api from './api';

/**
 * Analytics Service
 * Handles all analytics-related API calls for Super Admin
 */
export const analyticsService = {
  /**
   * Get dashboard overview stats
   */
  getDashboardOverview: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(`/superadmin/analytics/overview?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch overview',
      };
    }
  },

  /**
   * Get member growth analytics
   */
  getMemberGrowth: async (startDate, endDate, interval = 'daily') => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        interval,
      });
      const response = await api.get(`/superadmin/analytics/member-growth?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch member growth',
      };
    }
  },

  /**
   * Get revenue analytics
   */
  getRevenueAnalytics: async (startDate, endDate, interval = 'daily') => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        interval,
      });
      const response = await api.get(`/superadmin/analytics/revenue?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch revenue analytics',
      };
    }
  },

  /**
   * Get activity analytics
   */
  getActivityAnalytics: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(`/superadmin/analytics/activity?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch activity analytics',
      };
    }
  },

  /**
   * Get membership analytics
   */
  getMembershipAnalytics: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(`/superadmin/analytics/membership?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch membership analytics',
      };
    }
  },

  /**
   * Get attendance analytics
   */
  getAttendanceAnalytics: async (startDate, endDate, branchId = null) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      if (branchId) params.append('branchId', branchId);

      const response = await api.get(`/superadmin/analytics/attendance?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch attendance analytics',
      };
    }
  },

  /**
   * Get trainer performance analytics
   */
  getTrainerPerformance: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(`/superadmin/analytics/trainer-performance?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch trainer performance',
      };
    }
  },

  /**
   * Get branch comparison analytics
   */
  getBranchComparison: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(`/superadmin/analytics/branch-comparison?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch branch comparison',
      };
    }
  },
};

export default analyticsService;
