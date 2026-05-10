import api from '../api';

export const BackupsService = {
  getBackups: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/backups?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBackup: async (backupData) => {
    try {
      const response = await api.post('/superadmin/backups/create', backupData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBackupById: async (backupId) => {
    try {
      const response = await api.get(`/superadmin/backups/${backupId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  restoreBackup: async (backupId) => {
    try {
      const response = await api.post(`/superadmin/backups/${backupId}/restore`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBackup: async (backupId) => {
    try {
      const response = await api.delete(`/superadmin/backups/${backupId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBackupStats: async () => {
    try {
      const response = await api.get('/superadmin/backups/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default BackupsService;
