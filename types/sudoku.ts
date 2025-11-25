export type Difficulty = "easy" | "medium" | "hard" | "expert";

export interface Cell {
    value: number | null; // 1-9 or null
    isGiven: boolean; // Pre-filled clue
    notes: number[]; // Pencil marks (1-9)
    isError: boolean; // Validation error flag
    isHighlighted: boolean; // Same number highlight
}

export interface SudokuPuzzle {
    id: string;
    difficulty: Difficulty;
    solution: number[][]; // Complete 9x9 solution
    puzzle: number[][]; // Initial state with clues
    clueCount: number;
}

export interface GameHistory {
    grid: Cell[][];
    timestamp: number;
}

export interface SudokuGameStats {
    difficulty: Difficulty;
    solveTime: number; // seconds
    hintsUsed: number;
    mistakesMade: number;
    completedAt: string;
    isPerfect: boolean; // No hints, no mistakes
}

export interface SudokuGameState {
    puzzle: SudokuPuzzle | null;
    grid: Cell[][];
    difficulty: Difficulty;
    selectedCell: { row: number; col: number } | null;
    gameStatus: "idle" | "playing" | "won";
    timerStarted: number | null;
    timerElapsed: number;
    hintsUsed: number;
    mistakesMade: number;
    notesMode: boolean;
    history: GameHistory[];
    maxHistory: number;
    gameHistory: SudokuGameStats[];
    bestTimes: {
        easy: number | null;
        medium: number | null;
        hard: number | null;
        expert: number | null;
    };
    // Actions
    initializeGame: (difficulty: Difficulty) => void;
    selectCell: (row: number, col: number) => void;
    setNumber: (num: number) => void;
    clearCell: () => void;
    toggleNotesMode: () => void;
    toggleNote: (num: number) => void;
    useHint: () => void;
    checkSolution: () => boolean;
    validateGrid: () => void;
    undo: () => void;
    resetGame: () => void;
    updateTimer: () => void;
    // Statistics
    getTotalGamesPlayed: () => number;
    getPerfectGames: () => number;
    getAverageTime: (difficulty?: Difficulty) => number;
}
