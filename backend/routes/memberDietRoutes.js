const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  getAssignedDiets,
  getDietById,
  updateAdherenceProgress,
  updateDietProgress,
  pauseDiet,
  resumeDiet,
  completeDiet,
  getDietStats,
} = require('../controllers/memberDietController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/diets/stats/overview
 * @desc    Get diet statistics overview
 * @access  Private (Member only)
 */
router.get('/stats/overview', getDietStats);

/**
 * @route   GET /api/member/diets
 * @desc    Get all assigned diet plans with pagination and filtering
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @query   status - Filter by status (active, completed, paused, cancelled)
 * @query   dietType - Filter by diet type (weight-loss, weight-gain, muscle-building, etc.)
 * @access  Private (Member only)
 */
router.get('/', getAssignedDiets);

/**
 * @route   GET /api/member/diets/:id
 * @desc    Get single diet plan by ID
 * @access  Private (Member only)
 */
router.get('/:id', getDietById);

/**
 * @route   PUT /api/member/diets/:id/adherence
 * @desc    Update diet adherence progress
 * @body    adherenceRate - Adherence percentage (0-100)
 * @access  Private (Member only)
 */
router.put('/:id/adherence', updateAdherenceProgress);

/**
 * @route   PUT /api/member/diets/:id/progress
 * @desc    Update diet progress
 * @body    progress - Progress percentage (0-100)
 * @access  Private (Member only)
 */
router.put('/:id/progress', updateDietProgress);

/**
 * @route   PUT /api/member/diets/:id/pause
 * @desc    Pause an active diet plan
 * @access  Private (Member only)
 */
router.put('/:id/pause', pauseDiet);

/**
 * @route   PUT /api/member/diets/:id/resume
 * @desc    Resume a paused diet plan
 * @access  Private (Member only)
 */
router.put('/:id/resume', resumeDiet);

/**
 * @route   PUT /api/member/diets/:id/complete
 * @desc    Mark diet plan as completed
 * @access  Private (Member only)
 */
router.put('/:id/complete', completeDiet);

module.exports = router;
