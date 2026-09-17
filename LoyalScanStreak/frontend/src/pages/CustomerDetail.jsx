import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lookupCustomer } from '../services/customerService';
import { updateLoyalty } from '../services/loyaltyService';
import ProgressBar from '../components/ProgressBar';
import Toast from '../components/Toast';
import { isToday } from '../utils/dateHelpers';

const REWARD_THRESHOLD = 10;

const CustomerDetail = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [notice, setNotice] = useState(''); // "already recorded today" - a friendly notice, not an error
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null); // { icon, title, message }
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await lookupCustomer(customerId);
      setCustomer(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Customer not found');
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const handleUpdate = async () => {
    setUpdating(true);
    setNotice('');
    setError('');
    try {
      const result = await updateLoyalty(customerId);
      await load();
      setToast({
        icon: result.rewardUnlocked ? '🎉' : '✅',
        title: result.rewardUnlocked ? 'Loyalty Journey Completed!' : 'Loyalty Updated Successfully!',
        message: result.rewardUnlocked
          ? `${result.name} completed their 10-Visit Loyalty Journey. Reward available! 🎁`
          : `${result.name}'s loyalty has been recorded. 🔥 ${result.loyaltyPoints} / ${REWARD_THRESHOLD}`,
      });
    } catch (err) {
      if (err.response?.status === 409) {
        setNotice(err.response.data.message); // "Today's loyalty has already been recorded!"
      } else {
        setError(err.response?.data?.message || 'Update failed');
      }
    } finally {
      setUpdating(false);
    }
  };

  if (error) {
    return (
      <div className="bg-owner">
        <div className="page container">
          <p className="error-text">{error}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/owner/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!customer) return <p className="center-text">Loading...</p>;

  const alreadyToday = isToday(customer.lastLoyaltyUpdatedAt);

  return (
    <div className="bg-owner">
      <div className="page container">
      <Toast show={!!toast} icon={toast?.icon} title={toast?.title} message={toast?.message} onClose={() => setToast(null)} />

      <h2>Customer Found ✅</h2>

      <div className="card">
        <p>
          <strong>Name:</strong> {customer.name}
        </p>
        <p>
          <strong>Customer ID:</strong> {customer.customerId}
        </p>
        <p>
          <strong>Email:</strong> {customer.email}
        </p>
        <p>
          <strong>Current Points:</strong> {customer.loyaltyPoints}
        </p>
        <ProgressBar current={customer.loyaltyPoints} target={REWARD_THRESHOLD} />
        {alreadyToday && <span className="badge badge-success">✅ Today's Loyalty Recorded</span>}
      </div>

      {notice && <p className="notice-text">❤️ {notice}</p>}

      <div className="card">
        <h3>Step: Verify the physical bill</h3>
        <p className="muted">
          Manually check the customer's hard-copy bill before updating loyalty. Only click below once you've verified a
          valid purchase.
        </p>
        <button className="btn btn-primary" onClick={handleUpdate} disabled={updating || alreadyToday}>
          {updating ? 'Updating...' : alreadyToday ? "Already Recorded Today" : '✅ Update Loyalty (+1 Point)'}
        </button>
      </div>

      <button className="btn-link" onClick={() => navigate('/owner/dashboard')}>
        ← Back to Dashboard
      </button>
      </div>
    </div>
  );
};

export default CustomerDetail;
