"use client"

import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import AuthService from "../services/authService"
import { Search, Star, MapPin, Phone, Mail, User, ArrowLeft } from "lucide-react"
import ConnectUsLoader from "../components/ConnectUsLoader"

const SearchResultPage = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const location = useLocation()

  const query = new URLSearchParams(location.search).get("q")

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      try {
        setLoading(true)
        const response = await AuthService.searchServices(query)
        setResults(response || [])

        setLoading(false)
      } catch (err) {
        setError("An error occurred while searching.")
        console.error(err)
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Error</h2>
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
          <div className="flex items-center mb-4">
            <Search size={24} className="text-gray-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Search Results for "{query}"</h1>
          </div>
          <p className="text-gray-600">Found {results.length} service(s) matching your search</p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Available
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                  {/* Provider Information */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg mb-4">
                    <div className="flex items-center mb-3">
                      <User size={20} className="mr-2" />
                      <span className="font-semibold text-lg">{service.provider?.name || "Provider Not Assigned"}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {service.provider?.email && (
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2" />
                          <span className="truncate">{service.provider.email}</span>
                        </div>
                      )}
                      {service.provider?.phone && (
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2" />
                          <span>{service.provider.phone}</span>
                        </div>
                      )}
                      {service.provider?.address && (
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
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
                          Status: {service.provider.status}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Service Details */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.category?.name && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {service.category.name}
                      </span>
                    )}
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      ${service.basePrice || service.price || "50"} {service.unit || "per service"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 mr-1" />
                      <span className="text-gray-600 text-sm">
                        {service.rating || "4.5"} ({service.reviewCount || "12"} reviews)
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
        ) : (
          <div className="text-center py-12">
            <Search size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No services found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any services matching "{query}". Try adjusting your search terms.
            </p>
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

export default SearchResultPage
