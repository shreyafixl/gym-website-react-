import api from './api';

/**
 * Branch Management Service
 * Handles all branch-related API calls for Super Admin
 */
export const branchService = {
  /**
   * Get all branches with stats
   */
  getAllBranches: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/branches?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch branches',
      };
    }
  },

  /**
   * Get branch by ID
   */
  getBranchById: async (branchId) => {
    try {
      const response = await api.get(`/superadmin/branches/${branchId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch branch',
      };
    }
  },

  /**
   * Create new branch
   */
  createBranch: async (branchData) => {
    try {
      const response = await api.post('/superadmin/branches', branchData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create branch',
      };
    }
  },

  /**
   * Update branch
   */
  updateBranch: async (branchId, branchData) => {
    try {
      const response = await api.put(`/superadmin/branches/${branchId}`, branchData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update branch',
      };
    }
  },

  /**
   * Delete/Deactivate branch
   */
  deleteBranch: async (branchId) => {
    try {
      const response = await api.delete(`/superadmin/branches/${branchId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete branch',
      };
    }
  },

  /**
   * Get branch performance metrics
   */
  getBranchPerformance: async (branchId, startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(
        `/superadmin/branches/${branchId}/performance?${params}`
      );
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch performance metrics',
      };
    }
  },

  /**
   * Compare branches
   */
  compareBranches: async (branchIds, metrics = []) => {
    try {
      const params = new URLSearchParams({
        branchIds: branchIds.join(','),
        metrics: metrics.join(','),
      });
      const response = await api.get(`/superadmin/branches/compare?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to compare branches',
      };
    }
  },

  /**
   * Get branch staff
   */
  getBranchStaff: async (branchId) => {
    try {
      const response = await api.get(`/superadmin/branches/${branchId}/staff`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch branch staff',
      };
    }
  },
};

export default branchService;
