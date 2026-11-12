import React from 'react';
import { useMenuFocus } from './MenuDialog.jsx';
import ferret from '../assets/ferret/ferret_idle_right.png';
import coralRat from '../assets/rats/coral/rat_coral_idle_left.png';
import './StartScreen.css';
import './RoundScreen.css';

export const PauseScreen = ({ onResume, onOpenMenu, score, lives, level }) => {
  const { dialogRef, keepFocus } = useMenuFocus();

  return (
    <section
      ref={dialogRef}
      className="screen round-screen pause-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
      aria-describedby="pause-hint"
      onKeyDown={keepFocus}
    >
      <div className="round-art pause-art" aria-hidden="true">
        <img src={ferret} alt="" width="90" height="90" />
        <span className="pause-mark" />
        <img src={coralRat} alt="" width="90" height="90" />
      </div>
      <h1 id="pause-title">Paused</h1>
      <dl className="round-stats pause-stats">
        <div><dt>Score</dt><dd>{score}</dd></div>
        <div><dt>Lives</dt><dd>{lives}</dd></div>
        <div><dt>Level</dt><dd>{level}</dd></div>
      </dl>
      <button
        className="game-button"
        data-menu-autofocus
        aria-keyshortcuts="Escape"
        onClick={onResume}
      >
        Resume
      </button>
      <div className="menu-actions">
        <button id="pause-settings" className="game-button menu-secondary" onClick={(event) => onOpenMenu('settings', event)}>Settings</button>
        <button id="pause-restart" className="game-button menu-secondary" onClick={(event) => onOpenMenu('restart', event)}>Restart run</button>
        <button id="pause-title-button" className="game-button menu-secondary" onClick={(event) => onOpenMenu('quit', event)}>Return to title</button>
      </div>
      <p className="pause-hint" id="pause-hint">Press <kbd>Esc</kbd> to resume</p>
    </section>
  );
};
