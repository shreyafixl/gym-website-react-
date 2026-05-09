import api from './api';

/**
 * Attendance Management Service
 * Handles all attendance-related API calls for Super Admin
 */
export const attendanceService = {
  /**
   * Get all attendance records
   */
  getAllAttendance: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      });
      const response = await api.get(`/superadmin/attendance?${params}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch attendance records',
      };
    }
  },

  /**
   * Get attendance by ID
   */
  getAttendanceById: async (attendanceId) => {
    try {
      const response = await api.get(`/superadmin/attendance/${attendanceId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch attendance record',
      };
    }
  },

  /**
   * Get user attendance history
   */
  getUserAttendance: async (userId, page = 1, limit = 20) => {
    try {
      const response = await api.get(
        `/superadmin/attendance/user/${userId}?page=${page}&limit=${limit}`
      );
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch user attendance',
      };
    }
  },

  /**
   * Get branch attendance statistics
   */
  getBranchAttendanceStats: async (branchId, startDate, endDate) => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      const response = await api.get(
        `/superadmin/attendance/branch/${branchId}/stats?${params}`
      );
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch attendance stats',
      };
    }
  },

  /**
   * Mark attendance
   */
  markAttendance: async (attendanceData) => {
    try {
      const response = await api.post('/superadmin/attendance', attendanceData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to mark attendance',
      };
    }
  },

  /**
   * Update attendance record
   */
  updateAttendance: async (attendanceId, attendanceData) => {
    try {
      const response = await api.put(`/superadmin/attendance/${attendanceId}`, attendanceData);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, error: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update attendance',
      };
    }
  },
};

export default attendanceService;
