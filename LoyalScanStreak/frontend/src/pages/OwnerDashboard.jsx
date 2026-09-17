import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCustomers } from '../services/customerService';
import CustomerListTable from '../components/CustomerListTable';

const OwnerDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCustomers = async (query = '') => {
    setLoading(true);
    try {
      const data = await getAllCustomers(query);
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadCustomers(search);
  };

  return (
    <div className="bg-owner">
      <div className="page container">
      <div className="dashboard-header">
        <h2>Owner Dashboard</h2>
        <button className="btn btn-primary" onClick={() => navigate('/owner/scan')}>
          📷 Scan Customer QR
        </button>
      </div>

      <p>Total Customers: {customers.length}</p>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          placeholder="Search by name, customer ID or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">Search</button>
      </form>

      {loading ? <p>Loading customers...</p> : <CustomerListTable customers={customers} />}
      </div>
    </div>
  );
};

export default OwnerDashboard;
