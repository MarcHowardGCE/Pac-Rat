/**
 * useGameState Hook
 * 
 * Custom React hook for managing the core game state including:
 * - Game status (start, playing, gameOver)
 * - Score, lives, and level tracking
 * - High score persistence
 */

import { useState, useCallback, useRef } from 'react';
import { PLAYER_CONFIG, STORAGE_KEYS } from '../utils/constants.js';
import { isLevelComplete } from '../utils/collision.js';
import { getInitialMaze } from '../utils/mazeData.js';
import { readStored, writeStored } from '../utils/storage.js';

/**
 * Hook for managing game state
 * @returns {Object} Game state and control functions
 */
export const useGameState = () => {
  // Core game state
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'paused' | 'gameOver'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(PLAYER_CONFIG.INITIAL_LIVES);
  const [level, setLevel] = useState(1);
  const [maze, setMaze] = useState(() => getInitialMaze());
  
  const mazeRef = useRef(maze);
  const replaceMaze = useCallback((nextMaze) => {
    mazeRef.current = nextMaze;
    setMaze(nextMaze);
  }, []);
  
  // High score from localStorage
  const [highScore, setHighScore] = useState(() => {
    const saved = Number(readStored(STORAGE_KEYS.HIGH_SCORE));
    return Number.isSafeInteger(saved) && saved >= 0 ? saved : 0;
  });

  /**
   * Start a new game
   */
  const resetRun = useCallback((state) => {
    setGameState(state);
    setScore(0);
    setLives(PLAYER_CONFIG.INITIAL_LIVES);
    setLevel(1);
    replaceMaze(getInitialMaze());
  }, [replaceMaze]);

  const startGame = useCallback(() => resetRun('playing'), [resetRun]);
  const returnToTitle = useCallback(() => resetRun('start'), [resetRun]);

  const pauseGame = useCallback(() => {
    setGameState((current) => (current === 'playing' ? 'paused' : current));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState((current) => (current === 'paused' ? 'playing' : current));
  }, []);

  /**
   * Reset current level
   */
  const resetLevel = useCallback(() => {
    replaceMaze(getInitialMaze());
  }, [replaceMaze]);

  /**
   * Advance to next level
   */
  const nextLevel = useCallback(() => {
    setLevel((prev) => prev + 1);
    replaceMaze(getInitialMaze());
  }, [replaceMaze]);

  /**
   * Add points to score
   * @param {number} points - Points to add
   */
  const addScore = useCallback((points) => {
    setScore((prev) => prev + points);
  }, []);

  /**
   * Lose a life
   * @returns {boolean} True if game should end
   */
  const loseLife = useCallback(() => {
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        return 0;
      }
      return newLives;
    });
    return lives - 1 <= 0;
  }, [lives]);

  /**
   * End the game
   */
  const endGame = useCallback(() => {
    setGameState('gameOver');
    
    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
      writeStored(STORAGE_KEYS.HIGH_SCORE, score);
    }
  }, [score, highScore]);

  const collectTile = useCallback((x, y, type) => {
    const currentMaze = mazeRef.current;
    if (currentMaze[y]?.[x] !== type) return false;

    const nextMaze = [...currentMaze];
    nextMaze[y] = [...currentMaze[y]];
    nextMaze[y][x] = 0;
    replaceMaze(nextMaze);
    return true;
  }, [replaceMaze]);

  const collectDot = useCallback((x, y) => collectTile(x, y, 2), [collectTile]);
  const collectPowerUp = useCallback((x, y) => collectTile(x, y, 3), [collectTile]);
  const checkLevelComplete = useCallback(() => isLevelComplete(mazeRef.current), []);

  return {
    // State
    gameState,
    score,
    lives,
    level,
    maze,
    highScore,
    
    // Actions
    startGame,
    returnToTitle,
    pauseGame,
    resumeGame,
    resetLevel,
    nextLevel,
    addScore,
    loseLife,
    endGame,
    collectDot,
    collectPowerUp,
    checkLevelComplete,
  };
};
