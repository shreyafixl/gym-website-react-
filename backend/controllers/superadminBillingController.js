const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Branch = require('../models/Branch');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all billing records with pagination and filtering
 * @route   GET /api/superadmin/billing
 * @access  Private (SuperAdmin)
 */
const getBillingRecords = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    search = '',
    status = '',
    branch = '',
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
  const billingRecords = await Transaction.find(query)
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
      billingRecords,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Billing records retrieved successfully'
  );
});

/**
 * @desc    Create a new billing record
 * @route   POST /api/superadmin/billing
 * @access  Private (SuperAdmin)
 */
const createBillingRecord = asyncHandler(async (req, res) => {
  const {
    user,
    branch,
    amount,
    description,
    paymentMethod,
    dueDate,
  } = req.body;

  // Validate required fields
  if (!user || !branch || !amount || !description) {
    throw ApiError.badRequest(
      'Please provide all required fields: user, branch, amount, description'
    );
  }

  // Validate amount
  if (amount <= 0) {
    throw ApiError.badRequest('Amount must be greater than 0');
  }

  // Verify user exists
  const userData = await User.findById(user);
  if (!userData) {
    throw ApiError.notFound('User not found');
  }

  // Verify branch exists
  const branchData = await Branch.findById(branch);
  if (!branchData) {
    throw ApiError.notFound('Branch not found');
  }

  // Create billing record
  const billingRecord = await Transaction.create({
    user,
    branch,
    amount,
    description,
    paymentMethod: paymentMethod || 'pending',
    status: 'pending',
    dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    type: 'billing',
  });

  // Get billing record with populated fields
  const createdRecord = await Transaction.findById(billingRecord._id)
    .populate('user', 'fullName email phone')
    .populate('branch', 'name city');

  ApiResponse.success(
    res,
    { billingRecord: createdRecord },
    'Billing record created successfully',
    201
  );
});

/**
 * @desc    Get billing record by ID
 * @route   GET /api/superadmin/billing/:billingId
 * @access  Private (SuperAdmin)
 */
const getBillingRecordById = asyncHandler(async (req, res) => {
  const { billingId } = req.params;

  const billingRecord = await Transaction.findById(billingId)
    .populate('user', 'fullName email phone')
    .populate('branch', 'name city');

  if (!billingRecord) {
    throw ApiError.notFound('Billing record not found');
  }

  ApiResponse.success(
    res,
    { billingRecord },
    'Billing record retrieved successfully'
  );
});

/**
 * @desc    Update billing record
 * @route   PUT /api/superadmin/billing/:billingId
 * @access  Private (SuperAdmin)
 */
const updateBillingRecord = asyncHandler(async (req, res) => {
  const { billingId } = req.params;
  const updateData = req.body;

  // Find billing record
  const billingRecord = await Transaction.findById(billingId);
  if (!billingRecord) {
    throw ApiError.notFound('Billing record not found');
  }

  // Validate amount if being updated
  if (updateData.amount && updateData.amount <= 0) {
    throw ApiError.badRequest('Amount must be greater than 0');
  }

  // Verify user if being updated
  if (updateData.user && updateData.user !== billingRecord.user?.toString()) {
    const userData = await User.findById(updateData.user);
    if (!userData) {
      throw ApiError.notFound('User not found');
    }
  }

  // Verify branch if being updated
  if (updateData.branch && updateData.branch !== billingRecord.branch?.toString()) {
    const branchData = await Branch.findById(updateData.branch);
    if (!branchData) {
      throw ApiError.notFound('Branch not found');
    }
  }

  // Update billing record
  const updatedRecord = await Transaction.findByIdAndUpdate(
    billingId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('user', 'fullName email phone')
    .populate('branch', 'name city');

  ApiResponse.success(
    res,
    { billingRecord: updatedRecord },
    'Billing record updated successfully'
  );
});

/**
 * @desc    Delete billing record
 * @route   DELETE /api/superadmin/billing/:billingId
 * @access  Private (SuperAdmin)
 */
const deleteBillingRecord = asyncHandler(async (req, res) => {
  const { billingId } = req.params;

  // Find billing record
  const billingRecord = await Transaction.findById(billingId);
  if (!billingRecord) {
    throw ApiError.notFound('Billing record not found');
  }

  // Delete billing record
  await Transaction.findByIdAndDelete(billingId);

  ApiResponse.success(
    res,
    { billingId },
    'Billing record deleted successfully'
  );
});

/**
 * @desc    Mark billing record as paid
 * @route   PUT /api/superadmin/billing/:billingId/mark-paid
 * @access  Private (SuperAdmin)
 */
const markBillingAsPaid = asyncHandler(async (req, res) => {
  const { billingId } = req.params;
  const { paymentMethod, paidDate } = req.body;

  const billingRecord = await Transaction.findById(billingId);
  if (!billingRecord) {
    throw ApiError.notFound('Billing record not found');
  }

  billingRecord.status = 'completed';
  billingRecord.paymentMethod = paymentMethod || billingRecord.paymentMethod;
  billingRecord.paidDate = paidDate || new Date();
  await billingRecord.save();

  const updatedRecord = await Transaction.findById(billingId)
    .populate('user', 'fullName email phone')
    .populate('branch', 'name city');

  ApiResponse.success(
    res,
    { billingRecord: updatedRecord },
    'Billing record marked as paid'
  );
});

/**
 * @desc    Get billing summary
 * @route   GET /api/superadmin/billing/summary
 * @access  Private (SuperAdmin)
 */
const getBillingSummary = asyncHandler(async (req, res) => {
  const { startDate = '', endDate = '', branch = '' } = req.query;

  // Build query
  const query = { type: 'billing' };

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

  // Get billing statistics
  const stats = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  const summary = {
    totalBillings: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    failedAmount: 0,
    byStatus: {},
  };

  stats.forEach((stat) => {
    summary.totalBillings += stat.count;
    summary.totalAmount += stat.totalAmount;
    summary.byStatus[stat._id] = {
      count: stat.count,
      amount: parseFloat(stat.totalAmount.toFixed(2)),
    };

    if (stat._id === 'completed') {
      summary.paidAmount = parseFloat(stat.totalAmount.toFixed(2));
    } else if (stat._id === 'pending') {
      summary.pendingAmount = parseFloat(stat.totalAmount.toFixed(2));
    } else if (stat._id === 'failed') {
      summary.failedAmount = parseFloat(stat.totalAmount.toFixed(2));
    }
  });

  summary.totalAmount = parseFloat(summary.totalAmount.toFixed(2));

  ApiResponse.success(
    res,
    summary,
    'Billing summary retrieved successfully'
  );
});

module.exports = {
  getBillingRecords,
  createBillingRecord,
  getBillingRecordById,
  updateBillingRecord,
  deleteBillingRecord,
  markBillingAsPaid,
  getBillingSummary,
};
