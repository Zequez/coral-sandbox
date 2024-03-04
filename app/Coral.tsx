import { JSX, createRef } from 'preact';
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
  const [showColorDisplayTimeout, setShowColorDisplayTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [showLetterDisplay, setShowLetterDisplay] = useState(false);
  const [lettersIndexes, setLettersIndexes] = useState<{ [key: string]: number }>({});
  const [caretPosition, setCaretPosition] = useState<number>(val.length - 1);
  // const [scrollPosition, setScrollPosition]= useState(0);

  const textareaRef = createRef<HTMLTextAreaElement>();
  const textareaOverlayRef = createRef<HTMLDivElement>();

  useEffect(() => {
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Tab') {
        ev.preventDefault();
        setColor((prevColor) => {
          const colorKeys = Object.keys(colors);
          const nextColorIndex = colorKeys.indexOf(prevColor) + 1;
          const nextColor = colorKeys[nextColorIndex] ? colorKeys[nextColorIndex] : colorKeys[0];
          speak(nextColor);
          setShowColorDisplayTimeout((prevTimeout) => {
            if (prevTimeout) {
              clearTimeout(prevTimeout);
            }
            const thisTimeout = setTimeout(() => {
              setShowColorDisplayTimeout((currentTimeout) => {
                if (currentTimeout === thisTimeout) return null;
                else return currentTimeout;
              });
            }, 3000);
            return thisTimeout;
          });

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
    setCaretPosition(start);
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
    if (textareaOverlayRef.current && textareaRef.current) {
      textareaOverlayRef.current.scrollTop = textareaRef.current.scrollTop;
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

    if (key === 'escape') {
      if (val !== '') {
        setVal('');
        speak('Borro todo');
      }
    } else if (key === ',') {
      speak('coma');
    } else if (key === '.') {
      speak('punto');
    } else if (key === '/') {
      speak('barra');
    } else if (key === ' ') {
      speak('espacio');
    } else if (key === ':') {
      speak('dos puntos');
    } else if (key === 'tab') {
      return;
    } else if (key === 'enter') {
      const lines = ev.target.value.slice(0, caretPosition).split('\n');
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
    } else if (key.length === 1) {
      await speak(key);
    } else {
      return;
    }
  }

  const hsl = colors[color];

  return (
    <div className="h-screen w-screen relative">
      <div class="absolute top-0 h-5/6 w-10 flex flex-col items-stretch whitespace-nowrap">
        {Object.keys(colors).map((colorKey) => {
          return (
            <div
              key={colorKey}
              class="flex-grow"
              style={{ backgroundColor: colors[colorKey].str }}
            ></div>
          );
        })}
      </div>
      <div class="w-screen relative h-5/6 pl-10">
        <textarea
          autofocus
          className="p-2 block w-full h-full uppercase text-7xl tracking-2 font-mono outline-none"
          style={{
            backgroundColor: hsl.str,
            color: hsl.textColor.str,
          }}
          ref={textareaRef}
          onInput={onInputChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onMouseUp={onMouseUp}
          onScroll={(ev) => {
            if (textareaOverlayRef.current) {
              textareaOverlayRef.current.scrollTop = ev.currentTarget.scrollTop;
            }
          }}
          value={val}
        ></textarea>
        <div
          style={{
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
          ref={textareaOverlayRef}
          class="pointer-events-none p-2 absolute left-10 top-0 right-0 bottom-0 uppercase font-mono tracking-2 text-7xl overflow-auto"
        >
          <span className="text-transparent">
            {val.slice(0, caretPosition || 0)}
            <span
              style={{
                color: hsl.textColor.str,
              }}
              className="relative opacity-50"
            >
              _
              <span
                style={{
                  backgroundColor: hsl.textColor.str,
                  borderColor: hsl.textColor.darker.str,
                }}
                class="block absolute inset-0 border-l-4 border-2 border-black border-solid rounded-md"
              ></span>
            </span>
          </span>
        </div>
      </div>
      <div
        className="h-1/6 text-white text-6xl flex items-center px-8 uppercase overflow-hidden"
        style={{ backgroundColor: hsl.darker.str }}
      >
        {lastLetter ? (
          <Letter letter={lastLetter} lettersIndexes={lettersIndexes} hidden={!showLetterDisplay} />
        ) : null}
      </div>
      {!!showColorDisplayTimeout ? (
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            style={{ backgroundColor: hsl.textColor.str, color: hsl.str }}
            class="p-4 rounded-md shadow-lg uppercase text-6xl"
          >
            {color}
          </div>
        </div>
      ) : null}
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
