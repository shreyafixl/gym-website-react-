const Goal = require('../models/Goal');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new goal
 * @route   POST /api/member/goals
 * @access  Private (Member only)
 */
const createGoal = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const {
    goalTitle,
    goalDescription,
    goalType,
    goalCategory,
    targetDate,
    priority,
    targetValue,
    targetUnit,
  } = req.body;

  // Validate required fields
  if (!goalTitle || !goalType || !goalCategory || !targetDate) {
    throw ApiError.badRequest('Goal title, type, category, and target date are required');
  }

  // Validate goal type
  const validTypes = ['weight-loss', 'muscle-gain', 'strength', 'endurance', 'flexibility', 'general-fitness', 'custom'];
  if (!validTypes.includes(goalType)) {
    throw ApiError.badRequest('Invalid goal type');
  }

  // Validate goal category
  const validCategories = ['fitness', 'nutrition', 'lifestyle', 'health', 'performance'];
  if (!validCategories.includes(goalCategory)) {
    throw ApiError.badRequest('Invalid goal category');
  }

  // Validate target date
  const targetDateObj = new Date(targetDate);
  if (isNaN(targetDateObj.getTime())) {
    throw ApiError.badRequest('Invalid target date format');
  }

  if (targetDateObj <= new Date()) {
    throw ApiError.badRequest('Target date must be in the future');
  }

  // Validate priority
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    throw ApiError.badRequest('Invalid priority');
  }

  // Validate target unit
  if (targetUnit) {
    const validUnits = ['kg', 'lbs', 'cm', 'inches', 'reps', 'sets', 'minutes', 'km', 'miles', 'percentage', 'other'];
    if (!validUnits.includes(targetUnit)) {
      throw ApiError.badRequest('Invalid target unit');
    }
  }

  // Create goal
  const goal = new Goal({
    memberId,
    trainerId: req.user.trainerId || memberId, // Use trainer ID if available, otherwise use member ID
    goalTitle,
    goalDescription: goalDescription || null,
    goalType,
    goalCategory,
    targetDate: targetDateObj,
    priority: priority || 'medium',
    targetValue: targetValue || null,
    targetUnit: targetUnit || null,
  });

  await goal.save();

  const goalDetail = {
    id: goal._id,
    title: goal.goalTitle,
    description: goal.goalDescription,
    type: goal.goalType,
    category: goal.goalCategory,
    startDate: goal.startDate,
    targetDate: goal.targetDate,
    status: goal.status,
    priority: goal.priority,
    targetValue: goal.targetValue,
    targetUnit: goal.targetUnit,
    currentValue: goal.currentValue,
    progress: goal.progress,
    createdAt: goal.createdAt,
  };

  ApiResponse.success(
    res,
    goalDetail,
    'Goal created successfully',
    201
  );
});

/**
 * @desc    Get all goals for member
 * @route   GET /api/member/goals
 * @access  Private (Member only)
 */
const getGoals = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { page = 1, limit = 10, status, goalType } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const filter = { memberId };

  if (status) {
    const validStatuses = ['active', 'completed', 'paused', 'abandoned'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest('Invalid status filter');
    }
    filter.status = status;
  }

  if (goalType) {
    const validTypes = ['weight-loss', 'muscle-gain', 'strength', 'endurance', 'flexibility', 'general-fitness', 'custom'];
    if (!validTypes.includes(goalType)) {
      throw ApiError.badRequest('Invalid goal type filter');
    }
    filter.goalType = goalType;
  }

  // Execute query with pagination
  const goals = await Goal.find(filter)
    .populate('trainerId', 'fullName email')
    .sort({ targetDate: 1, priority: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await Goal.countDocuments(filter);

  const response = {
    goals: goals.map(g => ({
      id: g._id,
      title: g.goalTitle,
      description: g.goalDescription,
      type: g.goalType,
      category: g.goalCategory,
      startDate: g.startDate,
      targetDate: g.targetDate,
      status: g.status,
      priority: g.priority,
      targetValue: g.targetValue,
      targetUnit: g.targetUnit,
      currentValue: g.currentValue,
      progress: g.progress,
      milestones: g.milestones,
      achievements: g.achievements.length,
      trainer: g.trainerId,
      createdAt: g.createdAt,
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  };

  ApiResponse.success(
    res,
    response,
    'Goals retrieved successfully'
  );
});

/**
 * @desc    Get goal by ID
 * @route   GET /api/member/goals/:id
 * @access  Private (Member only)
 */
const getGoalById = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid goal ID format');
  }

  const goal = await Goal.findById(id)
    .populate('trainerId', 'fullName email specialization')
    .populate('progressNotes.recordedBy', 'fullName email')
    .lean();

  if (!goal) {
    throw ApiError.notFound('Goal not found');
  }

  // Verify ownership
  if (goal.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this goal');
  }

  const goalDetail = {
    id: goal._id,
    title: goal.goalTitle,
    description: goal.goalDescription,
    type: goal.goalType,
    category: goal.goalCategory,
    startDate: goal.startDate,
    targetDate: goal.targetDate,
    status: goal.status,
    priority: goal.priority,
    targetValue: goal.targetValue,
    targetUnit: goal.targetUnit,
    currentValue: goal.currentValue,
    progress: goal.progress,
    milestones: goal.milestones,
    progressNotes: goal.progressNotes,
    achievements: goal.achievements,
    completedDate: goal.completedDate,
    abandonedDate: goal.abandonedDate,
    abandonReason: goal.abandonReason,
    notes: goal.notes,
    trainer: goal.trainerId,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };

  ApiResponse.success(
    res,
    goalDetail,
    'Goal retrieved successfully'
  );
});

/**
 * @desc    Update goal progress
 * @route   PUT /api/member/goals/:id/progress
 * @access  Private (Member only)
 */
const updateGoalProgress = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { id } = req.params;
  const { currentValue, note } = req.body;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid goal ID format');
  }

  // Validate current value
  if (currentValue === undefined || currentValue === null) {
    throw ApiError.badRequest('Current value is required');
  }

  const currentValueNum = parseFloat(currentValue);
  if (isNaN(currentValueNum)) {
    throw ApiError.badRequest('Current value must be a number');
  }

  const goal = await Goal.findById(id);

  if (!goal) {
    throw ApiError.notFound('Goal not found');
  }

  // Verify ownership
  if (goal.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this goal');
  }

  if (goal.status !== 'active') {
    throw ApiError.badRequest('Can only update progress for active goals');
  }

  // Update progress
  await goal.updateProgress(currentValueNum, note || null, memberId);

  const updated = await Goal.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      currentValue: updated.currentValue,
      progress: updated.progress,
      status: updated.status,
      completedDate: updated.completedDate,
      updatedAt: updated.updatedAt,
    },
    'Goal progress updated successfully'
  );
});

/**
 * @desc    Get achievements
 * @route   GET /api/member/goals/achievements/list
 * @access  Private (Member only)
 */
const getAchievements = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Get completed goals with achievements
  const goals = await Goal.find({
    memberId,
    status: 'completed',
    'achievements.0': { $exists: true },
  })
    .select('goalTitle achievements completedDate')
    .sort({ completedDate: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const total = await Goal.countDocuments({
    memberId,
    status: 'completed',
    'achievements.0': { $exists: true },
  });

  // Flatten achievements
  const achievements = [];
  goals.forEach(goal => {
    goal.achievements.forEach(achievement => {
      achievements.push({
        goalId: goal._id,
        goalTitle: goal.goalTitle,
        achievementName: achievement.achievementName,
        achievementDescription: achievement.achievementDescription,
        achievedDate: achievement.achievedDate,
        badge: achievement.badge,
      });
    });
  });

  const response = {
    achievements,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  };

  ApiResponse.success(
    res,
    response,
    'Achievements retrieved successfully'
  );
});

/**
 * @desc    Get goal statistics
 * @route   GET /api/member/goals/stats/overview
 * @access  Private (Member only)
 */
const getGoalStats = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  const goals = await Goal.find({ memberId }).lean();

  const stats = {
    total: goals.length,
    active: goals.filter(g => g.status === 'active').length,
    completed: goals.filter(g => g.status === 'completed').length,
    paused: goals.filter(g => g.status === 'paused').length,
    abandoned: goals.filter(g => g.status === 'abandoned').length,
    avgProgress: goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0,
    completionRate: goals.length > 0
      ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100)
      : 0,
    goalTypes: [...new Set(goals.map(g => g.goalType))],
    totalAchievements: goals.reduce((sum, g) => sum + g.achievements.length, 0),
  };

  ApiResponse.success(
    res,
    stats,
    'Goal statistics retrieved successfully'
  );
});

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoalProgress,
  getAchievements,
  getGoalStats,
};
