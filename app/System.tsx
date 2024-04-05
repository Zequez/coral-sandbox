import { useEffect } from 'preact/hooks';
import useLocalStorageState from './lib/useLocalStorageState';
import { apps } from './components/apps';

const appsMinusLauncher = { ...apps } as { [key: string]: (typeof apps)[keyof typeof apps] };
delete appsMinusLauncher.Launcher;

const System = () => {
  const [mode, setMode] = useLocalStorageState<keyof typeof apps>(
    '__CORAL_SANDBOX__mode',
    'Launcher',
  );

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === 'Help' || ev.key === 'Escape') {
        setMode('Launcher');
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  const App = {
    Launcher: () => (
      <apps.Launcher.App
        apps={appsMinusLauncher}
        onSelect={(appName) => setMode(appName as keyof typeof apps)}
      />
    ),
    MicrophoneFeed: () => <apps.MicrophoneFeed.App />,
    WebcamFeed: () => <apps.WebcamFeed.App />,
    Pinta: () => <apps.Pinta.App />,
    PintaCar: () => <apps.PintaCar.App />,
    ColorTextEditor: () => <apps.ColorTextEditor.App />,
    Letras: () => <apps.Letras.App />,
  }[mode];

  if (!App) {
    setMode('Launcher');
  }

  return <div className="h-screen w-screen relative">{App ? <App /> : null}</div>;
};

export default System;
