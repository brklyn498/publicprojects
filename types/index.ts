export interface Word {
  id: string;
  clue: string;
  answer: string;
  orientation: "across" | "down";
  startRow: number;
  startCol: number;
}

export interface Puzzle {
  id: string;
  title: string;
  difficulty: string;
  language: "en" | "ru";
  gridSize: {
    rows: number;
    cols: number;
  };
  words: Word[];
}

export interface CrosswordData {
  puzzles: Puzzle[];
}

export interface Cell {
  letter: string;
  isBlack: boolean;
  number?: number;
}

export interface GridState {
  [key: string]: string; // "row-col": "letter"
}

export interface Cursor {
  row: number;
  col: number;
  direction: "across" | "down";
}

export interface PuzzleStats {
  puzzleId: string;
  completionTime: number; // in seconds
  hintsUsed: number;
  completedAt: string; // ISO timestamp
}

export interface GameState {
  currentPuzzle: Puzzle | null;
  gridState: GridState;
  cursor: Cursor;
  solvedPuzzles: string[];
  isComplete: boolean;
  currentWord: Word | null;
  // Timer
  timerStartedAt: number | null;
  timerElapsed: number; // in seconds
  isTimerRunning: boolean;
  // Hints
  hintsUsed: number;
  maxHints: number;
  // Statistics
  puzzleStats: PuzzleStats[];
  // Actions
  setCurrentPuzzle: (puzzle: Puzzle) => void;
  updateCell: (row: number, col: number, letter: string) => void;
  setCursor: (cursor: Cursor) => void;
  toggleDirection: () => void;
  moveCursor: (direction: "up" | "down" | "left" | "right") => void;
  handleBackspace: () => void;
  checkSolution: () => boolean;
  markPuzzleSolved: (puzzleId: string) => void;
  resetPuzzle: () => void;
  setCurrentWord: (word: Word | null) => void;
  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  updateTimerElapsed: () => void;
  // Hint actions
  useHint: (type: "reveal" | "check") => void;
  revealLetter: () => void;
  checkWord: () => boolean;
}
