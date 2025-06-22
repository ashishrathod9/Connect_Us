import ApiService from "./api"

class AuthService {
  async register(userData) {
    return await ApiService.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials) {
    return await ApiService.request("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async logout() {
    return await ApiService.request("/users/logout")
  }

  async getProfile() {
    return await ApiService.request("/users/profile")
  }

  async updateProfile(userData) {
    console.log("Sending update data:", userData) // Debug log

    const response = await ApiService.request("/users/profile/update", {
      method: "PUT",
      body: JSON.stringify(userData),
    })

    console.log("Update profile response:", response) // Debug log

    return response
  }

  async requestProviderStatus() {
    return await ApiService.request("/users/request/provider", {
      method: "POST",
    })
  }

  // Admin methods
  async getAllCustomers() {
    return await ApiService.request("/users/admin/all_customers")
  }

  async getAllProviders() {
    return await ApiService.request("/users/admin/all_providers")
  }

  async getProviderApplications() {
    return await ApiService.request("/users/admin/applications")
  }

  async approveProvider(id) {
    return await ApiService.request(`/users/admin/approve/${id}`, {
      method: "PUT",
    })
  }

  async rejectProvider(id) {
    return await ApiService.request(`/users/admin/reject/${id}`, {
      method: "PUT",
    })
  }

  // Search services
  async searchServices(query) {
    return await ApiService.request(`/services/search?q=${encodeURIComponent(query)}`)
  }

  // Get services by category
  async getServicesByCategory(categoryId) {
    return await ApiService.request(`/services/category/${categoryId}`)
  }

  // Get service category by ID
  async getServiceCategoryById(categoryId) {
    return await ApiService.request(`/service-categories/${categoryId}`)
  }

  // Get all service categories
  async getServiceCategories() {
    return await ApiService.request("/service-categories")
  }

  // Create service category
  async createServiceCategory(categoryData) {
    return await ApiService.request("/service-categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    })
  }

  // Update service category
  async updateServiceCategory(id, categoryData) {
    return await ApiService.request(`/service-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    })
  }

  // Delete service category
  async deleteServiceCategory(id) {
    return await ApiService.request(`/service-categories/${id}`, {
      method: "DELETE",
    })
  }

  // Create service
  async createService(serviceData) {
    return await ApiService.request("/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    })
  }

  // Update service
  async updateService(id, serviceData) {
    return await ApiService.request(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(serviceData),
    })
  }

  // Delete service
  async deleteService(id) {
    return await ApiService.request(`/services/${id}`, {
      method: "DELETE",
    })
  }

  // Get all services
  async getAllServices() {
    return await ApiService.request("/services")
  }

  // Hire related methods (previously booking methods)
  async getCustomerHires() {
    return await ApiService.request("/bookings/customer")
  }

  async getProviderHires() {
    return await ApiService.request("/bookings/provider")
  }

  async updateHireStatus(hireId, status) {
    return await ApiService.request(`/bookings/${hireId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  async createHire(hireData) {
    return await ApiService.request("/bookings", {
      method: "POST",
      body: JSON.stringify(hireData),
    })
  }
}

export default new AuthService()
