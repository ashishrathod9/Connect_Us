"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import ServiceService from "../services/serviceService"
import ServiceCategoryService from "../services/serviceCategoryService"
import { Search, Filter, Star, MapPin, Clock } from "lucide-react"

const Services = () => {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    fetchCategories()
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setSelectedCategory(categoryParam)
      fetchServicesByCategory(categoryParam)
    } else {
      fetchServices()
    }
  }, [searchParams])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await ServiceService.getAllServices()
      console.log("Services API Response:", response)

      // Handle the nested response structure
      let servicesData = []
      if (response?.services && Array.isArray(response.services)) {
        servicesData = response.services
      } else if (Array.isArray(response)) {
        servicesData = response
      } else if (response?.data && Array.isArray(response.data)) {
        servicesData = response.data
      }

      setServices(servicesData)
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const fetchServicesByCategory = async (categoryId) => {
    try {
      setLoading(true)
      const response = await ServiceService.getServicesByCategory(categoryId)
      console.log("Category Services API Response:", response)

      // Handle the nested response structure
      let servicesData = []
      if (response?.services && Array.isArray(response.services)) {
        servicesData = response.services
      } else if (Array.isArray(response)) {
        servicesData = response
      } else if (response?.data && Array.isArray(response.data)) {
        servicesData = response.data
      }

      setServices(servicesData)
    } catch (error) {
      console.error("Error fetching services by category:", error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await ServiceCategoryService.getAllCategories()
      console.log("Categories API Response:", response)

      // Handle different response structures for categories
      let categoriesData = []
      if (response?.categories && Array.isArray(response.categories)) {
        categoriesData = response.categories
      } else if (Array.isArray(response)) {
        categoriesData = response
      } else if (response?.data && Array.isArray(response.data)) {
        categoriesData = response.data
      }

      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      setLoading(true)
      const response = await ServiceService.searchServices(searchQuery)
      console.log("Search API Response:", response)

      // Handle the nested response structure for search
      let servicesData = []
      if (response?.services && Array.isArray(response.services)) {
        servicesData = response.services
      } else if (Array.isArray(response)) {
        servicesData = response
      } else if (response?.data && Array.isArray(response.data)) {
        servicesData = response.data
      }

      setServices(servicesData)
      setSelectedCategory("")
      setSearchParams({})
    } catch (error) {
      console.error("Error searching services:", error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryFilter = async (categoryId) => {
    setSelectedCategory(categoryId)
    if (categoryId) {
      setSearchParams({ category: categoryId })
      fetchServicesByCategory(categoryId)
    } else {
      setSearchParams({})
      fetchServices()
    }
    setSearchQuery("")
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSearchQuery("")
    setSearchParams({})
    fetchServices()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse Services</h1>
          <p className="text-gray-600">Find the perfect service provider for your needs</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-gray-600" />
              <span className="font-medium text-gray-700">Filter by Category</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleCategoryFilter("")}
              >
                All Categories
              </button>
              {categories.length > 0 &&
                categories.map((category) => (
                  <button
                    key={category._id}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleCategoryFilter(category._id)}
                  >
                    {category.name}
                  </button>
                ))}
            </div>

            {(selectedCategory || searchQuery) && (
              <button onClick={clearFilters} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No services found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all categories.</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-400 rounded flex items-center justify-center">
                      <span className="text-white text-2xl">🔧</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                  <div className="space-y-2 mb-4">
                    {service.rating && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Star size={16} className="text-yellow-400 mr-1" />
                        <span>{service.rating}</span>
                        {service.reviewCount && <span className="ml-1">({service.reviewCount} reviews)</span>}
                      </div>
                    )}

                    {service.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-1" />
                        <span>{service.location}</span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-1" />
                      <span>{service.duration ? `${service.duration} minutes` : "Duration varies"}</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  {service.category && (
                    <div className="mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {service.category.name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ${service.basePrice || service.price || "50"}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">
                        {service.unit === "fixed" ? "fixed price" : service.unit || "starting from"}
                      </span>
                    </div>

                    <Link
                      to={`/services/${service._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Services
