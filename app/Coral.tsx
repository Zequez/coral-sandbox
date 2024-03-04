import { JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { letters, emojis, colors } from './config';
import { useSpeech } from './lib/speech';
// import { GenericEventHandler } from 'jsx';

const Coral = () => {
  const { speak } = useSpeech('es-AR');

  const [val, setVal] = useState('CORAL');
  const [color, setColor] = useState<string>('rojo');
  const [colorHue, setColorHue] = useState(0);
  const [lastLetter, setLastLetter] = useState('');
  const [lastLetterTimeout, setLastLetterTimeout] = useState<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [showLetterDisplay, setShowLetterDisplay] = useState(false);

  useEffect(() => {
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Tab') {
        ev.preventDefault();
        setColor((prevColor) => {
          const colorKeys = Object.keys(colors);
          const nextColorIndex = colorKeys.indexOf(prevColor) + 1;
          const nextColor = colorKeys[nextColorIndex] ? colorKeys[nextColorIndex] : colorKeys[0];
          speak(nextColor);
          return nextColor;
        });
      }
    });
  }, []);

  function onInputChange(ev: JSX.TargetedEvent<HTMLTextAreaElement, InputEvent>) {
    if (!(ev.target instanceof HTMLTextAreaElement)) throw 'Nope';
    setVal(ev.target.value);
  }

  async function onKeyUp(ev: KeyboardEvent) {
    if (!(ev.target instanceof HTMLTextAreaElement)) throw 'Nope';
    let key = ev.key.toLowerCase();

    if (key === 'Escape') {
      if (val !== '') {
        setVal('');
        speak('Borrando todo');
      }
    } else if (key === ',') {
      speak('coma');
    } else if (key === '.') {
      speak('punto');
    } else if (key === '/') {
      speak('barra');
    } else if (key === ' ') {
      speak('espacio');
    } else if (key === 'tab') {
      return;
    } else if (key === 'Enter') {
      const lines = ev.target.value.split('\n');
      const filledLines = lines.filter((l) => l.trim().length > 0);
      const lastLine = filledLines.pop();
      if (lastLine) {
        setShowLetterDisplay(false);
        await speak(lastLine);
      }
    } else if (letters[key]) {
      setLastLetter(key);

      if (lastLetterTimeout) {
        clearTimeout(lastLetterTimeout);
      }
      setShowLetterDisplay(true);
      setLastLetterTimeout(
        setTimeout(() => {
          setShowLetterDisplay(false);
        }, 3000),
      );

      let modifiedLetter = key;
      if (key === 'b') {
        modifiedLetter = 'be larga';
      } else if (key === 'v') {
        modifiedLetter = 've corta';
      } else if (key === 'w') {
        modifiedLetter = 'doblebé';
      } else if (key === 'y') {
        modifiedLetter = 'y griega';
      }

      await speak(`${modifiedLetter}, de ${letters[key]}`);
    } else {
      await speak(key);
    }
  }

  const hsl = colors[color];

  return (
    <div className="h-screen w-screen">
      <textarea
        className="p-2 block w-screen h-5/6 uppercase text-7xl tracking-2 "
        style={{
          backgroundColor: hsl.str,
          color: hsl.textColor.str,
        }}
        onInput={onInputChange}
        onKeyUp={onKeyUp}
        value={val}
      ></textarea>
      <div
        className="h-1/6 text-white text-6xl flex items-center px-8 uppercase overflow-hidden"
        style={{ backgroundColor: hsl.darker.str }}
      >
        {lastLetter ? (
          <div
            className="flex items-center w-full transition-opacity"
            style={{ opacity: showLetterDisplay ? '1' : '0' }}
          >
            <span>{lastLetter}</span>
            &nbsp;
            <span className="opacity-50 text-4xl">DE</span>
            &nbsp;
            <span className="flex-grow">{letters[lastLetter]}</span>
            <span className="text-9xl">{emojis[lastLetter]}</span>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Coral;
