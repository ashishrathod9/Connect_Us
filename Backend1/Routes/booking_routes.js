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

// IMPORTANT: Add this test route first to verify routing works
router.get('/test', (req, res) => {
    console.log('📋 Test route hit successfully!');
    res.json({ 
        success: true, 
        message: 'Booking routes are working!',
        timestamp: new Date().toISOString()
    });
});

// Root route for /api/bookings (this might be missing)
router.get('/', (req, res) => {
    console.log('📋 Root booking route hit');
    res.json({
        success: true,
        message: 'Booking API endpoint',
        availableRoutes: [
            'GET /api/bookings/test',
            'POST /api/bookings',
            'GET /api/bookings/my-bookings',
            'GET /api/bookings/provider/bookings',
            'PATCH /api/bookings/:id/status',
            'GET /api/bookings/all'
        ]
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