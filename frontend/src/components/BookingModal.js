import React, { useState } from 'react';
import Modal from './common/Modal';

const BookingModal = ({ isOpen, onClose, onSubmit, service, isLoading }) => {
    const [bookingDate, setBookingDate] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!bookingDate) {
            setError('Please select a date for the booking.');
            return;
        }
        setError('');
        onSubmit({ serviceId: service._id, bookingDate, notes });
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Book: ${service.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">
                        Preferred Date
                    </label>
                    <input
                        type="date"
                        id="bookingDate"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        min={new Date().toISOString().split("T")[0]} // Today's date
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

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Sending Request...' : 'Confirm Booking'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default BookingModal; 