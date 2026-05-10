import api from './api';

/**
 * Workout Management Service
 * Handles all workout-related API calls for Super Admin
 */
export const workoutService = {
  /**
   * Get all workouts
   */
  getAllWorkouts: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/workouts?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch workouts',
      };
    }
  },

  /**
   * Get workout by ID
   */
  getWorkoutById: async (workoutId) => {
    try {
      const response = await api.get(`/superadmin/workouts/${workoutId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch workout',
      };
    }
  },

  /**
   * Create new workout
   */
  createWorkout: async (workoutData) => {
    try {
      const response = await api.post('/superadmin/workouts', workoutData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create workout',
      };
    }
  },

  /**
   * Update workout
   */
  updateWorkout: async (workoutId, workoutData) => {
    try {
      const response = await api.put(`/superadmin/workouts/${workoutId}`, workoutData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update workout',
      };
    }
  },

  /**
   * Delete workout
   */
  deleteWorkout: async (workoutId) => {
    try {
      const response = await api.delete(`/superadmin/workouts/${workoutId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete workout',
      };
    }
  },

  /**
   * Get workout plans
   */
  getWorkoutPlans: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/superadmin/workouts/plans?page=${page}&limit=${limit}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch workout plans',
      };
    }
  },
};

export default workoutService;
