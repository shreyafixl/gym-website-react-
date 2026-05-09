const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get member profile
 * @route   GET /api/member/profile
 * @access  Private (Member only)
 */
const getProfile = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  const user = await User.findById(memberId)
    .populate('assignedTrainer', 'fullName email phone specialization profileImage')
    .lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const profile = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    age: user.age,
    height: user.height,
    weight: user.weight,
    fitnessGoal: user.fitnessGoal,
    membershipPlan: user.membershipPlan,
    membershipStatus: user.membershipStatus,
    membershipStartDate: user.membershipStartDate,
    membershipEndDate: user.membershipEndDate,
    assignedTrainer: user.assignedTrainer,
    role: user.role,
    profileImage: user.profileImage,
    address: user.address,
    emergencyContact: user.emergencyContact,
    isActive: user.isActive,
    joinDate: user.joinDate,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  ApiResponse.success(
    res,
    profile,
    'Profile retrieved successfully'
  );
});

/**
 * @desc    Update member profile
 * @route   PUT /api/member/profile
 * @access  Private (Member only)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const memberId = req.user.id;
  const {
    fullName,
    phone,
    gender,
    age,
    height,
    weight,
    fitnessGoal,
    address,
    emergencyContact,
  } = req.body;

  // Validate required fields
  const updates = {};

  if (fullName !== undefined) {
    if (typeof fullName !== 'string' || fullName.trim().length < 2) {
      throw ApiError.badRequest('Full name must be at least 2 characters');
    }
    updates.fullName = fullName.trim();
  }

  if (phone !== undefined) {
    if (!/^[0-9]{10}$/.test(phone)) {
      throw ApiError.badRequest('Phone must be a valid 10-digit number');
    }
    updates.phone = phone;
  }

  if (gender !== undefined) {
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(gender)) {
      throw ApiError.badRequest('Invalid gender');
    }
    updates.gender = gender;
  }

  if (age !== undefined) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      throw ApiError.badRequest('Age must be between 13 and 120');
    }
    updates.age = ageNum;
  }

  if (height !== undefined) {
    if (height !== null) {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) {
        throw ApiError.badRequest('Height must be between 50 and 300 cm');
      }
      updates.height = heightNum;
    } else {
      updates.height = null;
    }
  }

  if (weight !== undefined) {
    if (weight !== null) {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum < 20 || weightNum > 500) {
        throw ApiError.badRequest('Weight must be between 20 and 500 kg');
      }
      updates.weight = weightNum;
    } else {
      updates.weight = null;
    }
  }

  if (fitnessGoal !== undefined) {
    const validGoals = ['weight-loss', 'muscle-gain', 'fitness', 'strength', 'endurance', 'flexibility', 'general-health', 'none'];
    if (!validGoals.includes(fitnessGoal)) {
      throw ApiError.badRequest('Invalid fitness goal');
    }
    updates.fitnessGoal = fitnessGoal;
  }

  if (address !== undefined) {
    if (address !== null && typeof address !== 'string') {
      throw ApiError.badRequest('Address must be a string');
    }
    updates.address = address ? address.trim() : null;
  }

  if (emergencyContact !== undefined) {
    if (emergencyContact !== null) {
      if (typeof emergencyContact !== 'object') {
        throw ApiError.badRequest('Emergency contact must be an object');
      }

      const { name, phone: ecPhone, relationship } = emergencyContact;

      if (name !== undefined && name !== null) {
        if (typeof name !== 'string' || name.trim().length < 2) {
          throw ApiError.badRequest('Emergency contact name must be at least 2 characters');
        }
      }

      if (ecPhone !== undefined && ecPhone !== null) {
        if (!/^[0-9]{10}$/.test(ecPhone)) {
          throw ApiError.badRequest('Emergency contact phone must be a valid 10-digit number');
        }
      }

      if (relationship !== undefined && relationship !== null) {
        if (typeof relationship !== 'string' || relationship.trim().length < 2) {
          throw ApiError.badRequest('Relationship must be at least 2 characters');
        }
      }

      updates.emergencyContact = {
        name: name || null,
        phone: ecPhone || null,
        relationship: relationship || null,
      };
    } else {
      updates.emergencyContact = {
        name: null,
        phone: null,
        relationship: null,
      };
    }
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    memberId,
    updates,
    { new: true, runValidators: true }
  )
    .populate('assignedTrainer', 'fullName email phone specialization profileImage')
    .lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const profile = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    age: user.age,
    height: user.height,
    weight: user.weight,
    fitnessGoal: user.fitnessGoal,
    membershipPlan: user.membershipPlan,
    membershipStatus: user.membershipStatus,
    assignedTrainer: user.assignedTrainer,
    profileImage: user.profileImage,
    address: user.address,
    emergencyContact: user.emergencyContact,
    updatedAt: user.updatedAt,
  };

  ApiResponse.success(
    res,
    profile,
    'Profile updated successfully'
  );
});

/**
 * @desc    Upload profile image
 * @route   POST /api/member/profile/upload-image
 * @access  Private (Member only)
 */
const uploadProfileImage = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  // Check if file is uploaded
  if (!req.file) {
    throw ApiError.badRequest('No image file provided');
  }

  // Validate file type
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw ApiError.badRequest('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
  }

  // Validate file size (max 5MB)
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxFileSize) {
    throw ApiError.badRequest('File size must not exceed 5MB');
  }

  // Generate image URL (assuming file is stored in public/uploads directory)
  const imageUrl = `/uploads/profiles/${req.file.filename}`;

  // Update user profile image
  const user = await User.findByIdAndUpdate(
    memberId,
    { profileImage: imageUrl },
    { new: true }
  )
    .populate('assignedTrainer', 'fullName email phone specialization profileImage')
    .lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const profile = {
    id: user._id,
    fullName: user.fullName,
    profileImage: user.profileImage,
    updatedAt: user.updatedAt,
  };

  ApiResponse.success(
    res,
    profile,
    'Profile image uploaded successfully'
  );
});

/**
 * @desc    Get profile statistics
 * @route   GET /api/member/profile/stats
 * @access  Private (Member only)
 */
const getProfileStats = asyncHandler(async (req, res) => {
  const memberId = req.user.id;

  const user = await User.findById(memberId).lean();

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Calculate BMI if height and weight are available
  let bmi = null;
  let bmiCategory = null;

  if (user.height && user.weight) {
    const heightInMeters = user.height / 100;
    bmi = parseFloat((user.weight / (heightInMeters * heightInMeters)).toFixed(2));

    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';
  }

  // Calculate membership days remaining
  let daysRemaining = 0;
  if (user.membershipEndDate) {
    const today = new Date();
    const endDate = new Date(user.membershipEndDate);
    const diffTime = endDate - today;
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const stats = {
    id: user._id,
    fullName: user.fullName,
    age: user.age,
    gender: user.gender,
    height: user.height,
    weight: user.weight,
    bmi,
    bmiCategory,
    fitnessGoal: user.fitnessGoal,
    membershipStatus: user.membershipStatus,
    membershipPlan: user.membershipPlan,
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
    attendanceCount: user.attendance ? user.attendance.length : 0,
    joinDate: user.joinDate,
    lastLogin: user.lastLogin,
  };

  ApiResponse.success(
    res,
    stats,
    'Profile statistics retrieved successfully'
  );
});

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getProfileStats,
};
