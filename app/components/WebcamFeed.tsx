import { createRef } from 'preact';
import { useEffect } from 'preact/hooks';

const WebcamFeed = () => {
  const videoRef = createRef<HTMLVideoElement>();

  useEffect(() => {
    const constraints = { video: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
      });

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => {
            track.stop();
          });
        }
      }
    };
  }, []);

  return <video ref={videoRef} autoPlay playsInline class="h-full w-full"></video>;
};

export default WebcamFeed;
