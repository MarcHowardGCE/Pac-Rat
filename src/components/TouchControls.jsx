import React from 'react';
import './TouchControls.css';

const directions = [
  { name: 'up', arrow: '▲', direction: { x: 0, y: -1 } },
  { name: 'left', arrow: '◀', direction: { x: -1, y: 0 } },
  { name: 'down', arrow: '▼', direction: { x: 0, y: 1 } },
  { name: 'right', arrow: '▶', direction: { x: 1, y: 0 } },
];

export function TouchControls({ active, enabled, onDirection }) {
  return (
    <div className="touch-controls" role="group" aria-label="Touch controls" inert={!active}>
      {directions.map(({ name, arrow, direction }) => (
        <button
          key={name}
          className="touch-direction"
          data-direction={name}
          type="button"
          aria-label={`Move ${name}`}
          disabled={!enabled}
          onClick={() => onDirection(direction)}
        >
          {arrow}
        </button>
      ))}
    </div>
  );
}
