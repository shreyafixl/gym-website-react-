const express = require('express');
const router = express.Router();
const { verifyJWT, checkRole } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getProfileStats,
} = require('../controllers/memberProfileController');

// Multer middleware for file upload (assuming it's configured elsewhere)
// const upload = require('../middleware/upload');

// All routes are protected - require JWT authentication and member role
router.use(verifyJWT);
router.use(checkRole('member'));

/**
 * @route   GET /api/member/profile/stats
 * @desc    Get profile statistics (BMI, membership days remaining, etc.)
 * @access  Private (Member only)
 */
router.get('/stats', getProfileStats);

/**
 * @route   POST /api/member/profile/upload-image
 * @desc    Upload profile image
 * @body    image - Image file (multipart/form-data)
 * @access  Private (Member only)
 */
// Uncomment when multer middleware is configured
// router.post('/upload-image', upload.single('image'), uploadProfileImage);
router.post('/upload-image', uploadProfileImage);

/**
 * @route   PUT /api/member/profile
 * @desc    Update member profile
 * @body    fullName - Full name (optional)
 * @body    phone - Phone number (optional)
 * @body    gender - Gender (optional)
 * @body    age - Age (optional)
 * @body    height - Height in cm (optional)
 * @body    weight - Weight in kg (optional)
 * @body    fitnessGoal - Fitness goal (optional)
 * @body    address - Address (optional)
 * @body    emergencyContact - Emergency contact object (optional)
 * @access  Private (Member only)
 */
router.put('/', updateProfile);

/**
 * @route   GET /api/member/profile
 * @desc    Get member profile
 * @access  Private (Member only)
 */
router.get('/', getProfile);

module.exports = router;
