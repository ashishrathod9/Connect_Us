import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ServiceService from '../services/serviceService';
import BookingService from '../services/bookingService';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Service data state
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking modal state
  const [showHireModal, setShowHireModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Fetch service details
  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await ServiceService.getServiceById(id);
      setService(response.service || response);
    } catch (err) {
      setError('Failed to load service details');
      console.error('Error fetching service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenHireModal = () => {
    setShowHireModal(true);
    setBookingError('');
  };

  const handleCloseHireModal = () => {
    setShowHireModal(false);
    setBookingDate('');
    setBookingTime('');
    setBookingNotes('');
    setBookingError('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!bookingDate) {
      setBookingError('Please select a date for the booking.');
      return;
    }
    
    if (!bookingTime) {
      setBookingError('Please select a time for the booking.');
      return;
    }

    // Combine date and time into proper datetime format
    const combinedDateTime = `${bookingDate}T${bookingTime}:00`;
    
    // Validate that the selected date/time is in the future
    const selectedDateTime = new Date(combinedDateTime);
    if (selectedDateTime <= new Date()) {
      setBookingError('Please select a future date and time.');
      return;
    }

    setBookingError('');
    setBookingLoading(true);
    
    try {
      // Prepare booking data with the correct field name expected by backend
      const bookingData = {
        serviceId: service._id,
        scheduledDate: combinedDateTime,  // Use 'scheduledDate' to match backend
        notes: bookingNotes.trim() || undefined
      };
      
      console.log('📤 Sending booking data:', bookingData);
      
      const response = await BookingService.createBooking(bookingData);

      if (response.success) {
        alert('Booking request sent successfully!');
        handleCloseHireModal();
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
      
    } catch (err) {
      setBookingError(err.message || 'Failed to create booking');
      console.error('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  // Get today's date and current time for validation
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Service not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Services
        </button>

        {/* Service Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Service Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{service.description}</p>
                
                {/* Provider Info */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Service Provider</h3>
                  <p className="text-gray-700">{service.provider?.name || 'Provider Name'}</p>
                  <p className="text-sm text-gray-600">{service.provider?.email || 'provider@example.com'}</p>
                </div>

                {/* Price and Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Base Price:</span>
                    <p className="text-2xl font-bold text-green-600">
                      ${service.basePrice || service.price}/{service.unit || 'service'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Category:</span>
                    <p className="font-medium text-gray-900">{service.category?.name || 'General'}</p>
                  </div>
                </div>

                {/* Additional Service Info */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-sm text-gray-600">Duration:</span>
                    <p className="font-medium text-gray-900">{service.duration || 60} minutes</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Difficulty:</span>
                    <p className="font-medium text-gray-900 capitalize">{service.difficulty || 'medium'}</p>
                  </div>
                </div>
              </div>
              
              {/* Hire Button */}
              <button
                onClick={handleOpenHireModal}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                Hire Service Provider
              </button>
            </div>
          </div>

          {/* Additional Service Info */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Service Details</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700">{service.description}</p>
            </div>
            
            {/* Keywords */}
            {service.keywords && service.keywords.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Keywords:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.keywords.map((keyword, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {service.requirements && service.requirements.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Requirements:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {service.requirements.map((requirement, index) => (
                    <li key={index} className="text-gray-700">{requirement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showHireModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Hire Service Provider</h2>
                <button
                  onClick={handleCloseHireModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Service Summary */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900">{service.provider?.name || 'Service Provider'}</h4>
                <p className="text-sm text-gray-600">Base Price: ${service.basePrice || service.price}/{service.unit || 'service'}</p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Date Input */}
                <div>
                  <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Date *
                  </label>
                  <input
                    type="date"
                    id="bookingDate"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    min={today}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Time Input */}
                <div>
                  <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Time *
                  </label>
                  <input
                    type="time"
                    id="bookingTime"
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    min={bookingDate === today ? currentTime : undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="bookingNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    id="bookingNotes"
                    value={bookingNotes}
                    onChange={e => setBookingNotes(e.target.value)}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Booking Summary */}
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Booking Summary:</strong><br />
                    Service: {service.name}<br />
                    Date: {bookingDate ? new Date(bookingDate).toLocaleDateString() : 'Not selected'}<br />
                    Time: {bookingTime || 'Not selected'}<br />
                    Price: ${service.basePrice || service.price}/{service.unit || 'service'}
                  </p>
                </div>

                {/* Error Message */}
                {bookingError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{bookingError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={bookingLoading || !bookingDate || !bookingTime}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? "Creating Booking..." : "Confirm Booking"}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={handleCloseHireModal}
                  className="w-full mt-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
              </form>

              {/* Info Text */}
              <div className="mt-4 text-xs text-gray-500">
                <p>• Your booking request will be sent to the provider</p>
                <p>• You'll receive confirmation once approved</p>
                <p>• Payment will be processed after service completion</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;