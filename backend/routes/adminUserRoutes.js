const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  bulkUpdateUsers,
  exportUsers,
} = require('../controllers/adminUserController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @route   GET /api/admin/users/stats
 * @desc    Get user statistics
 * @access  Private (Admin)
 */
router.get('/stats', protectAdmin, getUserStats);

/**
 * @route   GET /api/admin/users/export
 * @desc    Export users data
 * @access  Private (Admin)
 */
router.get('/export', protectAdmin, exportUsers);

/**
 * @route   PUT /api/admin/users/bulk-update
 * @desc    Bulk update users
 * @access  Private (Admin)
 */
router.put('/bulk-update', protectAdmin, bulkUpdateUsers);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin)
 */
router.get('/', protectAdmin, getAllUsers);

/**
 * @route   POST /api/admin/users
 * @desc    Create new user
 * @access  Private (Admin)
 */
router.post('/', protectAdmin, createUser);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin)
 */
router.get('/:id', protectAdmin, getUserById);

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user
 * @access  Private (Admin)
 */
router.put('/:id', protectAdmin, updateUser);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private (Admin)
 */
router.delete('/:id', protectAdmin, deleteUser);

module.exports = router;
