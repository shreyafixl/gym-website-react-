const express = require('express');
const router = express.Router();
const {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  bookSchedule,
  cancelBooking,
  checkAvailability,
  getScheduleById,
} = require('../controllers/adminScheduleController');
const { protectAdmin } = require('../middleware/roleAuthMiddleware');

/**
 * @route   GET /api/admin/schedules/:id/availability
 * @desc    Check schedule availability
 * @access  Private (Admin)
 */
router.get('/:id/availability', protectAdmin, checkAvailability);

/**
 * @route   GET /api/admin/schedules
 * @desc    Get all schedules with filtering
 * @access  Private (Admin)
 */
router.get('/', protectAdmin, getAllSchedules);

/**
 * @route   POST /api/admin/schedules
 * @desc    Create schedule
 * @access  Private (Admin)
 */
router.post('/', protectAdmin, createSchedule);

/**
 * @route   GET /api/admin/schedules/:id
 * @desc    Get schedule by ID
 * @access  Private (Admin)
 */
router.get('/:id', protectAdmin, getScheduleById);

/**
 * @route   PUT /api/admin/schedules/:id
 * @desc    Update schedule
 * @access  Private (Admin)
 */
router.put('/:id', protectAdmin, updateSchedule);

/**
 * @route   DELETE /api/admin/schedules/:id
 * @desc    Delete schedule
 * @access  Private (Admin)
 */
router.delete('/:id', protectAdmin, deleteSchedule);

/**
 * @route   POST /api/admin/schedules/:id/book
 * @desc    Book schedule (add participant)
 * @access  Private (Admin)
 */
router.post('/:id/book', protectAdmin, bookSchedule);

/**
 * @route   DELETE /api/admin/schedules/:id/bookings/:bookingId
 * @desc    Cancel booking (remove participant)
 * @access  Private (Admin)
 */
router.delete('/:id/bookings/:bookingId', protectAdmin, cancelBooking);

module.exports = router;
