const IntegrationSettings = require('../models/IntegrationSettings');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const crypto = require('crypto');

/**
 * @desc    Get API settings
 * @route   GET /api/superadmin/integrations/api-settings
 * @access  Private (SuperAdmin)
 */
const getApiSettings = asyncHandler(async (req, res) => {
  const settings = await IntegrationSettings.findOne({ type: 'api' });

  if (!settings) {
    throw ApiError.notFound('API settings not found');
  }

  ApiResponse.success(
    res,
    { settings },
    'API settings retrieved successfully'
  );
});

/**
 * @desc    Update API settings
 * @route   PUT /api/superadmin/integrations/api-settings
 * @access  Private (SuperAdmin)
 */
const updateApiSettings = asyncHandler(async (req, res) => {
  const updateData = req.body;

  let settings = await IntegrationSettings.findOne({ type: 'api' });

  if (!settings) {
    settings = await IntegrationSettings.create({
      type: 'api',
      ...updateData,
    });
  } else {
    settings = await IntegrationSettings.findByIdAndUpdate(
      settings._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  ApiResponse.success(
    res,
    { settings },
    'API settings updated successfully'
  );
});

/**
 * @desc    Generate API key
 * @route   POST /api/superadmin/integrations/api-keys/generate
 * @access  Private (SuperAdmin)
 */
const generateApiKey = asyncHandler(async (req, res) => {
  const { name, permissions = [] } = req.body;

  if (!name) {
    throw ApiError.badRequest('API key name is required');
  }

  // Generate random API key
  const apiKey = crypto.randomBytes(32).toString('hex');

  const keyData = {
    _id: Date.now().toString(),
    name,
    key: apiKey,
    permissions,
    createdAt: new Date(),
    lastUsed: null,
    isActive: true,
  };

  ApiResponse.success(
    res,
    { apiKey: keyData },
    'API key generated successfully',
    201
  );
});

/**
 * @desc    Get all third-party apps
 * @route   GET /api/superadmin/integrations/apps
 * @access  Private (SuperAdmin)
 */
const getThirdPartyApps = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    status = '',
  } = req.query;

  // Mock apps data
  const mockApps = [
    {
      _id: '1',
      name: 'Slack Integration',
      description: 'Send notifications to Slack',
      status: 'active',
      category: 'communication',
      version: '1.0.0',
      installDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    },
    {
      _id: '2',
      name: 'Google Analytics',
      description: 'Track website analytics',
      status: 'active',
      category: 'analytics',
      version: '2.1.0',
      installDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    },
  ];

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  let filtered = mockApps;
  if (status) {
    filtered = filtered.filter(a => a.status === status);
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  const apps = filtered.slice(skip, skip + limitNum);

  ApiResponse.success(
    res,
    {
      apps,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Third-party apps retrieved successfully'
  );
});

/**
 * @desc    Install third-party app
 * @route   POST /api/superadmin/integrations/apps
 * @access  Private (SuperAdmin)
 */
const installApp = asyncHandler(async (req, res) => {
  const { name, appId, config = {} } = req.body;

  if (!name || !appId) {
    throw ApiError.badRequest('Please provide name and appId');
  }

  const app = {
    _id: Date.now().toString(),
    name,
    appId,
    status: 'active',
    config,
    installDate: new Date(),
  };

  ApiResponse.success(
    res,
    { app },
    'App installed successfully',
    201
  );
});

/**
 * @desc    Update app configuration
 * @route   PUT /api/superadmin/integrations/apps/:appId/config
 * @access  Private (SuperAdmin)
 */
const updateAppConfig = asyncHandler(async (req, res) => {
  const { appId } = req.params;
  const { config } = req.body;

  if (!config) {
    throw ApiError.badRequest('Configuration is required');
  }

  const app = {
    _id: appId,
    config,
    updatedAt: new Date(),
  };

  ApiResponse.success(
    res,
    { app },
    'App configuration updated successfully'
  );
});

/**
 * @desc    Uninstall app
 * @route   DELETE /api/superadmin/integrations/apps/:appId
 * @access  Private (SuperAdmin)
 */
const uninstallApp = asyncHandler(async (req, res) => {
  const { appId } = req.params;

  ApiResponse.success(
    res,
    { appId },
    'App uninstalled successfully'
  );
});

module.exports = {
  getApiSettings,
  updateApiSettings,
  generateApiKey,
  getThirdPartyApps,
  installApp,
  updateAppConfig,
  uninstallApp,
};
