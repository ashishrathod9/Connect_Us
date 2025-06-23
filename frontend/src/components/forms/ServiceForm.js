"use client"

import { useState, useEffect } from "react"

const ServiceForm = ({ onSubmit, service, categories, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    unit: "per service",
  })

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : []

  // Debug logging
  useEffect(() => {
    console.log("ServiceForm received categories:", categories)
    console.log("ServiceForm safe categories:", safeCategories)
    console.log("Categories type:", typeof categories)
    console.log("Is categories array?", Array.isArray(categories))
  }, [categories, safeCategories])

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || "",
        description: service.description || "",
        category: service.category?._id || service.category || "",
        basePrice: service.basePrice || service.price || "",
        unit: service.unit || "per service",
      })
    } else {
      // Reset form for new service
      setFormData({
        name: "",
        description: "",
        category: "",
        basePrice: "",
        unit: "per service",
      })
    }
  }, [service])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("ServiceForm submitting:", formData)
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Debug Info - Remove in production */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded text-sm">
        <p>
          <strong>Debug:</strong> Categories available: {safeCategories.length}
        </p>
        <p>Categories type: {typeof categories}</p>
        <p>Is array: {Array.isArray(categories) ? "Yes" : "No"}</p>
        {safeCategories.length === 0 && <p className="text-red-600">⚠️ No categories loaded!</p>}
      </div>

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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter service name"
        />
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
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter service description"
        />
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
          <p className="text-red-500 text-sm mt-1">No categories available. Please create categories first.</p>
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
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
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

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || safeCategories.length === 0}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : service ? "Update Service" : "Create Service"}
        </button>
      </div>
    </form>
  )
}

export default ServiceForm
