const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  logout,
  refreshToken,
  updatePassword,
} = require('../controllers/authController');
const { protectSuperAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * Authentication Routes
 * Base path: /api/superadmin/auth
 */

// Public routes
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes (require authentication)
router.use(protectSuperAdmin); // All routes below this require SuperAdmin authentication

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/password', updatePassword);

module.exports = router;
