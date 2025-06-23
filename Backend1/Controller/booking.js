const Booking = require('../models/booking_model');
const Service = require('../models/service_model');
const User = require('../models/user_model');

const createBooking = async (req, res) => {
    try {
        console.log('📋 Creating booking...');
        console.log('📋 Request body:', req.body);
        console.log('📋 User:', req.user ? req.user.id : 'No user');

        const { serviceId, scheduledDate, notes } = req.body;
        const customerId = req.user?.id;

        // Check if user is authenticated
        if (!customerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Validate required fields
        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: 'Service ID is required'
            });
        }

        if (!scheduledDate) {
            return res.status(400).json({
                success: false,
                message: 'Scheduled date is required'
            });
        }

        console.log('📋 Validation passed, finding service...');

        // Get service details
        const service = await Service.findById(serviceId).populate('provider');
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        console.log('📋 Service found:', service.name);

        // Get customer details
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        console.log('📋 Customer found:', customer.name);

        // Validate scheduled date
        const scheduledDateTime = new Date(scheduledDate);
        if (isNaN(scheduledDateTime.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid scheduled date format'
            });
        }

        if (scheduledDateTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Scheduled date must be in the future'
            });
        }

        console.log('📋 Creating booking document...');

        // Create booking
        const booking = new Booking({
            customer: customerId,
            provider: service.provider._id,
            service: serviceId,
            scheduledDate: scheduledDateTime,
            notes: notes || '',
            status: 'pending',
            totalAmount: service.basePrice,
            paymentStatus: 'pending'
        });

        await booking.save();
        console.log('📋 Booking saved with ID:', booking._id);

        // Populate booking details for response
        await booking.populate([
            { path: 'customer', select: 'name email phone' },
            { path: 'provider', select: 'name email phone' },
            { path: 'service', select: 'name description basePrice' }
        ]);

        console.log('📋 Booking created successfully');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        });

    } catch (error) {
        console.error('📋 Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get bookings for the logged-in provider
const getProviderBookings = async (req, res) => {
    try {
        const providerId = req.user.id;
        
        const bookings = await Booking.find({ provider: providerId })
            .populate('customer', 'name email phone')
            .populate('service', 'name description basePrice')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Error fetching provider bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get bookings for the logged-in customer
const getCustomerBookings = async (req, res) => {
    try {
        const customerId = req.user.id;
        
        const bookings = await Booking.find({ customer: customerId })
            .populate('provider', 'name email phone')
            .populate('service', 'name description basePrice')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Error fetching customer bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


// Update booking status (for providers)
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const providerId = req.user.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.provider.toString() !== providerId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to update this booking.' });
        }

        if (!['approved', 'rejected', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status provided.' });
        }
        
        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, message: `Booking has been ${status}.`, booking });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('customer', 'name email phone')
            .populate('provider', 'name email phone')
            .populate('service', 'name description basePrice')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    createBooking,
    getProviderBookings,
    getCustomerBookings,
    updateBookingStatus,
    getAllBookings
}; 
