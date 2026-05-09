const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  getAttendanceHistory,
  getAttendanceStats,
  getAttendanceByDateRange,
  getMonthlyAttendance,
} = require('../controllers/memberAttendanceController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/attendance/stats/overview
 * @desc    Get attendance statistics overview
 * @query   startDate - Start date for filtering (optional)
 * @query   endDate - End date for filtering (optional)
 * @access  Private (Member only)
 */
router.get('/stats/overview', getAttendanceStats);

/**
 * @route   GET /api/member/attendance/monthly
 * @desc    Get monthly attendance summary
 * @query   month - Month number (1-12, default: current month)
 * @query   year - Year (default: current year)
 * @access  Private (Member only)
 */
router.get('/monthly', getMonthlyAttendance);

/**
 * @route   GET /api/member/attendance/range
 * @desc    Get attendance records by date range
 * @query   startDate - Start date (required)
 * @query   endDate - End date (required)
 * @access  Private (Member only)
 */
router.get('/range', getAttendanceByDateRange);

/**
 * @route   GET /api/member/attendance
 * @desc    Get attendance history with pagination and filtering
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @query   startDate - Start date for filtering (optional)
 * @query   endDate - End date for filtering (optional)
 * @query   status - Filter by status (present, absent, late, leave)
 * @access  Private (Member only)
 */
router.get('/', getAttendanceHistory);

module.exports = router;
