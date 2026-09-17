import { Link } from 'react-router-dom';

const Home = () => (
  <div className="bg-home">
    <div className="page container">
      <div className="hero">
        <h1>🔥 LoyalScanStreak</h1>
        <p>Ditch the physical loyalty card. One QR code, one streak, zero hassle.</p>
        <div className="hero-buttons">
          <Link to="/customer/register" className="btn btn-primary">I'm a Customer</Link>
          <Link to="/owner/register" className="btn btn-secondary">I'm a Shop Owner</Link>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How it works</h2>
        <ol>
          <li>Register and get your unique QR code.</li>
          <li>Show your QR code every time you make a purchase.</li>
          <li>The shop owner verifies your physical bill and updates your loyalty.</li>
          <li>Collect 10 points to unlock a reward.</li>
        </ol>
      </div>
    </div>
  </div>
);

export default Home;
