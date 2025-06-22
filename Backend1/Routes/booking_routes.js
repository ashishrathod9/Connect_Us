const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { 
    createBooking, 
    getProviderBookings, 
    getCustomerBookings,
    updateBookingStatus 
} = require('../Controller/booking');
const { requireProvider } = require('../middleware/authenticateUser');

// Create a new booking (for customers)
router.post('/', authenticateUser, createBooking);

// Get all bookings for the logged-in provider
router.get('/provider', authenticateUser, requireProvider, getProviderBookings);

// Get all bookings for the logged-in customer
router.get('/customer', authenticateUser, getCustomerBookings);

// Update a booking's status (for providers)
router.put('/:bookingId/status', authenticateUser, requireProvider, updateBookingStatus);

module.exports = router; 