import api from './api';

/**
 * Admin Service - Integrates with backend admin modules
 * Handles all admin-related API calls for the admin dashboard
 */
export const adminService = {
  // ─── AUTHENTICATION ───────────────────────────────────────
  auth: {
    login: async (email, password) => {
      try {
        console.log('🔐 [Admin Auth] Login attempt:', { email });
        const response = await api.post('/admin/auth/login', { email, password });
        
        if (response.data.success) {
          const { admin, token, refreshToken } = response.data.data;
          
          // Store admin auth data
          console.log('💾 [Admin Auth] Storing tokens in localStorage:', {
            tokenLength: token?.length,
            tokenPrefix: token?.substring(0, 20) + '...',
            keys: ['gym-admin-token', 'gym-auth-token', 'gym-admin-refresh-token', 'gym-admin-user'],
          });
          
          localStorage.setItem('gym-admin-token', token);
          localStorage.setItem('gym-admin-refresh-token', refreshToken);
          localStorage.setItem('gym-admin-user', JSON.stringify(admin));
          
          // Also set the main auth token for API interceptors
          localStorage.setItem('gym-auth-token', token);
          
          // Verify storage
          const storedToken = localStorage.getItem('gym-auth-token');
          const storedAdminToken = localStorage.getItem('gym-admin-token');
          console.log('✅ [Admin Auth] Token storage verification:', {
            gymAuthTokenStored: !!storedToken,
            gymAdminTokenStored: !!storedAdminToken,
            tokensMatch: storedToken === storedAdminToken,
            storedTokenPrefix: storedToken?.substring(0, 20) + '...',
          });
          
          console.log('✅ [Admin Auth] Login successful:', { admin: admin.name, role: admin.role });
          return { success: true, data: { admin, token } };
        }
        return { success: false, error: response.data.message };
      } catch (error) {
        console.error('❌ [Admin Auth] Login failed:', error.response?.data?.message || error.message);
        return {
          success: false,
          error: error.response?.data?.message || 'Admin login failed',
        };
      }
    },

    logout: () => {
      console.log('🔓 [Admin Auth] Logging out, clearing all auth tokens');
      localStorage.removeItem('gym-admin-token');
      localStorage.removeItem('gym-admin-refresh-token');
      localStorage.removeItem('gym-admin-user');
      localStorage.removeItem('gym-auth-token');
      localStorage.removeItem('gym-auth-refresh-token');
      localStorage.removeItem('gym-auth-user');
      console.log('✅ [Admin Auth] All auth data cleared');
    },

    getCurrentAdmin: () => {
      const adminData = localStorage.getItem('gym-admin-user');
      return adminData ? JSON.parse(adminData) : null;
    },

    isAuthenticated: () => {
      const token = localStorage.getItem('gym-auth-token');
      console.log('🔍 [Admin Auth] Checking authentication:', {
        hasToken: !!token,
        tokenPrefix: token?.substring(0, 20) + '...',
      });
      return !!token;
    },
  },

  // ─── ANALYTICS & DASHBOARD ──────────────────────────────────
  analytics: {
    getDashboardKPIs: async (period = 'month') => {
      try {
        const response = await api.get(`/admin/analytics/dashboard?period=${period}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Analytics] Failed to fetch dashboard KPIs:', error);
        throw error;
      }
    },

    getRevenueTrends: async (period = 'year') => {
      try {
        const response = await api.get(`/admin/analytics/revenue?period=${period}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Analytics] Failed to fetch revenue trends:', error);
        throw error;
      }
    },

    getMemberGrowth: async (period = 'year') => {
      try {
        const response = await api.get(`/admin/analytics/member-growth?period=${period}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Analytics] Failed to fetch member growth:', error);
        throw error;
      }
    },

    getAttendanceAnalytics: async (period = 'month') => {
      try {
        const response = await api.get(`/admin/analytics/attendance?period=${period}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Analytics] Failed to fetch attendance analytics:', error);
        throw error;
      }
    },
  },

  // ─── USER MANAGEMENT ───────────────────────────────────────
  users: {
    getAll: async (params = {}) => {
      try {
        const {
          page = 1,
          limit = 10,
          search = '',
          role = '',
          membershipStatus = '',
          membershipPlan = '',
          gender = '',
          isActive = '',
          sortBy = 'createdAt',
          order = 'desc',
        } = params;

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          order,
        });

        if (search) queryParams.append('search', search);
        if (role) queryParams.append('role', role);
        if (membershipStatus) queryParams.append('membershipStatus', membershipStatus);
        if (membershipPlan) queryParams.append('membershipPlan', membershipPlan);
        if (gender) queryParams.append('gender', gender);
        if (isActive) queryParams.append('isActive', isActive);

        const response = await api.get(`/admin/users?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Users] Failed to fetch users:', error);
        throw error;
      }
    },

    getById: async (userId) => {
      try {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Users] Failed to fetch user:', error);
        throw error;
      }
    },

    create: async (userData) => {
      try {
        const response = await api.post('/admin/users', userData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Users] Failed to create user:', error);
        throw error;
      }
    },

    update: async (userId, userData) => {
      try {
        const response = await api.put(`/admin/users/${userId}`, userData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Users] Failed to update user:', error);
        throw error;
      }
    },

    delete: async (userId) => {
      try {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Users] Failed to delete user:', error);
        throw error;
      }
    },

    getStats: async () => {
      try {
        const response = await api.get('/admin/users/stats');
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Users] Failed to fetch user stats:', error);
        throw error;
      }
    },

    bulkUpdate: async (updates) => {
      try {
        const response = await api.put('/admin/users/bulk-update', { updates });
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Users] Failed to bulk update users:', error);
        throw error;
      }
    },

    export: async (format = 'csv') => {
      try {
        const response = await api.get(`/admin/users/export?format=${format}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Users] Failed to export users:', error);
        throw error;
      }
    },
  },

  // ─── MEMBERSHIP MANAGEMENT ───────────────────────────────────
  memberships: {
    getAll: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params);
        const response = await api.get(`/admin/memberships?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Memberships] Failed to fetch memberships:', error);
        throw error;
      }
    },

    getById: async (membershipId) => {
      try {
        const response = await api.get(`/admin/memberships/${membershipId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Memberships] Failed to fetch membership:', error);
        throw error;
      }
    },

    create: async (membershipData) => {
      try {
        const response = await api.post('/admin/memberships', membershipData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Memberships] Failed to create membership:', error);
        throw error;
      }
    },

    update: async (membershipId, membershipData) => {
      try {
        const response = await api.put(`/admin/memberships/${membershipId}`, membershipData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Memberships] Failed to update membership:', error);
        throw error;
      }
    },

    cancel: async (membershipId) => {
      try {
        const response = await api.post(`/admin/memberships/${membershipId}/cancel`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Memberships] Failed to cancel membership:', error);
        throw error;
      }
    },

    renew: async (membershipId, renewalData) => {
      try {
        const response = await api.post(`/admin/memberships/${membershipId}/renew`, renewalData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Memberships] Failed to renew membership:', error);
        throw error;
      }
    },

    getStats: async () => {
      try {
        const response = await api.get('/admin/memberships/stats');
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Memberships] Failed to fetch membership stats:', error);
        throw error;
      }
    },
  },

  // ─── ATTENDANCE MANAGEMENT ───────────────────────────────────
  attendance: {
    getLogs: async (params = {}) => {
      try {
        const {
          page = 1,
          limit = 10,
          search = '',
          dateFrom,
          dateTo,
          memberId,
        } = params;

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) queryParams.append('search', search);
        if (dateFrom) queryParams.append('dateFrom', dateFrom);
        if (dateTo) queryParams.append('dateTo', dateTo);
        if (memberId) queryParams.append('memberId', memberId);

        const response = await api.get(`/admin/attendance/logs?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Attendance] Failed to fetch attendance logs:', error);
        throw error;
      }
    },

    getTodayStats: async () => {
      try {
        const response = await api.get('/admin/attendance/today');
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Attendance] Failed to fetch today stats:', error);
        throw error;
      }
    },

    getWeeklyStats: async () => {
      try {
        const response = await api.get('/admin/attendance/weekly');
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Attendance] Failed to fetch weekly stats:', error);
        throw error;
      }
    },

    checkIn: async (memberId, checkInData = {}) => {
      try {
        const response = await api.post(`/admin/attendance/checkin/${memberId}`, checkInData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Attendance] Failed to check in member:', error);
        throw error;
      }
    },

    checkOut: async (attendanceId) => {
      try {
        const response = await api.post(`/admin/attendance/checkout/${attendanceId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Attendance] Failed to check out member:', error);
        throw error;
      }
    },

    getLiveCheckins: async () => {
      try {
        const response = await api.get('/admin/attendance/live');
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Attendance] Failed to fetch live check-ins:', error);
        throw error;
      }
    },
  },

  // ─── TRAINER MANAGEMENT ───────────────────────────────────────
  trainers: {
    getAll: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params);
        const response = await api.get(`/admin/trainers?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Trainers] Failed to fetch trainers:', error);
        throw error;
      }
    },

    getById: async (trainerId) => {
      try {
        const response = await api.get(`/admin/trainers/${trainerId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Trainers] Failed to fetch trainer:', error);
        throw error;
      }
    },

    create: async (trainerData) => {
      try {
        const response = await api.post('/admin/trainers', trainerData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Trainers] Failed to create trainer:', error);
        throw error;
      }
    },

    update: async (trainerId, trainerData) => {
      try {
        const response = await api.put(`/admin/trainers/${trainerId}`, trainerData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Trainers] Failed to update trainer:', error);
        throw error;
      }
    },

    delete: async (trainerId) => {
      try {
        const response = await api.delete(`/admin/trainers/${trainerId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Trainers] Failed to delete trainer:', error);
        throw error;
      }
    },

    assignClient: async (trainerId, memberId, assignmentData) => {
      try {
        const response = await api.post(`/admin/trainers/${trainerId}/assign-client`, {
          memberId,
          ...assignmentData,
        });
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Trainers] Failed to assign client:', error);
        throw error;
      }
    },

    getPerformance: async (trainerId, period = 'month') => {
      try {
        const response = await api.get(`/admin/trainers/${trainerId}/performance?period=${period}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Trainers] Failed to fetch trainer performance:', error);
        throw error;
      }
    },
  },

  // ─── BRANCH MANAGEMENT ───────────────────────────────────────
  branches: {
    getAll: async () => {
      try {
        const response = await api.get('/admin/branches');
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Branches] Failed to fetch branches:', error);
        throw error;
      }
    },

    getById: async (branchId) => {
      try {
        const response = await api.get(`/admin/branches/${branchId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Branches] Failed to fetch branch:', error);
        throw error;
      }
    },

    create: async (branchData) => {
      try {
        const response = await api.post('/admin/branches', branchData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Branches] Failed to create branch:', error);
        throw error;
      }
    },

    update: async (branchId, branchData) => {
      try {
        const response = await api.put(`/admin/branches/${branchId}`, branchData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Branches] Failed to update branch:', error);
        throw error;
      }
    },

    delete: async (branchId) => {
      try {
        const response = await api.delete(`/admin/branches/${branchId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Branches] Failed to delete branch:', error);
        throw error;
      }
    },
  },

  // ─── SCHEDULE MANAGEMENT ─────────────────────────────────────
  schedules: {
    getAll: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params);
        const response = await api.get(`/admin/schedules?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Schedules] Failed to fetch schedules:', error);
        throw error;
      }
    },

    getById: async (scheduleId) => {
      try {
        const response = await api.get(`/admin/schedules/${scheduleId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Schedules] Failed to fetch schedule:', error);
        throw error;
      }
    },

    create: async (scheduleData) => {
      try {
        const response = await api.post('/admin/schedules', scheduleData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Schedules] Failed to create schedule:', error);
        throw error;
      }
    },

    update: async (scheduleId, scheduleData) => {
      try {
        const response = await api.put(`/admin/schedules/${scheduleId}`, scheduleData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Schedules] Failed to update schedule:', error);
        throw error;
      }
    },

    delete: async (scheduleId) => {
      try {
        const response = await api.delete(`/admin/schedules/${scheduleId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Schedules] Failed to delete schedule:', error);
        throw error;
      }
    },

    getWeekly: async (branchId) => {
      try {
        const url = branchId ? `/admin/schedules/weekly?branchId=${branchId}` : '/admin/schedules/weekly';
        const response = await api.get(url);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Schedules] Failed to fetch weekly schedule:', error);
        throw error;
      }
    },
  },

  // ─── WORKOUT PLANS ───────────────────────────────────────────
  workouts: {
    getAll: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params);
        const response = await api.get(`/admin/workouts?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Workouts] Failed to fetch workout plans:', error);
        throw error;
      }
    },

    getById: async (workoutId) => {
      try {
        const response = await api.get(`/admin/workouts/${workoutId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Workouts] Failed to fetch workout plan:', error);
        throw error;
      }
    },

    create: async (workoutData) => {
      try {
        const response = await api.post('/admin/workouts', workoutData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Workouts] Failed to create workout plan:', error);
        throw error;
      }
    },

    update: async (workoutId, workoutData) => {
      try {
        const response = await api.put(`/admin/workouts/${workoutId}`, workoutData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Workouts] Failed to update workout plan:', error);
        throw error;
      }
    },

    delete: async (workoutId) => {
      try {
        const response = await api.delete(`/admin/workouts/${workoutId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Workouts] Failed to delete workout plan:', error);
        throw error;
      }
    },

    assignToMember: async (workoutId, memberId, assignmentData) => {
      try {
        const response = await api.post(`/admin/workouts/${workoutId}/assign/${memberId}`, assignmentData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Workouts] Failed to assign workout to member:', error);
        throw error;
      }
    },
  },

  // ─── COMMUNICATION ───────────────────────────────────────────
  communication: {
    sendNotification: async (notificationData) => {
      try {
        const response = await api.post('/admin/communication/notifications', notificationData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Communication] Failed to send notification:', error);
        throw error;
      }
    },

    sendAnnouncement: async (announcementData) => {
      try {
        const response = await api.post('/admin/communication/announcements', announcementData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Communication] Failed to send announcement:', error);
        throw error;
      }
    },

    getNotifications: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params);
        const response = await api.get(`/admin/communication/notifications?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Communication] Failed to fetch notifications:', error);
        throw error;
      }
    },

    getAnnouncements: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params);
        const response = await api.get(`/admin/communication/announcements?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Communication] Failed to fetch announcements:', error);
        throw error;
      }
    },

    markAsRead: async (notificationId) => {
      try {
        const response = await api.put(`/admin/communication/notifications/${notificationId}/read`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Communication] Failed to mark notification as read:', error);
        throw error;
      }
    },
  },

  // ─── SUPPORT TICKETS ───────────────────────────────────────────
  support: {
    getAll: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams(params);
        const response = await api.get(`/admin/support/tickets?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Support] Failed to fetch support tickets:', error);
        throw error;
      }
    },

    getById: async (ticketId) => {
      try {
        const response = await api.get(`/admin/support/tickets/${ticketId}`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Support] Failed to fetch support ticket:', error);
        throw error;
      }
    },

    update: async (ticketId, updateData) => {
      try {
        const response = await api.put(`/admin/support/tickets/${ticketId}`, updateData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Support] Failed to update support ticket:', error);
        throw error;
      }
    },

    respond: async (ticketId, responseData) => {
      try {
        const response = await api.post(`/admin/support/tickets/${ticketId}/respond`, responseData);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Support] Failed to respond to support ticket:', error);
        throw error;
      }
    },

    escalate: async (ticketId) => {
      try {
        const response = await api.post(`/admin/support/tickets/${ticketId}/escalate`);
        return response.data;
      } catch (error) {
        console.error('❌ [Admin Support] Failed to escalate support ticket:', error);
        throw error;
      }
    },
  },
};

export default adminService;
