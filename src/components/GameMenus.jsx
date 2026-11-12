import React from 'react';
import { MenuDialog } from './MenuDialog.jsx';

const preferenceLabels = [
  ['sound', 'Sound', 'Mute or unmute all audio.'],
  ['music', 'Music', 'Background music during play.'],
  ['effects', 'Sound effects', 'Pickup, capture, and round cues.'],
  ['reducedMotion', 'Reduced motion', 'Reduce movement in effects and transitions.'],
  ['highContrast', 'Higher contrast', 'Increase contrast on the board and in menus.'],
];

const BackButton = ({ onBack }) => (
  <button type="button" className="game-button" data-menu-autofocus onClick={onBack}>Back</button>
);

export const HowToPlay = ({ onBack }) => (
  <MenuDialog title="How to play" actions={<BackButton onBack={onBack} />}>
    <ul className="menu-help">
      <li>Collect every dot to clear the maze.</li>
      <li>Grab a prairie dog to power up, then catch blue rats for extra points.</li>
      <li>Coral follows you, Bubblegum cuts ahead, Seafoam patrols the tunnel, and Butter backs off when you get close.</li>
      <li>Pick up bonus candy before its countdown ring runs out.</li>
      <li>Move with arrow keys or WASD. On touch screens, use the D-pad or swipe on the maze.</li>
      <li>Press Esc or select Pause to take a break.</li>
    </ul>
  </MenuDialog>
);

export const SettingsMenu = ({ settings, onBack }) => (
  <MenuDialog title="Settings" actions={<BackButton onBack={onBack} />}>
    <div className="settings-list">
      {preferenceLabels.map(([name, label, help]) => (
        <label key={name} className="setting-row">
          <span>{label}<small>{help}</small></span>
          <input
            type="checkbox"
            checked={settings[name]}
            onChange={(event) => settings.setPreference(name, event.target.checked)}
          />
        </label>
      ))}
    </div>
  </MenuDialog>
);

export const ConfirmRunAction = ({ action, onCancel, onConfirm }) => {
  const restart = action === 'restart';
  const label = restart ? 'Restart run' : 'Return to title';
  return (
    <MenuDialog title={label} actions={(
      <>
        <button type="button" className="game-button menu-secondary" data-menu-autofocus onClick={onCancel}>Cancel</button>
        <button type="button" className="game-button" onClick={onConfirm}>{label}</button>
      </>
    )}>
      <p className="menu-message">Your current score and maze progress will be cleared.</p>
    </MenuDialog>
  );
};
