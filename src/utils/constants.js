/**
 * Game Constants
 * 
 * This file contains all the constant values used throughout the Pac-Rat game.
 * These values define the game's configuration, grid layout, timing, and behavior.
 */

/**
 * Grid and layout constants
 */
export const TILE_SIZE = 20;
export const GRID_WIDTH = 28;
export const GRID_HEIGHT = 31;
export const TUNNEL_ROW = 14; // Row where horizontal tunnel wrapping occurs
export const REFERENCE_FRAME_MS = 1000 / 60;
export const MAX_MOVEMENT_DELTA_MS = 50;

/**
 * Animation and timing constants
 */
export const DEATH_ANIMATION_DURATION = 1500; // Duration of death animation in milliseconds
export const POWER_UP_DURATION = 8000; // Power-up effect duration in milliseconds
export const CANDY_SPAWN_INTERVAL = 10000; // Time between candy spawns in milliseconds
export const CANDY_LIFETIME = 8000; // How long candy stays on screen in milliseconds

/**
 * Rat base boundaries (used for candy spawn exclusion)
 */
export const RAT_BASE = {
  MIN_X: 10,
  MAX_X: 17,
  MIN_Y: 11,
  MAX_Y: 18,
};

/**
 * Player (Ferret) configuration
 */
export const PLAYER_CONFIG = {
  START_X: 14,
  START_Y: 23,
  SPEED: 0.15,
  INITIAL_LIVES: 3,
};

/**
 * Rat (Enemy) configurations with staggered exit delays
 */
export const RAT_CONFIGS = [
  {
    startX: 12,
    startY: 14,
    color: '#FF0000',
    direction: { x: 1, y: 0 },
    scatterTarget: { x: 25, y: 1 },
    exitDelay: 0, // Exits immediately
  },
  {
    startX: 14,
    startY: 14,
    color: '#FFB8FF',
    direction: { x: 0, y: -1 },
    scatterTarget: { x: 2, y: 1 },
    exitDelay: 2000, // Exits after 2 seconds
  },
  {
    startX: 13,
    startY: 14,
    color: '#00FFFF',
    direction: { x: -1, y: 0 },
    scatterTarget: { x: 25, y: 29 },
    exitDelay: 4000, // Exits after 4 seconds
  },
  {
    startX: 15,
    startY: 14,
    color: '#FFB852',
    direction: { x: 0, y: 1 },
    scatterTarget: { x: 2, y: 29 },
    exitDelay: 6000, // Exits after 6 seconds
  },
];

/**
 * Game speeds
 */
export const SPEED = {
  RAT_NORMAL: 0.12,
  RAT_SCARED: 0.08,
};

/**
 * Scoring system
 */
export const SCORES = {
  DOT: 10,
  POWER_UP: 50,
  RAT: 200,
  CANDY: 100,
};

/**
 * Color palette - Arizona desert theme
 */
export const COLORS = {
  BACKGROUND: '#2d1b0e',
  WALL: '#8b6f47',
  WALL_STROKE: '#6d563a',
  DOT: '#ffd54f',
  PLAYER_NORMAL: '#e8dcc8',
  PLAYER_POWERED: '#ffeb3b',
  PLAYER_MASK: '#8b7355',
  SCARED_RAT_BLUE: '#6495ED',
  SCARED_RAT_WHITE: '#FFFFFF',
  PRAIRIE_DOG_BODY: '#c9a569',
  PRAIRIE_DOG_HEAD: '#d4a574',
  CANDY_COLORS: ['#FF69B4', '#FF1493', '#FF6347'],
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  HIGH_SCORE: 'pacRatHighScore',
  SOUND_ENABLED: 'pacRatSound',
};
