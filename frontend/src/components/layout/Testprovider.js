"use client"

import { useState } from "react"
import AuthService from "../../services/authService"

const TestProviderRequest = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const createTestApplication = async () => {
    setLoading(true)
    setMessage("")

    try {
      // First register a test provider user
      const testUserData = {
        name: "Test Provider",
        email: `testprovider${Date.now()}@example.com`,
        password: "password123",
        phone: "555-0123",
        role: "provider",
        serviceType: "Plumbing",
        address: "123 Test Street",
        contact: "test-contact@example.com",
      }

      const response = await AuthService.register(testUserData)
      console.log("Test provider created:", response)
      setMessage("Test provider application created successfully!")
    } catch (error) {
      console.error("Error creating test provider:", error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Test Provider Applications</h3>
      <p className="text-yellow-700 mb-4">
        Click the button below to create a test provider application for testing purposes.
      </p>

      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <button
        onClick={createTestApplication}
        disabled={loading}
        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Test Provider Application"}
      </button>
    </div>
  )
}

export default TestProviderRequest
