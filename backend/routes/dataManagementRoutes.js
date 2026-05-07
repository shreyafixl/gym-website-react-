const express = require('express');
const router = express.Router();
const {
  createBackup,
  getBackups,
  deleteBackup,
  exportData,
  importData,
  restoreBackup,
  getDataStats,
  cleanupOldBackups,
} = require('../controllers/dataManagementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

/**
 * Data Management Routes
 * All routes require SuperAdmin authentication
 */

// Statistics route
router.get(
  '/stats',
  protect,
  authorize('superadmin'),
  getDataStats
);

// Backup routes
router.post(
  '/backup',
  protect,
  authorize('superadmin'),
  createBackup
);

router.get(
  '/backups',
  protect,
  authorize('superadmin'),
  getBackups
);

router.delete(
  '/backups/:id',
  protect,
  authorize('superadmin'),
  deleteBackup
);

// Restore route
router.post(
  '/restore',
  protect,
  authorize('superadmin'),
  restoreBackup
);

// Export route
router.post(
  '/export',
  protect,
  authorize('superadmin'),
  exportData
);

// Import route
router.post(
  '/import',
  protect,
  authorize('superadmin'),
  importData
);

// Cleanup route
router.post(
  '/cleanup',
  protect,
  authorize('superadmin'),
  cleanupOldBackups
);

module.exports = router;
