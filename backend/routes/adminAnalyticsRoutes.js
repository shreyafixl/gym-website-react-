const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getRevenueAnalytics,
  getMemberAnalytics,
  getAttendanceAnalytics,
  getClassAnalytics,
} = require('../controllers/adminAnalyticsController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @route   GET /api/admin/analytics/dashboard
 * @desc    Get dashboard KPIs and overview analytics
 * @access  Private (Admin)
 */
router.get('/dashboard', protectAdmin, getDashboardAnalytics);

/**
 * @route   GET /api/admin/analytics/revenue
 * @desc    Get revenue analytics with chart data
 * @access  Private (Admin)
 */
router.get('/revenue', protectAdmin, getRevenueAnalytics);

/**
 * @route   GET /api/admin/analytics/members
 * @desc    Get member analytics with growth trends
 * @access  Private (Admin)
 */
router.get('/members', protectAdmin, getMemberAnalytics);

/**
 * @route   GET /api/admin/analytics/attendance
 * @desc    Get attendance analytics
 * @access  Private (Admin)
 */
router.get('/attendance', protectAdmin, getAttendanceAnalytics);

/**
 * @route   GET /api/admin/analytics/classes
 * @desc    Get class/session analytics
 * @access  Private (Admin)
 */
router.get('/classes', protectAdmin, getClassAnalytics);

module.exports = router;
