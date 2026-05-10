const Transaction = require('../models/Transaction');
const Branch = require('../models/Branch');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get revenue data with filtering
 * @route   GET /api/superadmin/revenue
 * @access  Private (SuperAdmin)
 */
const getRevenue = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    branch = '',
    startDate = '',
    endDate = '',
    status = 'completed',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = { status };

  // Filter by branch
  if (branch) {
    query.branch = branch;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const revenueRecords = await Transaction.find(query)
    .populate('user', 'fullName email')
    .populate('branch', 'name city')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await Transaction.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  // Calculate total revenue
  const revenueData = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
      },
    },
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  ApiResponse.success(
    res,
    {
      revenueRecords,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Revenue data retrieved successfully'
  );
});

/**
 * @desc    Get revenue summary with various filters
 * @route   GET /api/superadmin/revenue/summary
 * @access  Private (SuperAdmin)
 */
const getRevenueSummary = asyncHandler(async (req, res) => {
  const {
    startDate = '',
    endDate = '',
    branch = '',
    groupBy = 'day', // day, week, month, year
  } = req.query;

  // Build query
  const query = { status: 'completed' };

  if (branch) {
    query.branch = branch;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  // Determine grouping format
  let dateFormat;
  switch (groupBy) {
    case 'week':
      dateFormat = { $week: '$createdAt' };
      break;
    case 'month':
      dateFormat = { $month: '$createdAt' };
      break;
    case 'year':
      dateFormat = { $year: '$createdAt' };
      break;
    case 'day':
    default:
      dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      break;
  }

  // Get revenue by date
  const revenueByDate = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: dateFormat,
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Get revenue by branch
  const revenueByBranch = await Transaction.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'branches',
        localField: 'branch',
        foreignField: '_id',
        as: 'branchData',
      },
    },
    {
      $group: {
        _id: '$branch',
        branchName: { $first: { $arrayElemAt: ['$branchData.name', 0] } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
  ]);

  // Get total revenue
  const totalRevenueData = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        averageTransaction: { $avg: '$amount' },
      },
    },
  ]);

  const summary = totalRevenueData.length > 0 ? totalRevenueData[0] : {
    totalRevenue: 0,
    totalTransactions: 0,
    averageTransaction: 0,
  };

  ApiResponse.success(
    res,
    {
      summary: {
        totalRevenue: parseFloat(summary.totalRevenue?.toFixed(2) || 0),
        totalTransactions: summary.totalTransactions || 0,
        averageTransaction: parseFloat(summary.averageTransaction?.toFixed(2) || 0),
      },
      revenueByDate: revenueByDate.map(item => ({
        date: item._id,
        revenue: parseFloat(item.revenue.toFixed(2)),
        count: item.count,
      })),
      revenueByBranch: revenueByBranch.map(item => ({
        branchId: item._id,
        branchName: item.branchName,
        revenue: parseFloat(item.revenue.toFixed(2)),
        count: item.count,
      })),
    },
    'Revenue summary retrieved successfully'
  );
});

/**
 * @desc    Get revenue comparison between branches
 * @route   GET /api/superadmin/revenue/compare
 * @access  Private (SuperAdmin)
 */
const compareRevenue = asyncHandler(async (req, res) => {
  const { startDate = '', endDate = '', branchIds = [] } = req.query;

  // Build query
  const query = { status: 'completed' };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const ids = Array.isArray(branchIds) ? branchIds : [branchIds];

  if (ids.length > 0) {
    query.branch = { $in: ids };
  }

  // Get revenue by branch
  const comparison = await Transaction.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'branches',
        localField: 'branch',
        foreignField: '_id',
        as: 'branchData',
      },
    },
    {
      $group: {
        _id: '$branch',
        branchName: { $first: { $arrayElemAt: ['$branchData.name', 0] } },
        city: { $first: { $arrayElemAt: ['$branchData.city', 0] } },
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        averageTransaction: { $avg: '$amount' },
        minTransaction: { $min: '$amount' },
        maxTransaction: { $max: '$amount' },
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  ApiResponse.success(
    res,
    {
      comparison: comparison.map(item => ({
        branchId: item._id,
        branchName: item.branchName,
        city: item.city,
        totalRevenue: parseFloat(item.totalRevenue.toFixed(2)),
        totalTransactions: item.totalTransactions,
        averageTransaction: parseFloat(item.averageTransaction.toFixed(2)),
        minTransaction: parseFloat(item.minTransaction.toFixed(2)),
        maxTransaction: parseFloat(item.maxTransaction.toFixed(2)),
      })),
    },
    'Revenue comparison retrieved successfully'
  );
});

/**
 * @desc    Get revenue trends
 * @route   GET /api/superadmin/revenue/trends
 * @access  Private (SuperAdmin)
 */
const getRevenueTrends = asyncHandler(async (req, res) => {
  const { days = 30, branch = '' } = req.query;

  // Build query
  const query = { status: 'completed' };

  if (branch) {
    query.branch = branch;
  }

  // Get date range
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  query.createdAt = {
    $gte: startDate,
    $lte: endDate,
  };

  // Get daily revenue
  const trends = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Calculate moving average (7-day)
  const movingAverage = [];
  for (let i = 0; i < trends.length; i++) {
    const start = Math.max(0, i - 6);
    const slice = trends.slice(start, i + 1);
    const avg = slice.reduce((sum, item) => sum + item.revenue, 0) / slice.length;
    movingAverage.push({
      date: trends[i]._id,
      movingAverage: parseFloat(avg.toFixed(2)),
    });
  }

  ApiResponse.success(
    res,
    {
      trends: trends.map(item => ({
        date: item._id,
        revenue: parseFloat(item.revenue.toFixed(2)),
        count: item.count,
      })),
      movingAverage,
    },
    'Revenue trends retrieved successfully'
  );
});

module.exports = {
  getRevenue,
  getRevenueSummary,
  compareRevenue,
  getRevenueTrends,
};
