const WorkoutPlan = require('../models/WorkoutPlan');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all assigned workouts for member with pagination and filtering
 * @route   GET /api/member/workouts
 * @access  Private (Member only)
 */
const getAssignedWorkouts = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { page = 1, limit = 10, status, category, difficulty } = req.query;

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

  if (category) {
    const validCategories = [
      'strength',
      'cardio',
      'flexibility',
      'hiit',
      'crossfit',
      'yoga',
      'pilates',
      'functional',
      'sports-specific',
      'rehabilitation',
      'custom',
    ];
    if (!validCategories.includes(category)) {
      throw ApiError.badRequest('Invalid category filter');
    }
    filter.workoutCategory = category;
  }

  if (difficulty) {
    const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
    if (!validDifficulties.includes(difficulty)) {
      throw ApiError.badRequest('Invalid difficulty filter');
    }
    filter.difficultyLevel = difficulty;
  }

  // Execute query with pagination
  const workouts = await WorkoutPlan.find(filter)
    .populate('trainerId', 'fullName email phone specialization')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await WorkoutPlan.countDocuments(filter);

  const response = {
    workouts: workouts.map(w => ({
      id: w._id,
      title: w.workoutTitle,
      category: w.workoutCategory,
      difficulty: w.difficultyLevel,
      duration: w.duration,
      exercises: w.exercises.length,
      status: w.status,
      progress: w.progress,
      trainer: w.trainerId,
      startDate: w.startDate,
      endDate: w.endDate,
      frequency: w.frequency,
      targetMuscles: w.targetMuscleGroups,
      goals: w.goals,
      createdAt: w.createdAt,
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
    'Workouts retrieved successfully'
  );
});

/**
 * @desc    Get single workout by ID
 * @route   GET /api/member/workouts/:id
 * @access  Private (Member only)
 */
const getWorkoutById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid workout ID format');
  }

  const workout = await WorkoutPlan.findById(id)
    .populate('trainerId', 'fullName email phone specialization profileImage')
    .populate('memberId', 'fullName email')
    .lean();

  if (!workout) {
    throw ApiError.notFound('Workout not found');
  }

  // Verify ownership
  if (workout.memberId._id.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this workout');
  }

  const workoutDetail = {
    id: workout._id,
    title: workout.workoutTitle,
    category: workout.workoutCategory,
    difficulty: workout.difficultyLevel,
    duration: workout.duration,
    frequency: workout.frequency,
    status: workout.status,
    progress: workout.progress,
    exercises: workout.exercises.map(e => ({
      name: e.exerciseName,
      sets: e.sets,
      reps: e.reps,
      weight: e.weight,
      restTime: e.restTime,
      notes: e.notes,
      videoUrl: e.videoUrl,
      order: e.order,
    })),
    targetMuscles: workout.targetMuscleGroups,
    goals: workout.goals,
    trainer: {
      id: workout.trainerId._id,
      name: workout.trainerId.fullName,
      email: workout.trainerId.email,
      phone: workout.trainerId.phone,
      specialization: workout.trainerId.specialization,
      profileImage: workout.trainerId.profileImage,
    },
    notes: workout.notes,
    startDate: workout.startDate,
    endDate: workout.endDate,
    createdAt: workout.createdAt,
    updatedAt: workout.updatedAt,
  };

  ApiResponse.success(
    res,
    workoutDetail,
    'Workout retrieved successfully'
  );
});

/**
 * @desc    Update workout progress
 * @route   PUT /api/member/workouts/:id/progress
 * @access  Private (Member only)
 */
const updateWorkoutProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid workout ID format');
  }

  // Validate progress
  if (progress === undefined || progress === null) {
    throw ApiError.badRequest('Progress value is required');
  }

  const progressNum = parseInt(progress);
  if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
    throw ApiError.badRequest('Progress must be a number between 0 and 100');
  }

  const workout = await WorkoutPlan.findById(id);

  if (!workout) {
    throw ApiError.notFound('Workout not found');
  }

  // Verify ownership
  if (workout.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this workout');
  }

  // Update progress
  await workout.updateProgress(progressNum);

  const updated = await WorkoutPlan.findById(id)
    .populate('trainerId', 'fullName email')
    .lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      progress: updated.progress,
      status: updated.status,
      updatedAt: updated.updatedAt,
    },
    'Workout progress updated successfully'
  );
});

/**
 * @desc    Pause workout
 * @route   PUT /api/member/workouts/:id/pause
 * @access  Private (Member only)
 */
const pauseWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid workout ID format');
  }

  const workout = await WorkoutPlan.findById(id);

  if (!workout) {
    throw ApiError.notFound('Workout not found');
  }

  // Verify ownership
  if (workout.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this workout');
  }

  if (workout.status !== 'active') {
    throw ApiError.badRequest('Only active workouts can be paused');
  }

  await workout.pause();

  const updated = await WorkoutPlan.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    },
    'Workout paused successfully'
  );
});

/**
 * @desc    Resume workout
 * @route   PUT /api/member/workouts/:id/resume
 * @access  Private (Member only)
 */
const resumeWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid workout ID format');
  }

  const workout = await WorkoutPlan.findById(id);

  if (!workout) {
    throw ApiError.notFound('Workout not found');
  }

  // Verify ownership
  if (workout.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this workout');
  }

  if (workout.status !== 'paused') {
    throw ApiError.badRequest('Only paused workouts can be resumed');
  }

  await workout.resume();

  const updated = await WorkoutPlan.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    },
    'Workout resumed successfully'
  );
});

/**
 * @desc    Complete workout
 * @route   PUT /api/member/workouts/:id/complete
 * @access  Private (Member only)
 */
const completeWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const memberId = req.user.id;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid workout ID format');
  }

  const workout = await WorkoutPlan.findById(id);

  if (!workout) {
    throw ApiError.notFound('Workout not found');
  }

  // Verify ownership
  if (workout.memberId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this workout');
  }

  if (workout.status === 'completed') {
    throw ApiError.badRequest('Workout is already completed');
  }

  await workout.complete();

  const updated = await WorkoutPlan.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      status: updated.status,
      progress: updated.progress,
      endDate: updated.endDate,
      updatedAt: updated.updatedAt,
    },
    'Workout completed successfully'
  );
});

/**
 * @desc    Get workout statistics
 * @route   GET /api/member/workouts/stats/overview
 * @access  Private (Member only)
 */
const getWorkoutStats = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  const workouts = await WorkoutPlan.find({ memberId }).lean();

  const stats = {
    total: workouts.length,
    active: workouts.filter(w => w.status === 'active').length,
    completed: workouts.filter(w => w.status === 'completed').length,
    paused: workouts.filter(w => w.status === 'paused').length,
    cancelled: workouts.filter(w => w.status === 'cancelled').length,
    avgProgress: workouts.length > 0
      ? Math.round(workouts.reduce((sum, w) => sum + w.progress, 0) / workouts.length)
      : 0,
    categories: [...new Set(workouts.map(w => w.workoutCategory))],
    totalExercises: workouts.reduce((sum, w) => sum + w.exercises.length, 0),
  };

  ApiResponse.success(
    res,
    stats,
    'Workout statistics retrieved successfully'
  );
});

module.exports = {
  getAssignedWorkouts,
  getWorkoutById,
  updateWorkoutProgress,
  pauseWorkout,
  resumeWorkout,
  completeWorkout,
  getWorkoutStats,
};
