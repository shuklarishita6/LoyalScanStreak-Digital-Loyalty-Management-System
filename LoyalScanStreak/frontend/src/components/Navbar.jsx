import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🔥 LoyalScanStreak</Link>
      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/customer/login">Customer Login</Link>
            <Link to="/owner/login">Owner Login</Link>
          </>
        )}
        {user?.role === 'customer' && <Link to="/customer/dashboard">My Dashboard</Link>}
        {user?.role === 'owner' && <Link to="/owner/dashboard">Owner Dashboard</Link>}
        {user && <NotificationBell />}
        {user && (
          <button className="btn-link" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
