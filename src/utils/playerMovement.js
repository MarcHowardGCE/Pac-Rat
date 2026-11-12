import { canTravel, moveOnGrid } from './gridMovement.js';

export function movePlayer(actor, maze, deltaMs) {
  let { nextDirection, turnBufferMs, direction } = actor;
  if (turnBufferMs > 0 && direction.x === -nextDirection.x && direction.y === -nextDirection.y) {
    // A reversal follows the corridor the player is already in.
    direction = nextDirection;
    turnBufferMs = 0;
  }

  const movement = moveOnGrid({ ...actor, direction }, maze, actor.speed, deltaMs, (x, y, forward) => {
    if (turnBufferMs <= 0 || !canTravel(x, y, nextDirection, maze)) return forward;
    turnBufferMs = 0;
    return nextDirection;
  });

  return { ...movement, turnBufferMs: Math.max(0, turnBufferMs - deltaMs) };
}
