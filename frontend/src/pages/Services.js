"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import ServiceService from "../services/serviceService"
import ServiceCategoryService from "../services/serviceCategoryService"
import { Search, Filter, Star, MapPin, Clock } from "lucide-react"
import ConnectUsLoader from "../components/ConnectUsLoader"
import BookingService from "../services/bookingService"

const Services = () => {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchParams, setSearchParams] = useSearchParams()
  const [showHireModal, setShowHireModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [bookingDate, setBookingDate] = useState("")
  const [bookingTime, setBookingTime] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [bookingNotes, setBookingNotes] = useState("")

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
      setLoading(false)
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
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
      setLoading(false)
    } catch (error) {
      console.error("Error fetching services by category:", error)
      setServices([])
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
      setLoading(false)
    } catch (error) {
      console.error("Error searching services:", error)
      setServices([])
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

  const handleOpenHireModal = (service) => {
    setSelectedService(service)
    setShowHireModal(true)
    setBookingDate("")
    setBookingTime("")
    setBookingError("")
    setBookingNotes("")
  }

  const handleCloseHireModal = () => {
    setShowHireModal(false)
    setSelectedService(null)
    setBookingDate("")
    setBookingTime("")
    setBookingError("")
    setBookingNotes("")
  }

  const handleHireSubmit = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingError("")
    
    try {
      // Combine date and time into ISO string
      const scheduledDateTime = new Date(`${bookingDate}T${bookingTime}`)
      
      if (isNaN(scheduledDateTime.getTime())) {
        throw new Error('Invalid date or time selected')
      }

      if (scheduledDateTime <= new Date()) {
        throw new Error('Scheduled date must be in the future')
      }

      const bookingData = {
        serviceId: selectedService._id,
        scheduledDate: scheduledDateTime.toISOString(),
        notes: bookingNotes || ''
      }

      console.log('Sending booking data:', bookingData)
      
      const response = await BookingService.createBooking(bookingData)
      
      console.log('Booking response:', response)
      
      if (response.success) {
        alert('Booking created successfully! Waiting for provider approval.')
        handleCloseHireModal()
      } else {
        setBookingError(response.message || "Failed to create booking")
      }
    } catch (error) {
      console.error('Booking creation failed:', error)
      setBookingError(error.message || "Failed to create booking")
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ConnectUsLoader size="xlarge" showText={true} />
      </div>
    )
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
        {services.length === 0 ? (
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
                    <div className="flex items-center text-sm text-gray-600">
                      <Star size={16} className="text-yellow-400 mr-1" />
                      <span>{service.rating || 0}</span>
                      <span className="ml-1">({service.reviewCount || 0} reviews)</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-1" />
                      <span>{service.provider?.address || service.provider?.location || "Location not specified"}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-1" />
                      <span>{service.duration ? `${service.duration} minutes` : "Duration varies"}</span>
                    </div>

                    {/* Difficulty Badge */}
                    <div className="flex items-center text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        service.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        service.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {service.difficulty ? service.difficulty.charAt(0).toUpperCase() + service.difficulty.slice(1) : 'Medium'}
                      </span>
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

                  {/* Keywords */}
                  {service.keywords && service.keywords.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {service.keywords.slice(0, 3).map((keyword, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                        {service.keywords.length > 3 && (
                          <span className="text-gray-500 text-xs">+{service.keywords.length - 3} more</span>
                        )}
                      </div>
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

                    {/* <Link
                      to={`/services/${service._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link> */}
                  </div>
                  <button
                    onClick={() => handleOpenHireModal(service)}
                    className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Hire Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Hire Modal */}
      {showHireModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Hire Service Provider</h2>
              <button
                onClick={handleCloseHireModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h3 className="font-semibold">{selectedService.name}</h3>
              <p className="text-sm text-gray-600">Provider: {selectedService.provider?.name}</p>
              <p className="text-sm text-gray-600">Base Price: ${selectedService.basePrice}/{selectedService.unit}</p>
            </div>
            {bookingError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {bookingError}
              </div>
            )}
            <form onSubmit={handleHireSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Date *
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Time *
                </label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={e => setBookingTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Notes
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              >
                {bookingLoading ? "Booking..." : "Confirm Hire"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Services
