import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import { lookupCustomer } from '../services/customerService';

const OwnerScan = () => {
  const [manualId, setManualId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const goToCustomer = async (customerId) => {
    setError('');
    try {
      await lookupCustomer(customerId); // validate it exists before navigating
      navigate(`/owner/customer/${customerId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Customer not found');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualId.trim()) goToCustomer(manualId.trim());
  };

  return (
    <div className="bg-owner">
      <div className="page container">
      <h2>📷 Scan Customer QR</h2>
      {error && <p className="error-text">{error}</p>}

      <div className="card">
        <QRScanner onScan={goToCustomer} />
      </div>

      <div className="card">
        <h3>Camera not working?</h3>
        <p className="muted">Enter the Customer ID manually instead.</p>
        <form onSubmit={handleManualSubmit} className="search-bar">
          <input placeholder="e.g. CUS4821" value={manualId} onChange={(e) => setManualId(e.target.value)} />
          <button type="submit" className="btn btn-secondary">Find Customer</button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default OwnerScan;
