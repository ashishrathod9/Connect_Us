const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api"

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
    const config = {
      headers: this.getAuthHeaders(),
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
      throw error
    }
  }

  async requestWithFormData(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this.getAuthHeadersForFormData(),
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      return data
    } catch (error) {
      throw error
    }
  }
}

export default new ApiService()
