"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import AuthService from "../services/authService"
import { Check, X, Clock, RefreshCw, Calendar, User, DollarSign } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(null)

  const isProvider = user?.role === "provider"

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = isProvider ? await AuthService.getProviderHires() : await AuthService.getCustomerHires()

      if (response.success) {
        setBookings(response.bookings)
      } else {
        setBookings(response.bookings || response || [])
      }
    } catch (err) {
      setError("An error occurred while fetching hires.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user, isProvider])

  const handleUpdateStatus = async (bookingId, status) => {
    setActionLoading(bookingId)
    try {
      await AuthService.updateHireStatus(bookingId, status)
      await fetchBookings() // Refresh the list
    } catch (err) {
      setError(`Failed to ${status} hire.`)
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-gray-100 text-gray-800",
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || styles.pending}`}>
        {status}
      </span>
    )
  }

  const renderProviderView = () => (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{booking.service?.name || "Service"}</h3>
                  <p className="text-gray-600">
                    Customer: {booking.customer?.name} ({booking.customer?.email})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2" />
                  <span>${booking.totalBill || booking.amount || "50"}</span>
                </div>
                <div>
                  <StatusBadge status={booking.status} />
                </div>
              </div>
            </div>

            {booking.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus(booking._id, "approved")}
                  disabled={actionLoading === booking._id}
                  className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
                  title="Accept Hire Request"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => handleUpdateStatus(booking._id, "rejected")}
                  disabled={actionLoading === booking._id}
                  className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 disabled:opacity-50 transition-colors"
                  title="Decline Hire Request"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {booking.status === "approved" && (
              <button
                onClick={() => handleUpdateStatus(booking._id, "completed")}
                disabled={actionLoading === booking._id}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  const renderCustomerView = () => (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{booking.service?.name || "Service"}</h3>
              <p className="text-gray-600">Provider: {booking.service?.provider?.name || "Provider"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span>{new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign size={16} className="mr-2" />
              <span>${booking.totalBill || booking.amount || "50"}</span>
            </div>
            <div>
              <StatusBadge status={booking.status} />
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={16} className="mr-2" />
              <span>Booked {new Date(booking.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{isProvider ? "Hire Requests" : "My Hires"}</h1>
          <p className="text-gray-600">
            {isProvider ? "Manage incoming hire requests from customers" : "Track your provider hires and their status"}
          </p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        <div className="mb-6">
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {bookings.length > 0 ? (
          isProvider ? (
            renderProviderView()
          ) : (
            renderCustomerView()
          )
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No bookings found</h3>
            <p className="text-gray-600">
              {isProvider ? "You don't have any hire requests yet." : "You haven't hired any providers yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
