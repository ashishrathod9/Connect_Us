"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import AuthService from "../services/authService"
import { User, Mail, Phone, MapPin, Edit, Save, X, Upload } from "lucide-react"

const Profile = () => {
  const authContext = useAuth()
  console.log("Auth context in Profile:", authContext)

  const { user, updateUser } = authContext
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contact: "",
    serviceType: "",
  })
  const [profilePhoto, setProfilePhoto] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        contact: user.contact || "",
        serviceType: user.serviceType || "",
      })
    }
  }, [user])
  const Profile = () => {
  const authContext = useAuth()
  console.log("Auth context in Profile:", authContext)

  const { user, updateUser } = authContext
  
  // ADD THESE DEBUG LOGS
  console.log("User object:", user)
  console.log("User type:", typeof user)
  console.log("User keys:", user ? Object.keys(user) : 'user is null/undefined')
  console.log("User name:", user?.name)
  console.log("User email:", user?.email)
  console.log("User role:", user?.role)

  // ... rest of your component
}

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0])
  }

  // In your Profile component's handleSubmit function, add this data mapping:

const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError("")
  setSuccess("")

  try {
    // Map frontend field names to backend field names
    const submitData = {
      username: formData.name,  // Backend expects 'username', frontend uses 'name'
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      contact: formData.contact,
      serviceType: formData.serviceType,
    }
    
    if (profilePhoto) {
      submitData.profile_photo = profilePhoto
    }

    console.log("Calling AuthService.updateProfile with:", submitData)
    const response = await AuthService.updateProfile(submitData)
    console.log("Profile update response:", response)

    // Handle updateUser function - check if it exists and is a function
    if (typeof updateUser === "function") {
      updateUser(response.user)
    } else {
      console.warn("updateUser function not available in AuthContext")
    }
    
    setSuccess("Profile updated successfully!")
    setIsEditing(false)
    setProfilePhoto(null)
    
  } catch (error) {
    console.error("Profile update error:", error)
    setError(error.message || "Failed to update profile")
  } finally {
    setLoading(false)
  }
}

  const handleRequestProvider = async () => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")

      await AuthService.requestProviderStatus()
      setSuccess("Provider request submitted! We will review your application.")
    } catch (error) {
      console.error("Provider request error:", error)
      setError(error.message || "Failed to submit provider request")
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setProfilePhoto(null)
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      contact: user?.contact || "",
      serviceType: user?.serviceType || "",
    })
    setError("")
    setSuccess("")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto || "/placeholder.svg"}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-blue-600">{user.name?.charAt(0) || "U"}</span>
                )}
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-blue-100 capitalize">{user.role}</p>
                {user.role === "provider" && (
                  <p className="text-blue-100">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        user.status === "approved"
                          ? "text-green-300"
                          : user.status === "inqueue"
                            ? "text-yellow-300"
                            : "text-gray-300"
                      }`}
                    >
                      {user.status}
                    </span>
                  </p>
                )}
              </div>
              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={cancelEdit}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">{success}</div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={20} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {user.role === "provider" && (
                    <>
                      <div>
                        <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                          Service Type
                        </label>
                        <input
                          type="text"
                          id="serviceType"
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                          placeholder="e.g., Plumbing, Electrical, Cleaning"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Business Address
                        </label>
                        <div className="relative">
                          <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                          Business Contact
                        </label>
                        <input
                          type="text"
                          id="contact"
                          name="contact"
                          value={formData.contact}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="profile_photo" className="block text-sm font-medium text-gray-700 mb-2">
                      Update Profile Photo
                    </label>
                    <div className="relative">
                      <Upload size={20} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="file"
                        id="profile_photo"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    {profilePhoto && <p className="mt-2 text-sm text-gray-600">Selected: {profilePhoto.name}</p>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                      <p className="text-gray-900 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>

                {user.role === "provider" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Service Type</label>
                        <p className="text-gray-900">{user.serviceType || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Business Address</label>
                        <p className="text-gray-900">{user.address || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Business Contact</label>
                        <p className="text-gray-900">{user.contact || "Not specified"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            user.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : user.status === "inqueue"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {user.role === "customer" && (
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Become a Service Provider</h3>
                    <p className="text-gray-600 mb-4">
                      Want to offer your services on our platform? Apply to become a service provider.
                    </p>
                    <button
                      onClick={handleRequestProvider}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Submitting..." : "Request Provider Status"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
