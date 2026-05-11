import api from './api';

/**
 * SuperAdmin API Service
 * All endpoints require superadmin authentication
 */

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export const superAdminUserAPI = {
  // Get all users
  getAllUsers: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/users', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/superadmin/users', userData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/superadmin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/superadmin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting user:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/superadmin/users/stats');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching user stats:', error);
      throw error;
    }
  },
};

// ============================================================================
// BRANCH MANAGEMENT
// ============================================================================

export const superAdminBranchAPI = {
  // Get all branches
  getAllBranches: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/branches', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching branches:', error);
      throw error;
    }
  },

  // Get branch by ID
  getBranchById: async (branchId) => {
    try {
      const response = await api.get(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching branch:', error);
      throw error;
    }
  },

  // Create new branch
  createBranch: async (branchData) => {
    try {
      const response = await api.post('/superadmin/branches', branchData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating branch:', error);
      throw error;
    }
  },

  // Update branch
  updateBranch: async (branchId, branchData) => {
    try {
      const response = await api.put(`/superadmin/branches/${branchId}`, branchData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating branch:', error);
      throw error;
    }
  },

  // Delete branch
  deleteBranch: async (branchId) => {
    try {
      const response = await api.delete(`/superadmin/branches/${branchId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting branch:', error);
      throw error;
    }
  },
};

// ============================================================================
// FINANCIAL MANAGEMENT
// ============================================================================

export const superAdminFinancialAPI = {
  // Get financial statistics
  getFinancialStats: async () => {
    try {
      const response = await api.get('/superadmin/financial/stats');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching financial stats:', error);
      throw error;
    }
  },

  // Get all membership plans
  getAllPlans: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/financial/plans', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching plans:', error);
      throw error;
    }
  },

  // Get plan by ID
  getPlanById: async (planId) => {
    try {
      const response = await api.get(`/superadmin/financial/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching plan:', error);
      throw error;
    }
  },

  // Create new plan
  createPlan: async (planData) => {
    try {
      const response = await api.post('/superadmin/financial/plans', planData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating plan:', error);
      throw error;
    }
  },

  // Update plan
  updatePlan: async (planId, planData) => {
    try {
      const response = await api.put(`/superadmin/financial/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error updating plan:', error);
      throw error;
    }
  },

  // Delete plan
  deletePlan: async (planId) => {
    try {
      const response = await api.delete(`/superadmin/financial/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error deleting plan:', error);
      throw error;
    }
  },

  // Get all subscriptions
  getAllSubscriptions: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/financial/subscriptions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching subscriptions:', error);
      throw error;
    }
  },

  // Get subscription by ID
  getSubscriptionById: async (subscriptionId) => {
    try {
      const response = await api.get(`/superadmin/financial/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching subscription:', error);
      throw error;
    }
  },

  // Create new subscription
  createSubscription: async (subscriptionData) => {
    try {
      const response = await api.post('/superadmin/financial/subscriptions', subscriptionData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating subscription:', error);
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const response = await api.patch(`/superadmin/financial/subscriptions/${subscriptionId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error canceling subscription:', error);
      throw error;
    }
  },

  // Get all transactions
  getAllTransactions: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/financial/transactions', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching transactions:', error);
      throw error;
    }
  },

  // Get transaction by ID
  getTransactionById: async (transactionId) => {
    try {
      const response = await api.get(`/superadmin/financial/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching transaction:', error);
      throw error;
    }
  },

  // Create new transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/superadmin/financial/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error creating transaction:', error);
      throw error;
    }
  },
};

// ============================================================================
// ANALYTICS
// ============================================================================

export const superAdminAnalyticsAPI = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/superadmin/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get user growth analytics
  getUserGrowthAnalytics: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/user-growth', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching user growth analytics:', error);
      throw error;
    }
  },

  // Get attendance statistics
  getAttendanceStatistics: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/attendance', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching attendance statistics:', error);
      throw error;
    }
  },

  // Get branch analytics
  getBranchAnalytics: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/branches', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching branch analytics:', error);
      throw error;
    }
  },

  // Get trainer performance analytics
  getTrainerPerformanceAnalytics: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/trainers', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching trainer analytics:', error);
      throw error;
    }
  },

  // Get financial report
  getFinancialReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/financial', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching financial report:', error);
      throw error;
    }
  },

  // Get attendance report
  getAttendanceReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/attendance', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching attendance report:', error);
      throw error;
    }
  },

  // Get membership report
  getMembershipReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/membership', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching membership report:', error);
      throw error;
    }
  },

  // Get trainer report
  getTrainerReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/trainers', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching trainer report:', error);
      throw error;
    }
  },

  // Get branch performance report
  getBranchPerformanceReport: async (filters = {}) => {
    try {
      const response = await api.get('/superadmin/analytics/reports/branches', { params: filters });
      return response.data;
    } catch (error) {
      console.error('[SuperAdmin] Error fetching branch performance report:', error);
      throw error;
    }
  },
};

export default {
  users: superAdminUserAPI,
  branches: superAdminBranchAPI,
  financial: superAdminFinancialAPI,
  analytics: superAdminAnalyticsAPI,
};
