const express = require('express');
const router = express.Router();
const {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchStats,
} = require('../controllers/adminBranchController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @route   GET /api/admin/branches/:id/stats
 * @desc    Get branch statistics
 * @access  Private (Admin)
 */
router.get('/:id/stats', protectAdmin, getBranchStats);

/**
 * @route   GET /api/admin/branches
 * @desc    Get all branches with pagination and filtering
 * @access  Private (Admin)
 */
router.get('/', protectAdmin, getAllBranches);

/**
 * @route   POST /api/admin/branches
 * @desc    Create new branch
 * @access  Private (Admin)
 */
router.post('/', protectAdmin, createBranch);

/**
 * @route   GET /api/admin/branches/:id
 * @desc    Get branch by ID
 * @access  Private (Admin)
 */
router.get('/:id', protectAdmin, getBranchById);

/**
 * @route   PUT /api/admin/branches/:id
 * @desc    Update branch
 * @access  Private (Admin)
 */
router.put('/:id', protectAdmin, updateBranch);

/**
 * @route   DELETE /api/admin/branches/:id
 * @desc    Delete branch
 * @access  Private (Admin)
 */
router.delete('/:id', protectAdmin, deleteBranch);

module.exports = router;
