/**
 * GameCanvas Component
 * 
 * Handles the main game rendering on an HTML5 Canvas element.
 * Draws all game elements including maze, player, rats, and collectibles.
 */

import React, { useRef, useEffect } from 'react';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, COLORS } from '../utils/constants.js';
import { drawMaze, drawPlayer, drawRat, drawCandy } from '../utils/rendering.js';
import './GameCanvas.css';

/**
 * GameCanvas component
 * @param {Object} props - Component props
 * @param {number[][]} props.maze - Current maze layout
 * @param {Object} props.player - Player state object
 * @param {Array} props.rats - Array of rat state objects
 * @param {Array} props.candies - Array of candy state objects
 * @param {number} props.animationFrame - Current animation frame counter
 * @param {Object} props.touchHandlers - Touch event handlers for mobile
 * @returns {JSX.Element} The game canvas component
 */
export const GameCanvas = ({
  maze,
  player,
  rats,
  candies,
  animationFrame,
  touchHandlers,
}) => {
  const canvasRef = useRef(null);

  /**
   * Draw the entire game scene
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with desert background
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    drawMaze(ctx, maze);

    // Draw candies
    candies.forEach((candy) => drawCandy(ctx, candy));

    // Draw rats
    rats.forEach((rat) => {
      drawRat(ctx, rat, player.powered, player.powerTimer, animationFrame);
    });

    // Draw player
    drawPlayer(ctx, player, animationFrame);
  }, [maze, player, rats, candies, animationFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      width={GRID_WIDTH * TILE_SIZE}
      height={GRID_HEIGHT * TILE_SIZE}
      {...touchHandlers}
    />
  );
};
