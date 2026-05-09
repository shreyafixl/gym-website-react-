const express = require('express');
const router = express.Router();
const {
  getAllTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  assignMembers,
  updateAvailability,
  getTrainerById,
  getTrainerStats,
} = require('../controllers/adminTrainerController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @route   GET /api/admin/trainers/stats
 * @desc    Get trainer statistics
 * @access  Private (Admin)
 */
router.get('/stats', protectAdmin, getTrainerStats);

/**
 * @route   GET /api/admin/trainers
 * @desc    Get all trainers with filtering
 * @access  Private (Admin)
 */
router.get('/', protectAdmin, getAllTrainers);

/**
 * @route   POST /api/admin/trainers
 * @desc    Create trainer
 * @access  Private (Admin)
 */
router.post('/', protectAdmin, createTrainer);

/**
 * @route   GET /api/admin/trainers/:id
 * @desc    Get trainer by ID
 * @access  Private (Admin)
 */
router.get('/:id', protectAdmin, getTrainerById);

/**
 * @route   PUT /api/admin/trainers/:id
 * @desc    Update trainer
 * @access  Private (Admin)
 */
router.put('/:id', protectAdmin, updateTrainer);

/**
 * @route   DELETE /api/admin/trainers/:id
 * @desc    Delete trainer
 * @access  Private (Admin)
 */
router.delete('/:id', protectAdmin, deleteTrainer);

/**
 * @route   POST /api/admin/trainers/:id/assign-members
 * @desc    Assign members to trainer
 * @access  Private (Admin)
 */
router.post('/:id/assign-members', protectAdmin, assignMembers);

/**
 * @route   PUT /api/admin/trainers/:id/availability
 * @desc    Update trainer availability
 * @access  Private (Admin)
 */
router.put('/:id/availability', protectAdmin, updateAvailability);

module.exports = router;
