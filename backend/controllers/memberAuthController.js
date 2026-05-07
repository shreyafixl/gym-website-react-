const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

/**
 * @desc    Register new member/user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw ApiError.badRequest('Please provide name, email, and password');
  }

  // Validate email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw ApiError.badRequest('Please provide a valid email address');
  }

  // Validate password length
  if (password.length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw ApiError.conflict('User with this email already exists');
  }

  // Create user with member role
  const user = await User.create({
    fullName: name,
    email: email.toLowerCase(),
    password, // Will be hashed by pre-save hook
    phone: phone || '0000000000', // Default phone if not provided
    gender: 'other', // Default gender
    age: 18, // Default age
    role: 'member',
    membershipPlan: 'none',
    membershipStatus: 'pending',
    isActive: true,
  });

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Get public profile
  const profile = user.getPublicProfile();

  ApiResponse.created(
    res,
    {
      user: {
        id: profile.id,
        name: profile.fullName,
        email: profile.email,
        role: 'user', // Frontend expects 'user' role
        avatar: profile.fullName.substring(0, 2).toUpperCase(),
      },
      token: accessToken,
      refreshToken: refreshToken,
    },
    'Account created successfully'
  );
});

/**
 * @desc    Login member/user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw ApiError.badRequest('Please provide email and password');
  }

  // Find user by email (including password field)
  const user = await User.findByEmail(email.toLowerCase());

  // Check if user exists
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw ApiError.forbidden('Account is deactivated. Please contact support.');
  }

  // Verify password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login info
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Map role to frontend expected format
  let frontendRole = 'user';
  if (user.role === 'trainer') frontendRole = 'trainer';
  if (user.role === 'staff') frontendRole = 'admin';

  // Send response
  ApiResponse.success(
    res,
    {
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: frontendRole,
        avatar: user.fullName.substring(0, 2).toUpperCase(),
      },
      token: accessToken,
      refreshToken: refreshToken,
    },
    'Login successful',
    200
  );
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  const user = await User.findById(req.user.id);

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Map role to frontend expected format
  let frontendRole = 'user';
  if (user.role === 'trainer') frontendRole = 'trainer';
  if (user.role === 'staff') frontendRole = 'admin';

  ApiResponse.success(
    res,
    {
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: frontendRole,
        avatar: user.fullName.substring(0, 2).toUpperCase(),
      },
    },
    'User profile retrieved successfully'
  );
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
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

module.exports = {
  signup,
  login,
  getMe,
  logout,
};
