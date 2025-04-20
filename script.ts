// Snake Game in TypeScript

// Game canvas setup
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = 20;

// Direction constants
enum Direction {
  Up,
  Down,
  Left,
  Right
}

// Snake class
class Snake {
  body: { x: number, y: number }[];
  direction: Direction;
  
  constructor() {
    this.body = [
      { x: 10, y: 10 } // Starting position
    ];
    this.direction = Direction.Right;
  }
  
  move() {
    const head = { ...this.body[0] };
    
    // Update head position based on direction
    switch(this.direction) {
      case Direction.Up:
        head.y--;
        break;
      case Direction.Down:
        head.y++;
        break;
      case Direction.Left:
        head.x--;
        break;
      case Direction.Right:
        head.x++;
        break;
    }
    
    // Add new head
    this.body.unshift(head);
    
    // Return true if snake ate food (to be checked by the game)
    return false;
  }
  
  grow() {
    // Don't remove tail piece when growing
  }
  
  checkCollision(): boolean {
    const head = this.body[0];
    
    // Check if hit wall
    if (head.x < 0 || head.x >= tileCount || 
        head.y < 0 || head.y >= tileCount) {
      return true;
    }
    
    // Check if hit self (start from index 1 to skip head)
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }
    
    return false;
  }
  
  draw() {
    if (!ctx) return;
    
    // Draw each segment of the snake
    this.body.forEach((segment, index) => {
      // Make the head a different color
      if (index === 0) {
        ctx.fillStyle = "#228B22"; // Forest green for head
      } else {
        ctx.fillStyle = "#32CD32"; // Lime green for body
      }
      
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize - 2, // Slight gap between segments
        gridSize - 2
      );
    });
  }
}

// Food class
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
    
    ctx.fillStyle = "#FF0000"; // Red
    ctx.fillRect(
      this.x * gridSize,
      this.y * gridSize,
      gridSize - 2,
      gridSize - 2
    );
  }
}

// Game class
class Game {
  snake: Snake;
  food: Food;
  score: number;
  gameOver: boolean;
  
  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
    this.gameOver = false;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      const { direction } = this.snake;
      
      // Prevent moving in the opposite direction
      switch(e.key) {
        case 'ArrowUp':
          if (direction !== Direction.Down) {
            this.snake.direction = Direction.Up;
          }
          break;
        case 'ArrowDown':
          if (direction !== Direction.Up) {
            this.snake.direction = Direction.Down;
          }
          break;
        case 'ArrowLeft':
          if (direction !== Direction.Right) {
            this.snake.direction = Direction.Left;
          }
          break;
        case 'ArrowRight':
          if (direction !== Direction.Left) {
            this.snake.direction = Direction.Right;
          }
          break;
      }
    });
  }
  
  update() {
    if (this.gameOver) return;
    
    this.snake.move();
    
    // Check if snake ate food
    const head = this.snake.body[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.food.randomize();
      this.snake.grow();
    } else {
      // Remove tail if no food eaten
      this.snake.body.pop();
    }
    
    // Check for collisions
    if (this.snake.checkCollision()) {
      this.gameOver = true;
    }
  }
  
  draw() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    this.snake.draw();
    this.food.draw();
    
    // Draw score
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${this.score}`, 10, 30);
    
    // Draw game over message
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

// Game initialization and game loop
let game = new Game();

// Restart game when Space is pressed
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && game.gameOver) {
    game = new Game();
  }
});

// Game loop
function gameLoop() {
  game.update();
  game.draw();
  setTimeout(gameLoop, 100); // Adjust for game speed
}

// Start the game
window.onload = () => {
  gameLoop();
};
