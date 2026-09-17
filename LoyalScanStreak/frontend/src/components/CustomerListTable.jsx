import { isToday } from '../utils/dateHelpers';

const statusFor = (points, threshold) =>
  points >= threshold
    ? { label: 'Reward Available', className: 'status-reward' }
    : { label: 'Active', className: 'status-active' };

const CustomerListTable = ({ customers, threshold = 10 }) => (
  <table className="customer-table">
    <thead>
      <tr>
        <th>Customer ID</th>
        <th>Name</th>
        <th>Loyalty Points</th>
        <th>Status</th>
        <th>Today</th>
      </tr>
    </thead>
    <tbody>
      {customers.map((c) => {
        const status = statusFor(c.loyaltyPoints, threshold);
        return (
          <tr key={c._id}>
            <td>{c.customerId}</td>
            <td>{c.name}</td>
            <td>{c.loyaltyPoints}</td>
            <td className={status.className}>{status.label}</td>
            <td>
              {isToday(c.lastLoyaltyUpdatedAt) ? (
                <span className="badge badge-success">✅ Recorded</span>
              ) : (
                <span className="muted">—</span>
              )}
            </td>
          </tr>
        );
      })}
      {customers.length === 0 && (
        <tr>
          <td colSpan="5" className="center-text">
            No customers found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default CustomerListTable;
