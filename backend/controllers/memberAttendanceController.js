const Attendance = require('../models/Attendance');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get attendance history with date range filtering and pagination
 * @route   GET /api/member/attendance
 * @access  Private (Member only)
 */
const getAttendanceHistory = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { page = 1, limit = 10, startDate, endDate, status } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const filter = { memberId };

  // Date range filtering
  if (startDate || endDate) {
    filter.attendanceDate = {};

    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw ApiError.badRequest('Invalid start date format');
      }
      filter.attendanceDate.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        throw ApiError.badRequest('Invalid end date format');
      }
      // Set to end of day
      end.setHours(23, 59, 59, 999);
      filter.attendanceDate.$lte = end;
    }
  }

  // Status filtering
  if (status) {
    const validStatuses = ['present', 'absent', 'late', 'leave'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest('Invalid status filter');
    }
    filter.attendanceStatus = status;
  }

  // Execute query with pagination
  const attendance = await Attendance.find(filter)
    .populate('branchId', 'branchName branchCode city')
    .populate('trainerId', 'fullName email')
    .sort({ attendanceDate: -1, checkInTime: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await Attendance.countDocuments(filter);

  const response = {
    attendance: attendance.map(a => ({
      id: a._id,
      date: a.attendanceDate,
      checkInTime: a.checkInTime,
      checkOutTime: a.checkOutTime,
      status: a.attendanceStatus,
      duration: a.duration,
      branch: a.branchId,
      trainer: a.trainerId,
      notes: a.notes,
      createdAt: a.createdAt,
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
    'Attendance history retrieved successfully'
  );
});

/**
 * @desc    Get attendance statistics
 * @route   GET /api/member/attendance/stats/overview
 * @access  Private (Member only)
 */
const getAttendanceStats = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { startDate, endDate } = req.query;

  // Build filter query
  const filter = { memberId };

  // Date range filtering
  if (startDate || endDate) {
    filter.attendanceDate = {};

    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw ApiError.badRequest('Invalid start date format');
      }
      filter.attendanceDate.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        throw ApiError.badRequest('Invalid end date format');
      }
      end.setHours(23, 59, 59, 999);
      filter.attendanceDate.$lte = end;
    }
  }

  // Get all attendance records for stats
  const attendance = await Attendance.find(filter).lean();

  // Calculate statistics
  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.attendanceStatus === 'present').length,
    absent: attendance.filter(a => a.attendanceStatus === 'absent').length,
    late: attendance.filter(a => a.attendanceStatus === 'late').length,
    leave: attendance.filter(a => a.attendanceStatus === 'leave').length,
    attendanceRate: attendance.length > 0
      ? Math.round((attendance.filter(a => a.attendanceStatus === 'present').length / attendance.length) * 100)
      : 0,
    totalDuration: attendance.reduce((sum, a) => sum + (a.duration || 0), 0),
    avgDuration: attendance.length > 0
      ? Math.round(attendance.reduce((sum, a) => sum + (a.duration || 0), 0) / attendance.length)
      : 0,
    lastAttendance: attendance.length > 0
      ? attendance.sort((a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate))[0].attendanceDate
      : null,
  };

  ApiResponse.success(
    res,
    stats,
    'Attendance statistics retrieved successfully'
  );
});

/**
 * @desc    Get attendance by date range
 * @route   GET /api/member/attendance/range
 * @access  Private (Member only)
 */
const getAttendanceByDateRange = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { startDate, endDate } = req.query;

  // Validate required parameters
  if (!startDate || !endDate) {
    throw ApiError.badRequest('Start date and end date are required');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw ApiError.badRequest('Invalid date format');
  }

  if (start > end) {
    throw ApiError.badRequest('Start date must be before end date');
  }

  // Set end date to end of day
  end.setHours(23, 59, 59, 999);

  const filter = {
    memberId,
    attendanceDate: {
      $gte: start,
      $lte: end,
    },
  };

  const attendance = await Attendance.find(filter)
    .populate('branchId', 'branchName branchCode city')
    .populate('trainerId', 'fullName email')
    .sort({ attendanceDate: -1, checkInTime: -1 })
    .lean();

  // Group by date
  const groupedByDate = {};
  attendance.forEach(a => {
    const dateKey = new Date(a.attendanceDate).toISOString().split('T')[0];
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push({
      id: a._id,
      checkInTime: a.checkInTime,
      checkOutTime: a.checkOutTime,
      status: a.attendanceStatus,
      duration: a.duration,
      branch: a.branchId,
      trainer: a.trainerId,
      notes: a.notes,
    });
  });

  const response = {
    startDate,
    endDate,
    totalDays: attendance.length,
    groupedByDate,
  };

  ApiResponse.success(
    res,
    response,
    'Attendance records retrieved successfully'
  );
});

/**
 * @desc    Get monthly attendance summary
 * @route   GET /api/member/attendance/monthly
 * @access  Private (Member only)
 */
const getMonthlyAttendance = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { month, year } = req.query;

  // Validate month and year
  const currentDate = new Date();
  const monthNum = parseInt(month) || currentDate.getMonth() + 1;
  const yearNum = parseInt(year) || currentDate.getFullYear();

  if (monthNum < 1 || monthNum > 12) {
    throw ApiError.badRequest('Month must be between 1 and 12');
  }

  if (yearNum < 2000 || yearNum > 2100) {
    throw ApiError.badRequest('Invalid year');
  }

  // Get first and last day of month
  const startDate = new Date(yearNum, monthNum - 1, 1);
  const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

  const filter = {
    memberId,
    attendanceDate: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  const attendance = await Attendance.find(filter).lean();

  // Calculate monthly stats
  const stats = {
    month: monthNum,
    year: yearNum,
    total: attendance.length,
    present: attendance.filter(a => a.attendanceStatus === 'present').length,
    absent: attendance.filter(a => a.attendanceStatus === 'absent').length,
    late: attendance.filter(a => a.attendanceStatus === 'late').length,
    leave: attendance.filter(a => a.attendanceStatus === 'leave').length,
    attendanceRate: attendance.length > 0
      ? Math.round((attendance.filter(a => a.attendanceStatus === 'present').length / attendance.length) * 100)
      : 0,
    totalDuration: attendance.reduce((sum, a) => sum + (a.duration || 0), 0),
    avgDuration: attendance.length > 0
      ? Math.round(attendance.reduce((sum, a) => sum + (a.duration || 0), 0) / attendance.length)
      : 0,
  };

  ApiResponse.success(
    res,
    stats,
    'Monthly attendance summary retrieved successfully'
  );
});

module.exports = {
  getAttendanceHistory,
  getAttendanceStats,
  getAttendanceByDateRange,
  getMonthlyAttendance,
};
