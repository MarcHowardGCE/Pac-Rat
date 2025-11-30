/**
 * Collision Detection Utilities
 * 
 * This module contains functions for detecting collisions and movement validation
 * in the Pac-Rat game.
 */

import { TUNNEL_ROW, GRID_HEIGHT, GRID_WIDTH } from './constants.js';

/**
 * Check if a position is valid for movement
 * @param {number} x - Grid X coordinate
 * @param {number} y - Grid Y coordinate
 * @param {number[][]} maze - The maze layout array
 * @returns {boolean} True if the position is valid for movement
 */
export const canMove = (x, y, maze) => {
  // Out of bounds check (except for tunnel row)
  if (
    y < 0 ||
    y >= GRID_HEIGHT ||
    (x < 0 && y !== TUNNEL_ROW) ||
    (x >= GRID_WIDTH && y !== TUNNEL_ROW)
  ) {
    return false;
  }

  // Allow tunnel movement
  if (y === TUNNEL_ROW && (x < 0 || x >= GRID_WIDTH)) {
    return true;
  }

  // Check if cell is not a wall
  return maze[y] && maze[y][x] !== 1;
};

/**
 * Check for collision between player and rats
 * @param {Object} player - Player state object
 * @param {Array} rats - Array of rat state objects
 * @returns {Object|null} The rat that collided with player, or null if no collision
 */
export const checkPlayerRatCollision = (player, rats) => {
  const playerGridX = Math.round(player.x);
  const playerGridY = Math.round(player.y);

  for (const rat of rats) {
    const ratGridX = Math.round(rat.x);
    const ratGridY = Math.round(rat.y);
    const distance = Math.sqrt(
      Math.pow(playerGridX - ratGridX, 2) + Math.pow(playerGridY - ratGridY, 2)
    );

    if (distance < 1) {
      return rat;
    }
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
