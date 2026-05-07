const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Authentication Middleware
 * Protects routes by verifying JWT token
 * Attaches authenticated user to req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from "Bearer <token>"
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    throw ApiError.unauthorized('Not authorized, no token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload
    const user = await SuperAdmin.findById(decoded.id).select('-password');

    // Check if user exists
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    // Check if user is active
    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw ApiError.unauthorized('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Token expired');
    }
    throw error;
  }
});

module.exports = { protect };
