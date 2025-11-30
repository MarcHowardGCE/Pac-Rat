/**
 * useGameState Hook
 * 
 * Custom React hook for managing the core game state including:
 * - Game status (start, playing, gameOver)
 * - Score, lives, and level tracking
 * - High score persistence
 */

import { useState, useCallback, useEffect } from 'react';
import { PLAYER_CONFIG, STORAGE_KEYS, SCORES } from '../utils/constants.js';
import { isLevelComplete } from '../utils/collision.js';
import { getInitialMaze } from '../utils/mazeData.js';

/**
 * Hook for managing game state
 * @returns {Object} Game state and control functions
 */
export const useGameState = () => {
  // Core game state
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'gameOver'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(PLAYER_CONFIG.INITIAL_LIVES);
  const [level, setLevel] = useState(1);
  const [maze, setMaze] = useState(() => getInitialMaze());
  
  // High score from localStorage
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return saved ? parseInt(saved, 10) : 0;
  });

  /**
   * Start a new game
   */
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLives(PLAYER_CONFIG.INITIAL_LIVES);
    setLevel(1);
    setMaze(getInitialMaze());
  }, []);

  /**
   * Reset current level
   */
  const resetLevel = useCallback(() => {
    setMaze(getInitialMaze());
  }, []);

  /**
   * Advance to next level
   */
  const nextLevel = useCallback(() => {
    setLevel((prev) => prev + 1);
    setMaze(getInitialMaze());
  }, []);

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
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    }
  }, [score, highScore]);

  /**
   * Collect a dot from the maze
   * @param {number} x - Grid X coordinate
   * @param {number} y - Grid Y coordinate
   */
  const collectDot = useCallback((x, y) => {
    setMaze((prevMaze) => {
      const newMaze = prevMaze.map((row) => [...row]);
      if (newMaze[y] && newMaze[y][x] === 2) {
        newMaze[y][x] = 0;
        addScore(SCORES.DOT);
      }
      return newMaze;
    });
  }, [addScore]);

  /**
   * Collect a power-up from the maze
   * @param {number} x - Grid X coordinate
   * @param {number} y - Grid Y coordinate
   * @returns {boolean} True if power-up was collected
   */
  const collectPowerUp = useCallback((x, y) => {
    let collected = false;
    setMaze((prevMaze) => {
      const newMaze = prevMaze.map((row) => [...row]);
      if (newMaze[y] && newMaze[y][x] === 3) {
        newMaze[y][x] = 0;
        addScore(SCORES.POWER_UP);
        collected = true;
      }
      return newMaze;
    });
    return collected;
  }, [addScore]);

  /**
   * Check if current level is complete
   * @returns {boolean} True if level is complete
   */
  const checkLevelComplete = useCallback(() => {
    return isLevelComplete(maze);
  }, [maze]);

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
