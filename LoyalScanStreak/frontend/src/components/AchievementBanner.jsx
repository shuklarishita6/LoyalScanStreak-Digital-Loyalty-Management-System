// Sits at the TOP of the Customer Dashboard for 24h after a completion.
const AchievementBanner = ({ name, message }) => (
  <div className="achievement-banner">
    <p className="achievement-line achievement-title">
      🎉 CONGRATULATIONS, {name?.toUpperCase()}!
    </p>
    <p className="achievement-line">🔥 You have successfully completed your 10-Visit Loyalty Journey!</p>
    {message && <p className="achievement-line">🎁 {message}</p>}
  </div>
);

export default AchievementBanner;
