# Pac-Rat Architecture

This document describes the architecture of the Pac-Rat React application.

## Overview

The application follows a **component-based architecture** with clear separation between presentation (components), business logic (hooks), and utilities (pure functions).

## Directory Structure

```
src/
├── components/          # React components (UI)
├── hooks/              # Custom React hooks (game logic)
├── utils/              # Pure utility functions
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## Components Layer

**Purpose**: Handle presentation and user interaction.

- `App.jsx` - Orchestrates the entire game, coordinates all hooks
- `GameCanvas.jsx` - Renders the game using HTML5 Canvas
- `HUD.jsx` - Displays score, lives, level, and sound toggle
- `Logo.jsx` - SVG logo component
- `StartScreen.jsx` - Initial screen with instructions
- `GameOverScreen.jsx` - End screen with final score

**Key Principle**: Components should be presentational and receive data via props. Business logic stays in hooks.

## Hooks Layer

**Purpose**: Encapsulate game logic and state management.

- `useGameState.js` - Manages core game state (score, lives, level, maze)
- `usePlayer.js` - Player state, movement, power-ups, death
- `useRats.js` - Enemy AI (chase/flee behavior, pathfinding)
- `useInput.js` - Handles keyboard and touch input

**Key Principle**: Hooks should be independent and composable. They can depend on other hooks but should have clear responsibilities.

## Utilities Layer

**Purpose**: Pure functions with no side effects.

- `constants.js` - All game configuration values
- `mazeData.js` - Maze layout and helper functions
- `collision.js` - Collision detection algorithms
- `rendering.js` - Canvas drawing functions
- `audio.js` - Audio management (singleton pattern)

**Key Principle**: Utilities are pure functions (except audio manager). They're easy to test and reuse.

## Data Flow

```
User Input → useInput Hook → App Component
                              ↓
                         Update Hooks (usePlayer, useRats, useGameState)
                              ↓
                         Re-render Components
                              ↓
                         GameCanvas (draws to canvas)
```

## Game Loop

The game loop is managed in `App.jsx`:

1. `requestAnimationFrame` drives the loop
2. Calculate `deltaTime` since last frame
3. Update all hooks with `deltaTime`
4. Check collisions
5. Update canvas rendering
6. Repeat

## State Management

- **Local Component State**: UI-only state (e.g., screen visibility)
- **Custom Hooks**: Game state (score, player position, rats)
- **LocalStorage**: Persistent data (high score, sound preference)

## Adding New Features

### New Game Mechanic
1. Create a new hook in `hooks/` if it's stateful
2. Or add pure functions to `utils/` if stateless
3. Integrate in `App.jsx` game loop

### New UI Element
1. Create a new component in `components/`
2. Pass necessary data via props
3. Add to `App.jsx` render tree

### New Configuration
1. Add to `utils/constants.js`
2. Export and use throughout codebase

## Performance Considerations

- Canvas rendering is efficient (single draw per frame)
- Hooks use `useCallback` to prevent unnecessary re-renders
- Pure utility functions are easily memoizable
- Game loop uses `requestAnimationFrame` for optimal performance

## Testing Strategy

- **Components**: Test rendering and user interaction
- **Hooks**: Test state updates and logic
- **Utilities**: Test input/output (easiest to test, pure functions)

## Future Enhancements

Potential areas for expansion:
- Add unit tests for hooks and utilities
- Implement sprite sheets for better graphics
- Add more levels with different layouts
- Create a level editor
- Add multiplayer support
- Implement game replay functionality
