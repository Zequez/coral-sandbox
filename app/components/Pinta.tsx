import { useRef, useEffect, useState, useCallback } from 'preact/hooks';
import cx from 'classnames';

type Square = {
  classNames: string;
};

const Pinta = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [squaresSize, setSquaresSize] = useState(0);
  const [squareHeightAdjust, setSquareHeightAdjust] = useState(0);
  const [squaresX, setSquaresX] = useState(0);
  const [squaresY, setSquaresY] = useState(0);
  const [squares, setSquares] = useState<Square[]>([]);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [isPainting, setIsPainting] = useState(false);
  // const [painMode, setPaintMode] = useState<'off' | 'locked' | 'push'>('off');
  const [movedAfterPainting, setMovedAfterPainting] = useState(false);

  useEffect(() => {
    function calculateSquares() {
      const { width, height } = document.getElementById('canvas')!.getBoundingClientRect();
      const squaresXCount = 15;
      const squaresSize = width / squaresXCount;
      const squaresYCount = height / squaresSize;
      const squaresYCountFloor = Math.floor(squaresYCount);
      setSquareHeightAdjust(((squaresYCount - squaresYCountFloor) * squaresSize) / squaresYCount);

      setSquaresSize(squaresSize);
      setSquaresX(squaresXCount);
      setSquaresY(Math.floor(squaresYCount));

      const baseSquare = { classNames: '' };

      setSquares(Array(squaresXCount * squaresYCountFloor).fill(baseSquare));
    }

    calculateSquares();

    window.addEventListener('resize', calculateSquares);
    return () => {
      window.removeEventListener('resize', calculateSquares);
    };
  }, [squaresX, squaresY]);

  useEffect(() => {
    function handleKeyDown(ev: KeyboardEvent) {
      if (ev.key === 'ArrowDown') {
        setPosY((y) => (y === squaresY - 1 ? 0 : y + 1));
        setMovedAfterPainting(true);
      } else if (ev.key === 'ArrowUp') {
        setPosY((y) => (y === 0 ? squaresY - 1 : y - 1));
        setMovedAfterPainting(true);
      } else if (ev.key === 'ArrowRight') {
        setPosX((x) => (x === squaresX - 1 ? 0 : x + 1));
        setMovedAfterPainting(true);
      } else if (ev.key === 'ArrowLeft') {
        setPosX((x) => (x === 0 ? squaresX - 1 : x - 1));
        setMovedAfterPainting(true);
      } else if (ev.key === ' ') {
        if (!ev.repeat) {
          setIsPainting((isPainting) => !isPainting);
          setMovedAfterPainting(false);
        }
      }
    }
    function handleKeyUp(ev: KeyboardEvent) {
      if (ev.key === ' ') {
        if (movedAfterPainting) {
          setIsPainting(false);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [movedAfterPainting]);

  useEffect(() => {
    if (isPainting) {
      const squareIndex = posX + posY * squaresX;
      const square = squares[squareIndex];
      if (square) {
        setSquares((squares) => {
          const head = squares.slice(0, squareIndex);
          const tail = squares.slice(squareIndex + 1);
          return [...head, { classNames: 'bg-red-500 ' }, ...tail];
        });
      }
    }
  }, [posX, posY, squaresX, isPainting]);

  return (
    <>
      <div id="canvas" class="h-screen w-screen bg-gray-900 text-white">
        {squaresX && squaresY
          ? Array(...new Array(squaresY)).map((_, y) => (
              <div class="flex">
                {Array(...new Array(squaresX)).map((_, x) => {
                  const isHighlightedSquare = posX === x && posY === y;
                  const currentSquare = squares[x + y * squaresX]!;
                  return (
                    <div
                      class={`relative ${currentSquare.classNames}`}
                      style={{
                        boxShadow: 'inset 0 0 1px #fff5',
                        width: `${squaresSize}px`,
                        height: `${squaresSize + squareHeightAdjust}px`,
                      }}
                    >
                      {isHighlightedSquare ? (
                        <div
                          class={cx('absolute inset-2 rounded-full', {
                            'bg-blue-500/25': !isPainting,
                            'bg-blue-500/50': isPainting,
                          })}
                        ></div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))
          : null}
      </div>
    </>
  );
};

export default Pinta;
