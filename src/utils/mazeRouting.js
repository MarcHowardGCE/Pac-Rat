import { TUNNEL_ROW } from './constants.js';
import { canTravel } from './gridMovement.js';
import { MAZE_LAYOUT } from './mazeData.js';

export const DIRECTIONS = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
];

export function mazeTile(x, y) {
  const width = MAZE_LAYOUT[y].length;
  return { x: y === TUNNEL_ROW ? (x + width) % width : x, y };
}

export function mazeNeighbor(x, y, direction) {
  return mazeTile(x + direction.x, y + direction.y);
}

// Collectibles change during play, but all runs and levels share this maze geometry.
const distanceFields = new Map();

export function mazeDistancesFrom({ x, y }) {
  const key = y * MAZE_LAYOUT[0].length + x;
  if (distanceFields.has(key)) return distanceFields.get(key);

  const distances = MAZE_LAYOUT.map((row) => row.map(() => Infinity));
  const pending = [{ x, y }];
  distances[y][x] = 0;

  for (let index = 0; index < pending.length; index++) {
    const current = pending[index];
    const nextDistance = distances[current.y][current.x] + 1;
    for (const direction of DIRECTIONS) {
      if (!canTravel(current.x, current.y, direction, MAZE_LAYOUT)) continue;
      const next = mazeNeighbor(current.x, current.y, direction);
      if (distances[next.y][next.x] !== Infinity) continue;
      distances[next.y][next.x] = nextDistance;
      pending.push(next);
    }
  }

  distanceFields.set(key, distances);
  return distances;
}
