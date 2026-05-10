const MembershipPlan = require('../models/MembershipPlan');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all membership plans with pagination and filtering
 * @route   GET /api/superadmin/plans
 * @access  Private (SuperAdmin)
 */
const getPlans = asyncHandler(async (req, res) => {
  const {
    page = 1,
    per_page = 20,
    search = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by status
  if (status) {
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(per_page, 10);
  const skip = (pageNum - 1) * limitNum;

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const plans = await MembershipPlan.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count
  const totalCount = await MembershipPlan.countDocuments(query);

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / limitNum);

  ApiResponse.success(
    res,
    {
      plans,
      pagination: {
        current_page: pageNum,
        per_page: limitNum,
        total_pages: totalPages,
        total_count: totalCount,
      },
    },
    'Plans retrieved successfully'
  );
});

/**
 * @desc    Create a new membership plan
 * @route   POST /api/superadmin/plans
 * @access  Private (SuperAdmin)
 */
const createPlan = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    duration,
    durationUnit,
    features,
    maxMembers,
    benefits,
  } = req.body;

  // Validate required fields
  if (!name || !price || !duration || !durationUnit) {
    throw ApiError.badRequest(
      'Please provide all required fields: name, price, duration, durationUnit'
    );
  }

  // Validate price
  if (price <= 0) {
    throw ApiError.badRequest('Price must be greater than 0');
  }

  // Validate duration
  if (duration <= 0) {
    throw ApiError.badRequest('Duration must be greater than 0');
  }

  // Check if plan with same name already exists
  const existingPlan = await MembershipPlan.findOne({ name });
  if (existingPlan) {
    throw ApiError.conflict('Plan with this name already exists');
  }

  // Create plan
  const plan = await MembershipPlan.create({
    name,
    description,
    price,
    duration,
    durationUnit: durationUnit || 'month',
    features: features || [],
    maxMembers: maxMembers || null,
    benefits: benefits || [],
    isActive: true,
  });

  ApiResponse.success(
    res,
    { plan },
    'Plan created successfully',
    201
  );
});

/**
 * @desc    Get plan by ID
 * @route   GET /api/superadmin/plans/:planId
 * @access  Private (SuperAdmin)
 */
const getPlanById = asyncHandler(async (req, res) => {
  const { planId } = req.params;

  const plan = await MembershipPlan.findById(planId);

  if (!plan) {
    throw ApiError.notFound('Plan not found');
  }

  // Get count of members using this plan
  const memberCount = await User.countDocuments({
    membershipPlan: planId,
    isActive: true,
  });

  ApiResponse.success(
    res,
    { plan, memberCount },
    'Plan retrieved successfully'
  );
});

/**
 * @desc    Update plan
 * @route   PUT /api/superadmin/plans/:planId
 * @access  Private (SuperAdmin)
 */
const updatePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const updateData = req.body;

  // Find plan
  const plan = await MembershipPlan.findById(planId);
  if (!plan) {
    throw ApiError.notFound('Plan not found');
  }

  // Validate price if being updated
  if (updateData.price && updateData.price <= 0) {
    throw ApiError.badRequest('Price must be greater than 0');
  }

  // Validate duration if being updated
  if (updateData.duration && updateData.duration <= 0) {
    throw ApiError.badRequest('Duration must be greater than 0');
  }

  // Validate name if being updated
  if (updateData.name && updateData.name !== plan.name) {
    const existingPlan = await MembershipPlan.findOne({ name: updateData.name });
    if (existingPlan) {
      throw ApiError.conflict('Plan name is already in use');
    }
  }

  // Update plan
  const updatedPlan = await MembershipPlan.findByIdAndUpdate(
    planId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  ApiResponse.success(
    res,
    { plan: updatedPlan },
    'Plan updated successfully'
  );
});

/**
 * @desc    Delete plan
 * @route   DELETE /api/superadmin/plans/:planId
 * @access  Private (SuperAdmin)
 */
const deletePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;

  // Find plan
  const plan = await MembershipPlan.findById(planId);
  if (!plan) {
    throw ApiError.notFound('Plan not found');
  }

  // Check if any members are using this plan
  const memberCount = await User.countDocuments({
    membershipPlan: planId,
    isActive: true,
  });

  if (memberCount > 0) {
    throw ApiError.badRequest(
      `Cannot delete plan. ${memberCount} members are currently using this plan.`
    );
  }

  // Soft delete - set isActive to false
  plan.isActive = false;
  await plan.save();

  ApiResponse.success(
    res,
    { planId },
    'Plan deleted successfully'
  );
});

/**
 * @desc    Get plan statistics
 * @route   GET /api/superadmin/plans/stats
 * @access  Private (SuperAdmin)
 */
const getPlanStats = asyncHandler(async (req, res) => {
  // Get total plans
  const totalPlans = await MembershipPlan.countDocuments({ isActive: true });

  // Get plans with member count
  const plans = await MembershipPlan.find({ isActive: true }).lean();

  const plansWithStats = await Promise.all(
    plans.map(async (plan) => {
      const memberCount = await User.countDocuments({
        membershipPlan: plan._id,
        isActive: true,
      });

      return {
        planId: plan._id,
        name: plan.name,
        price: plan.price,
        memberCount,
        revenue: plan.price * memberCount,
      };
    })
  );

  // Calculate total revenue
  const totalRevenue = plansWithStats.reduce((sum, plan) => sum + plan.revenue, 0);

  // Get most popular plan
  const mostPopular = plansWithStats.reduce((max, plan) =>
    plan.memberCount > max.memberCount ? plan : max
  );

  ApiResponse.success(
    res,
    {
      totalPlans,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      plansWithStats,
      mostPopular,
    },
    'Plan statistics retrieved successfully'
  );
});

/**
 * @desc    Compare plans
 * @route   GET /api/superadmin/plans/compare
 * @access  Private (SuperAdmin)
 */
const comparePlans = asyncHandler(async (req, res) => {
  const { planIds = [] } = req.query;

  if (!planIds || planIds.length === 0) {
    throw ApiError.badRequest('Please provide plan IDs to compare');
  }

  const ids = Array.isArray(planIds) ? planIds : [planIds];

  const plans = await MembershipPlan.find({ _id: { $in: ids }, isActive: true }).lean();

  if (plans.length === 0) {
    throw ApiError.notFound('No plans found');
  }

  // Get member count for each plan
  const comparison = await Promise.all(
    plans.map(async (plan) => {
      const memberCount = await User.countDocuments({
        membershipPlan: plan._id,
        isActive: true,
      });

      return {
        planId: plan._id,
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        durationUnit: plan.durationUnit,
        features: plan.features,
        memberCount,
        revenue: plan.price * memberCount,
      };
    })
  );

  ApiResponse.success(
    res,
    { comparison },
    'Plans comparison retrieved successfully'
  );
});

module.exports = {
  getPlans,
  createPlan,
  getPlanById,
  updatePlan,
  deletePlan,
  getPlanStats,
  comparePlans,
};
