const Booking = require('../models/booking_model');
const Service = require('../models/service_model');
const User = require('../models/user_model');

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { serviceId, bookingDate, notes } = req.body;
        const customerId = req.user.id;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        const newBooking = new Booking({
            service: serviceId,
            customer: customerId,
            provider: service.provider,
            bookingDate,
            notes,
            totalBill: service.basePrice,
            status: 'pending'
        });

        await newBooking.save();

        res.status(201).json({ 
            success: true, 
            message: 'Booking request sent successfully. The provider will review it shortly.', 
            booking: newBooking 
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get bookings for the logged-in provider
const getProviderBookings = async (req, res) => {
    try {
        const providerId = req.user.id;
        const bookings = await Booking.find({ provider: providerId })
            .populate('service', 'name')
            .populate('customer', 'name email');
        
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching provider bookings:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get bookings for the logged-in customer
const getCustomerBookings = async (req, res) => {
    try {
        const customerId = req.user.id;
        const bookings = await Booking.find({ customer: customerId })
            .populate({
                path: 'service',
                select: 'name basePrice',
                populate: {
                    path: 'provider',
                    select: 'name email'
                }
            });
        
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching customer bookings:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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

module.exports = {
    createBooking,
    getProviderBookings,
    getCustomerBookings,
    updateBookingStatus
}; 