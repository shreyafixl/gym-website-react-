import api from '../api';

/**
 * User Service
 * Handles all user management API calls
 */
export const UserService = {
  /**
   * Get all users with pagination and filtering (CRUD hook compatible)
   */
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        per_page: params.perPage || 20,
        ...params.filters,
      });
      const response = await api.get(`/superadmin/users?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all users with pagination and filtering (legacy method)
   */
  getUsers: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...filters,
      });
      const response = await api.get(`/superadmin/users?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user by ID (CRUD hook compatible)
   */
  getById: async (userId) => {
    try {
      const response = await api.get(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user by ID (legacy method)
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new user (CRUD hook compatible)
   */
  create: async (userData) => {
    try {
      const response = await api.post('/superadmin/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create new user (legacy method)
   */
  createUser: async (userData) => {
    try {
      const response = await api.post('/superadmin/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user (CRUD hook compatible)
   */
  update: async (userId, userData) => {
    try {
      const response = await api.put(`/superadmin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user (legacy method)
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/superadmin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete user (CRUD hook compatible)
   */
  delete: async (userId) => {
    try {
      const response = await api.delete(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete user (legacy method)
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Suspend user
   */
  suspendUser: async (userId, reason = '') => {
    try {
      const response = await api.post(`/superadmin/users/${userId}/suspend`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reactivate user
   */
  reactivateUser: async (userId) => {
    try {
      const response = await api.post(`/superadmin/users/${userId}/reactivate`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset user password
   */
  resetPassword: async (userId) => {
    try {
      const response = await api.post(`/superadmin/users/${userId}/reset-password`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user activity history
   */
  getUserActivity: async (userId, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage });
      const response = await api.get(`/superadmin/users/${userId}/activity?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Bulk import users from file
   */
  bulkImportUsers: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/superadmin/users/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export users to file
   */
  exportUsers: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams({ format, ...filters });
      const response = await api.get(`/superadmin/users/export?${params}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search users
   */
  searchUsers: async (query, page = 1, perPage = 20) => {
    try {
      const params = new URLSearchParams({ q: query, page, per_page: perPage });
      const response = await api.get(`/superadmin/users/search?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
