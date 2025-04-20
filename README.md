# 🐍 Snake Game

A classic Snake game implemented in TypeScript with modern features and a responsive design.

![Snake Game Screenshot](![image](https://github.com/user-attachments/assets/ad4ca531-b91a-449d-aa9f-5848fe177332)
)

## Features

- 🎮 Classic Snake gameplay with smooth controls
- 🔄 Snake loops around screen edges
- 🍎 Regular apples provide 1 point and make your snake grow
- 🍏 Special big apples appear every 6 regular apples eaten
- ⏱️ Big apples award 3-6 points but disappear after 12 seconds
- ⚡ Hold arrow keys to speed up the snake
- 🏆 High score leaderboard with persistent storage
- 🌐 Full localization in English and Ukrainian
- 🎯 Adjustable gameplay speed that increases as you score

## Setup & Installation

1. Clone the repository or download the source code
2. Make sure you have a TypeScript compiler installed:
   ```
   npm install -g typescript
   ```
3. Navigate to the project directory and compile:
   ```
   cd /path/to/snake-game
   tsc
   ```
4. Open `index.html` in a web browser

## Controls

- ⬆️ Arrow Up: Move snake up
- ⬇️ Arrow Down: Move snake down
- ⬅️ Arrow Left: Move snake left
- ➡️ Arrow Right: Move snake right
- Hold any arrow key: Speed up the snake
- Space: Restart game after game over

## Gameplay Rules

- The snake moves continuously in the direction set by the player
- Eating an apple increases your score and the length of the snake
- The snake can move through walls, appearing from the opposite side
- The game ends when the snake collides with itself
- Every 6 apples eaten, a big apple appears for 12 seconds
- Eating a big apple awards 3-6 points and corresponding growth
- The speed of the game incrementally increases as you score points

## High Scores

The game keeps track of the top 5 high scores locally in your browser. When you achieve a high score, you'll be prompted to enter your name.

## Language Support

The game supports both English and Ukrainian languages. You can switch between languages using the buttons at the top right of the game screen.

## Credits

Developed as a homework assignment for the University Programming Course
```

Enjoy the game!
