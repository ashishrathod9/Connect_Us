import ApiService from './api';

class ServiceCategoryService {
  async getAllCategories() {
    return await ApiService.request('/service-categories');
  }

  async getCategoryById(id) {
    return await ApiService.request(`/service-categories/${id}`);
  }

  async getCategoryBySlug(slug) {
    return await ApiService.request(`/service-categories/slug/${slug}`);
  }

  async createCategory(categoryData) {
    return await ApiService.request('/service-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id, categoryData) {
    return await ApiService.request(`/service-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id) {
    return await ApiService.request(`/service-categories/${id}`, {
      method: 'DELETE'
    });
  }
}

export default new ServiceCategoryService();
