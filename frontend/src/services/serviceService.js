import ApiService from "./api"

class ServiceService {
  async getAllServices() {
    try {
      const response = await ApiService.request("/services")
      console.log("ServiceService.getAllServices response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.getAllServices error:", error)
      throw error
    }
  }

  async getServiceById(id) {
    try {
      if (!id) {
        throw new Error("Service ID is required")
      }
      const response = await ApiService.request(`/services/${id}`)
      console.log("ServiceService.getServiceById response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.getServiceById error:", error)
      throw error
    }
  }

  async getServicesByCategory(categoryId) {
    try {
      if (!categoryId) {
        throw new Error("Category ID is required")
      }
      const response = await ApiService.request(`/services/category/${categoryId}`)
      console.log("ServiceService.getServicesByCategory response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.getServicesByCategory error:", error)
      throw error
    }
  }

  async searchServices(query) {
    try {
      if (!query || !query.trim()) {
        throw new Error("Search query is required")
      }
      const response = await ApiService.request(`/services/search?q=${encodeURIComponent(query.trim())}`)
      console.log("ServiceService.searchServices response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.searchServices error:", error)
      throw error
    }
  }

  async createService(serviceData) {
    try {
      // Validate required fields according to model
      if (!serviceData.name || !serviceData.name.trim()) {
        throw new Error("Service name is required")
      }
      
      if (!serviceData.description || !serviceData.description.trim()) {
        throw new Error("Service description is required")
      }
      
      if (!serviceData.category) {
        throw new Error("Service category is required")
      }
      
      if (!serviceData.basePrice || serviceData.basePrice <= 0) {
        throw new Error("Valid base price is required")
      }
      
      if (!serviceData.unit) {
        throw new Error("Pricing unit is required")
      }

      // Ensure data matches model structure
      const formattedData = {
        name: serviceData.name.trim(),
        description: serviceData.description.trim(),
        category: serviceData.category,
        basePrice: Number(serviceData.basePrice),
        unit: serviceData.unit,
        imageUrl: serviceData.imageUrl?.trim() || undefined,
        keywords: Array.isArray(serviceData.keywords) ? serviceData.keywords : [],
        duration: Number(serviceData.duration) || 60,
        difficulty: serviceData.difficulty || 'medium',
        requirements: Array.isArray(serviceData.requirements) ? serviceData.requirements : [],
        isActive: Boolean(serviceData.isActive !== undefined ? serviceData.isActive : true)
      }

      console.log("ServiceService.createService sending:", formattedData)
      
      const response = await ApiService.request("/services", {
        method: "POST",
        body: JSON.stringify(formattedData),
      })
      
      console.log("ServiceService.createService response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.createService error:", error)
      throw error
    }
  }

  async updateService(id, serviceData) {
    try {
      if (!id) {
        throw new Error("Service ID is required")
      }

      // Validate required fields according to model
      if (!serviceData.name || !serviceData.name.trim()) {
        throw new Error("Service name is required")
      }
      
      if (!serviceData.description || !serviceData.description.trim()) {
        throw new Error("Service description is required")
      }
      
      if (!serviceData.category) {
        throw new Error("Service category is required")
      }
      
      if (!serviceData.basePrice || serviceData.basePrice <= 0) {
        throw new Error("Valid base price is required")
      }

      // Ensure data matches model structure
      const formattedData = {
        name: serviceData.name.trim(),
        description: serviceData.description.trim(),
        category: serviceData.category,
        basePrice: Number(serviceData.basePrice),
        unit: serviceData.unit,
        imageUrl: serviceData.imageUrl?.trim() || undefined,
        keywords: Array.isArray(serviceData.keywords) ? serviceData.keywords : [],
        duration: Number(serviceData.duration) || 60,
        difficulty: serviceData.difficulty || 'medium',
        requirements: Array.isArray(serviceData.requirements) ? serviceData.requirements : [],
        isActive: Boolean(serviceData.isActive !== undefined ? serviceData.isActive : true)
      }

      console.log("ServiceService.updateService sending:", formattedData)
      
      const response = await ApiService.request(`/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(formattedData),
      })
      
      console.log("ServiceService.updateService response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.updateService error:", error)
      throw error
    }
  }

  async deleteService(id) {
    try {
      if (!id) {
        throw new Error("Service ID is required")
      }
      
      const response = await ApiService.request(`/services/${id}`, {
        method: "DELETE",
      })
      
      console.log("ServiceService.deleteService response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.deleteService error:", error)
      throw error
    }
  }

  // Get services by provider
  async getServicesByProvider(providerId) {
    try {
      if (!providerId) {
        throw new Error("Provider ID is required")
      }
      
      const response = await ApiService.request(`/services/provider/${providerId}`)
      console.log("ServiceService.getServicesByProvider response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.getServicesByProvider error:", error)
      throw error
    }
  }

  // Get active services only
  async getActiveServices() {
    try {
      const response = await ApiService.request("/services?isActive=true")
      console.log("ServiceService.getActiveServices response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.getActiveServices error:", error)
      throw error
    }
  }

  // Get services by difficulty
  async getServicesByDifficulty(difficulty) {
    try {
      if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
        throw new Error("Valid difficulty level is required (easy, medium, hard)")
      }
      
      const response = await ApiService.request(`/services?difficulty=${difficulty}`)
      console.log("ServiceService.getServicesByDifficulty response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.getServicesByDifficulty error:", error)
      throw error
    }
  }

  // Get services by price range
  async getServicesByPriceRange(minPrice, maxPrice) {
    try {
      if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
        throw new Error("Valid price range is required")
      }
      
      const response = await ApiService.request(`/services?minPrice=${minPrice}&maxPrice=${maxPrice}`)
      console.log("ServiceService.getServicesByPriceRange response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.getServicesByPriceRange error:", error)
      throw error
    }
  }

  // Get services by keywords
  async getServicesByKeywords(keywords) {
    try {
      if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        throw new Error("Keywords array is required")
      }
      
      const keywordQuery = keywords.join(',')
      const response = await ApiService.request(`/services/keywords?keywords=${encodeURIComponent(keywordQuery)}`)
      console.log("ServiceService.getServicesByKeywords response:", response)
      return response
    } catch (error) {
      console.error("ServiceService.getServicesByKeywords error:", error)
      throw error
    }
  }
}

export default new ServiceService()
