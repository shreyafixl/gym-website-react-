const SupportTicket = require('../models/SupportTicket');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a support ticket
 * @route   POST /api/member/support/tickets
 * @access  Private (Member only)
 */
const createTicket = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { ticketTitle, ticketDescription, ticketCategory, priorityLevel, tags } = req.body;

  // Validate required fields
  if (!ticketTitle || !ticketDescription || !ticketCategory) {
    throw ApiError.badRequest('Title, description, and category are required');
  }

  // Validate title length
  if (ticketTitle.length < 5 || ticketTitle.length > 200) {
    throw ApiError.badRequest('Title must be between 5 and 200 characters');
  }

  // Validate description length
  if (ticketDescription.length < 10 || ticketDescription.length > 2000) {
    throw ApiError.badRequest('Description must be between 10 and 2000 characters');
  }

  // Validate category
  const validCategories = ['technical', 'payment', 'membership', 'trainer', 'branch', 'general'];
  if (!validCategories.includes(ticketCategory)) {
    throw ApiError.badRequest('Invalid ticket category');
  }

  // Validate priority
  if (priorityLevel && !['low', 'medium', 'high', 'urgent'].includes(priorityLevel)) {
    throw ApiError.badRequest('Invalid priority level');
  }

  // Get user details
  const User = require('../models/User');
  const user = await User.findById(memberId).select('fullName email').lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Create ticket
  const ticket = new SupportTicket({
    ticketTitle: ticketTitle.trim(),
    ticketDescription: ticketDescription.trim(),
    createdBy: {
      userId: memberId,
      userModel: 'User',
      userName: user.fullName,
      userEmail: user.email,
    },
    ticketCategory,
    priorityLevel: priorityLevel || 'medium',
    ticketStatus: 'open',
    tags: tags || [],
  });

  await ticket.save();

  const ticketDetail = {
    id: ticket._id,
    title: ticket.ticketTitle,
    description: ticket.ticketDescription,
    category: ticket.ticketCategory,
    priority: ticket.priorityLevel,
    status: ticket.ticketStatus,
    createdBy: {
      name: ticket.createdBy.userName,
      email: ticket.createdBy.userEmail,
    },
    tags: ticket.tags,
    createdAt: ticket.createdAt,
  };

  ApiResponse.success(
    res,
    ticketDetail,
    'Support ticket created successfully',
    201
  );
});

/**
 * @desc    Get my support tickets
 * @route   GET /api/member/support/tickets
 * @access  Private (Member only)
 */
const getMyTickets = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { page = 1, limit = 10, status, category } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const filter = { 'createdBy.userId': memberId };

  if (status) {
    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest('Invalid status filter');
    }
    filter.ticketStatus = status;
  }

  if (category) {
    const validCategories = ['technical', 'payment', 'membership', 'trainer', 'branch', 'general'];
    if (!validCategories.includes(category)) {
      throw ApiError.badRequest('Invalid category filter');
    }
    filter.ticketCategory = category;
  }

  // Execute query with pagination
  const tickets = await SupportTicket.find(filter)
    .populate('assignedTo.userId', 'fullName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await SupportTicket.countDocuments(filter);

  const response = {
    tickets: tickets.map(t => ({
      id: t._id,
      title: t.ticketTitle,
      category: t.ticketCategory,
      priority: t.priorityLevel,
      status: t.ticketStatus,
      assignedTo: t.assignedTo.userId ? {
        name: t.assignedTo.userName,
        email: t.assignedTo.userEmail,
      } : null,
      commentCount: t.comments.length,
      tags: t.tags,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
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
    'Support tickets retrieved successfully'
  );
});

/**
 * @desc    Get ticket by ID
 * @route   GET /api/member/support/tickets/:id
 * @access  Private (Member only)
 */
const getTicketById = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid ticket ID format');
  }

  const ticket = await SupportTicket.findById(id)
    .populate('createdBy.userId', 'fullName email phone')
    .populate('assignedTo.userId', 'fullName email phone')
    .populate('comments.commentBy.userId', 'fullName email profileImage')
    .lean();

  if (!ticket) {
    throw ApiError.notFound('Ticket not found');
  }

  // Verify ownership
  if (ticket.createdBy.userId._id.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this ticket');
  }

  const ticketDetail = {
    id: ticket._id,
    title: ticket.ticketTitle,
    description: ticket.ticketDescription,
    category: ticket.ticketCategory,
    priority: ticket.priorityLevel,
    status: ticket.ticketStatus,
    createdBy: {
      id: ticket.createdBy.userId._id,
      name: ticket.createdBy.userId.fullName,
      email: ticket.createdBy.userId.email,
      phone: ticket.createdBy.userId.phone,
    },
    assignedTo: ticket.assignedTo.userId ? {
      id: ticket.assignedTo.userId._id,
      name: ticket.assignedTo.userId.fullName,
      email: ticket.assignedTo.userId.email,
      assignedDate: ticket.assignedTo.assignedDate,
    } : null,
    comments: ticket.comments.map(c => ({
      id: c._id,
      comment: c.comment,
      commentBy: {
        id: c.commentBy.userId._id,
        name: c.commentBy.userId.fullName,
        email: c.commentBy.userId.email,
        profileImage: c.commentBy.userId.profileImage,
      },
      isInternal: c.isInternal,
      createdAt: c.createdAt,
    })),
    attachments: ticket.attachments,
    resolutionNotes: ticket.resolutionNotes,
    tags: ticket.tags,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    resolvedAt: ticket.resolvedAt,
    closedAt: ticket.closedAt,
  };

  ApiResponse.success(
    res,
    ticketDetail,
    'Ticket retrieved successfully'
  );
});

/**
 * @desc    Add comment to ticket
 * @route   POST /api/member/support/tickets/:id/comments
 * @access  Private (Member only)
 */
const addComment = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { id } = req.params;
  const { comment } = req.body;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid ticket ID format');
  }

  // Validate comment
  if (!comment || typeof comment !== 'string') {
    throw ApiError.badRequest('Comment is required');
  }

  if (comment.trim().length === 0 || comment.trim().length > 1000) {
    throw ApiError.badRequest('Comment must be between 1 and 1000 characters');
  }

  const ticket = await SupportTicket.findById(id);

  if (!ticket) {
    throw ApiError.notFound('Ticket not found');
  }

  // Verify ownership
  if (ticket.createdBy.userId.toString() !== memberId) {
    throw ApiError.forbidden('You do not have access to this ticket');
  }

  // Get user details
  const User = require('../models/User');
  const user = await User.findById(memberId).select('fullName email').lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Add comment
  ticket.comments.push({
    commentBy: {
      userId: memberId,
      userModel: 'User',
      userName: user.fullName,
    },
    comment: comment.trim(),
    isInternal: false,
    createdAt: Date.now(),
  });

  // Add to history
  ticket.history.push({
    action: 'comment-added',
    performedBy: {
      userId: memberId,
      userModel: 'User',
      userName: user.fullName,
    },
    details: 'Comment added',
    timestamp: Date.now(),
  });

  await ticket.save();

  const updated = await SupportTicket.findById(id)
    .populate('comments.commentBy.userId', 'fullName email profileImage')
    .lean();

  const latestComment = updated.comments[updated.comments.length - 1];

  ApiResponse.success(
    res,
    {
      id: latestComment._id,
      comment: latestComment.comment,
      commentBy: {
        name: latestComment.commentBy.userId.fullName,
        email: latestComment.commentBy.userId.email,
      },
      createdAt: latestComment.createdAt,
    },
    'Comment added successfully'
  );
});

/**
 * @desc    Get ticket statistics
 * @route   GET /api/member/support/stats
 * @access  Private (Member only)
 */
const getTicketStats = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  const tickets = await SupportTicket.find({ 'createdBy.userId': memberId }).lean();

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.ticketStatus === 'open').length,
    inProgress: tickets.filter(t => t.ticketStatus === 'in-progress').length,
    resolved: tickets.filter(t => t.ticketStatus === 'resolved').length,
    closed: tickets.filter(t => t.ticketStatus === 'closed').length,
    urgent: tickets.filter(t => t.priorityLevel === 'urgent').length,
    avgResolutionTime: tickets.filter(t => t.resolutionTime).length > 0
      ? Math.round(tickets.filter(t => t.resolutionTime).reduce((sum, t) => sum + t.resolutionTime, 0) / tickets.filter(t => t.resolutionTime).length)
      : 0,
  };

  ApiResponse.success(
    res,
    stats,
    'Ticket statistics retrieved successfully'
  );
});

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  addComment,
  getTicketStats,
};
