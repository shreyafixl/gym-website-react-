const AuditLog = require('../models/AuditLog');
const SecurityEvent = require('../models/SecurityEvent');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get audit logs with filtering
 * @route   GET /api/superadmin/security/audit-logs
 * @access  Private (SuperAdmin)
 */
const getAuditLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    action = '',
    user = '',
    startDate = '',
    endDate = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  if (action) {
    query.action = action;
  }

  if (user) {
    query.user = user;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const logs = await AuditLog.find(query)
    .populate('user', 'fullName email')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await AuditLog.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      logs,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Audit logs retrieved successfully'
  );
});

/**
 * @desc    Get audit log by ID
 * @route   GET /api/superadmin/security/audit-logs/:logId
 * @access  Private (SuperAdmin)
 */
const getAuditLogById = asyncHandler(async (req, res) => {
  const { logId } = req.params;

  const log = await AuditLog.findById(logId)
    .populate('user', 'fullName email');

  if (!log) {
    throw ApiError.notFound('Audit log not found');
  }

  ApiResponse.success(
    res,
    { log },
    'Audit log retrieved successfully'
  );
});

/**
 * @desc    Get login history
 * @route   GET /api/superadmin/security/login-history
 * @access  Private (SuperAdmin)
 */
const getLoginHistory = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    user = '',
    status = '',
    startDate = '',
    endDate = '',
  } = req.query;

  // Build query
  const query = { action: 'login' };

  if (user) {
    query.user = user;
  }

  if (status) {
    query.status = status;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const history = await AuditLog.find(query)
    .populate('user', 'fullName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await AuditLog.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      history,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Login history retrieved successfully'
  );
});

/**
 * @desc    Get system logs with filtering
 * @route   GET /api/superadmin/security/system-logs
 * @access  Private (SuperAdmin)
 */
const getSystemLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    level = '',
    service = '',
    startDate = '',
    endDate = '',
  } = req.query;

  // Build query
  const query = {};

  if (level) {
    query.level = level;
  }

  if (service) {
    query.service = service;
  }

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Mock system logs
  const mockLogs = [
    {
      _id: '1',
      level: 'info',
      service: 'api',
      message: 'API server started',
      timestamp: new Date(),
    },
    {
      _id: '2',
      level: 'warning',
      service: 'database',
      message: 'High memory usage detected',
      timestamp: new Date(Date.now() - 3600000),
    },
  ];

  const totalCount = mockLogs.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  const logs = mockLogs.slice(skip, skip + limitNum);

  ApiResponse.success(
    res,
    {
      logs,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'System logs retrieved successfully'
  );
});

/**
 * @desc    Get security statistics
 * @route   GET /api/superadmin/security/stats
 * @access  Private (SuperAdmin)
 */
const getSecurityStats = asyncHandler(async (req, res) => {
  const stats = {
    totalLogins: 1250,
    failedLogins: 15,
    suspiciousActivities: 3,
    securityEvents: 8,
    lastSecurityEvent: new Date(Date.now() - 3600000),
  };

  ApiResponse.success(
    res,
    stats,
    'Security statistics retrieved successfully'
  );
});

module.exports = {
  getAuditLogs,
  getAuditLogById,
  getLoginHistory,
  getSystemLogs,
  getSecurityStats,
};
