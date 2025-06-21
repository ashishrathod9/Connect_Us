import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Services = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
      fetchCategories()
  }, [])

  const fetchCategories = async () => {
      try {
          setLoading(true)
          setError(null)
            
          const token = localStorage.getItem('token')
          const response = await fetch('http://localhost:3000/api/service-categories', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  ...(token && { Authorization: `Bearer ${token}` })
              }
          })

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          console.log('API Response:', data)

          // Extract categories array from response
          setCategories(data.categories || [])

      } catch (error) {
          console.error('Error fetching categories:', error)
          setError(error.message)
          setCategories([])
      } finally {
          setLoading(false)
      }
  }

  if (loading) {
      return (
          <div className="min-h-screen flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
      )
  }

  if (error) {
      return (
          <div className="min-h-screen flex justify-center items-center">
              <div className="text-center">
                  <div className="text-red-500 text-xl mb-4">Error loading services</div>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button 
                      onClick={fetchCategories}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                      Try Again
                  </button>
              </div>
          </div>
      )
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Choose from our wide range of professional services to meet your needs
                  </p>
              </div>

              {categories && categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categories.map((category) => (
                          <div 
                              key={category._id} 
                              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                          >
                              <div className="p-6">
                                  <div className="flex items-center mb-4">
                                      {category.imageUrl ? (
                                          <img 
                                              src={category.imageUrl} 
                                              alt={category.name}
                                              className="w-16 h-16 object-cover rounded-full mr-4 border-2 border-blue-100"
                                              onError={(e) => {
                                                  e.target.style.display = 'none'
                                              }}
                                          />
                                      ) : (
                                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                              <span className="text-blue-500 text-2xl font-bold">
                                                  {category.name.charAt(0)}
                                              </span>
                                          </div>
                                      )}
                                      <div>
                                          <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
                                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                              {category.slug}
                                          </span>
                                      </div>
                                  </div>
                                    
                                  <p className="text-gray-600 mb-6 line-clamp-3">
                                      {category.description}
                                  </p>
                                    
                                  <div className="flex justify-between items-center">
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                          category.isActive 
                                              ? 'bg-green-100 text-green-800' 
                                              : 'bg-red-100 text-red-800'
                                      }`}>
                                          {category.isActive ? 'Available' : 'Unavailable'}
                                      </span>
                                        
                                      <Link 
                                          to={`/services/category/${category._id}`}
                                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                                      >
                                          View Services
                                      </Link>
                                  </div>
                              </div>
                                
                              <div className="bg-gray-50 px-6 py-3 rounded-b-xl">
                                  <p className="text-sm text-gray-500">
                                      Created: {new Date(category.createdAt).toLocaleDateString()}
                                  </p>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-16">
                      <div className="text-gray-400 text-6xl mb-4">🔧</div>
                      <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Services Available</h3>
                      <p className="text-gray-500 mb-6">We're working on adding new service categories. Please check back later.</p>
                      <button 
                          onClick={fetchCategories}
                          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                          Refresh
                      </button>
                  </div>
              )}
          </div>
      </div>
  )
}

export default Services
