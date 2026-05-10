const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Branch = require('../models/Branch');
const Attendance = require('../models/Attendance');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get member analytics with filtering
 * @route   GET /api/superadmin/analytics/members
 * @access  Private (SuperAdmin)
 */
const getMemberAnalytics = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    branch = '',
    status = '',
    startDate = '',
    endDate = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = { role: 'member' };

  if (branch) {
    query.branch = branch;
  }

  if (status) {
    if (status === 'active') {
      query.membershipStatus = 'active';
    } else if (status === 'inactive') {
      query.membershipStatus = 'inactive';
    }
  }

  if (startDate || endDate) {
    query.joinDate = {};
    if (startDate) query.joinDate.$gte = new Date(startDate);
    if (endDate) query.joinDate.$lte = new Date(endDate);
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Get members
  const members = await User.find(query)
    .select('-password')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await User.countDocuments(query);

  // Get analytics for each member
  const membersWithAnalytics = await Promise.all(
    members.map(async (member) => {
      const attendance = await Attendance.countDocuments({
        member: member._id,
      });

      const revenue = await Transaction.aggregate([
        {
          $match: {
            member: member._id,
            status: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);

      return {
        ...member,
        attendanceCount: attendance,
        totalSpent: revenue.length > 0 ? revenue[0].total : 0,
      };
    })
  );

  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      members: membersWithAnalytics,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Member analytics retrieved successfully'
  );
});

/**
 * @desc    Get financial analytics with filtering
 * @route   GET /api/superadmin/analytics/financial
 * @access  Private (SuperAdmin)
 */
const getFinancialAnalytics = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    branch = '',
    startDate = '',
    endDate = '',
    groupBy = 'day',
  } = req.query;

  // Build query
  const query = { status: 'completed' };

  if (branch) {
    query.branch = branch;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
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

  // Get financial data grouped by date
  const financialData = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: dateFormat,
        revenue: { $sum: '$amount' },
        count: { $sum: 1 },
        averageTransaction: { $avg: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Get summary statistics
  const summary = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        averageTransaction: { $avg: '$amount' },
        minTransaction: { $min: '$amount' },
        maxTransaction: { $max: '$amount' },
      },
    },
  ]);

  const stats = summary.length > 0 ? summary[0] : {
    totalRevenue: 0,
    totalTransactions: 0,
    averageTransaction: 0,
    minTransaction: 0,
    maxTransaction: 0,
  };

  ApiResponse.success(
    res,
    {
      summary: {
        totalRevenue: parseFloat(stats.totalRevenue?.toFixed(2) || 0),
        totalTransactions: stats.totalTransactions || 0,
        averageTransaction: parseFloat(stats.averageTransaction?.toFixed(2) || 0),
        minTransaction: parseFloat(stats.minTransaction?.toFixed(2) || 0),
        maxTransaction: parseFloat(stats.maxTransaction?.toFixed(2) || 0),
      },
      data: financialData.map(item => ({
        date: item._id,
        revenue: parseFloat(item.revenue.toFixed(2)),
        count: item.count,
        averageTransaction: parseFloat(item.averageTransaction.toFixed(2)),
      })),
    },
    'Financial analytics retrieved successfully'
  );
});

/**
 * @desc    Get member growth analytics
 * @route   GET /api/superadmin/analytics/member-growth
 * @access  Private (SuperAdmin)
 */
const getMemberGrowth = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

  const growthData = await User.aggregate([
    {
      $match: {
        role: 'member',
        joinDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$joinDate' } },
        newMembers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  ApiResponse.success(
    res,
    { growthData },
    'Member growth analytics retrieved successfully'
  );
});

/**
 * @desc    Get branch comparison analytics
 * @route   GET /api/superadmin/analytics/branch-comparison
 * @access  Private (SuperAdmin)
 */
const getBranchComparison = asyncHandler(async (req, res) => {
  const branches = await Branch.find({ isActive: true }).lean();

  const comparison = await Promise.all(
    branches.map(async (branch) => {
      const members = await User.countDocuments({
        branch: branch._id,
        role: 'member',
        isActive: true,
      });

      const activeMembers = await User.countDocuments({
        branch: branch._id,
        role: 'member',
        membershipStatus: 'active',
        isActive: true,
      });

      const revenue = await Transaction.aggregate([
        {
          $match: {
            branch: branch._id,
            status: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]);

      return {
        branchId: branch._id,
        branchName: branch.name,
        city: branch.city,
        totalMembers: members,
        activeMembers,
        totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
        utilizationRate: branch.capacity > 0 ? ((members / branch.capacity) * 100).toFixed(2) : 0,
      };
    })
  );

  ApiResponse.success(
    res,
    { comparison },
    'Branch comparison analytics retrieved successfully'
  );
});

module.exports = {
  getMemberAnalytics,
  getFinancialAnalytics,
  getMemberGrowth,
  getBranchComparison,
};
