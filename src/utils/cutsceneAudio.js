import { audioManager } from './audio.js';

// [Milliseconds from scene start, effect], keyed to the visual beats.
const cues = {
  'candy-ambush': [[1710, 'hop'], [2360, 'skid'], [2920, 'candy']],
  'prairie-dog-bluff': [[1850, 'startle'], [2870, 'hop'], [3250, 'hop'], [3710, 'hop']],
  'candy-tug': [[1530, 'tug'], [1810, 'tug'], [2300, 'pop'], [3070, 'candy']],
  'salty-snack': [[1740, 'crunch'], [1890, 'startle'], [2740, 'clack'], [3690, 'candy']],
  'cactus-hitchhiker': [[2080, 'pop'], [3400, 'startle'], [4000, 'hop']],
  'cap-trap': [[1540, 'clack'], [2050, 'rattle'], [2480, 'rattle'], [3370, 'tap'], [3490, 'rattle']],
  'wrong-platform': [[2460, 'tick'], [2920, 'clack'], [3410, 'tick'], [3890, 'tick'], [4370, 'tick']],
  'vacancy': [[2330, 'switch'], [2630, 'switch'], [3110, 'candy'], [3420, 'startle']],
  'loose-tooth': [[1910, 'pop'], [2190, 'clack'], [4030, 'tap']],
  'quality-control': [[1030, 'switch'], [1520, 'tap'], [1880, 'tick'], [2170, 'tick'], [2460, 'tick'], [2750, 'tick'], [3550, 'candy']],
  'one-more-credit': [[2390, 'coin'], [2800, 'clack'], [3120, 'candy'], [3410, 'rattle'], [3860, 'coin'], [6240, 'hop']],
};

// [Start pitch, end pitch, seconds, waveform, volume, optional delay in seconds].
const effects = {
  hop: [[260, 540, 0.12, 'triangle', 0.1]],
  skid: [[420, 115, 0.17, 'sawtooth', 0.055]],
  candy: [[650, 820, 0.07, 'triangle', 0.08], [1040, 1040, 0.09, 'sine', 0.09, 0.055]],
  startle: [[520, 190, 0.13, 'square', 0.055]],
  tug: [[190, 280, 0.11, 'triangle', 0.08]],
  pop: [[610, 240, 0.075, 'triangle', 0.12]],
  crunch: [[185, 90, 0.09, 'sawtooth', 0.075], [300, 110, 0.055, 'square', 0.045, 0.034]],
  clack: [[145, 75, 0.12, 'triangle', 0.13], [620, 410, 0.04, 'square', 0.055]],
  rattle: [[770, 520, 0.046, 'square', 0.05], [390, 230, 0.059, 'triangle', 0.09, 0.045],
    [690, 420, 0.045, 'square', 0.037, 0.096]],
  tap: [[360, 170, 0.065, 'triangle', 0.1]],
  tick: [[900, 590, 0.041, 'square', 0.042]],
  switch: [[220, 190, 0.055, 'square', 0.05]],
  coin: [[1250, 1060, 0.11, 'sine', 0.085], [1850, 1640, 0.15, 'triangle', 0.055, 0.027]],
};

export function playCutsceneCues(scene, previousTime, elapsed) {
  for (const [time, effect] of cues[scene.id] ?? []) {
    if (time > previousTime && time <= elapsed) audioManager.playCutsceneEffect(effects[effect]);
  }
}
