// Pac-Rat Game - Main Game Logic
class PacRatGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.state = 'start'; // start, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.highScore = localStorage.getItem('pacRatHighScore') || 0;
        
        // Game settings
        this.tileSize = 20;
        this.gridWidth = 28;
        this.gridHeight = 31;
        this.TUNNEL_ROW = 14; // Row where tunnel wrapping occurs (zero-based index, corresponds to maze[14])
        
        // Rat base boundaries (for candy spawn exclusion)
        this.RAT_BASE_MIN_X = 10;
        this.RAT_BASE_MAX_X = 17;
        this.RAT_BASE_MIN_Y = 11;
        this.RAT_BASE_MAX_Y = 18;
        
        // Set canvas size
        this.canvas.width = this.gridWidth * this.tileSize;
        this.canvas.height = this.gridHeight * this.tileSize;
        
        // Maze layout (0 = path, 1 = wall, 2 = dot, 3 = prairie dog power-up)
        // Note: Candy items are dynamically spawned via spawnCandy() method
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,0,0,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
            [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
            [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.originalMaze = JSON.parse(JSON.stringify(this.maze));
        
        // Player (Ferret)
        this.player = {
            x: 14,
            y: 23,
            direction: { x: 0, y: 0 },
            nextDirection: { x: 0, y: 0 },
            speed: 0.15,
            mouthAngle: 0,
            powered: false,
            powerTimer: 0,
            dying: false,
            deathAnimation: 0
        };
        
        // Rats (Enemies) - exitDelay in milliseconds
        this.rats = [
            { x: 12, y: 14, color: '#FF0000', startX: 12, startY: 14, direction: { x: 1, y: 0 }, mode: 'chase', scatterTarget: { x: 25, y: 1 }, exitTimer: 0, exitDelay: 0, hasExited: false },
            { x: 14, y: 14, color: '#FFB8FF', startX: 14, startY: 14, direction: { x: 0, y: -1 }, mode: 'chase', scatterTarget: { x: 2, y: 1 }, exitTimer: 0, exitDelay: 2000, hasExited: false },
            { x: 13, y: 14, color: '#00FFFF', startX: 13, startY: 14, direction: { x: -1, y: 0 }, mode: 'chase', scatterTarget: { x: 25, y: 29 }, exitTimer: 0, exitDelay: 4000, hasExited: false },
            { x: 15, y: 14, color: '#FFB852', startX: 15, startY: 14, direction: { x: 0, y: 1 }, mode: 'chase', scatterTarget: { x: 2, y: 29 }, exitTimer: 0, exitDelay: 6000, hasExited: false }
        ];
        
        // Candy bonus items
        this.candies = [];
        this.candyTimer = 0;
        
        // Animation
        this.animationFrame = 0;
        this.lastTime = 0;
        
        // UI elements
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.hud = document.getElementById('hud');
        this.startButton = document.getElementById('start-button');
        this.restartButton = document.getElementById('restart-button');
        this.soundButton = document.getElementById('sound-button');
        
        // Input handling
        this.keys = {};
        this.setupInput();
        
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        // Update high score display
        document.getElementById('high-score').textContent = this.highScore;
        
        // Audio system
        const savedSound = localStorage.getItem('pacRatSound');
        this.soundEnabled = savedSound === null ? true : savedSound === 'true';
        this.audioContext = null;
        this.musicLoopTimeout = null;
        this.setupAudio();
        
        // Start animation loop
        this.gameLoop();
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // Handle direction changes
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                this.player.nextDirection = { x: 0, y: -1 };
                e.preventDefault();
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.player.nextDirection = { x: 0, y: 1 };
                e.preventDefault();
            } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.player.nextDirection = { x: -1, y: 0 };
                e.preventDefault();
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.player.nextDirection = { x: 1, y: 0 };
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        const handleSwipe = () => {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 30;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (Math.abs(deltaX) > minSwipeDistance) {
                    if (deltaX > 0) {
                        this.player.nextDirection = { x: 1, y: 0 };
                    } else {
                        this.player.nextDirection = { x: -1, y: 0 };
                    }
                }
            } else {
                // Vertical swipe
                if (Math.abs(deltaY) > minSwipeDistance) {
                    if (deltaY > 0) {
                        this.player.nextDirection = { x: 0, y: 1 };
                    } else {
                        this.player.nextDirection = { x: 0, y: -1 };
                    }
                }
            }
        };
        
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            e.preventDefault();
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
            e.preventDefault();
        }, { passive: false });
        
        // Tap to start on mobile
        this.startScreen.addEventListener('touchend', (e) => {
            if (this.state === 'start') {
                this.startGame();
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    startGame() {
        this.state = 'playing';
        this.startScreen.classList.add('hidden');
        this.hud.classList.remove('hidden');
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.resetLevel();
        
        // Initialize audio context if not already done
        this.initializeAudioContext();
        
        this.playBackgroundMusic();
    }
    
    restartGame() {
        this.gameOverScreen.classList.add('hidden');
        this.startGame();
    }
    
    resetLevel() {
        // Reset maze
        this.maze = JSON.parse(JSON.stringify(this.originalMaze));
        
        // Reset player
        this.player.x = 14;
        this.player.y = 23;
        this.player.direction = { x: 0, y: 0 };
        this.player.nextDirection = { x: 0, y: 0 };
        this.player.powered = false;
        this.player.powerTimer = 0;
        
        // Reset rats
        this.rats.forEach((rat, index) => {
            rat.x = rat.startX;
            rat.y = rat.startY;
            rat.mode = 'chase';
            rat.exitTimer = 0; // Reset exit timer
            rat.hasExited = false; // Reset exit flag
            if (index === 0) rat.direction = { x: 1, y: 0 };
            else if (index === 1) rat.direction = { x: 0, y: -1 };
            else if (index === 2) rat.direction = { x: -1, y: 0 };
            else rat.direction = { x: 0, y: 1 };
        });
        
        this.candies = [];
        this.candyTimer = 0;
        
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        
        let livesDisplay = '';
        for (let i = 0; i < this.lives; i++) {
            livesDisplay += '❤️';
        }
        document.getElementById('lives').textContent = livesDisplay || '💀';
    }
    
    initializeAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    setupAudio() {
        
        // Sound toggle button
        if (this.soundButton) {
            this.soundButton.textContent = this.soundEnabled ? '🔊' : '🔇';
            this.soundButton.addEventListener('click', () => {
                this.soundEnabled = !this.soundEnabled;
                localStorage.setItem('pacRatSound', String(this.soundEnabled));
                this.soundButton.textContent = this.soundEnabled ? '🔊' : '🔇';
                
                if (!this.soundEnabled && this.backgroundMusic) {
                    this.stopBackgroundMusic();
                } else if (this.soundEnabled && this.state === 'playing' && !this.backgroundMusic) {
                    this.playBackgroundMusic();
                }
            });
        }
        
        // Initialize audio on user interaction
        document.addEventListener('click', () => this.initializeAudioContext(), { once: true });
        document.addEventListener('keydown', () => this.initializeAudioContext(), { once: true });
    }
    
    playSound(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.value = volume;
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playDotSound() {
        this.playSound(800, 0.05, 'square', 0.1);
    }
    
    playPowerUpSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.value = 0.3;
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    playEatRatSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.value = 0.3;
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    playDeathSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.value = 0.4;
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    playCandySound() {
        if (!this.soundEnabled || !this.audioContext) return;
        // Play a happy jingle
        const notes = [523, 659, 784, 1047]; // C E G C
        notes.forEach((freq, i) => {
            setTimeout(() => this.playSound(freq, 0.1, 'sine', 0.2), i * 50);
        });
    }
    
    playBackgroundMusic() {
        if (!this.soundEnabled || !this.audioContext) return;
        
        this.backgroundMusic = true;
        this.playMusicLoop();
    }
    
    playMusicLoop() {
        if (!this.soundEnabled || !this.backgroundMusic || this.state !== 'playing') {
            this.backgroundMusic = false;
            if (this.musicLoopTimeout) {
                clearTimeout(this.musicLoopTimeout);
                this.musicLoopTimeout = null;
            }
            return;
        }
        
        // Dynamic Arizona ferret-themed adventure melody
        // Upbeat, playful tune that captures the desert adventure spirit
        const melody = [
            // Main phrase - energetic and bouncy (like a ferret hopping)
            { freq: 659, dur: 0.15 }, // E (playful start)
            { freq: 784, dur: 0.15 }, // G
            { freq: 880, dur: 0.2 },  // A (higher, more excitement)
            { freq: 784, dur: 0.1 },  // G
            { freq: 659, dur: 0.15 }, // E
            { freq: 523, dur: 0.25 }, // C (return to base)
            
            // Variation 1 - desert wandering feel
            { freq: 587, dur: 0.2 },  // D
            { freq: 659, dur: 0.2 },  // E
            { freq: 784, dur: 0.3 },  // G (sustained)
            { freq: 659, dur: 0.15 }, // E
            { freq: 587, dur: 0.15 }, // D
            
            // Climax - ferret adventure peak
            { freq: 1047, dur: 0.2 }, // C (high)
            { freq: 988, dur: 0.15 }, // B
            { freq: 880, dur: 0.15 }, // A
            { freq: 784, dur: 0.2 },  // G
            { freq: 659, dur: 0.25 }, // E
            
            // Bridge - mysterious desert moment
            { freq: 698, dur: 0.2 },  // F
            { freq: 784, dur: 0.2 },  // G
            { freq: 880, dur: 0.15 }, // A
            { freq: 784, dur: 0.15 }, // G
            { freq: 659, dur: 0.3 },  // E (sustained)
            
            // Final phrase - triumphant return
            { freq: 523, dur: 0.15 }, // C
            { freq: 659, dur: 0.15 }, // E
            { freq: 784, dur: 0.15 }, // G
            { freq: 880, dur: 0.2 },  // A
            { freq: 1047, dur: 0.3 }, // C (high, triumphant end)
        ];
        
        let time = 0;
        melody.forEach(note => {
            setTimeout(() => {
                if (this.backgroundMusic && this.soundEnabled) {
                    // Vary the waveform for more interest
                    const waveform = note.freq > 800 ? 'triangle' : 'square';
                    this.playSound(note.freq, note.dur, waveform, 0.06);
                }
            }, time * 1000);
            time += note.dur;
        });
        
        // Schedule next loop with shorter pause for continuity
        this.musicLoopTimeout = setTimeout(() => this.playMusicLoop(), time * 1000 + 300);
    }
    
    stopBackgroundMusic() {
        this.backgroundMusic = false;
        if (this.musicLoopTimeout) {
            clearTimeout(this.musicLoopTimeout);
            this.musicLoopTimeout = null;
        }
    }
    
    gameLoop(timestamp = 0) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        if (this.state === 'playing') {
            this.update(deltaTime);
        }
        
        this.draw();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    update(deltaTime) {
        this.animationFrame += deltaTime;
        
        // Handle death animation
        if (this.player.dying) {
            this.player.deathAnimation += deltaTime;
            if (this.player.deathAnimation >= 1500) { // 1.5 second animation
                this.player.dying = false;
                this.player.deathAnimation = 0;
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    // Reset positions after death animation
                    this.player.x = 14;
                    this.player.y = 23;
                    this.player.direction = { x: 0, y: 0 };
                    this.player.nextDirection = { x: 0, y: 0 };
                    
                    this.rats.forEach((r) => {
                        r.x = r.startX;
                        r.y = r.startY;
                        r.exitTimer = 0;
                        r.hasExited = false;
                    });
                }
            }
            return; // Don't update game during death animation
        }
        
        // Update player
        this.updatePlayer();
        
        // Update rats
        this.rats.forEach(rat => this.updateRat(rat, deltaTime));
        
        // Check collisions
        this.checkCollisions();
        
        // Update power-up timer
        if (this.player.powered) {
            this.player.powerTimer -= deltaTime;
            if (this.player.powerTimer <= 0) {
                this.player.powered = false;
            }
        }
        
        // Update candy timer
        this.candyTimer += deltaTime;
        if (this.candyTimer > 10000 && this.candies.length === 0) {
            this.spawnCandy();
            this.candyTimer = 0;
        }
        
        // Remove candy after timeout
        this.candies = this.candies.filter(candy => {
            candy.timer -= deltaTime;
            return candy.timer > 0;
        });
        
        // Check if level complete
        if (this.isLevelComplete()) {
            this.level++;
            this.resetLevel();
        }
    }
    
    updatePlayer() {
        // Check if player is aligned with grid (centered in lane)
        const gridX = Math.round(this.player.x);
        const gridY = Math.round(this.player.y);
        const alignedX = Math.abs(this.player.x - gridX) < 0.1;
        const alignedY = Math.abs(this.player.y - gridY) < 0.1;
        const isAligned = alignedX && alignedY;
        
        // Try to change direction only when aligned with grid
        if (isAligned && (this.player.nextDirection.x !== 0 || this.player.nextDirection.y !== 0)) {
            // Check if the requested direction is valid
            const nextX = gridX + this.player.nextDirection.x;
            const nextY = gridY + this.player.nextDirection.y;
            
            if (this.canMove(nextX, nextY)) {
                this.player.direction = { ...this.player.nextDirection };
                // Snap to grid when changing direction
                this.player.x = gridX;
                this.player.y = gridY;
            }
            // Don't reset nextDirection - keep the queued input for next intersection
        }
        
        // Move in current direction
        const newX = this.player.x + this.player.direction.x * this.player.speed;
        const newY = this.player.y + this.player.direction.y * this.player.speed;
        
        if (this.canMove(Math.round(newX), Math.round(newY))) {
            this.player.x = newX;
            this.player.y = newY;
            
            // Handle tunnel wrapping
            if (this.player.x < 0) this.player.x = this.gridWidth - 1;
            if (this.player.x >= this.gridWidth) this.player.x = 0;
        } else {
            // Can't move forward, snap to grid
            this.player.x = gridX;
            this.player.y = gridY;
            this.player.direction = { x: 0, y: 0 };
        }
        
        // Animate mouth
        this.player.mouthAngle = Math.abs(Math.sin(this.animationFrame / 100) * 0.4);
        
        // Collect items (reuse gridX and gridY from above)
        if (this.maze[gridY] && this.maze[gridY][gridX] === 2) {
            this.maze[gridY][gridX] = 0;
            this.score += 10;
            this.playDotSound();
            this.updateUI();
        } else if (this.maze[gridY] && this.maze[gridY][gridX] === 3) {
            this.maze[gridY][gridX] = 0;
            this.score += 50;
            this.player.powered = true;
            this.player.powerTimer = 8000; // 8 seconds
            this.playPowerUpSound();
            this.updateUI();
        }
        
        // Collect candy
        this.candies.forEach((candy, index) => {
            const distance = Math.sqrt(Math.pow(candy.x - gridX, 2) + Math.pow(candy.y - gridY, 2));
            if (distance < 1) {
                this.score += 100;
                this.candies.splice(index, 1);
                this.playCandySound();
                this.updateUI();
            }
        });
    }
    
    updateRat(rat, deltaTime) {
        // Check if rat should be in base (during exit delay)
        if (!rat.hasExited && rat.exitTimer < rat.exitDelay) {
            rat.exitTimer += deltaTime;
            return; // Don't move while in base
        }
        
        // Mark as exited once delay is over
        if (!rat.hasExited && rat.exitTimer >= rat.exitDelay) {
            rat.hasExited = true;
        }
        
        // Simple AI: Random direction changes at intersections
        const gridX = Math.round(rat.x);
        const gridY = Math.round(rat.y);
        
        // Check if at intersection
        const isAtIntersection = Math.abs(rat.x - gridX) < 0.1 && Math.abs(rat.y - gridY) < 0.1;
        
        if (isAtIntersection) {
            const possibleDirections = [];
            
            if (this.canMove(gridX, gridY - 1) && rat.direction.y !== 1) {
                possibleDirections.push({ x: 0, y: -1 });
            }
            if (this.canMove(gridX, gridY + 1) && rat.direction.y !== -1) {
                possibleDirections.push({ x: 0, y: 1 });
            }
            if (this.canMove(gridX - 1, gridY) && rat.direction.x !== 1) {
                possibleDirections.push({ x: -1, y: 0 });
            }
            if (this.canMove(gridX + 1, gridY) && rat.direction.x !== -1) {
                possibleDirections.push({ x: 1, y: 0 });
            }
            
            if (possibleDirections.length > 0) {
                // Choose direction based on mode
                if (this.player.powered) {
                    // Run away from player
                    rat.direction = this.getAwayDirection(rat, possibleDirections);
                } else {
                    // Chase player
                    rat.direction = this.getChaseDirection(rat, possibleDirections);
                }
            }
        }
        
        // Move rat
        const speed = this.player.powered ? 0.08 : 0.12;
        rat.x += rat.direction.x * speed;
        rat.y += rat.direction.y * speed;
        
        // Handle tunnel wrapping
        if (rat.x < 0) rat.x = this.gridWidth - 1;
        if (rat.x >= this.gridWidth) rat.x = 0;
    }
    
    getChaseDirection(rat, directions) {
        // Find direction that gets closest to player
        let bestDir = directions[0];
        let bestDist = Infinity;
        
        directions.forEach(dir => {
            const nextX = Math.round(rat.x) + dir.x;
            const nextY = Math.round(rat.y) + dir.y;
            const dist = Math.sqrt(
                Math.pow(nextX - this.player.x, 2) + 
                Math.pow(nextY - this.player.y, 2)
            );
            
            if (dist < bestDist) {
                bestDist = dist;
                bestDir = dir;
            }
        });
        
        return bestDir;
    }
    
    getAwayDirection(rat, directions) {
        // Find direction that gets farthest from player
        let bestDir = directions[0];
        let bestDist = -Infinity;
        
        directions.forEach(dir => {
            const nextX = Math.round(rat.x) + dir.x;
            const nextY = Math.round(rat.y) + dir.y;
            const dist = Math.sqrt(
                Math.pow(nextX - this.player.x, 2) + 
                Math.pow(nextY - this.player.y, 2)
            );
            
            if (dist > bestDist) {
                bestDist = dist;
                bestDir = dir;
            }
        });
        
        return bestDir;
    }
    
    canMove(x, y) {
        if (y < 0 || y >= this.gridHeight || (x < 0 && y !== this.TUNNEL_ROW) || (x >= this.gridWidth && y !== this.TUNNEL_ROW)) {
            return false;
        }
        
        // Allow tunnel movement
        if (y === this.TUNNEL_ROW && (x < 0 || x >= this.gridWidth)) {
            return true;
        }
        
        return this.maze[y] && this.maze[y][x] !== 1;
    }
    
    checkCollisions() {
        const playerGridX = Math.round(this.player.x);
        const playerGridY = Math.round(this.player.y);
        
        this.rats.forEach(rat => {
            const ratGridX = Math.round(rat.x);
            const ratGridY = Math.round(rat.y);
            const distance = Math.sqrt(
                Math.pow(playerGridX - ratGridX, 2) + 
                Math.pow(playerGridY - ratGridY, 2)
            );
            
            if (distance < 1) {
                if (this.player.powered) {
                    // Eat the rat
                    this.score += 200;
                    rat.x = rat.startX;
                    rat.y = rat.startY;
                    rat.exitTimer = 0; // Reset exit timer
                    rat.hasExited = false; // Reset exit flag
                    this.playEatRatSound();
                    this.updateUI();
                } else if (!this.player.dying) {
                    // Lose a life and trigger death animation
                    this.lives--;
                    this.player.dying = true;
                    this.player.deathAnimation = 0;
                    this.playDeathSound();
                    this.updateUI();
                }
            }
        });
    }
    
    spawnCandy() {
        // Find empty spots to spawn candy, excluding rat base area (center of maze)
        const emptySpots = [];
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                // Exclude rat base area
                const inRatBase = (x >= this.RAT_BASE_MIN_X && x <= this.RAT_BASE_MAX_X && 
                                   y >= this.RAT_BASE_MIN_Y && y <= this.RAT_BASE_MAX_Y);
                if (this.maze[y][x] === 0 && !inRatBase) {
                    emptySpots.push({ x, y });
                }
            }
        }
        
        if (emptySpots.length > 0) {
            const spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            this.candies.push({
                x: spot.x,
                y: spot.y,
                timer: 8000,
                type: Math.floor(Math.random() * 3) // Different candy types
            });
        }
    }
    
    isLevelComplete() {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.maze[y][x] === 2) {
                    return false;
                }
            }
        }
        return true;
    }
    
    gameOver() {
        this.state = 'gameOver';
        this.hud.classList.add('hidden');
        this.gameOverScreen.classList.remove('hidden');
        this.stopBackgroundMusic();
        
        document.getElementById('final-score').textContent = this.score;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pacRatHighScore', this.highScore);
        }
        
        document.getElementById('game-over-high-score').textContent = this.highScore;
    }
    
    draw() {
        // Clear canvas with desert background
        this.ctx.fillStyle = '#2d1b0e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        this.drawMaze();
        
        // Draw candies
        this.candies.forEach(candy => this.drawCandy(candy));
        
        // Draw rats
        this.rats.forEach(rat => this.drawRat(rat));
        
        // Draw player
        this.drawPlayer();
    }
    
    drawMaze() {
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const cell = this.maze[y][x];
                const px = x * this.tileSize;
                const py = y * this.tileSize;
                
                if (cell === 1) {
                    // Wall - desert rock style
                    this.ctx.fillStyle = '#8b6f47';
                    this.ctx.fillRect(px, py, this.tileSize, this.tileSize);
                    this.ctx.strokeStyle = '#6d563a';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(px, py, this.tileSize, this.tileSize);
                } else if (cell === 2) {
                    // Dot
                    this.ctx.fillStyle = '#ffd54f';
                    this.ctx.beginPath();
                    this.ctx.arc(px + this.tileSize / 2, py + this.tileSize / 2, 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (cell === 3) {
                    // Prairie dog power-up
                    this.drawPrairieDog(px + this.tileSize / 2, py + this.tileSize / 2);
                }
            }
        }
    }
    
    drawPlayer() {
        const px = this.player.x * this.tileSize + this.tileSize / 2;
        const py = this.player.y * this.tileSize + this.tileSize / 2;
        
        // Death animation
        if (this.player.dying) {
            const progress = this.player.deathAnimation / 1500; // 0 to 1
            const shrinkSize = 12 * (1 - progress); // Shrink from 12 to 0
            
            // Draw shrinking player
            this.ctx.fillStyle = '#e8dcc8';
            this.ctx.beginPath();
            this.ctx.arc(px, py, shrinkSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw blood droplets (particles)
            const numDroplets = 8;
            for (let i = 0; i < numDroplets; i++) {
                const angle = (i / numDroplets) * Math.PI * 2;
                const distance = progress * 20;
                const dropletX = px + Math.cos(angle) * distance;
                const dropletY = py + Math.sin(angle) * distance;
                const dropletSize = 2 * (1 - progress);
                
                this.ctx.fillStyle = '#8B0000';
                this.ctx.beginPath();
                this.ctx.arc(dropletX, dropletY, dropletSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
            return;
        }
        
        // Determine rotation based on direction
        let rotation = 0;
        if (this.player.direction.x > 0) rotation = 0;
        else if (this.player.direction.x < 0) rotation = Math.PI;
        else if (this.player.direction.y > 0) rotation = Math.PI / 2;
        else if (this.player.direction.y < 0) rotation = -Math.PI / 2;
        
        this.ctx.save();
        this.ctx.translate(px, py);
        this.ctx.rotate(rotation);
        
        // Ferret colors - light tan/beige with dark mask
        const bodyColor = this.player.powered ? '#ffeb3b' : '#e8dcc8';
        const maskColor = this.player.powered ? '#ffeb3b' : '#8b7355';
        
        // Draw elongated body (ferrets have long bodies)
        this.ctx.fillStyle = bodyColor;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 8, 6, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw head (smaller, rounder)
        this.ctx.fillStyle = bodyColor;
        this.ctx.beginPath();
        this.ctx.arc(7, 0, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw ferret mask (dark area around eyes)
        this.ctx.fillStyle = maskColor;
        this.ctx.beginPath();
        this.ctx.ellipse(7, 0, 4, 3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw pointy nose
        this.ctx.fillStyle = '#2d1b0e';
        this.ctx.beginPath();
        this.ctx.moveTo(11, 0);
        this.ctx.lineTo(10, -1.5);
        this.ctx.lineTo(10, 1.5);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw small round ears
        this.ctx.fillStyle = bodyColor;
        this.ctx.beginPath();
        this.ctx.arc(5, -4, 2, 0, Math.PI * 2);
        this.ctx.arc(5, 4, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw cute beady eyes
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(8, -1.5, 1.5, 0, Math.PI * 2);
        this.ctx.arc(8, 1.5, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw eye shine for cuteness
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(8.5, -1.2, 0.5, 0, Math.PI * 2);
        this.ctx.arc(8.5, 1.8, 0.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw small tail
        this.ctx.strokeStyle = bodyColor;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(-8, 0);
        this.ctx.lineTo(-10, this.animationFrame % 200 > 100 ? 2 : -2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawRat(rat) {
        const px = rat.x * this.tileSize + this.tileSize / 2;
        const py = rat.y * this.tileSize + this.tileSize / 2;
        
        // If powered, rats turn blue/white and look scared
        let color = rat.color;
        let scared = false;
        
        if (this.player.powered) {
            scared = true;
            const timeRemaining = this.player.powerTimer;
            
            // Flash animation - slow at first, fast when time running out
            if (timeRemaining < 2000) {
                // Fast flash (last 2 seconds)
                const flashSpeed = 150; // milliseconds
                const isWhite = Math.floor(this.animationFrame / flashSpeed) % 2 === 0;
                color = isWhite ? '#FFFFFF' : '#6495ED';
            } else {
                // Slow flash (first 6 seconds)
                const flashSpeed = 400; // milliseconds
                const isWhite = Math.floor(this.animationFrame / flashSpeed) % 2 === 0;
                color = isWhite ? '#FFFFFF' : '#6495ED';
            }
        }
        
        // Draw round body
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(px, py + 1, 7, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw head (slightly smaller circle)
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(px, py - 2, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw large round ears
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(px - 4, py - 5, 3, 0, Math.PI * 2);
        this.ctx.arc(px + 4, py - 5, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw inner ear (pink)
        this.ctx.fillStyle = '#FFB8D0';
        this.ctx.beginPath();
        this.ctx.arc(px - 4, py - 5, 1.5, 0, Math.PI * 2);
        this.ctx.arc(px + 4, py - 5, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw cute big eyes
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(px - 2, py - 2, scared ? 2 : 2.5, 0, Math.PI * 2);
        this.ctx.arc(px + 2, py - 2, scared ? 2 : 2.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw pupils (bigger for cuteness)
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        if (scared) {
            // Scared eyes - smaller pupils
            this.ctx.arc(px - 2, py - 2, 0.8, 0, Math.PI * 2);
            this.ctx.arc(px + 2, py - 2, 0.8, 0, Math.PI * 2);
        } else {
            // Normal eyes - big pupils
            this.ctx.arc(px - 2, py - 2, 1.5, 0, Math.PI * 2);
            this.ctx.arc(px + 2, py - 2, 1.5, 0, Math.PI * 2);
        }
        this.ctx.fill();
        
        // Draw eye shine
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(px - 1.5, py - 2.5, 0.5, 0, Math.PI * 2);
        this.ctx.arc(px + 2.5, py - 2.5, 0.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw cute little nose
        this.ctx.fillStyle = '#FFB8D0';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 1, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw whiskers
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        // Left whiskers
        this.ctx.moveTo(px - 1, py);
        this.ctx.lineTo(px - 6, py - 1);
        this.ctx.moveTo(px - 1, py);
        this.ctx.lineTo(px - 6, py);
        this.ctx.moveTo(px - 1, py);
        this.ctx.lineTo(px - 6, py + 1);
        // Right whiskers
        this.ctx.moveTo(px + 1, py);
        this.ctx.lineTo(px + 6, py - 1);
        this.ctx.moveTo(px + 1, py);
        this.ctx.lineTo(px + 6, py);
        this.ctx.moveTo(px + 1, py);
        this.ctx.lineTo(px + 6, py + 1);
        this.ctx.stroke();
        
        // Draw tail
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(px, py + 7);
        this.ctx.quadraticCurveTo(px - 3, py + 10, px - 2, py + 12);
        this.ctx.stroke();
    }
    
    drawPrairieDog(x, y) {
        const radius = 6;
        
        // Body
        this.ctx.fillStyle = '#c9a569';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Head
        this.ctx.fillStyle = '#d4a574';
        this.ctx.beginPath();
        this.ctx.arc(x, y - 3, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ears
        this.ctx.fillStyle = '#c9a569';
        this.ctx.beginPath();
        this.ctx.arc(x - 3, y - 5, 2, 0, Math.PI * 2);
        this.ctx.arc(x + 3, y - 5, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(x - 1.5, y - 3, 1, 0, Math.PI * 2);
        this.ctx.arc(x + 1.5, y - 3, 1, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawCandy(candy) {
        const px = candy.x * this.tileSize + this.tileSize / 2;
        const py = candy.y * this.tileSize + this.tileSize / 2;
        
        // Candy colors
        const colors = ['#FF69B4', '#FF1493', '#FF6347'];
        const color = colors[candy.type];
        
        // Wrapped candy shape
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.ellipse(px, py, 6, 4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Wrapper ends
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(px - 8, py - 3);
        this.ctx.lineTo(px - 10, py - 5);
        this.ctx.moveTo(px - 8, py + 3);
        this.ctx.lineTo(px - 10, py + 5);
        this.ctx.moveTo(px + 8, py - 3);
        this.ctx.lineTo(px + 10, py - 5);
        this.ctx.moveTo(px + 8, py + 3);
        this.ctx.lineTo(px + 10, py + 5);
        this.ctx.stroke();
        
        // Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.beginPath();
        this.ctx.ellipse(px - 1, py - 1, 2, 1, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    window.game = new PacRatGame();
});
