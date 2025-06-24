"use client"

import { useState, useEffect } from "react"

const ServiceForm = ({ onSubmit, service, categories, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    unit: "per service",
    imageUrl: "",
    keywords: "",
    duration: 60,
    difficulty: "medium",
    requirements: "",
    isActive: true,
  })

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : []

  // Debug logging
  useEffect(() => {
    console.log("ServiceForm rendered with fields:", Object.keys(formData))
    console.log("Categories received:", categories)
    console.log("Safe categories:", safeCategories)
  }, [formData, categories, safeCategories])

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        category: service.category?._id || service.category || "",
        basePrice: service.basePrice || "",
        unit: service.unit || "per service",
        imageUrl: service.imageUrl || "",
        keywords: Array.isArray(service.keywords) ? service.keywords.join(", ") : "",
        duration: service.duration || 60,
        difficulty: service.difficulty || "medium",
        requirements: Array.isArray(service.requirements) ? service.requirements.join(", ") : "",
        isActive: service.isActive !== undefined ? service.isActive : true,
      })
    } else {
      // Reset form for new service
      setFormData({
        name: "",
        description: "",
        category: "",
        basePrice: "",
        unit: "per service",
        imageUrl: "",
        keywords: "",
        duration: 60,
        difficulty: "medium",
        requirements: "",
        isActive: true,
      })
    }
  }, [service])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form data
    if (!formData.name.trim()) {
      alert("Service name is required")
      return
    }
    
    if (!formData.description.trim()) {
      alert("Service description is required")
      return
    }
    
    if (!formData.category) {
      alert("Please select a category")
      return
    }
    
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      alert("Please enter a valid base price")
      return
    }

    // Process form data for submission - match the exact field names from your model
    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      basePrice: parseFloat(formData.basePrice),
      unit: formData.unit,
      imageUrl: formData.imageUrl.trim() || undefined,
      keywords: formData.keywords ? formData.keywords.split(",").map(k => k.trim()).filter(k => k) : [],
      duration: parseInt(formData.duration),
      difficulty: formData.difficulty,
      requirements: formData.requirements ? formData.requirements.split(",").map(r => r.trim()).filter(r => r) : [],
      isActive: formData.isActive,
    }

    console.log("Submitting service data:", submitData)
    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Service Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter service name"
        />
        <p className="text-xs text-gray-500 mt-1">Maximum 200 characters</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          maxLength={2000}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter detailed service description"
        />
        <p className="text-xs text-gray-500 mt-1">Maximum 2000 characters</p>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {safeCategories.map((category) => (
            <option key={category._id || category.id} value={category._id || category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {safeCategories.length === 0 && (
          <p className="text-red-500 text-sm mt-1">
            No categories available. Please create categories first.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
            Base Price *
          </label>
          <input
            type="number"
            id="basePrice"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Pricing Unit *
          </label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="per service">per service</option>
            <option value="per hour">per hour</option>
            <option value="per day">per day</option>
            <option value="per project">per project</option>
            <option value="per sq ft">per sq ft</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
          Keywords
        </label>
        <input
          type="text"
          id="keywords"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter keywords separated by commas (e.g., cleaning, housekeeping, maintenance)"
        />
        <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes) *
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="60"
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty Level *
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
          Requirements
        </label>
        <textarea
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter requirements separated by commas (e.g., tools needed, experience level, certifications)"
        />
        <p className="text-xs text-gray-500 mt-1">Separate requirements with commas</p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Service is active and available for booking
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || safeCategories.length === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : service ? "Update Service" : "Create Service"}
        </button>
      </div>
    </form>
  )
}

export default ServiceForm
