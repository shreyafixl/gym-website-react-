const express = require('express');
const router = express.Router();
const {
  getAllMemberships,
  createMembership,
  renewMembership,
  getMembershipStats,
  getAllMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} = require('../controllers/adminMembershipController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

// Membership routes
/**
 * @route   GET /api/admin/memberships/stats
 * @desc    Get membership statistics
 * @access  Private (Admin)
 */
router.get('/memberships/stats', protectAdmin, getMembershipStats);

/**
 * @route   GET /api/admin/memberships
 * @desc    Get all memberships with filtering
 * @access  Private (Admin)
 */
router.get('/memberships', protectAdmin, getAllMemberships);

/**
 * @route   POST /api/admin/memberships
 * @desc    Create new membership
 * @access  Private (Admin)
 */
router.post('/memberships', protectAdmin, createMembership);

/**
 * @route   POST /api/admin/memberships/:id/renew
 * @desc    Renew membership
 * @access  Private (Admin)
 */
router.post('/memberships/:id/renew', protectAdmin, renewMembership);

// Membership Plan routes
/**
 * @route   GET /api/admin/membership-plans
 * @desc    Get all membership plans
 * @access  Private (Admin)
 */
router.get('/membership-plans', protectAdmin, getAllMembershipPlans);

/**
 * @route   POST /api/admin/membership-plans
 * @desc    Create membership plan
 * @access  Private (Admin)
 */
router.post('/membership-plans', protectAdmin, createMembershipPlan);

/**
 * @route   PUT /api/admin/membership-plans/:id
 * @desc    Update membership plan
 * @access  Private (Admin)
 */
router.put('/membership-plans/:id', protectAdmin, updateMembershipPlan);

/**
 * @route   DELETE /api/admin/membership-plans/:id
 * @desc    Delete membership plan
 * @access  Private (Admin)
 */
router.delete('/membership-plans/:id', protectAdmin, deleteMembershipPlan);

module.exports = router;
