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
    R('araña', '🕷'),
    R('árbol', '🌳'),
    R('arcoiris', 'arcoiris.jpg'),
  ],
  b: [
    R('barco', '⛵️'),
    R('bicicleta', '🚲'),
    R('banana', '🍌'),
    R('bolsa', '🛍'),
    R('ballena', '🐋'),
    R('berenjena', '🍆'),
  ],
  c: [
    R('Coral', 'coral.jpg'),
    R('casa', 'casa.jpg'),
    R('caca', '💩'),
    R('copos', 'copos.jpg'),
    R('caracol', '🐌'),
    R('caballo', '🐴'),
    R('cebra', '🦓'),
  ],
  d: [R('dedo', '👆'), R('durazno', '🍑'), R('delfín', 'delfin.jpg'), R('dinosaurio', '🦖')],
  e: [R('elefante', '🐘'), R('escarabajo', '🪲')],
  f: [R('flor', '🌸'), R('flor', '🌺'), R('flor', '🌻'), R('flor', '🌼'), R('flor', '🌹')],
  g: [R('gato', '🐈'), R('gorila', '🦍'), R('galletita', '🍪')],
  h: [
    R('hielo', '🧊'),
    R('helado', 'helado.webp'),
    R('herramienta', '🔧'),
    R('hormiga', '🐜'),
    R('hoja', '🍁'),
    R('hongo', '🍄'),
    R('huevo', '🥚'),
  ],
  i: [R('iguana', '🦎')],
  j: [R('jaguar', '🐆'), R('jabón', 'jabon.jpg'), R('jirafa', '🦒')],
  k: [R('kiwi', '🥝')],
  l: [R('luna', 'luna.jpg'), R('lombríz', '🪱'), R('lengua', '👅')],
  m: [
    R('mamá', 'mama.jpg'),
    R('manzana', '🍎'),
    R('miel', '🍯'),
    R('mango', '🥭'),
    R('mono', '🐒'),
    R('maní', '🥜'),
    R('mariposa', '🦋'),
    R('mosquito', 'mosquito.jpg'),
  ],
  n: [R('naranja', '🍊'), R('nube', '☁️'), R('nariz', 'nariz.jpg')],
  o: [R('oso', '🐻'), R('ojo', '👁'), R('oveja', '🐑')],
  p: [
    R('papá', 'papa.jpg'),
    R('papa', '🥔'),
    R('palta', '🥑'),
    R('piedra', '🪨'),
    R('perro', 'perro.jpg'),
    R('pizza', '🍕'),
    R('pelota', '⚽️'),
    R('pato', '🦆'),
    R('pajarito', '🕊'),
    R('pluma', '🪶'),
    R('pantalón', '👖'),
  ],
  q: [R('quirquincho', 'quirquincho.jpg'), R('queso', '🧀'), R('quinoa', 'quinoa.jpg')],
  r: [R('rueda', '🛞'), R('ratón', '🐀'), R('rama', 'rama.jpg'), R('remera', '👕'), R('rana', '🐸')],
  s: [R('sol', 'sol.jpg'), R('sandía', '🍉'), R('sapo', 'sapo.jpg')],
  t: [
    R('tierra', 'tierra.jpg'),
    R('tobogán', '🛝'),
    R('tíabu Yan', 'tiabu_yan.jpg'),
    R('tío Maxi', 'tio_maxi.jpg'),
  ],
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

export const symbols: { [key: string]: string } = {
  '.': 'punto',
  ',': 'coma',
  '/': 'barra',
  '\\': 'barra invertida',
  ':': 'dos puntos',
  ' ': 'espacio',
  '[': 'corchete abre',
  ']': 'corchete cierra',
  "'": 'comilla',
  ';': 'punto y coma',
  '=': 'igual',
  '-': 'menos, o guión',
};

export function adaptLetter(key: string) {
  return lettersPronunciations[key] || key;
}

export const numbers: { [key: string]: string } = {
  1: getPhoto('numbers/1.webp'),
  2: getPhoto('numbers/2.webp'),
  3: getPhoto('numbers/3.webp'),
  4: getPhoto('numbers/4.webp'),
  5: getPhoto('numbers/5.webp'),
  6: getPhoto('numbers/6.webp'),
  7: getPhoto('numbers/7.webp'),
  8: getPhoto('numbers/8.webp'),
  9: getPhoto('numbers/9.webp'),
};
