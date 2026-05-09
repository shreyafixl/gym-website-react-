import { useState, useEffect, useCallback } from 'react';
import superAdminService from '../services/superAdminService';

/**
 * Custom hook for managing Super Admin Dashboard data
 * Handles fetching, caching, and refetching data
 */

export const useDashboardData = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
};

// ─── SPECIFIC HOOKS ───────────────────────────────────────────────────────────

export const useOverview = (startDate, endDate) => {
  return useDashboardData(
    () => superAdminService.getOverview(startDate, endDate),
    [startDate, endDate]
  );
};

export const useUsers = (page = 1, limit = 10, filters = {}) => {
  return useDashboardData(
    () => superAdminService.getUsers(page, limit, filters),
    [page, limit, JSON.stringify(filters)]
  );
};

export const useBranches = (page = 1, limit = 10) => {
  return useDashboardData(
    () => superAdminService.getBranches(page, limit),
    [page, limit]
  );
};

export const useTrainers = (page = 1, limit = 10, filters = {}) => {
  return useDashboardData(
    () => superAdminService.getTrainers(page, limit, filters),
    [page, limit, JSON.stringify(filters)]
  );
};

export const useMemberships = (page = 1, limit = 10) => {
  return useDashboardData(
    () => superAdminService.getMemberships(page, limit),
    [page, limit]
  );
};

export const useMembershipPlans = () => {
  return useDashboardData(
    () => superAdminService.getMembershipPlans(),
    []
  );
};

export const useWorkouts = (page = 1, limit = 10, filters = {}) => {
  return useDashboardData(
    () => superAdminService.getWorkouts(page, limit, filters),
    [page, limit, JSON.stringify(filters)]
  );
};

export const useAttendance = (page = 1, limit = 10, filters = {}) => {
  return useDashboardData(
    () => superAdminService.getAttendance(page, limit, filters),
    [page, limit, JSON.stringify(filters)]
  );
};

export const useFinancialReports = (period = 'monthly') => {
  return useDashboardData(
    () => superAdminService.getFinancialReports(period),
    [period]
  );
};

export const useAnalytics = (type = 'overview', startDate, endDate) => {
  return useDashboardData(
    () => superAdminService.getAnalytics(type, startDate, endDate),
    [type, startDate, endDate]
  );
};

export const useNotifications = (page = 1, limit = 10) => {
  return useDashboardData(
    () => superAdminService.getNotifications(page, limit),
    [page, limit]
  );
};

export const useCampaigns = (page = 1, limit = 10) => {
  return useDashboardData(
    () => superAdminService.getCampaigns(page, limit),
    [page, limit]
  );
};

export const useSupportTickets = (page = 1, limit = 10, filters = {}) => {
  return useDashboardData(
    () => superAdminService.getSupportTickets(page, limit, filters),
    [page, limit, JSON.stringify(filters)]
  );
};

export const useSettings = () => {
  return useDashboardData(
    () => superAdminService.getSettings(),
    []
  );
};

export const useAuditLogs = (page = 1, limit = 10) => {
  return useDashboardData(
    () => superAdminService.getAuditLogs(page, limit),
    [page, limit]
  );
};

export const useLoginHistory = (page = 1, limit = 10) => {
  return useDashboardData(
    () => superAdminService.getLoginHistory(page, limit),
    [page, limit]
  );
};

// ─── MUTATION HOOKS ───────────────────────────────────────────────────────────

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.createUser(userData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create user';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (userId, userData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.updateUser(userId, userData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update user';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
};

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.deleteUser(userId);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete user';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { delete: deleteUser, loading, error };
};

export const useCreateBranch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (branchData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.createBranch(branchData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create branch';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};

export const useUpdateBranch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (branchId, branchData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.updateBranch(branchId, branchData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update branch';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
};

export const useDeleteBranch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteBranch = useCallback(async (branchId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.deleteBranch(branchId);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete branch';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { delete: deleteBranch, loading, error };
};

export const useCreateTrainer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (trainerData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.createTrainer(trainerData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create trainer';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};

export const useUpdateTrainer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (trainerId, trainerData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.updateTrainer(trainerId, trainerData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update trainer';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
};

export const useDeleteTrainer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteTrainer = useCallback(async (trainerId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.deleteTrainer(trainerId);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete trainer';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { delete: deleteTrainer, loading, error };
};

export const useCreateMembership = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (membershipData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.createMembership(membershipData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create membership';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};

export const useUpdateMembership = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (membershipId, membershipData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.updateMembership(membershipId, membershipData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update membership';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
};

export const useDeleteMembership = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMembership = useCallback(async (membershipId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.deleteMembership(membershipId);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete membership';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { delete: deleteMembership, loading, error };
};

export const useCreateWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (workoutData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.createWorkout(workoutData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create workout';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};

export const useUpdateWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (workoutId, workoutData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.updateWorkout(workoutId, workoutData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update workout';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
};

export const useDeleteWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteWorkout = useCallback(async (workoutId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.deleteWorkout(workoutId);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete workout';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { delete: deleteWorkout, loading, error };
};

export const useSendNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(async (notificationData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.sendNotification(notificationData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to send notification';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { send, loading, error };
};

export const useCreateCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (campaignData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.createCampaign(campaignData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create campaign';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
};

export const useUpdateCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (campaignId, campaignData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.updateCampaign(campaignId, campaignData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update campaign';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
};

export const useDeleteCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteCampaign = useCallback(async (campaignId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.deleteCampaign(campaignId);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete campaign';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { delete: deleteCampaign, loading, error };
};

export const useUpdateTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (ticketId, ticketData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.updateTicket(ticketId, ticketData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update ticket';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
};

export const useUpdateSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = useCallback(async (settingsData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await superAdminService.updateSettings(settingsData);
      return result;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update settings';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
};
