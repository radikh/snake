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
    this.body = [
      { x: 10, y: 10 }
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
    

    const head = this.snake.body[0];
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
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
  setTimeout(gameLoop, 100);
}

window.onload = () => {
  gameLoop();
};
