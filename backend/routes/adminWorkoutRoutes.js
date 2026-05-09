const express = require('express');
const router = express.Router();
const {
  getAllWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  assignWorkout,
  getWorkoutStats,
  getWorkoutById,
} = require('../controllers/adminWorkoutController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @route   GET /api/admin/workouts/stats
 * @desc    Get workout statistics
 * @access  Private (Admin)
 */
router.get('/stats', protectAdmin, getWorkoutStats);

/**
 * @route   GET /api/admin/workouts
 * @desc    Get all workout plans with filtering
 * @access  Private (Admin)
 */
router.get('/', protectAdmin, getAllWorkouts);

/**
 * @route   POST /api/admin/workouts
 * @desc    Create workout plan
 * @access  Private (Admin)
 */
router.post('/', protectAdmin, createWorkout);

/**
 * @route   GET /api/admin/workouts/:id
 * @desc    Get workout by ID
 * @access  Private (Admin)
 */
router.get('/:id', protectAdmin, getWorkoutById);

/**
 * @route   PUT /api/admin/workouts/:id
 * @desc    Update workout plan
 * @access  Private (Admin)
 */
router.put('/:id', protectAdmin, updateWorkout);

/**
 * @route   DELETE /api/admin/workouts/:id
 * @desc    Delete workout plan
 * @access  Private (Admin)
 */
router.delete('/:id', protectAdmin, deleteWorkout);

/**
 * @route   POST /api/admin/workouts/:id/assign
 * @desc    Assign workout to member
 * @access  Private (Admin)
 */
router.post('/:id/assign', protectAdmin, assignWorkout);

module.exports = router;
