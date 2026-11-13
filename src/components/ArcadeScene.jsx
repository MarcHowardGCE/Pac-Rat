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

const SALTY_SNACK = {
  id: 'salty-snack',
  title: 'Salty Snack (After Level 3)',
  duration: 5100,
  tracks: [
    { name: 'salt-shard', propClass: 'arcade-salt-shard', width: 10, frames: [
      [0, 43, 57, 'still'], [1610, 43, 57, 'still'], [1740, 42, 55],
      [2400, 45, 51, 'still', 0.8, 45], [2740, 50, 58, 'still', 0.85, 135],
      [4600, 50, 58, 'still', 0.85, 135],
    ] },
    { name: 'candy', sprites: candy, width: 12, frames: [
      [0, 68, 57, 'still'], [3490, 68, 57, 'still'], [3690, 69, 53],
    ] },
    { name: 'coral', sprites: coral, width: 30, frames: [
      [0, -16, 55, 'right'], [1150, 30, 55, 'idleRight'],
      [1430, 32, 55, 'idleRight'], [1710, 34, 57, 'idleRight', 0.94, 8],
      [1890, 30, 49, 'idleRight', 1.08, -16], [2130, 27, 55, 'idleRight', 0.95, -10],
      [2480, 27, 55, 'idleRight', 0.95, -10], [2750, 28, 55, 'idleRight'],
      [4460, 28, 55, 'idleRight'], [4870, 30, 55, 'idleRight', 0.95, -5],
    ] },
    { name: 'ferret', sprites: ferret, width: 31, frames: [
      [2450, 115, 55, 'left'], [3400, 78, 55, 'idleLeft'],
      [3690, 76, 55, 'idleLeft'], [3990, 76, 55, 'right'], [4800, 116, 55],
    ] },
  ],
};

const CACTUS_HITCHHIKER = {
  id: 'cactus-hitchhiker',
  title: 'Cactus Hitchhiker (After Level 4)',
  duration: 5300,
  tracks: [
    { name: 'cactus-stem', propClass: 'arcade-cactus-pad', width: 9, frames: [
      [0, 46, 60, 'still', 1, 12],
    ] },
    { name: 'ferret', sprites: ferret, width: 31, frames: [
      [0, -18, 55, 'right'], [770, 33, 55, 'right'],
      [990, 45, 59, 'right', 0.8, 6], [1220, 57, 55, 'right'],
      [2030, 116, 55],
    ] },
    { name: 'coral', sprites: coral, width: 30, frames: [
      [1060, -16, 55, 'right'], [2080, 58, 55, 'right'],
      [2480, 71, 55, 'idleRight'], [2830, 70, 55, 'idleLeft'],
      [3810, 70, 55, 'idleLeft'], [4000, 73, 48, 'idleRight', 1.08, -12],
      [4260, 73, 55, 'right'], [5000, 120, 55],
    ] },
    { name: 'cactus-pad', propClass: 'arcade-cactus-pad', width: 8, frames: [
      [0, 44, 49, 'still', 1, -35], [1930, 44, 49, 'still', 1, -35],
      [2080, 48, 53, 'still', 1, -22], [2480, 61, 53, 'still', 1, -22],
      [2830, 80, 53, 'still', 1, 24], [3810, 80, 53, 'still', 1, 24],
      [4000, 63, 46, 'still', 1, -45], [4260, 63, 53, 'still', 1, -22],
      [5000, 110, 53],
    ] },
    { name: 'bubblegum', sprites: bubblegum, width: 27, frames: [
      [2210, -16, 55, 'right'], [3140, 43, 55, 'right'],
      [3400, 40, 51, 'right', 1.06, -12], [3650, 35, 55, 'right'],
      [3810, 31, 55, 'right'], [4490, -16, 55],
    ] },
  ],
};

const CAP_TRAP = {
  id: 'cap-trap',
  title: 'Cap Trap (After Level 5)',
  duration: 5500,
  tracks: [
    { name: 'coral', sprites: coral, width: 28, frames: [
      [190, -16, 55, 'right'], [1040, 36, 55, 'idleRight'],
      [1410, 36, 55, 'idleRight'], [1600, 36, 60, 'right', 0.7],
      [2050, 38, 60, 'right', 0.7], [2990, 68, 60, 'right', 0.7],
      [3490, 68, 60, 'left', 0.7], [4380, 11, 60, 'left', 0.7], [4790, -15, 60],
    ] },
    { name: 'ferret', sprites: ferret, width: 31, frames: [
      [1030, 115, 55, 'left'], [1950, 58, 55, 'idleLeft'],
      [2250, 58, 55, 'right'], [2900, 85, 55, 'idleLeft'],
      [3170, 81, 55, 'idleLeft'], [3370, 78, 54, 'idleLeft', 1, -7],
      [3550, 84, 55, 'idleLeft'], [4420, 84, 55, 'right'], [5070, 117, 55],
    ] },
    { name: 'bottlecap', propClass: 'arcade-bottlecap', width: 22, frames: [
      [1060, 36, -10, 'still', 1, 30], [1540, 36, 53, 'still'],
      [1670, 36, 50, 'still', 1, -10], [1830, 36, 53, 'still'],
      [2050, 38, 53, 'still', 1, 6], [2480, 51, 53, 'still', 1, -7],
      [2990, 68, 53, 'still'], [3370, 68, 53, 'still'],
      [3490, 68, 53, 'still', 1, -40], [4380, 11, 53, 'still', 1, -720],
      [4790, -15, 53],
    ] },
  ],
};

const WRONG_PLATFORM = {
  id: 'wrong-platform',
  title: 'Wrong Platform (After Level 6)',
  duration: 5400,
  tracks: [
    { name: 'clock-hook', propClass: 'arcade-clock-hook', width: 4, frames: [
      [0, 32, 39, 'still'],
    ] },
    { name: 'coral', sprites: coral, width: 29, frames: [
      [0, -15, 55, 'right'], [960, 31, 55, 'idleRight'],
      [2970, 31, 55, 'idleRight'], [3200, 29, 54, 'idleRight', 1, -9],
      [3650, 31, 55, 'idleRight'], [4070, 31, 52, 'idleRight', 1, -22],
      [5070, 31, 52, 'idleRight', 1, -22],
    ] },
    { name: 'station-clock', propClass: 'arcade-station-clock', width: 12, frames: [
      [0, 32, 43, 'still', 1, -8], [2460, 32, 43, 'still', 1, -8],
      [2650, 32, 40, 'still', 1, -18], [2920, 40, 55, 'still', 1, 16],
      [3170, 49, 49, 'still', 1, -16], [3410, 59, 55, 'still', 1, 12],
      [3650, 68, 49, 'still', 1, -16], [3890, 78, 55, 'still', 1, 12],
      [4130, 88, 49, 'still', 1, -16], [4370, 98, 55, 'still', 1, 12],
      [4760, 115, 55],
    ] },
    { name: 'ferret', sprites: ferret, width: 31, frames: [
      [1410, -16, 57, 'right'], [1750, 3, 57, 'right'], [3480, 115, 57],
    ] },
    { name: 'candy', sprites: candy, width: 9, frames: [
      [1410, -7, 57, 'still'], [1750, 12, 57, 'still'], [3480, 124, 57],
    ] },
  ],
};

const VACANCY = {
  id: 'vacancy',
  title: 'Vacancy (After Level 7)',
  duration: 5300,
  tracks: [
    { name: 'motel-lamp', propClass: 'arcade-motel-lamp', width: 23, frames: [
      [0, 41, 38, 'still', 1, -8],
    ] },
    { name: 'bubblegum', sprites: bubblegum, width: 29, frames: [
      [0, -16, 55, 'right'], [920, 36, 55, 'right'], [1880, 39, 54, 'right', 1.06, -8],
      [2240, 39, 54, 'right', 1.06, -8], [2330, 39, 54],
      [2630, 39, 54, 'right', 1.06, -8], [3060, 36, 50, 'right', 1.09, -13],
      [3420, 38, 55, 'right'], [3770, 44, 55, 'right'], [4610, 116, 55],
    ] },
    { name: 'candy', sprites: candy, width: 12, frames: [
      [0, 59, 57, 'still'], [2240, 59, 57, 'still'], [2330, 59, 57],
      [2630, 62, 55, 'still', 0.62, -17], [3110, 63, 55],
    ] },
    { name: 'ferret', sprites: ferret, width: 31, frames: [
      [2630, 70, 55, 'idleLeft'], [2820, 70, 55, 'idleLeft', 1, 6],
      [3060, 69, 55, 'idleLeft'], [3410, 72, 55, 'idleRight'],
      [3610, 72, 55, 'right'], [4390, 117, 55],
    ] },
    { name: 'lamp-shadow', propClass: 'arcade-lamp-shadow', width: 100, frames: [
      [2330, 50, 50, 'still'], [2630, 50, 50],
    ] },
  ],
};

const LOOSE_TOOTH = {
  id: 'loose-tooth',
  title: 'Loose Tooth (After Level 8)',
  duration: 5500,
  tracks: [
    { name: 'lower-jaw', propClass: 'arcade-fossil-jaw arcade-fossil-jaw-lower', width: 39, frames: [
      [0, 67, 59, 'still', 1, -5], [2010, 67, 59, 'still', 1, -5],
      [2190, 67, 54, 'still'], [2250, 67, 54, 'still', 1, -3],
      [2420, 67, 54, 'still'], [3670, 67, 54, 'still'],
      [4140, 67, 59, 'still', 1, -5],
    ] },
    { name: 'upper-jaw', propClass: 'arcade-fossil-jaw arcade-fossil-jaw-upper', width: 39, frames: [
      [0, 67, 43, 'still', 1, 4], [2010, 67, 43, 'still', 1, 4],
      [2190, 67, 46, 'still'], [2250, 67, 46, 'still', 1, 3],
      [2420, 67, 46, 'still'], [3670, 67, 46, 'still'],
      [4140, 67, 43, 'still', 1, 4],
    ] },
    { name: 'coral', sprites: coral, width: 30, frames: [
      [160, -16, 55, 'right'], [1050, 38, 55, 'idleRight'],
      [1410, 40, 54, 'idleRight', 1, -7], [1710, 44, 53, 'idleRight'],
      [1910, 42, 55, 'idleRight'], [2190, 29, 52, 'idleRight', 1.08, -15],
      [2580, 32, 55, 'idleRight'], [3300, 32, 55, 'idleRight'],
      [3670, 42, 55, 'right'], [4070, 42, 55, 'idleRight'],
      [4460, 42, 55, 'left'], [5140, -17, 55],
    ] },
    { name: 'loose-tooth', propClass: 'arcade-fossil-tooth', width: 5, frames: [
      [0, 50, 51, 'still', 1, 12], [1720, 50, 51, 'still', 1, 12],
      [1910, 45, 51, 'still', 1, -27], [2190, 33, 49, 'still', 1, -32],
      [2580, 36, 52, 'still', 1, -25], [3300, 36, 52, 'still', 1, -25],
      [3670, 46, 52, 'still', 1, -20], [4030, 50, 51, 'still', 1, 12],
    ] },
  ],
};

const intermissions = [
  POWER_BLUFF, CANDY_TUG, SALTY_SNACK, CACTUS_HITCHHIKER, CAP_TRAP,
  WRONG_PLATFORM, VACANCY, LOOSE_TOOTH,
];
export const ARCADE_SCENES = [OPENING_SCENE, ...intermissions];
export const intermissionAfter = (level) => intermissions[level - 1];

function StageActor({ track, elapsed }) {
  const { frames, sprites, width, name, propClass } = track;
  const nextIndex = frames.findIndex(([time]) => time > elapsed);
  const index = nextIndex === -1 ? frames.length - 1 : nextIndex - 1;
  if (index < 0) return null;

  const [start, x, y, pose, scale = 1, angle = 0] = frames[index];
  if (!pose) return null;
  const [end, nextX, nextY, , nextScale = 1, nextAngle = 0] = frames[index + 1] ?? frames[index];
  const progress = end === start ? 0 : (elapsed - start) / (end - start);
  const lerp = (from, to) => from + (to - from) * progress;
  const style = {
    left: `${lerp(x, nextX)}%`,
    top: `${lerp(y, nextY)}%`,
    width: `${width}%`,
    transform: `translate(-50%, -50%) rotate(${lerp(angle, nextAngle)}deg) scale(${lerp(scale, nextScale)})`,
  };
  if (propClass) return <span className={`arcade-scene-actor ${propClass}`} data-actor={name} style={style} />;

  const image = sprites[pose];
  const src = Array.isArray(image) ? image[Math.floor((elapsed - start) / 110) % image.length] : image;

  return <img className="arcade-scene-actor" data-actor={name} src={src} alt="" draggable="false" style={style} />;
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
