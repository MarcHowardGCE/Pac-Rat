/**
 * Rendering Utilities
 * 
 * This module contains all the canvas drawing functions for the Pac-Rat game.
 * Each function is responsible for rendering a specific game element.
 */

import { TILE_SIZE, COLORS, DEATH_ANIMATION_DURATION } from './constants.js';

/**
 * Draw the maze on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {number[][]} maze - The maze layout array
 */
export const drawMaze = (ctx, maze) => {
  const gridHeight = maze.length;
  const gridWidth = maze[0]?.length || 0;

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const cell = maze[y][x];
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      if (cell === 1) {
        // Wall - desert rock style
        ctx.fillStyle = COLORS.WALL;
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = COLORS.WALL_STROKE;
        ctx.lineWidth = 2;
        ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
      } else if (cell === 2) {
        // Dot
        ctx.fillStyle = COLORS.DOT;
        ctx.beginPath();
        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (cell === 3) {
        // Prairie dog power-up
        drawPrairieDog(ctx, px + TILE_SIZE / 2, py + TILE_SIZE / 2);
      }
    }
  }
};

/**
 * Draw the player (ferret) character
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {Object} player - Player state object
 * @param {number} animationFrame - Current animation frame counter
 */
export const drawPlayer = (ctx, player, animationFrame) => {
  const px = player.x * TILE_SIZE + TILE_SIZE / 2;
  const py = player.y * TILE_SIZE + TILE_SIZE / 2;

  // Death animation
  if (player.dying) {
    const progress = Math.min(player.deathAnimation / DEATH_ANIMATION_DURATION, 1);
    const shrinkSize = Math.max(12 * (1 - progress), 0);

    // Draw shrinking player
    ctx.fillStyle = COLORS.PLAYER_NORMAL;
    ctx.beginPath();
    ctx.arc(px, py, shrinkSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw blood droplets (particles)
    const numDroplets = 8;
    for (let i = 0; i < numDroplets; i++) {
      const angle = (i / numDroplets) * Math.PI * 2;
      const distance = progress * 20;
      const dropletX = px + Math.cos(angle) * distance;
      const dropletY = py + Math.sin(angle) * distance;
      const dropletSize = Math.max(2 * (1 - progress), 0);

      ctx.fillStyle = '#8B0000';
      ctx.beginPath();
      ctx.arc(dropletX, dropletY, dropletSize, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  // Determine rotation based on direction
  let rotation = 0;
  if (player.direction.x > 0) rotation = 0;
  else if (player.direction.x < 0) rotation = Math.PI;
  else if (player.direction.y > 0) rotation = Math.PI / 2;
  else if (player.direction.y < 0) rotation = -Math.PI / 2;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(rotation);

  // Ferret colors - change when powered up
  const bodyColor = player.powered ? COLORS.PLAYER_POWERED : COLORS.PLAYER_NORMAL;
  const maskColor = player.powered ? COLORS.PLAYER_POWERED : COLORS.PLAYER_MASK;

  // Draw elongated body (ferrets have long bodies)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw head (smaller, rounder)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(7, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw ferret mask (dark area around eyes)
  ctx.fillStyle = maskColor;
  ctx.beginPath();
  ctx.ellipse(7, 0, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw pointy nose
  ctx.fillStyle = '#2d1b0e';
  ctx.beginPath();
  ctx.moveTo(11, 0);
  ctx.lineTo(10, -1.5);
  ctx.lineTo(10, 1.5);
  ctx.closePath();
  ctx.fill();

  // Draw small round ears
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(5, -4, 2, 0, Math.PI * 2);
  ctx.arc(5, 4, 2, 0, Math.PI * 2);
  ctx.fill();

  // Draw cute beady eyes
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(8, -1.5, 1.5, 0, Math.PI * 2);
  ctx.arc(8, 1.5, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Draw eye shine for cuteness
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(8.5, -1.2, 0.5, 0, Math.PI * 2);
  ctx.arc(8.5, 1.8, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Draw small tail with animation
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(-10, animationFrame % 200 > 100 ? 2 : -2);
  ctx.stroke();

  ctx.restore();
};

/**
 * Draw a rat (enemy) character
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {Object} rat - Rat state object
 * @param {boolean} playerPowered - Whether player is currently powered up
 * @param {number} powerTimer - Remaining power-up time
 * @param {number} animationFrame - Current animation frame counter
 */
export const drawRat = (ctx, rat, playerPowered, powerTimer, animationFrame) => {
  const px = rat.x * TILE_SIZE + TILE_SIZE / 2;
  const py = rat.y * TILE_SIZE + TILE_SIZE / 2;

  // Determine rat color and scared state
  let color = rat.color;
  let scared = false;

  if (playerPowered) {
    scared = true;
    const timeRemaining = powerTimer;

    // Flash animation - slow at first, fast when time running out
    if (timeRemaining < 2000) {
      // Fast flash (last 2 seconds)
      const flashSpeed = 150;
      const isWhite = Math.floor(animationFrame / flashSpeed) % 2 === 0;
      color = isWhite ? COLORS.SCARED_RAT_WHITE : COLORS.SCARED_RAT_BLUE;
    } else {
      // Slow flash (first 6 seconds)
      const flashSpeed = 400;
      const isWhite = Math.floor(animationFrame / flashSpeed) % 2 === 0;
      color = isWhite ? COLORS.SCARED_RAT_WHITE : COLORS.SCARED_RAT_BLUE;
    }
  }

  // Draw round body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py + 1, 7, 0, Math.PI * 2);
  ctx.fill();

  // Draw head (slightly smaller circle)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py - 2, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw large round ears
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px - 4, py - 5, 3, 0, Math.PI * 2);
  ctx.arc(px + 4, py - 5, 3, 0, Math.PI * 2);
  ctx.fill();

  // Draw inner ear (pink)
  ctx.fillStyle = '#FFB8D0';
  ctx.beginPath();
  ctx.arc(px - 4, py - 5, 1.5, 0, Math.PI * 2);
  ctx.arc(px + 4, py - 5, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Draw cute big eyes
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(px - 2, py - 2, scared ? 2 : 2.5, 0, Math.PI * 2);
  ctx.arc(px + 2, py - 2, scared ? 2 : 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Draw pupils (bigger for cuteness, smaller when scared)
  ctx.fillStyle = '#000';
  ctx.beginPath();
  if (scared) {
    ctx.arc(px - 2, py - 2, 0.8, 0, Math.PI * 2);
    ctx.arc(px + 2, py - 2, 0.8, 0, Math.PI * 2);
  } else {
    ctx.arc(px - 2, py - 2, 1.5, 0, Math.PI * 2);
    ctx.arc(px + 2, py - 2, 1.5, 0, Math.PI * 2);
  }
  ctx.fill();

  // Draw eye shine
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(px - 1.5, py - 2.5, 0.5, 0, Math.PI * 2);
  ctx.arc(px + 2.5, py - 2.5, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Draw cute little nose
  ctx.fillStyle = '#FFB8D0';
  ctx.beginPath();
  ctx.arc(px, py, 1, 0, Math.PI * 2);
  ctx.fill();

  // Draw whiskers
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  // Left whiskers
  ctx.moveTo(px - 1, py);
  ctx.lineTo(px - 6, py - 1);
  ctx.moveTo(px - 1, py);
  ctx.lineTo(px - 6, py);
  ctx.moveTo(px - 1, py);
  ctx.lineTo(px - 6, py + 1);
  // Right whiskers
  ctx.moveTo(px + 1, py);
  ctx.lineTo(px + 6, py - 1);
  ctx.moveTo(px + 1, py);
  ctx.lineTo(px + 6, py);
  ctx.moveTo(px + 1, py);
  ctx.lineTo(px + 6, py + 1);
  ctx.stroke();

  // Draw tail
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(px, py + 7);
  ctx.quadraticCurveTo(px - 3, py + 10, px - 2, py + 12);
  ctx.stroke();
};

/**
 * Draw a prairie dog power-up
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {number} x - X coordinate (center)
 * @param {number} y - Y coordinate (center)
 */
export const drawPrairieDog = (ctx, x, y) => {
  const radius = 6;

  // Body
  ctx.fillStyle = COLORS.PRAIRIE_DOG_BODY;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = COLORS.PRAIRIE_DOG_HEAD;
  ctx.beginPath();
  ctx.arc(x, y - 3, 4, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = COLORS.PRAIRIE_DOG_BODY;
  ctx.beginPath();
  ctx.arc(x - 3, y - 5, 2, 0, Math.PI * 2);
  ctx.arc(x + 3, y - 5, 2, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(x - 1.5, y - 3, 1, 0, Math.PI * 2);
  ctx.arc(x + 1.5, y - 3, 1, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Draw a candy bonus item
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {Object} candy - Candy state object with x, y, type properties
 */
export const drawCandy = (ctx, candy) => {
  const px = candy.x * TILE_SIZE + TILE_SIZE / 2;
  const py = candy.y * TILE_SIZE + TILE_SIZE / 2;

  // Get candy color based on type
  const color = COLORS.CANDY_COLORS[candy.type % COLORS.CANDY_COLORS.length];

  // Wrapped candy shape
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(px, py, 6, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wrapper ends
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px - 8, py - 3);
  ctx.lineTo(px - 10, py - 5);
  ctx.moveTo(px - 8, py + 3);
  ctx.lineTo(px - 10, py + 5);
  ctx.moveTo(px + 8, py - 3);
  ctx.lineTo(px + 10, py - 5);
  ctx.moveTo(px + 8, py + 3);
  ctx.lineTo(px + 10, py + 5);
  ctx.stroke();

  // Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(px - 1, py - 1, 2, 1, 0, 0, Math.PI * 2);
  ctx.fill();
};
