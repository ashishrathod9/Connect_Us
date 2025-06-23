const API_BASE_URL =  "https://connect-us-1.onrender.com/api"

console.log('API_BASE_URL:', API_BASE_URL)

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  getAuthHeadersForFormData() {
    const token = localStorage.getItem("token")
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    console.log('🚀 Making API request to:', url)
    
    const config = {
      headers: this.getAuthHeaders(),
      // Remove credentials temporarily
      // credentials: 'include',
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      return data
    } catch (error) {
      console.error('❌ API Request Error:', error)
      throw error
    }
  }

  async requestWithFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this.getAuthHeadersForFormData(),
        // Remove credentials temporarily
        // credentials: 'include',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      return data
    } catch (error) {
      console.error('❌ FormData Request Error:', error)
      throw error
    }
  }
}

export default new ApiService()
