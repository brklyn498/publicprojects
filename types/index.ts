export interface Puzzle {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  size: { rows: number; cols: number };
  grid: (string | null)[][];
  words: Word[];
}

export interface CrosswordData {
  puzzles: Puzzle[];
}

export interface Word {
  id: number;
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  orientation: "across" | "down";
}

export type GridState = { [key: string]: string };

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
  // Statistics Getters
  getTotalPuzzlesCompleted: () => number;
  getPerfectSolves: () => number;
  getAverageCompletionTime: () => number;
}
