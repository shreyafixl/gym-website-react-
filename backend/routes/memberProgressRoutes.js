const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  getProgressHistory,
  getLatestProgress,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getProgressReport,
} = require('../controllers/memberProgressController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/progress/report
 * @desc    Get progress report with 30-day comparisons
 * @access  Private (Member only)
 */
router.get('/report', getProgressReport);

/**
 * @route   GET /api/member/progress/analytics/monthly
 * @desc    Get monthly progress analytics with chart-ready data
 * @query   months - Number of months to retrieve (default: 12, max: 60)
 * @access  Private (Member only)
 */
router.get('/analytics/monthly', getMonthlyAnalytics);

/**
 * @route   GET /api/member/progress/analytics/weekly
 * @desc    Get weekly progress analytics with chart-ready data
 * @query   weeks - Number of weeks to retrieve (default: 4, max: 52)
 * @access  Private (Member only)
 */
router.get('/analytics/weekly', getWeeklyAnalytics);

/**
 * @route   GET /api/member/progress/latest
 * @desc    Get latest progress record
 * @access  Private (Member only)
 */
router.get('/latest', getLatestProgress);

/**
 * @route   GET /api/member/progress
 * @desc    Get progress history with pagination
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @access  Private (Member only)
 */
router.get('/', getProgressHistory);

module.exports = router;
