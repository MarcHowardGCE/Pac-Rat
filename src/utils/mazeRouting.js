import { GRID_WIDTH, TUNNEL_ROW } from './constants.js';
import { canTravel } from './gridMovement.js';
import { MAZE_LAYOUT } from './mazeData.js';

export const DIRECTIONS = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
];

export function mazeTile(x, y) {
  return { x: y === TUNNEL_ROW ? (x + GRID_WIDTH) % GRID_WIDTH : x, y };
}

export function mazeNeighbor(x, y, direction) {
  return mazeTile(x + direction.x, y + direction.y);
}

// Use the level's original layout so collecting a dot doesn't invalidate paths.
const fieldsByLayout = new WeakMap();

export function mazeDistancesFrom({ x, y }, layout = MAZE_LAYOUT) {
  if (!fieldsByLayout.has(layout)) fieldsByLayout.set(layout, new Map());
  const distanceFields = fieldsByLayout.get(layout);
  const key = y * GRID_WIDTH + x;
  if (distanceFields.has(key)) return distanceFields.get(key);

  const distances = layout.map((row) => row.map(() => Infinity));
  const pending = [{ x, y }];
  distances[y][x] = 0;

  for (let index = 0; index < pending.length; index++) {
    const current = pending[index];
    const nextDistance = distances[current.y][current.x] + 1;
    for (const direction of DIRECTIONS) {
      if (!canTravel(current.x, current.y, direction, layout)) continue;
      const next = mazeNeighbor(current.x, current.y, direction);
      if (distances[next.y][next.x] !== Infinity) continue;
      distances[next.y][next.x] = nextDistance;
      pending.push(next);
    }
  }

  distanceFields.set(key, distances);
  return distances;
}
