/**
 * StartScreen Component
 * 
 * Displays the initial game screen with:
 * - Game title
 * - Instructions
 * - Start button
 * - High score display
 */

import React from 'react';
import './StartScreen.css';

/**
 * StartScreen component
 * @param {Object} props - Component props
 * @param {number} props.highScore - Current high score
 * @param {Function} props.onStart - Callback when start button is clicked
 * @returns {JSX.Element} The start screen component
 */
export const StartScreen = ({ highScore, onStart }) => {
  return (
    <div className="screen">
      <h1>PAC-RAT</h1>
      <p className="subtitle">Desert Adventure</p>
      <div className="instructions">
        <p>Control the ferret and collect all the dots!</p>
        <p>🐕 Eat prairie dogs to power up and catch the rats</p>
        <p>🍬 Collect candy for bonus points</p>
        <p>
          <strong>Use Arrow Keys, WASD, or Swipe to move</strong>
        </p>
        <p className="mobile-hint">
          <strong>Tap anywhere to start!</strong>
        </p>
      </div>
      <button className="game-button" onClick={onStart}>
        START GAME
      </button>
      <div className="score-display">
        <p>
          High Score: <span className="score-value">{highScore}</span>
        </p>
      </div>
    </div>
  );
};
