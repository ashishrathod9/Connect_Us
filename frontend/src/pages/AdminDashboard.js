"use client"

import { useState, useEffect } from "react"
import AuthService from "../services/authService"
import { Users, UserCheck, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import TestProviderRequest from "../components/layout/Testprovider"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [customers, setCustomers] = useState([])
  const [providers, setProviders] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log("Fetching admin data...")

      const [customersData, providersData, applicationsData] = await Promise.all([
        AuthService.getAllCustomers(),
        AuthService.getAllProviders(),
        AuthService.getProviderApplications(),
      ])

      console.log("Customers:", customersData)
      console.log("Providers:", providersData)
      console.log("Applications:", applicationsData)

      setCustomers(customersData)
      setProviders(providersData)
      setApplications(applicationsData)
    } catch (error) {
      setError("Failed to fetch data")
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveProvider = async (id) => {
    try {
      setActionLoading(id)
      await AuthService.approveProvider(id)
      await fetchData()
    } catch (error) {
      setError("Failed to approve provider")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectProvider = async (id) => {
    try {
      setActionLoading(id)
      await AuthService.rejectProvider(id)
      await fetchData()
    } catch (error) {
      setError("Failed to reject provider")
    } finally {
      setActionLoading(null)
    }
  }

  const renderOverview = () => (
    <div className="space-y-8">
      <TestProviderRequest />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <Users size={32} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{customers.length}</h3>
              <p className="text-gray-600">Total Customers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <UserCheck size={32} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{providers.length}</h3>
              <p className="text-gray-600">Active Providers</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <Clock size={32} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{applications.length}</h3>
              <p className="text-gray-600">Pending Applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Provider Applications</h3>
        {applications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No pending applications</p>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 5).map((application) => (
              <div
                key={application._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{application.name}</h4>
                  <p className="text-gray-600">{application.serviceType}</p>
                  <span className="text-sm text-gray-500">
                    Applied: {new Date(application.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveProvider(application._id)}
                    disabled={actionLoading === application._id}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectProvider(application._id)}
                    disabled={actionLoading === application._id}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderCustomers = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">All Customers ({customers.length})</h3>
      {customers.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No customers found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {customer.profilePhoto ? (
                          <img
                            src={customer.profilePhoto || "/placeholder.svg"}
                            alt={customer.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 font-semibold">{customer.name?.charAt(0) || "U"}</span>
                        )}
                      </div>
                      <span className="text-gray-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderProviders = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Providers ({providers.length})</h3>
      {providers.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No active providers found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {providers.map((provider) => (
                <tr key={provider._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        {provider.profilePhoto ? (
                          <img
                            src={provider.profilePhoto || "/placeholder.svg"}
                            alt={provider.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 font-semibold">{provider.name?.charAt(0) || "P"}</span>
                        )}
                      </div>
                      <span className="text-gray-900">{provider.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{provider.serviceType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{provider.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        provider.status === "approved" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {new Date(provider.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderApplications = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Applications ({applications.length})</h3>
      {applications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No pending applications</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <div key={application._id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  {application.profilePhoto ? (
                    <img
                      src={application.profilePhoto || "/placeholder.svg"}
                      alt={application.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-semibold">{application.name?.charAt(0) || "A"}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{application.name}</h4>
                  <p className="text-sm text-gray-600">{application.email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Type:</span>
                  <span className="text-gray-900">{application.serviceType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phone:</span>
                  <span className="text-gray-900">{application.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Address:</span>
                  <span className="text-gray-900">{application.address}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Business Contact:</span>
                  <span className="text-gray-900">{application.contact}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Applied:</span>
                  <span className="text-gray-900">{new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApproveProvider(application._id)}
                  disabled={actionLoading === application._id}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  {actionLoading === application._id ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => handleRejectProvider(application._id)}
                  disabled={actionLoading === application._id}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <XCircle size={16} />
                  {actionLoading === application._id ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and provider applications</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap border-b">
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                activeTab === "overview"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <Eye size={16} />
              Overview
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                activeTab === "customers"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("customers")}
            >
              <Users size={16} />
              Customers ({customers.length})
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                activeTab === "providers"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("providers")}
            >
              <UserCheck size={16} />
              Providers ({providers.length})
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                activeTab === "applications"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("applications")}
            >
              <Clock size={16} />
              Applications ({applications.length})
            </button>
          </div>
        </div>

        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "customers" && renderCustomers()}
          {activeTab === "providers" && renderProviders()}
          {activeTab === "applications" && renderApplications()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard