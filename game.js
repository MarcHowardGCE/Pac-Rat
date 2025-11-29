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
        
        // Set canvas size
        this.canvas.width = this.gridWidth * this.tileSize;
        this.canvas.height = this.gridHeight * this.tileSize;
        
        // Maze layout (0 = path, 1 = wall, 2 = dot, 3 = prairie dog power-up, 4 = candy)
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
            powerTimer: 0
        };
        
        // Rats (Enemies)
        this.rats = [
            { x: 12, y: 14, color: '#FF0000', startX: 12, startY: 14, direction: { x: 1, y: 0 }, mode: 'chase', scatterTarget: { x: 25, y: 1 } },
            { x: 14, y: 14, color: '#FFB8FF', startX: 14, startY: 14, direction: { x: 0, y: -1 }, mode: 'chase', scatterTarget: { x: 2, y: 1 } },
            { x: 13, y: 14, color: '#00FFFF', startX: 13, startY: 14, direction: { x: -1, y: 0 }, mode: 'chase', scatterTarget: { x: 25, y: 29 } },
            { x: 15, y: 14, color: '#FFB852', startX: 15, startY: 14, direction: { x: 0, y: 1 }, mode: 'chase', scatterTarget: { x: 2, y: 29 } }
        ];
        
        // Candy bonus items
        this.candies = [];
        this.candyTimer = 0;
        
        // Animation
        this.animationFrame = 0;
        this.lastTime = 0;
        
        // Input handling
        this.keys = {};
        this.setupInput();
        
        // UI elements
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.hud = document.getElementById('hud');
        this.startButton = document.getElementById('start-button');
        this.restartButton = document.getElementById('restart-button');
        
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        // Update high score display
        document.getElementById('high-score').textContent = this.highScore;
        
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
    }
    
    startGame() {
        this.state = 'playing';
        this.startScreen.classList.add('hidden');
        this.hud.classList.remove('hidden');
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.resetLevel();
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
        
        // Update player
        this.updatePlayer();
        
        // Update rats
        this.rats.forEach(rat => this.updateRat(rat));
        
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
        // Try to change direction
        const nextX = Math.round(this.player.x + this.player.nextDirection.x * this.player.speed);
        const nextY = Math.round(this.player.y + this.player.nextDirection.y * this.player.speed);
        
        if (this.canMove(nextX, nextY)) {
            this.player.direction = { ...this.player.nextDirection };
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
        }
        
        // Animate mouth
        this.player.mouthAngle = Math.abs(Math.sin(this.animationFrame / 100) * 0.4);
        
        // Collect items
        const gridX = Math.round(this.player.x);
        const gridY = Math.round(this.player.y);
        
        if (this.maze[gridY] && this.maze[gridY][gridX] === 2) {
            this.maze[gridY][gridX] = 0;
            this.score += 10;
            this.updateUI();
        } else if (this.maze[gridY] && this.maze[gridY][gridX] === 3) {
            this.maze[gridY][gridX] = 0;
            this.score += 50;
            this.player.powered = true;
            this.player.powerTimer = 8000; // 8 seconds
            this.updateUI();
        }
        
        // Collect candy
        this.candies.forEach((candy, index) => {
            const distance = Math.sqrt(Math.pow(candy.x - gridX, 2) + Math.pow(candy.y - gridY, 2));
            if (distance < 1) {
                this.score += 100;
                this.candies.splice(index, 1);
                this.updateUI();
            }
        });
    }
    
    updateRat(rat) {
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
        if (y < 0 || y >= this.gridHeight || (x < 0 && y !== 14) || (x >= this.gridWidth && y !== 14)) {
            return false;
        }
        
        // Allow tunnel movement
        if (y === 14 && (x < 0 || x >= this.gridWidth)) {
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
                    this.updateUI();
                } else {
                    // Lose a life
                    this.lives--;
                    this.updateUI();
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    } else {
                        // Reset positions
                        this.player.x = 14;
                        this.player.y = 23;
                        this.player.direction = { x: 0, y: 0 };
                        this.player.nextDirection = { x: 0, y: 0 };
                        
                        this.rats.forEach((r, index) => {
                            r.x = r.startX;
                            r.y = r.startY;
                        });
                    }
                }
            }
        });
    }
    
    spawnCandy() {
        // Find empty spots to spawn candy
        const emptySpots = [];
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.maze[y][x] === 0) {
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
        const radius = this.tileSize / 2 - 2;
        
        // Determine rotation based on direction
        let rotation = 0;
        if (this.player.direction.x > 0) rotation = 0;
        else if (this.player.direction.x < 0) rotation = Math.PI;
        else if (this.player.direction.y > 0) rotation = Math.PI / 2;
        else if (this.player.direction.y < 0) rotation = -Math.PI / 2;
        
        this.ctx.save();
        this.ctx.translate(px, py);
        this.ctx.rotate(rotation);
        
        // Draw ferret body
        this.ctx.fillStyle = this.player.powered ? '#ffeb3b' : '#d4a574';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, this.player.mouthAngle, Math.PI * 2 - this.player.mouthAngle);
        this.ctx.lineTo(0, 0);
        this.ctx.fill();
        
        // Draw eye
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(radius / 3, -radius / 3, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw nose
        this.ctx.fillStyle = '#5d4037';
        this.ctx.beginPath();
        this.ctx.arc(radius - 2, 0, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawRat(rat) {
        const px = rat.x * this.tileSize + this.tileSize / 2;
        const py = rat.y * this.tileSize + this.tileSize / 2;
        const radius = this.tileSize / 2 - 2;
        
        // If powered, rats turn blue
        const color = this.player.powered ? '#0000FF' : rat.color;
        
        // Body
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(px, py, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#FFF';
        const eyeOffset = radius / 3;
        this.ctx.beginPath();
        this.ctx.arc(px - eyeOffset, py - eyeOffset, 3, 0, Math.PI * 2);
        this.ctx.arc(px + eyeOffset, py - eyeOffset, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Pupils
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(px - eyeOffset, py - eyeOffset, 1.5, 0, Math.PI * 2);
        this.ctx.arc(px + eyeOffset, py - eyeOffset, 1.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ears
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.ellipse(px - radius, py - radius, 4, 6, -Math.PI / 4, 0, Math.PI * 2);
        this.ctx.ellipse(px + radius, py - radius, 4, 6, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
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
    new PacRatGame();
});
