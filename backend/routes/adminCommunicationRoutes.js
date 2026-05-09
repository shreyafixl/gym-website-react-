const express = require('express');
const router = express.Router();
const {
  createNotification,
  getAllNotifications,
  sendBulkNotifications,
  createAnnouncement,
  getAllAnnouncements,
  sendMessage,
  sendBulkMessages,
  getAllMessages,
  getCommunicationStats,
} = require('../controllers/adminCommunicationController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @route   GET /api/admin/communication/stats
 * @desc    Get communication statistics
 * @access  Private (Admin)
 */
router.get('/stats', protectAdmin, getCommunicationStats);

// Notification routes
/**
 * @route   POST /api/admin/communication/notifications/bulk
 * @desc    Send bulk notifications
 * @access  Private (Admin)
 */
router.post('/notifications/bulk', protectAdmin, sendBulkNotifications);

/**
 * @route   GET /api/admin/communication/notifications
 * @desc    Get all notifications
 * @access  Private (Admin)
 */
router.get('/notifications', protectAdmin, getAllNotifications);

/**
 * @route   POST /api/admin/communication/notifications
 * @desc    Create notification
 * @access  Private (Admin)
 */
router.post('/notifications', protectAdmin, createNotification);

// Announcement routes
/**
 * @route   GET /api/admin/communication/announcements
 * @desc    Get all announcements
 * @access  Private (Admin)
 */
router.get('/announcements', protectAdmin, getAllAnnouncements);

/**
 * @route   POST /api/admin/communication/announcements
 * @desc    Create announcement
 * @access  Private (Admin)
 */
router.post('/announcements', protectAdmin, createAnnouncement);

// Message routes
/**
 * @route   POST /api/admin/communication/messages/bulk
 * @desc    Send bulk messages
 * @access  Private (Admin)
 */
router.post('/messages/bulk', protectAdmin, sendBulkMessages);

/**
 * @route   GET /api/admin/communication/messages
 * @desc    Get all messages
 * @access  Private (Admin)
 */
router.get('/messages', protectAdmin, getAllMessages);

/**
 * @route   POST /api/admin/communication/messages
 * @desc    Send message
 * @access  Private (Admin)
 */
router.post('/messages', protectAdmin, sendMessage);

module.exports = router;
