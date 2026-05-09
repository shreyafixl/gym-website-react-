import api from './api';

/**
 * Membership Management Service
 * Handles all membership-related API calls for Super Admin
 */
export const membershipService = {
  /**
   * Get all memberships
   */
  getAllMemberships: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/memberships?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch memberships',
      };
    }
  },

  /**
   * Get membership by ID
   */
  getMembershipById: async (membershipId) => {
    try {
      const response = await api.get(`/superadmin/memberships/${membershipId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch membership',
      };
    }
  },

  /**
   * Create new membership
   */
  createMembership: async (membershipData) => {
    try {
      const response = await api.post('/superadmin/memberships', membershipData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create membership',
      };
    }
  },

  /**
   * Update membership
   */
  updateMembership: async (membershipId, membershipData) => {
    try {
      const response = await api.put(`/superadmin/memberships/${membershipId}`, membershipData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update membership',
      };
    }
  },

  /**
   * Cancel membership
   */
  cancelMembership: async (membershipId) => {
    try {
      const response = await api.patch(`/superadmin/memberships/${membershipId}/cancel`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to cancel membership',
      };
    }
  },

  /**
   * Renew membership
   */
  renewMembership: async (membershipId) => {
    try {
      const response = await api.patch(`/superadmin/memberships/${membershipId}/renew`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to renew membership',
      };
    }
  },

  /**
   * Get membership plans
   */
  getMembershipPlans: async () => {
    try {
      const response = await api.get('/superadmin/memberships/plans');
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
};

export default membershipService;
