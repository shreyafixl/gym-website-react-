import api from '../api';

/**
 * Transaction Service
 * Handles all transaction management API calls
 */
export const TransactionService = {
  /**
   * Get all transactions with pagination and filtering (CRUD hook compatible)
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        per_page: params.perPage || 20,
        ...params.filters,
      });
      const response = await api.get(`/superadmin/transactions?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all transactions with pagination and filtering (legacy method)
   */
  getTransactions: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/transactions?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transaction by ID (CRUD hook compatible)
   */
  getById: async (transactionId) => {
    try {
      const response = await api.get(`/superadmin/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transaction by ID (legacy method)
   */
  getTransactionById: async (transactionId) => {
    try {
      const response = await api.get(`/superadmin/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search transactions
   */
  searchTransactions: async (query, page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        q: query,
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/transactions/search?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transaction statistics
   */
  getTransactionStats: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/superadmin/transactions/stats?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export transactions
   */
  exportTransactions: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams({ format, ...filters });
      const response = await api.get(`/superadmin/transactions/export?${params}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transactions by date range
   */
  getTransactionsByDateRange: async (startDate, endDate, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ startDate, endDate, page, per_page: perPage });
      const response = await api.get(`/superadmin/transactions?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transactions by branch
   */
  getTransactionsByBranch: async (branchId, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ branch: branchId, page, per_page: perPage });
      const response = await api.get(`/superadmin/transactions?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transactions by status
   */
  getTransactionsByStatus: async (status, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ status, page, per_page: perPage });
      const response = await api.get(`/superadmin/transactions?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default TransactionService;
