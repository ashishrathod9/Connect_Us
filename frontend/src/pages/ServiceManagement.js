"use client"

import { useState, useEffect } from "react"
import AuthService from "../services/authService"
import { useAuth } from "../context/AuthContext"
import { Plus, Edit, Trash2, Settings, Grid } from "lucide-react"
import Modal from "../components/common/Modal"
import CategoryForm from "../components/forms/CategoryForm"
import ServiceForm from "../components/forms/ServiceForm"
import ServiceService from "../services/serviceService"

const ServiceManagement = () => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingService, setEditingService] = useState(null)
  const [formIsLoading, setFormIsLoading] = useState(false)

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [categoriesResponse, servicesResponse] = await Promise.all([
        AuthService.getServiceCategories(),
        ServiceService.getAllServices(),
      ])

      console.log("Categories Response:", categoriesResponse)
      console.log("Services Response:", servicesResponse)

      // Handle categories response structure
      let categoriesData = []
      if (categoriesResponse?.categories && Array.isArray(categoriesResponse.categories)) {
        categoriesData = categoriesResponse.categories
      } else if (Array.isArray(categoriesResponse)) {
        categoriesData = categoriesResponse
      } else if (categoriesResponse?.data && Array.isArray(categoriesResponse.data)) {
        categoriesData = categoriesResponse.data
      }

      // Handle services response structure
      let servicesData = []
      if (servicesResponse?.services && Array.isArray(servicesResponse.services)) {
        servicesData = servicesResponse.services
      } else if (Array.isArray(servicesResponse)) {
        servicesData = servicesResponse
      } else if (servicesResponse?.data && Array.isArray(servicesResponse.data)) {
        servicesData = servicesResponse.data
      }

      setCategories(categoriesData)
      setServices(servicesData)
    } catch (err) {
      setError("Failed to fetch data. Please try again.")
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const handleCategorySubmit = async (formData) => {
    setFormIsLoading(true)
    setError("")
    try {
      if (editingCategory) {
        await AuthService.updateServiceCategory(editingCategory._id, formData)
      } else {
        await AuthService.createServiceCategory(formData)
      }
      setIsCategoryModalOpen(false)
      setEditingCategory(null)
      await fetchAllData()
    } catch (err) {
      setError("Failed to save category.")
      console.error(err)
    } finally {
      setFormIsLoading(false)
    }
  }

  const handleServiceSubmit = async (formData) => {
    setFormIsLoading(true)
    setError("")
    try {
      if (editingService) {
        await AuthService.updateService(editingService._id, formData)
      } else {
        await AuthService.createService(formData)
      }
      setIsServiceModalOpen(false)
      setEditingService(null)
      await fetchAllData()
    } catch (err) {
      setError("Failed to save service.")
      console.error(err)
    } finally {
      setFormIsLoading(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setError("")
      try {
        await AuthService.deleteServiceCategory(id)
        await fetchAllData()
      } catch (err) {
        setError("Failed to delete category.")
        console.error(err)
      }
    }
  }

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setError("")
      try {
        await AuthService.deleteService(id)
        await fetchAllData()
      } catch (err) {
        setError("Failed to delete service.")
        console.error(err)
      }
    }
  }

  const openCategoryModal = (category = null) => {
    setEditingCategory(category)
    setIsCategoryModalOpen(true)
  }

  const openServiceModal = (service = null) => {
    setEditingService(service)
    setIsServiceModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Management</h1>
          <p className="text-gray-600">Manage service categories and services</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Categories Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Grid size={24} className="text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Service Categories</h2>
              </div>
              {user && user.role === "admin" && (
                <button
                  onClick={() => openCategoryModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Add Category
                </button>
              )}
            </div>

            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      {user && user.role === "admin" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openCategoryModal(category)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                    {category.slug && <p className="text-gray-400 text-xs mt-1">Slug: {category.slug}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No categories found</p>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Settings size={24} className="text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Services</h2>
              </div>
              {user && (user.role === "admin" || user.role === "provider") && (
                <button
                  onClick={() => openServiceModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Add Service
                </button>
              )}
            </div>

            {services.length > 0 ? (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {service.category?.name || "No Category"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            Price: ${service.basePrice || service.price || "N/A"}
                            {service.unit && service.unit !== "fixed" ? ` ${service.unit}` : " (fixed)"}
                          </span>
                          {service.provider && <span>Provider: {service.provider.name}</span>}
                          {service.duration && <span>Duration: {service.duration} min</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openServiceModal(service)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit Service"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No services found</p>
            )}
          </div>
        </div>

        {/* Modals */}
        <Modal
          isOpen={isCategoryModalOpen}
          onClose={() => {
            setIsCategoryModalOpen(false)
            setEditingCategory(null)
          }}
          title={editingCategory ? "Edit Category" : "Add Category"}
        >
          <CategoryForm onSubmit={handleCategorySubmit} category={editingCategory} isLoading={formIsLoading} />
        </Modal>

        <Modal
          isOpen={isServiceModalOpen}
          onClose={() => {
            setIsServiceModalOpen(false)
            setEditingService(null)
          }}
          title={editingService ? "Edit Service" : "Add Service"}
        >
          <ServiceForm
            onSubmit={handleServiceSubmit}
            service={editingService}
            categories={categories}
            isLoading={formIsLoading}
          />
        </Modal>
      </div>
    </div>
  )
}

export default ServiceManagement
