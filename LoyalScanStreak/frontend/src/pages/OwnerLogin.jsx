import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginOwner } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const OwnerLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginOwner(form);
      login({ ...data, role: 'owner' });
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page bg-auth">
      <div className="auth-card">
        <p className="auth-icon">🧑‍🍳</p>
        <h2>Shop Owner Login</h2>
        <p className="muted">Sign in to manage today's loyalty updates.</p>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p>
          New shop? <Link to="/owner/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default OwnerLogin;
