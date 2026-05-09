import api from './api';

/**
 * Financial Management Service
 * Handles all financial-related API calls for Super Admin
 */
export const financialService = {
  /**
   * Get all transactions
   */
  getTransactions: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/financial/transactions?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch transactions',
      };
    }
  },

  /**
   * Get transaction by ID
   */
  getTransactionById: async (transactionId) => {
    try {
      const response = await api.get(`/superadmin/financial/transactions/${transactionId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch transaction',
      };
    }
  },

  /**
   * Get all membership plans
   */
  getMembershipPlans: async () => {
    try {
      const response = await api.get('/superadmin/financial/plans');
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch membership plans',
      };
    }
  },

  /**
   * Create membership plan
   */
  createMembershipPlan: async (planData) => {
    try {
      const response = await api.post('/superadmin/financial/plans', planData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create membership plan',
      };
    }
  },

  /**
   * Update membership plan
   */
  updateMembershipPlan: async (planId, planData) => {
    try {
      const response = await api.put(`/superadmin/financial/plans/${planId}`, planData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update membership plan',
      };
    }
  },

  /**
   * Delete membership plan
   */
  deleteMembershipPlan: async (planId) => {
    try {
      const response = await api.delete(`/superadmin/financial/plans/${planId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete membership plan',
      };
    }
  },

  /**
   * Get billing information
   */
  getBillingInfo: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/superadmin/financial/billing?page=${page}&limit=${limit}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch billing info',
      };
    }
  },

  /**
   * Get revenue reports
   */
  getRevenueReports: async (startDate, endDate, groupBy = 'daily') => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        groupBy,
      });
      const response = await api.get(`/superadmin/financial/revenue?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch revenue reports',
      };
    }
  },

  /**
   * Get subscription information
   */
  getSubscriptions: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/financial/subscriptions?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch subscriptions',
      };
    }
  },
};

export default financialService;
