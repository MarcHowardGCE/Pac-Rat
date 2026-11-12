import { COLORS, RAT_BASE, TILE_SIZE, TUNNEL_ROW } from './constants.js';
import { loadSpriteFrame } from './directionalSprites.js';

const urls = import.meta.glob('../assets/maze/*.png', {
  eager: true,
  import: 'default',
  query: '?inline',
});

const tileSize = { width: 128, height: 128 };
const tileNames = ['floor', 'wall', 'wall_alt', 'wall_edge', 'wall_corner', 'wall_channel', 'den_floor'];
const QUARTER_TURN = Math.PI / 2;
let spritesPromise;
let lastBoard;

export function loadMazeSprites() {
  spritesPromise ??= Promise.all(tileNames.map(async (name) => [
    name,
    await loadSpriteFrame(urls[`../assets/maze/${name}.png`], tileSize),
  ])).then(Object.fromEntries);
  return spritesPromise;
}

function drawWallEdges(ctx, exposed, px, py) {
  const left = px + 1;
  const top = py + 1;
  const right = px + TILE_SIZE - 1;
  const bottom = py + TILE_SIZE - 1;
  const corners = [[left, top], [right, top], [right, bottom], [left, bottom]];

  ctx.beginPath();
  exposed.forEach((isExposed, side) => {
    if (!isExposed) return;
    ctx.moveTo(...corners[side]);
    ctx.lineTo(...corners[(side + 1) % corners.length]);
  });
  ctx.stroke();
}

function wallTile(sprites, exposed, x, y) {
  const count = exposed.filter(Boolean).length;
  if (count === 1 && sprites.wall_edge) {
    return { image: sprites.wall_edge, turns: exposed.indexOf(true) - 2 };
  }
  if (count === 2) {
    const corner = exposed.findIndex((side, index) => side && exposed[(index + 1) % 4]);
    if (corner >= 0 && sprites.wall_corner) {
      return { image: sprites.wall_corner, turns: corner - 1 };
    }
    if (corner < 0 && sprites.wall_channel) {
      return { image: sprites.wall_channel, turns: exposed[0] ? 1 : 0 };
    }
  }
  const alternate = sprites.wall_alt && (x * 13 + y * 11) % 7 === 0;
  return { image: alternate ? sprites.wall_alt : sprites.wall, turns: alternate ? 2 : 0 };
}

function drawFloor(ctx, sprites, x, y, width, px, py) {
  const inDen = x > RAT_BASE.MIN_X && x < RAT_BASE.MAX_X
    && y >= RAT_BASE.MIN_Y + 2 && y <= RAT_BASE.MAX_Y - 3;
  const floor = inDen && sprites.den_floor ? sprites.den_floor : sprites.floor;
  if (floor) {
    ctx.globalAlpha = inDen ? 0.62 : 0.28;
    ctx.drawImage(floor, px, py, TILE_SIZE, TILE_SIZE);
    ctx.globalAlpha = 1;
  }

  const distanceFromEdge = Math.min(x, width - 1 - x);
  if (y === TUNNEL_ROW && distanceFromEdge < 2) {
    // Keep the mouths visibly open. Use a floor tint that fades into the route.
    ctx.fillStyle = distanceFromEdge === 0 ? '#6f4c6755' : '#6f4c672b';
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
  }
}

export function getMazeArtLayer(maze, sprites) {
  if (!sprites?.wall || !maze.length || !maze[0].length) return null;

  // Eating a pickup changes the maze array, but it doesn't change the walls.
  const layout = maze.map((row) => row.map((cell) => cell === 1 ? '1' : '0').join('')).join('/');
  if (lastBoard?.layout === layout && lastBoard.sprites === sprites) return lastBoard.canvas;

  const canvas = document.createElement('canvas');
  canvas.width = maze[0].length * TILE_SIZE;
  canvas.height = maze.length * TILE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#36222d';
  ctx.lineWidth = 2;
  ctx.lineCap = 'square';

  maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      const px = x * TILE_SIZE;
      const py = y * TILE_SIZE;
      if (cell !== 1) {
        drawFloor(ctx, sprites, x, y, row.length, px, py);
        return;
      }

      // Only the gameplay grid decides where stone can be drawn.
      const exposed = [
        maze[y - 1]?.[x] !== 1,
        row[x + 1] !== 1,
        maze[y + 1]?.[x] !== 1,
        row[x - 1] !== 1,
      ];
      const { image, turns } = wallTile(sprites, exposed, x, y);
      const halfTile = TILE_SIZE / 2;
      ctx.fillStyle = '#402a34';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.save();
      ctx.globalAlpha = 0.74;
      ctx.translate(px + halfTile, py + halfTile);
      ctx.rotate(turns * QUARTER_TURN);
      ctx.drawImage(image, -halfTile, -halfTile, TILE_SIZE, TILE_SIZE);
      ctx.restore();
      drawWallEdges(ctx, exposed, px, py);
    });
  });

  lastBoard = { layout, sprites, canvas };
  return canvas;
}
