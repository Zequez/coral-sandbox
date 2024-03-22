import { useEffect } from 'preact/hooks';
import cx from 'classnames';
import useLocalStorageState from '../../lib/useLocalStorageState';

export default function Launcher({
  apps,
  onSelect,
}: {
  apps: Record<string, { name: string; icon: string }>;
  onSelect: (app: string) => void;
}) {
  const entries = Object.entries(apps);
  const keys = Object.keys(apps);
  const [focusedApp, setFocusedApp] = useLocalStorageState<string>(
    '__CORAL_SANDBOX__lastApp',
    entries[0][0],
  );

  useEffect(() => {
    function throttle(callback: (ev: KeyboardEvent) => void, delay: number) {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      return function (ev: KeyboardEvent) {
        if (!timeoutId) {
          callback(ev);
          timeoutId = setTimeout(() => {
            timeoutId = null;
          }, delay);
        }
      };
    }

    const listener = throttle((ev: KeyboardEvent) => {
      if (ev.key === 'ArrowDown') {
        setFocusedApp((prev) => {
          const nextIndex = keys.indexOf(prev) + 1;
          return keys[nextIndex] || keys[0];
        });
      } else if (ev.key === 'ArrowUp') {
        setFocusedApp((prev) => {
          const prevIndex = keys.indexOf(prev) - 1;
          return keys[prevIndex] || keys[keys.length - 1];
        });
      } else if (ev.key === 'Enter') {
        onSelect(focusedApp);
      }
    }, 100);
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [focusedApp]);

  return (
    <div class="bg-yellow-100 flex flex-col items-center justify-center h-screen w-screen">
      <div class="flex flex-col justify-left space-y-4">
        {entries.map(([app, { name, icon }]) => (
          <button
            class={cx(
              'rounded-md px-4 py-2 font-semibold border border-solid border-black/10 shadow-sm transition-transform',
              {
                'bg-yellow-400 text-white scale-120': app === focusedApp,
                'bg-white text-black/60': app !== focusedApp,
              },
            )}
          >
            <span class="text-xl mr-2">{icon}</span>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
