const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  getCurrentMembership,
  getMembershipHistory,
  getAvailablePlans,
  getRenewalDetails,
  requestRenewal,
  getPaymentStatus,
} = require('../controllers/memberMembershipController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/membership/payment-status
 * @desc    Get membership payment status
 * @access  Private (Member only)
 */
router.get('/payment-status', getPaymentStatus);

/**
 * @route   GET /api/member/membership/renewal
 * @desc    Get membership renewal request details
 * @access  Private (Member only)
 */
router.get('/renewal', getRenewalDetails);

/**
 * @route   GET /api/member/membership/plans
 * @desc    Get available membership plans
 * @query   category - Filter by category (basic, standard, premium, vip)
 * @access  Private (Member only)
 */
router.get('/plans', getAvailablePlans);

/**
 * @route   GET /api/member/membership/history
 * @desc    Get membership history with pagination
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @access  Private (Member only)
 */
router.get('/history', getMembershipHistory);

/**
 * @route   GET /api/member/membership/current
 * @desc    Get current membership details
 * @access  Private (Member only)
 */
router.get('/current', getCurrentMembership);

/**
 * @route   POST /api/member/membership/renewal-request
 * @desc    Request membership renewal
 * @body    planId - Membership plan ID (required)
 * @body    paymentMethod - Payment method (cash, card, upi, net-banking, other)
 * @access  Private (Member only)
 */
router.post('/renewal-request', requestRenewal);

module.exports = router;
