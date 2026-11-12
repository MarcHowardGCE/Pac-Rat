/**
 * App Component
 * 
 * Main application component that orchestrates the entire game.
 * Manages game loop, state, and coordinates all child components.
 */

import React, { useState, useEffect, useEffectEvent, useCallback, useRef } from 'react';
import { Logo } from './components/Logo.jsx';
import { HUD } from './components/HUD.jsx';
import { StartScreen } from './components/StartScreen.jsx';
import { GameOverScreen } from './components/GameOverScreen.jsx';
import { PauseScreen } from './components/PauseScreen.jsx';
import { GameCanvas } from './components/GameCanvas.jsx';
import { ArcadeScene, OPENING_SCENE, intermissionAfter } from './components/ArcadeScene.jsx';
import { CutsceneViewer } from './components/CutsceneViewer.jsx';
import { RoundCue } from './components/RoundCue.jsx';
import { TouchControls } from './components/TouchControls.jsx';
import { ConfirmRunAction, HowToPlay, SettingsMenu } from './components/GameMenus.jsx';
import { useSettings } from './hooks/useSettings.js';
import { useGameState } from './hooks/useGameState.js';
import { usePlayer } from './hooks/usePlayer.js';
import { useRats } from './hooks/useRats.js';
import { useInput } from './hooks/useInput.js';
import { audioManager } from './utils/audio.js';
import { checkPlayerRatCollision, checkCandyCollision } from './utils/collision.js';
import {
  CANDY_SPAWN_INTERVAL,
  CANDY_LIFETIME,
  DEATH_ANIMATION_DURATION,
  SCORES,
  RAT_BASE,
  MAX_MOVEMENT_DELTA_MS,
} from './utils/constants.js';
import { EFFECT_STYLES } from './utils/gameplayEffects.js';
import { mazeDistancesFrom, mazeTile } from './utils/mazeRouting.js';
import { getMazeLayout } from './utils/mazeData.js';
import './App.css';

const LEVEL_CLEAR_MS = 1250;
const LEVEL_READY_MS = 1000;
const CANDY_MIN_DISTANCE = 6;
const CANDY_MAX_DISTANCE = 14;

/**
 * Main App component
 * @returns {JSX.Element} The app component
 */
function App() {
  // Game state management
  const gameStateHook = useGameState();
  const {
    gameState,
    score,
    lives,
    level,
    maze,
    highScore,
    startGame: startGameState,
    returnToTitle,
    pauseGame,
    resumeGame,
    nextLevel,
    addScore,
    loseLife,
    endGame,
    collectDot,
    collectPowerUp,
    checkLevelComplete,
  } = gameStateHook;
  const layout = getMazeLayout(level);

  // Player management
  const playerHook = usePlayer(maze);
  const { player, getPlayer, resetPlayer, setNextDirection, clearPendingTurn, activatePowerUp, startDeath, updatePlayer } =
    playerHook;

  // Rats (enemies) management
  const ratsHook = useRats(maze, layout);
  const { rats, resetRats, resetRat, updateRats } = ratsHook;

  // Candies state
  const [candies, setCandyState] = useState([]);
  const candiesRef = useRef(candies);
  const candyTimerRef = useRef(0);
  const setCandies = useCallback((update) => {
    const next = typeof update === 'function' ? update(candiesRef.current) : update;
    candiesRef.current = next;
    setCandyState(next);
  }, []);

  // Animation state
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationTimeRef = useRef(0);
  const [effects, setEffects] = useState([]);
  const [roundCue, setRoundCueState] = useState(null);
  const roundCueRef = useRef(null);
  const setRoundCue = useCallback((kind, duration = 0, scene = null) => {
    const startedAt = animationTimeRef.current;
    const cue = kind ? { kind, startedAt, deadline: startedAt + duration, scene } : null;
    roundCueRef.current = cue;
    setRoundCueState(cue);
  }, []);
  const activeScene = roundCue?.scene;
  const roundEndedRef = useRef(false);

  const showEffect = useCallback((kind, { x, y }, startedAt) => {
    setEffects((current) => [
      ...current.filter((effect) => startedAt - effect.startedAt < EFFECT_STYLES[effect.kind].duration),
      { kind, x, y, startedAt },
    ]);
  }, []);

  const settings = useSettings();
  const { sound, music, effects: soundEffects, reducedMotion, highContrast, startingLevel, setPreference } = settings;
  const [menu, setMenu] = useState('main');
  const menuOrigin = useRef(null);
  const restoreViewerFocus = useRef(false);

  const openMenu = useCallback((next, event) => {
    menuOrigin.current = event.currentTarget.id;
    setMenu(next);
  }, []);
  const openCutsceneViewer = useCallback(() => {
    restoreViewerFocus.current = true;
    setMenu('cutscenes');
  }, []);
  const closeMenu = useCallback(() => setMenu((current) => current === 'cutscenes' ? 'settings' : 'main'), []);

  useEffect(() => {
    if (menu === 'settings' && restoreViewerFocus.current) {
      restoreViewerFocus.current = false;
      document.getElementById('settings-cutscenes')?.focus();
    }
    if (menu !== 'main' || !menuOrigin.current) return;
    document.getElementById(menuOrigin.current)?.focus();
    menuOrigin.current = null;
  }, [menu, gameState]);

  useEffect(() => {
    audioManager.setMix({ sound, music, effects: soundEffects });
    if (gameState === 'playing' && !activeScene && sound && music) {
      audioManager.playBackgroundMusic();
    } else {
      audioManager.stopBackgroundMusic();
    }
  }, [gameState, activeScene, sound, music, soundEffects]);

  const toggleSound = useCallback(() => {
    if (!sound) audioManager.initialize();
    setPreference('sound', !sound);
  }, [setPreference, sound]);

  const resetGameSession = useCallback(() => {
    roundEndedRef.current = false;
    menuOrigin.current = null;
    restoreViewerFocus.current = false;
    setMenu('main');
    setEffects([]);
    setRoundCue(null);
    resetPlayer();
    resetRats();
    setCandies([]);
    candyTimerRef.current = 0;
  }, [resetPlayer, resetRats, setCandies, setRoundCue]);

  const handleStartGame = useCallback(() => {
    audioManager.initialize();
    resetGameSession();
    if (reducedMotion || startingLevel !== 1) {
      setRoundCue('ready', LEVEL_READY_MS);
    } else {
      setRoundCue('intro', OPENING_SCENE.duration, OPENING_SCENE);
    }
    startGameState(startingLevel);
  }, [reducedMotion, resetGameSession, setRoundCue, startGameState, startingLevel]);

  const handleReturnToTitle = useCallback(() => {
    resetGameSession();
    returnToTitle();
  }, [resetGameSession, returnToTitle]);

  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      pauseGame();
    } else if (gameState === 'paused' && menu === 'main') {
      audioManager.initialize();
      menuOrigin.current = 'hud-pause';
      resumeGame();
    }
  }, [gameState, menu, pauseGame, resumeGame]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== 'Escape' || event.repeat) return;
      if (menu !== 'main') {
        event.preventDefault();
        closeMenu();
      } else if (gameState === 'playing' || gameState === 'paused') {
        event.preventDefault();
        togglePause();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [gameState, menu, closeMenu, togglePause]);

  const resetActorsForReady = useCallback(() => {
    resetPlayer();
    resetRats();
    setEffects([]);
    setRoundCue('ready', LEVEL_READY_MS);
  }, [resetPlayer, resetRats, setRoundCue]);

  const startNextRound = useCallback(() => {
    nextLevel();
    setCandies([]);
    candyTimerRef.current = 0;
    resetActorsForReady();
  }, [nextLevel, resetActorsForReady, setCandies]);

  const finishScene = useCallback(() => {
    const cue = roundCueRef.current;
    if (gameState !== 'playing' || !cue?.scene) return;
    if (document.activeElement?.id === 'arcade-scene-skip') {
      document.getElementById('hud-pause')?.focus({ preventScroll: true });
    }
    if (cue.kind === 'intermission') {
      startNextRound();
    } else {
      setRoundCue('ready', LEVEL_READY_MS);
    }
  }, [gameState, setRoundCue, startNextRound]);

  const spawnCandy = useCallback((playerPosition) => {
    const { x, y } = playerPosition;
    const distances = mazeDistancesFrom(mazeTile(Math.round(x), Math.round(y)), layout);
    const emptySpots = [];
    const nearbySpots = [];
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const inRatBase = x >= RAT_BASE.MIN_X && x <= RAT_BASE.MAX_X
          && y >= RAT_BASE.MIN_Y && y <= RAT_BASE.MAX_Y;
        const distance = distances[y][x];
        if (maze[y][x] !== 0 || inRatBase || !Number.isFinite(distance) || distance < CANDY_MIN_DISTANCE) continue;
        const spot = { x, y };
        emptySpots.push(spot);
        if (distance <= CANDY_MAX_DISTANCE) nearbySpots.push(spot);
      }
    }

    const spots = nearbySpots.length ? nearbySpots : emptySpots;
    if (spots.length) {
      const spot = spots[Math.floor(Math.random() * spots.length)];
      setCandies([{ ...spot, timer: CANDY_LIFETIME, type: Math.floor(Math.random() * 3) }]);
    }
  }, [layout, maze, setCandies]);

  const advanceFrame = useEffectEvent((deltaTime) => {
    const now = animationTimeRef.current + deltaTime;
    animationTimeRef.current = now;
    setAnimationFrame(now);

    const cue = roundCueRef.current;
    if (cue) {
      if (cue.scene) {
        if (reducedMotion || now >= cue.deadline) finishScene();
      } else if (now >= cue.deadline) {
        if (cue.kind === 'clear' && !reducedMotion) {
          const scene = intermissionAfter(level);
          setRoundCue('intermission', scene.duration, scene);
        } else if (cue.kind === 'clear') {
          startNextRound();
        } else {
          setRoundCue(null);
        }
      }
    } else if (getPlayer().dying) {
      const { player: defeatedPlayer } = updatePlayer(deltaTime, now);

      if (defeatedPlayer.deathAnimation >= DEATH_ANIMATION_DURATION) {
        const shouldEndGame = loseLife();
        if (shouldEndGame) {
          roundEndedRef.current = true;
          endGame();
          audioManager.stopBackgroundMusic();
        } else {
          resetActorsForReady();
        }
      }
    } else {
      // Update player
      const collected = updatePlayer(deltaTime, now);
      let playerPowered = collected.player.powered;

      // Handle collectibles
      if (collected.dot) {
        const result = collectDot(collected.dot.x, collected.dot.y);
        if (result) {
          addScore(SCORES.DOT);
          showEffect('dot', collected.dot, now);
          audioManager.playDotSound();
        }
      }
      if (collected.powerUp) {
        const result = collectPowerUp(collected.powerUp.x, collected.powerUp.y);
        if (result) {
          addScore(SCORES.POWER_UP);
          activatePowerUp();
          playerPowered = true;
          showEffect('power', collected.powerUp, now);
          audioManager.playPowerUpSound();
        }
      }

      // A cleared board wins over contact on the same frame as the last dot.
      if (collected.dot && checkLevelComplete()) {
        setRoundCue('clear', LEVEL_CLEAR_MS);
        audioManager.playLevelClearSound();
        return;
      }

      // Update rats
      const movedRats = updateRats(deltaTime, { ...collected.player, powered: playerPowered });

      // Check player-rat collisions
      const collidedRat = checkPlayerRatCollision(collected.player, movedRats);
      if (collidedRat) {
        if (playerPowered) {
          // Eat the rat
          addScore(SCORES.RAT);
          const ratIndex = movedRats.indexOf(collidedRat);
          resetRat(ratIndex);
          showEffect('rat', collidedRat, now);
          audioManager.playEatRatSound();
        } else {
          // Player dies
          startDeath();
          audioManager.playDeathSound();
        }
      }

      // Check candy collisions
      const candyIndex = checkCandyCollision(collected.player, candiesRef.current);
      if (candyIndex !== -1) {
        addScore(SCORES.CANDY);
        showEffect('candy', candiesRef.current[candyIndex], now);
        setCandies((prev) => prev.filter((_, i) => i !== candyIndex));
        audioManager.playCandySound();
      }

      candyTimerRef.current += deltaTime;
      if (candyTimerRef.current > CANDY_SPAWN_INTERVAL && !candiesRef.current.length) {
        spawnCandy(collected.player);
        candyTimerRef.current = 0;
      }

      if (candiesRef.current.length) {
        setCandies((current) => current
          .map((candy) => ({ ...candy, timer: candy.timer - deltaTime }))
          .filter((candy) => candy.timer > 0)
        );
      }

    }
  });

  useEffect(() => {
    if (gameState !== 'playing') return;

    let frameId;
    let lastTimestamp = null;
    function frame(timestamp) {
      if (document.visibilityState === 'hidden') return;
      const deltaTime = lastTimestamp === null
        ? 0
        : Math.min(timestamp - lastTimestamp, MAX_MOVEMENT_DELTA_MS);
      lastTimestamp = timestamp;

      advanceFrame(deltaTime);
      if (!roundEndedRef.current) frameId = requestAnimationFrame(frame);
    }

    function interruptPlay() {
      cancelAnimationFrame(frameId);
      audioManager.stopBackgroundMusic();
      clearPendingTurn();
      pauseGame();
    }

    function handleVisibility() {
      if (document.visibilityState === 'hidden') interruptPlay();
    }

    frameId = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', interruptPlay);
    window.addEventListener('pagehide', interruptPlay);
    return () => {
      cancelAnimationFrame(frameId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', interruptPlay);
      window.removeEventListener('pagehide', interruptPlay);
    };
  }, [gameState, clearPendingTurn, pauseGame]);

  /**
   * Input handling
   */
  const inputEnabled = gameState === 'playing' && (!roundCue || roundCue.kind === 'ready') && !player.dying;
  const touchHandlers = useInput(setNextDirection, inputEnabled);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      audioManager.cleanup();
    };
  }, []);

  return (
    <div className="app" data-reduced-motion={reducedMotion} data-high-contrast={highContrast}>
      <div className="game-container" data-state={gameState}>
        {gameState !== 'start' && <Logo />}

        <div className="canvas-wrapper">
          <GameCanvas
            maze={maze}
            player={player}
            rats={rats}
            candies={candies}
            animationFrame={animationFrame}
            effects={effects}
            reducedMotion={reducedMotion}
            touchHandlers={touchHandlers}
          />

          {gameState === 'start' && menu === 'main' && (
            <StartScreen highScore={highScore} onStart={handleStartGame} onOpenMenu={openMenu} />
          )}

          {gameState === 'playing' && roundCue && !activeScene && (
            <RoundCue key={roundCue.kind} kind={roundCue.kind} level={level} />
          )}

          {gameState === 'playing' && activeScene && !reducedMotion && (
            <ArcadeScene
              scene={activeScene}
              elapsed={animationFrame - roundCue.startedAt}
              onSkip={finishScene}
            />
          )}

          {gameState === 'paused' && menu === 'main' && (
            <PauseScreen score={score} lives={lives} level={level} onResume={togglePause} onOpenMenu={openMenu} />
          )}

          {menu === 'help' && <HowToPlay onBack={closeMenu} />}
          {menu === 'settings' && (
            <SettingsMenu settings={settings} onBack={closeMenu} onOpenCutscenes={openCutsceneViewer} />
          )}
          {menu === 'cutscenes' && <CutsceneViewer onBack={closeMenu} />}
          {(menu === 'restart' || menu === 'quit') && (
            <ConfirmRunAction
              action={menu}
              onCancel={closeMenu}
              onConfirm={menu === 'restart' ? handleStartGame : handleReturnToTitle}
            />
          )}

          {gameState === 'gameOver' && (
            <GameOverScreen
              score={score}
              highScore={highScore}
              level={level}
              onRestart={handleStartGame}
            />
          )}
        </div>

        {gameState !== 'start' && (
          <>
            <div className={gameState === 'playing' ? 'hud-slot' : 'hud-slot hud-slot-hidden'} inert={gameState !== 'playing'}>
              <HUD
                score={score}
                lives={lives}
                level={level}
                powerMs={player.powered && !player.dying ? player.powerTimer : 0}
                soundEnabled={sound}
                onSoundToggle={toggleSound}
                onPause={togglePause}
              />
            </div>
            <TouchControls active={gameState === 'playing' && !activeScene} enabled={inputEnabled} onDirection={setNextDirection} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
