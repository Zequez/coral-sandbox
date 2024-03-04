import { JSX } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { letters, colors, adaptLetter } from './config';
import { useSpeech } from './lib/speech';

const Coral = () => {
  const { speak } = useSpeech('es-AR');

  const [val, setVal] = useState('CORAL');
  const [color, setColor] = useState<string>('rojo');
  const [lastLetter, setLastLetter] = useState('');
  const [lastLetterTimeout, setLastLetterTimeout] = useState<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [showLetterDisplay, setShowLetterDisplay] = useState(false);
  const [lettersIndexes, setLettersIndexes] = useState<{ [key: string]: number }>({});
  const [caretPosition, setCaretPosition] = useState<number | null>(val.length - 1);

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

  function processCaretPosition(el: HTMLTextAreaElement) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) {
      setCaretPosition(start);
    } else {
      setCaretPosition(null);
    }
  }

  function onMouseUp(ev: MouseEvent) {
    if (!(ev.target instanceof HTMLTextAreaElement)) throw 'Nope';
    processCaretPosition(ev.target);
  }

  async function onKeyDown(ev: KeyboardEvent) {
    if (!(ev.target instanceof HTMLTextAreaElement)) throw 'Nope';
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(ev.key) !== -1) {
      processCaretPosition(ev.target);
    }
  }

  async function onKeyUp(ev: KeyboardEvent) {
    if (!(ev.target instanceof HTMLTextAreaElement)) throw 'Nope';
    processCaretPosition(ev.target);

    let key = ev.key.toLowerCase();

    async function speakSingleLetter(letter: string) {
      setLettersIndexes((currentLettersIndexes) => {
        const newLettersIndexes = { ...currentLettersIndexes };
        const currentLetterIndex = newLettersIndexes[letter];

        if (typeof currentLetterIndex === 'undefined') {
          newLettersIndexes[letter] = 0;
        } else if (letters[letter][currentLetterIndex + 1]) {
          newLettersIndexes[letter] = currentLetterIndex + 1;
        } else {
          newLettersIndexes[letter] = 0;
        }

        const adaptedLetter = adaptLetter(letter);
        const currentLetter = letters[letter][newLettersIndexes[letter]];

        speak(`${adaptedLetter}, de ${currentLetter.pronunciation}`);

        setLastLetter(letter);
        return newLettersIndexes;
      });

      if (lastLetterTimeout) {
        clearTimeout(lastLetterTimeout);
      }
      setShowLetterDisplay(true);
      setLastLetterTimeout(
        setTimeout(() => {
          setShowLetterDisplay(false);
        }, 3000),
      );
    }

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
    } else if (key === 'enter') {
      const lines = ev.target.value.split('\n');
      const filledLines = lines.filter((l) => l.trim().length > 0);
      const lastLine = filledLines.pop();
      if (lastLine) {
        const dLastLine = lastLine.toLowerCase();
        if (letters[dLastLine]) {
          await speakSingleLetter(dLastLine);
        } else {
          setShowLetterDisplay(false);
          await speak(dLastLine);
        }
      }
    } else if (letters[key]) {
      await speakSingleLetter(key);
    } else {
      return;
    }
  }

  const hsl = colors[color];

  return (
    <div className="h-screen w-screen">
      <textarea
        autofocus
        className="p-2 block w-screen h-5/6 uppercase text-7xl tracking-2 font-mono outline-none"
        style={{
          backgroundColor: hsl.str,
          color: hsl.textColor.str,
        }}
        onInput={onInputChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseUp={onMouseUp}
        value={val}
      ></textarea>
      <div className="pointer-events-none p-2 absolute top-0 w-screen h-5/6 uppercase font-mono tracking-2 text-7xl overflow-auto break-all whitespace-pre-wrap">
        <span className="text-transparent">{val.slice(0, caretPosition || 0)}</span>
        <span
          style={{
            color: hsl.textColor.str,
          }}
          className="relative opacity-50"
        >
          _
          <div
            style={{
              backgroundColor: hsl.textColor.str,
              borderColor: hsl.textColor.darker.str,
            }}
            class="absolute inset-0 border-l-4 border-2 border-black border-solid rounded-md"
          ></div>
        </span>
      </div>
      <div
        className="h-1/6 text-white text-6xl flex items-center px-8 uppercase overflow-hidden"
        style={{ backgroundColor: hsl.darker.str }}
      >
        {lastLetter ? (
          <Letter letter={lastLetter} lettersIndexes={lettersIndexes} hidden={!showLetterDisplay} />
        ) : null}
      </div>
    </div>
  );
};

function Letter({
  letter,
  lettersIndexes,
  hidden,
}: {
  letter: string;
  lettersIndexes: { [key: string]: number };
  hidden: boolean;
}) {
  const letterIndex = lettersIndexes[letter];
  const letterDisplay = letters[letter][letterIndex];
  return (
    <div
      className="flex items-center w-full transition-opacity"
      style={{ opacity: hidden ? '0' : '1' }}
    >
      <span>{letter}</span>
      &nbsp;
      <span className="opacity-50 text-4xl">DE</span>
      &nbsp;
      <span className="flex-grow">{letterDisplay.word}</span>
      {letterDisplay.photo ? (
        <span className="h-full w-28 flex-shrink-0">
          <img src={letterDisplay.photo} className="h-full w-full rounded-md" />
        </span>
      ) : (
        <span className="text-9xl">{letterDisplay.emoji}</span>
      )}
    </div>
  );
}

export default Coral;
