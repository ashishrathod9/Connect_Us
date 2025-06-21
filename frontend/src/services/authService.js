const API_BASE_URL = 'http://localhost:3000/api'; // Updated to match your server port

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  getAuthHeadersForFormData() {
    const token = localStorage.getItem("token");
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.getAuthHeaders(),
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async requestWithFormData(endpoint, formData) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: "POST",
        headers: this.getAuthHeadersForFormData(),
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("FormData API error:", error);
      throw error;
    }
  }

  // ============================
  // Auth-related methods
  // ============================
  async login(credentials) {
    return await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return await this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile() {
    return await this.request('/users/profile');
  }

  // ============================
  // Admin-specific methods
  // ============================
  async getAllCustomers() {
    return await this.request('/users/admin/all_customers');
  }

  async getAllProviders() {
    return await this.request('/users/admin/all_providers');
  }

  async getProviderApplications() {
    return await this.request('/users/admin/applications');
  }

  async approveProvider(id) {
    return await this.request(`/users/admin/approve/${id}`, {
      method: 'PUT',
    });
  }

  async rejectProvider(id) {
    return await this.request(`/users/admin/reject/${id}`, {
      method: 'PUT',
    });
  }

  // ============================
  // Services & Categories
  // ============================
  async getServiceCategories() {
    const data = await this.request('/service-categories');
    return data.categories || [];
  }

  async getServiceCategoryById(id) {
    const data = await this.request(`/service-categories/${id}`);
    return data.category;
  }

  async getServicesByCategory(categoryId) {
    return await this.request(`/services/category/${categoryId}`);
  }

  async getAllServices() {
    const data = await this.request('/services');
    return data.services || [];
  }

  async getServiceById(id) {
    const data = await this.request(`/services/${id}`);
    return data.service;
  }
}

export default new AuthService();