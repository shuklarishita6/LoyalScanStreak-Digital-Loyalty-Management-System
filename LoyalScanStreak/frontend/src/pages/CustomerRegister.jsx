import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCustomer } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const CustomerRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerCustomer(form);
      login({ ...data, role: 'customer' });
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page bg-auth">
      <div className="auth-card">
        <p className="auth-icon">🍽️</p>
        <h2>Customer Registration</h2>
        <p className="muted">Join and get your unique loyalty QR code.</p>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to="/customer/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerRegister;
