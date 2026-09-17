import { useEffect, useState } from 'react';
import { getMyNotifications } from '../services/notificationService';
import NotificationSidebar from './NotificationSidebar';

// Lives in the Navbar - shared by BOTH portals. The backend filters
// notifications by whichever role is logged in, so this component doesn't
// need to know if it's a customer or an owner.
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const load = () => {
    getMyNotifications()
      .then(setNotifications)
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <button className="notification-bell" onClick={() => setOpen(true)} aria-label="Notifications">
        🔔
        {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
      </button>
      <NotificationSidebar open={open} notifications={notifications} onClose={() => setOpen(false)} onOpened={load} />
    </>
  );
};

export default NotificationBell;
