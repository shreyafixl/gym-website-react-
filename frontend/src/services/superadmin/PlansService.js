import api from '../api';

/**
 * Plans Service
 * Handles all membership plans and pricing API calls
 */
export const PlansService = {
  /**
   * Get all membership plans with pagination and filtering
   */
  getPlans: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/plans?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get plan by ID
   */
  getPlanById: async (planId) => {
    try {
      const response = await api.get(`/superadmin/plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new plan
   */
  createPlan: async (planData) => {
    try {
      const response = await api.post('/superadmin/plans', planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update plan
   */
  updatePlan: async (planId, planData) => {
    try {
      const response = await api.put(`/superadmin/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete plan
   */
  deletePlan: async (planId) => {
    try {
      const response = await api.delete(`/superadmin/plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get plan statistics
   */
  getPlanStats: async () => {
    try {
      const response = await api.get('/superadmin/plans/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Compare plans
   */
  comparePlans: async (planIds = []) => {
    try {
      const params = new URLSearchParams();
      planIds.forEach(id => params.append('planIds', id));
      const response = await api.get(`/superadmin/plans/compare?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search plans
   */
  searchPlans: async (query, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ search: query, page, per_page: perPage });
      const response = await api.get(`/superadmin/plans?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default PlansService;
