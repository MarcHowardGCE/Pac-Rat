import React from 'react';
import ferret from '../assets/ferret/ferret_idle_right.png';
import './Logo.css';

export const Wordmark = () => (
  <span className="wordmark">
    <span className="wordmark-pac">PAC</span>
    <span className="wordmark-dash">-</span>
    <span className="wordmark-rat">RAT</span>
  </span>
);

export const Logo = () => (
  <div className="game-brand">
    <img src={ferret} alt="" width="42" height="42" />
    <Wordmark />
  </div>
);
