const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');
const Admin = require('../models/Admin');
const Trainer = require('../models/Trainer');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * SuperAdmin Authentication Middleware
 * Verifies JWT token and searches SuperAdmin collection
 */
const protectSuperAdmin = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('❌ [SuperAdmin Auth] No token provided');
    throw ApiError.unauthorized('Not authorized, no token provided');
  }

  try {
    console.log('🔍 [SuperAdmin Auth] Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ [SuperAdmin Auth] Token decoded:', { id: decoded.id, role: decoded.role, email: decoded.email });

    // Search in SuperAdmin collection
    console.log('🔍 [SuperAdmin Auth] Searching SuperAdmin collection...');
    let user = await SuperAdmin.findById(decoded.id).select('-password');

    if (!user) {
      console.log('❌ [SuperAdmin Auth] SuperAdmin not found:', decoded.id);
      throw ApiError.unauthorized('SuperAdmin not found. Token is invalid.');
    }

    console.log('✅ [SuperAdmin Auth] SuperAdmin found:', { id: user._id, email: user.email });

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ [SuperAdmin Auth] SuperAdmin account deactivated:', user.email);
      throw ApiError.forbidden('Account is deactivated');
    }

    // Attach user to request
    req.user = user;
    console.log('✅ [SuperAdmin Auth] Authentication successful');
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log('❌ [SuperAdmin Auth] Invalid token:', error.message);
      throw ApiError.unauthorized('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      console.log('❌ [SuperAdmin Auth] Token expired');
      throw ApiError.unauthorized('Token expired');
    }
    throw error;
  }
});

/**
 * Admin Authentication Middleware
 * Verifies JWT token and searches Admin collection
 */
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('❌ [Admin Auth] No token provided');
    throw ApiError.unauthorized('Not authorized, no token provided');
  }

  try {
    console.log('🔍 [Admin Auth] Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ [Admin Auth] Token decoded:', { id: decoded.id, role: decoded.role, email: decoded.email });

    // Search in Admin collection
    console.log('🔍 [Admin Auth] Searching Admin collection...');
    let user = await Admin.findById(decoded.id).select('-password');

    if (!user) {
      console.log('❌ [Admin Auth] Admin not found:', decoded.id);
      throw ApiError.unauthorized('Admin not found. Token is invalid.');
    }

    console.log('✅ [Admin Auth] Admin found:', { id: user._id, email: user.email });

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ [Admin Auth] Admin account deactivated:', user.email);
      throw ApiError.forbidden('Account is deactivated');
    }

    // Attach user to request
    req.user = user;
    console.log('✅ [Admin Auth] Authentication successful');
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log('❌ [Admin Auth] Invalid token:', error.message);
      throw ApiError.unauthorized('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      console.log('❌ [Admin Auth] Token expired');
      throw ApiError.unauthorized('Token expired');
    }
    throw error;
  }
});

/**
 * Trainer Authentication Middleware
 * Verifies JWT token and searches Trainer collection
 */
const protectTrainer = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('❌ [Trainer Auth] No token provided');
    throw ApiError.unauthorized('Not authorized, no token provided');
  }

  try {
    console.log('🔍 [Trainer Auth] Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ [Trainer Auth] Token decoded:', { id: decoded.id, role: decoded.role, email: decoded.email });

    // Search in Trainer collection
    console.log('🔍 [Trainer Auth] Searching Trainer collection...');
    let user = await Trainer.findById(decoded.id).select('-password');

    if (!user) {
      console.log('❌ [Trainer Auth] Trainer not found:', decoded.id);
      throw ApiError.unauthorized('Trainer not found. Token is invalid.');
    }

    console.log('✅ [Trainer Auth] Trainer found:', { id: user._id, email: user.email });

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ [Trainer Auth] Trainer account deactivated:', user.email);
      throw ApiError.forbidden('Account is deactivated');
    }

    // Attach user to request
    req.user = user;
    console.log('✅ [Trainer Auth] Authentication successful');
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log('❌ [Trainer Auth] Invalid token:', error.message);
      throw ApiError.unauthorized('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      console.log('❌ [Trainer Auth] Token expired');
      throw ApiError.unauthorized('Token expired');
    }
    throw error;
  }
});

/**
 * Member Authentication Middleware
 * Verifies JWT token and searches User collection (members)
 */
const protectMember = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('❌ [Member Auth] No token provided');
    throw ApiError.unauthorized('Not authorized, no token provided');
  }

  try {
    console.log('🔍 [Member Auth] Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ [Member Auth] Token decoded:', { id: decoded.id, role: decoded.role, email: decoded.email });

    // Search in User collection
    console.log('🔍 [Member Auth] Searching User collection...');
    let user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('❌ [Member Auth] Member not found:', decoded.id);
      throw ApiError.unauthorized('Member not found. Token is invalid.');
    }

    console.log('✅ [Member Auth] Member found:', { id: user._id, email: user.email });

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ [Member Auth] Member account deactivated:', user.email);
      throw ApiError.forbidden('Account is deactivated');
    }

    // Attach user to request
    req.user = user;
    console.log('✅ [Member Auth] Authentication successful');
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log('❌ [Member Auth] Invalid token:', error.message);
      throw ApiError.unauthorized('Invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      console.log('❌ [Member Auth] Token expired');
      throw ApiError.unauthorized('Token expired');
    }
    throw error;
  }
});

module.exports = {
  protectSuperAdmin,
  protectAdmin,
  protectTrainer,
  protectMember,
};
