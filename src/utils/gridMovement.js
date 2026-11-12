import { MAX_MOVEMENT_DELTA_MS, REFERENCE_FRAME_MS, TUNNEL_ROW } from './constants.js';
import { canMove } from './collision.js';

const STOPPED = { x: 0, y: 0 };
const EPSILON = 1e-8;

export function canTravel(x, y, direction, maze) {
  return Boolean(direction.x || direction.y)
    && canMove(x + direction.x, y + direction.y, maze);
}

export function moveOnGrid(actor, maze, speed, deltaMs, chooseDirection) {
  let { x, y, direction } = actor;
  let remaining = speed * Math.min(Math.max(deltaMs, 0), MAX_MOVEMENT_DELTA_MS) / REFERENCE_FRAME_MS;

  while (remaining > EPSILON) {
    if (Number.isInteger(x) && Number.isInteger(y)) {
      direction = chooseDirection(x, y, direction);
      if (!canTravel(x, y, direction, maze)) {
        direction = STOPPED;
        break;
      }
    }

    const horizontal = direction.x !== 0;
    const position = horizontal ? x : y;
    const sign = horizontal ? direction.x : direction.y;
    if (!sign) break;

    const nextCenter = sign > 0 ? Math.floor(position) + 1 : Math.ceil(position) - 1;
    const distance = Math.abs(nextCenter - position);
    const step = Math.min(remaining, distance);
    const next = distance - step <= EPSILON ? nextCenter : position + sign * step;
    if (horizontal) {
      x = next;
      if (y === TUNNEL_ROW) {
        const width = maze[y].length;
        // Wrap when the actor's center crosses the visible board edge.
        if (x < -0.5) x += width;
        if (x >= width - 0.5) x -= width;
      }
    } else {
      y = next;
    }
    remaining -= step;
  }

  return { x, y, direction };
}
