import Hsl from './lib/Hsl';

function getPhoto(name: string) {
  return new URL(`./photos/${name}`, import.meta.url).href;
}

type Relation = { word: string; photo: string | null; emoji: string | null; pronunciation: string };

type LetterRelations = { [key: string]: Relation[] };

function R(word: string, photoOrEmoji: string, pronunciation?: string): Relation {
  const isPhoto = !!photoOrEmoji.match(/\./);
  return {
    word,
    photo: isPhoto ? getPhoto(photoOrEmoji) : null,
    emoji: !isPhoto ? photoOrEmoji : null,
    pronunciation: pronunciation || word,
  };
}

export const letters: LetterRelations = {
  a: [
    R('avión', '🛩'),
    R('auto', '🚗'),
    R('auto de papá', 'auto_papa.jpg'),
    R('agua', 'agua.jpg'),
    R('abuela Lili', 'abuela_lili.jpg'),
    R('abeja', '🐝'),
  ],
  b: [R('barco', '⛵️'), R('bicicleta', '🚲'), R('banana', '🍌'), R('bolsa', '🛍')],
  c: [R('Coral', 'coral.jpg'), R('casa', 'casa.jpg'), R('caca', '💩'), R('copos', 'copos.jpg')],
  d: [R('dedo', '👆'), R('durazno', '🍑')],
  e: [R('elefante', '🐘'), R('escarabajo', '🪲')],
  f: [R('flor', '🌸'), R('flor', '🌺'), R('flor', '🌻'), R('flor', '🌼'), R('flor', '🌹')],
  g: [R('gato', '🐈'), R('gorila', '🦍'), R('galletita', '🍪')],
  h: [R('hielo', '🧊'), R('helado', 'helado.webp')],
  i: [R('iguana', '🦎')],
  j: [R('jaguar', '🐆'), R('jabón', 'jabon.jpg')],
  k: [R('kiwi', '🥝')],
  l: [R('luna', 'luna.jpg'), R('lombríz', '🪱'), R('lluvia', '')],
  m: [R('mamá', 'mama.jpg'), R('manzana', '🍎'), R('miel', '🍯'), R('mango', '🥭')],
  n: [R('naranja', '🍊'), R('nube', '☁️'), R('nariz', 'nariz.jpg')],
  o: [R('oso', '🐻'), R('ojo', '👁')],
  p: [
    R('papá', 'papa.jpg'),
    R('papa', '🥔'),
    R('palta', '🥑'),
    R('piedra', '🪨'),
    R('perro', 'perro.jpg'),
    R('pizza', '🍕'),
  ],
  q: [R('quirquincho', 'quirquincho.jpg'), R('queso', '🧀')],
  r: [R('rueda', '🛞'), R('ratón', '🐀')],
  s: [R('sol', 'sol.jpg'), R('sandía', '🍉')],
  t: [R('tobogán', '🛝'), R('tíabu Yan', 'tiabu_yan.jpg'), R('tío Maxi', 'tio_maxi.jpg')],
  u: [R('Uma', 'uma.jpg'), R('uva', '🍇')],
  v: [R('vaca', '🐄'), R('vaca', '🐮'), R('vaca', 'vaca.jpg'), R('volcán', '🌋')],
  w: [R('waffle', 'waffle.jpg', 'uafle'), R('wapití', '🦌')],
  x: [R('xilofón', 'xilofon.jpg')],
  y: [R('yacaré', 'yacare.jpeg')],
  z: [R('zorro', '🦊'), R('zapato', '🥾')],
};

export const colors: { [key: string]: Hsl } = {
  rojo: new Hsl(0, 50, 50),
  marrón: new Hsl(34, 50, 30),
  naranja: new Hsl(26, 100, 53),
  amarillo: new Hsl(50, 100, 60),
  'verde claro': new Hsl(73, 54, 41),
  'verde oscuro': new Hsl(77, 84, 22),
  azul: new Hsl(204, 50, 50),
  celeste: new Hsl(176, 100, 82),
  violeta: new Hsl(297, 100, 27),
  lila: new Hsl(331, 24, 65),
  rosa: new Hsl(0, 100, 85),
  negro: new Hsl(0, 0, 0),
  blanco: new Hsl(0, 0, 100),
  gris: new Hsl(0, 0, 50),
};

export const lettersPronunciations: { [key: string]: string } = {
  b: 'be larga',
  v: 've corta',
  w: 'doblevé',
  y: 'y griega',
};

export function adaptLetter(key: string) {
  return lettersPronunciations[key] || key;
}
