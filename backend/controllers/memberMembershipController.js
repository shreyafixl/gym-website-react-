const Membership = require('../models/Membership');
const MembershipPlan = require('../models/MembershipPlan');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get current membership details
 * @route   GET /api/member/membership/current
 * @access  Private (Member only)
 */
const getCurrentMembership = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  const membership = await Membership.findOne({
    memberId,
    membershipStatus: { $in: ['active', 'paused'] },
  })
    .populate('assignedBranch', 'branchName branchCode city address')
    .lean();

  if (!membership) {
    throw ApiError.notFound('No active membership found');
  }

  const membershipDetail = {
    id: membership._id,
    plan: membership.membershipPlan,
    startDate: membership.membershipStartDate,
    endDate: membership.membershipEndDate,
    status: membership.membershipStatus,
    paymentStatus: membership.paymentStatus,
    branch: membership.assignedBranch,
    amount: membership.amount,
    discount: membership.discount,
    finalAmount: membership.finalAmount,
    paymentMethod: membership.paymentMethod,
    autoRenewal: membership.autoRenewal,
    daysRemaining: membership.getDaysRemaining ? membership.getDaysRemaining() : Math.ceil((new Date(membership.membershipEndDate) - new Date()) / (1000 * 60 * 60 * 24)),
    isExpiringSoon: Math.ceil((new Date(membership.membershipEndDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 7,
    pausedFrom: membership.pausedFrom,
    pausedUntil: membership.pausedUntil,
    notes: membership.notes,
    createdAt: membership.createdAt,
    updatedAt: membership.updatedAt,
  };

  ApiResponse.success(
    res,
    membershipDetail,
    'Current membership retrieved successfully'
  );
});

/**
 * @desc    Get membership history
 * @route   GET /api/member/membership/history
 * @access  Private (Member only)
 */
const getMembershipHistory = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const memberships = await Membership.find({ memberId })
    .populate('assignedBranch', 'branchName branchCode city')
    .sort({ membershipStartDate: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await Membership.countDocuments({ memberId });

  const response = {
    memberships: memberships.map(m => ({
      id: m._id,
      plan: m.membershipPlan,
      startDate: m.membershipStartDate,
      endDate: m.membershipEndDate,
      status: m.membershipStatus,
      paymentStatus: m.paymentStatus,
      branch: m.assignedBranch,
      amount: m.amount,
      discount: m.discount,
      finalAmount: m.finalAmount,
      paymentMethod: m.paymentMethod,
      autoRenewal: m.autoRenewal,
      createdAt: m.createdAt,
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  };

  ApiResponse.success(
    res,
    response,
    'Membership history retrieved successfully'
  );
});

/**
 * @desc    Get available membership plans
 * @route   GET /api/member/membership/plans
 * @access  Private (Member only)
 */
const getAvailablePlans = asyncHandler(async (req, res) => {
  const { category } = req.query;

  // Build filter query
  const filter = { isActive: true };

  if (category) {
    const validCategories = ['basic', 'standard', 'premium', 'vip'];
    if (!validCategories.includes(category)) {
      throw ApiError.badRequest('Invalid category');
    }
    filter.category = category;
  }

  const plans = await MembershipPlan.find(filter)
    .sort({ category: 1, price: 1 })
    .lean();

  const response = {
    plans: plans.map(p => ({
      id: p._id,
      name: p.planName,
      code: p.planCode,
      duration: p.duration,
      durationType: p.durationType,
      price: p.price,
      currency: p.currency,
      discount: p.discount,
      finalPrice: p.finalPrice,
      features: p.features,
      description: p.description,
      isPopular: p.isPopular,
      category: p.category,
      maxMembers: p.maxMembers,
      currentMembers: p.currentMembers,
      availableSlots: p.maxMembers ? p.maxMembers - p.currentMembers : null,
      isAvailable: p.maxMembers ? p.currentMembers < p.maxMembers : true,
      createdAt: p.createdAt,
    })),
  };

  ApiResponse.success(
    res,
    response,
    'Available plans retrieved successfully'
  );
});

/**
 * @desc    Get membership renewal request details
 * @route   GET /api/member/membership/renewal
 * @access  Private (Member only)
 */
const getRenewalDetails = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  // Get current membership
  const currentMembership = await Membership.findOne({
    memberId,
    membershipStatus: { $in: ['active', 'expired'] },
  })
    .sort({ membershipEndDate: -1 })
    .lean();

  if (!currentMembership) {
    throw ApiError.notFound('No membership found for renewal');
  }

  // Get available plans
  const plans = await MembershipPlan.find({ isActive: true })
    .sort({ category: 1, price: 1 })
    .lean();

  const response = {
    currentMembership: {
      id: currentMembership._id,
      plan: currentMembership.membershipPlan,
      startDate: currentMembership.membershipStartDate,
      endDate: currentMembership.membershipEndDate,
      status: currentMembership.membershipStatus,
      paymentStatus: currentMembership.paymentStatus,
      amount: currentMembership.amount,
      finalAmount: currentMembership.finalAmount,
    },
    availablePlans: plans.map(p => ({
      id: p._id,
      name: p.planName,
      code: p.planCode,
      duration: p.duration,
      durationType: p.durationType,
      price: p.price,
      currency: p.currency,
      discount: p.discount,
      finalPrice: p.finalPrice,
      features: p.features,
      category: p.category,
      isAvailable: p.maxMembers ? p.currentMembers < p.maxMembers : true,
    })),
  };

  ApiResponse.success(
    res,
    response,
    'Renewal details retrieved successfully'
  );
});

/**
 * @desc    Request membership renewal
 * @route   POST /api/member/membership/renewal-request
 * @access  Private (Member only)
 */
const requestRenewal = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const { planId, paymentMethod } = req.body;

  // Validate required fields
  if (!planId) {
    throw ApiError.badRequest('Plan ID is required');
  }

  if (!paymentMethod) {
    throw ApiError.badRequest('Payment method is required');
  }

  // Validate payment method
  const validPaymentMethods = ['cash', 'card', 'upi', 'net-banking', 'other'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    throw ApiError.badRequest('Invalid payment method');
  }

  // Validate plan ID format
  if (!planId.match(/^[0-9a-fA-F]{24}$/)) {
    throw ApiError.badRequest('Invalid plan ID format');
  }

  // Get plan details
  const plan = await MembershipPlan.findById(planId);

  if (!plan) {
    throw ApiError.notFound('Plan not found');
  }

  if (!plan.isActive) {
    throw ApiError.badRequest('Selected plan is not active');
  }

  if (plan.maxMembers && plan.currentMembers >= plan.maxMembers) {
    throw ApiError.badRequest('Selected plan is full');
  }

  // Get current membership
  const currentMembership = await Membership.findOne({
    memberId,
    membershipStatus: { $in: ['active', 'expired'] },
  })
    .sort({ membershipEndDate: -1 });

  if (!currentMembership) {
    throw ApiError.notFound('No membership found for renewal');
  }

  // Calculate new end date
  const newStartDate = new Date(currentMembership.membershipEndDate);
  const newEndDate = new Date(newStartDate);

  if (plan.durationType === 'days') {
    newEndDate.setDate(newEndDate.getDate() + plan.duration);
  } else if (plan.durationType === 'months') {
    newEndDate.setMonth(newEndDate.getMonth() + plan.duration);
  } else if (plan.durationType === 'years') {
    newEndDate.setFullYear(newEndDate.getFullYear() + plan.duration);
  }

  // Create renewal request (new membership record)
  const renewalMembership = new Membership({
    memberId,
    membershipPlan: plan.planCode,
    membershipStartDate: newStartDate,
    membershipEndDate: newEndDate,
    paymentStatus: 'pending',
    membershipStatus: 'active',
    assignedBranch: currentMembership.assignedBranch,
    amount: plan.price,
    discount: (plan.price * plan.discount) / 100,
    finalAmount: plan.finalPrice,
    paymentMethod,
    autoRenewal: false,
    createdBy: memberId,
    createdByModel: 'User',
  });

  await renewalMembership.save();

  // Update plan current members
  plan.currentMembers += 1;
  await plan.save();

  ApiResponse.success(
    res,
    {
      id: renewalMembership._id,
      plan: renewalMembership.membershipPlan,
      startDate: renewalMembership.membershipStartDate,
      endDate: renewalMembership.membershipEndDate,
      status: renewalMembership.membershipStatus,
      paymentStatus: renewalMembership.paymentStatus,
      amount: renewalMembership.finalAmount,
      paymentMethod: renewalMembership.paymentMethod,
    },
    'Renewal request created successfully'
  );
});

/**
 * @desc    Get membership payment status
 * @route   GET /api/member/membership/payment-status
 * @access  Private (Member only)
 */
const getPaymentStatus = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  const membership = await Membership.findOne({
    memberId,
    membershipStatus: { $in: ['active', 'paused', 'expired'] },
  })
    .sort({ membershipEndDate: -1 })
    .lean();

  if (!membership) {
    throw ApiError.notFound('No membership found');
  }

  const response = {
    id: membership._id,
    paymentStatus: membership.paymentStatus,
    amount: membership.amount,
    discount: membership.discount,
    finalAmount: membership.finalAmount,
    paymentMethod: membership.paymentMethod,
    transactionId: membership.transactionId,
    membershipStatus: membership.membershipStatus,
    createdAt: membership.createdAt,
  };

  ApiResponse.success(
    res,
    response,
    'Payment status retrieved successfully'
  );
});

module.exports = {
  getCurrentMembership,
  getMembershipHistory,
  getAvailablePlans,
  getRenewalDetails,
  requestRenewal,
  getPaymentStatus,
};
