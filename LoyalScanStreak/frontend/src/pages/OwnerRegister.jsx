import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerOwner } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const OwnerRegister = () => {
  const [form, setForm] = useState({ shopName: '', ownerName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerOwner(form);
      login({ ...data, role: 'owner' });
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page bg-auth">
      <div className="auth-card">
        <p className="auth-icon">🧑‍🍳</p>
        <h2>Shop Owner Registration</h2>
        <p className="muted">Set up your restaurant's loyalty program.</p>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="shopName" placeholder="Shop name" value={form.shopName} onChange={handleChange} required />
          <input name="ownerName" placeholder="Owner name" value={form.ownerName} onChange={handleChange} required />
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
            Register
          </button>
        </form>
        <p>
          Already have an account? <Link to="/owner/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default OwnerRegister;
