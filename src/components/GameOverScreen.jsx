import React from 'react';
import ferret from '../assets/ferret/ferret_idle_right.png';
import pellet from '../assets/pickups/pellet.png';
import './StartScreen.css';
import './RoundScreen.css';

export const GameOverScreen = ({ score, highScore, level, onRestart }) => (
  <section className="screen round-screen game-over-screen" aria-labelledby="game-over-title">
    <div className="round-art game-over-art" aria-hidden="true">
      <img className="game-over-spark" src={pellet} alt="" width="16" height="16" />
      <img className="game-over-ferret" src={ferret} alt="" width="92" height="92" />
      <img className="game-over-spark" src={pellet} alt="" width="12" height="12" />
    </div>
    <h1 id="game-over-title">Game over</h1>
    <dl className="round-stats game-over-stats">
      <div className="final-run-score"><dt>Final score</dt><dd>{score}</dd></div>
      <div><dt>High score</dt><dd>{highScore}</dd></div>
      <div><dt>Level reached</dt><dd>{level}</dd></div>
    </dl>
    <button className="game-button" autoFocus onClick={onRestart}>Play again</button>
  </section>
);
