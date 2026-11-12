/**
 * useRats Hook
 * 
 * Custom React hook for managing enemy rats including:
 * - AI pathfinding (chase and flee modes)
 * - Staggered exit from base
 * - Movement and collision
 */

import { useState, useCallback } from 'react';
import {
  RAT_CONFIGS,
  SPEED,
  GRID_WIDTH,
  REFERENCE_FRAME_MS,
  MAX_MOVEMENT_DELTA_MS,
} from '../utils/constants.js';
import { canMove } from '../utils/collision.js';

/**
 * Initialize rats from config
 * @returns {Array} Array of rat state objects
 */
const initializeRats = () => {
  return RAT_CONFIGS.map((config) => ({
    ...config,
    x: config.startX,
    y: config.startY,
    direction: { ...config.direction },
    mode: 'chase',
    exitTimer: 0,
    hasExited: false,
  }));
};

/**
 * Hook for managing rats (enemies)
 * @param {number[][]} maze - Current maze layout
 * @param {Object} player - Player state object
 * @returns {Object} Rats state and control functions
 */
export const useRats = (maze, player) => {
  const [rats, setRats] = useState(initializeRats());

  /**
   * Reset all rats to starting positions
   */
  const resetRats = useCallback(() => {
    setRats(initializeRats());
  }, []);

  /**
   * Reset a specific rat to its starting position
   * @param {number} ratIndex - Index of rat to reset
   */
  const resetRat = useCallback((ratIndex) => {
    setRats((prevRats) => {
      const newRats = [...prevRats];
      const config = RAT_CONFIGS[ratIndex];
      newRats[ratIndex] = {
        ...newRats[ratIndex],
        x: config.startX,
        y: config.startY,
        direction: { ...config.direction },
        exitTimer: 0,
        hasExited: false,
      };
      return newRats;
    });
  }, []);

  /**
   * Get the best direction to chase the player
   * @param {Object} rat - Rat state object
   * @param {Array} directions - Available directions
   * @param {Object} playerPos - Player position
   * @returns {Object} Best direction to chase player
   */
  const getChaseDirection = useCallback((rat, directions, playerPos) => {
    let bestDir = directions[0];
    let bestDist = Infinity;

    directions.forEach((dir) => {
      const nextX = Math.round(rat.x) + dir.x;
      const nextY = Math.round(rat.y) + dir.y;
      const dist = Math.sqrt(
        Math.pow(nextX - playerPos.x, 2) + Math.pow(nextY - playerPos.y, 2)
      );

      if (dist < bestDist) {
        bestDist = dist;
        bestDir = dir;
      }
    });

    return bestDir;
  }, []);

  /**
   * Get the best direction to flee from the player
   * @param {Object} rat - Rat state object
   * @param {Array} directions - Available directions
   * @param {Object} playerPos - Player position
   * @returns {Object} Best direction to flee from player
   */
  const getAwayDirection = useCallback((rat, directions, playerPos) => {
    let bestDir = directions[0];
    let bestDist = -Infinity;

    directions.forEach((dir) => {
      const nextX = Math.round(rat.x) + dir.x;
      const nextY = Math.round(rat.y) + dir.y;
      const dist = Math.sqrt(
        Math.pow(nextX - playerPos.x, 2) + Math.pow(nextY - playerPos.y, 2)
      );

      if (dist > bestDist) {
        bestDist = dist;
        bestDir = dir;
      }
    });

    return bestDir;
  }, []);

  /**
   * Update all rats
   * @param {number} deltaTime - Time elapsed since last update
   */
  const updateRats = useCallback(
    (deltaTime) => {
      setRats((prevRats) => {
        return prevRats.map((rat) => {
          // Check if rat should be in base (during exit delay)
          if (!rat.hasExited && rat.exitTimer < rat.exitDelay) {
            return {
              ...rat,
              exitTimer: rat.exitTimer + deltaTime,
            };
          }

          // Mark as exited once delay is over
          const hasExited = rat.hasExited || rat.exitTimer >= rat.exitDelay;

          // Simple AI: Change direction at intersections
          const gridX = Math.round(rat.x);
          const gridY = Math.round(rat.y);

          // Check if at intersection
          const isAtIntersection =
            Math.abs(rat.x - gridX) < 0.1 && Math.abs(rat.y - gridY) < 0.1;

          let newDirection = rat.direction;

          if (isAtIntersection) {
            const possibleDirections = [];

            // Check all four directions, avoid immediate reversals
            if (canMove(gridX, gridY - 1, maze) && rat.direction.y !== 1) {
              possibleDirections.push({ x: 0, y: -1 });
            }
            if (canMove(gridX, gridY + 1, maze) && rat.direction.y !== -1) {
              possibleDirections.push({ x: 0, y: 1 });
            }
            if (canMove(gridX - 1, gridY, maze) && rat.direction.x !== 1) {
              possibleDirections.push({ x: -1, y: 0 });
            }
            if (canMove(gridX + 1, gridY, maze) && rat.direction.x !== -1) {
              possibleDirections.push({ x: 1, y: 0 });
            }

            if (possibleDirections.length > 0) {
              // Choose direction based on whether player is powered
              if (player.powered) {
                // Run away from player
                newDirection = getAwayDirection(rat, possibleDirections, player);
              } else {
                // Chase player
                newDirection = getChaseDirection(rat, possibleDirections, player);
              }
            } else {
              // At a dead end, reverse if the cell behind the rat is open.
              const reverseDirection = { x: -rat.direction.x, y: -rat.direction.y };
              if (canMove(gridX + reverseDirection.x, gridY + reverseDirection.y, maze)) {
                newDirection = reverseDirection;
              } else {
                newDirection = { x: 0, y: 0 };
              }
            }
          }

          // Move rat
          const speed = player.powered ? SPEED.RAT_SCARED : SPEED.RAT_NORMAL;
          const movementDelta = Math.min(Math.max(deltaTime, 0), MAX_MOVEMENT_DELTA_MS);
          const movementScale = movementDelta / REFERENCE_FRAME_MS;
          let newX = rat.x + newDirection.x * speed * movementScale;
          let newY = rat.y + newDirection.y * speed * movementScale;

          // Handle tunnel wrapping before checking the destination cell.
          if (newX < 0) newX = GRID_WIDTH - 1;
          if (newX >= GRID_WIDTH) newX = 0;

          if (!canMove(Math.round(newX), Math.round(newY), maze)) {
            // Stop at the current tile rather than advancing into a wall.
            newX = gridX;
            newY = gridY;
            newDirection = { x: 0, y: 0 };
          }

          return {
            ...rat,
            x: newX,
            y: newY,
            direction: newDirection,
            hasExited,
          };
        });
      });
    },
    [maze, player, getChaseDirection, getAwayDirection]
  );

  return {
    rats,
    resetRats,
    resetRat,
    updateRats,
  };
};
