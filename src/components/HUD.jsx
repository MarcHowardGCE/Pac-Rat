import React from 'react';
import ferret from '../assets/ferret/ferret_idle_right.png';
import { POWER_UP_DURATION } from '../utils/constants.js';
import { POWER_WARNING_MS } from '../utils/gameplayEffects.js';
import './HUD.css';

export const HUD = ({ score, lives, level, powerMs = 0, soundEnabled, onSoundToggle, onPause }) => {
  const power = Math.max(0, Math.min(powerMs, POWER_UP_DURATION));
  const seconds = Math.ceil(power / 1000);
  return (
    <div className="hud" role="group" aria-label="Game status and controls">
      <dl className="hud-stats">
        <div className="hud-item">
          <dt>Score</dt>
          <dd>{score}</dd>
        </div>
        <div className="hud-item">
          <dt>Lives</dt>
          <dd className="hud-lives">
            <img src={ferret} alt="" width="27" height="27" />
            {lives}
          </dd>
        </div>
        <div className="hud-item">
          <dt>Level</dt>
          <dd>{level}</dd>
        </div>
        <div className="hud-item hud-power" data-warning={power > 0 && power <= POWER_WARNING_MS}>
          <dt>Power</dt>
          <dd>
            {power > 0 ? (
              <>
                <span aria-hidden="true">{seconds}s</span>
                <progress
                  max={POWER_UP_DURATION}
                  value={power}
                  aria-label="Power-up time remaining"
                  aria-valuetext={`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`}
                />
              </>
            ) : <span className="hud-power-inactive">Off</span>}
          </dd>
        </div>
      </dl>
      <div className="hud-controls">
        <button className="hud-button" onClick={onSoundToggle} aria-label="Sound" aria-pressed={soundEnabled}>
          Sound <span aria-hidden="true">{soundEnabled ? 'on' : 'off'}</span>
        </button>
        <button id="hud-pause" className="hud-button" onClick={onPause} aria-keyshortcuts="Escape">Pause</button>
      </div>
    </div>
  );
};
