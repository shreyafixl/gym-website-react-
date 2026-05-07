const User = require('../models/User');
const Branch = require('../models/Branch');
const MembershipPlan = require('../models/MembershipPlan');
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ============================================================================
// DASHBOARD ANALYTICS
// ============================================================================

/**
 * @desc    Get dashboard overview statistics
 * @route   GET /api/superadmin/analytics/dashboard
 * @access  Private (Super Admin only)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // Total counts
  const totalUsers = await User.countDocuments();
  const totalTrainers = await User.countDocuments({ role: 'trainer' });
  const totalMembers = await User.countDocuments({ role: 'user' });
  const totalBranches = await Branch.countDocuments();
  const totalPlans = await MembershipPlan.countDocuments();

  // Membership statistics
  const activeMemberships = await User.countDocuments({ membershipStatus: 'active' });
  const expiredMemberships = await User.countDocuments({ membershipStatus: 'expired' });
  const pendingMemberships = await User.countDocuments({ membershipStatus: 'pending' });

  // Subscription statistics
  const totalSubscriptions = await Subscription.countDocuments();
  const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
  const cancelledSubscriptions = await Subscription.countDocuments({ status: 'cancelled' });

  // Financial statistics
  const successfulTransactions = await Transaction.find({ status: 'success' });
  const totalRevenue = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Monthly revenue (current month)
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthlyTransactions = await Transaction.find({
    status: 'success',
    createdAt: { $gte: firstDayOfMonth },
  });
  const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Yearly revenue (current year)
  const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const yearlyTransactions = await Transaction.find({
    status: 'success',
    createdAt: { $gte: firstDayOfYear },
  });
  const yearlyRevenue = yearlyTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Recent activity counts
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newUsersLast30Days = await User.countDocuments({ createdAt: { $gte: last30Days } });
  const newSubscriptionsLast30Days = await Subscription.countDocuments({ createdAt: { $gte: last30Days } });

  const stats = {
    overview: {
      totalUsers,
      totalTrainers,
      totalMembers,
      totalBranches,
      totalPlans,
    },
    memberships: {
      active: activeMemberships,
      expired: expiredMemberships,
      pending: pendingMemberships,
      total: totalUsers,
      activePercentage: totalUsers > 0 ? ((activeMemberships / totalUsers) * 100).toFixed(2) : 0,
    },
    subscriptions: {
      total: totalSubscriptions,
      active: activeSubscriptions,
      cancelled: cancelledSubscriptions,
    },
    revenue: {
      total: totalRevenue,
      monthly: monthlyRevenue,
      yearly: yearlyRevenue,
      currency: 'INR',
    },
    recentActivity: {
      newUsersLast30Days,
      newSubscriptionsLast30Days,
    },
  };

  ApiResponse.success(res, stats, 'Dashboard statistics retrieved successfully');
});

/**
 * @desc    Get user growth analytics
 * @route   GET /api/superadmin/analytics/user-growth
 * @access  Private (Super Admin only)
 */
const getUserGrowthAnalytics = asyncHandler(async (req, res) => {
  const { period = 'monthly', year = new Date().getFullYear() } = req.query;

  let groupBy;
  let dateFormat;

  if (period === 'daily') {
    groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    dateFormat = 'daily';
  } else if (period === 'weekly') {
    groupBy = { $week: '$createdAt' };
    dateFormat = 'weekly';
  } else {
    groupBy = { $month: '$createdAt' };
    dateFormat = 'monthly';
  }

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(parseInt(year) + 1, 0, 1);

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: yearStart, $lt: yearEnd },
      },
    },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
        members: {
          $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] },
        },
        trainers: {
          $sum: { $cond: [{ $eq: ['$role', 'trainer'] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const totalUsers = await User.countDocuments();
  const totalMembers = await User.countDocuments({ role: 'user' });
  const totalTrainers = await User.countDocuments({ role: 'trainer' });

  ApiResponse.success(
    res,
    {
      period: dateFormat,
      year: parseInt(year),
      growth: userGrowth,
      totals: {
        users: totalUsers,
        members: totalMembers,
        trainers: totalTrainers,
      },
    },
    'User growth analytics retrieved successfully'
  );
});

/**
 * @desc    Get attendance statistics
 * @route   GET /api/superadmin/analytics/attendance
 * @access  Private (Super Admin only)
 */
const getAttendanceStatistics = asyncHandler(async (req, res) => {
  const { startDate, endDate, branchId } = req.query;

  const query = {};
  if (branchId) query.assignedBranch = branchId;

  const users = await User.find(query).select('fullName email attendance');

  let totalCheckIns = 0;
  let totalUsers = users.length;
  let usersWithAttendance = 0;

  const attendanceData = users.map((user) => {
    let checkIns = user.attendance || [];

    if (startDate || endDate) {
      checkIns = checkIns.filter((record) => {
        const recordDate = new Date(record.date);
        if (startDate && recordDate < new Date(startDate)) return false;
        if (endDate && recordDate > new Date(endDate)) return false;
        return true;
      });
    }

    totalCheckIns += checkIns.length;
    if (checkIns.length > 0) usersWithAttendance++;

    return {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      totalCheckIns: checkIns.length,
    };
  });

  const averageAttendance = totalUsers > 0 ? (totalCheckIns / totalUsers).toFixed(2) : 0;
  const attendanceRate = totalUsers > 0 ? ((usersWithAttendance / totalUsers) * 100).toFixed(2) : 0;

  ApiResponse.success(
    res,
    {
      summary: {
        totalUsers,
        totalCheckIns,
        usersWithAttendance,
        averageAttendance: parseFloat(averageAttendance),
        attendanceRate: parseFloat(attendanceRate),
      },
      users: attendanceData.sort((a, b) => b.totalCheckIns - a.totalCheckIns).slice(0, 20),
    },
    'Attendance statistics retrieved successfully'
  );
});

/**
 * @desc    Get branch-wise analytics
 * @route   GET /api/superadmin/analytics/branches
 * @access  Private (Super Admin only)
 */
const getBranchAnalytics = asyncHandler(async (req, res) => {
  const branches = await Branch.find().select('branchName branchCode city state totalMembers capacity branchStatus');

  const branchAnalytics = await Promise.all(
    branches.map(async (branch) => {
      const branchUsers = await User.countDocuments({ assignedBranch: branch._id });
      const activeMembers = await User.countDocuments({
        assignedBranch: branch._id,
        membershipStatus: 'active',
      });

      const branchSubscriptions = await Subscription.countDocuments({ branch: branch._id });
      const activeSubscriptions = await Subscription.countDocuments({
        branch: branch._id,
        status: 'active',
      });

      const branchTransactions = await Transaction.find({
        branch: branch._id,
        status: 'success',
      });
      const branchRevenue = branchTransactions.reduce((sum, t) => sum + t.amount, 0);

      const occupancyRate = branch.capacity > 0 ? ((branchUsers / branch.capacity) * 100).toFixed(2) : 0;

      return {
        branchId: branch._id,
        branchName: branch.branchName,
        branchCode: branch.branchCode,
        city: branch.city,
        state: branch.state,
        status: branch.branchStatus,
        metrics: {
          totalUsers: branchUsers,
          activeMembers,
          capacity: branch.capacity,
          occupancyRate: parseFloat(occupancyRate),
          subscriptions: {
            total: branchSubscriptions,
            active: activeSubscriptions,
          },
          revenue: branchRevenue,
        },
      };
    })
  );

  const totalRevenue = branchAnalytics.reduce((sum, b) => sum + b.metrics.revenue, 0);
  const totalUsers = branchAnalytics.reduce((sum, b) => sum + b.metrics.totalUsers, 0);

  ApiResponse.success(
    res,
    {
      branches: branchAnalytics.sort((a, b) => b.metrics.revenue - a.metrics.revenue),
      summary: {
        totalBranches: branches.length,
        totalRevenue,
        totalUsers,
        averageRevenuePerBranch: branches.length > 0 ? (totalRevenue / branches.length).toFixed(2) : 0,
      },
    },
    'Branch analytics retrieved successfully'
  );
});

/**
 * @desc    Get trainer performance analytics
 * @route   GET /api/superadmin/analytics/trainers
 * @access  Private (Super Admin only)
 */
const getTrainerPerformanceAnalytics = asyncHandler(async (req, res) => {
  const trainers = await User.find({ role: 'trainer' }).select('fullName email phone assignedBranch');

  const trainerAnalytics = await Promise.all(
    trainers.map(async (trainer) => {
      const assignedMembers = await User.countDocuments({ assignedTrainer: trainer._id });
      const activeMembers = await User.countDocuments({
        assignedTrainer: trainer._id,
        membershipStatus: 'active',
      });

      const branch = trainer.assignedBranch
        ? await Branch.findById(trainer.assignedBranch).select('branchName branchCode')
        : null;

      return {
        trainerId: trainer._id,
        fullName: trainer.fullName,
        email: trainer.email,
        phone: trainer.phone,
        branch: branch
          ? {
              id: branch._id,
              name: branch.branchName,
              code: branch.branchCode,
            }
          : null,
        metrics: {
          assignedMembers,
          activeMembers,
          inactiveMembers: assignedMembers - activeMembers,
          retentionRate: assignedMembers > 0 ? ((activeMembers / assignedMembers) * 100).toFixed(2) : 0,
        },
      };
    })
  );

  const totalAssignedMembers = trainerAnalytics.reduce((sum, t) => sum + t.metrics.assignedMembers, 0);
  const averageMembersPerTrainer =
    trainers.length > 0 ? (totalAssignedMembers / trainers.length).toFixed(2) : 0;

  ApiResponse.success(
    res,
    {
      trainers: trainerAnalytics.sort((a, b) => b.metrics.assignedMembers - a.metrics.assignedMembers),
      summary: {
        totalTrainers: trainers.length,
        totalAssignedMembers,
        averageMembersPerTrainer: parseFloat(averageMembersPerTrainer),
      },
    },
    'Trainer performance analytics retrieved successfully'
  );
});

// ============================================================================
// REPORTS
// ============================================================================

/**
 * @desc    Get financial report
 * @route   GET /api/superadmin/analytics/reports/financial
 * @access  Private (Super Admin only)
 */
const getFinancialReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, branchId, type } = req.query;

  const query = { status: 'success' };

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (branchId) query.branch = branchId;
  if (type && type !== 'all') query.type = type;

  const transactions = await Transaction.find(query)
    .populate('user', 'fullName email')
    .populate('branch', 'branchName branchCode')
    .sort({ createdAt: -1 });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalRefunds = transactions.filter((t) => t.status === 'refunded').reduce((sum, t) => sum + t.refundAmount, 0);
  const netRevenue = totalRevenue - totalRefunds;

  const paymentMethodBreakdown = transactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
    return acc;
  }, {});

  const typeBreakdown = transactions.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + t.amount;
    return acc;
  }, {});

  ApiResponse.success(
    res,
    {
      summary: {
        totalTransactions: transactions.length,
        totalRevenue,
        totalRefunds,
        netRevenue,
        currency: 'INR',
      },
      breakdown: {
        byPaymentMethod: paymentMethodBreakdown,
        byType: typeBreakdown,
      },
      transactions: transactions.slice(0, 100).map((t) => t.getPublicProfile()),
    },
    'Financial report generated successfully'
  );
});

/**
 * @desc    Get attendance report
 * @route   GET /api/superadmin/analytics/reports/attendance
 * @access  Private (Super Admin only)
 */
const getAttendanceReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, branchId } = req.query;

  const query = {};
  if (branchId) query.assignedBranch = branchId;

  const users = await User.find(query)
    .select('fullName email role assignedBranch attendance')
    .populate('assignedBranch', 'branchName branchCode');

  const attendanceReport = users.map((user) => {
    let checkIns = user.attendance || [];

    if (startDate || endDate) {
      checkIns = checkIns.filter((record) => {
        const recordDate = new Date(record.date);
        if (startDate && recordDate < new Date(startDate)) return false;
        if (endDate && recordDate > new Date(endDate)) return false;
        return true;
      });
    }

    return {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      branch: user.assignedBranch
        ? {
            id: user.assignedBranch._id,
            name: user.assignedBranch.branchName,
            code: user.assignedBranch.branchCode,
          }
        : null,
      totalCheckIns: checkIns.length,
      lastCheckIn: checkIns.length > 0 ? checkIns[checkIns.length - 1].date : null,
    };
  });

  const totalCheckIns = attendanceReport.reduce((sum, u) => sum + u.totalCheckIns, 0);

  ApiResponse.success(
    res,
    {
      summary: {
        totalUsers: users.length,
        totalCheckIns,
        averageCheckIns: users.length > 0 ? (totalCheckIns / users.length).toFixed(2) : 0,
      },
      report: attendanceReport.sort((a, b) => b.totalCheckIns - a.totalCheckIns),
    },
    'Attendance report generated successfully'
  );
});

/**
 * @desc    Get membership report
 * @route   GET /api/superadmin/analytics/reports/membership
 * @access  Private (Super Admin only)
 */
const getMembershipReport = asyncHandler(async (req, res) => {
  const { status, planId, branchId } = req.query;

  const query = {};
  if (status && status !== 'all') query.status = status;
  if (planId) query.membershipPlan = planId;
  if (branchId) query.branch = branchId;

  const subscriptions = await Subscription.find(query)
    .populate('user', 'fullName email phone')
    .populate('membershipPlan', 'planName planCode price duration durationType')
    .populate('branch', 'branchName branchCode')
    .sort({ createdAt: -1 });

  const statusBreakdown = subscriptions.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  const planBreakdown = subscriptions.reduce((acc, s) => {
    const planName = s.membershipPlan?.planName || 'Unknown';
    acc[planName] = (acc[planName] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.amountPaid, 0);
  const expiringSoon = subscriptions.filter((s) => s.isExpiringSoon()).length;

  ApiResponse.success(
    res,
    {
      summary: {
        totalSubscriptions: subscriptions.length,
        totalRevenue,
        expiringSoon,
        currency: 'INR',
      },
      breakdown: {
        byStatus: statusBreakdown,
        byPlan: planBreakdown,
      },
      subscriptions: subscriptions.slice(0, 100).map((s) => s.getPublicProfile()),
    },
    'Membership report generated successfully'
  );
});

/**
 * @desc    Get trainer report
 * @route   GET /api/superadmin/analytics/reports/trainers
 * @access  Private (Super Admin only)
 */
const getTrainerReport = asyncHandler(async (req, res) => {
  const { branchId } = req.query;

  const query = { role: 'trainer' };
  if (branchId) query.assignedBranch = branchId;

  const trainers = await User.find(query)
    .select('fullName email phone assignedBranch createdAt')
    .populate('assignedBranch', 'branchName branchCode city');

  const trainerReport = await Promise.all(
    trainers.map(async (trainer) => {
      const assignedMembers = await User.countDocuments({ assignedTrainer: trainer._id });
      const activeMembers = await User.countDocuments({
        assignedTrainer: trainer._id,
        membershipStatus: 'active',
      });

      const members = await User.find({ assignedTrainer: trainer._id }).select('fullName email membershipStatus');

      return {
        trainerId: trainer._id,
        fullName: trainer.fullName,
        email: trainer.email,
        phone: trainer.phone,
        branch: trainer.assignedBranch
          ? {
              id: trainer.assignedBranch._id,
              name: trainer.assignedBranch.branchName,
              code: trainer.assignedBranch.branchCode,
              city: trainer.assignedBranch.city,
            }
          : null,
        joinedDate: trainer.createdAt,
        metrics: {
          totalAssignedMembers: assignedMembers,
          activeMembers,
          inactiveMembers: assignedMembers - activeMembers,
          retentionRate: assignedMembers > 0 ? ((activeMembers / assignedMembers) * 100).toFixed(2) : 0,
        },
        members: members.map((m) => ({
          id: m._id,
          fullName: m.fullName,
          email: m.email,
          status: m.membershipStatus,
        })),
      };
    })
  );

  ApiResponse.success(
    res,
    {
      summary: {
        totalTrainers: trainers.length,
        totalAssignedMembers: trainerReport.reduce((sum, t) => sum + t.metrics.totalAssignedMembers, 0),
      },
      report: trainerReport.sort((a, b) => b.metrics.totalAssignedMembers - a.metrics.totalAssignedMembers),
    },
    'Trainer report generated successfully'
  );
});

/**
 * @desc    Get branch performance report
 * @route   GET /api/superadmin/analytics/reports/branches
 * @access  Private (Super Admin only)
 */
const getBranchPerformanceReport = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const query = {};
  if (status && status !== 'all') query.branchStatus = status;

  const branches = await Branch.find(query);

  const branchReport = await Promise.all(
    branches.map(async (branch) => {
      const totalUsers = await User.countDocuments({ assignedBranch: branch._id });
      const activeMembers = await User.countDocuments({
        assignedBranch: branch._id,
        membershipStatus: 'active',
      });
      const trainers = await User.countDocuments({
        assignedBranch: branch._id,
        role: 'trainer',
      });

      const subscriptions = await Subscription.countDocuments({ branch: branch._id });
      const activeSubscriptions = await Subscription.countDocuments({
        branch: branch._id,
        status: 'active',
      });

      const transactions = await Transaction.find({
        branch: branch._id,
        status: 'success',
      });
      const revenue = transactions.reduce((sum, t) => sum + t.amount, 0);

      const monthlyTransactions = await Transaction.find({
        branch: branch._id,
        status: 'success',
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      });
      const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);

      return {
        branchId: branch._id,
        branchName: branch.branchName,
        branchCode: branch.branchCode,
        location: {
          address: branch.address,
          city: branch.city,
          state: branch.state,
          pincode: branch.pincode,
        },
        contact: {
          phone: branch.contactNumber,
          email: branch.email,
        },
        status: branch.branchStatus,
        metrics: {
          users: {
            total: totalUsers,
            activeMembers,
            trainers,
          },
          subscriptions: {
            total: subscriptions,
            active: activeSubscriptions,
          },
          revenue: {
            total: revenue,
            monthly: monthlyRevenue,
          },
          capacity: branch.capacity,
          occupancyRate: branch.capacity > 0 ? ((totalUsers / branch.capacity) * 100).toFixed(2) : 0,
        },
        facilities: branch.facilities,
      };
    })
  );

  const totalRevenue = branchReport.reduce((sum, b) => sum + b.metrics.revenue.total, 0);
  const totalUsers = branchReport.reduce((sum, b) => sum + b.metrics.users.total, 0);

  ApiResponse.success(
    res,
    {
      summary: {
        totalBranches: branches.length,
        totalRevenue,
        totalUsers,
        averageRevenuePerBranch: branches.length > 0 ? (totalRevenue / branches.length).toFixed(2) : 0,
      },
      report: branchReport.sort((a, b) => b.metrics.revenue.total - a.metrics.revenue.total),
    },
    'Branch performance report generated successfully'
  );
});

module.exports = {
  getDashboardStats,
  getUserGrowthAnalytics,
  getAttendanceStatistics,
  getBranchAnalytics,
  getTrainerPerformanceAnalytics,
  getFinancialReport,
  getAttendanceReport,
  getMembershipReport,
  getTrainerReport,
  getBranchPerformanceReport,
};
