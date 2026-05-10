const Notification = require('../models/Notification');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all notifications with pagination and filtering
 * @route   GET /api/superadmin/notifications
 * @access  Private (SuperAdmin)
 */
const getNotifications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    status = '',
    type = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  if (status) {
    query.status = status;
  }

  if (type) {
    query.type = type;
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const notifications = await Notification.find(query)
    .populate('recipient', 'fullName email')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await Notification.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      notifications,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Notifications retrieved successfully'
  );
});

/**
 * @desc    Create a new notification
 * @route   POST /api/superadmin/notifications
 * @access  Private (SuperAdmin)
 */
const createNotification = asyncHandler(async (req, res) => {
  const {
    title,
    message,
    type,
    recipient,
    recipientRole,
    priority,
    actionUrl,
  } = req.body;

  // Validate required fields
  if (!title || !message || !type) {
    throw ApiError.badRequest('Please provide title, message, and type');
  }

  // If specific recipient, verify they exist
  if (recipient) {
    const user = await User.findById(recipient);
    if (!user) {
      throw ApiError.notFound('Recipient not found');
    }
  }

  // Create notification
  const notification = await Notification.create({
    title,
    message,
    type,
    recipient,
    recipientRole,
    priority: priority || 'normal',
    actionUrl,
    status: 'sent',
    sentAt: new Date(),
  });

  // Get notification with populated recipient
  const createdNotification = await Notification.findById(notification._id)
    .populate('recipient', 'fullName email');

  ApiResponse.success(
    res,
    { notification: createdNotification },
    'Notification created successfully',
    201
  );
});

/**
 * @desc    Get notification by ID
 * @route   GET /api/superadmin/notifications/:notificationId
 * @access  Private (SuperAdmin)
 */
const getNotificationById = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  const notification = await Notification.findById(notificationId)
    .populate('recipient', 'fullName email');

  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  ApiResponse.success(
    res,
    { notification },
    'Notification retrieved successfully'
  );
});

/**
 * @desc    Update notification
 * @route   PUT /api/superadmin/notifications/:notificationId
 * @access  Private (SuperAdmin)
 */
const updateNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const updateData = req.body;

  // Find notification
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  // Update notification
  const updatedNotification = await Notification.findByIdAndUpdate(
    notificationId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('recipient', 'fullName email');

  ApiResponse.success(
    res,
    { notification: updatedNotification },
    'Notification updated successfully'
  );
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/superadmin/notifications/:notificationId
 * @access  Private (SuperAdmin)
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  // Find notification
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  // Delete notification
  await Notification.findByIdAndDelete(notificationId);

  ApiResponse.success(
    res,
    { notificationId },
    'Notification deleted successfully'
  );
});

/**
 * @desc    Send bulk notifications
 * @route   POST /api/superadmin/notifications/bulk-send
 * @access  Private (SuperAdmin)
 */
const sendBulkNotifications = asyncHandler(async (req, res) => {
  const {
    title,
    message,
    type,
    recipientRole,
    priority,
  } = req.body;

  // Validate required fields
  if (!title || !message || !type || !recipientRole) {
    throw ApiError.badRequest('Please provide title, message, type, and recipientRole');
  }

  // Get all users with the specified role
  const users = await User.find({ role: recipientRole }).select('_id');

  if (users.length === 0) {
    throw ApiError.notFound('No users found with the specified role');
  }

  // Create notifications for each user
  const notifications = await Promise.all(
    users.map(user =>
      Notification.create({
        title,
        message,
        type,
        recipient: user._id,
        recipientRole,
        priority: priority || 'normal',
        status: 'sent',
        sentAt: new Date(),
      })
    )
  );

  ApiResponse.success(
    res,
    { count: notifications.length, notifications },
    `${notifications.length} notifications sent successfully`,
    201
  );
});

/**
 * @desc    Get notification statistics
 * @route   GET /api/superadmin/notifications/stats
 * @access  Private (SuperAdmin)
 */
const getNotificationStats = asyncHandler(async (req, res) => {
  const stats = await Notification.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const typeStats = await Notification.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);

  const summary = {
    total: 0,
    byStatus: {},
    byType: {},
  };

  stats.forEach(stat => {
    summary.total += stat.count;
    summary.byStatus[stat._id] = stat.count;
  });

  typeStats.forEach(stat => {
    summary.byType[stat._id] = stat.count;
  });

  ApiResponse.success(
    res,
    summary,
    'Notification statistics retrieved successfully'
  );
});

module.exports = {
  getNotifications,
  createNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
  sendBulkNotifications,
  getNotificationStats,
};
