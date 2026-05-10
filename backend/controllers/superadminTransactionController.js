const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Branch = require('../models/Branch');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all transactions with pagination and filtering
 * @route   GET /api/superadmin/transactions
 * @access  Private (SuperAdmin)
 */
const getTransactions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    search = '',
    status = '',
    branch = '',
    type = '',
    startDate = '',
    endDate = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  // Search by user name or email
  if (search) {
    const users = await User.find({
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');

    if (users.length > 0) {
      query.user = { $in: users.map(u => u._id) };
    }
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by type
  if (type) {
    query.type = type;
  }

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
  const transactions = await Transaction.find(query)
    .populate('user', 'fullName email phone')
    .populate('branch', 'name city')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await Transaction.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      transactions,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Transactions retrieved successfully'
  );
});

/**
 * @desc    Get transaction by ID
 * @route   GET /api/superadmin/transactions/:transactionId
 * @access  Private (SuperAdmin)
 */
const getTransactionById = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  const transaction = await Transaction.findById(transactionId)
    .populate('user', 'fullName email phone')
    .populate('branch', 'name city');

  if (!transaction) {
    throw ApiError.notFound('Transaction not found');
  }

  ApiResponse.success(
    res,
    { transaction },
    'Transaction retrieved successfully'
  );
});

/**
 * @desc    Search transactions
 * @route   GET /api/superadmin/transactions/search
 * @access  Private (SuperAdmin)
 */
const searchTransactions = asyncHandler(async (req, res) => {
  const {
    q = '',
    page = 1,
    per_page = 20,
    status = '',
    branch = '',
    startDate = '',
    endDate = '',
  } = req.query;

  // Build query
  const query = {};

  // Search by user name, email, or transaction ID
  if (q) {
    query.$or = [
      { _id: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];

    // Also search by user
    const users = await User.find({
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    }).select('_id');

    if (users.length > 0) {
      query.$or.push({ user: { $in: users.map(u => u._id) } });
    }
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

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

  // Execute query
  const transactions = await Transaction.find(query)
    .populate('user', 'fullName email phone')
    .populate('branch', 'name city')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await Transaction.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      transactions,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Transactions search completed successfully'
  );
});

/**
 * @desc    Get transaction statistics
 * @route   GET /api/superadmin/transactions/stats
 * @access  Private (SuperAdmin)
 */
const getTransactionStats = asyncHandler(async (req, res) => {
  const { startDate = '', endDate = '', branch = '' } = req.query;

  // Build query
  const query = {};

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  if (branch) {
    query.branch = branch;
  }

  // Get statistics by status
  const statsByStatus = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        averageAmount: { $avg: '$amount' },
      },
    },
  ]);

  // Get statistics by type
  const statsByType = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  // Get overall statistics
  const overallStats = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        averageAmount: { $avg: '$amount' },
        minAmount: { $min: '$amount' },
        maxAmount: { $max: '$amount' },
      },
    },
  ]);

  const stats = overallStats.length > 0 ? overallStats[0] : {
    totalTransactions: 0,
    totalAmount: 0,
    averageAmount: 0,
    minAmount: 0,
    maxAmount: 0,
  };

  ApiResponse.success(
    res,
    {
      overall: {
        totalTransactions: stats.totalTransactions || 0,
        totalAmount: parseFloat(stats.totalAmount?.toFixed(2) || 0),
        averageAmount: parseFloat(stats.averageAmount?.toFixed(2) || 0),
        minAmount: parseFloat(stats.minAmount?.toFixed(2) || 0),
        maxAmount: parseFloat(stats.maxAmount?.toFixed(2) || 0),
      },
      byStatus: statsByStatus.map(item => ({
        status: item._id,
        count: item.count,
        totalAmount: parseFloat(item.totalAmount.toFixed(2)),
        averageAmount: parseFloat(item.averageAmount.toFixed(2)),
      })),
      byType: statsByType.map(item => ({
        type: item._id,
        count: item.count,
        totalAmount: parseFloat(item.totalAmount.toFixed(2)),
      })),
    },
    'Transaction statistics retrieved successfully'
  );
});

/**
 * @desc    Export transactions
 * @route   GET /api/superadmin/transactions/export
 * @access  Private (SuperAdmin)
 */
const exportTransactions = asyncHandler(async (req, res) => {
  const { format = 'json', status = '', branch = '', startDate = '', endDate = '' } = req.query;

  // Build query
  const query = {};

  if (status) {
    query.status = status;
  }

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

  // Get transactions
  const transactions = await Transaction.find(query)
    .populate('user', 'fullName email phone')
    .populate('branch', 'name city')
    .lean();

  if (format === 'csv') {
    // Convert to CSV format
    const csvHeader = 'ID,Member,Email,Branch,Amount,Status,Type,Description,Date\n';
    const csvRows = transactions
      .map(
        (t) =>
          `${t._id},"${t.user?.fullName || 'N/A'}",${t.user?.email || 'N/A'},${t.branch?.name || 'N/A'},${t.amount},${t.status},${t.type},"${t.description || ''}",${t.createdAt}`
      )
      .join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    return res.send(csv);
  }

  // Default JSON format
  ApiResponse.success(
    res,
    { transactions, count: transactions.length },
    'Transactions exported successfully'
  );
});

module.exports = {
  getTransactions,
  getTransactionById,
  searchTransactions,
  getTransactionStats,
  exportTransactions,
};
