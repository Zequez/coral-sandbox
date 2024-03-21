import { useState, useEffect } from 'preact/hooks';
import WebcamFeed from './components/WebcamFeed';
import MicrophoneFeed from './components/MicrophoneFeed';
import ColorTextEditor from './components/ColorTextEditor';
import Pinta from './components/PintaCar';

const Coral = () => {
  const [mode, setMode] = useState<'colorTextEditor' | 'camera' | 'microphone' | 'pinta'>('pinta');

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      console.log(ev.key);
      if (ev.key === 'Help') {
        setMode('colorTextEditor');
      } else if (ev.key === 'PageUp') {
        setMode('pinta');
      } else if (ev.key === 'Delete') {
        setMode('camera');
      } else if (ev.key === 'PageDown') {
        setMode('microphone');
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <div className="h-screen w-screen relative">
      {mode === 'camera' ? (
        <WebcamFeed />
      ) : mode === 'microphone' ? (
        <MicrophoneFeed />
      ) : mode === 'colorTextEditor' ? (
        <ColorTextEditor />
      ) : (
        <Pinta />
      )}
    </div>
  );
};

export default Coral;
