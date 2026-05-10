const User = require('../models/User');
const Branch = require('../models/Branch');
const Transaction = require('../models/Transaction');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get dashboard overview statistics
 * @route   GET /api/superadmin/dashboard/overview
 * @access  Private (SuperAdmin)
 */
const getDashboardOverview = asyncHandler(async (req, res) => {
  try {
    // Fetch total users count
    const totalUsers = await User.countDocuments();

    // Fetch active members count (members with active membership)
    const activeMembers = await User.countDocuments({
      role: 'member',
      membershipStatus: 'active',
      isActive: true,
    });

    // Fetch total revenue from transactions
    const revenueData = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Fetch total branches count
    const totalBranches = await Branch.countDocuments({ isActive: true });

    // Calculate additional statistics
    const inactiveUsers = totalUsers - activeMembers;
    const totalTrainers = await User.countDocuments({
      role: 'trainer',
      isActive: true,
    });
    const totalAdmins = await User.countDocuments({
      role: 'admin',
      isActive: true,
    });

    // Get new users this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Get revenue this month
    const monthlyRevenueData = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$amount' },
        },
      },
    ]);

    const monthlyRevenue = monthlyRevenueData.length > 0 ? monthlyRevenueData[0].monthlyRevenue : 0;

    // Get revenue by branch
    const revenueByBranch = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
        },
      },
      {
        $group: {
          _id: '$branch',
          branchRevenue: { $sum: '$amount' },
        },
      },
      {
        $sort: { branchRevenue: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Get membership status breakdown
    const membershipBreakdown = await User.aggregate([
      {
        $match: { role: 'member' },
      },
      {
        $group: {
          _id: '$membershipStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const membershipStats = {
      active: 0,
      expired: 0,
      pending: 0,
    };

    membershipBreakdown.forEach((item) => {
      if (item._id in membershipStats) {
        membershipStats[item._id] = item.count;
      }
    });

    // Prepare response
    const overview = {
      totalUsers,
      activeMembers,
      inactiveUsers,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      totalBranches,
      totalTrainers,
      totalAdmins,
      newUsersThisMonth,
      membershipStats,
      topBranchesByRevenue: revenueByBranch.map((item) => ({
        branchId: item._id,
        revenue: parseFloat(item.branchRevenue.toFixed(2)),
      })),
    };

    ApiResponse.success(
      res,
      overview,
      'Dashboard overview retrieved successfully'
    );
  } catch (error) {
    throw ApiError.internal(`Failed to fetch dashboard overview: ${error.message}`);
  }
});

module.exports = {
  getDashboardOverview,
};
