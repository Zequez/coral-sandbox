import Hsl from './lib/Hsl';

export const letters: { [key: string]: string } = {
  a: 'abuela',
  b: 'barco',
  c: 'Coral',
  d: 'dedo',
  e: 'elefante',
  f: 'familia',
  g: 'gato',
  h: 'hielo',
  i: 'invierno',
  j: 'jaguar',
  k: 'kiosco',
  l: 'luna',
  m: 'mamá',
  n: 'naranja',
  o: 'oso',
  p: 'papá',
  q: 'queso',
  r: 'rojo',
  s: 'sol',
  t: 'tobogán',
  u: 'Uma',
  v: 'vaca',
  w: 'wapití',
  x: 'xilócopo',
  y: 'yacaré',
  z: 'zorro',
};

export const emojis: { [key: string]: string } = {
  a: '👵🏻',
  b: '🚢',
  c: '👦',
  d: '👆',
  e: '🐘',
  f: '👨‍👩‍👦',
  g: '🐈',
  h: '🧊',
  i: '🌨',
  j: '🐆',
  k: '🏪',
  l: '🌕',
  m: '👩🏽',
  n: '🍊',
  o: '🐻',
  p: '🧔🏽‍♂️',
  q: '🧀',
  r: '🔴',
  s: '☀️',
  t: '🛝',
  u: '👧🏻',
  v: '🐄',
  w: '🦌',
  x: '🐝',
  y: '🐊',
  z: '🦊',
};

export const colors: { [key: string]: Hsl } = {
  rojo: new Hsl(0, 50, 50),
  naranja: new Hsl(26, 100, 53),
  amarillo: new Hsl(50, 100, 60),
  verde: new Hsl(73, 54, 41),
  azul: new Hsl(204, 50, 50),
  violeta: new Hsl(297, 100, 27),
  negro: new Hsl(0, 0, 0),
  blanco: new Hsl(0, 0, 100),
  gris: new Hsl(0, 0, 50),
};

export function adaptLetter(key: string) {
  if (key === 'b') {
    return 'be larga';
  } else if (key === 'v') {
    return 've corta';
  } else if (key === 'w') {
    return 'doblebé';
  } else if (key === 'y') {
    return 'y griega';
  } else {
    return key;
  }
}
