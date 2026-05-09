const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout,
  refreshToken,
} = require('../controllers/memberAuthController');
const { protectMember } = require('../middleware/roleAuthMiddleware');

/**
 * Member Authentication Routes
 * Base path: /api/auth
 */

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes (require authentication)
router.use(protectMember);

// Member only routes
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.post('/logout', logout);

module.exports = router;
