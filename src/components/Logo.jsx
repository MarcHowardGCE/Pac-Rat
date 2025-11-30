/**
 * Logo Component
 * 
 * Displays the Pac-Rat game logo with ferret silhouette and title text.
 * This SVG-based logo appears at the top of the game.
 */

import React from 'react';
import './Logo.css';

/**
 * Logo component
 * @returns {JSX.Element} The logo component
 */
export const Logo = () => {
  return (
    <div className="logo-container">
      <svg className="game-logo" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
        {/* Ferret silhouette */}
        <ellipse cx="60" cy="50" rx="25" ry="15" fill="#e8dcc8" stroke="#8b7355" strokeWidth="2" />
        <circle cx="75" cy="45" r="12" fill="#e8dcc8" stroke="#8b7355" strokeWidth="2" />
        <ellipse cx="75" cy="45" rx="10" ry="8" fill="#8b7355" />
        <circle cx="73" cy="42" r="3" fill="#000" />
        <circle cx="77" cy="42" r="3" fill="#000" />
        <circle cx="75" cy="47" r="2" fill="#2d1b0e" />
        <ellipse cx="70" cy="35" rx="4" ry="5" fill="#e8dcc8" />
        <ellipse cx="80" cy="35" rx="4" ry="5" fill="#e8dcc8" />
        <path d="M 40 50 Q 35 55 37 58" stroke="#e8dcc8" strokeWidth="4" fill="none" strokeLinecap="round" />
        <line x1="80" y1="47" x2="87" y2="45" stroke="#000" strokeWidth="0.5" />
        <line x1="80" y1="47" x2="87" y2="47" stroke="#000" strokeWidth="0.5" />
        <line x1="80" y1="47" x2="87" y2="49" stroke="#000" strokeWidth="0.5" />
        <line x1="70" y1="47" x2="63" y2="45" stroke="#000" strokeWidth="0.5" />
        <line x1="70" y1="47" x2="63" y2="47" stroke="#000" strokeWidth="0.5" />
        <line x1="70" y1="47" x2="63" y2="49" stroke="#000" strokeWidth="0.5" />

        {/* Text */}
        <text
          x="100"
          y="45"
          fontFamily="Arial, sans-serif"
          fontSize="32"
          fontWeight="bold"
          fill="#ffeb3b"
          stroke="#2d1b0e"
          strokeWidth="1"
        >
          PAC-RAT
        </text>
        <text x="100" y="65" fontFamily="Arial, sans-serif" fontSize="14" fill="#ffca28">
          Desert Adventure
        </text>
      </svg>
    </div>
  );
};
