const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { authorizeAdmin } = require('../middleware/authorize');
const {
    createBooking,
    updateBookingStatus,
    getCustomerBookings,
    getProviderBookings,
    getAllBookings
} = require('../Controller/booking');

// Customer routes
router.post('/', authenticateUser, createBooking);
router.get('/my-bookings', authenticateUser, getCustomerBookings);

// Provider routes  
router.get('/provider/bookings', authenticateUser, getProviderBookings);
router.patch('/:bookingId/status', authenticateUser, updateBookingStatus);

// Admin routes
router.get('/all', authenticateUser, authorizeAdmin, getAllBookings);

module.exports = router;
