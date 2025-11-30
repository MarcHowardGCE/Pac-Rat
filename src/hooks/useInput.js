/**
 * useInput Hook
 * 
 * Custom React hook for handling user input including:
 * - Keyboard controls (Arrow keys and WASD)
 * - Touch/swipe controls for mobile
 * - Input event management
 */

import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook for handling keyboard and touch input
 * @param {Function} onDirectionChange - Callback when direction changes
 * @param {boolean} enabled - Whether input handling is enabled
 * @returns {Object} Input handling utilities
 */
export const useInput = (onDirectionChange, enabled = true) => {
  const keysRef = useRef({});
  const touchStartRef = useRef({ x: 0, y: 0 });

  /**
   * Handle keyboard key down events
   */
  const handleKeyDown = useCallback(
    (e) => {
      if (!enabled) return;

      keysRef.current[e.key] = true;

      // Handle direction changes
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        onDirectionChange({ x: 0, y: -1 });
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        onDirectionChange({ x: 0, y: 1 });
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        onDirectionChange({ x: -1, y: 0 });
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        onDirectionChange({ x: 1, y: 0 });
        e.preventDefault();
      }
    },
    [onDirectionChange, enabled]
  );

  /**
   * Handle keyboard key up events
   */
  const handleKeyUp = useCallback((e) => {
    keysRef.current[e.key] = false;
  }, []);

  /**
   * Handle touch start events
   */
  const handleTouchStart = useCallback(
    (e) => {
      if (!enabled) return;
      touchStartRef.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
      e.preventDefault();
    },
    [enabled]
  );

  /**
   * Handle touch end events (swipe detection)
   */
  const handleTouchEnd = useCallback(
    (e) => {
      if (!enabled) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartRef.current.x;
      const deltaY = touchEndY - touchStartRef.current.y;
      const minSwipeDistance = 30;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            onDirectionChange({ x: 1, y: 0 });
          } else {
            onDirectionChange({ x: -1, y: 0 });
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            onDirectionChange({ x: 0, y: 1 });
          } else {
            onDirectionChange({ x: 0, y: -1 });
          }
        }
      }

      e.preventDefault();
    },
    [onDirectionChange, enabled]
  );

  /**
   * Set up and clean up event listeners
   */
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, enabled]);

  /**
   * Get touch event handlers for canvas
   * @returns {Object} Touch event handlers
   */
  const getTouchHandlers = useCallback(() => {
    return {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    };
  }, [handleTouchStart, handleTouchEnd]);

  return {
    getTouchHandlers,
  };
};
