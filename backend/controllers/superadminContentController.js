const Announcement = require('../models/Announcement');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all content with pagination
 * @route   GET /api/superadmin/content
 * @access  Private (SuperAdmin)
 */
const getContent = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    type = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  if (type) {
    query.type = type;
  }

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
  const content = await Announcement.find(query)
    .populate('createdBy', 'fullName email')
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await Announcement.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      content,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Content retrieved successfully'
  );
});

/**
 * @desc    Create new content
 * @route   POST /api/superadmin/content
 * @access  Private (SuperAdmin)
 */
const createContent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    content,
    type,
    status,
    tags,
  } = req.body;

  if (!title || !content || !type) {
    throw ApiError.badRequest('Please provide title, content, and type');
  }

  const newContent = await Announcement.create({
    title,
    description,
    content,
    type,
    status: status || 'draft',
    tags: tags || [],
    createdBy: req.user._id,
    createdAt: new Date(),
  });

  const createdContent = await Announcement.findById(newContent._id)
    .populate('createdBy', 'fullName email');

  ApiResponse.success(
    res,
    { content: createdContent },
    'Content created successfully',
    201
  );
});

/**
 * @desc    Get content by ID
 * @route   GET /api/superadmin/content/:contentId
 * @access  Private (SuperAdmin)
 */
const getContentById = asyncHandler(async (req, res) => {
  const { contentId } = req.params;

  const content = await Announcement.findById(contentId)
    .populate('createdBy', 'fullName email');

  if (!content) {
    throw ApiError.notFound('Content not found');
  }

  ApiResponse.success(
    res,
    { content },
    'Content retrieved successfully'
  );
});

/**
 * @desc    Update content
 * @route   PUT /api/superadmin/content/:contentId
 * @access  Private (SuperAdmin)
 */
const updateContent = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const updateData = req.body;

  const content = await Announcement.findByIdAndUpdate(
    contentId,
    { $set: { ...updateData, updatedAt: new Date() } },
    { new: true, runValidators: true }
  )
    .populate('createdBy', 'fullName email');

  if (!content) {
    throw ApiError.notFound('Content not found');
  }

  ApiResponse.success(
    res,
    { content },
    'Content updated successfully'
  );
});

/**
 * @desc    Publish content
 * @route   PUT /api/superadmin/content/:contentId/publish
 * @access  Private (SuperAdmin)
 */
const publishContent = asyncHandler(async (req, res) => {
  const { contentId } = req.params;

  const content = await Announcement.findByIdAndUpdate(
    contentId,
    {
      $set: {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { new: true, runValidators: true }
  )
    .populate('createdBy', 'fullName email');

  if (!content) {
    throw ApiError.notFound('Content not found');
  }

  ApiResponse.success(
    res,
    { content },
    'Content published successfully'
  );
});

/**
 * @desc    Delete content
 * @route   DELETE /api/superadmin/content/:contentId
 * @access  Private (SuperAdmin)
 */
const deleteContent = asyncHandler(async (req, res) => {
  const { contentId } = req.params;

  const content = await Announcement.findById(contentId);

  if (!content) {
    throw ApiError.notFound('Content not found');
  }

  // Soft delete
  content.status = 'deleted';
  content.deletedAt = new Date();
  await content.save();

  ApiResponse.success(
    res,
    { contentId },
    'Content deleted successfully'
  );
});

module.exports = {
  getContent,
  createContent,
  getContentById,
  updateContent,
  publishContent,
  deleteContent,
};
