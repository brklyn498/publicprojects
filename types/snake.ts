export interface Position {
    x: number;
    y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameMode = 'classic' | 'alternative';

export interface SnakeState {
    snake: Position[];
    food: Position;
    direction: Direction;
    nextDirection: Direction;
    score: number;
    highScore: number;
    gameStatus: GameStatus;
    difficulty: Difficulty;
    gameSpeed: number;
    gameMode: GameMode;
    level: number;
    obstacles: Position[];
    starFood: Position | null;
    gridSize: number;
    foodEaten: number;  // Track food eaten in current level
    levelCompleting: boolean;  // Flag for level transition animation
}

// Helper to calculate food required for a level
export const getFoodRequirement = (level: number): number => {
    return level + 1; // Level 1 = 2, Level 2 = 3, etc.
};

export interface SnakeStore extends SnakeState {
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    moveSnake: () => void;
    changeDirection: (dir: Direction) => void;
    eatFood: () => void;
    checkCollision: () => boolean;
    gameOver: () => void;
    setDifficulty: (level: Difficulty) => void;
    resetGame: () => void;
    spawnFood: () => void;
    setGameMode: (mode: GameMode) => void;
    spawnStarFood: () => void;
    eatStarFood: () => void;
    completeLevel: () => void;
}
