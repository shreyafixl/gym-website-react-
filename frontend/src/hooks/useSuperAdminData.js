import { useState, useEffect, useCallback } from 'react';
import {
  dashboardAPI,
  userAPI,
  branchAPI,
  trainerAPI,
  membershipAPI,
  workoutAPI,
  attendanceAPI,
  communicationAPI,
  reportsAPI,
  settingsAPI,
  supportAPI,
} from '../services/superAdminAPI';

/**
 * Custom hook for fetching dashboard overview data
 */
export const useDashboardOverview = (startDate, endDate) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getOverview();
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard overview');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching users
 */
export const useUsers = (page = 1, limit = 10, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getAllUsers(page, limit, filters);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching branches
 */
export const useBranches = (page = 1, limit = 10) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await branchAPI.getAllBranches(page, limit);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch branches');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching trainers
 */
export const useTrainers = (page = 1, limit = 10, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await trainerAPI.getAllTrainers(page, limit, filters);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch trainers');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching memberships
 */
export const useMemberships = (page = 1, limit = 10) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await membershipAPI.getAllMemberships(page, limit);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch memberships');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching membership plans
 */
export const useMembershipPlans = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await membershipAPI.getAllPlans();
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch membership plans');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching workouts
 */
export const useWorkouts = (page = 1, limit = 10, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workoutAPI.getAllWorkouts(page, limit, filters);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch workouts');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching attendance records
 */
export const useAttendance = (page = 1, limit = 10, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceAPI.getAllAttendance(page, limit, filters);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch attendance');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching notifications
 */
export const useNotifications = (page = 1, limit = 10) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communicationAPI.getAllNotifications(page, limit);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch notifications');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching campaigns
 */
export const useCampaigns = (page = 1, limit = 10) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communicationAPI.getAllCampaigns(page, limit);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch campaigns');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching reports
 */
export const useReports = (reportType = 'financial', period = 'monthly') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      switch (reportType) {
        case 'financial':
          response = await reportsAPI.getFinancialReports(period);
          break;
        case 'members':
          response = await reportsAPI.getMemberAnalytics(period);
          break;
        case 'attendance':
          response = await reportsAPI.getAttendanceReports(period);
          break;
        case 'revenue':
          response = await reportsAPI.getRevenueReports(period);
          break;
        default:
          response = await reportsAPI.getFinancialReports(period);
      }
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch reports');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [reportType, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching support tickets
 */
export const useSupportTickets = (page = 1, limit = 10, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supportAPI.getAllTickets(page, limit, filters);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch support tickets');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching settings
 */
export const useSettings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsAPI.getSettings();
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch settings');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching admin profile
 */
export const useAdminProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsAPI.getProfile();
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch profile');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching audit logs
 */
export const useAuditLogs = (page = 1, limit = 10) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsAPI.getAuditLogs(page, limit);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch audit logs');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching login history
 */
export const useLoginHistory = (page = 1, limit = 10) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsAPI.getLoginHistory(page, limit);
      setData(response.data || response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch login history');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
