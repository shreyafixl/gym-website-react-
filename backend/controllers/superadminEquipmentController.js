const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all equipment with pagination
 * @route   GET /api/superadmin/equipment
 * @access  Private (SuperAdmin)
 */
const getEquipment = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    status = '',
    branch = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Mock equipment data
  const mockEquipment = [
    {
      _id: '1',
      name: 'Treadmill',
      category: 'cardio',
      branch: 'branch1',
      quantity: 5,
      status: 'working',
      purchaseDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      condition: 'good',
    },
    {
      _id: '2',
      name: 'Dumbbells',
      category: 'weights',
      branch: 'branch1',
      quantity: 20,
      status: 'working',
      purchaseDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      lastMaintenance: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      condition: 'excellent',
    },
  ];

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  let filtered = mockEquipment;
  if (status) {
    filtered = filtered.filter(e => e.status === status);
  }
  if (branch) {
    filtered = filtered.filter(e => e.branch === branch);
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  const equipment = filtered.slice(skip, skip + limitNum);

  ApiResponse.success(
    res,
    {
      equipment,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Equipment retrieved successfully'
  );
});

/**
 * @desc    Create new equipment
 * @route   POST /api/superadmin/equipment
 * @access  Private (SuperAdmin)
 */
const createEquipment = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    branch,
    quantity,
    purchaseDate,
  } = req.body;

  if (!name || !category || !branch || !quantity) {
    throw ApiError.badRequest('Please provide all required fields');
  }

  const equipment = {
    _id: Date.now().toString(),
    name,
    category,
    branch,
    quantity,
    status: 'working',
    purchaseDate: new Date(purchaseDate),
    lastMaintenance: new Date(),
    condition: 'good',
    createdAt: new Date(),
  };

  ApiResponse.success(
    res,
    { equipment },
    'Equipment created successfully',
    201
  );
});

/**
 * @desc    Get equipment by ID
 * @route   GET /api/superadmin/equipment/:equipmentId
 * @access  Private (SuperAdmin)
 */
const getEquipmentById = asyncHandler(async (req, res) => {
  const { equipmentId } = req.params;

  const equipment = {
    _id: equipmentId,
    name: 'Sample Equipment',
    category: 'cardio',
    branch: 'branch1',
    quantity: 5,
    status: 'working',
    purchaseDate: new Date(),
    lastMaintenance: new Date(),
    condition: 'good',
  };

  ApiResponse.success(
    res,
    { equipment },
    'Equipment retrieved successfully'
  );
});

/**
 * @desc    Update equipment
 * @route   PUT /api/superadmin/equipment/:equipmentId
 * @access  Private (SuperAdmin)
 */
const updateEquipment = asyncHandler(async (req, res) => {
  const { equipmentId } = req.params;
  const updateData = req.body;

  const equipment = {
    _id: equipmentId,
    ...updateData,
    updatedAt: new Date(),
  };

  ApiResponse.success(
    res,
    { equipment },
    'Equipment updated successfully'
  );
});

/**
 * @desc    Delete equipment
 * @route   DELETE /api/superadmin/equipment/:equipmentId
 * @access  Private (SuperAdmin)
 */
const deleteEquipment = asyncHandler(async (req, res) => {
  const { equipmentId } = req.params;

  ApiResponse.success(
    res,
    { equipmentId },
    'Equipment deleted successfully'
  );
});

module.exports = {
  getEquipment,
  createEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};
