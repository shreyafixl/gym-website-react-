const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  getAvailableSessions,
  getBookedSessions,
  getSessionById,
  bookSession,
  cancelBooking,
} = require('../controllers/memberSessionController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/sessions/booked
 * @desc    Get booked sessions for member
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @query   status - Filter by booking status (confirmed, pending, cancelled, completed, no-show)
 * @access  Private (Member only)
 */
router.get('/booked', getBookedSessions);

/**
 * @route   GET /api/member/sessions/available
 * @desc    Get available sessions with filtering
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @query   sessionType - Filter by type (personal-training, group-class, consultation, assessment)
 * @query   category - Filter by category (strength-training, cardio, yoga, etc.)
 * @query   difficulty - Filter by difficulty (beginner, intermediate, advanced, all-levels)
 * @query   branchId - Filter by branch
 * @query   startDate - Start date for filtering (optional)
 * @query   endDate - End date for filtering (optional)
 * @access  Private (Member only)
 */
router.get('/available', getAvailableSessions);

/**
 * @route   GET /api/member/sessions/:id
 * @desc    Get session details by ID
 * @access  Private (Member only)
 */
router.get('/:id', getSessionById);

/**
 * @route   POST /api/member/sessions/:id/book
 * @desc    Book a session
 * @body    notes - Optional booking notes
 * @access  Private (Member only)
 */
router.post('/:id/book', bookSession);

/**
 * @route   POST /api/member/sessions/:id/cancel
 * @desc    Cancel session booking
 * @access  Private (Member only)
 */
router.post('/:id/cancel', cancelBooking);

module.exports = router;
