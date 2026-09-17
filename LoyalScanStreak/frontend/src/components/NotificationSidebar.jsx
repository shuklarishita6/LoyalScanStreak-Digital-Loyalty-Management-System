import { useEffect } from 'react';
import { markNotificationsRead } from '../services/notificationService';

const iconFor = (type) => (type === 'loyalty_completed' ? '🎉' : '❤️');

const NotificationSidebar = ({ open, notifications, onClose, onOpened }) => {
  useEffect(() => {
    if (!open) return;
    markNotificationsRead().catch(() => {});
    onOpened?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="notification-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h3>🔔 Notifications</h3>
          <button className="btn-link" onClick={onClose}>
            Close
          </button>
        </div>

        {notifications.length === 0 && <p className="muted">No notifications yet.</p>}

        {notifications.map((n) => (
          <div key={n._id} className="notification-card">
            <span className="notification-icon">{iconFor(n.type)}</span>
            <div>
              <p className="notification-title">{n.title}</p>
              <p className="notification-message">{n.message}</p>
              <p className="notification-time">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSidebar;
