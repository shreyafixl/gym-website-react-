const express = require('express');
const router = express.Router();
const {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketById,
  assignTicket,
  addComment,
  resolveTicket,
  closeTicket,
  reopenTicket,
  getTicketStats,
} = require('../controllers/adminSupportController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @route   GET /api/admin/support/stats
 * @desc    Get ticket statistics
 * @access  Private (Admin)
 */
router.get('/stats', protectAdmin, getTicketStats);

/**
 * @route   GET /api/admin/support
 * @desc    Get all support tickets with filtering
 * @access  Private (Admin)
 */
router.get('/', protectAdmin, getAllTickets);

/**
 * @route   POST /api/admin/support
 * @desc    Create support ticket
 * @access  Private (Admin)
 */
router.post('/', protectAdmin, createTicket);

/**
 * @route   GET /api/admin/support/:id
 * @desc    Get ticket by ID
 * @access  Private (Admin)
 */
router.get('/:id', protectAdmin, getTicketById);

/**
 * @route   PUT /api/admin/support/:id
 * @desc    Update support ticket
 * @access  Private (Admin)
 */
router.put('/:id', protectAdmin, updateTicket);

/**
 * @route   DELETE /api/admin/support/:id
 * @desc    Delete support ticket
 * @access  Private (Admin)
 */
router.delete('/:id', protectAdmin, deleteTicket);

/**
 * @route   POST /api/admin/support/:id/assign
 * @desc    Assign ticket to user
 * @access  Private (Admin)
 */
router.post('/:id/assign', protectAdmin, assignTicket);

/**
 * @route   POST /api/admin/support/:id/comment
 * @desc    Add comment to ticket
 * @access  Private (Admin)
 */
router.post('/:id/comment', protectAdmin, addComment);

/**
 * @route   POST /api/admin/support/:id/resolve
 * @desc    Resolve ticket
 * @access  Private (Admin)
 */
router.post('/:id/resolve', protectAdmin, resolveTicket);

/**
 * @route   POST /api/admin/support/:id/close
 * @desc    Close ticket
 * @access  Private (Admin)
 */
router.post('/:id/close', protectAdmin, closeTicket);

/**
 * @route   POST /api/admin/support/:id/reopen
 * @desc    Reopen ticket
 * @access  Private (Admin)
 */
router.post('/:id/reopen', protectAdmin, reopenTicket);

module.exports = router;
