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
import {
  PLAYER_CONFIG,
  POWER_UP_DURATION,
} from '../utils/constants.js';
import { movePlayer } from '../utils/playerMovement.js';

/**
 * Hook for managing player state and movement
 * @param {number[][]} maze - Current maze layout
 * @returns {Object} Player state and control functions
 */
export const usePlayer = (maze) => {
  // Player state
  const [player, setPlayerState] = useState({
    x: PLAYER_CONFIG.START_X,
    y: PLAYER_CONFIG.START_Y,
    direction: { x: 0, y: 0 },
    facingDirection: { x: 1, y: 0 },
    nextDirection: { x: 0, y: 0 },
    turnBufferMs: 0,
    speed: PLAYER_CONFIG.SPEED,
    mouthAngle: 0,
    powered: false,
    powerTimer: 0,
    dying: false,
    deathAnimation: 0,
  });

  const playerRef = useRef(player);
  const setPlayer = useCallback((update) => {
    const next = typeof update === 'function' ? update(playerRef.current) : update;
    playerRef.current = next;
    setPlayerState(next);
  }, []);
  const getPlayer = useCallback(() => playerRef.current, []);

  /**
   * Reset player to starting position
   */
  const resetPlayer = useCallback(() => {
    setPlayer({
      x: PLAYER_CONFIG.START_X,
      y: PLAYER_CONFIG.START_Y,
      direction: { x: 0, y: 0 },
      facingDirection: { x: 1, y: 0 },
      nextDirection: { x: 0, y: 0 },
      turnBufferMs: 0,
      speed: PLAYER_CONFIG.SPEED,
      mouthAngle: 0,
      powered: false,
      powerTimer: 0,
      dying: false,
      deathAnimation: 0,
    });
  }, [setPlayer]);

  /**
   * Set the next movement direction (queued input)
   * @param {Object} direction - Direction object with x and y
   */
  const setNextDirection = useCallback((direction) => {
    setPlayer((prev) => ({
      ...prev,
      nextDirection: direction,
      turnBufferMs: PLAYER_CONFIG.TURN_BUFFER_MS,
    }));
  }, [setPlayer]);

  const clearPendingTurn = useCallback(() => {
    if (playerRef.current.turnBufferMs > 0) {
      setPlayer((current) => ({ ...current, turnBufferMs: 0 }));
    }
  }, [setPlayer]);

  /**
   * Activate power-up mode
   */
  const activatePowerUp = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      powered: true,
      powerTimer: POWER_UP_DURATION,
    }));
  }, [setPlayer]);

  /**
   * Start death animation
   */
  const startDeath = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      dying: true,
      deathAnimation: 0,
    }));
  }, [setPlayer]);

  /**
   * Update player position and state
   * @param {number} deltaTime - Time elapsed since last update
   * @param {number} animationFrame - Current animation frame counter
   * @returns {Object} The new player state and any collectibles encountered
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

        const movement = movePlayer(prev, maze, deltaTime);
        const { x: newX, y: newY, direction: newDirection } = movement;

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
          ...movement,
          facingDirection: newDirection.x || newDirection.y ? newDirection : prev.facingDirection,
          mouthAngle: newMouthAngle,
          powered: newPowered,
          powerTimer: newPowerTimer,
        };
      })(playerRef.current);

      setPlayer(newState);

      return { ...collected, player: newState };
    },
    [maze, setPlayer]
  );

  return {
    player,
    getPlayer,
    resetPlayer,
    setNextDirection,
    clearPendingTurn,
    activatePowerUp,
    startDeath,
    updatePlayer,
  };
};
