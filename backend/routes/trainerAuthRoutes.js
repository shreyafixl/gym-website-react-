const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { protectTrainer } = require('../middleware/roleAuthMiddleware');

/**
 * @desc    Trainer login
 * @route   POST /api/trainer/auth/login
 * @access  Public
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password');
  }

  // Find trainer by email (including password field)
  const trainer = await Trainer.findOne({ email }).select('+password');

  // Check if trainer exists
  if (!trainer) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Verify password
  const isPasswordMatch = await trainer.comparePassword(password);

  if (!isPasswordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login info
  trainer.lastLogin = new Date();
  await trainer.save();

  // Generate tokens
  const accessToken = generateAccessToken(trainer._id, 'trainer', trainer.email);
  const refreshToken = generateRefreshToken(trainer._id);

  // Get public profile
  const profile = trainer.getPublicProfile();

  // Send response
  ApiResponse.success(
    res,
    {
      trainer: profile,
      token: accessToken,
      refreshToken: refreshToken,
      expiresIn: 3600,
    },
    'Login successful',
    200
  );
}));

/**
 * @desc    Get current logged in trainer
 * @route   GET /api/trainer/auth/me
 * @access  Private
 */
router.get('/me', protectTrainer, asyncHandler(async (req, res) => {
  const trainer = await Trainer.findById(req.user.id);

  if (!trainer) {
    throw ApiError.notFound('Trainer not found');
  }

  ApiResponse.success(
    res,
    { trainer: trainer.getPublicProfile() },
    'Trainer profile retrieved successfully'
  );
}));

/**
 * @desc    Logout trainer
 * @route   POST /api/trainer/auth/logout
 * @access  Private
 */
router.post('/logout', protectTrainer, asyncHandler(async (req, res) => {
  ApiResponse.success(
    res,
    null,
    'Logged out successfully'
  );
}));

/**
 * @desc    Refresh access token
 * @route   POST /api/trainer/auth/refresh
 * @access  Public
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw ApiError.badRequest('Refresh token is required');
  }

  try {
    const decoded = require('jsonwebtoken').verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const trainer = await Trainer.findById(decoded.id);

    if (!trainer) {
      throw ApiError.unauthorized('Trainer not found');
    }

    const newAccessToken = generateAccessToken(trainer._id, 'trainer');

    ApiResponse.success(
      res,
      { token: newAccessToken },
      'Token refreshed successfully'
    );
  } catch (error) {
    throw ApiError.unauthorized('Invalid refresh token');
  }
}));

module.exports = router;
