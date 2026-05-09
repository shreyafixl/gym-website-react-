const DietPlan = require('../models/DietPlan');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all assigned diet plans for member with pagination and filtering
 * @route   GET /api/member/diets
 * @access  Private (Member only)
 */
const getAssignedDiets = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { page = 1, limit = 10, status, dietType } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const filter = { memberId };

  if (status) {
    const validStatuses = ['active', 'completed', 'paused', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest('Invalid status filter');
    }
    filter.status = status;
  }

  if (dietType) {
    const validDietTypes = [
      'weight-loss',
      'weight-gain',
      'muscle-building',
      'maintenance',
      'keto',
      'vegan',
      'vegetarian',
      'paleo',
      'mediterranean',
      'low-carb',
      'high-protein',
      'balanced',
      'custom',
    ];
    if (!validDietTypes.includes(dietType)) {
      throw ApiError.badRequest('Invalid diet type filter');
    }
    filter.dietType = dietType;
  }

  // Execute query with pagination
  const diets = await DietPlan.find(filter)
    .populate('trainerId', 'fullName email phone specialization')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await DietPlan.countDocuments(filter);

  const response = {
    diets: diets.map(d => ({
      id: d._id,
      title: d.dietTitle,
      dietType: d.dietType,
      status: d.status,
      progress: d.progress,
      adherenceRate: d.adherenceRate,
      calorieTarget: d.calorieTarget.daily,
      mealCount: d.mealSchedule.length,
      trainer: d.trainerId,
      startDate: d.startDate,
      endDate: d.endDate,
      duration: d.duration,
      restrictions: d.restrictions,
      hydrationGoal: d.hydrationGoal,
      createdAt: d.createdAt,
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
    'Diet plans retrieved successfully'
  );
});

/**
 * @desc    Get single diet plan by ID
 * @route   GET /api/member/diets/:id
 * @access  Private (Member only)
 */
const getDietById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid diet ID format');
  }

  const diet = await DietPlan.findById(id)
    .populate('trainerId', 'fullName email phone specialization profileImage')
    .populate('memberId', 'fullName email')
    .lean();

  if (!diet) {
    throw ApiError.notFound('Diet plan not found');
  }

  // Verify ownership
  if (diet.memberId._id.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this diet plan');
  }

  const dietDetail = {
    id: diet._id,
    title: diet.dietTitle,
    dietType: diet.dietType,
    status: diet.status,
    progress: diet.progress,
    adherenceRate: diet.adherenceRate,
    calorieTarget: diet.calorieTarget,
    mealSchedule: diet.mealSchedule.map(meal => ({
      mealName: meal.mealName,
      time: meal.time,
      foods: meal.foods.map(f => ({
        foodItem: f.foodItem,
        quantity: f.quantity,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fats: f.fats,
      })),
      totalCalories: meal.totalCalories,
      notes: meal.notes,
    })),
    nutritionNotes: diet.nutritionNotes,
    restrictions: diet.restrictions,
    supplements: diet.supplements.map(s => ({
      supplementName: s.supplementName,
      dosage: s.dosage,
      timing: s.timing,
      notes: s.notes,
    })),
    hydrationGoal: diet.hydrationGoal,
    trainer: {
      id: diet.trainerId._id,
      name: diet.trainerId.fullName,
      email: diet.trainerId.email,
      phone: diet.trainerId.phone,
      specialization: diet.trainerId.specialization,
      profileImage: diet.trainerId.profileImage,
    },
    notes: diet.notes,
    startDate: diet.startDate,
    endDate: diet.endDate,
    duration: diet.duration,
    createdAt: diet.createdAt,
    updatedAt: diet.updatedAt,
  };

  ApiResponse.success(
    res,
    dietDetail,
    'Diet plan retrieved successfully'
  );
});

/**
 * @desc    Update diet adherence progress
 * @route   PUT /api/member/diets/:id/adherence
 * @access  Private (Member only)
 */
const updateAdherenceProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { adherenceRate } = req.body;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid diet ID format');
  }

  // Validate adherence rate
  if (adherenceRate === undefined || adherenceRate === null) {
    throw ApiError.badRequest('Adherence rate is required');
  }

  const adherenceNum = parseInt(adherenceRate);
  if (isNaN(adherenceNum) || adherenceNum < 0 || adherenceNum > 100) {
    throw ApiError.badRequest('Adherence rate must be a number between 0 and 100');
  }

  const diet = await DietPlan.findById(id);

  if (!diet) {
    throw ApiError.notFound('Diet plan not found');
  }

  // Verify ownership
  if (diet.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this diet plan');
  }

  // Update adherence
  await diet.updateAdherence(adherenceNum);

  const updated = await DietPlan.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      adherenceRate: updated.adherenceRate,
      updatedAt: updated.updatedAt,
    },
    'Diet adherence updated successfully'
  );
});

/**
 * @desc    Update diet progress
 * @route   PUT /api/member/diets/:id/progress
 * @access  Private (Member only)
 */
const updateDietProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid diet ID format');
  }

  // Validate progress
  if (progress === undefined || progress === null) {
    throw ApiError.badRequest('Progress value is required');
  }

  const progressNum = parseInt(progress);
  if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
    throw ApiError.badRequest('Progress must be a number between 0 and 100');
  }

  const diet = await DietPlan.findById(id);

  if (!diet) {
    throw ApiError.notFound('Diet plan not found');
  }

  // Verify ownership
  if (diet.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this diet plan');
  }

  // Update progress
  await diet.updateProgress(progressNum);

  const updated = await DietPlan.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      progress: updated.progress,
      status: updated.status,
      updatedAt: updated.updatedAt,
    },
    'Diet progress updated successfully'
  );
});

/**
 * @desc    Pause diet plan
 * @route   PUT /api/member/diets/:id/pause
 * @access  Private (Member only)
 */
const pauseDiet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid diet ID format');
  }

  const diet = await DietPlan.findById(id);

  if (!diet) {
    throw ApiError.notFound('Diet plan not found');
  }

  // Verify ownership
  if (diet.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this diet plan');
  }

  if (diet.status !== 'active') {
    throw ApiError.badRequest('Only active diet plans can be paused');
  }

  await diet.pause();

  const updated = await DietPlan.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    },
    'Diet plan paused successfully'
  );
});

/**
 * @desc    Resume diet plan
 * @route   PUT /api/member/diets/:id/resume
 * @access  Private (Member only)
 */
const resumeDiet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid diet ID format');
  }

  const diet = await DietPlan.findById(id);

  if (!diet) {
    throw ApiError.notFound('Diet plan not found');
  }

  // Verify ownership
  if (diet.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this diet plan');
  }

  if (diet.status !== 'paused') {
    throw ApiError.badRequest('Only paused diet plans can be resumed');
  }

  await diet.resume();

  const updated = await DietPlan.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    },
    'Diet plan resumed successfully'
  );
});

/**
 * @desc    Complete diet plan
 * @route   PUT /api/member/diets/:id/complete
 * @access  Private (Member only)
 */
const completeDiet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid diet ID format');
  }

  const diet = await DietPlan.findById(id);

  if (!diet) {
    throw ApiError.notFound('Diet plan not found');
  }

  // Verify ownership
  if (diet.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this diet plan');
  }

  if (diet.status === 'completed') {
    throw ApiError.badRequest('Diet plan is already completed');
  }

  await diet.complete();

  const updated = await DietPlan.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      status: updated.status,
      progress: updated.progress,
      endDate: updated.endDate,
      updatedAt: updated.updatedAt,
    },
    'Diet plan completed successfully'
  );
});

/**
 * @desc    Get diet statistics
 * @route   GET /api/member/diets/stats/overview
 * @access  Private (Member only)
 */
const getDietStats = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  const diets = await DietPlan.find({ memberId }).lean();

  const stats = {
    total: diets.length,
    active: diets.filter(d => d.status === 'active').length,
    completed: diets.filter(d => d.status === 'completed').length,
    paused: diets.filter(d => d.status === 'paused').length,
    cancelled: diets.filter(d => d.status === 'cancelled').length,
    avgProgress: diets.length > 0
      ? Math.round(diets.reduce((sum, d) => sum + d.progress, 0) / diets.length)
      : 0,
    avgAdherence: diets.length > 0
      ? Math.round(diets.reduce((sum, d) => sum + d.adherenceRate, 0) / diets.length)
      : 0,
    dietTypes: [...new Set(diets.map(d => d.dietType))],
    totalMeals: diets.reduce((sum, d) => sum + d.mealSchedule.length, 0),
    avgDailyCalories: diets.length > 0
      ? Math.round(diets.reduce((sum, d) => sum + d.calorieTarget.daily, 0) / diets.length)
      : 0,
  };

  ApiResponse.success(
    res,
    stats,
    'Diet statistics retrieved successfully'
  );
});

module.exports = {
  getAssignedDiets,
  getDietById,
  updateAdherenceProgress,
  updateDietProgress,
  pauseDiet,
  resumeDiet,
  completeDiet,
  getDietStats,
};
