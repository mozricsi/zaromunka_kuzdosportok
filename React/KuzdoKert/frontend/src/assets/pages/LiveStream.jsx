import { useEffect, useRef } from 'react';
import "../Styles/LiveStream.css";

function LiveStream() {
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Élő Edzés</h1>
      <video ref={videoRef} autoPlay className="w-full" />
    </div>
  );
}

export default LiveStream;