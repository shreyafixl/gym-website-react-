const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all campaigns with pagination
 * @route   GET /api/superadmin/campaigns
 * @access  Private (SuperAdmin)
 */
const getCampaigns = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Mock campaigns data
  const mockCampaigns = [
    {
      _id: '1',
      name: 'Summer Fitness Challenge',
      description: 'Join our summer fitness challenge',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      targetAudience: 'members',
      budget: 5000,
      participants: 150,
    },
    {
      _id: '2',
      name: 'New Year Resolution',
      description: 'Start your fitness journey',
      status: 'completed',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      targetAudience: 'all',
      budget: 3000,
      participants: 200,
    },
  ];

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  let filtered = mockCampaigns;
  if (status) {
    filtered = filtered.filter(c => c.status === status);
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  const campaigns = filtered.slice(skip, skip + limitNum);

  ApiResponse.success(
    res,
    {
      campaigns,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Campaigns retrieved successfully'
  );
});

/**
 * @desc    Create a new campaign
 * @route   POST /api/superadmin/campaigns
 * @access  Private (SuperAdmin)
 */
const createCampaign = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    startDate,
    endDate,
    targetAudience,
    budget,
  } = req.body;

  if (!name || !description || !startDate || !endDate) {
    throw ApiError.badRequest('Please provide all required fields');
  }

  const campaign = {
    _id: Date.now().toString(),
    name,
    description,
    status: 'active',
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    targetAudience: targetAudience || 'all',
    budget: budget || 0,
    participants: 0,
    createdAt: new Date(),
  };

  ApiResponse.success(
    res,
    { campaign },
    'Campaign created successfully',
    201
  );
});

/**
 * @desc    Get campaign by ID
 * @route   GET /api/superadmin/campaigns/:campaignId
 * @access  Private (SuperAdmin)
 */
const getCampaignById = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;

  const campaign = {
    _id: campaignId,
    name: 'Sample Campaign',
    description: 'Sample campaign description',
    status: 'active',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    targetAudience: 'members',
    budget: 5000,
    participants: 150,
  };

  ApiResponse.success(
    res,
    { campaign },
    'Campaign retrieved successfully'
  );
});

/**
 * @desc    Update campaign
 * @route   PUT /api/superadmin/campaigns/:campaignId
 * @access  Private (SuperAdmin)
 */
const updateCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const updateData = req.body;

  const campaign = {
    _id: campaignId,
    ...updateData,
    updatedAt: new Date(),
  };

  ApiResponse.success(
    res,
    { campaign },
    'Campaign updated successfully'
  );
});

/**
 * @desc    Delete campaign
 * @route   DELETE /api/superadmin/campaigns/:campaignId
 * @access  Private (SuperAdmin)
 */
const deleteCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;

  ApiResponse.success(
    res,
    { campaignId },
    'Campaign deleted successfully'
  );
});

module.exports = {
  getCampaigns,
  createCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};
