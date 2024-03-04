import { useState, useEffect } from 'preact/hooks';
import WebcamFeed from './components/WebcamFeed';
import MicrophoneFeed from './components/MicrophoneFeed';
import ColorTextEditor from './components/ColorTextEditor';

const Coral = () => {
  const [mode, setMode] = useState<'colorTextEditor' | 'camera' | 'microphone'>('colorTextEditor');

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === 'Help') {
        setMode('colorTextEditor');
      } else if (ev.key === 'PageUp') {
        console.log('Not used yet');
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
      ) : null}
    </div>
  );
};

export default Coral;
