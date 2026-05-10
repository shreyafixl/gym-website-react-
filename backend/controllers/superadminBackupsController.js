const BackupLog = require('../models/BackupLog');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all backups with pagination
 * @route   GET /api/superadmin/backups
 * @access  Private (SuperAdmin)
 */
const getBackups = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

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
  const backups = await BackupLog.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await BackupLog.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      backups,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Backups retrieved successfully'
  );
});

/**
 * @desc    Create a new backup
 * @route   POST /api/superadmin/backups/create
 * @access  Private (SuperAdmin)
 */
const createBackup = asyncHandler(async (req, res) => {
  const { name, description, type = 'full' } = req.body;

  if (!name) {
    throw ApiError.badRequest('Backup name is required');
  }

  const backup = await BackupLog.create({
    name,
    description,
    type,
    status: 'in_progress',
    startedAt: new Date(),
    completedAt: null,
    size: 0,
    fileUrl: null,
  });

  ApiResponse.success(
    res,
    { backup },
    'Backup creation started successfully',
    201
  );
});

/**
 * @desc    Get backup by ID
 * @route   GET /api/superadmin/backups/:backupId
 * @access  Private (SuperAdmin)
 */
const getBackupById = asyncHandler(async (req, res) => {
  const { backupId } = req.params;

  const backup = await BackupLog.findById(backupId);

  if (!backup) {
    throw ApiError.notFound('Backup not found');
  }

  ApiResponse.success(
    res,
    { backup },
    'Backup retrieved successfully'
  );
});

/**
 * @desc    Restore backup
 * @route   POST /api/superadmin/backups/:backupId/restore
 * @access  Private (SuperAdmin)
 */
const restoreBackup = asyncHandler(async (req, res) => {
  const { backupId } = req.params;

  const backup = await BackupLog.findById(backupId);

  if (!backup) {
    throw ApiError.notFound('Backup not found');
  }

  if (backup.status !== 'completed') {
    throw ApiError.badRequest('Can only restore completed backups');
  }

  // Update backup status to restoring
  backup.status = 'restoring';
  backup.restoredAt = new Date();
  await backup.save();

  ApiResponse.success(
    res,
    { backup },
    'Backup restoration started successfully'
  );
});

/**
 * @desc    Delete backup
 * @route   DELETE /api/superadmin/backups/:backupId
 * @access  Private (SuperAdmin)
 */
const deleteBackup = asyncHandler(async (req, res) => {
  const { backupId } = req.params;

  const backup = await BackupLog.findById(backupId);

  if (!backup) {
    throw ApiError.notFound('Backup not found');
  }

  // Delete backup
  await BackupLog.findByIdAndDelete(backupId);

  ApiResponse.success(
    res,
    { backupId },
    'Backup deleted successfully'
  );
});

/**
 * @desc    Get backup statistics
 * @route   GET /api/superadmin/backups/stats
 * @access  Private (SuperAdmin)
 */
const getBackupStats = asyncHandler(async (req, res) => {
  const stats = await BackupLog.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const totalSize = await BackupLog.aggregate([
    {
      $group: {
        _id: null,
        totalSize: { $sum: '$size' },
      },
    },
  ]);

  const summary = {
    totalBackups: 0,
    byStatus: {},
    totalSize: 0,
  };

  stats.forEach(stat => {
    summary.totalBackups += stat.count;
    summary.byStatus[stat._id] = stat.count;
  });

  if (totalSize.length > 0) {
    summary.totalSize = totalSize[0].totalSize;
  }

  ApiResponse.success(
    res,
    summary,
    'Backup statistics retrieved successfully'
  );
});

module.exports = {
  getBackups,
  createBackup,
  getBackupById,
  restoreBackup,
  deleteBackup,
  getBackupStats,
};
