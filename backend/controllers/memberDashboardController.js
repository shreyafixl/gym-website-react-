const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get member dashboard overview
 * @route   GET /api/member/dashboard/overview
 * @access  Private (Member only)
 */
const getDashboardOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .populate('assignedTrainer', 'fullName email phone specialization')
    .lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Calculate membership stats
  const membershipDaysRemaining = user.membershipEndDate
    ? Math.ceil((new Date(user.membershipEndDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  // Calculate attendance stats
  const totalAttendance = user.attendance.length;
  const thisMonthAttendance = user.attendance.filter(a => {
    const attendanceDate = new Date(a.date);
    const now = new Date();
    return attendanceDate.getMonth() === now.getMonth() && 
           attendanceDate.getFullYear() === now.getFullYear();
  }).length;

  // Calculate average session duration
  let totalSessionDuration = 0;
  let sessionsWithDuration = 0;
  user.attendance.forEach(a => {
    if (a.checkIn && a.checkOut) {
      totalSessionDuration += (new Date(a.checkOut) - new Date(a.checkIn)) / (1000 * 60);
      sessionsWithDuration++;
    }
  });
  const avgSessionDuration = sessionsWithDuration > 0 
    ? Math.round(totalSessionDuration / sessionsWithDuration) 
    : 0;

  const overview = {
    member: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      profileImage: user.profileImage,
      joinDate: user.joinDate,
    },
    membership: {
      plan: user.membershipPlan,
      status: user.membershipStatus,
      startDate: user.membershipStartDate,
      endDate: user.membershipEndDate,
      daysRemaining: membershipDaysRemaining > 0 ? membershipDaysRemaining : 0,
      isActive: user.membershipStatus === 'active',
    },
    fitness: {
      height: user.height,
      weight: user.weight,
      goal: user.fitnessGoal,
      bmi: user.height && user.weight 
        ? parseFloat(((user.weight / ((user.height / 100) ** 2)).toFixed(1)))
        : null,
    },
    attendance: {
      total: totalAttendance,
      thisMonth: thisMonthAttendance,
      avgSessionDuration: avgSessionDuration,
      lastAttendance: user.attendance.length > 0 
        ? user.attendance[user.attendance.length - 1].date 
        : null,
    },
    trainer: user.assignedTrainer || null,
  };

  ApiResponse.success(
    res,
    overview,
    'Dashboard overview retrieved successfully'
  );
});

/**
 * @desc    Get member membership details
 * @route   GET /api/member/dashboard/membership
 * @access  Private (Member only)
 */
const getMembershipDetails = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const membershipDaysRemaining = user.membershipEndDate
    ? Math.ceil((new Date(user.membershipEndDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const membershipDetails = {
    plan: user.membershipPlan,
    status: user.membershipStatus,
    startDate: user.membershipStartDate,
    endDate: user.membershipEndDate,
    daysRemaining: membershipDaysRemaining > 0 ? membershipDaysRemaining : 0,
    isActive: user.membershipStatus === 'active',
    isExpired: membershipDaysRemaining <= 0,
    renewalDate: user.membershipEndDate,
  };

  ApiResponse.success(
    res,
    membershipDetails,
    'Membership details retrieved successfully'
  );
});

/**
 * @desc    Get member attendance statistics
 * @route   GET /api/member/dashboard/attendance
 * @access  Private (Member only)
 */
const getAttendanceStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { month, year } = req.query;

  const user = await User.findById(userId).lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const now = new Date();
  const queryMonth = month ? parseInt(month) : now.getMonth();
  const queryYear = year ? parseInt(year) : now.getFullYear();

  // Filter attendance for the specified month
  const monthAttendance = user.attendance.filter(a => {
    const attendanceDate = new Date(a.date);
    return attendanceDate.getMonth() === queryMonth && 
           attendanceDate.getFullYear() === queryYear;
  });

  // Calculate stats
  let totalDuration = 0;
  monthAttendance.forEach(a => {
    if (a.checkIn && a.checkOut) {
      totalDuration += (new Date(a.checkOut) - new Date(a.checkIn)) / (1000 * 60);
    }
  });

  const attendanceStats = {
    month: queryMonth + 1,
    year: queryYear,
    totalSessions: monthAttendance.length,
    totalDuration: Math.round(totalDuration),
    avgSessionDuration: monthAttendance.length > 0 
      ? Math.round(totalDuration / monthAttendance.length) 
      : 0,
    attendance: monthAttendance.map(a => ({
      date: a.date,
      checkIn: a.checkIn,
      checkOut: a.checkOut,
      duration: a.checkIn && a.checkOut 
        ? Math.round((new Date(a.checkOut) - new Date(a.checkIn)) / (1000 * 60))
        : null,
    })),
  };

  ApiResponse.success(
    res,
    attendanceStats,
    'Attendance statistics retrieved successfully'
  );
});

/**
 * @desc    Get member fitness statistics
 * @route   GET /api/member/dashboard/fitness
 * @access  Private (Member only)
 */
const getFitnessStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const fitnessStats = {
    height: user.height,
    weight: user.weight,
    goal: user.fitnessGoal,
    bmi: user.height && user.weight 
      ? parseFloat(((user.weight / ((user.height / 100) ** 2)).toFixed(1)))
      : null,
    bmiCategory: user.height && user.weight 
      ? getBMICategory(user.weight / ((user.height / 100) ** 2))
      : null,
    totalAttendance: user.attendance.length,
    thisMonthAttendance: user.attendance.filter(a => {
      const attendanceDate = new Date(a.date);
      const now = new Date();
      return attendanceDate.getMonth() === now.getMonth() && 
             attendanceDate.getFullYear() === now.getFullYear();
    }).length,
  };

  ApiResponse.success(
    res,
    fitnessStats,
    'Fitness statistics retrieved successfully'
  );
});

/**
 * @desc    Get member workout statistics
 * @route   GET /api/member/dashboard/workout
 * @access  Private (Member only)
 */
const getWorkoutStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const thisMonthWorkouts = user.attendance.filter(a => {
    const attendanceDate = new Date(a.date);
    return attendanceDate >= thisMonthStart && attendanceDate <= thisMonthEnd;
  });

  let totalMinutes = 0;
  thisMonthWorkouts.forEach(w => {
    if (w.checkIn && w.checkOut) {
      totalMinutes += (new Date(w.checkOut) - new Date(w.checkIn)) / (1000 * 60);
    }
  });

  const workoutStats = {
    thisMonth: {
      sessions: thisMonthWorkouts.length,
      totalMinutes: Math.round(totalMinutes),
      avgMinutesPerSession: thisMonthWorkouts.length > 0 
        ? Math.round(totalMinutes / thisMonthWorkouts.length) 
        : 0,
    },
    allTime: {
      totalSessions: user.attendance.length,
      joinDate: user.joinDate,
    },
    goal: user.fitnessGoal,
  };

  ApiResponse.success(
    res,
    workoutStats,
    'Workout statistics retrieved successfully'
  );
});

/**
 * @desc    Get member trainer information
 * @route   GET /api/member/dashboard/trainer
 * @access  Private (Member only)
 */
const getTrainerInfo = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .populate('assignedTrainer', 'fullName email phone specialization profileImage')
    .lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (!user.assignedTrainer) {
    return ApiResponse.success(
      res,
      null,
      'No trainer assigned'
    );
  }

  const trainerInfo = {
    id: user.assignedTrainer._id,
    fullName: user.assignedTrainer.fullName,
    email: user.assignedTrainer.email,
    phone: user.assignedTrainer.phone,
    specialization: user.assignedTrainer.specialization,
    profileImage: user.assignedTrainer.profileImage,
  };

  ApiResponse.success(
    res,
    trainerInfo,
    'Trainer information retrieved successfully'
  );
});

/**
 * Helper function to get BMI category
 */
function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

module.exports = {
  getDashboardOverview,
  getMembershipDetails,
  getAttendanceStats,
  getFitnessStats,
  getWorkoutStats,
  getTrainerInfo,
};
