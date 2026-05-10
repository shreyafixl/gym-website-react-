import api from '../api';

/**
 * Analytics Service
 * Handles all analytics API calls
 */
export const AnalyticsService = {
  /**
   * Get member analytics
   */
  getMemberAnalytics: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/analytics/members?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get financial analytics
   */
  getFinancialAnalytics: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/superadmin/analytics/financial?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get member growth analytics
   */
  getMemberGrowth: async (days = 30) => {
    try {
      const response = await api.get(`/superadmin/analytics/member-growth?days=${days}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get branch comparison analytics
   */
  getBranchComparison: async () => {
    try {
      const response = await api.get('/superadmin/analytics/branch-comparison');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AnalyticsService;
