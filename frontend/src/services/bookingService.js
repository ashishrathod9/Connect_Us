import ApiService from './api'

class BookingService {
  // Create new booking
  async createBooking(bookingData) {
    return await ApiService.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })
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
      method: 'PUT',
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
}

export default new BookingService()