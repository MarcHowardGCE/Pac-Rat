import React from 'react';
import ferret from '../assets/ferret/ferret_idle_right.png';
import coralRat from '../assets/rats/coral/rat_coral_idle_left.png';
import pellet from '../assets/pickups/pellet.png';
import prairieDog from '../assets/pickups/prairie_dog.png';
import candy from '../assets/pickups/candy_01.png';
import { Wordmark } from './Logo.jsx';
import './StartScreen.css';

const pickups = [
  { sprite: pellet, label: 'Collect every dot' },
  { sprite: prairieDog, label: 'Power up and chase the rats' },
  { sprite: candy, label: 'Grab candy for bonus points' },
];

export const StartScreen = ({ highScore, onStart, onOpenMenu }) => (
  <section className="screen start-screen" aria-labelledby="start-title">
    <div className="start-art" aria-hidden="true">
      <img src={ferret} alt="" width="112" height="112" />
      <img className="start-art-pellet" src={pellet} alt="" width="15" height="15" />
      <img src={coralRat} alt="" width="112" height="112" />
    </div>
    <h1 id="start-title"><Wordmark /></h1>
    <p className="subtitle">Desert Adventure</p>
    <ul className="start-pickups">
      {pickups.map(({ sprite, label }) => (
        <li key={label}>
          <img src={sprite} alt="" width="26" height="26" />
          <span>{label}</span>
        </li>
      ))}
    </ul>
    <p className="start-controls">
      Move with <kbd>Arrow keys</kbd> <kbd>WASD</kbd> or swipe
    </p>
    <button className="game-button" onClick={onStart}>Start game</button>
    <div className="menu-actions start-menu-actions">
      <button id="title-help" className="game-button menu-secondary" onClick={(event) => onOpenMenu('help', event)}>How to play</button>
      <button id="title-settings" className="game-button menu-secondary" onClick={(event) => onOpenMenu('settings', event)}>Settings</button>
    </div>
    <p className="score-display">High score <span className="score-value">{highScore}</span></p>
  </section>
);
