import React, { useRef } from 'react';
import './StartScreen.css';
import './PauseScreen.css';

export const PauseScreen = ({ onResume }) => {
  const resumeButtonRef = useRef(null);

  const keepFocusInDialog = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      resumeButtonRef.current?.focus();
    }
  };

  return (
    <section
      className="screen pause-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      onKeyDown={keepFocusInDialog}
    >
      <h1 id="pause-title">PAUSED</h1>
      <p className="subtitle">The maze can wait.</p>
      <button
        ref={resumeButtonRef}
        className="game-button"
        autoFocus
        onClick={onResume}
      >
        RESUME
      </button>
      <p className="pause-hint">Press Escape to resume</p>
    </section>
  );
};
