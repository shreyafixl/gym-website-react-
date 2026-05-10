import { useState, useCallback } from 'react';
import {
  userAPI,
  branchAPI,
  trainerAPI,
  membershipAPI,
  workoutAPI,
  communicationAPI,
  settingsAPI,
  supportAPI,
} from '../services/superAdminAPI';

/**
 * Generic mutation hook factory
 */
const useMutation = (mutationFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const mutate = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        const response = await mutationFn(...args);
        setSuccess(true);
        return response;
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { mutate, loading, error, success, reset };
};

// ─── USER MUTATIONS ───────────────────────────────────────────────────────────

export const useCreateUser = () => {
  return useMutation((userData) => userAPI.createUser(userData));
};

export const useUpdateUser = () => {
  return useMutation((userId, userData) => userAPI.updateUser(userId, userData));
};

export const useDeleteUser = () => {
  return useMutation((userId) => userAPI.deleteUser(userId));
};

export const useBulkUpdateUsers = () => {
  return useMutation((userIds, updateData) => userAPI.bulkUpdateUsers(userIds, updateData));
};

export const useExportUsers = () => {
  return useMutation((format) => userAPI.exportUsers(format));
};

// ─── BRANCH MUTATIONS ─────────────────────────────────────────────────────────

export const useCreateBranch = () => {
  return useMutation((branchData) => branchAPI.createBranch(branchData));
};

export const useUpdateBranch = () => {
  return useMutation((branchId, branchData) => branchAPI.updateBranch(branchId, branchData));
};

export const useDeleteBranch = () => {
  return useMutation((branchId) => branchAPI.deleteBranch(branchId));
};

// ─── TRAINER MUTATIONS ────────────────────────────────────────────────────────

export const useCreateTrainer = () => {
  return useMutation((trainerData) => trainerAPI.createTrainer(trainerData));
};

export const useUpdateTrainer = () => {
  return useMutation((trainerId, trainerData) => trainerAPI.updateTrainer(trainerId, trainerData));
};

export const useDeleteTrainer = () => {
  return useMutation((trainerId) => trainerAPI.deleteTrainer(trainerId));
};

// ─── MEMBERSHIP MUTATIONS ─────────────────────────────────────────────────────

export const useCreateMembership = () => {
  return useMutation((membershipData) => membershipAPI.createMembership(membershipData));
};

export const useUpdateMembership = () => {
  return useMutation((membershipId, membershipData) =>
    membershipAPI.updateMembership(membershipId, membershipData)
  );
};

export const useCancelMembership = () => {
  return useMutation((membershipId) => membershipAPI.cancelMembership(membershipId));
};

export const useCreateMembershipPlan = () => {
  return useMutation((planData) => membershipAPI.createPlan(planData));
};

export const useUpdateMembershipPlan = () => {
  return useMutation((planId, planData) => membershipAPI.updatePlan(planId, planData));
};

export const useDeleteMembershipPlan = () => {
  return useMutation((planId) => membershipAPI.deletePlan(planId));
};

// ─── WORKOUT MUTATIONS ────────────────────────────────────────────────────────

export const useCreateWorkout = () => {
  return useMutation((workoutData) => workoutAPI.createWorkout(workoutData));
};

export const useUpdateWorkout = () => {
  return useMutation((workoutId, workoutData) => workoutAPI.updateWorkout(workoutId, workoutData));
};

export const useDeleteWorkout = () => {
  return useMutation((workoutId) => workoutAPI.deleteWorkout(workoutId));
};

// ─── COMMUNICATION MUTATIONS ──────────────────────────────────────────────────

export const useSendNotification = () => {
  return useMutation((notificationData) => communicationAPI.sendNotification(notificationData));
};

export const useCreateCampaign = () => {
  return useMutation((campaignData) => communicationAPI.createCampaign(campaignData));
};

export const useUpdateCampaign = () => {
  return useMutation((campaignId, campaignData) =>
    communicationAPI.updateCampaign(campaignId, campaignData)
  );
};

export const useDeleteCampaign = () => {
  return useMutation((campaignId) => communicationAPI.deleteCampaign(campaignId));
};

export const useSendMessage = () => {
  return useMutation((messageData) => communicationAPI.sendMessage(messageData));
};

// ─── SETTINGS MUTATIONS ───────────────────────────────────────────────────────

export const useUpdateSettings = () => {
  return useMutation((settingsData) => settingsAPI.updateSettings(settingsData));
};

export const useUpdateProfile = () => {
  return useMutation((profileData) => settingsAPI.updateProfile(profileData));
};

export const useChangePassword = () => {
  return useMutation((currentPassword, newPassword) =>
    settingsAPI.changePassword(currentPassword, newPassword)
  );
};

// ─── SUPPORT MUTATIONS ────────────────────────────────────────────────────────

export const useUpdateTicket = () => {
  return useMutation((ticketId, ticketData) => supportAPI.updateTicket(ticketId, ticketData));
};

export const useAddTicketResponse = () => {
  return useMutation((ticketId, responseData) =>
    supportAPI.addTicketResponse(ticketId, responseData)
  );
};

export const useCloseTicket = () => {
  return useMutation((ticketId) => supportAPI.closeTicket(ticketId));
};
