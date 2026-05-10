import api from '../api';

/**
 * Revenue Service
 * Handles all revenue tracking API calls
 */
export const RevenueService = {
  /**
   * Get revenue data with filtering (CRUD hook compatible)
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        per_page: params.perPage || 20,
        ...params.filters,
      });
      const response = await api.get(`/superadmin/revenue?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get revenue data with filtering (legacy method)
   */
  getRevenue: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/revenue?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get revenue by ID (CRUD hook compatible)
   */
  getById: async (revenueId) => {
    try {
      const response = await api.get(`/superadmin/revenue/${revenueId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get revenue summary
   */
  getRevenueSummary: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/superadmin/revenue/summary?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Compare revenue between branches
   */
  compareRevenue: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/superadmin/revenue/compare?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get revenue trends
   */
  getRevenueTrends: async (days = 30, branch = '') => {
    try {
      const params = new URLSearchParams({ days, branch });
      const response = await api.get(`/superadmin/revenue/trends?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get revenue by date range
   */
  getRevenueByDateRange: async (startDate, endDate, branch = '') => {
    try {
      const params = new URLSearchParams({ startDate, endDate, branch });
      const response = await api.get(`/superadmin/revenue?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get revenue by branch
   */
  getRevenueByBranch: async (branchId, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ branch: branchId, page, per_page: perPage });
      const response = await api.get(`/superadmin/revenue?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default RevenueService;
