const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationById,
} = require('../controllers/memberNotificationController');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/notifications/unread/count
 * @desc    Get unread notification count
 * @access  Private (Member only)
 */
router.get('/unread/count', getUnreadCount);

/**
 * @route   PUT /api/member/notifications/mark-all/read
 * @desc    Mark all notifications as read
 * @access  Private (Member only)
 */
router.put('/mark-all/read', markAllAsRead);

/**
 * @route   DELETE /api/member/notifications
 * @desc    Delete all notifications (soft delete)
 * @access  Private (Member only)
 */
router.delete('/', deleteAllNotifications);

/**
 * @route   GET /api/member/notifications/:id
 * @desc    Get notification by ID
 * @access  Private (Member only)
 */
router.get('/:id', getNotificationById);

/**
 * @route   PUT /api/member/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private (Member only)
 */
router.put('/:id/read', markAsRead);

/**
 * @route   PUT /api/member/notifications/:id/unread
 * @desc    Mark notification as unread
 * @access  Private (Member only)
 */
router.put('/:id/unread', markAsUnread);

/**
 * @route   DELETE /api/member/notifications/:id
 * @desc    Delete notification (soft delete)
 * @access  Private (Member only)
 */
router.delete('/:id', deleteNotification);

/**
 * @route   GET /api/member/notifications
 * @desc    Get notifications with pagination and filtering
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10, max: 100)
 * @query   isRead - Filter by read status (true/false)
 * @query   notificationType - Filter by type (workout-reminder, session-reminder, diet-reminder, etc.)
 * @query   priority - Filter by priority (low, medium, high, urgent)
 * @access  Private (Member only)
 */
router.get('/', getNotifications);

module.exports = router;
