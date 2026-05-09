const SuperAdmin = require('../models/SuperAdmin');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

/**
 * @desc    Login super admin
 * @route   POST /api/superadmin/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 [SuperAdmin Login] Attempt:', { email });

  // Validate input
  if (!email || !password) {
    console.log('❌ [SuperAdmin Login] Missing email or password');
    throw ApiError.badRequest('Please provide email and password');
  }

  // Find admin by email (including password field)
  console.log('🔍 [SuperAdmin Login] Searching for admin by email...');
  const admin = await SuperAdmin.findByEmail(email);

  // Check if admin exists
  if (!admin) {
    console.log('❌ [SuperAdmin Login] Admin not found:', email);
    throw ApiError.unauthorized('Invalid email or password');
  }

  console.log('✅ [SuperAdmin Login] Admin found:', { id: admin._id, email: admin.email });

  // Check if admin is active
  if (!admin.isActive) {
    console.log('❌ [SuperAdmin Login] Account deactivated:', email);
    throw ApiError.forbidden('Account is deactivated. Please contact support.');
  }

  // Verify password
  console.log('🔑 [SuperAdmin Login] Verifying password...');
  const isPasswordMatch = await admin.comparePassword(password);

  if (!isPasswordMatch) {
    console.log('❌ [SuperAdmin Login] Password mismatch for:', email);
    throw ApiError.unauthorized('Invalid email or password');
  }

  console.log('✅ [SuperAdmin Login] Password verified');

  // Update last login info
  admin.lastLogin = new Date();
  admin.lastLoginIp = req.ip || req.connection.remoteAddress;
  await admin.save();

  // Generate tokens
  console.log('🎫 [SuperAdmin Login] Generating tokens...');
  const accessToken = generateAccessToken(admin._id, admin.role, admin.email);
  const refreshToken = generateRefreshToken(admin._id);

  // Get public profile
  const profile = admin.getPublicProfile();

  console.log('✨ [SuperAdmin Login] Login successful:', { id: admin._id, email: admin.email });

  // Send response
  ApiResponse.success(
    res,
    {
      admin: profile,
      token: accessToken,
      refreshToken: refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    },
    'Login successful',
    200
  );
});

/**
 * @desc    Get current logged in admin
 * @route   GET /api/superadmin/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  const admin = await SuperAdmin.findById(req.user.id);

  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  ApiResponse.success(
    res,
    { admin: admin.getPublicProfile() },
    'Admin profile retrieved successfully'
  );
});

/**
 * @desc    Logout admin
 * @route   POST /api/superadmin/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // In a production app, you would:
  // 1. Invalidate the token in a blacklist/redis
  // 2. Clear any session data
  // 3. Remove refresh token from database

  ApiResponse.success(
    res,
    null,
    'Logged out successfully'
  );
});

/**
 * @desc    Refresh access token
 * @route   POST /api/superadmin/auth/refresh
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw ApiError.badRequest('Refresh token is required');
  }

  try {
    // Verify refresh token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find admin
    const admin = await SuperAdmin.findById(decoded.id);

    if (!admin || !admin.isActive) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(admin._id, admin.role);

    ApiResponse.success(
      res,
      {
        token: newAccessToken,
        expiresIn: 3600,
      },
      'Token refreshed successfully'
    );
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }
});

/**
 * @desc    Update admin password
 * @route   PUT /api/superadmin/auth/password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest('Please provide current and new password');
  }

  // Validate new password length
  if (newPassword.length < 8) {
    throw ApiError.badRequest('New password must be at least 8 characters');
  }

  // Get admin with password
  const admin = await SuperAdmin.findById(req.user.id).select('+password');

  // Verify current password
  const isMatch = await admin.comparePassword(currentPassword);

  if (!isMatch) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  // Update password
  admin.password = newPassword;
  await admin.save();

  ApiResponse.success(
    res,
    null,
    'Password updated successfully'
  );
});

module.exports = {
  login,
  getMe,
  logout,
  refreshToken,
  updatePassword,
};
