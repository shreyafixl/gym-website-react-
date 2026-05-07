const IntegrationSettings = require('../models/IntegrationSettings');
const EmailService = require('../services/emailService');
const SMSService = require('../services/smsService');
const PaymentService = require('../services/paymentService');
const StorageService = require('../services/storageService');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all integration settings
 * @route   GET /api/integrations
 * @access  Private (SuperAdmin)
 */
const getIntegrations = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  ApiResponse.success(res, integrations, 'Integration settings retrieved successfully');
});

/**
 * @desc    Update integration settings
 * @route   PUT /api/integrations
 * @access  Private (SuperAdmin)
 */
const updateIntegrations = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  const {
    paymentGateway,
    emailProvider,
    smsProvider,
    cloudStorageProvider,
    apiKeys,
    webhookUrls,
    integrationStatus,
  } = req.body;

  // Update payment gateway
  if (paymentGateway) {
    integrations.paymentGateway = { ...integrations.paymentGateway, ...paymentGateway };
  }

  // Update email provider
  if (emailProvider) {
    integrations.emailProvider = { ...integrations.emailProvider, ...emailProvider };
  }

  // Update SMS provider
  if (smsProvider) {
    integrations.smsProvider = { ...integrations.smsProvider, ...smsProvider };
  }

  // Update cloud storage provider
  if (cloudStorageProvider) {
    integrations.cloudStorageProvider = { ...integrations.cloudStorageProvider, ...cloudStorageProvider };
  }

  // Update API keys
  if (apiKeys) {
    integrations.apiKeys = { ...integrations.apiKeys, ...apiKeys };
  }

  // Update webhook URLs
  if (webhookUrls) {
    integrations.webhookUrls = { ...integrations.webhookUrls, ...webhookUrls };
  }

  // Update integration status
  if (integrationStatus) {
    integrations.integrationStatus = integrationStatus;
  }

  // Update last modified by
  integrations.lastModifiedBy = {
    userId: req.user._id,
    userName: req.user.fullName,
    modifiedAt: new Date(),
  };

  await integrations.save();

  ApiResponse.success(res, integrations, 'Integration settings updated successfully');
});

/**
 * @desc    Get payment gateway settings
 * @route   GET /api/integrations/payment
 * @access  Private (SuperAdmin)
 */
const getPaymentSettings = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  ApiResponse.success(res, integrations.paymentGateway, 'Payment gateway settings retrieved successfully');
});

/**
 * @desc    Update payment gateway settings
 * @route   PUT /api/integrations/payment
 * @access  Private (SuperAdmin)
 */
const updatePaymentSettings = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  await integrations.updatePaymentGateway(req.body, req.user._id, req.user.fullName);

  ApiResponse.success(res, integrations.paymentGateway, 'Payment gateway settings updated successfully');
});

/**
 * @desc    Get email provider settings
 * @route   GET /api/integrations/email
 * @access  Private (SuperAdmin)
 */
const getEmailSettings = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  ApiResponse.success(res, integrations.emailProvider, 'Email provider settings retrieved successfully');
});

/**
 * @desc    Update email provider settings
 * @route   PUT /api/integrations/email
 * @access  Private (SuperAdmin)
 */
const updateEmailSettings = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  await integrations.updateEmailProvider(req.body, req.user._id, req.user.fullName);

  ApiResponse.success(res, integrations.emailProvider, 'Email provider settings updated successfully');
});

/**
 * @desc    Get SMS provider settings
 * @route   GET /api/integrations/sms
 * @access  Private (SuperAdmin)
 */
const getSMSSettings = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  ApiResponse.success(res, integrations.smsProvider, 'SMS provider settings retrieved successfully');
});

/**
 * @desc    Update SMS provider settings
 * @route   PUT /api/integrations/sms
 * @access  Private (SuperAdmin)
 */
const updateSMSSettings = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  await integrations.updateSmsProvider(req.body, req.user._id, req.user.fullName);

  ApiResponse.success(res, integrations.smsProvider, 'SMS provider settings updated successfully');
});

/**
 * @desc    Get storage provider settings
 * @route   GET /api/integrations/storage
 * @access  Private (SuperAdmin)
 */
const getStorageSettings = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  ApiResponse.success(res, integrations.cloudStorageProvider, 'Storage provider settings retrieved successfully');
});

/**
 * @desc    Update storage provider settings
 * @route   PUT /api/integrations/storage
 * @access  Private (SuperAdmin)
 */
const updateStorageSettings = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  await integrations.updateStorageProvider(req.body, req.user._id, req.user.fullName);

  ApiResponse.success(res, integrations.cloudStorageProvider, 'Storage provider settings updated successfully');
});

/**
 * @desc    Test email integration
 * @route   POST /api/integrations/test-email
 * @access  Private (SuperAdmin)
 */
const testEmailIntegration = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations()
    .select('+emailProvider.config.smtpPassword +emailProvider.config.apiKey +emailProvider.config.apiSecret');

  if (integrations.emailProvider.provider === 'none') {
    throw ApiError.badRequest('Email provider not configured');
  }

  const result = await EmailService.testEmailConfig(integrations.emailProvider);

  // Update test result
  integrations.emailProvider.lastTested = new Date();
  integrations.emailProvider.testResult = {
    success: result.success,
    message: result.message,
  };
  await integrations.save();

  if (result.success) {
    ApiResponse.success(res, result, 'Email integration test successful');
  } else {
    throw ApiError.badRequest(result.message);
  }
});

/**
 * @desc    Test SMS integration
 * @route   POST /api/integrations/test-sms
 * @access  Private (SuperAdmin)
 */
const testSMSIntegration = asyncHandler(async (req, res) => {
  const { testPhoneNumber } = req.body;

  if (!testPhoneNumber) {
    throw ApiError.badRequest('Please provide test phone number');
  }

  const integrations = await IntegrationSettings.getIntegrations()
    .select('+smsProvider.config.apiKey +smsProvider.config.apiSecret +smsProvider.config.accountSid +smsProvider.config.authToken');

  if (integrations.smsProvider.provider === 'none') {
    throw ApiError.badRequest('SMS provider not configured');
  }

  const result = await SMSService.testSMSConfig(integrations.smsProvider, testPhoneNumber);

  // Update test result
  integrations.smsProvider.lastTested = new Date();
  integrations.smsProvider.testResult = {
    success: result.success,
    message: result.message,
  };
  await integrations.save();

  if (result.success) {
    ApiResponse.success(res, result, 'SMS integration test successful');
  } else {
    throw ApiError.badRequest(result.message);
  }
});

/**
 * @desc    Test payment integration
 * @route   POST /api/integrations/test-payment
 * @access  Private (SuperAdmin)
 */
const testPaymentIntegration = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations()
    .select('+paymentGateway.config.apiKey +paymentGateway.config.apiSecret +paymentGateway.config.webhookSecret');

  if (integrations.paymentGateway.provider === 'none') {
    throw ApiError.badRequest('Payment gateway not configured');
  }

  const result = await PaymentService.testPaymentConfig(integrations.paymentGateway);

  // Update test result
  integrations.paymentGateway.lastTested = new Date();
  integrations.paymentGateway.testResult = {
    success: result.success,
    message: result.message,
  };
  await integrations.save();

  if (result.success) {
    ApiResponse.success(res, result, 'Payment integration test successful');
  } else {
    throw ApiError.badRequest(result.message);
  }
});

/**
 * @desc    Test storage integration
 * @route   POST /api/integrations/test-storage
 * @access  Private (SuperAdmin)
 */
const testStorageIntegration = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations()
    .select('+cloudStorageProvider.config.apiKey +cloudStorageProvider.config.apiSecret');

  if (integrations.cloudStorageProvider.provider === 'none') {
    throw ApiError.badRequest('Storage provider not configured');
  }

  const result = await StorageService.testStorageConfig(integrations.cloudStorageProvider);

  // Update test result
  integrations.cloudStorageProvider.lastTested = new Date();
  integrations.cloudStorageProvider.testResult = {
    success: result.success,
    message: result.message,
  };
  await integrations.save();

  if (result.success) {
    ApiResponse.success(res, result, 'Storage integration test successful');
  } else {
    throw ApiError.badRequest(result.message);
  }
});

/**
 * @desc    Get webhook URLs
 * @route   GET /api/integrations/webhooks
 * @access  Private (SuperAdmin)
 */
const getWebhooks = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  ApiResponse.success(res, integrations.webhookUrls, 'Webhook URLs retrieved successfully');
});

/**
 * @desc    Update webhook URLs
 * @route   PUT /api/integrations/webhooks
 * @access  Private (SuperAdmin)
 */
const updateWebhooks = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  integrations.webhookUrls = { ...integrations.webhookUrls, ...req.body };

  integrations.lastModifiedBy = {
    userId: req.user._id,
    userName: req.user.fullName,
    modifiedAt: new Date(),
  };

  await integrations.save();

  ApiResponse.success(res, integrations.webhookUrls, 'Webhook URLs updated successfully');
});

/**
 * @desc    Get API keys
 * @route   GET /api/integrations/api-keys
 * @access  Private (SuperAdmin)
 */
const getAPIKeys = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  ApiResponse.success(res, integrations.apiKeys, 'API keys retrieved successfully');
});

/**
 * @desc    Update API keys
 * @route   PUT /api/integrations/api-keys
 * @access  Private (SuperAdmin)
 */
const updateAPIKeys = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  integrations.apiKeys = { ...integrations.apiKeys, ...req.body };

  integrations.lastModifiedBy = {
    userId: req.user._id,
    userName: req.user.fullName,
    modifiedAt: new Date(),
  };

  await integrations.save();

  ApiResponse.success(res, integrations.apiKeys, 'API keys updated successfully');
});

/**
 * @desc    Get public integration settings (for frontend)
 * @route   GET /api/integrations/public
 * @access  Public
 */
const getPublicIntegrations = asyncHandler(async (req, res) => {
  const integrations = await IntegrationSettings.getIntegrations();

  const publicIntegrations = integrations.getPublicIntegrations();

  ApiResponse.success(res, publicIntegrations, 'Public integration settings retrieved successfully');
});

module.exports = {
  getIntegrations,
  updateIntegrations,
  getPaymentSettings,
  updatePaymentSettings,
  getEmailSettings,
  updateEmailSettings,
  getSMSSettings,
  updateSMSSettings,
  getStorageSettings,
  updateStorageSettings,
  testEmailIntegration,
  testSMSIntegration,
  testPaymentIntegration,
  testStorageIntegration,
  getWebhooks,
  updateWebhooks,
  getAPIKeys,
  updateAPIKeys,
  getPublicIntegrations,
};
