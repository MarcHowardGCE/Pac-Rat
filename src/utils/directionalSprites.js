const directions = ['right', 'left', 'up', 'down'];

export function spriteDirection({ x, y }) {
  if (x > 0) return 'right';
  if (x < 0) return 'left';
  if (y < 0) return 'up';
  if (y > 0) return 'down';
  return 'right';
}

export function loadSpriteFrame(url, { width, height }) {
  if (!url) return Promise.resolve(null);

  return new Promise((resolve) => {
    const frame = new Image();
    frame.onload = () => {
      const matchesSize = frame.naturalWidth === width && frame.naturalHeight === height;
      resolve(matchesSize ? frame : null);
    };
    frame.onerror = () => resolve(null);
    frame.src = url;
  });
}

export async function loadDirectionalSprites(urlForFrame, states, frameSize) {
  const entries = await Promise.all(
    directions.flatMap((direction) =>
      states.map(async (state) => [
        `${direction}_${state}`,
        await loadSpriteFrame(urlForFrame(direction, state), frameSize),
      ])
    )
  );
  return Object.fromEntries(entries);
}

export function drawAnchoredSprite(ctx, frame, x, y, { width, height, anchorX, anchorY, drawSize }) {
  const left = x - anchorX * drawSize / width;
  const top = y - anchorY * drawSize / height;
  ctx.drawImage(frame, left, top, drawSize, drawSize);
}
