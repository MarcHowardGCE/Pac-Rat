/**
 * useGameState Hook
 * 
 * Custom React hook for managing the core game state including:
 * - Game status (start, playing, gameOver)
 * - Score, lives, and level tracking
 * - High score persistence
 */

import { useState, useCallback, useEffect, useRef } from 'react';
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
  
  // Use ref to track maze for synchronous access
  const mazeRef = useRef(maze);
  useEffect(() => {
    mazeRef.current = maze;
  }, [maze]);
  
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
   * @returns {boolean} True if dot was collected
   * @note Caller is responsible for adding score and playing sound effects
   */
  const collectDot = useCallback((x, y) => {
    // Check if dot exists using ref for synchronous access
    const currentMaze = mazeRef.current;
    if (currentMaze[y] && currentMaze[y][x] === 2) {
      // Update maze to remove the dot
      setMaze((prevMaze) => {
        const newMaze = prevMaze.map((row) => [...row]);
        newMaze[y][x] = 0;
        return newMaze;
      });
      return true;
    }
    return false;
  }, []);

  /**
   * Collect a power-up from the maze
   * @param {number} x - Grid X coordinate
   * @param {number} y - Grid Y coordinate
   * @returns {boolean} True if power-up was collected
   * @note Caller is responsible for adding score, activating power-up, and playing sound effects
   */
  const collectPowerUp = useCallback((x, y) => {
    // Check if power-up exists using ref for synchronous access
    const currentMaze = mazeRef.current;
    if (currentMaze[y] && currentMaze[y][x] === 3) {
      // Update maze to remove the power-up
      setMaze((prevMaze) => {
        const newMaze = prevMaze.map((row) => [...row]);
        newMaze[y][x] = 0;
        return newMaze;
      });
      return true;
    }
    return false;
  }, []);

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
