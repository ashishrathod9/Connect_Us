import { useAuth } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, adminOnly, customerOnly, providerOnly }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />
  }

  if (customerOnly && user.role !== "customer") {
    return <Navigate to="/" />
  }

  if (providerOnly && user.role !== "provider") {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
