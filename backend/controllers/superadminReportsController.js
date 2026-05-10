const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Branch = require('../models/Branch');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all reports with pagination
 * @route   GET /api/superadmin/reports
 * @access  Private (SuperAdmin)
 */
const getReports = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    type = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  if (type) {
    query.type = type;
  }

  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Mock reports data - in production, this would query a Reports collection
  const mockReports = [
    {
      _id: '1',
      name: 'Monthly Revenue Report',
      type: 'revenue',
      description: 'Revenue summary for the current month',
      status: 'completed',
      generatedAt: new Date(),
      generatedBy: 'System',
      fileUrl: '/reports/revenue-2024-01.pdf',
    },
    {
      _id: '2',
      name: 'Member Analytics Report',
      type: 'members',
      description: 'Member growth and activity analysis',
      status: 'completed',
      generatedAt: new Date(Date.now() - 86400000),
      generatedBy: 'System',
      fileUrl: '/reports/members-2024-01.pdf',
    },
    {
      _id: '3',
      name: 'Branch Performance Report',
      type: 'branches',
      description: 'Performance metrics for all branches',
      status: 'processing',
      generatedAt: new Date(Date.now() - 3600000),
      generatedBy: 'System',
      fileUrl: null,
    },
  ];

  const totalCount = mockReports.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  const reports = mockReports
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      }
      return a[sortBy] < b[sortBy] ? 1 : -1;
    })
    .slice(skip, skip + limitNum);

  ApiResponse.success(
    res,
    {
      reports,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Reports retrieved successfully'
  );
});

/**
 * @desc    Generate a new report
 * @route   POST /api/superadmin/reports/generate
 * @access  Private (SuperAdmin)
 */
const generateReport = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    description,
    filters = {},
  } = req.body;

  // Validate required fields
  if (!name || !type) {
    throw ApiError.badRequest('Please provide name and type');
  }

  // Generate report based on type
  let reportData = {};

  switch (type) {
    case 'revenue':
      reportData = await generateRevenueReport(filters);
      break;
    case 'members':
      reportData = await generateMembersReport(filters);
      break;
    case 'branches':
      reportData = await generateBranchesReport(filters);
      break;
    case 'transactions':
      reportData = await generateTransactionsReport(filters);
      break;
    default:
      throw ApiError.badRequest('Invalid report type');
  }

  // Create report object
  const report = {
    _id: Date.now().toString(),
    name,
    type,
    description,
    status: 'completed',
    generatedAt: new Date(),
    generatedBy: 'SuperAdmin',
    data: reportData,
    fileUrl: `/reports/${type}-${Date.now()}.pdf`,
  };

  ApiResponse.success(
    res,
    { report },
    'Report generated successfully',
    201
  );
});

/**
 * @desc    Get report by ID
 * @route   GET /api/superadmin/reports/:reportId
 * @access  Private (SuperAdmin)
 */
const getReportById = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  // Mock report retrieval
  const report = {
    _id: reportId,
    name: 'Sample Report',
    type: 'revenue',
    description: 'Sample report description',
    status: 'completed',
    generatedAt: new Date(),
    generatedBy: 'System',
    fileUrl: `/reports/sample-${reportId}.pdf`,
    data: {
      totalRevenue: 50000,
      transactions: 150,
      averageTransaction: 333.33,
    },
  };

  ApiResponse.success(
    res,
    { report },
    'Report retrieved successfully'
  );
});

/**
 * @desc    Export report
 * @route   GET /api/superadmin/reports/:reportId/export
 * @access  Private (SuperAdmin)
 */
const exportReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { format = 'pdf' } = req.query;

  // Mock export - in production, would generate actual file
  const fileName = `report-${reportId}.${format}`;

  res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.send(`Mock ${format.toUpperCase()} export for report ${reportId}`);
});

/**
 * @desc    Delete report
 * @route   DELETE /api/superadmin/reports/:reportId
 * @access  Private (SuperAdmin)
 */
const deleteReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  ApiResponse.success(
    res,
    { reportId },
    'Report deleted successfully'
  );
});

// Helper functions for report generation
async function generateRevenueReport(filters) {
  const query = { status: 'completed' };

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

  const revenueData = await Transaction.aggregate([
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

  return revenueData.length > 0 ? revenueData[0] : {
    totalRevenue: 0,
    totalTransactions: 0,
    averageTransaction: 0,
  };
}

async function generateMembersReport(filters) {
  const query = { role: 'member', isActive: true };

  if (filters.branch) {
    query.branch = filters.branch;
  }

  const totalMembers = await User.countDocuments(query);
  const activeMembers = await User.countDocuments({
    ...query,
    membershipStatus: 'active',
  });

  return {
    totalMembers,
    activeMembers,
    inactiveMembers: totalMembers - activeMembers,
  };
}

async function generateBranchesReport(filters) {
  const branches = await Branch.find({ isActive: true }).lean();

  const branchStats = await Promise.all(
    branches.map(async (branch) => {
      const members = await User.countDocuments({
        branch: branch._id,
        role: 'member',
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
        members,
        revenue: revenue.length > 0 ? revenue[0].total : 0,
      };
    })
  );

  return { branches: branchStats };
}

async function generateTransactionsReport(filters) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

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

  return { transactionsByStatus: stats };
}

module.exports = {
  getReports,
  generateReport,
  getReportById,
  exportReport,
  deleteReport,
};
