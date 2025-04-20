const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = 20;

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

class Game {
  snake: Snake;
  food: Food;
  score: number;
  gameOver: boolean;
  speed: number;
  normalSpeed: number;
  fastSpeed: number;
  longPressTimer: number | null;
  minSpeed: number;
  
  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
    this.gameOver = false;
    this.normalSpeed = 300; // Normal speed (milliseconds between updates)
    this.fastSpeed = 150;   // Fast speed when long pressing
    this.speed = this.normalSpeed;
    this.longPressTimer = null;
    this.minSpeed = 50;     // Minimum speed limit to prevent game from becoming too fast
    this.setupEventListeners();
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
  }
  
  update() {
    if (this.gameOver) return;
    
    this.snake.move();
    
    const head = this.snake.body[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      
      // Speed up the game every 10 fruits
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
    } else {
      this.snake.body.pop();
    }
    
    if (this.snake.checkCollision()) {
      this.gameOver = true;
    }
  }
  
  draw() {
    if (!ctx) return;
    

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    

    this.snake.draw();
    this.food.draw();
    

    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${this.score}`, 10, 30);
    

    if (this.gameOver) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.fillText("Game Over!", centerX, centerY);
      ctx.font = "20px Arial";
      ctx.fillText(`Final Score: ${this.score}`, centerX, centerY + 30);
      ctx.fillText("Press Space to Restart", centerX, centerY + 60);
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
  gameLoop();
};
