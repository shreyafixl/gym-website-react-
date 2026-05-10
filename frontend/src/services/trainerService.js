import api from './api';

/**
 * Trainer Management Service
 * Handles all trainer-related API calls for Super Admin
 */
export const trainerService = {
  /**
   * Get all trainers
   */
  getAllTrainers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/trainers?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch trainers',
      };
    }
  },

  /**
   * Get trainer by ID
   */
  getTrainerById: async (trainerId) => {
    try {
      const response = await api.get(`/superadmin/trainers/${trainerId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch trainer',
      };
    }
  },

  /**
   * Create new trainer
   */
  createTrainer: async (trainerData) => {
    try {
      const response = await api.post('/superadmin/trainers', trainerData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create trainer',
      };
    }
  },

  /**
   * Update trainer
   */
  updateTrainer: async (trainerId, trainerData) => {
    try {
      const response = await api.put(`/superadmin/trainers/${trainerId}`, trainerData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update trainer',
      };
    }
  },

  /**
   * Delete trainer
   */
  deleteTrainer: async (trainerId) => {
    try {
      const response = await api.delete(`/superadmin/trainers/${trainerId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete trainer',
      };
    }
  },

  /**
   * Get trainer performance
   */
  getTrainerPerformance: async (trainerId, startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(
        `/superadmin/trainers/${trainerId}/performance?${params}`
      );
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch trainer performance',
      };
    }
  },

  /**
   * Get trainer clients
   */
  getTrainerClients: async (trainerId, page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/superadmin/trainers/${trainerId}/clients?page=${page}&limit=${limit}`
      );
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch trainer clients',
      };
    }
  },
};

export default trainerService;
