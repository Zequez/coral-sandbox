import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { letters, emojis } from './config';
import { speak } from './lib/speech';
// import { GenericEventHandler } from 'jsx';

const Coral = () => {
  const [val, setVal] = useState('CORAL');
  const [speaking, setSpeaking] = useState(false);
  const [colorHue, setColorHue] = useState(0);
  const [lastLetter, setLastLetter] = useState('');

  function onInputChange(ev: JSX.TargetedEvent<HTMLTextAreaElement, InputEvent>) {
    if (!(ev.target instanceof HTMLTextAreaElement)) throw 'Nope';
    setVal(ev.target.value);
  }

  async function onKeyUp(ev: KeyboardEvent) {
    if (!(ev.target instanceof HTMLTextAreaElement)) throw 'Nope';

    if (ev.key === 'Escape') {
      if (val !== '') {
        setVal('');
        speak('Borrando todo');
      }
    } else if (ev.key === ' ') {
      setColorHue((colorHue + 20) % 360);
    } else {
      // if (speaking === false) {
      //   setSpeaking(true);

      if (ev.key === 'Enter') {
        const lines = ev.target.value.split('\n');
        const filledLines = lines.filter((l) => l.trim().length > 0);
        const lastLine = filledLines.pop();
        if (lastLine) {
          await speak(lastLine);
        }
      } else if (ev.key.length === 1 && ev.key !== ' ') {
        const key = ev.key.toLowerCase();

        if (letters[key]) {
          setLastLetter(key);
          await speak(`${key}, de ${letters[key]}`);
        } else {
          await speak(key);
        }
      }
      //   setSpeaking(false);
      // }
    }
  }

  return (
    <div className="h-screen w-screen">
      <textarea
        className="p-2 block w-screen h-5/6 uppercase text-7xl tracking-2 "
        style={{ backgroundColor: `hsl(${colorHue}, 50%, 75%)` }}
        onInput={onInputChange}
        onKeyUp={onKeyUp}
        value={val}
      ></textarea>
      <div
        className="h-1/6 text-white text-6xl flex items-center px-8 uppercase overflow-hidden"
        style={{ backgroundColor: `hsl(${colorHue}, 70%, 40%)` }}
      >
        {lastLetter ? (
          <div className="flex items-center w-full">
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
