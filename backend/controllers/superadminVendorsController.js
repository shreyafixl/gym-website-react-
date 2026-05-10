const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all vendors with pagination
 * @route   GET /api/superadmin/vendors
 * @access  Private (SuperAdmin)
 */
const getVendors = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    search = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Mock vendors data
  const mockVendors = [
    {
      _id: '1',
      name: 'Fitness Equipment Co',
      email: 'contact@fitequip.com',
      phone: '1234567890',
      address: '123 Main St',
      city: 'New York',
      status: 'active',
      rating: 4.5,
      totalOrders: 25,
    },
    {
      _id: '2',
      name: 'Nutrition Plus',
      email: 'sales@nutritionplus.com',
      phone: '0987654321',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      status: 'active',
      rating: 4.8,
      totalOrders: 18,
    },
  ];

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  let filtered = mockVendors;
  if (search) {
    filtered = filtered.filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (status) {
    filtered = filtered.filter(v => v.status === status);
  }

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  const vendors = filtered.slice(skip, skip + limitNum);

  ApiResponse.success(
    res,
    {
      vendors,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Vendors retrieved successfully'
  );
});

/**
 * @desc    Create new vendor
 * @route   POST /api/superadmin/vendors
 * @access  Private (SuperAdmin)
 */
const createVendor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
  } = req.body;

  if (!name || !email || !phone || !address || !city) {
    throw ApiError.badRequest('Please provide all required fields');
  }

  const vendor = {
    _id: Date.now().toString(),
    name,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    status: 'active',
    rating: 0,
    totalOrders: 0,
    createdAt: new Date(),
  };

  ApiResponse.success(
    res,
    { vendor },
    'Vendor created successfully',
    201
  );
});

/**
 * @desc    Get vendor by ID
 * @route   GET /api/superadmin/vendors/:vendorId
 * @access  Private (SuperAdmin)
 */
const getVendorById = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  const vendor = {
    _id: vendorId,
    name: 'Sample Vendor',
    email: 'vendor@example.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'New York',
    status: 'active',
    rating: 4.5,
    totalOrders: 25,
  };

  ApiResponse.success(
    res,
    { vendor },
    'Vendor retrieved successfully'
  );
});

/**
 * @desc    Update vendor
 * @route   PUT /api/superadmin/vendors/:vendorId
 * @access  Private (SuperAdmin)
 */
const updateVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  const updateData = req.body;

  const vendor = {
    _id: vendorId,
    ...updateData,
    updatedAt: new Date(),
  };

  ApiResponse.success(
    res,
    { vendor },
    'Vendor updated successfully'
  );
});

/**
 * @desc    Delete vendor
 * @route   DELETE /api/superadmin/vendors/:vendorId
 * @access  Private (SuperAdmin)
 */
const deleteVendor = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  ApiResponse.success(
    res,
    { vendorId },
    'Vendor deleted successfully'
  );
});

module.exports = {
  getVendors,
  createVendor,
  getVendorById,
  updateVendor,
  deleteVendor,
};
