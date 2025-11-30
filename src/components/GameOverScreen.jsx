/**
 * GameOverScreen Component
 * 
 * Displays the game over screen with:
 * - Game over title
 * - Final score
 * - High score
 * - Restart button
 */

import React from 'react';
import './StartScreen.css'; // Reuse the same styles

/**
 * GameOverScreen component
 * @param {Object} props - Component props
 * @param {number} props.score - Final game score
 * @param {number} props.highScore - Current high score
 * @param {Function} props.onRestart - Callback when restart button is clicked
 * @returns {JSX.Element} The game over screen component
 */
export const GameOverScreen = ({ score, highScore, onRestart }) => {
  return (
    <div className="screen">
      <h1>GAME OVER</h1>
      <div className="final-score">
        <p>
          Your Score: <span className="score-value">{score}</span>
        </p>
        <p>
          High Score: <span className="score-value">{highScore}</span>
        </p>
      </div>
      <button className="game-button" onClick={onRestart}>
        PLAY AGAIN
      </button>
    </div>
  );
};
