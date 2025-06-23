"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ServiceCategoryService from "../services/serviceCategoryService"
import {
  Star,
  Users,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
  Heart,
  Wrench,
  Sparkles,
  HomeIcon,
  Zap,
  Paintbrush,
  Bug,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import ConnectUsLoader from "../components/ConnectUsLoader"

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedFaq, setExpandedFaq] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const startTime = Date.now()
      setLoading(true)
      const response = await ServiceCategoryService.getAllCategories()
      setCategories(response.slice(0, 6))

      // Ensure minimum 3 second loading time
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, 3000 - elapsedTime)

      setTimeout(() => {
        setLoading(false)
      }, remainingTime)
    } catch (error) {
      console.error("Error fetching categories:", error)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }
  }

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const testimonials = [
    {
      name: "Priya S.",
      location: "Ahmedabad",
      text: "Connect Us saved me! I needed a last-minute repair, and I found a fantastic plumber within minutes. Highly recommend!",
      rating: 5,
    },
    {
      name: "Rajesh K.",
      role: "Electrician",
      text: "As a freelancer, Connect Us has been a game-changer. I get steady work, and the platform makes managing my bookings a breeze.",
      rating: 5,
    },
    {
      name: "Anjali M.",
      role: "Homeowner",
      text: "Finally, a platform where I can find reliable help without the hassle. The service providers are truly top-notch.",
      rating: 5,
    },
  ]

  const featuredServices = [
    { name: "Home Repairs", icon: HomeIcon, color: "bg-orange-100 text-orange-600" },
    { name: "Cleaning Services", icon: Sparkles, color: "bg-purple-100 text-purple-600" },
    { name: "Plumbing & Electrical", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
    { name: "Appliance Repair", icon: Wrench, color: "bg-blue-100 text-blue-600" },
    { name: "Painting & Decorating", icon: Paintbrush, color: "bg-green-100 text-green-600" },
    { name: "Pest Control", icon: Bug, color: "bg-red-100 text-red-600" },
  ]

  const faqs = [
    {
      question: "How does Connect Us ensure service quality?",
      answer:
        "We thoroughly vet all service providers through background checks, skill verification, and customer reviews. Our quality assurance team continuously monitors performance to maintain high standards.",
    },
    {
      question: "Is Connect Us free to use for customers?",
      answer:
        "Yes! Creating an account and browsing services is completely free for customers. You only pay for the services you book directly with the service providers.",
    },
    {
      question: "How do service providers get paid?",
      answer:
        "Service providers receive payment directly from customers upon job completion. We offer secure payment processing and can facilitate digital payments for convenience.",
    },
    {
      question: "What if I need to cancel or reschedule?",
      answer:
        "You can easily cancel or reschedule through your account dashboard. Our flexible cancellation policy allows changes up to 24 hours before the scheduled service time.",
    },
    {
      question: "How do you verify service providers?",
      answer:
        "Our verification process includes identity verification, skill assessment, background checks, insurance verification, and reference checks to ensure you get reliable, qualified professionals.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Connect Us: Your Local Service Hub
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Need a Helping Hand? Find Trusted Local Services in Minutes.
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                From home repairs to deep cleaning, Connect Us instantly links you with skilled professionals in your
                neighborhood. Get it done right, right now.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/services"
                      className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                    >
                      Find Local Pros
                      <ArrowRight size={20} className="ml-2" />
                    </Link>
                    <Link
                      to="/services"
                      className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
                    >
                      Get a Free Quote
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                    >
                      Book a Service Now
                      <ArrowRight size={20} className="ml-2" />
                    </Link>
                    <Link
                      to="/register?type=provider"
                      className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
                    >
                      Become a Provider
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>Verified Professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} />
                  <span>Secure Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Quick Response</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="bg-gradient-to-br from-white/20 to-white/10 rounded-full p-12 mb-6">
                    <Users size={80} className="text-white mx-auto" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">10,000+</div>
                    <div className="text-blue-100">Happy Customers</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Trusted
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get the help you need</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* For Customers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full">For Customers</span>
              </h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Tell Us What You Need</h4>
                    <p className="text-gray-600">
                      Briefly describe your task or select from our comprehensive list of services.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Get Matched with Pros</h4>
                    <p className="text-gray-600">
                      Browse profiles of qualified local service providers with reviews and ratings.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Book & Relax</h4>
                    <p className="text-gray-600">Choose your pro, schedule a time, and let them handle the rest!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Service Providers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full">For Service Providers</span>
              </h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Create Your Profile</h4>
                    <p className="text-gray-600">
                      Showcase your skills, services, and experience to attract customers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Get Verified</h4>
                    <p className="text-gray-600">Our quick approval process ensures trust and quality for all users.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Start Getting Jobs</h4>
                    <p className="text-gray-600">
                      Connect with customers actively seeking your expertise and grow your business.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Connect Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Connect Us?</h2>
            <p className="text-xl text-gray-600">The benefits that make us your best choice</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Shield size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Trusted Professionals</h3>
              <p className="text-gray-600">
                We vet all our service providers for quality and reliability, ensuring peace of mind.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Clock size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Convenience at Your Fingertips</h3>
              <p className="text-gray-600">
                Book services anytime, anywhere, directly from your device with our easy-to-use platform.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <DollarSign size={40} className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Transparent Pricing</h3>
              <p className="text-gray-600">
                Get clear quotes upfront with no hidden fees. Know exactly what you'll pay before booking.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Heart size={40} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Support Local Businesses</h3>
              <p className="text-gray-600">
                Empower your community by hiring local talent and supporting neighborhood businesses.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Seamless Booking & Management</h3>
              <p className="text-gray-600">
                Easy-to-use tools for scheduling, communication, and payments make everything simple.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Wrench size={40} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Wide Range of Services</h3>
              <p className="text-gray-600">
                From handyman tasks to deep cleaning, plumbing to electrical, we've got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Services</h2>
            <p className="text-xl text-gray-600">Popular categories to get you started</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Link
                  key={index}
                  to={isAuthenticated ? "/services" : "/register"}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <div
                    className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <IconComponent size={32} />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{service.name}</h3>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {isAuthenticated && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Available Service Categories</h2>
              <p className="text-xl text-gray-600">Browse our comprehensive service offerings</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <ConnectUsLoader />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/services?category=${category._id}`}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <div className="w-8 h-8 bg-white rounded-lg"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{category.name}</h3>
                    <p className="text-gray-600">{category.description}</p>
                    <div className="mt-4 flex items-center text-blue-600 font-medium">
                      <span>Explore services</span>
                      <ArrowRight size={16} className="ml-2" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/services"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Services
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Are Saying</h2>
            <p className="text-xl text-gray-600">Real feedback from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location || testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Simplify Your Life?</h2>
          <p className="text-xl mb-8 text-blue-100">
            {isAuthenticated
              ? "Browse our services and find the perfect professional for your needs."
              : "Join thousands of satisfied customers who trust Connect Us for their service needs."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/services"
                className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Book a Service Today!
                <ArrowRight size={20} className="ml-2" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  Book a Service Today!
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link
                  to="/register?type=provider"
                  className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
                >
                  Are You a Service Pro? Join Connect Us!
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
