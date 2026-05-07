const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getMe,
  logout,
} = require('../controllers/memberAuthController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Member/User Authentication Routes
 * Base path: /api/auth
 * These routes are for regular gym members/users
 */

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (require authentication)
router.use(protect); // All routes below this require authentication

router.get('/me', getMe);
router.post('/logout', logout);

module.exports = router;
