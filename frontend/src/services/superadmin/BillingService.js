import api from '../api';

/**
 * Billing Service
 * Handles all billing management API calls
 */
export const BillingService = {
  /**
   * Get all billing records with pagination and filtering (CRUD hook compatible)
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        per_page: params.perPage || 20,
        ...params.filters,
      });
      const response = await api.get(`/superadmin/billing?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all billing records with pagination and filtering (legacy method)
   */
  getBillingRecords: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/billing?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get billing record by ID (CRUD hook compatible)
   */
  getById: async (billingId) => {
    try {
      const response = await api.get(`/superadmin/billing/${billingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get billing record by ID (legacy method)
   */
  getBillingRecordById: async (billingId) => {
    try {
      const response = await api.get(`/superadmin/billing/${billingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new billing record (CRUD hook compatible)
   */
  create: async (billingData) => {
    try {
      const response = await api.post('/superadmin/billing', billingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new billing record (legacy method)
   */
  createBillingRecord: async (billingData) => {
    try {
      const response = await api.post('/superadmin/billing', billingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update billing record (CRUD hook compatible)
   */
  update: async (billingId, billingData) => {
    try {
      const response = await api.put(`/superadmin/billing/${billingId}`, billingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update billing record (legacy method)
   */
  updateBillingRecord: async (billingId, billingData) => {
    try {
      const response = await api.put(`/superadmin/billing/${billingId}`, billingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete billing record (CRUD hook compatible)
   */
  delete: async (billingId) => {
    try {
      const response = await api.delete(`/superadmin/billing/${billingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete billing record (legacy method)
   */
  deleteBillingRecord: async (billingId) => {
    try {
      const response = await api.delete(`/superadmin/billing/${billingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mark billing record as paid
   */
  markBillingAsPaid: async (billingId, paymentData = {}) => {
    try {
      const response = await api.put(`/superadmin/billing/${billingId}/mark-paid`, paymentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get billing summary
   */
  getBillingSummary: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/superadmin/billing/summary?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search billing records
   */
  searchBillingRecords: async (query, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ search: query, page, per_page: perPage });
      const response = await api.get(`/superadmin/billing?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default BillingService;
