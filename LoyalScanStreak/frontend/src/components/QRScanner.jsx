import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

// Renders a live camera view and calls onScan(decodedText) once a QR is read.
// decodedText will be the customerId we encoded (e.g. "CUS4821").
const QRScanner = ({ onScan }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 220 }, false);

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear().catch(() => {});
      },
      () => {
        // fires continuously while the camera is searching for a code - ignore
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id="qr-reader" />;
};

export default QRScanner;
