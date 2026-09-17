// Big rectangle banner shown on the Customer Dashboard for the REST OF THE
// CALENDAR DAY that a point was recorded. Driven entirely by the backend's
// `lastLoyaltyUpdatedAt` timestamp (via the isToday() check in the parent),
// so it correctly reappears on every page load/refresh that day, and
// disappears on its own once the day changes - no manual "close" needed.
const DailyLoyaltyBanner = ({ points, threshold }) => (
  <div className="daily-banner">
    <span className="daily-banner-icon">✅</span>
    <div>
      <p className="daily-banner-title">Today's Loyalty Successfully Recorded!</p>
      <p className="daily-banner-sub">
        🔥 {points} / {threshold} points
      </p>
    </div>
  </div>
);

export default DailyLoyaltyBanner;
