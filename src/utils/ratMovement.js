import { RAT_CONFIGS, SPEED } from './constants.js';
import { canTravel, moveOnGrid } from './gridMovement.js';
import { MAZE_LAYOUT } from './mazeData.js';
import { DIRECTIONS, mazeDistancesFrom, mazeNeighbor, mazeTile } from './mazeRouting.js';

const EXIT_ROW = 11;
const AMBUSH_LOOKAHEAD = 4;
const TUNNEL_CHASE_RANGE = 6;
const BUTTER_RETREAT_RANGE = 7;

export function initializeRat(config) {
  return {
    ...config,
    x: config.startX,
    y: config.startY,
    mode: 'waiting',
    exitTimer: 0,
  };
}

export function initializeRats() {
  return RAT_CONFIGS.map(initializeRat);
}

function chaseTarget(rat, player, playerTile, playerDistances, x, y) {
  if (rat.strategy === 'ambush') {
    let target = playerTile;
    for (let step = 0; step < AMBUSH_LOOKAHEAD; step++) {
      if (!canTravel(target.x, target.y, player.direction, MAZE_LAYOUT)) break;
      target = mazeNeighbor(target.x, target.y, player.direction);
    }
    return target;
  }

  const distance = playerDistances[y][x];
  if (rat.strategy === 'tunnel' && distance > TUNNEL_CHASE_RANGE) return rat.patrolTarget;
  if (rat.strategy === 'skittish' && distance <= BUTTER_RETREAT_RANGE) return rat.patrolTarget;
  return playerTile;
}

export function advanceRat(rat, maze, deltaMs, player) {
  let { mode, exitTimer, patrolTarget } = rat;
  if (mode === 'waiting') {
    exitTimer += deltaMs;
    if (exitTimer < rat.exitDelay) return { ...rat, exitTimer };
    deltaMs = exitTimer - rat.exitDelay;
    mode = 'leaving';
  }

  const fieldMode = player.powered ? 'frightened' : 'chase';
  const reverseAtJunction = mode === 'chase' && fieldMode === 'frightened';
  const speed = mode !== 'leaving' && fieldMode === 'frightened' ? SPEED.RAT_SCARED : SPEED.RAT_NORMAL;
  const playerTile = mazeTile(Math.round(player.x), Math.round(player.y));
  let allowReverse = reverseAtJunction;
  const atExit = (x, y) => x === rat.exitX && y === EXIT_ROW;

  const movement = moveOnGrid(rat, maze, speed, deltaMs, (x, y, direction) => {
    if (mode === 'leaving' && atExit(x, y)) mode = fieldMode;

    const exits = DIRECTIONS.filter((candidate) => canTravel(x, y, candidate, maze));
    const reverse = exits.find((candidate) => candidate.x === -direction.x && candidate.y === -direction.y);
    if (allowReverse) {
      allowReverse = false;
      if (reverse) return reverse;
    }

    const reachedPatrolTarget = mode !== 'leaving' && rat.strategy === 'tunnel'
      && x === patrolTarget.x && y === patrolTarget.y;
    if (reachedPatrolTarget) patrolTarget = { x: maze[y].length - 1 - x, y };

    const forward = exits.filter((candidate) => candidate !== reverse);
    const choices = reachedPatrolTarget || mode === 'leaving' || !forward.length ? exits : forward;
    if (!choices.length) return direction;

    let target = { x: rat.exitX, y: EXIT_ROW };
    if (mode !== 'leaving') {
      const playerDistances = mazeDistancesFrom(playerTile);
      target = fieldMode === 'frightened'
        ? playerTile
        : chaseTarget({ ...rat, patrolTarget }, player, playerTile, playerDistances, x, y);
    }

    const distances = mazeDistancesFrom(target);
    const sign = mode !== 'leaving' && fieldMode === 'frightened' ? -1 : 1;
    let best = choices[0];
    let bestDistance = Infinity;
    for (const candidate of choices) {
      const next = mazeNeighbor(x, y, candidate);
      const distance = sign * distances[next.y][next.x];
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
    return best;
  });

  if (mode !== 'leaving' || atExit(movement.x, movement.y)) {
    // Keep the pending fright reversal until the rat reaches its next tile center.
    mode = allowReverse ? mode : fieldMode;
  }
  return { ...rat, ...movement, mode, exitTimer, patrolTarget };
}
