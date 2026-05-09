const jwt = require('jsonwebtoken');

/**
 * Generate JWT Access Token
 * @param {string} id - User ID
 * @param {string} role - User role
 * @param {string} email - User email (optional)
 * @returns {string} - JWT token
 */
const generateAccessToken = (id, role, email = null) => {
  const payload = { id, role };
  if (email) {
    payload.email = email;
  }
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );
};

/**
 * Generate JWT Refresh Token
 * @param {string} id - User ID
 * @returns {string} - JWT refresh token
 */
const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token to verify
 * @param {string} secret - Secret key to verify with
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
