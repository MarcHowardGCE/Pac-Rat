import React from 'react';
import './StartScreen.css';
import './PauseScreen.css';

export const PauseScreen = ({ onResume }) => (
  <section
    className="screen pause-screen"
    role="dialog"
    aria-modal="true"
    aria-labelledby="pause-title"
  >
    <h1 id="pause-title">PAUSED</h1>
    <p className="subtitle">The maze can wait.</p>
    <button className="game-button" autoFocus onClick={onResume}>
      RESUME
    </button>
    <p className="pause-hint">Press Escape to resume</p>
  </section>
);
