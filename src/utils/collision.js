/**
 * Collision Detection Utilities
 * 
 * This module contains functions for detecting collisions and movement validation
 * in the Pac-Rat game.
 */

import { GRID_WIDTH, TUNNEL_ROW } from './constants.js';

/**
 * Check if a position is valid for movement
 * @param {number} x - Grid X coordinate
 * @param {number} y - Grid Y coordinate
 * @param {number[][]} maze - The maze layout array
 * @returns {boolean} True if the position is valid for movement
 */
export const canMove = (x, y, maze) => {
  const row = maze[y];
  if (!row?.length) return false;
  if (x >= 0 && x < row.length) return row[x] !== 1;
  if (y !== TUNNEL_ROW) return false;

  const wrappedX = (x + row.length) % row.length;
  return row[wrappedX] !== undefined && row[wrappedX] !== 1;
};

/**
 * Check for collision between player and rats
 * @param {Object} player - Player state object
 * @param {Array} rats - Array of rat state objects
 * @returns {Object|null} The rat that collided with player, or null if no collision
 */
export const checkPlayerRatCollision = (player, rats) => {
  const contactRadius = 0.65;
  for (const rat of rats) {
    if (rat.mode === 'waiting' || rat.mode === 'leaving') continue;
    let dx = Math.abs(player.x - rat.x);
    if (player.y === TUNNEL_ROW && rat.y === TUNNEL_ROW) dx = Math.min(dx, GRID_WIDTH - dx);
    if (Math.hypot(dx, player.y - rat.y) < contactRadius) return rat;
  }

  return null;
};

/**
 * Check for collision between player and a candy
 * @param {Object} player - Player state object
 * @param {Array} candies - Array of candy state objects
 * @returns {number} Index of collected candy, or -1 if no collision
 */
export const checkCandyCollision = (player, candies) => {
  const playerGridX = Math.round(player.x);
  const playerGridY = Math.round(player.y);

  for (let i = 0; i < candies.length; i++) {
    const candy = candies[i];
    const distance = Math.sqrt(
      Math.pow(candy.x - playerGridX, 2) + Math.pow(candy.y - playerGridY, 2)
    );

    if (distance < 1) {
      return i;
    }
  }

  return -1;
};

/**
 * Check if the level is complete (all dots collected)
 * @param {number[][]} maze - The maze layout array
 * @returns {boolean} True if all dots are collected
 */
export const isLevelComplete = (maze) => {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 2) {
        return false;
      }
    }
  }
  return true;
};
