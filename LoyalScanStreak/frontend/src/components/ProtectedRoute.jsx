import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap a page in this to require login + a specific role.
// role = 'customer' | 'owner'
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="center-text">Loading...</p>;

  if (!user) {
    return <Navigate to={role === 'owner' ? '/owner/login' : '/customer/login'} replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
