import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ServiceCategoryService from "../services/serviceCategoryService"
import { Search, Star, Users, CheckCircle, ArrowRight } from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await ServiceCategoryService.getAllCategories()
      setCategories((response.categories || []).slice(0, 6))
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Trusted Local Service Providers
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Connect with verified professionals for all your home service needs. From plumbing to cleaning, we've got you covered.
              </p>

              {isAuthenticated ? (
                <Link
                  to="/services"
                  className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Browse Services
                  <ArrowRight size={20} className="ml-2" />
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <div className="bg-white/10 rounded-full p-20">
                <Users size={100} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ConnectUs?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified Professionals</h3>
              <p className="text-gray-600">
                All service providers are thoroughly vetted and verified for your peace of mind.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Star size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Read reviews and ratings from real customers to make informed decisions.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Booking</h3>
              <p className="text-gray-600">
                Simple and intuitive booking process with instant confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {isAuthenticated && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Service Categories
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/services/category/${category._id}`}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="w-8 h-8 bg-blue-600 rounded"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/services"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All Services
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of satisfied customers who trust ConnectUs for their service needs.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
