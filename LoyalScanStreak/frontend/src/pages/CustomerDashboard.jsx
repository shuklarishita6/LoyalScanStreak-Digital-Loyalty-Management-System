import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../services/customerService';
import { getMyNotifications } from '../services/notificationService';
import ProgressBar from '../components/ProgressBar';
import QRCodeDisplay from '../components/QRCodeDisplay';
import CompletionModal from '../components/CompletionModal';
import AchievementBanner from '../components/AchievementBanner';
import DailyLoyaltyBanner from '../components/DailyLoyaltyBanner';
import { isWithinHours, isToday } from '../utils/dateHelpers';

const REWARD_THRESHOLD = 10;
const BANNER_HOURS = 24;

const RULES = [
  { step: '01', icon: '🧾', title: 'Make a Visit', text: 'Visit the restaurant and make a valid purchase.' },
  { step: '02', icon: '📱', title: 'Show Your QR', text: 'Present your unique QR code to the restaurant owner.' },
  { step: '03', icon: '🔥', title: 'Earn 1 Point', text: "After the physical bill is verified, today's loyalty point is recorded." },
  { step: '04', icon: '🎁', title: 'Complete 10 Visits', text: 'Reach 10 loyalty points and unlock your reward.' },
];

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [error, setError] = useState('');
  const [completionNotification, setCompletionNotification] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data);

        // Show the big celebration modal only ONCE per completion event -
        // remembered via localStorage so a page refresh doesn't re-trigger it.
        if (data.loyaltyCompletedAt) {
          const key = `lss_completion_shown_${data.customerId}_${data.loyaltyCompletedAt}`;
          const alreadyShown = localStorage.getItem(key);
          if (!alreadyShown && isWithinHours(data.loyaltyCompletedAt, BANNER_HOURS)) {
            setShowCompletionModal(true);
            localStorage.setItem(key, 'true');
          }
        }
      })
      .catch(() => setError('Could not refresh profile, showing cached data.'));

    getMyNotifications()
      .then((list) => {
        const latestCompletion = list.find((n) => n.type === 'loyalty_completed');
        if (latestCompletion) setCompletionNotification(latestCompletion);
      })
      .catch(() => {});
  }, []);

  if (!profile) return null;

  const remaining = Math.max(REWARD_THRESHOLD - profile.loyaltyPoints, 0);
  const showAchievementBanner = isWithinHours(profile.loyaltyCompletedAt, BANNER_HOURS);
  // Don't show both banners on the same day - the achievement banner already
  // covers "today's success" in a bigger way on completion day.
  const showDailyBanner = !showAchievementBanner && isToday(profile.lastLoyaltyUpdatedAt);

  return (
    <div className="bg-customer">
      <div className="page container">
      <CompletionModal
        show={showCompletionModal}
        name={profile.name}
        message={completionNotification?.message}
        onClose={() => setShowCompletionModal(false)}
      />

      {showAchievementBanner && <AchievementBanner name={profile.name} message={completionNotification?.message} />}
      {showDailyBanner && <DailyLoyaltyBanner points={profile.loyaltyPoints} threshold={REWARD_THRESHOLD} />}

      <h2>Welcome, {profile.name} 👋</h2>
      {error && <p className="error-text">{error}</p>}

      <div className="dashboard-grid">
        <div className="card loyalty-card">
          <h3>🔥 Your Loyalty</h3>
          <p className="points-big">
            {profile.loyaltyPoints} / {REWARD_THRESHOLD}
          </p>
          <ProgressBar current={profile.loyaltyPoints} target={REWARD_THRESHOLD} />
          {remaining > 0 ? (
            <p>
              {remaining} more visit{remaining !== 1 ? 's' : ''} to complete your loyalty journey
            </p>
          ) : (
            <p className="reward-text">🎉 Reward Unlocked!</p>
          )}
        </div>

        <div className="card qr-card">
          <h3>📱 Your Loyalty QR</h3>
          <p className="muted">Show your QR at the restaurant to record today's visit.</p>
          <QRCodeDisplay value={profile.customerId} />
        </div>
      </div>

      <div className="card">
        <h3>✨ How Your Loyalty Works</h3>
        <div className="rules-grid">
          {RULES.map((r) => (
            <div className="rule-card" key={r.step}>
              <span className="rule-step">{r.step}</span>
              <span className="rule-icon">{r.icon}</span>
              <p className="rule-title">{r.title}</p>
              <p className="rule-text">{r.text}</p>
            </div>
          ))}
        </div>
        <ul className="rules-fineprint">
          <li>You cannot update your own points - only the shop owner can, after verifying your bill.</li>
          <li>Skipped days never reset your progress - it's a 10-visit journey, not a daily streak.</li>
          <li>Only 1 point can be earned per calendar day.</li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
