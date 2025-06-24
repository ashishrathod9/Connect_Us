import ApiService from "./api"

class ServiceService {
  async getAllServices() {
    return await ApiService.request("/services")
  }

  async getServiceById(id) {
    return await ApiService.request(`/services/${id}`)
  }

  async getServicesByCategory(categoryId) {
    return await ApiService.request(`/services/category/${categoryId}`)
  }

  async searchServices(query) {
    return await ApiService.request(`/services/search?q=${encodeURIComponent(query)}`)
  }

  async createService(serviceData) {
    return await ApiService.request("/services", {
      method: "POST",
      body: JSON.stringify(serviceData),
    })
  }

  async updateService(id, serviceData) {
    return await ApiService.request(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(serviceData),
    })
  }

  async deleteService(id) {
    return await ApiService.request(`/services/${id}`, {
      method: "DELETE",
    })
  }

  // Get services by provider
  async getServicesByProvider(providerId) {
    return await ApiService.request(`/services/provider/${providerId}`)
  }

  // Get active services only
  async getActiveServices() {
    return await ApiService.request("/services?isActive=true")
  }
}

export default new ServiceService()
