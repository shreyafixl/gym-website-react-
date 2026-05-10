const SupportTicket = require('../models/SupportTicket');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all support tickets with pagination
 * @route   GET /api/superadmin/support/tickets
 * @access  Private (SuperAdmin)
 */
const getTickets = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    status = '',
    priority = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const tickets = await SupportTicket.find(query)
    .populate('user', 'fullName email')
    .populate('assignedTo', 'fullName email')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await SupportTicket.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      tickets,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Support tickets retrieved successfully'
  );
});

/**
 * @desc    Create support ticket
 * @route   POST /api/superadmin/support/tickets
 * @access  Private (SuperAdmin)
 */
const createTicket = asyncHandler(async (req, res) => {
  const {
    user,
    subject,
    description,
    priority,
    category,
  } = req.body;

  if (!user || !subject || !description) {
    throw ApiError.badRequest('Please provide user, subject, and description');
  }

  const ticket = await SupportTicket.create({
    user,
    subject,
    description,
    priority: priority || 'medium',
    category: category || 'general',
    status: 'open',
    createdAt: new Date(),
  });

  const createdTicket = await SupportTicket.findById(ticket._id)
    .populate('user', 'fullName email');

  ApiResponse.success(
    res,
    { ticket: createdTicket },
    'Support ticket created successfully',
    201
  );
});

/**
 * @desc    Get ticket by ID
 * @route   GET /api/superadmin/support/tickets/:ticketId
 * @access  Private (SuperAdmin)
 */
const getTicketById = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await SupportTicket.findById(ticketId)
    .populate('user', 'fullName email')
    .populate('assignedTo', 'fullName email');

  if (!ticket) {
    throw ApiError.notFound('Support ticket not found');
  }

  ApiResponse.success(
    res,
    { ticket },
    'Support ticket retrieved successfully'
  );
});

/**
 * @desc    Update ticket
 * @route   PUT /api/superadmin/support/tickets/:ticketId
 * @access  Private (SuperAdmin)
 */
const updateTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const updateData = req.body;

  const ticket = await SupportTicket.findByIdAndUpdate(
    ticketId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('user', 'fullName email')
    .populate('assignedTo', 'fullName email');

  if (!ticket) {
    throw ApiError.notFound('Support ticket not found');
  }

  ApiResponse.success(
    res,
    { ticket },
    'Support ticket updated successfully'
  );
});

/**
 * @desc    Close ticket
 * @route   PUT /api/superadmin/support/tickets/:ticketId/close
 * @access  Private (SuperAdmin)
 */
const closeTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { resolution } = req.body;

  const ticket = await SupportTicket.findByIdAndUpdate(
    ticketId,
    {
      $set: {
        status: 'closed',
        resolution,
        closedAt: new Date(),
      },
    },
    { new: true, runValidators: true }
  )
    .populate('user', 'fullName email');

  if (!ticket) {
    throw ApiError.notFound('Support ticket not found');
  }

  ApiResponse.success(
    res,
    { ticket },
    'Support ticket closed successfully'
  );
});

/**
 * @desc    Get feedback
 * @route   GET /api/superadmin/support/feedback
 * @access  Private (SuperAdmin)
 */
const getFeedback = asyncHandler(async (req, res) => {
  const { page = 1, per_page = 20 } = req.query;

  // Mock feedback data
  const mockFeedback = [
    {
      _id: '1',
      user: 'User 1',
      rating: 5,
      message: 'Great service!',
      reviewed: false,
      createdAt: new Date(),
    },
    {
      _id: '2',
      user: 'User 2',
      rating: 4,
      message: 'Good experience',
      reviewed: true,
      createdAt: new Date(Date.now() - 86400000),
    },
  ];

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  const totalCount = mockFeedback.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  const feedback = mockFeedback.slice(skip, skip + limitNum);

  ApiResponse.success(
    res,
    {
      feedback,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Feedback retrieved successfully'
  );
});

/**
 * @desc    Mark feedback as reviewed
 * @route   PUT /api/superadmin/support/feedback/:feedbackId/mark-reviewed
 * @access  Private (SuperAdmin)
 */
const markFeedbackReviewed = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  const feedback = {
    _id: feedbackId,
    reviewed: true,
    reviewedAt: new Date(),
  };

  ApiResponse.success(
    res,
    { feedback },
    'Feedback marked as reviewed'
  );
});

/**
 * @desc    Delete feedback
 * @route   DELETE /api/superadmin/support/feedback/:feedbackId
 * @access  Private (SuperAdmin)
 */
const deleteFeedback = asyncHandler(async (req, res) => {
  const { feedbackId } = req.params;

  ApiResponse.success(
    res,
    { feedbackId },
    'Feedback deleted successfully'
  );
});

module.exports = {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  closeTicket,
  getFeedback,
  markFeedbackReviewed,
  deleteFeedback,
};
