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
    return await ApiService.request(`/bookings/customer?${queryString}`)
  }

  // Get provider bookings
  async getProviderBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return await ApiService.request(`/bookings/provider?${queryString}`)
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
}

export default new BookingService()