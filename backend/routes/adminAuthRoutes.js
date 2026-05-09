const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @desc    Admin login
 * @route   POST /api/admin/auth/login
 * @access  Public
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password');
  }

  // Find admin by email (including password field)
  const admin = await Admin.findOne({ email }).select('+password');

  // Check if admin exists
  if (!admin) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check if admin is active
  if (!admin.isActive) {
    throw ApiError.forbidden('Account is deactivated. Please contact support.');
  }

  // Verify password
  const isPasswordMatch = await admin.comparePassword(password);

  if (!isPasswordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login info
  admin.lastLogin = new Date();
  admin.lastLoginIp = req.ip || req.connection.remoteAddress;
  await admin.save();

  // Generate tokens
  const accessToken = generateAccessToken(admin._id, admin.role, admin.email);
  const refreshToken = generateRefreshToken(admin._id);

  // Get public profile
  const profile = admin.getPublicProfile();

  // Send response
  ApiResponse.success(
    res,
    {
      admin: profile,
      token: accessToken,
      refreshToken: refreshToken,
      expiresIn: 3600,
    },
    'Login successful',
    200
  );
}));

/**
 * @desc    Get current logged in admin
 * @route   GET /api/admin/auth/me
 * @access  Private
 */
router.get('/me', protectAdmin, asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  ApiResponse.success(
    res,
    { admin: admin.getPublicProfile() },
    'Admin profile retrieved successfully'
  );
}));

/**
 * @desc    Logout admin
 * @route   POST /api/admin/auth/logout
 * @access  Private
 */
router.post('/logout', protectAdmin, asyncHandler(async (req, res) => {
  ApiResponse.success(
    res,
    null,
    'Logged out successfully'
  );
}));

/**
 * @desc    Refresh access token
 * @route   POST /api/admin/auth/refresh
 * @access  Public
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw ApiError.badRequest('Refresh token is required');
  }

  try {
    const decoded = require('jsonwebtoken').verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      throw ApiError.unauthorized('Admin not found');
    }

    const newAccessToken = generateAccessToken(admin._id, admin.role);

    ApiResponse.success(
      res,
      { token: newAccessToken },
      'Token refreshed successfully'
    );
  } catch (error) {
    throw ApiError.unauthorized('Invalid refresh token');
  }
}));

/**
 * @desc    Change admin password
 * @route   PUT /api/admin/auth/change-password
 * @access  Private
 */
router.put('/change-password', protectAdmin, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw ApiError.badRequest('Current password and new password are required');
  }

  const admin = await Admin.findById(req.user.id).select('+password');

  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  const isPasswordMatch = await admin.comparePassword(currentPassword);

  if (!isPasswordMatch) {
    throw ApiError.unauthorized('Current password is incorrect');
  }

  admin.password = newPassword;
  await admin.save();

  ApiResponse.success(
    res,
    null,
    'Password changed successfully'
  );
}));

module.exports = router;
