import { useState, useCallback } from 'preact/hooks';

export default function useTimedDisplay(time: number): [boolean, () => void, () => void] {
  const [displayTimeout, setDisplayTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  function showDisplay() {
    setDisplayTimeout((prevTimeout) => {
      if (prevTimeout) {
        clearTimeout(prevTimeout);
      }
      const thisTimeout = setTimeout(() => {
        setDisplayTimeout((currentTimeout) => {
          if (currentTimeout === thisTimeout) return null;
          else return currentTimeout;
        });
      }, time);
      return thisTimeout;
    });
  }

  const cancelDisplay = useCallback(() => {
    if (displayTimeout) {
      clearTimeout(displayTimeout);
      setDisplayTimeout(null);
    }
  }, [displayTimeout]);

  return [!!displayTimeout, showDisplay, cancelDisplay];
}
