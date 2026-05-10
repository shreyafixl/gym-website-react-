const Message = require('../models/Message');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all messages with pagination
 * @route   GET /api/superadmin/communication
 * @access  Private (SuperAdmin)
 */
const getMessages = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const messages = await Message.find(query)
    .populate('sender', 'fullName email')
    .populate('recipient', 'fullName email')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await Message.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      messages,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Messages retrieved successfully'
  );
});

/**
 * @desc    Send a message
 * @route   POST /api/superadmin/communication/send
 * @access  Private (SuperAdmin)
 */
const sendMessage = asyncHandler(async (req, res) => {
  const {
    recipient,
    subject,
    body,
    type,
  } = req.body;

  // Validate required fields
  if (!recipient || !subject || !body) {
    throw ApiError.badRequest('Please provide recipient, subject, and body');
  }

  // Verify recipient exists
  const recipientUser = await User.findById(recipient);
  if (!recipientUser) {
    throw ApiError.notFound('Recipient not found');
  }

  // Create message
  const message = await Message.create({
    sender: req.user._id,
    recipient,
    subject,
    body,
    type: type || 'message',
    status: 'sent',
    sentAt: new Date(),
  });

  // Get message with populated fields
  const createdMessage = await Message.findById(message._id)
    .populate('sender', 'fullName email')
    .populate('recipient', 'fullName email');

  ApiResponse.success(
    res,
    { message: createdMessage },
    'Message sent successfully',
    201
  );
});

/**
 * @desc    Get message history
 * @route   GET /api/superadmin/communication/history
 * @access  Private (SuperAdmin)
 */
const getMessageHistory = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    userId = '',
  } = req.query;

  // Build query
  const query = {
    $or: [
      { sender: userId },
      { recipient: userId },
    ],
  };

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const messages = await Message.find(query)
    .populate('sender', 'fullName email')
    .populate('recipient', 'fullName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await Message.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      messages,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Message history retrieved successfully'
  );
});

/**
 * @desc    Delete message
 * @route   DELETE /api/superadmin/communication/:messageId
 * @access  Private (SuperAdmin)
 */
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  // Find message
  const message = await Message.findById(messageId);
  if (!message) {
    throw ApiError.notFound('Message not found');
  }

  // Delete message
  await Message.findByIdAndDelete(messageId);

  ApiResponse.success(
    res,
    { messageId },
    'Message deleted successfully'
  );
});

/**
 * @desc    Get communication statistics
 * @route   GET /api/superadmin/communication/stats
 * @access  Private (SuperAdmin)
 */
const getCommunicationStats = asyncHandler(async (req, res) => {
  const stats = await Message.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const typeStats = await Message.aggregate([
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
    'Communication statistics retrieved successfully'
  );
});

module.exports = {
  getMessages,
  sendMessage,
  getMessageHistory,
  deleteMessage,
  getCommunicationStats,
};
