/**
 * GameCanvas Component
 * 
 * Handles the main game rendering on an HTML5 Canvas element.
 * Draws all game elements including maze, player, rats, and collectibles.
 */

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, COLORS } from '../utils/constants.js';
import { drawMaze, drawPlayer, drawRat, drawCandy } from '../utils/rendering.js';
import { loadFerretSprites } from '../utils/ferretSprites.js';
import { loadRatSprites } from '../utils/ratSprites.js';
import { loadPickupSprites } from '../utils/pickupSprites.js';
import { getMazeArtLayer, loadMazeSprites } from '../utils/mazeArt.js';
import { drawGameplayEffects } from '../utils/gameplayEffects.js';
import './GameCanvas.css';

const NO_EFFECTS = [];

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
  effects = NO_EFFECTS,
  reducedMotion = false,
  touchHandlers,
}) => {
  const canvasRef = useRef(null);
  const [ferretSprites, setFerretSprites] = useState(null);
  const [ratSprites, setRatSprites] = useState(null);
  const [pickupSprites, setPickupSprites] = useState(null);
  const [mazeSprites, setMazeSprites] = useState(null);
  const boardLayer = useMemo(() => {
    const layer = document.createElement('canvas');
    layer.width = GRID_WIDTH * TILE_SIZE;
    layer.height = GRID_HEIGHT * TILE_SIZE;
    const ctx = layer.getContext('2d');
    if (!ctx) return null;

    const mazeArt = getMazeArtLayer(maze, mazeSprites);
    if (mazeArt) {
      ctx.drawImage(mazeArt, 0, 0);
    } else {
      ctx.fillStyle = COLORS.BACKGROUND;
      ctx.fillRect(0, 0, layer.width, layer.height);
    }
    drawMaze(ctx, maze, pickupSprites, Boolean(mazeArt));
    return layer;
  }, [maze, mazeSprites, pickupSprites]);

  useEffect(() => {
    let active = true;
    loadFerretSprites().then((sprites) => {
      if (active) setFerretSprites(sprites);
    });
    loadRatSprites().then((sprites) => {
      if (active) setRatSprites(sprites);
    });
    loadPickupSprites().then((sprites) => {
      if (active) setPickupSprites(sprites);
    });
    loadMazeSprites().then((sprites) => {
      if (active) setMazeSprites(sprites);
    });
    return () => { active = false; };
  }, []);

  /**
   * Draw the entire game scene
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (boardLayer) {
      ctx.drawImage(boardLayer, 0, 0);
    } else {
      ctx.fillStyle = COLORS.BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawMaze(ctx, maze, pickupSprites);
    }

    // Draw candies
    candies.forEach((candy) => drawCandy(ctx, candy, pickupSprites, reducedMotion));

    // Draw rats
    rats.forEach((rat) => {
      drawRat(ctx, rat, player.powered, player.powerTimer, animationFrame, ratSprites, reducedMotion);
    });

    // Draw player
    drawPlayer(ctx, player, animationFrame, ferretSprites, reducedMotion);
    drawGameplayEffects(ctx, effects, animationFrame, reducedMotion);
  }, [maze, player, rats, candies, animationFrame, ferretSprites, ratSprites, pickupSprites, boardLayer, effects, reducedMotion]);

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
