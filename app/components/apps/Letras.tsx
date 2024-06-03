import { useEffect, useRef, useState } from 'preact/hooks';
import cx from 'classnames';
import { speak } from '../../lib/speech';
import beep, { beepbeepbeep } from '../../lib/beep';
import { lettersPronunciations } from '../../config';

const LETTERS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
const COUNT = LETTERS.length;
const WIDTH = 5;
const HEIGHT = Math.ceil(COUNT / WIDTH);

function indexToRow(index: number) {
  return Math.floor(index / 5);
}

function indexToCol(index: number) {
  return index % 5;
}

function colAndRowToIndex(col: number, row: number) {
  return row * 5 + col;
}

function letterToHue(letter: string) {
  return (LETTERS.indexOf(letter) / LETTERS.length) * 360;
}

function getRandomLetter() {
  return LETTERS[Math.floor(Math.random() * LETTERS.length)];
}

const streakColorGroupSize = 4;
const streakHues = [0, 30, 60, 80, 170, 220, 290];
const colorsGroupsCount = streakHues.length;
const maxStreak = streakColorGroupSize * colorsGroupsCount;
function getStreakColor(current: number, total: number) {
  const colorGroup = Math.floor((current / maxStreak) * colorsGroupsCount);
  const currentHue = streakHues[colorGroup];
  return `hsl(${currentHue}, 100%, 60%)`;
}

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
let lastLetter = '';
export default function Letras() {
  const [currentLetter, setCurrentLetter] = useState('A');
  const [targetLetter, setTargetLetter] = useState(getRandomLetter);
  const [streak, setStreak] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function keyDownHandler(ev: KeyboardEvent) {
      if (debounceTimeout) {
        if (lastLetter === ev.key) {
          return;
        }
        clearTimeout(debounceTimeout);
        debounceTimeout = null;
      }

      if (!debounceTimeout) {
        lastLetter = ev.key;
        debounceTimeout = setTimeout(() => {
          debounceTimeout = null;
        }, 250);
      }

      const key = ev.key;
      const currentIndex = LETTERS.indexOf(currentLetter);
      let row = indexToRow(currentIndex);
      let col = indexToCol(currentIndex);
      let newIndex = currentIndex;

      let arrowKey = false;
      do {
        if (key === 'ArrowLeft') {
          --col;
          if (col < 0) col = 4;
          arrowKey = true;
        } else if (key === 'ArrowRight') {
          ++col;
          if (col > 4) col = 0;
          arrowKey = true;
        } else if (key === 'ArrowUp') {
          --row;
          if (row < 0) row = HEIGHT - 1;
          arrowKey = true;
          arrowKey = true;
        } else if (key === 'ArrowDown') {
          ++row;
          if (row > HEIGHT - 1) row = 0;
          arrowKey = true;
        }
        if (arrowKey) newIndex = colAndRowToIndex(col, row);
      } while (!LETTERS[newIndex]);

      let letterKey = false;
      let speakKey: string | null = null;
      if (!arrowKey) {
        const upperCaseKey = key.toLocaleUpperCase();

        if (LETTERS.indexOf(upperCaseKey) !== -1) {
          letterKey = true;
          newIndex = LETTERS.indexOf(upperCaseKey);
          speakKey = key;
        } else if (key === ' ' || key === 'Enter') {
          speakKey = currentLetter.toLocaleLowerCase();
        }
      }

      const nextLetter = LETTERS[newIndex];
      const reachedTarget = nextLetter === targetLetter;

      if (reachedTarget) {
        if (divRef.current) {
          divRef.current.classList.add('animate-done-shake');
          // divRef.current
          setTimeout(() => {
            divRef.current?.classList.remove('animate-done-shake');
          }, 1250);
        }
        let newRandomLetter;
        do {
          newRandomLetter = getRandomLetter();
        } while (newRandomLetter === targetLetter);
        setTargetLetter(newRandomLetter);
        setStreak((v) => {
          if (v === maxStreak) {
            return v;
          }
          beep();
          const newStreak = v + 1;
          if (newStreak % streakColorGroupSize === 0) {
            beepbeepbeep();
          }
          return newStreak;
        });
      } else if (arrowKey || letterKey) {
        setStreak(0);
      }

      if (reachedTarget && arrowKey) {
        speakKey = nextLetter.toLocaleLowerCase();
      }

      if (speakKey) {
        speak(lettersPronunciations[speakKey] || speakKey);
      }

      if (newIndex !== currentIndex) setCurrentLetter(nextLetter);
    }

    window.addEventListener('keydown', keyDownHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
    };
  }, [currentLetter]);

  return (
    <div ref={divRef} class="bg-gray-50 h-100vh p-4 flex flex-col">
      <div class="relative flex flex-wrap text-black/70">
        {LETTERS.map((letter) => (
          <div class="relative w-1/5 text-[70px] font-bold">
            <div class="pt-[100%]"></div>
            <div class="absolute inset-0 p-4">
              <div
                style={{
                  backgroundColor: `hsl(${letterToHue(letter)}, 60%, 85%)`,
                }}
                class={cx(
                  'h-full flex items-center justify-center rounded-lg transition-ease-out transition-transform',
                  {
                    'bg-slate-200': letter !== currentLetter,
                    'bg-gradient-to-br from-gray-600/50 to-gray-700/50  text-white  scale-120':
                      letter === currentLetter,
                  },
                )}
              >
                {letter}
              </div>
            </div>
          </div>
        ))}
        <div class="w-3/5 p-4">
          <div class="relative bg-black/10 rounded-lg">
            <div class="pt-1/3"></div>
            <div class="absolute inset-0 p-4 flex items-center">
              <div>
                {[...Array(streak)].map((_, i) => (
                  <div
                    class="h-[27px] w-[27px] float-left mr-2 my-2 rounded-full border-2 border-black/10"
                    style={{ backgroundColor: getStreakColor(i, streak) }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-grow p4 rounded-lg">
        <div
          class="h-full flex items-center justify-center rounded-lg text-[140px] font-bold text-black/70"
          style={{
            backgroundColor: `hsl(${letterToHue(targetLetter)}, 60%, 85%)`,
          }}
        >
          {targetLetter}
        </div>
      </div>
    </div>
  );
}
