const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * JWT Verification Middleware
 * Verifies JWT token and attaches user to request
 * Used for member-only routes
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
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

    // Find user by ID
    const user = await User.findById(decoded.id).select('-password');

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

/**
 * Role Check Middleware
 * Verifies that user has the required role
 * @param {string|string[]} allowedRoles - Role(s) that are allowed
 */
const checkRole = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    // Convert single role to array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(`Access denied. Required role: ${roles.join(' or ')}`);
    }

    next();
  });
};

module.exports = { verifyJWT, checkRole };
