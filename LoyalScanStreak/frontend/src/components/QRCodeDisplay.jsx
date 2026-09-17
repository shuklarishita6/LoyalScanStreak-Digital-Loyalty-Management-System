import { QRCodeCanvas } from 'qrcode.react';

// The QR encodes ONLY the customerId string (e.g. "CUS4821") - never
// the password or any sensitive data.
const QRCodeDisplay = ({ value, size = 180 }) => (
  <div className="qr-box">
    <QRCodeCanvas value={value} size={size} />
    <p className="qr-caption">{value}</p>
  </div>
);

export default QRCodeDisplay;
