const ProgressBar = ({ current, target }) => {
  const percent = Math.min((current / target) * 100, 100);

  return (
    <div className="progress-wrapper">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="progress-label">
        {current} / {target} points
      </p>
    </div>
  );
};

export default ProgressBar;
