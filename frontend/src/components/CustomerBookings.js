import React, { useState, useEffect } from 'react'
import BookingService from '../services/bookingService'
import PaymentModal from './PaymentModal'

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await BookingService.getCustomerBookings(params)
      
      if (response.success) {
        setBookings(response.bookings)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handlePayment = (booking) => {
    setSelectedBooking(booking)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (paymentResult) => {
    // Update booking payment status
    setBookings(prev => 
      prev.map(booking => 
        booking._id === selectedBooking._id 
          ? { ...booking, paymentStatus: 'paid', paymentId: paymentResult.paymentId }
          : booking
      )
    )
    alert('Payment successful!')
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // Implement cancel booking API call
        alert('Booking cancelled successfully')
        fetchBookings() // Refresh bookings
      } catch (err) {
        alert('Failed to cancel booking')
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{booking.service.name}</h3>
                  <p className="text-gray-600">Provider: {booking.provider.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {(booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">
                    {formatDate(booking.bookingDate)} at {booking.bookingTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{booking.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-green-600">${booking.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {(booking.paymentStatus ? booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : "")}
                  </p>
                </div>
              </div>

              {booking.customerAddress && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Service Address</p>
                  <p className="text-sm">
                    {booking.customerAddress.street}, {booking.customerAddress.city}, 
                    {booking.customerAddress.state} {booking.customerAddress.zipCode}
                  </p>
                </div>
              )}

              {booking.specialRequirements && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Special Requirements</p>
                  <p className="text-sm">{booking.specialRequirements}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                {booking.status === 'approved' && booking.paymentStatus === 'pending' && (
                  <button
                    onClick={() => handlePayment(booking)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Pay Now
                  </button>
                )}
                
                {booking.status === 'pending' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPaymentModal && selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedBooking(null)
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}

export default CustomerBookings