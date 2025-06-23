import React, { useState, useEffect } from 'react'
import BookingService from '../services/bookingService'

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [filter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await BookingService.getProviderBookings(params)
      
      if (response.success) {
        setBookings(response.bookings)
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const response = await BookingService.updateBookingStatus(bookingId, status)
      
      if (response.success) {
        // Update the booking in the list
        setBookings(prev => 
          prev.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status } 
              : booking
          )
        )
        alert(`Booking ${status} successfully!`)
      }
    } catch (err) {
      alert(err.message || 'Failed to update booking status')
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service Requests</h1>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No booking requests found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{booking.service.name}</h3>
                  <p className="text-gray-600">Customer: {booking.customer.name}</p>
                  <p className="text-gray-600">Email: {booking.customer.email}</p>
                  {booking.customer.phone && (
                    <p className="text-gray-600">Phone: {booking.customer.phone}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {(booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Requested Date & Time</p>
                  <p className="font-medium">
                    {formatDate(booking.bookingDate)} at {booking.bookingTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">{booking.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium text-green-600">${booking.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium">{booking.paymentStatus}</p>
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
                  <p className="text-sm bg-gray-50 p-2 rounded">{booking.specialRequirements}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, 'approved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                
                {booking.status === 'approved' && booking.paymentStatus === 'paid' && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProviderBookings