import api from './api';

/**
 * User Management Service
 * Handles all user-related API calls for Super Admin
 */
export const userService = {
  /**
   * Get all users with pagination and filters
   */
  getAllUsers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/users?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch users',
      };
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/superadmin/users/${userId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user',
      };
    }
  },

  /**
   * Create new user
   */
  createUser: async (userData) => {
    try {
      const response = await api.post('/superadmin/users', userData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create user',
      };
    }
  },

  /**
   * Update user
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/superadmin/users/${userId}`, userData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update user',
      };
    }
  },

  /**
   * Delete user
   */
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/superadmin/users/${userId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete user',
      };
    }
  },

  /**
   * Get user activity history
   */
  getUserActivity: async (userId, page = 1, limit = 20) => {
    try {
      const response = await api.get(
        `/superadmin/users/${userId}/activity?page=${page}&limit=${limit}`
      );
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch activity',
      };
    }
  },

  /**
   * Bulk import users from CSV
   */
  bulkImportUsers: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/superadmin/users/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to import users',
      };
    }
  },

  /**
   * Export users to CSV/PDF/XLSX
   */
  exportUsers: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams({
        format,
        ...filters,
      });
      const response = await api.get(`/superadmin/users/export?${params}`, {
        responseType: 'blob',
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to export users',
      };
    }
  },

  /**
   * Deactivate user
   */
  deactivateUser: async (userId) => {
    try {
      const response = await api.patch(`/superadmin/users/${userId}/deactivate`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to deactivate user',
      };
    }
  },

  /**
   * Activate user
   */
  activateUser: async (userId) => {
    try {
      const response = await api.patch(`/superadmin/users/${userId}/activate`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to activate user',
      };
    }
  },
};

export default userService;
