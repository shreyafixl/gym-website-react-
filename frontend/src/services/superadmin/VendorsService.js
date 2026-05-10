import api from '../api';

export const VendorsService = {
  getVendors: async (page = 1, perPage = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({ page, per_page: perPage, ...filters });
      const response = await api.get(`/superadmin/vendors?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVendorById: async (vendorId) => {
    try {
      const response = await api.get(`/superadmin/vendors/${vendorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createVendor: async (vendorData) => {
    try {
      const response = await api.post('/superadmin/vendors', vendorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateVendor: async (vendorId, vendorData) => {
    try {
      const response = await api.put(`/superadmin/vendors/${vendorId}`, vendorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteVendor: async (vendorId) => {
    try {
      const response = await api.delete(`/superadmin/vendors/${vendorId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default VendorsService;
