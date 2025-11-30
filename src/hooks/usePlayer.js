/**
 * usePlayer Hook
 * 
 * Custom React hook for managing player state and movement including:
 * - Position and direction
 * - Power-up state
 * - Death animation
 * - Grid-based movement with snapping
 */

import { useState, useCallback, useRef } from 'react';
import { PLAYER_CONFIG, POWER_UP_DURATION, GRID_WIDTH } from '../utils/constants.js';
import { canMove } from '../utils/collision.js';

/**
 * Hook for managing player state and movement
 * @param {number[][]} maze - Current maze layout
 * @returns {Object} Player state and control functions
 */
export const usePlayer = (maze) => {
  // Player state
  const [player, setPlayer] = useState({
    x: PLAYER_CONFIG.START_X,
    y: PLAYER_CONFIG.START_Y,
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    speed: PLAYER_CONFIG.SPEED,
    mouthAngle: 0,
    powered: false,
    powerTimer: 0,
    dying: false,
    deathAnimation: 0,
  });

  // Use ref to avoid stale closure issues in update loop
  const playerRef = useRef(player);
  playerRef.current = player;

  /**
   * Reset player to starting position
   */
  const resetPlayer = useCallback(() => {
    setPlayer({
      x: PLAYER_CONFIG.START_X,
      y: PLAYER_CONFIG.START_Y,
      direction: { x: 0, y: 0 },
      nextDirection: { x: 0, y: 0 },
      speed: PLAYER_CONFIG.SPEED,
      mouthAngle: 0,
      powered: false,
      powerTimer: 0,
      dying: false,
      deathAnimation: 0,
    });
  }, []);

  /**
   * Set the next movement direction (queued input)
   * @param {Object} direction - Direction object with x and y
   */
  const setNextDirection = useCallback((direction) => {
    setPlayer((prev) => ({
      ...prev,
      nextDirection: direction,
    }));
  }, []);

  /**
   * Activate power-up mode
   */
  const activatePowerUp = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      powered: true,
      powerTimer: POWER_UP_DURATION,
    }));
  }, []);

  /**
   * Start death animation
   */
  const startDeath = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      dying: true,
      deathAnimation: 0,
    }));
  }, []);

  /**
   * Update player position and state
   * @param {number} deltaTime - Time elapsed since last update
   * @param {number} animationFrame - Current animation frame counter
   * @returns {Object} Collected items {dot: {x, y}, powerUp: {x, y}}
   */
  const updatePlayer = useCallback(
    (deltaTime, animationFrame) => {
      // Track collected items for this update
      let collected = { dot: null, powerUp: null };

      const newState = ((prev) => {
        // Update death animation
        if (prev.dying) {
          const newDeathAnimation = prev.deathAnimation + deltaTime;
          return {
            ...prev,
            deathAnimation: newDeathAnimation,
          };
        }

        // Update power timer
        let newPowered = prev.powered;
        let newPowerTimer = prev.powerTimer;
        if (prev.powered) {
          newPowerTimer = prev.powerTimer - deltaTime;
          if (newPowerTimer <= 0) {
            newPowered = false;
            newPowerTimer = 0;
          }
        }

        // Check if player is aligned with grid
        const gridX = Math.round(prev.x);
        const gridY = Math.round(prev.y);
        const alignedX = Math.abs(prev.x - gridX) < 0.1;
        const alignedY = Math.abs(prev.y - gridY) < 0.1;
        const isAligned = alignedX && alignedY;

        let newDirection = prev.direction;
        let newX = prev.x;
        let newY = prev.y;

        // Try to change direction when aligned
        if (isAligned && (prev.nextDirection.x !== 0 || prev.nextDirection.y !== 0)) {
          const nextX = gridX + prev.nextDirection.x;
          const nextY = gridY + prev.nextDirection.y;

          if (canMove(nextX, nextY, maze)) {
            newDirection = { ...prev.nextDirection };
            newX = gridX;
            newY = gridY;
          }
        }

        // Move in current direction
        const moveX = newX + newDirection.x * prev.speed;
        const moveY = newY + newDirection.y * prev.speed;

        if (canMove(Math.round(moveX), Math.round(moveY), maze)) {
          newX = moveX;
          newY = moveY;

          // Handle tunnel wrapping
          if (newX < 0) newX = GRID_WIDTH - 1;
          if (newX >= GRID_WIDTH) newX = 0;
        } else {
          // Can't move, snap to grid and stop
          newX = gridX;
          newY = gridY;
          newDirection = { x: 0, y: 0 };
        }

        // Animate mouth
        const newMouthAngle = Math.abs(Math.sin(animationFrame / 100) * 0.4);

        // Check for collectibles at current position
        const currentGridX = Math.round(newX);
        const currentGridY = Math.round(newY);
        
        if (maze[currentGridY] && maze[currentGridY][currentGridX] === 2) {
          collected = { ...collected, dot: { x: currentGridX, y: currentGridY } };
        } else if (maze[currentGridY] && maze[currentGridY][currentGridX] === 3) {
          collected = { ...collected, powerUp: { x: currentGridX, y: currentGridY } };
        }

        return {
          ...prev,
          x: newX,
          y: newY,
          direction: newDirection,
          mouthAngle: newMouthAngle,
          powered: newPowered,
          powerTimer: newPowerTimer,
        };
      })(playerRef.current);

      setPlayer(newState);

      return collected;
    },
    [maze]
  );

  return {
    player,
    resetPlayer,
    setNextDirection,
    activatePowerUp,
    startDeath,
    updatePlayer,
  };
};
