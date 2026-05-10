const SystemSettings = require('../models/SystemSettings');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get general settings
 * @route   GET /api/superadmin/settings/general
 * @access  Private (SuperAdmin)
 */
const getGeneralSettings = asyncHandler(async (req, res) => {
  let settings = await SystemSettings.findOne({ type: 'general' });

  if (!settings) {
    settings = await SystemSettings.create({
      type: 'general',
      companyName: 'FitZone',
      companyEmail: 'info@fitzone.com',
      companyPhone: '1234567890',
      timezone: 'UTC',
      language: 'en',
    });
  }

  ApiResponse.success(
    res,
    { settings },
    'General settings retrieved successfully'
  );
});

/**
 * @desc    Update general settings
 * @route   PUT /api/superadmin/settings/general
 * @access  Private (SuperAdmin)
 */
const updateGeneralSettings = asyncHandler(async (req, res) => {
  const updateData = req.body;

  let settings = await SystemSettings.findOne({ type: 'general' });

  if (!settings) {
    settings = await SystemSettings.create({
      type: 'general',
      ...updateData,
    });
  } else {
    settings = await SystemSettings.findByIdAndUpdate(
      settings._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  ApiResponse.success(
    res,
    { settings },
    'General settings updated successfully'
  );
});

/**
 * @desc    Get notification settings
 * @route   GET /api/superadmin/settings/notifications
 * @access  Private (SuperAdmin)
 */
const getNotificationSettings = asyncHandler(async (req, res) => {
  let settings = await SystemSettings.findOne({ type: 'notifications' });

  if (!settings) {
    settings = await SystemSettings.create({
      type: 'notifications',
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      notificationFrequency: 'daily',
    });
  }

  ApiResponse.success(
    res,
    { settings },
    'Notification settings retrieved successfully'
  );
});

/**
 * @desc    Update notification settings
 * @route   PUT /api/superadmin/settings/notifications
 * @access  Private (SuperAdmin)
 */
const updateNotificationSettings = asyncHandler(async (req, res) => {
  const updateData = req.body;

  let settings = await SystemSettings.findOne({ type: 'notifications' });

  if (!settings) {
    settings = await SystemSettings.create({
      type: 'notifications',
      ...updateData,
    });
  } else {
    settings = await SystemSettings.findByIdAndUpdate(
      settings._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  ApiResponse.success(
    res,
    { settings },
    'Notification settings updated successfully'
  );
});

/**
 * @desc    Get system configuration
 * @route   GET /api/superadmin/settings/system-config
 * @access  Private (SuperAdmin)
 */
const getSystemConfig = asyncHandler(async (req, res) => {
  let settings = await SystemSettings.findOne({ type: 'system' });

  if (!settings) {
    settings = await SystemSettings.create({
      type: 'system',
      maintenanceMode: false,
      debugMode: false,
      maxUploadSize: 10485760,
      sessionTimeout: 3600,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
      },
    });
  }

  ApiResponse.success(
    res,
    { settings },
    'System configuration retrieved successfully'
  );
});

/**
 * @desc    Update system configuration
 * @route   PUT /api/superadmin/settings/system-config
 * @access  Private (SuperAdmin)
 */
const updateSystemConfig = asyncHandler(async (req, res) => {
  const updateData = req.body;

  let settings = await SystemSettings.findOne({ type: 'system' });

  if (!settings) {
    settings = await SystemSettings.create({
      type: 'system',
      ...updateData,
    });
  } else {
    settings = await SystemSettings.findByIdAndUpdate(
      settings._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  ApiResponse.success(
    res,
    { settings },
    'System configuration updated successfully'
  );
});

module.exports = {
  getGeneralSettings,
  updateGeneralSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getSystemConfig,
  updateSystemConfig,
};
