import { drawAnchoredSprite, loadDirectionalSprites, loadSpriteFrame, spriteDirection } from './directionalSprites.js';

const frameUrls = import.meta.glob('../assets/rats/*/rat_*.png', {
  eager: true,
  import: 'default',
  query: '?inline',
});

const ratFrame = {
  width: 128,
  height: 128,
  anchorX: 64,
  anchorY: 64,
  drawSize: 40,
};

const identities = ['coral', 'bubblegum', 'seafoam', 'butter'];
const states = ['idle', 'move_01', 'move_02', 'frightened'];
const WALK_STEP_MS = 125;
const rotations = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };
let spritesPromise;

export function loadRatSprites() {
  spritesPromise ??= Promise.all(identities.map(async (identity) => {
    const frames = await loadDirectionalSprites((direction, state) => {
      const [action, frame] = state.split('_');
      const suffix = frame ? `_${frame}` : '';
      return frameUrls[`../assets/rats/${identity}/rat_${identity}_${action}_${direction}${suffix}.png`];
    }, states, ratFrame);
    const prefix = `../assets/rats/${identity}/rat_${identity}_base`;
    const [base, baseFrightened] = await Promise.all([
      loadSpriteFrame(frameUrls[`${prefix}.png`], ratFrame),
      loadSpriteFrame(frameUrls[`${prefix}_frightened.png`], ratFrame),
    ]);
    return [identity, { ...frames, base, baseFrightened }];
  })).then(Object.fromEntries);
  return spritesPromise;
}

export function getRatFrame(sprites, rat, frightened, animationMs) {
  const frames = sprites?.[rat.sprite];
  if (!frames) return null;

  const direction = spriteDirection(rat.direction);
  const moving = rat.mode !== 'waiting' && (rat.direction.x !== 0 || rat.direction.y !== 0);
  const step = Math.floor(animationMs / WALK_STEP_MS) % 2;
  const state = frightened ? 'frightened' : moving ? states[step + 1] : 'idle';
  const authored = frames[`${direction}_${state}`] ?? (frightened ? null : frames[`${direction}_idle`]);
  if (authored) return { frame: authored, rotation: 0, stretch: 1 };

  const frame = frightened ? frames.baseFrightened : frames.base;
  if (!frame) return null;
  const stretch = moving ? (step ? 0.96 : 1.04) : 1;
  return { frame, rotation: rotations[direction], stretch };
}

export function drawRatFrame(ctx, { frame, rotation, stretch }, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(stretch, 1 / stretch);
  drawAnchoredSprite(ctx, frame, 0, 0, ratFrame);
  ctx.restore();
}
