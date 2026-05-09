const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get notifications with pagination and filtering
 * @route   GET /api/member/notifications
 * @access  Private (Member only)
 */
const getNotifications = asyncHandler(async (req, res) => {
  const recipientId = req.user.id;
  const { page = 1, limit = 10, isRead, notificationType, priority } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const filter = {
    recipientId,
    isDeleted: false,
  };

  // Read status filtering
  if (isRead !== undefined) {
    filter.isRead = isRead === 'true' || isRead === true;
  }

  // Notification type filtering
  if (notificationType) {
    const validTypes = [
      'workout-reminder',
      'session-reminder',
      'diet-reminder',
      'progress-update',
      'achievement',
      'membership-expiry',
      'payment-reminder',
      'general',
      'announcement',
    ];
    if (!validTypes.includes(notificationType)) {
      throw ApiError.badRequest('Invalid notification type');
    }
    filter.notificationType = notificationType;
  }

  // Priority filtering
  if (priority) {
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      throw ApiError.badRequest('Invalid priority');
    }
    filter.priority = priority;
  }

  // Execute query with pagination
  const notifications = await Notification.find(filter)
    .populate('senderId', 'fullName email profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await Notification.countDocuments(filter);

  const response = {
    notifications: notifications.map(n => ({
      id: n._id,
      type: n.notificationType,
      title: n.title,
      message: n.message,
      priority: n.priority,
      isRead: n.isRead,
      readAt: n.readAt,
      sender: n.senderId,
      actionUrl: n.actionUrl,
      actionLabel: n.actionLabel,
      metadata: n.metadata,
      sentAt: n.sentAt,
      expiresAt: n.expiresAt,
      status: n.status,
      createdAt: n.createdAt,
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  };

  ApiResponse.success(
    res,
    response,
    'Notifications retrieved successfully'
  );
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/member/notifications/unread/count
 * @access  Private (Member only)
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const recipientId = req.user.id;

  const unreadCount = await Notification.countDocuments({
    recipientId,
    isRead: false,
    isDeleted: false,
  });

  ApiResponse.success(
    res,
    { unreadCount },
    'Unread count retrieved successfully'
  );
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/member/notifications/:id/read
 * @access  Private (Member only)
 */
const markAsRead = asyncHandler(async (req, res) => {
  const recipientId = req.user.id;
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid notification ID format');
  }

  const notification = await Notification.findById(id);

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  // Verify ownership
  if (notification.recipientId.toString() !== recipientId) {
    throw ApiError.forbidden('You do not have access to this notification');
  }

  // Mark as read
  notification.isRead = true;
  notification.readAt = Date.now();
  await notification.save();

  ApiResponse.success(
    res,
    {
      id: notification._id,
      isRead: notification.isRead,
      readAt: notification.readAt,
    },
    'Notification marked as read'
  );
});

/**
 * @desc    Mark notification as unread
 * @route   PUT /api/member/notifications/:id/unread
 * @access  Private (Member only)
 */
const markAsUnread = asyncHandler(async (req, res) => {
  const recipientId = req.user.id;
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid notification ID format');
  }

  const notification = await Notification.findById(id);

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  // Verify ownership
  if (notification.recipientId.toString() !== recipientId) {
    throw ApiError.forbidden('You do not have access to this notification');
  }

  // Mark as unread
  notification.isRead = false;
  notification.readAt = null;
  await notification.save();

  ApiResponse.success(
    res,
    {
      id: notification._id,
      isRead: notification.isRead,
      readAt: notification.readAt,
    },
    'Notification marked as unread'
  );
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/member/notifications/mark-all/read
 * @access  Private (Member only)
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const recipientId = req.user.id;

  const result = await Notification.updateMany(
    {
      recipientId,
      isRead: false,
      isDeleted: false,
    },
    {
      isRead: true,
      readAt: Date.now(),
    }
  );

  ApiResponse.success(
    res,
    {
      modifiedCount: result.modifiedCount,
    },
    'All notifications marked as read'
  );
});

/**
 * @desc    Delete notification (soft delete)
 * @route   DELETE /api/member/notifications/:id
 * @access  Private (Member only)
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const recipientId = req.user.id;
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid notification ID format');
  }

  const notification = await Notification.findById(id);

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  // Verify ownership
  if (notification.recipientId.toString() !== recipientId) {
    throw ApiError.forbidden('You do not have access to this notification');
  }

  // Soft delete
  notification.isDeleted = true;
  notification.deletedAt = Date.now();
  await notification.save();

  ApiResponse.success(
    res,
    { id: notification._id },
    'Notification deleted successfully'
  );
});

/**
 * @desc    Delete all notifications (soft delete)
 * @route   DELETE /api/member/notifications
 * @access  Private (Member only)
 */
const deleteAllNotifications = asyncHandler(async (req, res) => {
  const recipientId = req.user.id;

  const result = await Notification.updateMany(
    {
      recipientId,
      isDeleted: false,
    },
    {
      isDeleted: true,
      deletedAt: Date.now(),
    }
  );

  ApiResponse.success(
    res,
    {
      deletedCount: result.modifiedCount,
    },
    'All notifications deleted successfully'
  );
});

/**
 * @desc    Get notification by ID
 * @route   GET /api/member/notifications/:id
 * @access  Private (Member only)
 */
const getNotificationById = asyncHandler(async (req, res) => {
  const recipientId = req.user.id;
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid notification ID format');
  }

  const notification = await Notification.findById(id)
    .populate('senderId', 'fullName email profileImage')
    .lean();

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  // Verify ownership
  if (notification.recipientId.toString() !== recipientId) {
    throw ApiError.forbidden('You do not have access to this notification');
  }

  const notificationDetail = {
    id: notification._id,
    type: notification.notificationType,
    title: notification.title,
    message: notification.message,
    priority: notification.priority,
    isRead: notification.isRead,
    readAt: notification.readAt,
    sender: notification.senderId,
    actionUrl: notification.actionUrl,
    actionLabel: notification.actionLabel,
    metadata: notification.metadata,
    scheduledFor: notification.scheduledFor,
    sentAt: notification.sentAt,
    expiresAt: notification.expiresAt,
    status: notification.status,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
  };

  ApiResponse.success(
    res,
    notificationDetail,
    'Notification retrieved successfully'
  );
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationById,
};
