import { useState, useCallback, useRef } from 'react';
import { RAT_CONFIGS } from '../utils/constants.js';
import { advanceRat, initializeRat, initializeRats } from '../utils/ratMovement.js';

export function useRats(maze, layout) {
  const [rats, setRatState] = useState(initializeRats);
  const ratsRef = useRef(rats);

  const setRats = useCallback((update) => {
    const next = update(ratsRef.current);
    ratsRef.current = next;
    setRatState(next);
    return next;
  }, []);

  const resetRats = useCallback(() => setRats(initializeRats), [setRats]);
  const resetRat = useCallback((index) => {
    setRats((current) => current.map((rat, i) => i === index ? initializeRat(RAT_CONFIGS[i]) : rat));
  }, [setRats]);

  const updateRats = useCallback((deltaTime, player) => (
    setRats((current) => current.map((rat) => advanceRat(rat, maze, deltaTime, player, layout)))
  ), [maze, layout, setRats]);

  return { rats, resetRats, resetRat, updateRats };
}
