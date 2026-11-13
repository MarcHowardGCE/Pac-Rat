import sandstoneBackdrop from '../assets/maze/sandstone/backdrop.webp';
import taffyBackdrop from '../assets/maze/taffy-wash/backdrop.webp';
import taffyWall from '../assets/maze/taffy-wash/wall.webp';
import saltglassBackdrop from '../assets/maze/saltglass-flats/backdrop.webp';
import saltglassWall from '../assets/maze/saltglass-flats/wall.webp';
import nurseryBackdrop from '../assets/maze/crooked-cactus-nursery/backdrop.webp';
import nurseryWall from '../assets/maze/crooked-cactus-nursery/wall.webp';
import gulchBackdrop from '../assets/maze/bottlecap-gulch/backdrop.webp';
import gulchWall from '../assets/maze/bottlecap-gulch/wall.webp';
import depotBackdrop from '../assets/maze/tin-whistle-depot/backdrop.webp';
import depotWall from '../assets/maze/tin-whistle-depot/wall.webp';
import { GRID_HEIGHT, GRID_WIDTH, RAT_BASE, TILE_SIZE, TUNNEL_ROW } from './constants.js';
import { loadSpriteFrame } from './directionalSprites.js';
import { getMazeLayout } from './mazeData.js';

const themes = new Map([
  [getMazeLayout(1), {
    id: 'sandstone', backdrop: sandstoneBackdrop, edge: '#8b6158',
  }],
  [getMazeLayout(2), {
    id: 'taffy-wash', backdrop: taffyBackdrop, material: taffyWall, rounded: true,
    floor: '#2b1724', wall: '#673b40', ink: '#291722', edge: '#a46a63',
    den: '#3c2330', denRim: '#65414a', textureAlpha: 0.66,
  }],
  [getMazeLayout(3), {
    id: 'saltglass-flats', backdrop: saltglassBackdrop, material: saltglassWall, rounded: false,
    floor: '#151f29', wall: '#344b51', ink: '#101c26', edge: '#819593',
    den: '#202e38', denRim: '#4b666d', textureAlpha: 0.76,
  }],
  [getMazeLayout(4), {
    id: 'crooked-cactus-nursery', backdrop: nurseryBackdrop, material: nurseryWall, rounded: true,
    floor: '#291b2e', wall: '#48442d', ink: '#241d29', edge: '#8a8259',
    den: '#462d30', denRim: '#956654', textureAlpha: 0.7,
  }],
  [getMazeLayout(5), {
    id: 'bottlecap-gulch', backdrop: gulchBackdrop, material: gulchWall, rounded: false,
    floor: '#291c23', wall: '#603d3b', ink: '#281c24', edge: '#9e6c55',
    den: '#482d32', denRim: '#94644d', textureAlpha: 0.66,
  }],
  [getMazeLayout(6), {
    id: 'tin-whistle-depot', backdrop: depotBackdrop, material: depotWall, rounded: false,
    floor: '#211d2a', wall: '#464a51', ink: '#1c1923', edge: '#989487',
    den: '#39313a', denRim: '#777168', textureAlpha: 0.74,
  }],
]);

const ART_TILE_SIZE = 32;
const boardSize = { width: GRID_WIDTH * ART_TILE_SIZE, height: GRID_HEIGHT * ART_TILE_SIZE };
const imagePromises = new WeakMap();

export const getLevelMazeTheme = (layout) => themes.get(layout) ?? null;

export function loadLevelMazeImages(theme) {
  if (!imagePromises.has(theme)) {
    imagePromises.set(theme, Promise.all([
      loadSpriteFrame(theme.backdrop, boardSize),
      loadSpriteFrame(theme.material, boardSize),
    ]).then(([backdrop, material]) => ({ backdrop, material })));
  }
  return imagePromises.get(theme);
}

function addWallFace(path, x, y, exposed, rounded) {
  const [top, right, bottom, left] = exposed;
  const l = x + (left ? 2.8 : 0);
  const r = x + ART_TILE_SIZE - (right ? 2.8 : 0);
  const t = y + (top ? 2.8 : 0);
  const b = y + ART_TILE_SIZE - (bottom ? 2.8 : 0);
  const corners = [top && left, top && right, bottom && right, bottom && left].map((open) => open ? 6 : 0);

  if (rounded) {
    path.roundRect(l, t, r - l, b - t, corners);
    return;
  }

  const [tl, tr, br, bl] = corners;
  path.moveTo(l + tl, t);
  path.lineTo(r - tr, t);
  path.lineTo(r, t + tr);
  path.lineTo(r, b - br);
  path.lineTo(r - br, b);
  path.lineTo(l + bl, b);
  path.lineTo(l, b - bl);
  path.lineTo(l, t + tl);
  path.closePath();
}

function drawDen(ctx, theme) {
  const left = (RAT_BASE.MIN_X + 1) * ART_TILE_SIZE;
  const top = (RAT_BASE.MIN_Y + 2) * ART_TILE_SIZE;
  const width = (RAT_BASE.MAX_X - RAT_BASE.MIN_X - 1) * ART_TILE_SIZE;
  const height = 3 * ART_TILE_SIZE;
  ctx.fillStyle = theme.den;
  ctx.strokeStyle = theme.denRim;
  ctx.lineWidth = 2;
  if (theme.id === 'bottlecap-gulch') {
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, width / 2 - 9, height / 2 - 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, width / 2 - 14, height / 2 - 13, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    return;
  }
  ctx.beginPath();
  ctx.roundRect(left + 6, top + 6, width - 12, height - 12, theme.rounded ? 25 : 7);
  ctx.fill();
  ctx.stroke();

  if (theme.id === 'tin-whistle-depot') {
    ctx.beginPath();
    for (const offset of [14, 23]) {
      ctx.moveTo(left + 13, top + height - offset);
      ctx.lineTo(left + width - 13, top + height - offset);
    }
    ctx.stroke();
    return;
  }

  if (theme.id === 'crooked-cactus-nursery') {
    ctx.beginPath();
    ctx.moveTo(left + width * 0.67, top + height - 6);
    ctx.lineTo(left + width * 0.62, top + height - 22);
    ctx.lineTo(left + width * 0.66, top + height - 33);
    ctx.lineTo(left + width * 0.6, top + height - 43);
    ctx.stroke();
    return;
  }

  for (let groove = 0; groove < 4; groove++) {
    const x = left + 26 + 43 * groove;
    const y = top + height - 24;
    ctx.beginPath();
    ctx.moveTo(x - 9, y);
    if (theme.rounded) {
      ctx.quadraticCurveTo(x + 4, y + 16, x + 10, y + 2);
    } else {
      ctx.lineTo(x, y - 10);
      ctx.lineTo(x + 8, y + 2);
    }
    ctx.stroke();
  }
}

function drawTunnelMouths(ctx, theme) {
  ctx.strokeStyle = theme.edge;
  ctx.globalAlpha = 0.78;
  ctx.lineWidth = 2.8;
  const middle = (TUNNEL_ROW + 0.5) * ART_TILE_SIZE;
  const wallOffset = ART_TILE_SIZE / 2 + 2;
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side === 1 ? 0 : boardSize.width, middle);
    ctx.scale(side, 1);
    for (const bank of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, bank * (wallOffset + 12));
      if (theme.id === 'tin-whistle-depot') {
        ctx.lineTo(24, bank * (wallOffset + 12));
        ctx.lineTo(24, bank * wallOffset);
        ctx.lineTo(39, bank * wallOffset);
      } else if (theme.id === 'bottlecap-gulch') {
        ctx.quadraticCurveTo(14, bank * (wallOffset + 13), 26, bank * wallOffset);
        ctx.lineTo(38, bank * wallOffset);
      } else if (theme.rounded) {
        ctx.quadraticCurveTo(12, bank * (wallOffset + 2), 31, bank * wallOffset);
      } else {
        ctx.lineTo(10, bank * (wallOffset + 9));
        ctx.lineTo(18, bank * (wallOffset + 2));
        ctx.lineTo(31, bank * wallOffset);
      }
      ctx.stroke();
      if (theme.id === 'crooked-cactus-nursery') {
        ctx.beginPath();
        ctx.moveTo(10, bank * (wallOffset + 12));
        ctx.quadraticCurveTo(21, bank * (wallOffset + 16), 36, bank * (wallOffset + 12));
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

export function drawLevelMazeArt(ctx, maze, theme, images) {
  const { width, height } = boardSize;
  ctx.save();
  ctx.scale(TILE_SIZE / ART_TILE_SIZE, TILE_SIZE / ART_TILE_SIZE);
  ctx.fillStyle = theme.floor;
  ctx.fillRect(0, 0, width, height);
  const backdrop = images?.backdrop;
  if (backdrop) {
    ctx.globalAlpha = 0.2;
    ctx.drawImage(backdrop, backdrop.width * 0.22, backdrop.height * 0.18,
      backdrop.width * 0.56, backdrop.height * 0.64, 0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  const faces = new Path2D();
  const outline = new Path2D();
  const ledges = new Path2D();
  ctx.fillStyle = theme.wall;
  maze.forEach((row, y) => row.forEach((cell, x) => {
    if (cell !== 1) return;
    const px = x * ART_TILE_SIZE;
    const py = y * ART_TILE_SIZE;
    const exposed = [
      maze[y - 1]?.[x] !== 1, row[x + 1] !== 1, maze[y + 1]?.[x] !== 1, row[x - 1] !== 1,
    ];
    ctx.fillRect(px, py, ART_TILE_SIZE, ART_TILE_SIZE);
    addWallFace(faces, px, py, exposed, theme.rounded);

    exposed.forEach((open, side) => {
      if (!open) return;
      const angle = side * Math.PI / 2;
      const half = ART_TILE_SIZE / 2;
      const point = (u, v) => [
        px + half + u * Math.cos(angle) - v * Math.sin(angle),
        py + half + u * Math.sin(angle) + v * Math.cos(angle),
      ];
      outline.moveTo(...point(-half, -half + 0.8));
      outline.lineTo(...point(half, -half + 0.8));
      const wobble = (x * 17 + y * 13 + side * 3) % 5 - 2;
      const turn = point(wobble * 4, -half + 6 + wobble);
      const end = point(half - 2.5, -half + 4);
      ledges.moveTo(...point(-half + 2.5, -half + 4));
      if (theme.rounded) {
        ledges.quadraticCurveTo(...turn, ...end);
      } else {
        ledges.lineTo(...turn);
        ledges.lineTo(...end);
      }
    });
  }));

  if (images?.material) {
    ctx.save();
    ctx.clip(faces);
    ctx.globalAlpha = theme.textureAlpha;
    ctx.drawImage(images.material, 0, 0, width, height);
    ctx.restore();
  }
  ctx.strokeStyle = theme.ink;
  ctx.lineWidth = 1.6;
  ctx.stroke(outline);
  ctx.strokeStyle = theme.edge;
  ctx.globalAlpha = 0.68;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.stroke(ledges);
  ctx.globalAlpha = 1;
  drawDen(ctx, theme);
  drawTunnelMouths(ctx, theme);
  ctx.restore();
}
