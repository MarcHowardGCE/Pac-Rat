import React, { useEffect, useRef } from 'react';
import ferretIdleLeft from '../assets/ferret/ferret_idle_left.png?inline';
import ferretIdleRight from '../assets/ferret/ferret_idle_right.png?inline';
import ferretLeft1 from '../assets/ferret/ferret_move_left_01.png?inline';
import ferretLeft2 from '../assets/ferret/ferret_move_left_02.png?inline';
import ferretRight1 from '../assets/ferret/ferret_move_right_01.png?inline';
import ferretRight2 from '../assets/ferret/ferret_move_right_02.png?inline';
import coralIdleLeft from '../assets/rats/coral/rat_coral_idle_left.png?inline';
import coralIdleRight from '../assets/rats/coral/rat_coral_idle_right.png?inline';
import coralLeft1 from '../assets/rats/coral/rat_coral_move_left_01.png?inline';
import coralLeft2 from '../assets/rats/coral/rat_coral_move_left_02.png?inline';
import coralRight1 from '../assets/rats/coral/rat_coral_move_right_01.png?inline';
import coralRight2 from '../assets/rats/coral/rat_coral_move_right_02.png?inline';
import coralScared from '../assets/rats/coral/rat_coral_frightened_left.png?inline';
import bubblegumRat from '../assets/rats/bubblegum/rat_bubblegum_base.png?inline';
import candySprite from '../assets/pickups/candy_01.png?inline';
import prairieDogSprite from '../assets/pickups/prairie_dog.png?inline';
import './ArcadeScene.css';

const ferret = {
  idleLeft: ferretIdleLeft,
  idleRight: ferretIdleRight,
  left: [ferretLeft1, ferretLeft2],
  right: [ferretRight1, ferretRight2],
};
const coral = {
  idleLeft: coralIdleLeft,
  idleRight: coralIdleRight,
  left: [coralLeft1, coralLeft2],
  right: [coralRight1, coralRight2],
  scared: coralScared,
};
const bubblegum = { right: bubblegumRat };
const candy = { still: candySprite };
const prairieDog = { still: prairieDogSprite };

// Each keyframe gives time in milliseconds, stage position in percent, and pose.
// Position, scale, and rotation interpolate to the next frame. An omitted pose hides the actor.
export const OPENING_SCENE = {
  id: 'candy-ambush',
  title: 'Candy Ambush (Opening)',
  duration: 4650,
  tracks: [
    { name: 'candy', sprites: candy, width: 12, frames: [
      [0, 58, 58, 'still'], [2730, 58, 58, 'still'], [2920, 53, 53],
    ] },
    { name: 'coral', sprites: coral, width: 30, frames: [
      [1400, 115, 55, 'left'], [2080, 47, 55, 'left'],
      [2380, 23, 57, 'idleLeft', 0.86, -12], [2800, 20, 55, 'idleRight'],
      [3100, 20, 55, 'right'], [4270, 115, 55],
    ] },
    { name: 'ferret', sprites: ferret, width: 32, frames: [
      [150, -15, 55, 'right'], [1240, 42, 55, 'idleRight'],
      [1710, 44, 55, 'idleRight'], [1980, 46, 34, 'idleRight', 1, -12],
      [2240, 49, 35, 'idleRight'], [2530, 52, 55, 'idleRight'],
      [2730, 54, 55, 'idleRight'], [2920, 57, 55, 'right'], [4000, 116, 55],
    ] },
  ],
};

const POWER_BLUFF = {
  id: 'prairie-dog-bluff',
  title: 'Prairie Dog Bluff (After Level 1)',
  duration: 4800,
  tracks: [
    { name: 'coral', sprites: coral, width: 29, frames: [
      [430, -17, 55, 'right'], [1390, 39, 55, 'idleRight'],
      [1640, 43, 55, 'idleRight', 0.85], [1850, 39, 52, 'scared', 1.12],
      [2060, 35, 55, 'scared'], [2900, -18, 55],
    ] },
    { name: 'ferret', sprites: ferret, width: 31, frames: [
      [0, -15, 55, 'right'], [1290, 66, 55, 'idleLeft'],
      [2350, 66, 55, 'idleLeft'], [2570, 63, 53, 'idleLeft', 1.07],
      [2750, 63, 55, 'left'], [3820, -18, 55],
    ] },
    { name: 'prairie-dog', sprites: prairieDog, width: 21, frames: [
      [0, 57, 57, 'still'], [2680, 57, 57, 'still'],
      [2870, 57, 51, 'still', 1.1, 12], [3030, 56, 57, 'still'],
      [3250, 41, 50, 'still', 1, -14], [3460, 25, 57, 'still'],
      [3710, 8, 50, 'still', 1, -14], [4080, -15, 57],
    ] },
  ],
};

const CANDY_TUG = {
  id: 'candy-tug',
  title: 'Candy Tug-of-War (After Level 2)',
  duration: 4900,
  tracks: [
    { name: 'ferret', sprites: ferret, width: 32, frames: [
      [0, -17, 55, 'right'], [1140, 39, 55, 'idleRight'],
      [1530, 44, 55, 'idleRight', 0.9, 12], [1810, 37, 55, 'idleRight', 0.96, -12],
      [2100, 45, 55, 'idleRight', 0.9, 12], [2300, 33, 53, 'idleRight', 1, -21],
      [2590, 35, 55, 'idleRight'], [3400, 35, 55, 'right'], [4590, 117, 55],
    ] },
    { name: 'coral', sprites: coral, width: 30, frames: [
      [0, 118, 55, 'left'], [1140, 61, 55, 'idleLeft'],
      [1530, 56, 55, 'idleLeft', 0.9, -12], [1810, 63, 55, 'idleLeft', 0.96, 12],
      [2100, 55, 55, 'idleLeft', 0.9, -12], [2300, 67, 53, 'idleLeft', 1, 21],
      [2590, 65, 55, 'idleLeft'], [3210, 65, 55, 'right'], [4380, 117, 55],
    ] },
    { name: 'bubblegum', sprites: bubblegum, width: 28, frames: [
      [2390, -15, 55, 'right'], [3070, 50, 55, 'right'], [3940, 116, 55],
    ] },
    { name: 'candy', sprites: candy, width: 13, frames: [
      [0, 50, 57, 'still'], [1530, 50, 54, 'still', 0.9, 15],
      [1810, 46, 54, 'still', 1.16, -20], [2100, 51, 54, 'still', 0.88, 15],
      [2470, 54, 28, 'still', 1, 200], [2710, 53, 30, 'still', 1, 290],
      [3070, 51, 52],
    ] },
  ],
};

const intermissions = [POWER_BLUFF, CANDY_TUG];
export const ARCADE_SCENES = [OPENING_SCENE, ...intermissions];
export const intermissionAfter = (level) => intermissions[(level - 1) % intermissions.length];

function StageActor({ track, elapsed }) {
  const { frames, sprites, width, name } = track;
  const nextIndex = frames.findIndex(([time]) => time > elapsed);
  const index = nextIndex === -1 ? frames.length - 1 : nextIndex - 1;
  if (index < 0) return null;

  const [start, x, y, pose, scale = 1, angle = 0] = frames[index];
  if (!pose) return null;
  const [end, nextX, nextY, , nextScale = 1, nextAngle = 0] = frames[index + 1] ?? frames[index];
  const progress = end === start ? 0 : (elapsed - start) / (end - start);
  const lerp = (from, to) => from + (to - from) * progress;
  const image = sprites[pose];
  const src = Array.isArray(image) ? image[Math.floor((elapsed - start) / 110) % image.length] : image;

  return <img className="arcade-scene-actor" data-actor={name} src={src} alt="" draggable="false" style={{
    left: `${lerp(x, nextX)}%`,
    top: `${lerp(y, nextY)}%`,
    width: `${width}%`,
    transform: `translate(-50%, -50%) rotate(${lerp(angle, nextAngle)}deg) scale(${lerp(scale, nextScale)})`,
  }} />;
}

export function ArcadeStage({ scene, elapsed }) {
  return (
    <div className="arcade-scene-stage" aria-hidden="true">
      {scene.tracks.map((track) => <StageActor key={track.name} track={track} elapsed={elapsed} />)}
    </div>
  );
}

export function ArcadeScene({ scene, elapsed, onSkip }) {
  const skip = useRef(null);

  useEffect(() => {
    skip.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section className="arcade-scene" data-scene={scene.id} aria-label="Arcade cutscene">
      <ArcadeStage scene={scene} elapsed={elapsed} />
      <button id="arcade-scene-skip" ref={skip} className="game-button arcade-scene-skip" type="button" onClick={onSkip}>Skip scene</button>
    </section>
  );
}
