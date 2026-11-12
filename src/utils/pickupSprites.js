import { loadSpriteFrame } from './directionalSprites.js';

const urls = import.meta.glob('../assets/pickups/*.png', {
  eager: true,
  import: 'default',
  query: '?inline',
});

const frameSize = { width: 64, height: 64 };
const names = ['pellet', 'prairie_dog', 'candy_01', 'candy_02', 'candy_03'];
const candies = names.slice(2);
let spritesPromise;

export function loadPickupSprites() {
  spritesPromise ??= Promise.all(names.map(async (name) => [
    name,
    await loadSpriteFrame(urls[`../assets/pickups/${name}.png`], frameSize),
  ])).then(Object.fromEntries);
  return spritesPromise;
}

export function getCandyFrame(sprites, type) {
  return sprites?.[candies[type % candies.length]];
}

export function drawPickupFrame(ctx, frame, x, y, size) {
  if (!frame) return false;
  ctx.drawImage(frame, x - size / 2, y - size / 2, size, size);
  return true;
}
