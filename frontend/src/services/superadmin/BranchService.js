import api from '../api';

/**
 * Branch Service
 * Handles all branch management API calls
 */
export const BranchService = {
  /**
   * Get all branches with pagination and filtering (CRUD hook compatible)
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        per_page: params.perPage || 20,
        ...params.filters,
      });
      const response = await api.get(`/superadmin/branches?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all branches with pagination and filtering (legacy method)
   */
  getBranches: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/branches?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get branch by ID (CRUD hook compatible)
   */
  getById: async (branchId) => {
    try {
      const response = await api.get(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get branch by ID (legacy method)
   */
  getBranchById: async (branchId) => {
    try {
      const response = await api.get(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new branch (CRUD hook compatible)
   */
  create: async (branchData) => {
    try {
      const response = await api.post('/superadmin/branches', branchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new branch (legacy method)
   */
  createBranch: async (branchData) => {
    try {
      const response = await api.post('/superadmin/branches', branchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update branch (CRUD hook compatible)
   */
  update: async (branchId, branchData) => {
    try {
      const response = await api.put(`/superadmin/branches/${branchId}`, branchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update branch (legacy method)
   */
  updateBranch: async (branchId, branchData) => {
    try {
      const response = await api.put(`/superadmin/branches/${branchId}`, branchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete branch (CRUD hook compatible)
   */
  delete: async (branchId) => {
    try {
      const response = await api.delete(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete branch (legacy method)
   */
  deleteBranch: async (branchId) => {
    try {
      const response = await api.delete(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get branch performance statistics
   */
  getBranchPerformance: async (branchId) => {
    try {
      const response = await api.get(`/superadmin/branches/${branchId}/performance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Compare branches performance
   */
  compareBranches: async (branchIds = []) => {
    try {
      const params = new URLSearchParams();
      branchIds.forEach(id => params.append('branchIds', id));
      const response = await api.get(`/superadmin/branches/compare?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search branches
   */
  searchBranches: async (query, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ search: query, page, per_page: perPage });
      const response = await api.get(`/superadmin/branches?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default BranchService;
