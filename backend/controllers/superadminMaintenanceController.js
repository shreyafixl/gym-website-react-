const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all maintenance records with pagination
 * @route   GET /api/superadmin/maintenance
 * @access  Private (SuperAdmin)
 */
const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    status = '',
    equipment = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Mock maintenance data
  const mockRecords = [
    {
      _id: '1',
      equipment: 'Treadmill',
      equipmentId: 'eq1',
      type: 'preventive',
      status: 'completed',
      scheduledDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      completedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      description: 'Regular maintenance and inspection',
      cost: 150,
      technician: 'John Doe',
    },
    {
      _id: '2',
      equipment: 'Dumbbells',
      equipmentId: 'eq2',
      type: 'repair',
      status: 'pending',
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      completedDate: null,
      description: 'Handle replacement needed',
      cost: 75,
      technician: null,
    },
  ];

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  let filtered = mockRecords;
  if (status) {
    filtered = filtered.filter(r => r.status === status);
  }
  if (equipment) {
    filtered = filtered.filter(r => r.equipmentId === equipment);
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  const records = filtered.slice(skip, skip + limitNum);

  ApiResponse.success(
    res,
    {
      records,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Maintenance records retrieved successfully'
  );
});

/**
 * @desc    Create new maintenance record
 * @route   POST /api/superadmin/maintenance
 * @access  Private (SuperAdmin)
 */
const createMaintenanceRecord = asyncHandler(async (req, res) => {
  const {
    equipment,
    equipmentId,
    type,
    scheduledDate,
    description,
    estimatedCost,
  } = req.body;

  if (!equipment || !equipmentId || !type || !scheduledDate) {
    throw ApiError.badRequest('Please provide all required fields');
  }

  const record = {
    _id: Date.now().toString(),
    equipment,
    equipmentId,
    type,
    status: 'pending',
    scheduledDate: new Date(scheduledDate),
    completedDate: null,
    description,
    cost: estimatedCost || 0,
    technician: null,
    createdAt: new Date(),
  };

  ApiResponse.success(
    res,
    { record },
    'Maintenance record created successfully',
    201
  );
});

/**
 * @desc    Get maintenance record by ID
 * @route   GET /api/superadmin/maintenance/:recordId
 * @access  Private (SuperAdmin)
 */
const getMaintenanceRecordById = asyncHandler(async (req, res) => {
  const { recordId } = req.params;

  const record = {
    _id: recordId,
    equipment: 'Sample Equipment',
    equipmentId: 'eq1',
    type: 'preventive',
    status: 'completed',
    scheduledDate: new Date(),
    completedDate: new Date(),
    description: 'Regular maintenance',
    cost: 150,
    technician: 'John Doe',
  };

  ApiResponse.success(
    res,
    { record },
    'Maintenance record retrieved successfully'
  );
});

/**
 * @desc    Update maintenance record
 * @route   PUT /api/superadmin/maintenance/:recordId
 * @access  Private (SuperAdmin)
 */
const updateMaintenanceRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;
  const updateData = req.body;

  const record = {
    _id: recordId,
    ...updateData,
    updatedAt: new Date(),
  };

  ApiResponse.success(
    res,
    { record },
    'Maintenance record updated successfully'
  );
});

/**
 * @desc    Complete maintenance record
 * @route   PUT /api/superadmin/maintenance/:recordId/complete
 * @access  Private (SuperAdmin)
 */
const completeMaintenanceRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;
  const { actualCost, technician, notes } = req.body;

  const record = {
    _id: recordId,
    status: 'completed',
    completedDate: new Date(),
    cost: actualCost || 0,
    technician,
    notes,
    updatedAt: new Date(),
  };

  ApiResponse.success(
    res,
    { record },
    'Maintenance record completed successfully'
  );
});

/**
 * @desc    Delete maintenance record
 * @route   DELETE /api/superadmin/maintenance/:recordId
 * @access  Private (SuperAdmin)
 */
const deleteMaintenanceRecord = asyncHandler(async (req, res) => {
  const { recordId } = req.params;

  ApiResponse.success(
    res,
    { recordId },
    'Maintenance record deleted successfully'
  );
});

/**
 * @desc    Get maintenance statistics
 * @route   GET /api/superadmin/maintenance/stats
 * @access  Private (SuperAdmin)
 */
const getMaintenanceStats = asyncHandler(async (req, res) => {
  const stats = {
    totalRecords: 2,
    completed: 1,
    pending: 1,
    totalCost: 225,
    averageCost: 112.5,
  };

  ApiResponse.success(
    res,
    stats,
    'Maintenance statistics retrieved successfully'
  );
});

module.exports = {
  getMaintenanceRecords,
  createMaintenanceRecord,
  getMaintenanceRecordById,
  updateMaintenanceRecord,
  completeMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceStats,
};
