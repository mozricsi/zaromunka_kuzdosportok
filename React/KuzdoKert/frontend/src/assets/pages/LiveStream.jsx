import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import "../Styles/LiveStream.css";

function LiveStream() {
  const iframeRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Socket.IO kapcsolat inicializálása
    socket.current = io('http://localhost:5001');

    // Stream státusz hallgatása
    socket.current.on('stream-update', (data) => {
      const { streamUrl, status } = data;
      if (iframeRef.current) {
        if (status === 'online' && streamUrl) {
          iframeRef.current.src = streamUrl;
          iframeRef.current.style.display = 'block';
        } else {
          iframeRef.current.src = '';
          iframeRef.current.style.display = 'none';
        }
      }
    });
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="live-stream-page">
      <div className="live-stream-container">
        <h1 className="live-stream-title">Élő Edzés</h1>
        <div className="stream-wrapper">
          <iframe
            ref={iframeRef}
            title="Live Stream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="stream-iframe"
            style={{ display: 'none' }}
          />
          <p className="stream-placeholder">Jelenleg nincs élő adás...</p>
        </div>
      </div>
    </div>
  );
}

export default LiveStream;