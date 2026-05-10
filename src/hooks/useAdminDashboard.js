import { useState, useCallback, useEffect } from 'react';
import {
  adminAnalyticsAPI,
  adminUserAPI,
  adminTrainerAPI,
  adminAttendanceAPI,
} from '../services/adminService';

/**
 * Custom hook for admin dashboard data management
 * Handles fetching, caching, and state management for all admin operations
 */
export function useAdminDashboard() {
  // ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  const fetchDashboardOverview = useCallback(async () => {
    setDashboardLoading(true);
    setDashboardError(null);
    try {
      const response = await adminAnalyticsAPI.getDashboardOverview();
      setDashboardData(response.data);
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to fetch dashboard data';
      setDashboardError(null); // Don't show error to user, use calculated values instead
      console.warn('Dashboard overview API not available, will use calculated values:', errorMsg);
      return null;
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  // ─── MEMBERS / USERS ──────────────────────────────────────────────────────
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);
  const [membersPagination, setMembersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasMore: false,
  });

  const fetchMembers = useCallback(async (page = 1, limit = 10, filters = {}) => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const response = await adminUserAPI.getAllUsers(page, limit, filters);
      setMembers(response.data.users || []);
      setMembersPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        hasMore: false,
      });
      return response.data;
    } catch (error) {
      // If network error, use empty array as fallback
      console.warn('Failed to fetch members, using empty array:', error.message);
      setMembers([]);
      setMembersError(null); // Don't show error to user
      return { data: { users: [], pagination: { currentPage: 1, totalPages: 1, totalUsers: 0, hasMore: false } } };
    } finally {
      setMembersLoading(false);
    }
  }, []);

  const createMember = useCallback(async (memberData) => {
    try {
      const response = await adminUserAPI.createUser(memberData);
      // Add new member to list
      setMembers(prev => [response.data.user, ...prev]);
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to create member';
      console.error('Create member error:', error);
      throw error;
    }
  }, []);

  const updateMember = useCallback(async (memberId, memberData) => {
    try {
      const response = await adminUserAPI.updateUser(memberId, memberData);
      // Update member in list
      setMembers(prev =>
        prev.map(m => m._id === memberId ? response.data.user : m)
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to update member';
      console.error('Update member error:', error);
      throw error;
    }
  }, []);

  const deleteMember = useCallback(async (memberId) => {
    try {
      const response = await adminUserAPI.deleteUser(memberId);
      // Remove member from list
      setMembers(prev => prev.filter(m => m._id !== memberId));
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to delete member';
      console.error('Delete member error:', error);
      throw error;
    }
  }, []);

  // ─── TRAINERS ─────────────────────────────────────────────────────────────
  const [trainers, setTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(false);
  const [trainersError, setTrainersError] = useState(null);
  const [trainersPagination, setTrainersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTrainers: 0,
    hasMore: false,
  });

  const fetchTrainers = useCallback(async (page = 1, limit = 10, filters = {}) => {
    setTrainersLoading(true);
    setTrainersError(null);
    try {
      const response = await adminTrainerAPI.getAllTrainers(page, limit, filters);
      setTrainers(response.data.trainers || []);
      setTrainersPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalTrainers: 0,
        hasMore: false,
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch trainers, using empty array:', error.message);
      setTrainers([]);
      setTrainersError(null);
      return { data: { trainers: [], pagination: { currentPage: 1, totalPages: 1, totalTrainers: 0, hasMore: false } } };
    } finally {
      setTrainersLoading(false);
    }
  }, []);

  const createTrainer = useCallback(async (trainerData) => {
    try {
      const response = await adminTrainerAPI.createTrainer(trainerData);
      // Add new trainer to list
      setTrainers(prev => [response.data.trainer, ...prev]);
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to create trainer';
      console.error('Create trainer error:', error);
      throw error;
    }
  }, []);

  const updateTrainer = useCallback(async (trainerId, trainerData) => {
    try {
      const response = await adminTrainerAPI.updateTrainer(trainerId, trainerData);
      // Update trainer in list
      setTrainers(prev =>
        prev.map(t => t._id === trainerId ? response.data.trainer : t)
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to update trainer';
      console.error('Update trainer error:', error);
      throw error;
    }
  }, []);

  const deleteTrainer = useCallback(async (trainerId) => {
    try {
      const response = await adminTrainerAPI.deleteTrainer(trainerId);
      // Remove trainer from list
      setTrainers(prev => prev.filter(t => t._id !== trainerId));
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to delete trainer';
      console.error('Delete trainer error:', error);
      throw error;
    }
  }, []);

  // ─── ATTENDANCE ────────────────────────────────────────────────────────────
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState(null);
  const [attendancePagination, setAttendancePagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasMore: false,
  });

  const fetchAttendance = useCallback(async (page = 1, limit = 10, filters = {}) => {
    setAttendanceLoading(true);
    setAttendanceError(null);
    try {
      const response = await adminAttendanceAPI.getAllAttendance(page, limit, filters);
      setAttendance(response.data.attendance || response.data.records || []);
      setAttendancePagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasMore: false,
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch attendance, using empty array:', error.message);
      setAttendance([]);
      setAttendanceError(null);
      return { data: { attendance: [], pagination: { currentPage: 1, totalPages: 1, totalRecords: 0, hasMore: false } } };
    } finally {
      setAttendanceLoading(false);
    }
  }, []);

  const createAttendance = useCallback(async (attendanceData) => {
    try {
      const response = await adminAttendanceAPI.createAttendance(attendanceData);
      // Add new attendance record to list
      setAttendance(prev => [response.data.attendance, ...prev]);
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to create attendance record';
      console.error('Create attendance error:', error);
      throw error;
    }
  }, []);

  const updateAttendance = useCallback(async (attendanceId, attendanceData) => {
    try {
      const response = await adminAttendanceAPI.updateAttendance(attendanceId, attendanceData);
      // Update attendance in list
      setAttendance(prev =>
        prev.map(a => a._id === attendanceId ? response.data.attendance : a)
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to update attendance record';
      console.error('Update attendance error:', error);
      throw error;
    }
  }, []);

  const deleteAttendance = useCallback(async (attendanceId) => {
    try {
      const response = await adminAttendanceAPI.deleteAttendance(attendanceId);
      // Remove attendance from list
      setAttendance(prev => prev.filter(a => a._id !== attendanceId));
      return response.data;
    } catch (error) {
      const errorMsg = error.message || 'Failed to delete attendance record';
      console.error('Delete attendance error:', error);
      throw error;
    }
  }, []);

  return {
    // Dashboard Overview
    dashboardData,
    dashboardLoading,
    dashboardError,
    fetchDashboardOverview,

    // Members
    members,
    membersLoading,
    membersError,
    membersPagination,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,

    // Trainers
    trainers,
    trainersLoading,
    trainersError,
    trainersPagination,
    fetchTrainers,
    createTrainer,
    updateTrainer,
    deleteTrainer,

    // Attendance
    attendance,
    attendanceLoading,
    attendanceError,
    attendancePagination,
    fetchAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
  };
}

export default useAdminDashboard;
