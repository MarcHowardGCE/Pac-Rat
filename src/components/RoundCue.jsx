import React from 'react';
import pellet from '../assets/pickups/pellet.png';

export function RoundCue({ kind, level }) {
  const cleared = kind === 'clear';
  return (
    <div className="round-cue" role="status">
      <div className="round-cue-art" aria-hidden="true">
        <img src={pellet} alt="" width="12" height="12" />
        <img src={pellet} alt="" width="20" height="20" />
        <img src={pellet} alt="" width="12" height="12" />
      </div>
      <strong>{cleared ? `Level ${level} clear` : `Level ${level}`}</strong>
      <span>{cleared ? `Next up: Level ${level + 1}` : 'Get ready'}</span>
    </div>
  );
}
