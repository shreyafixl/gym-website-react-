import api from '../api';

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */
export const DashboardService = {
  /**
   * Get dashboard overview statistics
   */
  getOverview: async () => {
    try {
      const response = await api.get('/superadmin/dashboard/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get dashboard statistics with date range
   */
  getStatistics: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams({ startDate, endDate });
      const response = await api.get(`/superadmin/dashboard/statistics?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get real-time metrics
   */
  getMetrics: async () => {
    try {
      const response = await api.get('/superadmin/dashboard/metrics');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get dashboard activity feed
   */
  getActivityFeed: async (limit = 10) => {
    try {
      const response = await api.get(`/superadmin/dashboard/activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default DashboardService;
