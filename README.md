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

## 🚀 Deployment

This game is built with pure HTML5, CSS3, and vanilla JavaScript - no dependencies or build process required!

### Deploy to GitHub Pages
1. Push the code to your GitHub repository
2. Go to repository Settings → Pages
3. Select the branch and root folder
4. Your game will be live at `https://[username].github.io/[repo-name]/`

### Deploy to Netlify
1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop the folder or connect your Git repository
3. Your game is instantly deployed!

### Deploy to Vercel
1. Sign up at [vercel.com](https://vercel.com)
2. Import your Git repository or upload files
3. Your game is automatically deployed!

### Run Locally
Simply open `index.html` in any modern web browser. No server required!

For testing with a local server:
```bash
python3 -m http.server 8080
# or
npx serve
```

## 🛠️ Technical Details

- **Pure vanilla JavaScript** - no frameworks or libraries
- **HTML5 Canvas** for rendering
- **CSS3** for styling and responsive design
- **LocalStorage** for high score persistence
- **Responsive design** adapts to different screen sizes

## 📁 Project Structure

```
Pac-Rat/
├── index.html      # Main HTML file with game structure
├── style.css       # Styling and desert theme
├── game.js         # Complete game logic and rendering
└── README.md       # This file
```

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