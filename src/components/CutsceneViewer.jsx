import React, { useEffect, useRef, useState } from 'react';
import { ArcadeStage, ARCADE_SCENES } from './ArcadeScene.jsx';
import { MenuDialog } from './MenuDialog.jsx';
import { MAX_MOVEMENT_DELTA_MS } from '../utils/constants.js';

export function CutsceneViewer({ onBack }) {
  const [scene, setScene] = useState(ARCADE_SCENES[0]);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const position = useRef(0);

  useEffect(() => {
    if (!playing) return;

    let frame;
    let lastTimestamp = null;
    function advance(timestamp) {
      const delta = lastTimestamp === null ? 0 : Math.min(timestamp - lastTimestamp, MAX_MOVEMENT_DELTA_MS);
      lastTimestamp = timestamp;
      position.current = Math.min(position.current + delta, scene.duration);
      setElapsed(position.current);
      if (position.current < scene.duration) {
        frame = requestAnimationFrame(advance);
      } else {
        setPlaying(false);
      }
    }

    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [playing, scene.duration]);

  function resetPlayback(play) {
    position.current = 0;
    setElapsed(0);
    setPlaying(play);
  }

  function selectScene(event) {
    setScene(ARCADE_SCENES.find((entry) => entry.id === event.target.value));
    resetPlayback(false);
  }

  function togglePlayback() {
    if (position.current >= scene.duration) {
      resetPlayback(true);
    } else {
      setPlaying(!playing);
    }
  }

  return (
    <MenuDialog title="Cutscene viewer" className="cutscene-viewer" actions={(
      <>
        <button type="button" className="game-button" onClick={togglePlayback}>{playing ? 'Pause' : 'Play'}</button>
        <button type="button" className="game-button menu-secondary" onClick={() => resetPlayback(true)}>Replay</button>
        <button type="button" className="game-button menu-secondary" onClick={onBack}>Back</button>
      </>
    )}>
      <label className="setting-row">
        <span>Scene</span>
        <select value={scene.id} data-menu-autofocus onChange={selectScene}>
          {ARCADE_SCENES.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
        </select>
      </label>
      <div className="cutscene-viewer-stage">
        <div className="cutscene-preview" data-preview-scene={scene.id}>
          <ArcadeStage scene={scene} elapsed={elapsed} />
        </div>
      </div>
    </MenuDialog>
  );
}
