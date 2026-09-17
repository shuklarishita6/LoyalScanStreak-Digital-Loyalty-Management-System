import { useEffect } from 'react';

// A small reusable success popup - NOT the browser alert().
// Parent controls visibility via `show` + content; auto-dismisses itself.
const Toast = ({ show, icon = '🎉', title, message, onClose, autoCloseMs = 4500 }) => {
  useEffect(() => {
    if (!show) return undefined;
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [show, onClose, autoCloseMs]);

  if (!show) return null;

  return (
    <div className="toast-wrapper">
      <div className="toast-card">
        <span className="toast-icon">{icon}</span>
        <div className="toast-body">
          <p className="toast-title">{title}</p>
          {message && <p className="toast-message">{message}</p>}
        </div>
        <button className="toast-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
