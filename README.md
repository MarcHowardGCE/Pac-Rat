# Pac-Rat 🦦🐀

A professional Pac-Man clone themed around the Arizona desert! Control a ferret as you navigate through a desert maze, collecting dots while avoiding colorful rats. Eat prairie dogs to power up and turn the tables on your enemies!

## 🎮 Play the Game

**[Play Pac-Rat Now!](https://marchowardgce.github.io/Pac-Rat/)**

Or run locally:
1. Clone this repository
2. Open `index.html` in any modern web browser
3. Start playing!

## 🎯 Game Features

- **Classic Pac-Man gameplay** with modern twist
- **Arizona desert theme** with sand and rock aesthetics
- **Custom characters:**
  - 🦦 Ferret player (instead of Pac-Man)
  - 🐀 Four colorful rats (instead of ghosts)
  - 🐕 Prairie dogs (power-ups)
  - 🍬 Candy bonuses (instead of fruits)
- **Professional UI** with start screen and game over screen
- **Responsive design** works on mobile and desktop
- **Score tracking** with local high score storage
- **Multiple lives** system
- **Power-up mechanics** - eat prairie dogs to chase the rats!

## 🕹️ How to Play

### Controls
- **Arrow Keys** or **WASD** to move the ferret
- Navigate through the maze and collect all dots
- Avoid the rats (unless you're powered up!)
- Eat prairie dogs (🐕) to gain temporary power to eat rats
- Collect candy (🍬) for bonus points

### Scoring
- Small dots: 10 points
- Prairie dogs: 50 points + power-up ability
- Rats (when powered up): 200 points
- Candy: 100 points

### Objective
Collect all the dots in the maze to advance to the next level while avoiding (or eating!) the rats.

## 🚀 Development and Deployment

This game is built with **React** and **Vite** for a modern, performant, and maintainable codebase.

### Prerequisites
- Node.js 16+ and npm

### Local Development
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown (usually `http://localhost:5173`)

### Build for Production
Build optimized production files:
```bash
npm run build
```
The built files will be in the `dist/` directory.

### Deploy to GitHub Pages
1. Build the project: `npm run build`
2. Push the code to your GitHub repository
3. Go to repository Settings → Pages
4. Select the branch and `/dist` folder (or use GitHub Actions)
5. Your game will be live at `https://[username].github.io/[repo-name]/`

### Deploy to Netlify
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your Git repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy!

### Deploy to Vercel
1. Sign up at [vercel.com](https://vercel.com)
2. Import your Git repository
3. Vercel auto-detects Vite and configures build settings
4. Deploy!

## 🛠️ Technical Details

- **React** - Modern component-based architecture
- **Vite** - Fast build tool and dev server
- **Custom Hooks** - Modular game logic (useGameState, usePlayer, useRats, useInput)
- **HTML5 Canvas** for rendering
- **Web Audio API** for sound effects and music
- **CSS3** for styling and responsive design
- **LocalStorage** for high score and preferences persistence
- **Responsive design** adapts to different screen sizes
- **JSDoc comments** throughout for better code documentation

## 📁 Project Structure

```
Pac-Rat/
├── src/
│   ├── components/          # React components
│   │   ├── App.jsx          # Main app component
│   │   ├── GameCanvas.jsx   # Canvas rendering component
│   │   ├── HUD.jsx          # Heads-up display
│   │   ├── Logo.jsx         # Game logo
│   │   ├── StartScreen.jsx  # Start screen
│   │   └── GameOverScreen.jsx # Game over screen
│   ├── hooks/               # Custom React hooks
│   │   ├── useGameState.js  # Game state management
│   │   ├── usePlayer.js     # Player logic
│   │   ├── useRats.js       # Enemy AI
│   │   └── useInput.js      # Input handling
│   ├── utils/               # Utility modules
│   │   ├── constants.js     # Game constants
│   │   ├── mazeData.js      # Maze layout
│   │   ├── collision.js     # Collision detection
│   │   ├── rendering.js     # Canvas drawing functions
│   │   └── audio.js         # Audio manager
│   └── main.jsx            # App entry point
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🎯 Component Architecture

The application follows a clean, component-based architecture:

- **Presentational Components**: Logo, HUD, StartScreen, GameOverScreen, GameCanvas
- **Custom Hooks**: Encapsulate game logic (state, player, enemies, input)
- **Utility Modules**: Pure functions for rendering, collision, audio
- **Constants**: Centralized configuration for easy tweaking

## 🎨 Theme

The game features a warm Arizona desert color palette:
- Sandy beige backgrounds (#e8c5a0, #d4a574)
- Dark brown maze walls (#8b6f47, #5d4037)
- Golden yellow accents (#ffeb3b, #ffd54f)
- Orange interactive elements (#ff6f00, #e65100)

## 🎮 Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This is a educational/portfolio project created as a Pac-Man clone. All original Pac-Man concepts are property of Bandai Namco Entertainment Inc.

## 🙏 Acknowledgments

Inspired by the classic Pac-Man arcade game created by Toru Iwatani and published by Namco (now Bandai Namco Entertainment Inc.) in 1980.