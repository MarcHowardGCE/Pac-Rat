/**
 * App Component
 * 
 * Main application component that orchestrates the entire game.
 * Manages game loop, state, and coordinates all child components.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Logo } from './components/Logo.jsx';
import { HUD } from './components/HUD.jsx';
import { StartScreen } from './components/StartScreen.jsx';
import { GameOverScreen } from './components/GameOverScreen.jsx';
import { GameCanvas } from './components/GameCanvas.jsx';
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
  STORAGE_KEYS,
  RAT_BASE,
} from './utils/constants.js';
import './App.css';

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
    resetLevel,
    nextLevel,
    addScore,
    loseLife,
    endGame,
    collectDot,
    collectPowerUp,
    checkLevelComplete,
  } = gameStateHook;

  // Player management
  const playerHook = usePlayer(maze);
  const { player, resetPlayer, setNextDirection, activatePowerUp, startDeath, updatePlayer } =
    playerHook;

  // Rats (enemies) management
  const ratsHook = useRats(maze, player);
  const { rats, resetRats, resetRat, updateRats } = ratsHook;

  // Candies state
  const [candies, setCandies] = useState([]);
  const [candyTimer, setCandyTimer] = useState(0);

  // Animation state
  const [animationFrame, setAnimationFrame] = useState(0);
  const lastTimeRef = useRef(0);
  const rafIdRef = useRef(null);

  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return saved === null ? true : saved === 'true';
  });

  /**
   * Initialize audio context on user interaction
   */
  useEffect(() => {
    const initAudio = () => {
      audioManager.initialize();
      audioManager.setEnabled(soundEnabled);
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, [soundEnabled]);

  /**
   * Toggle sound enabled/disabled
   */
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(newValue));
      audioManager.setEnabled(newValue);
      
      if (!newValue) {
        audioManager.stopBackgroundMusic();
      } else if (gameState === 'playing') {
        audioManager.playBackgroundMusic();
      }
      
      return newValue;
    });
  }, [gameState]);

  /**
   * Start the game
   */
  const handleStartGame = useCallback(() => {
    startGameState();
    resetPlayer();
    resetRats();
    setCandies([]);
    setCandyTimer(0);
    audioManager.initialize();
    audioManager.setEnabled(soundEnabled);
    audioManager.playBackgroundMusic();
  }, [startGameState, resetPlayer, resetRats, soundEnabled]);

  /**
   * Handle level reset after death
   */
  const handleLevelReset = useCallback(() => {
    resetPlayer();
    resetRats();
  }, [resetPlayer, resetRats]);

  /**
   * Spawn a candy item
   */
  const spawnCandy = useCallback(() => {
    // Find empty spots to spawn candy, excluding rat base area
    const emptySpots = [];
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const inRatBase =
          x >= RAT_BASE.MIN_X &&
          x <= RAT_BASE.MAX_X &&
          y >= RAT_BASE.MIN_Y &&
          y <= RAT_BASE.MAX_Y;
        if (maze[y][x] === 0 && !inRatBase) {
          emptySpots.push({ x, y });
        }
      }
    }

    if (emptySpots.length > 0) {
      const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
      setCandies((prev) => [
        ...prev,
        {
          x: spot.x,
          y: spot.y,
          timer: CANDY_LIFETIME,
          type: Math.floor(Math.random() * 3),
        },
      ]);
    }
  }, [maze]);

  /**
   * Game update loop
   */
  const gameLoop = useCallback(
    (timestamp) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (gameState === 'playing') {
        setAnimationFrame((prev) => prev + deltaTime);

        // Handle death animation
        if (player.dying) {
          updatePlayer(deltaTime, animationFrame);
          
          if (player.deathAnimation >= DEATH_ANIMATION_DURATION) {
            const shouldEndGame = loseLife();
            if (shouldEndGame) {
              endGame();
              audioManager.stopBackgroundMusic();
            } else {
              handleLevelReset();
            }
          }
        } else {
          // Update player
          const collected = updatePlayer(deltaTime, animationFrame);

          // Handle collectibles
          if (collected.dot) {
            if (collectDot(collected.dot.x, collected.dot.y)) {
              addScore(SCORES.DOT);
              audioManager.playDotSound();
            }
          }
          if (collected.powerUp) {
            if (collectPowerUp(collected.powerUp.x, collected.powerUp.y)) {
              addScore(SCORES.POWER_UP);
              activatePowerUp();
              audioManager.playPowerUpSound();
            }
          }

          // Update rats
          updateRats(deltaTime);

          // Check player-rat collisions
          const collidedRat = checkPlayerRatCollision(player, rats);
          if (collidedRat) {
            if (player.powered) {
              // Eat the rat
              addScore(SCORES.RAT);
              const ratIndex = rats.indexOf(collidedRat);
              resetRat(ratIndex);
              audioManager.playEatRatSound();
            } else {
              // Player dies
              startDeath();
              audioManager.playDeathSound();
            }
          }

          // Check candy collisions
          const candyIndex = checkCandyCollision(player, candies);
          if (candyIndex !== -1) {
            addScore(SCORES.CANDY);
            setCandies((prev) => prev.filter((_, i) => i !== candyIndex));
            audioManager.playCandySound();
          }

          // Update candy timer and spawn
          setCandyTimer((prev) => {
            const newTimer = prev + deltaTime;
            if (newTimer > CANDY_SPAWN_INTERVAL && candies.length === 0) {
              spawnCandy();
              return 0;
            }
            return newTimer;
          });

          // Update candy lifetimes
          setCandies((prev) =>
            prev
              .map((candy) => ({
                ...candy,
                timer: candy.timer - deltaTime,
              }))
              .filter((candy) => candy.timer > 0)
          );

          // Check if level complete
          if (checkLevelComplete()) {
            nextLevel();
            resetPlayer();
            resetRats();
            setCandies([]);
            setCandyTimer(0);
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(gameLoop);
    },
    [
      gameState,
      player,
      rats,
      candies,
      animationFrame,
      maze,
      updatePlayer,
      updateRats,
      collectDot,
      collectPowerUp,
      activatePowerUp,
      addScore,
      loseLife,
      endGame,
      startDeath,
      resetPlayer,
      resetRats,
      resetRat,
      checkLevelComplete,
      nextLevel,
      spawnCandy,
      handleLevelReset,
    ]
  );

  /**
   * Start/stop game loop based on game state
   */
  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [gameLoop]);

  /**
   * Input handling
   */
  const { getTouchHandlers } = useInput(setNextDirection, gameState === 'playing');

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      audioManager.cleanup();
    };
  }, []);

  return (
    <div className="app">
      <div className="game-container">
        <Logo />
        
        <div className="canvas-wrapper">
          <GameCanvas
            maze={maze}
            player={player}
            rats={rats}
            candies={candies}
            animationFrame={animationFrame}
            touchHandlers={getTouchHandlers()}
          />
          
          {gameState === 'start' && (
            <StartScreen highScore={highScore} onStart={handleStartGame} />
          )}
          
          {gameState === 'gameOver' && (
            <GameOverScreen
              score={score}
              highScore={highScore}
              onRestart={handleStartGame}
            />
          )}
        </div>
        
        {gameState === 'playing' && (
          <HUD
            score={score}
            lives={lives}
            level={level}
            soundEnabled={soundEnabled}
            onSoundToggle={toggleSound}
          />
        )}
      </div>
    </div>
  );
}

export default App;
