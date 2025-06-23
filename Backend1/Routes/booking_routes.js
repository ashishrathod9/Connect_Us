const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authenticateUser');
const { authorizeAdmin } = require('../middleware/authorize');

// Import controller functions
const {
    createBooking,
    updateBookingStatus,
    getCustomerBookings,
    getProviderBookings,
    getAllBookings
} = require('../Controller/booking');

// Debug middleware for booking routes
router.use((req, res, next) => {
    console.log('📋 Booking route hit:', req.method, req.path);
    console.log('📋 Request body:', req.body);
    console.log('📋 User:', req.user ? req.user.id : 'Not authenticated');
    next();
});

// Public test route
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Booking routes are working!',
        timestamp: new Date().toISOString()
    });
});

// Customer routes
router.post('/', authenticateUser, createBooking);
router.get('/my-bookings', authenticateUser, getCustomerBookings);

// Provider routes  
router.get('/provider/bookings', authenticateUser, getProviderBookings);
router.patch('/:bookingId/status', authenticateUser, updateBookingStatus);

// Admin routes
router.get('/all', authenticateUser, authorizeAdmin, getAllBookings);

console.log('📋 Booking routes loaded successfully');

module.exports = router;
