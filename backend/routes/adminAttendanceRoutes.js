const express = require('express');
const router = express.Router();
const {
  createAttendance,
  getAllAttendance,
  updateAttendance,
  getAttendanceStats,
  bulkCreateAttendance,
  deleteAttendance,
  getAttendanceById,
} = require('../controllers/adminAttendanceController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @route   GET /api/admin/attendance/stats
 * @desc    Get attendance statistics
 * @access  Private (Admin)
 */
router.get('/stats', protectAdmin, getAttendanceStats);

/**
 * @route   POST /api/admin/attendance/bulk
 * @desc    Bulk create attendance records
 * @access  Private (Admin)
 */
router.post('/bulk', protectAdmin, bulkCreateAttendance);

/**
 * @route   GET /api/admin/attendance
 * @desc    Get all attendance records with filtering
 * @access  Private (Admin)
 */
router.get('/', protectAdmin, getAllAttendance);

/**
 * @route   POST /api/admin/attendance
 * @desc    Create attendance record (check-in)
 * @access  Private (Admin)
 */
router.post('/', protectAdmin, createAttendance);

/**
 * @route   GET /api/admin/attendance/:id
 * @desc    Get attendance by ID
 * @access  Private (Admin)
 */
router.get('/:id', protectAdmin, getAttendanceById);

/**
 * @route   PUT /api/admin/attendance/:id
 * @desc    Update attendance record (check-out or edit)
 * @access  Private (Admin)
 */
router.put('/:id', protectAdmin, updateAttendance);

/**
 * @route   DELETE /api/admin/attendance/:id
 * @desc    Delete attendance record
 * @access  Private (Admin)
 */
router.delete('/:id', protectAdmin, deleteAttendance);

module.exports = router;
