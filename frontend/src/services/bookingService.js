import ApiService from './api'

class BookingService {
  // Create new booking with enhanced validation
  async createBooking(bookingData) {
    console.log('🎯 BookingService.createBooking called with:', bookingData)
    
    // Client-side validation before sending
    if (!bookingData.scheduledDate) {
      throw new Error('Scheduled date is required')
    }
    
    if (!bookingData.serviceId) {
      throw new Error('Service ID is required')
    }
    
    // Validate date format and future date
    const scheduledDate = new Date(bookingData.scheduledDate);
    if (isNaN(scheduledDate.getTime())) {
      throw new Error('Invalid date format')
    }
    
    if (scheduledDate <= new Date()) {
      throw new Error('Scheduled date must be in the future')
    }
    
    console.log('🎯 Sending request to /bookings endpoint...')
    
    try {
      const response = await ApiService.request('/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })
      
      console.log('🎯 Booking response received:', response)
      return response
    } catch (error) {
      console.error('🎯 Booking request failed:', error)
      
      // Enhanced error handling
      if (error.message.includes('Route not found')) {
        console.error('❌ Booking route not found - check server routing!')
        throw new Error('Booking service is currently unavailable. Please try again later.')
      }
      
      if (error.message.includes('Scheduled date is required')) {
        throw new Error('Please select a valid date and time for your booking.')
      }
      
      // Re-throw the original error if it's not a routing issue
      throw error
    }
  }

  // Test connection to booking routes
  async testBookingConnection() {
    try {
      console.log('🧪 Testing booking route connection...')
      const response = await ApiService.request('/bookings/test')
      console.log('✅ Booking routes are accessible:', response)
      return response
    } catch (error) {
      console.error('❌ Booking routes test failed:', error)
      throw error
    }
  }

  // Get customer bookings
  async getCustomerBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/bookings/my-bookings?${queryString}` : '/bookings/my-bookings'
    return await ApiService.request(endpoint)
  }

  // Get provider bookings
  async getProviderBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/bookings/provider/bookings?${queryString}` : '/bookings/provider/bookings'
    return await ApiService.request(endpoint)
  }

  // Get booking details
  async getBookingDetails(bookingId) {
    if (!bookingId) {
      throw new Error('Booking ID is required')
    }
    return await ApiService.request(`/bookings/${bookingId}`)
  }

  // Update booking status (for providers)
  async updateBookingStatus(bookingId, status) {
    if (!bookingId || !status) {
      throw new Error('Booking ID and status are required')
    }
    return await ApiService.request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    })
  }

  // Cancel booking
  async cancelBooking(bookingId) {
    if (!bookingId) {
      throw new Error('Booking ID is required')
    }
    return await ApiService.request(`/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    })
  }

  // Get all bookings (admin)
  async getAllBookings() {
    return await ApiService.request('/bookings/all')
  }
}

export default new BookingService()