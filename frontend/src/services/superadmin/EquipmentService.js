import api from '../api';

export const EquipmentService = {
  getEquipment: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/equipment?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEquipmentById: async (equipmentId) => {
    try {
      const response = await api.get(`/superadmin/equipment/${equipmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createEquipment: async (equipmentData) => {
    try {
      const response = await api.post('/superadmin/equipment', equipmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEquipment: async (equipmentId, equipmentData) => {
    try {
      const response = await api.put(`/superadmin/equipment/${equipmentId}`, equipmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteEquipment: async (equipmentId) => {
    try {
      const response = await api.delete(`/superadmin/equipment/${equipmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default EquipmentService;
