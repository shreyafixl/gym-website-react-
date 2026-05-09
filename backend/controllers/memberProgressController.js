const Progress = require('../models/Progress');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get progress history with pagination
 * @route   GET /api/member/progress
 * @access  Private (Member only)
 */
const getProgressHistory = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const progress = await Progress.find({ memberId })
    .populate('trainerId', 'fullName email specialization')
    .sort({ recordDate: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await Progress.countDocuments({ memberId });

  const response = {
    progress: progress.map(p => ({
      id: p._id,
      recordDate: p.recordDate,
      bodyMeasurements: p.bodyMeasurements,
      strengthMetrics: p.strengthMetrics,
      fitnessMetrics: p.fitnessMetrics,
      mood: p.mood,
      energyLevel: p.energyLevel,
      sleepQuality: p.sleepQuality,
      dietAdherence: p.dietAdherence,
      workoutAdherence: p.workoutAdherence,
      trainer: p.trainerId,
      createdAt: p.createdAt,
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
    'Progress history retrieved successfully'
  );
});

/**
 * @desc    Get latest progress record
 * @route   GET /api/member/progress/latest
 * @access  Private (Member only)
 */
const getLatestProgress = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  const progress = await Progress.findOne({ memberId })
    .populate('trainerId', 'fullName email specialization profileImage')
    .sort({ recordDate: -1 })
    .lean();

  if (!progress) {
    throw ApiError.notFound('No progress records found');
  }

  const progressDetail = {
    id: progress._id,
    recordDate: progress.recordDate,
    bodyMeasurements: progress.bodyMeasurements,
    strengthMetrics: progress.strengthMetrics,
    progressPhotos: progress.progressPhotos,
    fitnessMetrics: progress.fitnessMetrics,
    goals: progress.goals,
    notes: progress.notes,
    mood: progress.mood,
    energyLevel: progress.energyLevel,
    sleepQuality: progress.sleepQuality,
    dietAdherence: progress.dietAdherence,
    workoutAdherence: progress.workoutAdherence,
    trainer: {
      id: progress.trainerId._id,
      name: progress.trainerId.fullName,
      email: progress.trainerId.email,
      specialization: progress.trainerId.specialization,
      profileImage: progress.trainerId.profileImage,
    },
    createdAt: progress.createdAt,
    updatedAt: progress.updatedAt,
  };

  ApiResponse.success(
    res,
    progressDetail,
    'Latest progress retrieved successfully'
  );
});

/**
 * @desc    Get weekly progress analytics
 * @route   GET /api/member/progress/analytics/weekly
 * @access  Private (Member only)
 */
const getWeeklyAnalytics = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { weeks = 4 } = req.query;

  const weeksNum = Math.min(52, Math.max(1, parseInt(weeks) || 4));

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (weeksNum * 7));

  // Aggregate progress data by week
  const weeklyData = await Progress.aggregate([
    {
      $match: {
        memberId: require('mongoose').Types.ObjectId(memberId),
        recordDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$recordDate' },
          week: { $week: '$recordDate' },
        },
        avgWeight: { $avg: '$bodyMeasurements.weight' },
        avgBMI: { $avg: '$bodyMeasurements.bmi' },
        avgBodyFat: { $avg: '$bodyMeasurements.bodyFatPercentage' },
        avgMuscleMass: { $avg: '$bodyMeasurements.muscleMass' },
        avgDietAdherence: { $avg: '$dietAdherence' },
        avgWorkoutAdherence: { $avg: '$workoutAdherence' },
        avgEnergyLevel: { $avg: '$energyLevel' },
        recordCount: { $sum: 1 },
        dates: { $push: '$recordDate' },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.week': 1 },
    },
  ]);

  const response = {
    weeks: weeksNum,
    startDate,
    endDate,
    data: weeklyData.map(w => ({
      year: w._id.year,
      week: w._id.week,
      avgWeight: w.avgWeight ? parseFloat(w.avgWeight.toFixed(2)) : null,
      avgBMI: w.avgBMI ? parseFloat(w.avgBMI.toFixed(2)) : null,
      avgBodyFat: w.avgBodyFat ? parseFloat(w.avgBodyFat.toFixed(2)) : null,
      avgMuscleMass: w.avgMuscleMass ? parseFloat(w.avgMuscleMass.toFixed(2)) : null,
      avgDietAdherence: w.avgDietAdherence ? Math.round(w.avgDietAdherence) : null,
      avgWorkoutAdherence: w.avgWorkoutAdherence ? Math.round(w.avgWorkoutAdherence) : null,
      avgEnergyLevel: w.avgEnergyLevel ? Math.round(w.avgEnergyLevel) : null,
      recordCount: w.recordCount,
      startDate: w.dates.length > 0 ? new Date(Math.min(...w.dates.map(d => new Date(d)))) : null,
      endDate: w.dates.length > 0 ? new Date(Math.max(...w.dates.map(d => new Date(d)))) : null,
    })),
  };

  ApiResponse.success(
    res,
    response,
    'Weekly analytics retrieved successfully'
  );
});

/**
 * @desc    Get monthly progress analytics
 * @route   GET /api/member/progress/analytics/monthly
 * @access  Private (Member only)
 */
const getMonthlyAnalytics = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { months = 12 } = req.query;

  const monthsNum = Math.min(60, Math.max(1, parseInt(months) || 12));

  // Calculate date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsNum);

  // Aggregate progress data by month
  const monthlyData = await Progress.aggregate([
    {
      $match: {
        memberId: require('mongoose').Types.ObjectId(memberId),
        recordDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$recordDate' },
          month: { $month: '$recordDate' },
        },
        avgWeight: { $avg: '$bodyMeasurements.weight' },
        minWeight: { $min: '$bodyMeasurements.weight' },
        maxWeight: { $max: '$bodyMeasurements.weight' },
        avgBMI: { $avg: '$bodyMeasurements.bmi' },
        avgBodyFat: { $avg: '$bodyMeasurements.bodyFatPercentage' },
        avgMuscleMass: { $avg: '$bodyMeasurements.muscleMass' },
        avgChest: { $avg: '$bodyMeasurements.chest' },
        avgWaist: { $avg: '$bodyMeasurements.waist' },
        avgHips: { $avg: '$bodyMeasurements.hips' },
        avgBiceps: { $avg: '$bodyMeasurements.biceps' },
        avgThighs: { $avg: '$bodyMeasurements.thighs' },
        avgDietAdherence: { $avg: '$dietAdherence' },
        avgWorkoutAdherence: { $avg: '$workoutAdherence' },
        avgEnergyLevel: { $avg: '$energyLevel' },
        avgMood: { $avg: '$energyLevel' },
        recordCount: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  const response = {
    months: monthsNum,
    startDate,
    endDate,
    data: monthlyData.map(m => ({
      year: m._id.year,
      month: m._id.month,
      monthName: new Date(m._id.year, m._id.month - 1).toLocaleString('default', { month: 'long' }),
      avgWeight: m.avgWeight ? parseFloat(m.avgWeight.toFixed(2)) : null,
      minWeight: m.minWeight ? parseFloat(m.minWeight.toFixed(2)) : null,
      maxWeight: m.maxWeight ? parseFloat(m.maxWeight.toFixed(2)) : null,
      weightChange: m.avgWeight ? parseFloat((m.maxWeight - m.minWeight).toFixed(2)) : null,
      avgBMI: m.avgBMI ? parseFloat(m.avgBMI.toFixed(2)) : null,
      avgBodyFat: m.avgBodyFat ? parseFloat(m.avgBodyFat.toFixed(2)) : null,
      avgMuscleMass: m.avgMuscleMass ? parseFloat(m.avgMuscleMass.toFixed(2)) : null,
      measurements: {
        chest: m.avgChest ? parseFloat(m.avgChest.toFixed(2)) : null,
        waist: m.avgWaist ? parseFloat(m.avgWaist.toFixed(2)) : null,
        hips: m.avgHips ? parseFloat(m.avgHips.toFixed(2)) : null,
        biceps: m.avgBiceps ? parseFloat(m.avgBiceps.toFixed(2)) : null,
        thighs: m.avgThighs ? parseFloat(m.avgThighs.toFixed(2)) : null,
      },
      avgDietAdherence: m.avgDietAdherence ? Math.round(m.avgDietAdherence) : null,
      avgWorkoutAdherence: m.avgWorkoutAdherence ? Math.round(m.avgWorkoutAdherence) : null,
      avgEnergyLevel: m.avgEnergyLevel ? Math.round(m.avgEnergyLevel) : null,
      recordCount: m.recordCount,
    })),
  };

  ApiResponse.success(
    res,
    response,
    'Monthly analytics retrieved successfully'
  );
});

/**
 * @desc    Get progress report with comparisons
 * @route   GET /api/member/progress/report
 * @access  Private (Member only)
 */
const getProgressReport = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  // Get latest progress
  const latest = await Progress.findOne({ memberId })
    .sort({ recordDate: -1 })
    .lean();

  if (!latest) {
    throw ApiError.notFound('No progress records found');
  }

  // Get progress from 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const previous = await Progress.findOne({
    memberId,
    recordDate: { $lte: thirtyDaysAgo },
  })
    .sort({ recordDate: -1 })
    .lean();

  // Calculate changes
  const changes = {
    weight: null,
    bmi: null,
    bodyFat: null,
    muscleMass: null,
    chest: null,
    waist: null,
    hips: null,
    biceps: null,
    thighs: null,
  };

  if (previous) {
    if (latest.bodyMeasurements.weight && previous.bodyMeasurements.weight) {
      changes.weight = parseFloat((latest.bodyMeasurements.weight - previous.bodyMeasurements.weight).toFixed(2));
    }
    if (latest.bodyMeasurements.bmi && previous.bodyMeasurements.bmi) {
      changes.bmi = parseFloat((latest.bodyMeasurements.bmi - previous.bodyMeasurements.bmi).toFixed(2));
    }
    if (latest.bodyMeasurements.bodyFatPercentage && previous.bodyMeasurements.bodyFatPercentage) {
      changes.bodyFat = parseFloat((latest.bodyMeasurements.bodyFatPercentage - previous.bodyMeasurements.bodyFatPercentage).toFixed(2));
    }
    if (latest.bodyMeasurements.muscleMass && previous.bodyMeasurements.muscleMass) {
      changes.muscleMass = parseFloat((latest.bodyMeasurements.muscleMass - previous.bodyMeasurements.muscleMass).toFixed(2));
    }
    if (latest.bodyMeasurements.chest && previous.bodyMeasurements.chest) {
      changes.chest = parseFloat((latest.bodyMeasurements.chest - previous.bodyMeasurements.chest).toFixed(2));
    }
    if (latest.bodyMeasurements.waist && previous.bodyMeasurements.waist) {
      changes.waist = parseFloat((latest.bodyMeasurements.waist - previous.bodyMeasurements.waist).toFixed(2));
    }
    if (latest.bodyMeasurements.hips && previous.bodyMeasurements.hips) {
      changes.hips = parseFloat((latest.bodyMeasurements.hips - previous.bodyMeasurements.hips).toFixed(2));
    }
    if (latest.bodyMeasurements.biceps && previous.bodyMeasurements.biceps) {
      changes.biceps = parseFloat((latest.bodyMeasurements.biceps - previous.bodyMeasurements.biceps).toFixed(2));
    }
    if (latest.bodyMeasurements.thighs && previous.bodyMeasurements.thighs) {
      changes.thighs = parseFloat((latest.bodyMeasurements.thighs - previous.bodyMeasurements.thighs).toFixed(2));
    }
  }

  const response = {
    latest: {
      recordDate: latest.recordDate,
      bodyMeasurements: latest.bodyMeasurements,
      strengthMetrics: latest.strengthMetrics,
      fitnessMetrics: latest.fitnessMetrics,
      mood: latest.mood,
      energyLevel: latest.energyLevel,
      sleepQuality: latest.sleepQuality,
      dietAdherence: latest.dietAdherence,
      workoutAdherence: latest.workoutAdherence,
    },
    previous: previous ? {
      recordDate: previous.recordDate,
      bodyMeasurements: previous.bodyMeasurements,
    } : null,
    changes,
    daysSinceLastRecord: previous ? Math.floor((latest.recordDate - previous.recordDate) / (1000 * 60 * 60 * 24)) : null,
  };

  ApiResponse.success(
    res,
    response,
    'Progress report retrieved successfully'
  );
});

module.exports = {
  getProgressHistory,
  getLatestProgress,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getProgressReport,
};
