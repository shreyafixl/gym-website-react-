const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  createTicket,
  getMyTickets,
  getTicketById,
  addComment,
  getTicketStats,
} = require('../controllers/memberSupportController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/support/stats
 * @desc    Get support ticket statistics
 * @access  Private (Member only)
 */
router.get('/stats', getTicketStats);

/**
 * @route   GET /api/member/support/tickets
 * @desc    Get my support tickets with pagination and filtering
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @query   status - Filter by status (open, in-progress, resolved, closed)
 * @query   category - Filter by category (technical, payment, membership, trainer, branch, general)
 * @access  Private (Member only)
 */
router.get('/tickets', getMyTickets);

/**
 * @route   POST /api/member/support/tickets
 * @desc    Create a support ticket
 * @body    ticketTitle - Ticket title (required, 5-200 chars)
 * @body    ticketDescription - Ticket description (required, 10-2000 chars)
 * @body    ticketCategory - Ticket category (required)
 * @body    priorityLevel - Priority level (optional)
 * @body    tags - Tags array (optional)
 * @access  Private (Member only)
 */
router.post('/tickets', createTicket);

/**
 * @route   GET /api/member/support/tickets/:id
 * @desc    Get ticket by ID
 * @access  Private (Member only)
 */
router.get('/tickets/:id', getTicketById);

/**
 * @route   POST /api/member/support/tickets/:id/comments
 * @desc    Add comment to ticket
 * @body    comment - Comment text (required, 1-1000 chars)
 * @access  Private (Member only)
 */
router.post('/tickets/:id/comments', addComment);

module.exports = router;
