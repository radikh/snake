export type LanguageKey = 'en' | 'uk';

interface Translations {
  // Game UI
  title: string;
  score: string;
  bigAppleTimer: string;
  gameOver: string;
  finalScore: string;
  newHighScore: string;
  enterName: string;
  highScores: string;
  noHighScores: string;
  pressSpace: string;
  
  // Instructions
  instructions: string;
  controls: string;
  moveUp: string;
  moveDown: string;
  moveLeft: string;
  moveRight: string;
  holdToSpeed: string;
  pressToRestart: string;
  gameRules: string;
  regularApple: string;
  bigApple: string;
  bigAppleTimeout: string;
  wallPass: string;
  collision: string;
  
  // High Scores
  noScoresYet: string;
}

export const languages: Record<LanguageKey, Translations> = {
  uk: {
    // Game UI
    title: 'Гра "Змійка"',
    score: 'Рахунок',
    bigAppleTimer: 'Велике яблуко',
    gameOver: 'Гра закінчена!',
    finalScore: 'Фінальний рахунок',
    newHighScore: 'Новий рекорд! Введіть ваше ім\'я:',
    enterName: 'Введіть ім\'я',
    highScores: 'РЕКОРДИ',
    noHighScores: 'Поки що немає рекордів!',
    pressSpace: 'Натисніть пробіл щоб почати знову',
    
    // Instructions
    instructions: 'Інструкція до гри "Змійка"',
    controls: 'Керування:',
    moveUp: 'Рух вгору (стрілка вгору)',
    moveDown: 'Рух вниз (стрілка вниз)',
    moveLeft: 'Рух вліво (стрілка вліво)',
    moveRight: 'Рух вправо (стрілка вправо)',
    holdToSpeed: 'Утримуйте стрілку для прискорення',
    pressToRestart: 'Натисніть пробіл для перезапуску після закінчення гри',
    gameRules: 'Правила гри:',
    regularApple: 'Звичайне яблуко: +1 очко та зростання',
    bigApple: 'Велике яблуко (з\'являється кожні 6 звичайних яблук): +3-6 очок',
    bigAppleTimeout: 'Велике яблуко зникає через 12 секунд',
    wallPass: 'Змійка може проходити крізь стіни і з\'являтися з іншого боку',
    collision: 'Гра закінчується, якщо змійка натикається на себе',
    
    // High Scores
    noScoresYet: 'Поки що немає результатів. Почніть грати!'
  },
  en: {
    // Game UI
    title: 'Snake Game',
    score: 'Score',
    bigAppleTimer: 'Big Apple',
    gameOver: 'Game Over!',
    finalScore: 'Final Score',
    newHighScore: 'New High Score! Enter your name:',
    enterName: 'Enter name',
    highScores: 'HIGH SCORES',
    noHighScores: 'No high scores yet!',
    pressSpace: 'Press Space to Restart',
    
    // Instructions
    instructions: 'Snake Game Instructions',
    controls: 'Controls:',
    moveUp: 'Move Up (Arrow Up)',
    moveDown: 'Move Down (Arrow Down)',
    moveLeft: 'Move Left (Arrow Left)',
    moveRight: 'Move Right (Arrow Right)',
    holdToSpeed: 'Hold any arrow key to speed up',
    pressToRestart: 'Press Space to restart after game over',
    gameRules: 'Game Rules:',
    regularApple: 'Regular apple: +1 point and grow',
    bigApple: 'Big apple (appears every 6 regular apples): +3-6 points',
    bigAppleTimeout: 'Big apple disappears after 12 seconds',
    wallPass: 'Snake can go through walls and appear on the other side',
    collision: 'Game ends if snake hits itself',
    
    // High Scores
    noScoresYet: 'No scores yet. Start playing!'
  }
};

export function getDefaultLanguage(): LanguageKey {
  const savedLang = localStorage.getItem('snakeGameLanguage') as LanguageKey | null;
  return savedLang || 'uk'; // Default to Ukrainian
}

export function setLanguagePreference(lang: LanguageKey): void {
  localStorage.setItem('snakeGameLanguage', lang);
}
