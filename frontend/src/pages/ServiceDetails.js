"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ServiceService from "../services/serviceService"
import { Star, MapPin, Clock, Phone, Mail, ArrowLeft, Calendar } from 'lucide-react'

const ServiceDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchService()
  }, [id])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await ServiceService.getServiceById(id)
      setService(response)
    } catch (error) {
      setError("Service not found")
      console.error("Error fetching service:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleHireProvider = async () => {
    setBookingLoading(true)
    setTimeout(() => {
      alert("Hire request sent! The provider will contact you soon.")
      setBookingLoading(false)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/services")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/services")}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="h-64 md:h-80 bg-gray-200 flex items-center justify-center">
                {service.image ? (
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-400 rounded"></div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={20}
                          className={
                            index < Math.floor(service.rating || 4.5) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {service.rating || "4.5"} ({service.reviewCount || "12"} reviews)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={20} className="mr-2" />
                    <span>{service.location || "Local Area"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock size={20} className="mr-2" />
                    <span>{service.duration || "1-2 hours"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={20} className="mr-2" />
                    <span>Available {service.availability || "Mon-Fri"}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">About This Service</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">What's Included</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Professional service delivery
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Quality guarantee
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Customer support
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      Flexible scheduling
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">${service.price || "50"}</div>
                <div className="text-gray-600">starting from</div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Service Provider</h4>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    {service.provider?.profilePhoto ? (
                      <img
                        src={service.provider.profilePhoto || "/placeholder.svg"}
                        alt={service.provider.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-semibold">{service.provider?.name?.charAt(0) || "P"}</span>
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium">{service.provider?.name || "Professional Provider"}</h5>
                    <p className="text-sm text-gray-600">{service.provider?.serviceType || service.category?.name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-2" />
                  <span>{service.provider?.phone || "+1 (555) 123-4567"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-2" />
                  <span>{service.provider?.email || "provider@example.com"}</span>
                </div>
              </div>

              <button
                onClick={handleHireProvider}
                disabled={bookingLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
              >
                {bookingLoading ? "Sending Request..." : "Hire Provider"}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By hiring, you agree to our terms of service. The provider will contact you to confirm details.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h4 className="font-semibold mb-3">Need Help?</h4>
              <p className="text-gray-600 mb-4">Have questions about this service? Contact our support team.</p>
              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetails
