/**
 * HUD (Heads-Up Display) Component
 * 
 * Displays game information during gameplay including:
 * - Current score
 * - Remaining lives
 * - Current level
 * - Sound toggle button
 */

import React from 'react';
import './HUD.css';

/**
 * HUD component
 * @param {Object} props - Component props
 * @param {number} props.score - Current game score
 * @param {number} props.lives - Remaining lives
 * @param {number} props.level - Current level number
 * @param {boolean} props.soundEnabled - Whether sound is enabled
 * @param {Function} props.onSoundToggle - Callback for sound toggle
 * @param {Function} props.onPause - Callback to pause the game
 * @returns {JSX.Element} The HUD component
 */
export const HUD = ({ score, lives, level, soundEnabled, onSoundToggle, onPause }) => {
  // Generate hearts for lives display
  const livesDisplay = lives > 0 ? '❤️'.repeat(lives) : '💀';

  return (
    <div className="hud">
      <div className="hud-item">
        <span className="label">Score:</span>
        <span className="value">{score}</span>
      </div>
      <div className="hud-item">
        <span className="label">Lives:</span>
        <span className="value">{livesDisplay}</span>
      </div>
      <div className="hud-item">
        <span className="label">Level:</span>
        <span className="value">{level}</span>
      </div>
      <div className="hud-item">
        <button
          className="sound-toggle"
          onClick={onSoundToggle}
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
      <div className="hud-item">
        <button className="pause-toggle" onClick={onPause} aria-label="Pause game">
          <span aria-hidden="true">Ⅱ</span>
          <span>Pause</span>
        </button>
      </div>
    </div>
  );
};
