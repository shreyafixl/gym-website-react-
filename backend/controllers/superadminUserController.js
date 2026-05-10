const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcryptjs');

/**
 * @desc    Get all users with pagination and filtering
 * @route   GET /api/superadmin/users
 * @access  Private (SuperAdmin)
 */
const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    search = '',
    role = '',
    status = '',
    branch = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  // Search by name or email
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Filter by status
  if (status) {
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
  }

  // Filter by branch
  if (branch) {
    query.branch = branch;
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const users = await User.find(query)
    .select('-password')
    .populate('assignedTrainer', 'fullName email phone')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await User.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      users,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Users retrieved successfully'
  );
});

/**
 * @desc    Create a new user
 * @route   POST /api/superadmin/users
 * @access  Private (SuperAdmin)
 */
const createUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone,
    gender,
    age,
    role,
    membershipPlan,
    membershipStatus,
    branch,
  } = req.body;

  // Validate required fields
  if (!fullName || !email || !password || !phone || !gender || !age) {
    throw ApiError.badRequest(
      'Please provide all required fields: fullName, email, password, phone, gender, age'
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

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  // Check if phone already exists
  const existingPhone = await User.findOne({ phone });
  if (existingPhone) {
    throw ApiError.conflict('User with this phone number already exists');
  }

  // Validate password strength
  if (password.length < 8) {
    throw ApiError.badRequest('Password must be at least 8 characters');
  }

  // Create user
  const user = await User.create({
    fullName,
    email,
    password,
    phone,
    gender,
    age,
    role: role || 'member',
    membershipPlan: membershipPlan || 'none',
    membershipStatus: membershipStatus || 'pending',
    branch,
    isActive: true,
    joinDate: new Date(),
  });

  // Get user without password
  const createdUser = await User.findById(user._id)
    .select('-password')
    .populate('assignedTrainer', 'fullName email phone');

  ApiResponse.success(
    res,
    { user: createdUser },
    'User created successfully',
    201
  );
});

/**
 * @desc    Get user by ID
 * @route   GET /api/superadmin/users/:userId
 * @access  Private (SuperAdmin)
 */
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .select('-password')
    .populate('assignedTrainer', 'fullName email phone');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  ApiResponse.success(
    res,
    { user },
    'User retrieved successfully'
  );
});

/**
 * @desc    Update user
 * @route   PUT /api/superadmin/users/:userId
 * @access  Private (SuperAdmin)
 */
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Don't allow updating password through this endpoint
  if (updateData.password) {
    throw ApiError.badRequest('Use reset-password endpoint to update password');
  }

  // Validate email if being updated
  if (updateData.email && updateData.email !== user.email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(updateData.email)) {
      throw ApiError.badRequest('Invalid email format');
    }

    const existingUser = await User.findOne({ email: updateData.email });
    if (existingUser) {
      throw ApiError.conflict('Email is already in use');
    }
  }

  // Validate phone if being updated
  if (updateData.phone && updateData.phone !== user.phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(updateData.phone)) {
      throw ApiError.badRequest('Phone number must be 10 digits');
    }

    const existingPhone = await User.findOne({ phone: updateData.phone });
    if (existingPhone) {
      throw ApiError.conflict('Phone number is already in use');
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .select('-password')
    .populate('assignedTrainer', 'fullName email phone');

  ApiResponse.success(
    res,
    { user: updatedUser },
    'User updated successfully'
  );
});

/**
 * @desc    Delete user
 * @route   DELETE /api/superadmin/users/:userId
 * @access  Private (SuperAdmin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Soft delete - set isActive to false
  user.isActive = false;
  await user.save();

  ApiResponse.success(
    res,
    { userId },
    'User deleted successfully'
  );
});

/**
 * @desc    Suspend user
 * @route   POST /api/superadmin/users/:userId/suspend
 * @access  Private (SuperAdmin)
 */
const suspendUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  user.isActive = false;
  user.suspensionReason = reason || 'Suspended by SuperAdmin';
  user.suspendedAt = new Date();
  await user.save();

  ApiResponse.success(
    res,
    { userId },
    'User suspended successfully'
  );
});

/**
 * @desc    Reactivate user
 * @route   POST /api/superadmin/users/:userId/reactivate
 * @access  Private (SuperAdmin)
 */
const reactivateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  user.isActive = true;
  user.suspensionReason = null;
  user.suspendedAt = null;
  await user.save();

  ApiResponse.success(
    res,
    { userId },
    'User reactivated successfully'
  );
});

/**
 * @desc    Reset user password
 * @route   POST /api/superadmin/users/:userId/reset-password
 * @access  Private (SuperAdmin)
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    throw ApiError.badRequest('New password is required');
  }

  if (newPassword.length < 8) {
    throw ApiError.badRequest('Password must be at least 8 characters');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  user.password = newPassword;
  await user.save();

  ApiResponse.success(
    res,
    { userId },
    'Password reset successfully'
  );
});

/**
 * @desc    Get user activity
 * @route   GET /api/superadmin/users/:userId/activity
 * @access  Private (SuperAdmin)
 */
const getUserActivity = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .select('fullName email lastLogin createdAt updatedAt');

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  ApiResponse.success(
    res,
    {
      userId,
      fullName: user.fullName,
      email: user.email,
      lastLogin: user.lastLogin || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    'User activity retrieved successfully'
  );
});

/**
 * @desc    Bulk import users
 * @route   POST /api/superadmin/users/bulk-import
 * @access  Private (SuperAdmin)
 */
const bulkImportUsers = asyncHandler(async (req, res) => {
  const { users } = req.body;

  if (!users || !Array.isArray(users) || users.length === 0) {
    throw ApiError.badRequest('Please provide an array of users to import');
  }

  const results = {
    successful: 0,
    failed: 0,
    errors: [],
  };

  for (let i = 0; i < users.length; i++) {
    try {
      const userData = users[i];

      // Validate required fields
      if (!userData.fullName || !userData.email || !userData.password || !userData.phone) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: 'Missing required fields: fullName, email, password, phone',
        });
        continue;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          email: userData.email,
          error: 'User with this email already exists',
        });
        continue;
      }

      // Create user
      await User.create({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        gender: userData.gender || 'other',
        age: userData.age || 25,
        role: userData.role || 'member',
        membershipPlan: userData.membershipPlan || 'none',
        membershipStatus: userData.membershipStatus || 'pending',
        isActive: true,
        joinDate: new Date(),
      });

      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        row: i + 1,
        error: error.message,
      });
    }
  }

  ApiResponse.success(
    res,
    results,
    `Bulk import completed: ${results.successful} successful, ${results.failed} failed`,
    201
  );
});

/**
 * @desc    Export users
 * @route   GET /api/superadmin/users/export
 * @access  Private (SuperAdmin)
 */
const exportUsers = asyncHandler(async (req, res) => {
  const { format = 'json', role = '', status = '' } = req.query;

  // Build query
  const query = {};
  if (role) query.role = role;
  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  // Get users
  const users = await User.find(query)
    .select('-password')
    .populate('assignedTrainer', 'fullName email')
    .lean();

  if (format === 'csv') {
    // Convert to CSV format
    const csvHeader = 'ID,Name,Email,Phone,Gender,Age,Role,Membership Plan,Membership Status,Status,Join Date\n';
    const csvRows = users
      .map(
        (user) =>
          `${user._id},"${user.fullName}",${user.email},${user.phone},${user.gender},${user.age},${user.role},${user.membershipPlan},${user.membershipStatus},${user.isActive ? 'active' : 'inactive'},${user.joinDate}`
      )
      .join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    return res.send(csv);
  }

  // Default JSON format
  ApiResponse.success(
    res,
    { users, count: users.length },
    'Users exported successfully'
  );
});

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  reactivateUser,
  resetPassword,
  getUserActivity,
  bulkImportUsers,
  exportUsers,
};
