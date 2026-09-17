// The big 10/10 celebration popup - shown once per completion event.
const CompletionModal = ({ show, name, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="completion-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="completion-emojis">🎉 🔥 🎉</p>
        <h2 className="completion-title">Congratulations, {name}! ❤️</h2>
        <p className="completion-subtitle">You have successfully completed your</p>
        <p className="completion-highlight">10-Visit Loyalty Journey!</p>
        <div className="completion-badge">10 / 10 Completed</div>
        {message && (
          <div className="completion-reward">
            <span className="completion-gift">🎁</span>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletionModal;
