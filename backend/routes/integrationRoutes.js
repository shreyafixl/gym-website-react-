const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/integrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

/**
 * Integration Routes
 * Most routes require SuperAdmin authentication
 * Public route available for frontend integration info
 */

// Public integrations route (no auth required)
router.get('/public', getPublicIntegrations);

// Payment gateway routes
router
  .route('/payment')
  .get(protect, authorize('superadmin'), getPaymentSettings)
  .put(protect, authorize('superadmin'), updatePaymentSettings);

// Email provider routes
router
  .route('/email')
  .get(protect, authorize('superadmin'), getEmailSettings)
  .put(protect, authorize('superadmin'), updateEmailSettings);

// SMS provider routes
router
  .route('/sms')
  .get(protect, authorize('superadmin'), getSMSSettings)
  .put(protect, authorize('superadmin'), updateSMSSettings);

// Storage provider routes
router
  .route('/storage')
  .get(protect, authorize('superadmin'), getStorageSettings)
  .put(protect, authorize('superadmin'), updateStorageSettings);

// Webhook routes
router
  .route('/webhooks')
  .get(protect, authorize('superadmin'), getWebhooks)
  .put(protect, authorize('superadmin'), updateWebhooks);

// API keys routes
router
  .route('/api-keys')
  .get(protect, authorize('superadmin'), getAPIKeys)
  .put(protect, authorize('superadmin'), updateAPIKeys);

// Test integration routes
router.post(
  '/test-email',
  protect,
  authorize('superadmin'),
  testEmailIntegration
);

router.post(
  '/test-sms',
  protect,
  authorize('superadmin'),
  testSMSIntegration
);

router.post(
  '/test-payment',
  protect,
  authorize('superadmin'),
  testPaymentIntegration
);

router.post(
  '/test-storage',
  protect,
  authorize('superadmin'),
  testStorageIntegration
);

// Main integration routes (must be last to avoid conflicts)
router
  .route('/')
  .get(protect, authorize('superadmin'), getIntegrations)
  .put(protect, authorize('superadmin'), updateIntegrations);

module.exports = router;
