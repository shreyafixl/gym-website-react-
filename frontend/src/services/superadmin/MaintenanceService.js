import api from '../api';

export const MaintenanceService = {
  getMaintenanceRecords: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/maintenance?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMaintenanceRecordById: async (recordId) => {
    try {
      const response = await api.get(`/superadmin/maintenance/${recordId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createMaintenanceRecord: async (recordData) => {
    try {
      const response = await api.post('/superadmin/maintenance', recordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateMaintenanceRecord: async (recordId, recordData) => {
    try {
      const response = await api.put(`/superadmin/maintenance/${recordId}`, recordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  completeMaintenanceRecord: async (recordId, completionData) => {
    try {
      const response = await api.put(`/superadmin/maintenance/${recordId}/complete`, completionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMaintenanceRecord: async (recordId) => {
    try {
      const response = await api.delete(`/superadmin/maintenance/${recordId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMaintenanceStats: async () => {
    try {
      const response = await api.get('/superadmin/maintenance/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default MaintenanceService;
