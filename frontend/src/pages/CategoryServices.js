"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import AuthService from "../services/authService"
import { ArrowLeft, Star, MapPin, Phone, Mail, User } from "lucide-react"
import ConnectUsLoader from "../components/ConnectUsLoader"

const CategoryServices = () => {
  const { categoryId } = useParams()
  const [services, setServices] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchCategoryServices = async () => {
    try {
      setLoading(true)
      const [servicesData, categoryData] = await Promise.all([
        AuthService.getServicesByCategory(categoryId),
        AuthService.getServiceCategoryById(categoryId),
      ])
      setServices(servicesData.services || servicesData || [])
      setCategory(categoryData)

      setLoading(false)
    } catch (err) {
      setError("Failed to fetch services for this category.")
      console.error(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryServices()
  }, [categoryId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ConnectUsLoader size="large" showText={true} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Category</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/services"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/services" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Services
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category ? `Services in ${category.name}` : "Category Services"}
          </h1>
          {category?.description && <p className="text-gray-600">{category.description}</p>}
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-900">{service.name}</h2>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      Available
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                  {/* Provider Information */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg mb-4">
                    <div className="flex items-center mb-2">
                      <User size={16} className="mr-2" />
                      <span className="font-semibold">{service.provider?.name || "Provider Not Assigned"}</span>
                    </div>

                    <div className="space-y-1 text-sm">
                      {service.provider?.email && (
                        <div className="flex items-center">
                          <Mail size={14} className="mr-2" />
                          <span className="truncate">{service.provider.email}</span>
                        </div>
                      )}
                      {service.provider?.phone && (
                        <div className="flex items-center">
                          <Phone size={14} className="mr-2" />
                          <span>{service.provider.phone}</span>
                        </div>
                      )}
                      {service.provider?.address && (
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-2" />
                          <span className="truncate">{service.provider.address}</span>
                        </div>
                      )}
                      {service.provider?.serviceType && (
                        <div className="flex items-center">
                          <span className="mr-2">🛠️</span>
                          <span>{service.provider.serviceType}</span>
                        </div>
                      )}
                    </div>

                    {service.provider?.status && (
                      <div className="mt-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            service.provider.status === "approved"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {service.provider.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        ${service.basePrice || service.price || "50"} {service.unit || "per service"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star size={14} className="text-yellow-400 mr-1" />
                        <span>
                          {service.rating || "4.5"} ({service.reviewCount || "12"} reviews)
                        </span>
                      </div>
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
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No services found</h3>
            <p className="text-gray-600 mb-6">There are no services available in this category yet.</p>
            <Link
              to="/services"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Services
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryServices
