const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const superadminDashboardController = require('../controllers/superadminDashboardController');
const superadminUserController = require('../controllers/superadminUserController');
const superadminBranchController = require('../controllers/superadminBranchController');
const superadminBillingController = require('../controllers/superadminBillingController');
const superadminRevenueController = require('../controllers/superadminRevenueController');
const superadminTransactionController = require('../controllers/superadminTransactionController');
const superadminPlansController = require('../controllers/superadminPlansController');
const superadminReportsController = require('../controllers/superadminReportsController');
const superadminAnalyticsController = require('../controllers/superadminAnalyticsController');
const superadminNotificationsController = require('../controllers/superadminNotificationsController');
const superadminCampaignsController = require('../controllers/superadminCampaignsController');
const superadminCommunicationController = require('../controllers/superadminCommunicationController');
const superadminEquipmentController = require('../controllers/superadminEquipmentController');
const superadminVendorsController = require('../controllers/superadminVendorsController');
const superadminMaintenanceController = require('../controllers/superadminMaintenanceController');
const superadminIntegrationController = require('../controllers/superadminIntegrationController');
const superadminDataController = require('../controllers/superadminDataController');
const superadminBackupsController = require('../controllers/superadminBackupsController');
const superadminAdvancedController = require('../controllers/superadminAdvancedController');
const superadminSecurityController = require('../controllers/superadminSecurityController');
const superadminSettingsController = require('../controllers/superadminSettingsController');
const superadminSupportController = require('../controllers/superadminSupportController');
const superadminContentController = require('../controllers/superadminContentController');

const router = express.Router();

// Middleware: Protect all routes and ensure SuperAdmin role
router.use(protect);
router.use(authorize('superadmin'));

// ==================== Dashboard Routes ====================
/**
 * @route   GET /api/superadmin/dashboard/overview
 * @desc    Get dashboard overview statistics
 * @access  Private (SuperAdmin)
 */
router.get('/dashboard/overview', superadminDashboardController.getDashboardOverview);

// ==================== User Management Routes ====================
/**
 * @route   GET /api/superadmin/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (SuperAdmin)
 */
router.get('/users', superadminUserController.getUsers);

/**
 * @route   POST /api/superadmin/users
 * @desc    Create a new user
 * @access  Private (SuperAdmin)
 */
router.post('/users', superadminUserController.createUser);

/**
 * @route   GET /api/superadmin/users/:userId
 * @desc    Get user by ID
 * @access  Private (SuperAdmin)
 */
router.get('/users/:userId', superadminUserController.getUserById);

/**
 * @route   PUT /api/superadmin/users/:userId
 * @desc    Update user
 * @access  Private (SuperAdmin)
 */
router.put('/users/:userId', superadminUserController.updateUser);

/**
 * @route   DELETE /api/superadmin/users/:userId
 * @desc    Delete user
 * @access  Private (SuperAdmin)
 */
router.delete('/users/:userId', superadminUserController.deleteUser);

/**
 * @route   POST /api/superadmin/users/:userId/suspend
 * @desc    Suspend user
 * @access  Private (SuperAdmin)
 */
router.post('/users/:userId/suspend', superadminUserController.suspendUser);

/**
 * @route   POST /api/superadmin/users/:userId/reactivate
 * @desc    Reactivate user
 * @access  Private (SuperAdmin)
 */
router.post('/users/:userId/reactivate', superadminUserController.reactivateUser);

/**
 * @route   POST /api/superadmin/users/:userId/reset-password
 * @desc    Reset user password
 * @access  Private (SuperAdmin)
 */
router.post('/users/:userId/reset-password', superadminUserController.resetPassword);

/**
 * @route   GET /api/superadmin/users/:userId/activity
 * @desc    Get user activity
 * @access  Private (SuperAdmin)
 */
router.get('/users/:userId/activity', superadminUserController.getUserActivity);

/**
 * @route   POST /api/superadmin/users/bulk-import
 * @desc    Bulk import users
 * @access  Private (SuperAdmin)
 */
router.post('/users/bulk-import', superadminUserController.bulkImportUsers);

/**
 * @route   GET /api/superadmin/users/export
 * @desc    Export users
 * @access  Private (SuperAdmin)
 */
router.get('/users/export', superadminUserController.exportUsers);

// ==================== Branch Management Routes ====================
/**
 * @route   GET /api/superadmin/branches
 * @desc    Get all branches with pagination and filtering
 * @access  Private (SuperAdmin)
 */
router.get('/branches', superadminBranchController.getBranches);

/**
 * @route   POST /api/superadmin/branches
 * @desc    Create a new branch
 * @access  Private (SuperAdmin)
 */
router.post('/branches', superadminBranchController.createBranch);

/**
 * @route   GET /api/superadmin/branches/compare
 * @desc    Compare branches performance
 * @access  Private (SuperAdmin)
 */
router.get('/branches/compare', superadminBranchController.compareBranches);

/**
 * @route   GET /api/superadmin/branches/:branchId
 * @desc    Get branch by ID
 * @access  Private (SuperAdmin)
 */
router.get('/branches/:branchId', superadminBranchController.getBranchById);

/**
 * @route   PUT /api/superadmin/branches/:branchId
 * @desc    Update branch
 * @access  Private (SuperAdmin)
 */
router.put('/branches/:branchId', superadminBranchController.updateBranch);

/**
 * @route   DELETE /api/superadmin/branches/:branchId
 * @desc    Delete branch
 * @access  Private (SuperAdmin)
 */
router.delete('/branches/:branchId', superadminBranchController.deleteBranch);

/**
 * @route   GET /api/superadmin/branches/:branchId/performance
 * @desc    Get branch performance statistics
 * @access  Private (SuperAdmin)
 */
router.get('/branches/:branchId/performance', superadminBranchController.getBranchPerformance);

// ==================== Billing Management Routes ====================
/**
 * @route   GET /api/superadmin/billing
 * @desc    Get all billing records with pagination and filtering
 * @access  Private (SuperAdmin)
 */
router.get('/billing', superadminBillingController.getBillingRecords);

/**
 * @route   POST /api/superadmin/billing
 * @desc    Create a new billing record
 * @access  Private (SuperAdmin)
 */
router.post('/billing', superadminBillingController.createBillingRecord);

/**
 * @route   GET /api/superadmin/billing/summary
 * @desc    Get billing summary
 * @access  Private (SuperAdmin)
 */
router.get('/billing/summary', superadminBillingController.getBillingSummary);

/**
 * @route   GET /api/superadmin/billing/:billingId
 * @desc    Get billing record by ID
 * @access  Private (SuperAdmin)
 */
router.get('/billing/:billingId', superadminBillingController.getBillingRecordById);

/**
 * @route   PUT /api/superadmin/billing/:billingId
 * @desc    Update billing record
 * @access  Private (SuperAdmin)
 */
router.put('/billing/:billingId', superadminBillingController.updateBillingRecord);

/**
 * @route   DELETE /api/superadmin/billing/:billingId
 * @desc    Delete billing record
 * @access  Private (SuperAdmin)
 */
router.delete('/billing/:billingId', superadminBillingController.deleteBillingRecord);

/**
 * @route   PUT /api/superadmin/billing/:billingId/mark-paid
 * @desc    Mark billing record as paid
 * @access  Private (SuperAdmin)
 */
router.put('/billing/:billingId/mark-paid', superadminBillingController.markBillingAsPaid);

// ==================== Revenue Management Routes ====================
/**
 * @route   GET /api/superadmin/revenue
 * @desc    Get revenue data with filtering
 * @access  Private (SuperAdmin)
 */
router.get('/revenue', superadminRevenueController.getRevenue);

/**
 * @route   GET /api/superadmin/revenue/summary
 * @desc    Get revenue summary
 * @access  Private (SuperAdmin)
 */
router.get('/revenue/summary', superadminRevenueController.getRevenueSummary);

/**
 * @route   GET /api/superadmin/revenue/compare
 * @desc    Compare revenue between branches
 * @access  Private (SuperAdmin)
 */
router.get('/revenue/compare', superadminRevenueController.compareRevenue);

/**
 * @route   GET /api/superadmin/revenue/trends
 * @desc    Get revenue trends
 * @access  Private (SuperAdmin)
 */
router.get('/revenue/trends', superadminRevenueController.getRevenueTrends);

// ==================== Transaction Management Routes ====================
/**
 * @route   GET /api/superadmin/transactions
 * @desc    Get all transactions with pagination and filtering
 * @access  Private (SuperAdmin)
 */
router.get('/transactions', superadminTransactionController.getTransactions);

/**
 * @route   GET /api/superadmin/transactions/search
 * @desc    Search transactions
 * @access  Private (SuperAdmin)
 */
router.get('/transactions/search', superadminTransactionController.searchTransactions);

/**
 * @route   GET /api/superadmin/transactions/stats
 * @desc    Get transaction statistics
 * @access  Private (SuperAdmin)
 */
router.get('/transactions/stats', superadminTransactionController.getTransactionStats);

/**
 * @route   GET /api/superadmin/transactions/export
 * @desc    Export transactions
 * @access  Private (SuperAdmin)
 */
router.get('/transactions/export', superadminTransactionController.exportTransactions);

/**
 * @route   GET /api/superadmin/transactions/:transactionId
 * @desc    Get transaction by ID
 * @access  Private (SuperAdmin)
 */
router.get('/transactions/:transactionId', superadminTransactionController.getTransactionById);

// ==================== Plans & Pricing Routes ====================
/**
 * @route   GET /api/superadmin/plans
 * @desc    Get all membership plans with pagination and filtering
 * @access  Private (SuperAdmin)
 */
router.get('/plans', superadminPlansController.getPlans);

/**
 * @route   POST /api/superadmin/plans
 * @desc    Create a new membership plan
 * @access  Private (SuperAdmin)
 */
router.post('/plans', superadminPlansController.createPlan);

/**
 * @route   GET /api/superadmin/plans/stats
 * @desc    Get plan statistics
 * @access  Private (SuperAdmin)
 */
router.get('/plans/stats', superadminPlansController.getPlanStats);

/**
 * @route   GET /api/superadmin/plans/compare
 * @desc    Compare plans
 * @access  Private (SuperAdmin)
 */
router.get('/plans/compare', superadminPlansController.comparePlans);

/**
 * @route   GET /api/superadmin/plans/:planId
 * @desc    Get plan by ID
 * @access  Private (SuperAdmin)
 */
router.get('/plans/:planId', superadminPlansController.getPlanById);

/**
 * @route   PUT /api/superadmin/plans/:planId
 * @desc    Update plan
 * @access  Private (SuperAdmin)
 */
router.put('/plans/:planId', superadminPlansController.updatePlan);

/**
 * @route   DELETE /api/superadmin/plans/:planId
 * @desc    Delete plan
 * @access  Private (SuperAdmin)
 */
router.delete('/plans/:planId', superadminPlansController.deletePlan);

// ==================== Reports Routes ====================
/**
 * @route   GET /api/superadmin/reports
 * @desc    Get all reports
 * @access  Private (SuperAdmin)
 */
router.get('/reports', superadminReportsController.getReports);

/**
 * @route   POST /api/superadmin/reports/generate
 * @desc    Generate a new report
 * @access  Private (SuperAdmin)
 */
router.post('/reports/generate', superadminReportsController.generateReport);

/**
 * @route   GET /api/superadmin/reports/:reportId
 * @desc    Get report by ID
 * @access  Private (SuperAdmin)
 */
router.get('/reports/:reportId', superadminReportsController.getReportById);

/**
 * @route   GET /api/superadmin/reports/:reportId/export
 * @desc    Export report
 * @access  Private (SuperAdmin)
 */
router.get('/reports/:reportId/export', superadminReportsController.exportReport);

/**
 * @route   DELETE /api/superadmin/reports/:reportId
 * @desc    Delete report
 * @access  Private (SuperAdmin)
 */
router.delete('/reports/:reportId', superadminReportsController.deleteReport);

// ==================== Analytics Routes ====================
/**
 * @route   GET /api/superadmin/analytics/members
 * @desc    Get member analytics
 * @access  Private (SuperAdmin)
 */
router.get('/analytics/members', superadminAnalyticsController.getMemberAnalytics);

/**
 * @route   GET /api/superadmin/analytics/financial
 * @desc    Get financial analytics
 * @access  Private (SuperAdmin)
 */
router.get('/analytics/financial', superadminAnalyticsController.getFinancialAnalytics);

/**
 * @route   GET /api/superadmin/analytics/member-growth
 * @desc    Get member growth analytics
 * @access  Private (SuperAdmin)
 */
router.get('/analytics/member-growth', superadminAnalyticsController.getMemberGrowth);

/**
 * @route   GET /api/superadmin/analytics/branch-comparison
 * @desc    Get branch comparison analytics
 * @access  Private (SuperAdmin)
 */
router.get('/analytics/branch-comparison', superadminAnalyticsController.getBranchComparison);

// ==================== Notifications Routes ====================
/**
 * @route   GET /api/superadmin/notifications
 * @desc    Get all notifications
 * @access  Private (SuperAdmin)
 */
router.get('/notifications', superadminNotificationsController.getNotifications);

/**
 * @route   POST /api/superadmin/notifications
 * @desc    Create a new notification
 * @access  Private (SuperAdmin)
 */
router.post('/notifications', superadminNotificationsController.createNotification);

/**
 * @route   POST /api/superadmin/notifications/bulk-send
 * @desc    Send bulk notifications
 * @access  Private (SuperAdmin)
 */
router.post('/notifications/bulk-send', superadminNotificationsController.sendBulkNotifications);

/**
 * @route   GET /api/superadmin/notifications/stats
 * @desc    Get notification statistics
 * @access  Private (SuperAdmin)
 */
router.get('/notifications/stats', superadminNotificationsController.getNotificationStats);

/**
 * @route   GET /api/superadmin/notifications/:notificationId
 * @desc    Get notification by ID
 * @access  Private (SuperAdmin)
 */
router.get('/notifications/:notificationId', superadminNotificationsController.getNotificationById);

/**
 * @route   PUT /api/superadmin/notifications/:notificationId
 * @desc    Update notification
 * @access  Private (SuperAdmin)
 */
router.put('/notifications/:notificationId', superadminNotificationsController.updateNotification);

/**
 * @route   DELETE /api/superadmin/notifications/:notificationId
 * @desc    Delete notification
 * @access  Private (SuperAdmin)
 */
router.delete('/notifications/:notificationId', superadminNotificationsController.deleteNotification);

// ==================== Campaigns Routes ====================
/**
 * @route   GET /api/superadmin/campaigns
 * @desc    Get all campaigns
 * @access  Private (SuperAdmin)
 */
router.get('/campaigns', superadminCampaignsController.getCampaigns);

/**
 * @route   POST /api/superadmin/campaigns
 * @desc    Create a new campaign
 * @access  Private (SuperAdmin)
 */
router.post('/campaigns', superadminCampaignsController.createCampaign);

/**
 * @route   GET /api/superadmin/campaigns/:campaignId
 * @desc    Get campaign by ID
 * @access  Private (SuperAdmin)
 */
router.get('/campaigns/:campaignId', superadminCampaignsController.getCampaignById);

/**
 * @route   PUT /api/superadmin/campaigns/:campaignId
 * @desc    Update campaign
 * @access  Private (SuperAdmin)
 */
router.put('/campaigns/:campaignId', superadminCampaignsController.updateCampaign);

/**
 * @route   DELETE /api/superadmin/campaigns/:campaignId
 * @desc    Delete campaign
 * @access  Private (SuperAdmin)
 */
router.delete('/campaigns/:campaignId', superadminCampaignsController.deleteCampaign);

// ==================== Communication Routes ====================
/**
 * @route   GET /api/superadmin/communication
 * @desc    Get all messages
 * @access  Private (SuperAdmin)
 */
router.get('/communication', superadminCommunicationController.getMessages);

/**
 * @route   POST /api/superadmin/communication/send
 * @desc    Send a message
 * @access  Private (SuperAdmin)
 */
router.post('/communication/send', superadminCommunicationController.sendMessage);

/**
 * @route   GET /api/superadmin/communication/history
 * @desc    Get message history
 * @access  Private (SuperAdmin)
 */
router.get('/communication/history', superadminCommunicationController.getMessageHistory);

/**
 * @route   GET /api/superadmin/communication/stats
 * @desc    Get communication statistics
 * @access  Private (SuperAdmin)
 */
router.get('/communication/stats', superadminCommunicationController.getCommunicationStats);

/**
 * @route   DELETE /api/superadmin/communication/:messageId
 * @desc    Delete message
 * @access  Private (SuperAdmin)
 */
router.delete('/communication/:messageId', superadminCommunicationController.deleteMessage);

// ==================== Equipment Routes ====================
/**
 * @route   GET /api/superadmin/equipment
 * @desc    Get all equipment
 * @access  Private (SuperAdmin)
 */
router.get('/equipment', superadminEquipmentController.getEquipment);

/**
 * @route   POST /api/superadmin/equipment
 * @desc    Create new equipment
 * @access  Private (SuperAdmin)
 */
router.post('/equipment', superadminEquipmentController.createEquipment);

/**
 * @route   GET /api/superadmin/equipment/:equipmentId
 * @desc    Get equipment by ID
 * @access  Private (SuperAdmin)
 */
router.get('/equipment/:equipmentId', superadminEquipmentController.getEquipmentById);

/**
 * @route   PUT /api/superadmin/equipment/:equipmentId
 * @desc    Update equipment
 * @access  Private (SuperAdmin)
 */
router.put('/equipment/:equipmentId', superadminEquipmentController.updateEquipment);

/**
 * @route   DELETE /api/superadmin/equipment/:equipmentId
 * @desc    Delete equipment
 * @access  Private (SuperAdmin)
 */
router.delete('/equipment/:equipmentId', superadminEquipmentController.deleteEquipment);

// ==================== Vendors Routes ====================
/**
 * @route   GET /api/superadmin/vendors
 * @desc    Get all vendors
 * @access  Private (SuperAdmin)
 */
router.get('/vendors', superadminVendorsController.getVendors);

/**
 * @route   POST /api/superadmin/vendors
 * @desc    Create new vendor
 * @access  Private (SuperAdmin)
 */
router.post('/vendors', superadminVendorsController.createVendor);

/**
 * @route   GET /api/superadmin/vendors/:vendorId
 * @desc    Get vendor by ID
 * @access  Private (SuperAdmin)
 */
router.get('/vendors/:vendorId', superadminVendorsController.getVendorById);

/**
 * @route   PUT /api/superadmin/vendors/:vendorId
 * @desc    Update vendor
 * @access  Private (SuperAdmin)
 */
router.put('/vendors/:vendorId', superadminVendorsController.updateVendor);

/**
 * @route   DELETE /api/superadmin/vendors/:vendorId
 * @desc    Delete vendor
 * @access  Private (SuperAdmin)
 */
router.delete('/vendors/:vendorId', superadminVendorsController.deleteVendor);

// ==================== Maintenance Routes ====================
/**
 * @route   GET /api/superadmin/maintenance
 * @desc    Get all maintenance records
 * @access  Private (SuperAdmin)
 */
router.get('/maintenance', superadminMaintenanceController.getMaintenanceRecords);

/**
 * @route   POST /api/superadmin/maintenance
 * @desc    Create new maintenance record
 * @access  Private (SuperAdmin)
 */
router.post('/maintenance', superadminMaintenanceController.createMaintenanceRecord);

/**
 * @route   GET /api/superadmin/maintenance/stats
 * @desc    Get maintenance statistics
 * @access  Private (SuperAdmin)
 */
router.get('/maintenance/stats', superadminMaintenanceController.getMaintenanceStats);

/**
 * @route   GET /api/superadmin/maintenance/:recordId
 * @desc    Get maintenance record by ID
 * @access  Private (SuperAdmin)
 */
router.get('/maintenance/:recordId', superadminMaintenanceController.getMaintenanceRecordById);

/**
 * @route   PUT /api/superadmin/maintenance/:recordId
 * @desc    Update maintenance record
 * @access  Private (SuperAdmin)
 */
router.put('/maintenance/:recordId', superadminMaintenanceController.updateMaintenanceRecord);

/**
 * @route   PUT /api/superadmin/maintenance/:recordId/complete
 * @desc    Complete maintenance record
 * @access  Private (SuperAdmin)
 */
router.put('/maintenance/:recordId/complete', superadminMaintenanceController.completeMaintenanceRecord);

/**
 * @route   DELETE /api/superadmin/maintenance/:recordId
 * @desc    Delete maintenance record
 * @access  Private (SuperAdmin)
 */
router.delete('/maintenance/:recordId', superadminMaintenanceController.deleteMaintenanceRecord);

// ==================== Integrations Routes ====================
/**
 * @route   GET /api/superadmin/integrations/api-settings
 * @desc    Get API settings
 * @access  Private (SuperAdmin)
 */
router.get('/integrations/api-settings', superadminIntegrationController.getApiSettings);

/**
 * @route   PUT /api/superadmin/integrations/api-settings
 * @desc    Update API settings
 * @access  Private (SuperAdmin)
 */
router.put('/integrations/api-settings', superadminIntegrationController.updateApiSettings);

/**
 * @route   POST /api/superadmin/integrations/api-keys/generate
 * @desc    Generate API key
 * @access  Private (SuperAdmin)
 */
router.post('/integrations/api-keys/generate', superadminIntegrationController.generateApiKey);

/**
 * @route   GET /api/superadmin/integrations/apps
 * @desc    Get all third-party apps
 * @access  Private (SuperAdmin)
 */
router.get('/integrations/apps', superadminIntegrationController.getThirdPartyApps);

/**
 * @route   POST /api/superadmin/integrations/apps
 * @desc    Install third-party app
 * @access  Private (SuperAdmin)
 */
router.post('/integrations/apps', superadminIntegrationController.installApp);

/**
 * @route   PUT /api/superadmin/integrations/apps/:appId/config
 * @desc    Update app configuration
 * @access  Private (SuperAdmin)
 */
router.put('/integrations/apps/:appId/config', superadminIntegrationController.updateAppConfig);

/**
 * @route   DELETE /api/superadmin/integrations/apps/:appId
 * @desc    Uninstall app
 * @access  Private (SuperAdmin)
 */
router.delete('/integrations/apps/:appId', superadminIntegrationController.uninstallApp);

// ==================== Data Management Routes ====================
/**
 * @route   POST /api/superadmin/data/import
 * @desc    Import data
 * @access  Private (SuperAdmin)
 */
router.post('/data/import', superadminDataController.importData);

/**
 * @route   GET /api/superadmin/data/import-status/:jobId
 * @desc    Get import status
 * @access  Private (SuperAdmin)
 */
router.get('/data/import-status/:jobId', superadminDataController.getImportStatus);

/**
 * @route   POST /api/superadmin/data/export
 * @desc    Export data
 * @access  Private (SuperAdmin)
 */
router.post('/data/export', superadminDataController.exportData);

/**
 * @route   GET /api/superadmin/data/export-status/:jobId
 * @desc    Get export status
 * @access  Private (SuperAdmin)
 */
router.get('/data/export-status/:jobId', superadminDataController.getExportStatus);

// ==================== Backups Routes ====================
/**
 * @route   GET /api/superadmin/backups
 * @desc    Get all backups
 * @access  Private (SuperAdmin)
 */
router.get('/backups', superadminBackupsController.getBackups);

/**
 * @route   POST /api/superadmin/backups/create
 * @desc    Create a new backup
 * @access  Private (SuperAdmin)
 */
router.post('/backups/create', superadminBackupsController.createBackup);

/**
 * @route   GET /api/superadmin/backups/stats
 * @desc    Get backup statistics
 * @access  Private (SuperAdmin)
 */
router.get('/backups/stats', superadminBackupsController.getBackupStats);

/**
 * @route   GET /api/superadmin/backups/:backupId
 * @desc    Get backup by ID
 * @access  Private (SuperAdmin)
 */
router.get('/backups/:backupId', superadminBackupsController.getBackupById);

/**
 * @route   POST /api/superadmin/backups/:backupId/restore
 * @desc    Restore backup
 * @access  Private (SuperAdmin)
 */
router.post('/backups/:backupId/restore', superadminBackupsController.restoreBackup);

/**
 * @route   DELETE /api/superadmin/backups/:backupId
 * @desc    Delete backup
 * @access  Private (SuperAdmin)
 */
router.delete('/backups/:backupId', superadminBackupsController.deleteBackup);

// ==================== Advanced Features Routes ====================
/**
 * @route   GET /api/superadmin/advanced/ai-insights
 * @desc    Get AI insights
 * @access  Private (SuperAdmin)
 */
router.get('/advanced/ai-insights', superadminAdvancedController.getAiInsights);

/**
 * @route   POST /api/superadmin/advanced/ai-insights/generate
 * @desc    Generate AI insight
 * @access  Private (SuperAdmin)
 */
router.post('/advanced/ai-insights/generate', superadminAdvancedController.generateAiInsight);

/**
 * @route   GET /api/superadmin/advanced/feature-flags
 * @desc    Get feature flags
 * @access  Private (SuperAdmin)
 */
router.get('/advanced/feature-flags', superadminAdvancedController.getFeatureFlags);

/**
 * @route   POST /api/superadmin/advanced/feature-flags
 * @desc    Create feature flag
 * @access  Private (SuperAdmin)
 */
router.post('/advanced/feature-flags', superadminAdvancedController.createFeatureFlag);

/**
 * @route   PUT /api/superadmin/advanced/feature-flags/:flagId
 * @desc    Update feature flag
 * @access  Private (SuperAdmin)
 */
router.put('/advanced/feature-flags/:flagId', superadminAdvancedController.updateFeatureFlag);

/**
 * @route   GET /api/superadmin/advanced/monitoring
 * @desc    Get live monitoring data
 * @access  Private (SuperAdmin)
 */
router.get('/advanced/monitoring', superadminAdvancedController.getLiveMonitoring);

/**
 * @route   GET /api/superadmin/advanced/monitoring/details
 * @desc    Get detailed monitoring information
 * @access  Private (SuperAdmin)
 */
router.get('/advanced/monitoring/details', superadminAdvancedController.getMonitoringDetails);

// ==================== Security Routes ====================
/**
 * @route   GET /api/superadmin/security/audit-logs
 * @desc    Get audit logs
 * @access  Private (SuperAdmin)
 */
router.get('/security/audit-logs', superadminSecurityController.getAuditLogs);

/**
 * @route   GET /api/superadmin/security/audit-logs/:logId
 * @desc    Get audit log by ID
 * @access  Private (SuperAdmin)
 */
router.get('/security/audit-logs/:logId', superadminSecurityController.getAuditLogById);

/**
 * @route   GET /api/superadmin/security/login-history
 * @desc    Get login history
 * @access  Private (SuperAdmin)
 */
router.get('/security/login-history', superadminSecurityController.getLoginHistory);

/**
 * @route   GET /api/superadmin/security/system-logs
 * @desc    Get system logs
 * @access  Private (SuperAdmin)
 */
router.get('/security/system-logs', superadminSecurityController.getSystemLogs);

/**
 * @route   GET /api/superadmin/security/stats
 * @desc    Get security statistics
 * @access  Private (SuperAdmin)
 */
router.get('/security/stats', superadminSecurityController.getSecurityStats);

// ==================== Settings Routes ====================
/**
 * @route   GET /api/superadmin/settings/general
 * @desc    Get general settings
 * @access  Private (SuperAdmin)
 */
router.get('/settings/general', superadminSettingsController.getGeneralSettings);

/**
 * @route   PUT /api/superadmin/settings/general
 * @desc    Update general settings
 * @access  Private (SuperAdmin)
 */
router.put('/settings/general', superadminSettingsController.updateGeneralSettings);

/**
 * @route   GET /api/superadmin/settings/notifications
 * @desc    Get notification settings
 * @access  Private (SuperAdmin)
 */
router.get('/settings/notifications', superadminSettingsController.getNotificationSettings);

/**
 * @route   PUT /api/superadmin/settings/notifications
 * @desc    Update notification settings
 * @access  Private (SuperAdmin)
 */
router.put('/settings/notifications', superadminSettingsController.updateNotificationSettings);

/**
 * @route   GET /api/superadmin/settings/system-config
 * @desc    Get system configuration
 * @access  Private (SuperAdmin)
 */
router.get('/settings/system-config', superadminSettingsController.getSystemConfig);

/**
 * @route   PUT /api/superadmin/settings/system-config
 * @desc    Update system configuration
 * @access  Private (SuperAdmin)
 */
router.put('/settings/system-config', superadminSettingsController.updateSystemConfig);

// ==================== Support Routes ====================
/**
 * @route   GET /api/superadmin/support/tickets
 * @desc    Get all support tickets
 * @access  Private (SuperAdmin)
 */
router.get('/support/tickets', superadminSupportController.getTickets);

/**
 * @route   POST /api/superadmin/support/tickets
 * @desc    Create support ticket
 * @access  Private (SuperAdmin)
 */
router.post('/support/tickets', superadminSupportController.createTicket);

/**
 * @route   GET /api/superadmin/support/tickets/:ticketId
 * @desc    Get ticket by ID
 * @access  Private (SuperAdmin)
 */
router.get('/support/tickets/:ticketId', superadminSupportController.getTicketById);

/**
 * @route   PUT /api/superadmin/support/tickets/:ticketId
 * @desc    Update ticket
 * @access  Private (SuperAdmin)
 */
router.put('/support/tickets/:ticketId', superadminSupportController.updateTicket);

/**
 * @route   PUT /api/superadmin/support/tickets/:ticketId/close
 * @desc    Close ticket
 * @access  Private (SuperAdmin)
 */
router.put('/support/tickets/:ticketId/close', superadminSupportController.closeTicket);

/**
 * @route   GET /api/superadmin/support/feedback
 * @desc    Get feedback
 * @access  Private (SuperAdmin)
 */
router.get('/support/feedback', superadminSupportController.getFeedback);

/**
 * @route   PUT /api/superadmin/support/feedback/:feedbackId/mark-reviewed
 * @desc    Mark feedback as reviewed
 * @access  Private (SuperAdmin)
 */
router.put('/support/feedback/:feedbackId/mark-reviewed', superadminSupportController.markFeedbackReviewed);

/**
 * @route   DELETE /api/superadmin/support/feedback/:feedbackId
 * @desc    Delete feedback
 * @access  Private (SuperAdmin)
 */
router.delete('/support/feedback/:feedbackId', superadminSupportController.deleteFeedback);

// ==================== Content Management Routes ====================
/**
 * @route   GET /api/superadmin/content
 * @desc    Get all content
 * @access  Private (SuperAdmin)
 */
router.get('/content', superadminContentController.getContent);

/**
 * @route   POST /api/superadmin/content
 * @desc    Create new content
 * @access  Private (SuperAdmin)
 */
router.post('/content', superadminContentController.createContent);

/**
 * @route   GET /api/superadmin/content/:contentId
 * @desc    Get content by ID
 * @access  Private (SuperAdmin)
 */
router.get('/content/:contentId', superadminContentController.getContentById);

/**
 * @route   PUT /api/superadmin/content/:contentId
 * @desc    Update content
 * @access  Private (SuperAdmin)
 */
router.put('/content/:contentId', superadminContentController.updateContent);

/**
 * @route   PUT /api/superadmin/content/:contentId/publish
 * @desc    Publish content
 * @access  Private (SuperAdmin)
 */
router.put('/content/:contentId/publish', superadminContentController.publishContent);

/**
 * @route   DELETE /api/superadmin/content/:contentId
 * @desc    Delete content
 * @access  Private (SuperAdmin)
 */
router.delete('/content/:contentId', superadminContentController.deleteContent);

module.exports = router;
