import React, { useState } from 'react';
import Modal from './common/Modal';

const BookingModal = ({ isOpen, onClose, onSubmit, service, isLoading }) => {
    const [scheduledDate, setScheduledDate] = useState('');  // Changed from bookingDate
    const [bookingTime, setBookingTime] = useState('');     // Added time field
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!scheduledDate) {
            setError('Please select a date for the booking.');
            return;
        }
        
        if (!bookingTime) {
            setError('Please select a time for the booking.');
            return;
        }

        // Combine date and time into a proper datetime string
        const combinedDateTime = `${scheduledDate}T${bookingTime}:00`;
        
        // Validate that the selected date/time is in the future
        const selectedDateTime = new Date(combinedDateTime);
        if (selectedDateTime <= new Date()) {
            setError('Please select a future date and time.');
            return;
        }

        setError('');
        
        // Send data with correct field names to match backend validation
        const bookingData = {
            serviceId: service._id,
            scheduledDate: combinedDateTime,  // This matches backend validation
            notes: notes.trim() || undefined
        };
        
        console.log('📤 Sending booking data:', bookingData);
        onSubmit(bookingData);
    };

    // Reset form when modal closes
    const handleClose = () => {
        setScheduledDate('');
        setBookingTime('');
        setNotes('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];
    
    // Get current time in HH:MM format for min time (if today is selected)
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Book: ${service.name}`}>
            <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900">{service.provider?.name || 'Service Provider'}</h4>
                    <p className="text-sm text-gray-600">Base Price: ${service.basePrice}/hour</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                            Booking Date *
                        </label>
                        <input
                            type="date"
                            id="scheduledDate"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min={today}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700">
                            Booking Time *
                        </label>
                        <input
                            type="time"
                            id="bookingTime"
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min={scheduledDate === today ? currentTime : undefined}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Additional Notes (optional)
                        </label>
                        <textarea
                            id="notes"
                            rows="4"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special requests or details for the provider..."
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end pt-2 space-x-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending Request...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default BookingModal;