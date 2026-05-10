import api from '../api';

export const DataService = {
  importData: async (importData) => {
    try {
      const response = await api.post('/superadmin/data/import', importData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getImportStatus: async (jobId) => {
    try {
      const response = await api.get(`/superadmin/data/import-status/${jobId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportData: async (exportData) => {
    try {
      const response = await api.post('/superadmin/data/export', exportData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getExportStatus: async (jobId) => {
    try {
      const response = await api.get(`/superadmin/data/export-status/${jobId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default DataService;
