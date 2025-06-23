"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import AuthService from "../services/authService"
import CloudinaryService from "../services/cloudinary"
import { User, Mail, Phone, MapPin, Edit, Save, X, Upload } from "lucide-react"
import ConnectUsLoader from "../components/ConnectUsLoader"

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
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
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null)

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setProfilePhoto(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfilePhotoPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setProfilePhoto(null)
    setProfilePhotoPreview(null)
    // Reset file input
    const fileInput = document.getElementById("profilePhoto")
    if (fileInput) fileInput.value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const submitData = { ...formData }

      // Upload image to Cloudinary if selected
      if (profilePhoto) {
        setUploadingImage(true)
        try {
          const uploadResult = await CloudinaryService.uploadImage(profilePhoto, "connectus/profiles")
          submitData.profilePhoto = uploadResult.url // Use profilePhoto field instead
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError)
          setError("Failed to upload profile photo. Please try again.")
          setLoading(false)
          setUploadingImage(false)
          return
        }
        setUploadingImage(false)
      }

      const response = await AuthService.updateProfile(submitData)
      updateUser(response.user)
      setSuccess("Profile updated successfully!")
      setIsEditing(false)
      setProfilePhoto(null)
      setProfilePhotoPreview(null)
    } catch (error) {
      setError(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestProvider = async () => {
    try {
      setLoading(true)
      await AuthService.requestProviderStatus()
      setSuccess("Provider request submitted! We will review your application.")
    } catch (error) {
      setError(error.message || "Failed to submit provider request")
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setProfilePhoto(null)
    setProfilePhotoPreview(null)
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      contact: user.contact || "",
      serviceType: user.serviceType || "",
    })
    setError("")
    setSuccess("")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ConnectUsLoader size="large" showText={true} />
      </div>
    )
  }

  const getProfileImageUrl = () => {
    // Use the existing profilePhoto field
    if (user.profilePhoto) {
      // If it's a Cloudinary URL, optimize it
      if (user.profilePhoto.includes("cloudinary.com")) {
        return CloudinaryService.getOptimizedUrl(user.profilePhoto, {
          width: 96,
          height: 96,
          crop: "fill",
        })
      }
      return user.profilePhoto
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {getProfileImageUrl() ? (
                  <img
                    src={getProfileImageUrl() || "/placeholder.svg"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-blue-600">{(user.name || "U").charAt(0)}</span>
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
                    <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700 mb-2">
                      Update Profile Photo
                    </label>

                    {profilePhotoPreview ? (
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={profilePhotoPreview || "/placeholder.svg"}
                            alt="Profile preview"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">Selected: {profilePhoto?.name}</p>
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove Photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Upload size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="file"
                          id="profilePhoto"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Save size={16} />
                    {uploadingImage ? "Uploading..." : loading ? "Saving..." : "Save Changes"}
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
