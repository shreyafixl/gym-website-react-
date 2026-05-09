const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoalProgress,
  getAchievements,
  getGoalStats,
} = require('../controllers/memberGoalController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/goals/stats/overview
 * @desc    Get goal statistics overview
 * @access  Private (Member only)
 */
router.get('/stats/overview', getGoalStats);

/**
 * @route   GET /api/member/goals/achievements/list
 * @desc    Get achievements from completed goals
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @access  Private (Member only)
 */
router.get('/achievements/list', getAchievements);

/**
 * @route   GET /api/member/goals
 * @desc    Get all goals with pagination and filtering
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @query   status - Filter by status (active, completed, paused, abandoned)
 * @query   goalType - Filter by goal type (weight-loss, muscle-gain, strength, etc.)
 * @access  Private (Member only)
 */
router.get('/', getGoals);

/**
 * @route   POST /api/member/goals
 * @desc    Create a new goal
 * @body    goalTitle - Goal title (required)
 * @body    goalDescription - Goal description (optional)
 * @body    goalType - Goal type (required)
 * @body    goalCategory - Goal category (required)
 * @body    targetDate - Target date (required)
 * @body    priority - Priority level (optional)
 * @body    targetValue - Target value (optional)
 * @body    targetUnit - Target unit (optional)
 * @access  Private (Member only)
 */
router.post('/', createGoal);

/**
 * @route   GET /api/member/goals/:id
 * @desc    Get goal by ID
 * @access  Private (Member only)
 */
router.get('/:id', getGoalById);

/**
 * @route   PUT /api/member/goals/:id/progress
 * @desc    Update goal progress
 * @body    currentValue - Current progress value (required)
 * @body    note - Progress note (optional)
 * @access  Private (Member only)
 */
router.put('/:id/progress', updateGoalProgress);

module.exports = router;
