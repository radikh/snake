import { languages, getDefaultLanguage, setLanguagePreference, LanguageKey } from './localization';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = 20;

// Current language
let currentLang = getDefaultLanguage();
let translations = languages[currentLang];

// Initialize localization
function initializeLanguage() {
  // Set active class on the current language button
  document.querySelectorAll('.language-btn').forEach(btn => {
    const langBtn = btn as HTMLButtonElement;
    if (langBtn.dataset.lang === currentLang) {
      langBtn.classList.add('active');
    } else {
      langBtn.classList.remove('active');
    }
  });
  
  // Update page title
  document.title = translations.title;
  
  // Update all i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n') as keyof typeof translations;
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });
}

// Handle language switching
function setupLanguageSwitcher() {
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement;
      const lang = target.dataset.lang as LanguageKey;
      
      if (lang && lang !== currentLang) {
        currentLang = lang;
        translations = languages[currentLang];
        setLanguagePreference(currentLang);
        initializeLanguage();
        
        // Update dynamic content, like high scores
        if (game) {
          game.updateHighScoresDisplay();
        }
      }
    });
  });
}

enum Direction {
  Up,
  Down,
  Left,
  Right
}

class Snake {
  body: { x: number, y: number }[];
  direction: Direction;
  
  constructor() {
    // Initialize with 4 segments in a row, pointing right
    this.body = [
      { x: 10, y: 10 }, // Head
      { x: 9, y: 10 },  // Second segment
      { x: 8, y: 10 },  // Third segment
      { x: 7, y: 10 }   // Fourth segment
    ];
    this.direction = Direction.Right;
  }
  
  move() {
    const head = { ...this.body[0] };
    
    switch(this.direction) {
      case Direction.Up:
        head.y--;
        if (head.y < 0) head.y = tileCount - 1;
        break;
      case Direction.Down:
        head.y++;
        if (head.y >= tileCount) head.y = 0;
        break;
      case Direction.Left:
        head.x--;
        if (head.x < 0) head.x = tileCount - 1;
        break;
      case Direction.Right:
        head.x++;
        if (head.x >= tileCount) head.x = 0;
        break;
    }
    
    this.body.unshift(head);
    
    return false;
  }
  
  grow() {
    // No change needed here
  }
  
  checkCollision(): boolean {
    const head = this.body[0];
    
    // Remove boundary collision check since snake now loops
    // Only check for collision with self
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }
    
    return false;
  }
  
  draw() {
    if (!ctx) return;
    

    this.body.forEach((segment, index) => {
    
      if (index === 0) {
        ctx.fillStyle = "#228B22";
      } else {
        ctx.fillStyle = "#32CD32";
      }
      
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 2,
        gridSize - 2
      );
    });
  }
}

class Food {
  x: number;
  y: number;
  
  constructor() {
    this.x = 0;
    this.y = 0;
    this.randomize();
  }
  
  randomize() {
    this.x = Math.floor(Math.random() * tileCount);
    this.y = Math.floor(Math.random() * tileCount);
  }
  
  draw() {
    if (!ctx) return;
    
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(
      this.x * gridSize,
      this.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }
}

// Add Big Food class for special bonus food
class BigFood extends Food {
  isActive: boolean;
  timer: number;
  points: number;
  size: number;
  
  constructor() {
    super();
    this.isActive = false;
    this.timer = 0;
    this.points = 0;
    this.size = 2; // Size multiplier (2x2 grid)
  }
  
  activate() {
    this.isActive = true;
    this.randomize();
    this.points = 3 + Math.floor(Math.random() * 4); // 3 to 6 points
    this.timer = 12000; // 12 seconds in milliseconds
  }
  
  deactivate() {
    this.isActive = false;
    this.timer = 0;
  }
  
  update(deltaTime: number) {
    if (!this.isActive) return;
    
    this.timer -= deltaTime;
    if (this.timer <= 0) {
      this.deactivate();
    }
  }
  
  randomize() {
    // Ensure big food doesn't exceed grid boundaries
    this.x = Math.floor(Math.random() * (tileCount - this.size + 1));
    this.y = Math.floor(Math.random() * (tileCount - this.size + 1));
  }
  
  draw() {
    if (!ctx || !this.isActive) return;
    
    // Draw a bigger apple with a different shade of red
    ctx.fillStyle = "#FF3333";
    ctx.fillRect(
      this.x * gridSize,
      this.y * gridSize,
      this.size * gridSize - 2,
      this.size * gridSize - 2
    );
    
    // Add a highlight effect
    ctx.fillStyle = "#FF6666";
    ctx.fillRect(
      this.x * gridSize + 5,
      this.y * gridSize + 5,
      10,
      10
    );
    
    // Display the number of points
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `${this.points}`,
      this.x * gridSize + (this.size * gridSize / 2),
      this.y * gridSize + (this.size * gridSize / 2) + 5
    );
  }
  
  checkCollision(x: number, y: number): boolean {
    if (!this.isActive) return false;
    
    // Check if head is anywhere within the big food area
    return (x >= this.x && x < this.x + this.size &&
            y >= this.y && y < this.y + this.size);
  }
}

// Add an interface for high scores
interface HighScore {
  name: string;
  score: number;
  date: string;
}

class Game {
  snake: Snake;
  food: Food;
  bigFood: BigFood;
  score: number;
  gameOver: boolean;
  speed: number;
  normalSpeed: number;
  fastSpeed: number;
  longPressTimer: number | null;
  minSpeed: number;
  highScores: HighScore[];
  isNewHighScore: boolean;
  playerName: string;
  isEnteringName: boolean;
  foodEatenCount: number;
  lastUpdateTime: number;
  
  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.bigFood = new BigFood();
    this.score = 0;
    this.gameOver = false;
    this.normalSpeed = 200; // Normal speed (milliseconds between updates)
    this.fastSpeed = 120;   // Fast speed when long pressing
    this.speed = this.normalSpeed;
    this.longPressTimer = null;
    this.minSpeed = 50;     // Minimum speed limit to prevent game from becoming too fast
    this.highScores = this.loadHighScores();
    this.isNewHighScore = false;
    this.playerName = 'Player 1';
    this.isEnteringName = false;
    this.foodEatenCount = 0; // Track number of regular food eaten
    this.lastUpdateTime = Date.now();
    this.setupEventListeners();
    this.updateHighScoresDisplay();
  }
  
  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      const { direction } = this.snake;
      let newDirection: Direction | null = null;
      
      switch(e.key) {
        case 'ArrowUp':
          if (direction !== Direction.Down) {
            newDirection = Direction.Up;
          }
          break;
        case 'ArrowDown':
          if (direction !== Direction.Up) {
            newDirection = Direction.Down;
          }
          break;
        case 'ArrowLeft':
          if (direction !== Direction.Right) {
            newDirection = Direction.Left;
          }
          break;
        case 'ArrowRight':
          if (direction !== Direction.Left) {
            newDirection = Direction.Right;
          }
          break;
      }
      
      // If direction changed and no timer is running, start the long press timer
      if (newDirection !== null && this.longPressTimer === null) {
        this.snake.direction = newDirection;
        
        this.longPressTimer = window.setTimeout(() => {
          this.speed = this.fastSpeed; // Speed up after long press
        }, 200); // 300ms threshold for "long press"
      }
    });
    
    document.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Clear the timer if it exists
        if (this.longPressTimer !== null) {
          clearTimeout(this.longPressTimer);
          this.longPressTimer = null;
        }
        // Reset speed to normal
        this.speed = this.normalSpeed;
      }
    });

    // Add key listener for name entry
    document.addEventListener('keydown', (e) => {
      if (this.isEnteringName) {
        if (e.key === 'Enter') {
          this.saveHighScore();
        } else if (e.key === 'Backspace') {
          this.playerName = this.playerName.slice(0, -1);
        } else if (e.key.length === 1 && this.playerName.length < 10) {
          this.playerName += e.key;
        }
        e.preventDefault();
      }
    });
  }
  
  update() {
    if (this.gameOver) return;
    
    // Calculate delta time for time-based updates
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;
    
    // Update big food timer if active
    this.bigFood.update(deltaTime);
    
    this.snake.move();
    
    const head = this.snake.body[0];
    
    // Check for collision with regular food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.foodEatenCount++;
      
      // Every 6 regular food eaten, activate big food
      if (this.foodEatenCount >= 6) {
        this.foodEatenCount = 0;
        this.bigFood.activate();
      }
      
      // Speed up the game every fruit
      if (this.score % 1 === 0) {
        // Decrease both speeds by 10ms (making the game faster)
        this.normalSpeed = Math.max(this.normalSpeed - 10, this.minSpeed);
        this.fastSpeed = Math.max(this.fastSpeed - 10, this.minSpeed / 2); 
        
        // Apply the speed change immediately
        if (this.speed === this.fastSpeed + 10) { // If was at fast speed
          this.speed = this.fastSpeed;
        } else { // If was at normal speed
          this.speed = this.normalSpeed;
        }
      }
      
      this.food.randomize();
      this.snake.grow();
    } 
    // Check for collision with big food
    else if (this.bigFood.isActive && this.bigFood.checkCollision(head.x, head.y)) {
      // Add big food's points to score
      this.score += this.bigFood.points;
      
      // Deactivate the big food
      this.bigFood.deactivate();
      
      // Grow the snake
      for (let i = 0; i < this.bigFood.points; i++) {
        this.snake.grow();
      }
    }
    else {
      this.snake.body.pop();
    }
    
    if (this.snake.checkCollision()) {
      this.gameOver = true;
      this.checkHighScore();
    }
  }

  loadHighScores(): HighScore[] {
    const highScoresJson = localStorage.getItem('snakeHighScores');
    if (highScoresJson) {
      return JSON.parse(highScoresJson);
    } else {
      return [];
    }
  }
  
  saveHighScores() {
    localStorage.setItem('snakeHighScores', JSON.stringify(this.highScores));
  }
  
  checkHighScore() {
    if (this.score === 0) return;
    
    // If we have fewer than 5 scores, or the current score is higher than the lowest high score
    if (this.highScores.length < 5 || this.score > this.highScores[this.highScores.length - 1].score) {
      this.isNewHighScore = true;
      this.isEnteringName = true;
    }
  }
  
  saveHighScore() {
    const newScore: HighScore = {
      name: this.playerName || 'Anonymous',
      score: this.score,
      date: new Date().toLocaleDateString()
    };
    
    this.highScores.push(newScore);
    // Sort high scores (highest first)
    this.highScores.sort((a, b) => b.score - a.score);
    // Keep only the top 5
    this.highScores = this.highScores.slice(0, 5);
    
    // Save to localStorage
    this.saveHighScores();
    this.isEnteringName = false;
    
    // Update the sidebar display
    this.updateHighScoresDisplay();
  }
  
  updateHighScoresDisplay() {
    const highScoresList = document.getElementById('high-scores-list');
    if (!highScoresList) return;
    
    // Clear existing content
    highScoresList.innerHTML = '';
    
    if (this.highScores.length === 0) {
      const noScores = document.createElement('div');
      noScores.className = 'no-scores';
      noScores.textContent = translations.noScoresYet;
      highScoresList.appendChild(noScores);
    } else {
      // Add each high score, limited to 5
      const displayScores = this.highScores.slice(0, 5);
      displayScores.forEach((score, index) => {
        const entry = document.createElement('div');
        entry.className = 'score-entry';
        
        const rankAndName = document.createElement('div');
        rankAndName.innerHTML = `${index + 1}. <span class="name">${score.name}</span>`;
        
        const scoreElement = document.createElement('span');
        scoreElement.className = 'score';
        scoreElement.textContent = `${score.score}`;
        
        const dateElement = document.createElement('div');
        dateElement.className = 'date';
        dateElement.textContent = score.date;
        
        entry.appendChild(rankAndName);
        entry.appendChild(scoreElement);
        entry.appendChild(dateElement);
        
        highScoresList.appendChild(entry);
      });
    }
  }
  
  drawHighScores() {
    if (!ctx) return;
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    const centerX = canvas.width / 2;
    let centerY = canvas.height / 2 - 60;
    
    ctx.fillText("HIGH SCORES", centerX, centerY);
    centerY += 30;
    
    ctx.font = "16px Arial";
    
    if (this.highScores.length === 0) {
      ctx.fillText("No high scores yet!", centerX, centerY + 20);
    } else {
      this.highScores.forEach((highScore, index) => {
        ctx.fillText(`${index + 1}. ${highScore.name}: ${highScore.score} (${highScore.date})`, centerX, centerY + index * 25);
      });
    }
  }
  
  draw() {
    if (!ctx) return;
    
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // During gameplay
    if (!this.gameOver) {
      this.snake.draw();
      this.food.draw();
      
      // Draw big food if active
      this.bigFood.draw();
      
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`${translations.score}: ${this.score}`, 10, 30);
      
      // If big food is active, show its timer
      if (this.bigFood.isActive) {
        const secondsLeft = Math.ceil(this.bigFood.timer / 1000);
        ctx.fillStyle = "#FF6666";
        ctx.textAlign = "right";
        ctx.fillText(`${translations.bigAppleTimer}: ${secondsLeft}s`, canvas.width - 10, 30);
      }
    } 
    // Game over screen
    else {
      ctx.fillStyle = "#ffffff";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 5;
      
      ctx.fillText(translations.gameOver, centerX, centerY);
      ctx.font = "20px Arial";
      ctx.fillText(`${translations.finalScore}: ${this.score}`, centerX, centerY + 20);
      
      // If it's a new high score and player is entering name
      if (this.isEnteringName) {
        ctx.fillText(translations.newHighScore, centerX, centerY + 100);
        ctx.fillText(this.playerName + "_", centerX, centerY + 140);
      } 
      // If name was entered or it's not a high score
      else {
        // Show high scores with even more spacing
        ctx.font = "24px Arial";
        const highScoresY = centerY + 80;
        ctx.fillText(translations.highScores, centerX, highScoresY);
        
        ctx.font = "16px Arial";
        if (this.highScores.length === 0) {
          ctx.fillText(translations.noHighScores, centerX, highScoresY + 40);
        } else {
          // Only display up to 5 high scores
          const displayScores = this.highScores.slice(0, 5);
          displayScores.forEach((highScore, index) => {
            ctx.fillText(`${index + 1}. ${highScore.name}: ${highScore.score} (${highScore.date})`, 
                         centerX, highScoresY + 40 + (index * 35));
          });
        }
        
        // Restart prompt at bottom with fixed position
        ctx.fillStyle = "#90EE90";
        ctx.font = "18px Arial";
        ctx.fillText(translations.pressSpace, centerX, canvas.height - 20);
      }
    }
  }
}

let game = new Game();

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && game.gameOver) {
    game = new Game();
  }
});

function gameLoop() {
  game.update();
  game.draw();
  setTimeout(gameLoop, game.speed); // Use the current game speed
}

window.onload = () => {
  initializeLanguage();
  setupLanguageSwitcher();
  gameLoop();
  
  // Check for existing high scores to show on initial load
  game.updateHighScoresDisplay();
};
