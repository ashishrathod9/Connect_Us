import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              ConnectUs
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/services" className="text-gray-700 hover:text-blue-600">
                  Services
                </Link>
                
                {user.role === "customer" && (
                  <Link to="/bookings" className="text-gray-700 hover:text-blue-600">
                    My Bookings
                  </Link>
                )}
                
                {user.role === "provider" && (
                  <>
                    <Link to="/manage" className="text-gray-700 hover:text-blue-600">
                      My Services
                    </Link>
                    <Link to="/requests" className="text-gray-700 hover:text-blue-600">
                      Service Requests
                    </Link>
                  </>
                )}
                
                {user.role === "admin" && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin
                  </Link>
                )}
                
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
