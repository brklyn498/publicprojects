import { create } from 'zustand';
import { SnakeStore, Position, Direction, Difficulty, GameMode } from '@/types/snake';

const CLASSIC_GRID_SIZE = 20;
const MIN_GRID_SIZE = 10;
const MAX_GRID_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;

// Difficulty speeds in milliseconds
const SPEEDS = {
    easy: 200,
    medium: 120,
    hard: 60,
};

// Calculate grid size based on level (Alternative mode)
const getGridSize = (level: number): number => {
    if (level <= 3) return 10;
    if (level <= 6) return 13;
    if (level <= 9) return 16;
    return 20; // Level 10+
};

// Calculate obstacle count based on level - scales with grid size
const getObstacleCount = (level: number, gridSize: number): number => {
    // Scale obstacles with grid size: ~8-12% of total cells
    const gridCells = gridSize * gridSize;
    const basePercentage = 0.08 + (level * 0.004); // Increases from 8% to 12%+ with level
    const obstacleCount = Math.floor(gridCells * basePercentage);
    const maxObstacles = Math.floor(gridCells * 0.20); // Cap at 20% of grid
    return Math.min(obstacleCount, maxObstacles);
};

// Check if a position is safe (has escape routes, not trapped)
const isSafePosition = (pos: Position, exclude: Position[], gridSize: number): boolean => {
    // Check if position is already occupied
    if (exclude.some(p => p.x === pos.x && p.y === pos.y)) {
        return false;
    }

    // Count available adjacent cells (not walls, not obstacles)
    let freeAdjacent = 0;
    const directions = [
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 },  // Right
    ];

    for (const dir of directions) {
        const newX = pos.x + dir.x;
        const newY = pos.y + dir.y;

        // Check if within bounds
        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
            // Check if not occupied
            if (!exclude.some(p => p.x === newX && p.y === newY)) {
                freeAdjacent++;
            }
        }
    }

    // Need at least 2 free adjacent cells to have an escape route
    return freeAdjacent >= 2;
};

// Helper function to generate random position
const getRandomPosition = (exclude: Position[] = [], gridSize: number = CLASSIC_GRID_SIZE): Position => {
    let position: Position;
    let isValid = false;

    while (!isValid) {
        position = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
        };

        isValid = !exclude.some(pos => pos.x === position.x && pos.y === position.y);
    }

    return position!;
};

// Helper function to generate safe food position (avoids traps)
const getSafeRandomPosition = (exclude: Position[], gridSize: number, maxAttempts: number = 100): Position => {
    let attempts = 0;
    let position: Position;

    while (attempts < maxAttempts) {
        position = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
        };

        if (isSafePosition(position, exclude, gridSize)) {
            return position;
        }
        attempts++;
    }

    // Fallback to regular random position if can't find safe one
    return getRandomPosition(exclude, gridSize);
};

// Generate obstacles for Alternative mode
const generateObstacles = (
    count: number,
    gridSize: number,
    snake: Position[],
    food: Position,
    starFood: Position | null
): Position[] => {
    const obstacles: Position[] = [];
    const exclude = [...snake, food];
    if (starFood) exclude.push(starFood);

    // Also exclude the snake's initial path (UP direction for at least 5 cells)
    // This prevents instant death when game starts
    const snakeHead = snake[0];
    for (let i = 1; i <= 5; i++) {
        const pathCell = { x: snakeHead.x, y: snakeHead.y - i };
        // Only exclude if within bounds
        if (pathCell.y >= 0) {
            exclude.push(pathCell);
        }
    }

    // Also exclude cells directly adjacent to snake head for safety
    const adjacentOffsets = [
        { x: -1, y: 0 }, { x: 1, y: 0 },  // Left, Right
        { x: 0, y: -1 }, { x: 0, y: 1 },  // Up, Down
    ];
    for (const offset of adjacentOffsets) {
        const adjCell = { x: snakeHead.x + offset.x, y: snakeHead.y + offset.y };
        if (adjCell.x >= 0 && adjCell.x < gridSize && adjCell.y >= 0 && adjCell.y < gridSize) {
            exclude.push(adjCell);
        }
    }

    while (obstacles.length < count) {
        const pos = getRandomPosition(exclude, gridSize);
        obstacles.push(pos);
        exclude.push(pos);
    }

    return obstacles;
};

// Load high score from localStorage
const loadHighScore = (): number => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('snake_high_score');
    return saved ? parseInt(saved, 10) : 0;
};

// Initial state - start snake lower so it has room to move UP
const getInitialSnake = (gridSize: number): Position[] => {
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);

    // Start at center + offset to give room above for initial upward movement
    const offset = Math.floor(gridSize / 4);
    return Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
        x: centerX,
        y: centerY + offset + i,
    }));
};

export const useSnakeStore = create<SnakeStore>((set, get) => ({
    snake: getInitialSnake(CLASSIC_GRID_SIZE),
    food: getRandomPosition(getInitialSnake(CLASSIC_GRID_SIZE), CLASSIC_GRID_SIZE),
    direction: 'UP',
    nextDirection: 'UP',
    score: 0,
    highScore: loadHighScore(),
    gameStatus: 'idle',
    difficulty: 'medium',
    gameSpeed: SPEEDS.medium,
    gameMode: 'classic',
    level: 1,
    obstacles: [],
    starFood: null,
    gridSize: CLASSIC_GRID_SIZE,
    foodEaten: 0,
    levelCompleting: false,

    setGameMode: (mode: GameMode) => {
        const gridSize = mode === 'classic' ? CLASSIC_GRID_SIZE : MIN_GRID_SIZE;
        const initialSnake = getInitialSnake(gridSize);
        const initialFood = getRandomPosition(initialSnake, gridSize);

        if (mode === 'alternative') {
            const obstacles = generateObstacles(
                getObstacleCount(1, gridSize),
                gridSize,
                initialSnake,
                initialFood,
                null
            );
            // No star food at start - must eat regular food first

            set({
                gameMode: mode,
                gridSize,
                level: 1,
                obstacles,
                starFood: null,
                snake: initialSnake,
                food: initialFood,
                foodEaten: 0,
            });
        } else {
            set({
                gameMode: mode,
                gridSize,
                level: 1,
                obstacles: [],
                starFood: null,
                snake: initialSnake,
                food: initialFood,
                foodEaten: 0,
            });
        }
    },

    setDifficulty: (level: Difficulty) => {
        set({
            difficulty: level,
            gameSpeed: SPEEDS[level],
        });
    },

    spawnFood: () => {
        const { snake, gridSize, obstacles, starFood, gameMode } = get();
        const exclude = [...snake, ...obstacles];
        if (starFood) exclude.push(starFood);
        // Use safe spawning for Alternative mode to avoid traps
        const newFood = gameMode === 'alternative'
            ? getSafeRandomPosition(exclude, gridSize)
            : getRandomPosition(exclude, gridSize);
        set({ food: newFood });
    },

    spawnStarFood: () => {
        const { snake, food, obstacles, gridSize } = get();
        const exclude = [...snake, food, ...obstacles];
        // Star food should also spawn in safe positions
        const newStarFood = getSafeRandomPosition(exclude, gridSize);
        set({ starFood: newStarFood });
    },

    completeLevel: () => {
        const { level, gameMode, difficulty, score } = get();
        if (gameMode !== 'alternative') return;

        const newLevel = level + 1;
        const newGridSize = getGridSize(newLevel);
        const initialSnake = getInitialSnake(newGridSize);
        const initialFood = getRandomPosition(initialSnake, newGridSize);

        // Generate new obstacles for the level
        const newObstacles = generateObstacles(
            getObstacleCount(newLevel, newGridSize),
            newGridSize,
            initialSnake,
            initialFood,
            null
        );

        // No star food at start of new level - must eat food first
        // Level bonus
        const levelBonus = newLevel * 10;
        const newScore = score + levelBonus;

        set({
            level: newLevel,
            gridSize: newGridSize,
            snake: initialSnake,
            food: initialFood,
            obstacles: newObstacles,
            starFood: null,
            score: newScore,
            direction: 'UP',
            nextDirection: 'UP',
            gameSpeed: SPEEDS[difficulty],
            foodEaten: 0,
            levelCompleting: false,  // Reset flag after transition
        });
    },

    startGame: () => {
        const { difficulty, gameMode } = get();
        const gridSize = gameMode === 'classic' ? CLASSIC_GRID_SIZE : getGridSize(1);
        const initialSnake = getInitialSnake(gridSize);
        const initialFood = getRandomPosition(initialSnake, gridSize);

        if (gameMode === 'alternative') {
            const obstacles = generateObstacles(
                getObstacleCount(1, gridSize),
                gridSize,
                initialSnake,
                initialFood,
                null
            );
            // No star food at start - must eat food first

            set({
                snake: initialSnake,
                food: initialFood,
                obstacles,
                starFood: null,
                direction: 'UP',
                nextDirection: 'UP',
                score: 0,
                level: 1,
                gridSize,
                gameStatus: 'playing',
                gameSpeed: SPEEDS[difficulty],
                foodEaten: 0,
            });
        } else {
            set({
                snake: initialSnake,
                food: initialFood,
                obstacles: [],
                starFood: null,
                direction: 'UP',
                nextDirection: 'UP',
                score: 0,
                level: 1,
                gridSize,
                gameStatus: 'playing',
                gameSpeed: SPEEDS[difficulty],
                foodEaten: 0,
            });
        }
    },

    pauseGame: () => {
        const { gameStatus } = get();
        if (gameStatus === 'playing') {
            set({ gameStatus: 'paused' });
        }
    },

    resumeGame: () => {
        const { gameStatus } = get();
        if (gameStatus === 'paused') {
            set({ gameStatus: 'playing' });
        }
    },

    changeDirection: (dir: Direction) => {
        const { direction, nextDirection, gameStatus } = get();

        if (gameStatus !== 'playing') return;

        // Prevent 180° turns
        const opposites: Record<Direction, Direction> = {
            UP: 'DOWN',
            DOWN: 'UP',
            LEFT: 'RIGHT',
            RIGHT: 'LEFT',
        };

        if (dir !== opposites[direction] && dir !== opposites[nextDirection]) {
            set({ nextDirection: dir });
        }
    },

    moveSnake: () => {
        const { snake, direction, nextDirection, food, starFood, gameStatus } = get();

        if (gameStatus !== 'playing') return;

        // Update direction
        const currentDirection = nextDirection;
        set({ direction: currentDirection });

        // Calculate new head position
        const head = snake[0];
        let newHead: Position;

        switch (currentDirection) {
            case 'UP':
                newHead = { x: head.x, y: head.y - 1 };
                break;
            case 'DOWN':
                newHead = { x: head.x, y: head.y + 1 };
                break;
            case 'LEFT':
                newHead = { x: head.x - 1, y: head.y };
                break;
            case 'RIGHT':
                newHead = { x: head.x + 1, y: head.y };
                break;
        }

        // Check collision before moving
        if (get().checkCollision()) {
            get().gameOver();
            return;
        }

        // Check if eating star food (Alternative mode)
        if (starFood && newHead.x === starFood.x && newHead.y === starFood.y) {
            get().eatStarFood();
            return;
        }

        // Check if eating regular food
        if (newHead.x === food.x && newHead.y === food.y) {
            get().eatFood();
            return;
        }

        // Normal move (without growing)
        const newSnake = [newHead, ...snake.slice(0, -1)];
        set({ snake: newSnake });
    },

    eatFood: () => {
        const { snake, nextDirection, score, gameMode, level, foodEaten } = get();

        // Calculate new head
        const head = snake[0];
        let newHead: Position;

        switch (nextDirection) {
            case 'UP':
                newHead = { x: head.x, y: head.y - 1 };
                break;
            case 'DOWN':
                newHead = { x: head.x, y: head.y + 1 };
                break;
            case 'LEFT':
                newHead = { x: head.x - 1, y: head.y };
                break;
            case 'RIGHT':
                newHead = { x: head.x + 1, y: head.y };
                break;
        }

        // Grow snake
        const newSnake = [newHead, ...snake];
        const newScore = score + 10;
        const newFoodEaten = foodEaten + 1;

        set({
            snake: newSnake,
            score: newScore,
            direction: nextDirection,
            foodEaten: newFoodEaten,
        });

        // Spawn new food
        get().spawnFood();

        // In Alternative mode, spawn star food after eating required amount
        if (gameMode === 'alternative') {
            const foodRequired = level + 1; // Level 1 = 2, Level 2 = 3, etc.
            if (newFoodEaten >= foodRequired) {
                get().spawnStarFood();
            }
        }
    },

    eatStarFood: () => {
        const { snake, nextDirection, score } = get();

        // Calculate new head (without growing)
        const head = snake[0];
        let newHead: Position;

        switch (nextDirection) {
            case 'UP':
                newHead = { x: head.x, y: head.y - 1 };
                break;
            case 'DOWN':
                newHead = { x: head.x, y: head.y + 1 };
                break;
            case 'LEFT':
                newHead = { x: head.x - 1, y: head.y };
                break;
            case 'RIGHT':
                newHead = { x: head.x + 1, y: head.y };
                break;
        }

        // Move without growing
        const newSnake = [newHead, ...snake.slice(0, -1)];
        const newScore = score + 50; // Star food bonus

        set({
            snake: newSnake,
            score: newScore,
            direction: nextDirection,
            gameStatus: 'paused',  // Pause during transition
            levelCompleting: true,   // Set flag for modal display
        });

        // Delay level completion to show animation
        setTimeout(() => {
            get().completeLevel();
            set({ gameStatus: 'playing' });  // Resume after transition
        }, 2500);  // 2.5 second delay for level complete animation
    },

    checkCollision: (): boolean => {
        const { snake, nextDirection, gridSize, obstacles } = get();
        const head = snake[0];

        // Calculate next position
        let nextHead: Position;
        switch (nextDirection) {
            case 'UP':
                nextHead = { x: head.x, y: head.y - 1 };
                break;
            case 'DOWN':
                nextHead = { x: head.x, y: head.y + 1 };
                break;
            case 'LEFT':
                nextHead = { x: head.x - 1, y: head.y };
                break;
            case 'RIGHT':
                nextHead = { x: head.x + 1, y: head.y };
                break;
        }

        // Wall collision
        if (
            nextHead.x < 0 ||
            nextHead.x >= gridSize ||
            nextHead.y < 0 ||
            nextHead.y >= gridSize
        ) {
            return true;
        }

        // Self collision
        const hasBodyCollision = snake.some(
            segment => segment.x === nextHead.x && segment.y === nextHead.y
        );

        // Obstacle collision (Alternative mode)
        const hasObstacleCollision = obstacles.some(
            obs => obs.x === nextHead.x && obs.y === nextHead.y
        );

        return hasBodyCollision || hasObstacleCollision;
    },

    gameOver: () => {
        const { score, highScore } = get();

        // Update high score
        let newHighScore = highScore;
        if (score > highScore) {
            newHighScore = score;
            if (typeof window !== 'undefined') {
                localStorage.setItem('snake_high_score', score.toString());
            }
        }

        set({
            gameStatus: 'gameOver',
            highScore: newHighScore,
        });
    },

    resetGame: () => {
        const { gameMode } = get();
        const gridSize = gameMode === 'classic' ? CLASSIC_GRID_SIZE : MIN_GRID_SIZE;
        const initialSnake = getInitialSnake(gridSize);
        const initialFood = getRandomPosition(initialSnake, gridSize);

        if (gameMode === 'alternative') {
            const obstacles = generateObstacles(
                getObstacleCount(1, gridSize),
                gridSize,
                initialSnake,
                initialFood,
                null
            );
            // No star food at start - must eat food first

            set({
                snake: initialSnake,
                food: initialFood,
                obstacles,
                starFood: null,
                direction: 'UP',
                nextDirection: 'UP',
                score: 0,
                level: 1,
                gridSize,
                gameStatus: 'idle',
                foodEaten: 0,
            });
        } else {
            set({
                snake: initialSnake,
                food: initialFood,
                obstacles: [],
                starFood: null,
                direction: 'UP',
                nextDirection: 'UP',
                score: 0,
                level: 1,
                gridSize,
                gameStatus: 'idle',
                foodEaten: 0,
            });
        }
    },
}));
