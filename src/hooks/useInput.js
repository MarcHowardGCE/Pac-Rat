import { useEffect, useRef } from 'react';

const UP = { x: 0, y: -1 };
const LEFT = { x: -1, y: 0 };
const DOWN = { x: 0, y: 1 };
const RIGHT = { x: 1, y: 0 };
const KEY_DIRECTIONS = new Map([
  ['arrowup', UP], ['w', UP],
  ['arrowleft', LEFT], ['a', LEFT],
  ['arrowdown', DOWN], ['s', DOWN],
  ['arrowright', RIGHT], ['d', RIGHT],
]);
const MIN_SWIPE_DISTANCE = 30;

export function useInput(onDirectionChange, enabled = true) {
  const swipeStart = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event) {
      const direction = KEY_DIRECTIONS.get(event.key.toLowerCase());
      if (!direction || event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      // Browser key repeat must not replace a more recent turn.
      if (!event.repeat) onDirectionChange(direction);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      swipeStart.current = null;
    };
  }, [onDirectionChange, enabled]);

  return {
    onTouchStart(event) {
      if (enabled && event.touches.length === 1) swipeStart.current = event.changedTouches[0];
    },
    onTouchEnd(event) {
      const start = swipeStart.current;
      if (!enabled || !start) return;
      const end = Array.from(event.changedTouches).find((touch) => touch.identifier === start.identifier);
      if (!end) return;

      swipeStart.current = null;
      const x = end.clientX - start.clientX;
      const y = end.clientY - start.clientY;
      if (Math.max(Math.abs(x), Math.abs(y)) < MIN_SWIPE_DISTANCE) return;

      onDirectionChange(Math.abs(x) > Math.abs(y) ? (x > 0 ? RIGHT : LEFT) : (y > 0 ? DOWN : UP));
    },
    onTouchCancel() {
      swipeStart.current = null;
    },
  };
}
