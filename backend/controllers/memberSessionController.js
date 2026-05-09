const Session = require('../models/Session');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get available sessions with filtering
 * @route   GET /api/member/sessions/available
 * @access  Private (Member only)
 */
const getAvailableSessions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sessionType, category, difficulty, branchId, startDate, endDate } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const filter = {
    sessionStatus: { $in: ['scheduled', 'in-progress'] },
  };

  // Session type filtering
  if (sessionType) {
    const validTypes = ['personal-training', 'group-class', 'consultation', 'assessment'];
    if (!validTypes.includes(sessionType)) {
      throw ApiError.badRequest('Invalid session type');
    }
    filter.sessionType = sessionType;
  }

  // Category filtering
  if (category) {
    const validCategories = [
      'strength-training',
      'cardio',
      'yoga',
      'pilates',
      'hiit',
      'crossfit',
      'zumba',
      'spinning',
      'boxing',
      'martial-arts',
      'functional-training',
      'stretching',
      'other',
    ];
    if (!validCategories.includes(category)) {
      throw ApiError.badRequest('Invalid category');
    }
    filter.sessionCategory = category;
  }

  // Difficulty filtering
  if (difficulty) {
    const validDifficulties = ['beginner', 'intermediate', 'advanced', 'all-levels'];
    if (!validDifficulties.includes(difficulty)) {
      throw ApiError.badRequest('Invalid difficulty level');
    }
    filter.difficultyLevel = difficulty;
  }

  // Branch filtering
  if (branchId) {
    filter.branchId = branchId;
  }

  // Date range filtering
  if (startDate || endDate) {
    filter.sessionDate = {};

    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw ApiError.badRequest('Invalid start date format');
      }
      filter.sessionDate.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        throw ApiError.badRequest('Invalid end date format');
      }
      end.setHours(23, 59, 59, 999);
      filter.sessionDate.$lte = end;
    }
  } else {
    // Default: show sessions from today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    filter.sessionDate = { $gte: today };
  }

  // Execute query with pagination
  const sessions = await Session.find(filter)
    .populate('trainerId', 'fullName email phone specialization profileImage')
    .populate('branchId', 'branchName branchCode city')
    .sort({ sessionDate: 1, startTime: 1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await Session.countDocuments(filter);

  const response = {
    sessions: sessions.map(s => ({
      id: s._id,
      title: s.sessionTitle,
      description: s.sessionDescription,
      type: s.sessionType,
      category: s.sessionCategory,
      difficulty: s.difficultyLevel,
      date: s.sessionDate,
      startTime: s.startTime,
      endTime: s.endTime,
      duration: s.duration,
      trainer: s.trainerId,
      branch: s.branchId,
      location: s.location,
      maxParticipants: s.maxParticipants,
      currentParticipants: s.participants.filter(p => p.bookingStatus === 'confirmed' || p.bookingStatus === 'pending').length,
      availableSlots: s.maxParticipants - s.participants.filter(p => p.bookingStatus === 'confirmed' || p.bookingStatus === 'pending').length,
      isFull: s.participants.filter(p => p.bookingStatus === 'confirmed' || p.bookingStatus === 'pending').length >= s.maxParticipants,
      price: s.price,
      equipment: s.equipment,
      prerequisites: s.prerequisites,
      status: s.sessionStatus,
      createdAt: s.createdAt,
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
    'Available sessions retrieved successfully'
  );
});

/**
 * @desc    Get booked sessions for member
 * @route   GET /api/member/sessions/booked
 * @access  Private (Member only)
 */
const getBookedSessions = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Build filter query
  const filter = {
    'participants.memberId': memberId,
  };

  // Status filtering
  if (status) {
    const validStatuses = ['confirmed', 'pending', 'cancelled', 'completed', 'no-show'];
    if (!validStatuses.includes(status)) {
      throw ApiError.badRequest('Invalid booking status');
    }
    filter['participants.bookingStatus'] = status;
  }

  // Execute query with pagination
  const sessions = await Session.find(filter)
    .populate('trainerId', 'fullName email phone specialization profileImage')
    .populate('branchId', 'branchName branchCode city')
    .sort({ sessionDate: -1, startTime: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await Session.countDocuments(filter);

  const response = {
    sessions: sessions.map(s => {
      const memberBooking = s.participants.find(p => p.memberId.toString() === memberId);
      return {
        id: s._id,
        title: s.sessionTitle,
        description: s.sessionDescription,
        type: s.sessionType,
        category: s.sessionCategory,
        difficulty: s.difficultyLevel,
        date: s.sessionDate,
        startTime: s.startTime,
        endTime: s.endTime,
        duration: s.duration,
        trainer: s.trainerId,
        branch: s.branchId,
        location: s.location,
        bookingStatus: memberBooking.bookingStatus,
        bookingDate: memberBooking.bookingDate,
        attended: memberBooking.attended,
        notes: memberBooking.notes,
        sessionStatus: s.sessionStatus,
        price: s.price,
        createdAt: s.createdAt,
      };
    }),
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
    'Booked sessions retrieved successfully'
  );
});

/**
 * @desc    Get session details by ID
 * @route   GET /api/member/sessions/:id
 * @access  Private (Member only)
 */
const getSessionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid session ID format');
  }

  const session = await Session.findById(id)
    .populate('trainerId', 'fullName email phone specialization profileImage')
    .populate('branchId', 'branchName branchCode city address')
    .populate('participants.memberId', 'fullName email phone')
    .lean();

  if (!session) {
    throw ApiError.notFound('Session not found');
  }

  const sessionDetail = {
    id: session._id,
    title: session.sessionTitle,
    description: session.sessionDescription,
    type: session.sessionType,
    category: session.sessionCategory,
    difficulty: session.difficultyLevel,
    date: session.sessionDate,
    startTime: session.startTime,
    endTime: session.endTime,
    duration: session.duration,
    trainer: session.trainerId,
    branch: session.branchId,
    location: session.location,
    maxParticipants: session.maxParticipants,
    participants: session.participants.map(p => ({
      memberId: p.memberId._id,
      memberName: p.memberId.fullName,
      bookingStatus: p.bookingStatus,
      bookingDate: p.bookingDate,
      attended: p.attended,
    })),
    currentParticipants: session.participants.filter(p => p.bookingStatus === 'confirmed' || p.bookingStatus === 'pending').length,
    availableSlots: session.maxParticipants - session.participants.filter(p => p.bookingStatus === 'confirmed' || p.bookingStatus === 'pending').length,
    isFull: session.participants.filter(p => p.bookingStatus === 'confirmed' || p.bookingStatus === 'pending').length >= session.maxParticipants,
    price: session.price,
    equipment: session.equipment,
    prerequisites: session.prerequisites,
    status: session.sessionStatus,
    notes: session.notes,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };

  ApiResponse.success(
    res,
    sessionDetail,
    'Session retrieved successfully'
  );
});

/**
 * @desc    Book a session
 * @route   POST /api/member/sessions/:id/book
 * @access  Private (Member only)
 */
const bookSession = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { id } = req.params;
  const { notes } = req.body;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid session ID format');
  }

  const session = await Session.findById(id);

  if (!session) {
    throw ApiError.notFound('Session not found');
  }

  // Check if session is cancelled
  if (session.sessionStatus === 'cancelled') {
    throw ApiError.badRequest('Cannot book a cancelled session');
  }

  // Check if session date is in the past
  if (new Date(session.sessionDate) < new Date()) {
    throw ApiError.badRequest('Cannot book a session in the past');
  }

  // Check if session is full
  const confirmedParticipants = session.participants.filter(
    p => p.bookingStatus === 'confirmed' || p.bookingStatus === 'pending'
  ).length;

  if (confirmedParticipants >= session.maxParticipants) {
    throw ApiError.badRequest('Session is full');
  }

  // Check if member already booked
  const existingBooking = session.participants.find(
    p => p.memberId.toString() === memberId && p.bookingStatus !== 'cancelled'
  );

  if (existingBooking) {
    throw ApiError.badRequest('You have already booked this session');
  }

  // Book session
  session.participants.push({
    memberId,
    bookingDate: Date.now(),
    bookingStatus: 'confirmed',
    notes: notes || null,
    attended: false,
  });

  await session.save();

  const updated = await Session.findById(id)
    .populate('trainerId', 'fullName email')
    .lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      title: updated.sessionTitle,
      bookingStatus: 'confirmed',
      bookingDate: new Date(),
    },
    'Session booked successfully'
  );
});

/**
 * @desc    Cancel session booking
 * @route   POST /api/member/sessions/:id/cancel
 * @access  Private (Member only)
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid session ID format');
  }

  const session = await Session.findById(id);

  if (!session) {
    throw ApiError.notFound('Session not found');
  }

  // Find member booking
  const booking = session.participants.find(
    p => p.memberId.toString() === memberId && p.bookingStatus !== 'cancelled'
  );

  if (!booking) {
    throw ApiError.notFound('Booking not found');
  }

  // Check if session is in the past
  if (new Date(session.sessionDate) < new Date()) {
    throw ApiError.badRequest('Cannot cancel booking for a session in the past');
  }

  // Cancel booking
  booking.bookingStatus = 'cancelled';
  await session.save();

  const updated = await Session.findById(id).lean();

  ApiResponse.success(
    res,
    {
      id: updated._id,
      title: updated.sessionTitle,
      bookingStatus: 'cancelled',
    },
    'Booking cancelled successfully'
  );
});

module.exports = {
  getAvailableSessions,
  getBookedSessions,
  getSessionById,
  bookSession,
  cancelBooking,
};
