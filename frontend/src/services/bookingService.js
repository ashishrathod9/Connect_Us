import ApiService from './api'

class BookingService {
  // Create new booking
  async createBooking(bookingData) {
    console.log('🎯 BookingService.createBooking called with:', bookingData)
    
    // Validate data before sending
    if (!bookingData.serviceId) {
      throw new Error('Service ID is required')
    }
    
    if (!bookingData.scheduledDate) {
      throw new Error('Scheduled date is required')
    }
    
    console.log('🎯 Sending request to /bookings endpoint...')
    
    try {
      const response = await ApiService.request('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      })
      
      console.log('🎯 Booking response received:', response)
      return response
    } catch (error) {
      console.error('🎯 Booking request failed:', error)
      throw error
    }
  }

  // Get customer bookings
  async getCustomerBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/bookings/customer?${queryString}` : '/bookings/customer'
    return await ApiService.request(endpoint)
  }

  // Get provider bookings
  async getProviderBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/bookings/provider?${queryString}` : '/bookings/provider'
    return await ApiService.request(endpoint)
  }

  // Get booking details
  async getBookingDetails(bookingId) {
    return await ApiService.request(`/bookings/${bookingId}`)
  }

  // Update booking status (for providers)
  async updateBookingStatus(bookingId, status) {
    return await ApiService.request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  }

  // Cancel booking
  async cancelBooking(bookingId) {
    return await ApiService.request(`/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    })
  }

  // Get booking by ID
  async getBookingById(bookingId) {
    return await ApiService.request(`/bookings/${bookingId}`)
  }

  async getMyBookings() {
    return await ApiService.request('/bookings/my-bookings')
  }

  async getProviderBookings() {
    return await ApiService.request('/bookings/provider/bookings')
  }

  async getAllBookings() {
    return await ApiService.request('/bookings/all')
  }
}

export default new BookingService()