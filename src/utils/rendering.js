/**
 * Rendering Utilities
 * 
 * This module contains all the canvas drawing functions for the Pac-Rat game.
 * Each function is responsible for rendering a specific game element.
 */

import { TILE_SIZE, COLORS, DEATH_ANIMATION_DURATION } from './constants.js';
import { drawFerretFrame, getFerretFrame } from './ferretSprites.js';
import { drawRatFrame, getRatFrame } from './ratSprites.js';
import { drawPickupFrame, getCandyFrame } from './pickupSprites.js';
import { drawCandyCue, drawGlint, drawPowerTimer, POWER_WARNING_MS } from './gameplayEffects.js';

/**
 * Draw the maze on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {number[][]} maze - The maze layout array
 */
export const drawMaze = (ctx, maze, pickupSprites, hasArtLayer = false) => {
  const gridHeight = maze.length;
  const gridWidth = maze[0]?.length || 0;

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const cell = maze[y][x];
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;

      if (cell === 1) {
        if (hasArtLayer) continue;
        // Wall - desert rock style
        ctx.fillStyle = COLORS.WALL;
        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = COLORS.WALL_STROKE;
        ctx.lineWidth = 2;
        ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
      } else if (cell === 2) {
        if (drawPickupFrame(ctx, pickupSprites?.pellet, px + TILE_SIZE / 2, py + TILE_SIZE / 2, 7)) continue;
        ctx.fillStyle = COLORS.DOT;
        ctx.beginPath();
        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (cell === 3) {
        // Prairie dog power-up
        drawPrairieDog(ctx, px + TILE_SIZE / 2, py + TILE_SIZE / 2, pickupSprites?.prairie_dog);
      }
    }
  }
};

function drawDefeatFallback(ctx) {
  ctx.fillStyle = COLORS.PLAYER_NORMAL;
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 6, 0, 0, Math.PI * 2);
  ctx.arc(7, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.PLAYER_MASK;
  ctx.beginPath();
  ctx.ellipse(7, 0, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw the player (ferret) character
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {Object} player - Player state object
 * @param {number} animationFrame - Elapsed animation time in milliseconds
 * @param {Object|null} sprites - Loaded ferret frames
 */
export const drawPlayer = (ctx, player, animationFrame, sprites, reducedMotion = false) => {
  const px = player.x * TILE_SIZE + TILE_SIZE / 2;
  const py = player.y * TILE_SIZE + TILE_SIZE / 2;

  const frame = getFerretFrame(sprites, player, reducedMotion ? 0 : animationFrame);

  // Harmless arcade defeat: the ferret shrinks away and leaves a few stars.
  if (player.dying) {
    const progress = Math.min(
      Math.max(player.deathAnimation / DEATH_ANIMATION_DURATION, 0),
      1
    );
    const bodyProgress = Math.min(progress / 0.7, 1);
    const bodyScale = Math.max(0, 1 - bodyProgress);
    const bodyAlpha = Math.max(0, 1 - bodyProgress);

    if (bodyScale > 0) {
      ctx.save();
      ctx.translate(px, py);
      if (!reducedMotion) {
        ctx.rotate(progress * Math.PI * 2);
        ctx.scale(bodyScale, bodyScale);
      }
      ctx.globalAlpha = bodyAlpha;

      if (frame) {
        drawFerretFrame(ctx, frame, 0, 0);
      } else {
        drawDefeatFallback(ctx);
      }

      ctx.restore();
    }

    if (progress >= 0.18 && progress < 1) {
      const sparkleProgress = (progress - 0.18) / 0.82;
      const sparkleColors = [COLORS.PLAYER_NORMAL, '#e66e78', '#a78bae', '#c6d95d'];
      ctx.save();
      ctx.globalAlpha = 1 - sparkleProgress;
      sparkleColors.forEach((color, index) => {
        const angle = index * Math.PI / 2 - Math.PI / 4;
        const distance = reducedMotion ? 9 : 5 + sparkleProgress * 17;
        ctx.fillStyle = color;
        drawGlint(ctx, px + Math.cos(angle) * distance, py + Math.sin(angle) * distance, 3);
      });
      ctx.restore();
    }

    return;
  }

  if (player.powered) drawPowerTimer(ctx, px, py, player.powerTimer);

  if (frame) {
    drawFerretFrame(ctx, frame, px, py);
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
  ctx.lineTo(-10, !reducedMotion && animationFrame % 200 > 100 ? 2 : -2);
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
export const drawRat = (ctx, rat, playerPowered, powerTimer, animationFrame, ratSprites, reducedMotion = false) => {
  const px = rat.x * TILE_SIZE + TILE_SIZE / 2;
  const py = rat.y * TILE_SIZE + TILE_SIZE / 2;

  const scared = playerPowered && rat.mode !== 'waiting' && rat.mode !== 'leaving';
  const warning = scared && powerTimer <= POWER_WARNING_MS;
  const color = scared ? COLORS.SCARED_RAT_BLUE : rat.color;

  const frame = getRatFrame(ratSprites, rat, scared, reducedMotion ? 0 : animationFrame);
  if (frame) {
    if (scared) {
      ctx.save();
      ctx.strokeStyle = warning ? '#ed9c86' : color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, TILE_SIZE * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    drawRatFrame(ctx, frame, px, py);
    return;
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
export const drawPrairieDog = (ctx, x, y, frame) => {
  if (drawPickupFrame(ctx, frame, x, y, 20)) return;

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
export const drawCandy = (ctx, candy, pickupSprites, reducedMotion = false) => {
  const px = candy.x * TILE_SIZE + TILE_SIZE / 2;
  const py = candy.y * TILE_SIZE + TILE_SIZE / 2;

  drawCandyCue(ctx, px, py, candy.timer, reducedMotion);
  if (drawPickupFrame(ctx, getCandyFrame(pickupSprites, candy.type), px, py, 22)) return;

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
