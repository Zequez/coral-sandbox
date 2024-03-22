import { default as ColorTextEditor } from './ColorTextEditor';
import { default as MicrophoneFeed } from './MicrophoneFeed';
import { default as WebcamFeed } from './WebcamFeed';
import { default as Pinta } from './Pinta';
import { default as PintaCar } from './PintaCar';
import { default as Launcher } from './Launcher';

export const apps = {
  ColorTextEditor: {
    name: 'Escribir con colores',
    icon: '📝',
    App: ColorTextEditor,
  },
  MicrophoneFeed: {
    name: 'Micrófono',
    icon: '🎤',
    App: MicrophoneFeed,
  },
  WebcamFeed: {
    name: 'Cámara',
    icon: '📷',
    App: WebcamFeed,
  },
  Pinta: {
    name: 'Pinta cuadrados',
    icon: '🟥',
    App: Pinta,
  },
  PintaCar: {
    name: 'Auto pintador',
    icon: '🚗',
    App: PintaCar,
  },
  Launcher: {
    name: 'Selector de apps',
    icon: '🔎',
    App: Launcher,
  },
};
