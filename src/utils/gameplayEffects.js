import { CANDY_LIFETIME, POWER_UP_DURATION, SCORES, TILE_SIZE } from './constants.js';

export const EFFECT_STYLES = {
  dot: { duration: 180, color: '#ffd287', particles: 3, radius: 6 },
  power: { duration: 600, color: '#fbe8b0', particles: 8, radius: 24, points: SCORES.POWER_UP },
  rat: { duration: 550, color: '#a6dcd3', particles: 6, radius: 18, points: SCORES.RAT },
  candy: { duration: 550, color: '#f7a2bf', particles: 6, radius: 18, points: SCORES.CANDY },
};

export const POWER_WARNING_MS = 2000;
const CANDY_WARNING_MS = 2000;
const CANDY_APPEAR_MS = 380;
const INK = '#26151f';

export function drawGlint(ctx, x, y, size) {
  const inset = size * 0.29;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + inset, y - inset);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x + inset, y + inset);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - inset, y + inset);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - inset, y - inset);
  ctx.closePath();
  ctx.fill();
}

export function drawGameplayEffects(ctx, effects, now, reducedMotion) {
  for (const { kind, x, y, startedAt } of effects) {
    const style = EFFECT_STYLES[kind];
    const progress = Math.max(0, (now - startedAt) / style.duration);
    if (progress >= 1) continue;

    const px = (x + 0.5) * TILE_SIZE;
    const py = (y + 0.5) * TILE_SIZE;
    const eased = 1 - (1 - progress) ** 2;
    ctx.save();
    ctx.globalAlpha = 1 - progress;
    ctx.fillStyle = style.color;
    ctx.strokeStyle = style.color;

    if (!reducedMotion) {
      if (kind === 'power') {
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 7 + style.radius * eased, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let index = 0; index < style.particles; index += 1) {
        const angle = index * Math.PI * 2 / style.particles - Math.PI / 3;
        const distance = 3 + style.radius * eased * (index % 2 ? 0.76 : 1);
        const size = (kind === 'dot' ? 1.6 : 3.5) * (1 - progress * 0.45);
        drawGlint(ctx, px + Math.cos(angle) * distance, py + Math.sin(angle) * distance, size);
      }
    }

    if (style.points) {
      const textX = Math.min(ctx.canvas.width - 23, Math.max(23, px));
      const textY = Math.max(14, py - 10 - (reducedMotion ? 0 : 13 * eased));
      ctx.font = 'bold 13px Consolas, monospace';
      ctx.textAlign = 'center';
      ctx.lineWidth = 3.5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = INK;
      ctx.strokeText(`+${style.points}`, textX, textY);
      ctx.fillText(`+${style.points}`, textX, textY);
    } else if (reducedMotion) {
      ctx.fillRect(px - 1, py - 1, 2, 2);
    }
    ctx.restore();
  }
}

export function drawCandyCue(ctx, x, y, remainingMs, reducedMotion) {
  if (remainingMs <= 0) return;

  ctx.save();
  if (remainingMs <= CANDY_WARNING_MS) {
    const start = -Math.PI / 2;
    const radius = TILE_SIZE * 0.57;
    ctx.lineWidth = 2;
    ctx.strokeStyle = INK;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#f7a2bf';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y, radius, start, start + Math.PI * 2 * remainingMs / CANDY_WARNING_MS);
    ctx.stroke();
  } else {
    const age = Math.max(0, CANDY_LIFETIME - remainingMs);
    if (age < CANDY_APPEAR_MS) {
      const progress = age / CANDY_APPEAR_MS;
      const offset = reducedMotion ? 9 : 6 + progress * 8;
      ctx.globalAlpha = 1 - progress;
      ctx.fillStyle = '#ffd287';
      drawGlint(ctx, x - offset, y - 6, 3);
      drawGlint(ctx, x + offset, y + 5, 2.3);
    }
  }
  ctx.restore();
}

export function drawPowerTimer(ctx, x, y, remainingMs) {
  const progress = Math.max(0, Math.min(1, remainingMs / POWER_UP_DURATION));
  if (progress === 0) return;

  const radius = TILE_SIZE * 0.66;
  const start = -Math.PI / 2;
  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#382334';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = remainingMs <= POWER_WARNING_MS ? '#ed9c86' : '#ffd287';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y, radius, start, start + Math.PI * 2 * progress);
  ctx.stroke();
  ctx.restore();
}
