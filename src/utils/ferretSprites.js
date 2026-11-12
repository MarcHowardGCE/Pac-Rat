import { drawAnchoredSprite, loadDirectionalSprites, spriteDirection } from './directionalSprites.js';

const frameUrls = import.meta.glob('../assets/ferret/ferret_*.png', {
  eager: true,
  import: 'default',
  query: '?inline',
});

export const FERRET_SPRITE = {
  width: 128,
  height: 128,
  anchorX: 64,
  anchorY: 64,
  drawSize: 40,
  stepMs: 110,
  palette: 'aged bone',
  reference: 'Pac-Rat Ferret 12-Pose Sprite Sheet.png',
};

const states = ['idle', 'move_01', 'move_02'];
let spritesPromise;

export function loadFerretSprites() {
  spritesPromise ??= loadDirectionalSprites((direction, state) => {
    const [action, frame] = state.split('_');
    const suffix = frame ? `_${frame}` : '';
    return frameUrls[`../assets/ferret/ferret_${action}_${direction}${suffix}.png`];
  }, states, FERRET_SPRITE);
  return spritesPromise;
}

export function getFerretFrame(sprites, player, animationMs) {
  if (!sprites) return null;
  const direction = spriteDirection(player.facingDirection ?? player.direction);
  const moving = player.direction.x !== 0 || player.direction.y !== 0;
  const step = Math.floor(animationMs / FERRET_SPRITE.stepMs) % 2;
  const state = moving && !player.dying ? states[step + 1] : 'idle';
  return sprites[`${direction}_${state}`] ?? sprites[`${direction}_idle`] ?? null;
}

export function drawFerretFrame(ctx, frame, x, y) {
  drawAnchoredSprite(ctx, frame, x, y, FERRET_SPRITE);
}
