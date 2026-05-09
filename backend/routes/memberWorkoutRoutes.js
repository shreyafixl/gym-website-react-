const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  getAssignedWorkouts,
  getWorkoutById,
  updateWorkoutProgress,
  pauseWorkout,
  resumeWorkout,
  completeWorkout,
  getWorkoutStats,
} = require('../controllers/memberWorkoutController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/workouts/stats/overview
 * @desc    Get workout statistics overview
 * @access  Private (Member only)
 */
router.get('/stats/overview', getWorkoutStats);

/**
 * @route   GET /api/member/workouts
 * @desc    Get all assigned workouts with pagination and filtering
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @query   status - Filter by status (active, completed, paused, cancelled)
 * @query   category - Filter by category (strength, cardio, flexibility, etc.)
 * @query   difficulty - Filter by difficulty (beginner, intermediate, advanced, expert)
 * @access  Private (Member only)
 */
router.get('/', getAssignedWorkouts);

/**
 * @route   GET /api/member/workouts/:id
 * @desc    Get single workout by ID
 * @access  Private (Member only)
 */
router.get('/:id', getWorkoutById);

/**
 * @route   PUT /api/member/workouts/:id/progress
 * @desc    Update workout progress
 * @body    progress - Progress percentage (0-100)
 * @access  Private (Member only)
 */
router.put('/:id/progress', updateWorkoutProgress);

/**
 * @route   PUT /api/member/workouts/:id/pause
 * @desc    Pause an active workout
 * @access  Private (Member only)
 */
router.put('/:id/pause', pauseWorkout);

/**
 * @route   PUT /api/member/workouts/:id/resume
 * @desc    Resume a paused workout
 * @access  Private (Member only)
 */
router.put('/:id/resume', resumeWorkout);

/**
 * @route   PUT /api/member/workouts/:id/complete
 * @desc    Mark workout as completed
 * @access  Private (Member only)
 */
router.put('/:id/complete', completeWorkout);

module.exports = router;
