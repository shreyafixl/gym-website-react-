const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  getDashboardOverview,
  getMembershipDetails,
  getAttendanceStats,
  getFitnessStats,
  getWorkoutStats,
  getTrainerInfo,
} = require('../controllers/memberDashboardController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/dashboard/overview
 * @desc    Get member dashboard overview with all key statistics
 * @access  Private (Member only)
 */
router.get('/overview', getDashboardOverview);

/**
 * @route   GET /api/member/dashboard/membership
 * @desc    Get member membership details and status
 * @access  Private (Member only)
 */
router.get('/membership', getMembershipDetails);

/**
 * @route   GET /api/member/dashboard/attendance
 * @desc    Get member attendance statistics for a specific month
 * @query   month - Month number (0-11), defaults to current month
 * @query   year - Year, defaults to current year
 * @access  Private (Member only)
 */
router.get('/attendance', getAttendanceStats);

/**
 * @route   GET /api/member/dashboard/fitness
 * @desc    Get member fitness statistics including BMI and goals
 * @access  Private (Member only)
 */
router.get('/fitness', getFitnessStats);

/**
 * @route   GET /api/member/dashboard/workout
 * @desc    Get member workout statistics for this month and all time
 * @access  Private (Member only)
 */
router.get('/workout', getWorkoutStats);

/**
 * @route   GET /api/member/dashboard/trainer
 * @desc    Get assigned trainer information
 * @access  Private (Member only)
 */
router.get('/trainer', getTrainerInfo);

module.exports = router;
