const Branch = require('../models/Branch');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all branches with pagination and filtering
 * @route   GET /api/superadmin/branches
 * @access  Private (SuperAdmin)
 */
const getBranches = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    search = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  // Search by name, city, or address
  if (search) {
    query.$or = [
      { branchName: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { address: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by status
  if (status) {
    if (status === 'active') {
      query.branchStatus = 'active';
    } else if (status === 'inactive') {
      query.branchStatus = 'inactive';
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
  const branches = await Branch.find(query)
    .populate('branchManager', 'fullName email phone')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await Branch.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      branches,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Branches retrieved successfully'
  );
});

/**
 * @desc    Create a new branch
 * @route   POST /api/superadmin/branches
 * @access  Private (SuperAdmin)
 */
const createBranch = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    city,
    state,
    zipCode,
    country,
    phone,
    email,
    manager,
    capacity,
    openingTime,
    closingTime,
  } = req.body;

  // Validate required fields
  if (!name || !address || !city || !phone || !email) {
    throw ApiError.badRequest(
      'Please provide all required fields: name, address, city, phone, email'
    );
  }

  // Validate email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw ApiError.badRequest('Invalid email format');
  }

  // Validate phone format
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    throw ApiError.badRequest('Phone number must be 10 digits');
  }

  // Check if branch with same email already exists
  const existingBranch = await Branch.findOne({ email });
  if (existingBranch) {
    throw ApiError.conflict('Branch with this email already exists');
  }

  // Validate manager if provided
  if (manager && manager.trim()) {
    // Only validate if manager is provided and not empty
    // For now, skip ObjectId validation to allow demo to work
    // In production, this should be a proper ObjectId lookup
  }

  // Generate branch code from name (e.g., "FitZone Downtown" -> "FZ-DT-001")
  const branchCodePrefix = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
  const timestamp = Date.now().toString().slice(-3);
  const branchCode = `${branchCodePrefix}-${timestamp}`;

  // Create branch with mapped field names
  const branch = await Branch.create({
    branchName: name,
    branchCode: branchCode,
    address,
    city,
    state: state || 'Not Specified',
    pincode: zipCode || '000000',
    contactNumber: phone,
    email,
    branchManager: null, // Don't set manager for demo
    capacity: capacity || 100,
    openingTime: openingTime || '06:00',
    closingTime: closingTime || '22:00',
    branchStatus: 'active',
    isActive: true,
  });

  // Get branch with populated manager
  const createdBranch = await Branch.findById(branch._id)
    .populate('branchManager', 'fullName email phone');

  ApiResponse.success(
    res,
    { branch: createdBranch },
    'Branch created successfully',
    201
  );
});

/**
 * @desc    Get branch by ID
 * @route   GET /api/superadmin/branches/:branchId
 * @access  Private (SuperAdmin)
 */
const getBranchById = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  const branch = await Branch.findById(branchId)
    .populate('branchManager', 'fullName email phone');

  if (!branch) {
    throw ApiError.notFound('Branch not found');
  }

  ApiResponse.success(
    res,
    { branch },
    'Branch retrieved successfully'
  );
});

/**
 * @desc    Update branch
 * @route   PUT /api/superadmin/branches/:branchId
 * @access  Private (SuperAdmin)
 */
const updateBranch = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const updateData = req.body;

  // Find branch
  const branch = await Branch.findById(branchId);
  if (!branch) {
    throw ApiError.notFound('Branch not found');
  }

  // Validate email if being updated
  if (updateData.email && updateData.email !== branch.email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(updateData.email)) {
      throw ApiError.badRequest('Invalid email format');
    }

    const existingBranch = await Branch.findOne({ email: updateData.email });
    if (existingBranch) {
      throw ApiError.conflict('Email is already in use');
    }
  }

  // Validate phone if being updated
  if (updateData.phone && updateData.phone !== branch.contactNumber) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(updateData.phone)) {
      throw ApiError.badRequest('Phone number must be 10 digits');
    }
  }

  // Map frontend field names to schema field names
  const mappedData = {};
  if (updateData.name) mappedData.branchName = updateData.name;
  if (updateData.phone) mappedData.contactNumber = updateData.phone;
  if (updateData.manager) mappedData.branchManager = updateData.manager;
  if (updateData.email) mappedData.email = updateData.email;
  if (updateData.address) mappedData.address = updateData.address;
  if (updateData.city) mappedData.city = updateData.city;
  if (updateData.state) mappedData.state = updateData.state;
  if (updateData.zipCode) mappedData.pincode = updateData.zipCode;
  if (updateData.capacity) mappedData.capacity = updateData.capacity;
  if (updateData.openingTime) mappedData.openingTime = updateData.openingTime;
  if (updateData.closingTime) mappedData.closingTime = updateData.closingTime;

  // Update branch
  const updatedBranch = await Branch.findByIdAndUpdate(
    branchId,
    { $set: mappedData },
    { new: true, runValidators: true }
  )
    .populate('branchManager', 'fullName email phone');

  ApiResponse.success(
    res,
    { branch: updatedBranch },
    'Branch updated successfully'
  );
});

/**
 * @desc    Delete branch
 * @route   DELETE /api/superadmin/branches/:branchId
 * @access  Private (SuperAdmin)
 */
const deleteBranch = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  // Find branch
  const branch = await Branch.findById(branchId);
  if (!branch) {
    throw ApiError.notFound('Branch not found');
  }

  // Soft delete - set isActive to false
  branch.isActive = false;
  await branch.save();

  ApiResponse.success(
    res,
    { branchId },
    'Branch deleted successfully'
  );
});

/**
 * @desc    Get branch performance statistics
 * @route   GET /api/superadmin/branches/:branchId/performance
 * @access  Private (SuperAdmin)
 */
const getBranchPerformance = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  // Find branch
  const branch = await Branch.findById(branchId);
  if (!branch) {
    throw ApiError.notFound('Branch not found');
  }

  // Get total members in branch
  const totalMembers = await User.countDocuments({
    branch: branchId,
    role: 'member',
    isActive: true,
  });

  // Get active members
  const activeMembers = await User.countDocuments({
    branch: branchId,
    role: 'member',
    membershipStatus: 'active',
    isActive: true,
  });

  // Get total trainers
  const totalTrainers = await User.countDocuments({
    branch: branchId,
    role: 'trainer',
    isActive: true,
  });

  // Get branch revenue
  const revenueData = await Transaction.aggregate([
    {
      $match: {
        branch: branchId,
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

  // Get monthly revenue
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthlyRevenueData = await Transaction.aggregate([
    {
      $match: {
        branch: branchId,
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

  const performance = {
    branchId,
    branchName: branch.name,
    totalMembers,
    activeMembers,
    inactiveMembers: totalMembers - activeMembers,
    totalTrainers,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
    capacity: branch.capacity,
    utilizationRate: branch.capacity > 0 ? ((totalMembers / branch.capacity) * 100).toFixed(2) : 0,
  };

  ApiResponse.success(
    res,
    performance,
    'Branch performance retrieved successfully'
  );
});

/**
 * @desc    Compare branches performance
 * @route   GET /api/superadmin/branches/compare
 * @access  Private (SuperAdmin)
 */
const compareBranches = asyncHandler(async (req, res) => {
  const { branchIds = [] } = req.query;

  if (!branchIds || branchIds.length === 0) {
    throw ApiError.badRequest('Please provide branch IDs to compare');
  }

  const ids = Array.isArray(branchIds) ? branchIds : [branchIds];

  const branches = await Branch.find({ _id: { $in: ids }, isActive: true })
    .populate('manager', 'fullName email phone')
    .lean();

  if (branches.length === 0) {
    throw ApiError.notFound('No branches found');
  }

  // Get performance data for each branch
  const comparison = await Promise.all(
    branches.map(async (branch) => {
      const totalMembers = await User.countDocuments({
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

      const revenueData = await Transaction.aggregate([
        {
          $match: {
            branch: branch._id,
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

      return {
        branchId: branch._id,
        branchName: branch.name,
        city: branch.city,
        totalMembers,
        activeMembers,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        capacity: branch.capacity,
        utilizationRate: branch.capacity > 0 ? ((totalMembers / branch.capacity) * 100).toFixed(2) : 0,
      };
    })
  );

  ApiResponse.success(
    res,
    { comparison },
    'Branches comparison retrieved successfully'
  );
});

module.exports = {
  getBranches,
  createBranch,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchPerformance,
  compareBranches,
};
