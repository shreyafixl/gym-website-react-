const express = require('express');
const router = express.Router();
const {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  updateBranchStatus,
  assignManager,
  assignAdmins,
  assignTrainers,
  updateFacilities,
  getBranchStats,
} = require('../controllers/branchController');
const { protectSuperAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * Branch Management Routes
 * Base path: /api/superadmin/branches
 * All routes require SuperAdmin authentication
 */

// Apply SuperAdmin authentication to all routes
router.use(protectSuperAdmin);

// Statistics route (must be before /:id to avoid conflict)
router.get('/stats', getBranchStats);

// Main CRUD routes
router.route('/')
  .get(getAllBranches)      // GET /api/superadmin/branches
  .post(createBranch);      // POST /api/superadmin/branches

router.route('/:id')
  .get(getBranchById)       // GET /api/superadmin/branches/:id
  .put(updateBranch)        // PUT /api/superadmin/branches/:id
  .delete(deleteBranch);    // DELETE /api/superadmin/branches/:id

// Branch status management
router.patch('/:id/status', updateBranchStatus);

// Staff assignment
router.patch('/:id/assign-manager', assignManager);
router.patch('/:id/assign-admins', assignAdmins);
router.patch('/:id/assign-trainers', assignTrainers);

// Facilities management
router.patch('/:id/facilities', updateFacilities);

module.exports = router;
