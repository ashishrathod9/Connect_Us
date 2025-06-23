import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/layout/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Services from "./pages/Services"
import ServiceDetails from "./pages/ServiceDetails"
import AdminDashboard from "./pages/AdminDashboard"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import SearchResultPage from "./pages/SearchResultPage"
import CategoryServices from "./pages/CategoryServices"
import Dashboard from "./pages/Dashboard"
import ServiceManagement from "./pages/ServiceManagement"
import CustomerBookings from "./components/CustomerBookings"
import ProviderBookings from "./components/ProviderBookings"
import "./components/ConnectUsLoader.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/services"
                element={
                  <ProtectedRoute>
                    <Services />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services/:id"
                element={
                  <ProtectedRoute>
                    <ServiceDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchResultPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/category/:categoryId"
                element={
                  <ProtectedRoute>
                    <CategoryServices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage"
                element={
                  <ProtectedRoute>
                    <ServiceManagement />
                  </ProtectedRoute>
                }
              />
              {/* Customer Booking Routes */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute customerOnly>
                    <CustomerBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/bookings"
                element={
                  <ProtectedRoute customerOnly>
                    <CustomerBookings />
                  </ProtectedRoute>
                }
              />
              {/* Provider Booking Routes */}
              <Route
                path="/provider/bookings"
                element={
                  <ProtectedRoute providerOnly>
                    <ProviderBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <ProtectedRoute providerOnly>
                    <ProviderBookings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
