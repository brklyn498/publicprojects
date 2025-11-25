import { create } from "zustand";
import { GameState, Puzzle, Cursor, Word, PuzzleStats } from "@/types";

export const useGameStore = create<GameState>((set, get) => ({
  currentPuzzle: null,
  gridState: {},
  cursor: { row: 0, col: 0, direction: "across" },
  solvedPuzzles: [],
  isComplete: false,
  currentWord: null,
  // Timer state
  timerStartedAt: null,
  timerElapsed: 0,
  isTimerRunning: false,
  // Hint state
  hintsUsed: 0,
  maxHints: 3,
  // Statistics
  puzzleStats: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("puzzleStats") || "[]")
    : [],

  setCurrentPuzzle: (puzzle: Puzzle) => {
    // Load solved puzzles from localStorage
    const solved =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("solvedPuzzles") || "[]")
        : [];

    set({
      currentPuzzle: puzzle,
      gridState: {},
      cursor: { row: 0, col: 0, direction: "across" },
      isComplete: false,
      solvedPuzzles: solved,
      currentWord: puzzle.words.find(
        (w) => w.startRow === 0 && w.startCol === 0 && w.orientation === "across"
      ) || puzzle.words[0],
      hintsUsed: 0,
      timerElapsed: 0,
      timerStartedAt: null,
      isTimerRunning: false,
    });
    // Start timer automatically
    get().startTimer();
  },

  updateCell: (row: number, col: number, letter: string) => {
    const key = `${row}-${col}`;
    set((state) => ({
      gridState: {
        ...state.gridState,
        [key]: letter.toUpperCase(),
      },
    }));
  },

  setCursor: (cursor: Cursor) => {
    const { currentPuzzle } = get();
    if (!currentPuzzle) return;

    // Find the current word based on cursor position and direction
    const currentWord = currentPuzzle.words.find((word) => {
      if (word.orientation !== cursor.direction) return false;

      if (cursor.direction === "across") {
        return (
          word.startRow === cursor.row &&
          cursor.col >= word.startCol &&
          cursor.col < word.startCol + word.answer.length
        );
      } else {
        return (
          word.startCol === cursor.col &&
          cursor.row >= word.startRow &&
          cursor.row < word.startRow + word.answer.length
        );
      }
    });

    set({ cursor, currentWord: currentWord || null });
  },

  toggleDirection: () => {
    const { cursor } = get();
    const newDirection = cursor.direction === "across" ? "down" : "across";
    get().setCursor({ ...cursor, direction: newDirection });
  },

  moveCursor: (direction: "up" | "down" | "left" | "right") => {
    const { cursor, currentPuzzle } = get();
    if (!currentPuzzle) return;

    let newRow = cursor.row;
    let newCol = cursor.col;

    switch (direction) {
      case "up":
        newRow = Math.max(0, cursor.row - 1);
        break;
      case "down":
        newRow = Math.min(currentPuzzle.gridSize.rows - 1, cursor.row + 1);
        break;
      case "left":
        newCol = Math.max(0, cursor.col - 1);
        break;
      case "right":
        newCol = Math.min(currentPuzzle.gridSize.cols - 1, cursor.col + 1);
        break;
    }

    get().setCursor({ row: newRow, col: newCol, direction: cursor.direction });
  },

  handleBackspace: () => {
    const { cursor, gridState, currentPuzzle } = get();
    if (!currentPuzzle) return;

    const currentKey = `${cursor.row}-${cursor.col}`;

    // If current cell has content, clear it
    if (gridState[currentKey]) {
      get().updateCell(cursor.row, cursor.col, "");
      return;
    }

    // Otherwise, move back one cell and clear it
    if (cursor.direction === "across") {
      if (cursor.col > 0) {
        const newCol = cursor.col - 1;
        get().setCursor({ ...cursor, col: newCol });
        get().updateCell(cursor.row, newCol, "");
      }
    } else {
      if (cursor.row > 0) {
        const newRow = cursor.row - 1;
        get().setCursor({ ...cursor, row: newRow });
        get().updateCell(newRow, cursor.col, "");
      }
    }
  },

  checkSolution: () => {
    const { currentPuzzle, gridState, hintsUsed } = get();
    if (!currentPuzzle) return false;

    let isCorrect = true;

    for (const word of currentPuzzle.words) {
      for (let i = 0; i < word.answer.length; i++) {
        const row =
          word.orientation === "across" ? word.startRow : word.startRow + i;
        const col =
          word.orientation === "across" ? word.startCol + i : word.startCol;
        const key = `${row}-${col}`;
        const userLetter = gridState[key] || "";

        if (userLetter !== word.answer[i]) {
          isCorrect = false;
          break;
        }
      }
      if (!isCorrect) break;
    }

    if (isCorrect) {
      // Pause timer
      get().pauseTimer();
      get().updateTimerElapsed();

      // Save statistics
      const { timerElapsed, puzzleStats } = get();
      const stats: PuzzleStats = {
        puzzleId: currentPuzzle.id,
        completionTime: timerElapsed,
        hintsUsed: hintsUsed,
        completedAt: new Date().toISOString(),
      };

      const newStats = [...puzzleStats, stats];
      set({ isComplete: true, puzzleStats: newStats });

      if (typeof window !== "undefined") {
        localStorage.setItem("puzzleStats", JSON.stringify(newStats));
      }

      get().markPuzzleSolved(currentPuzzle.id);
    }

    return isCorrect;
  },

  markPuzzleSolved: (puzzleId: string) => {
    const { solvedPuzzles } = get();
    if (!solvedPuzzles.includes(puzzleId)) {
      const newSolved = [...solvedPuzzles, puzzleId];
      set({ solvedPuzzles: newSolved });
      if (typeof window !== "undefined") {
        localStorage.setItem("solvedPuzzles", JSON.stringify(newSolved));
      }
    }
  },

  resetPuzzle: () => {
    set({
      gridState: {},
      cursor: { row: 0, col: 0, direction: "across" },
      isComplete: false,
      hintsUsed: 0,
      timerElapsed: 0,
      timerStartedAt: null,
      isTimerRunning: false,
    });
    get().startTimer();
  },

  setCurrentWord: (word: Word | null) => {
    set({ currentWord: word });
  },

  // Timer actions
  startTimer: () => {
    const now = Date.now();
    set({ timerStartedAt: now, isTimerRunning: true });
  },

  pauseTimer: () => {
    get().updateTimerElapsed();
    set({ isTimerRunning: false });
  },

  updateTimerElapsed: () => {
    const { timerStartedAt, timerElapsed, isTimerRunning } = get();
    if (!isTimerRunning || !timerStartedAt) return;

    const now = Date.now();
    const additionalSeconds = Math.floor((now - timerStartedAt) / 1000);
    set({
      timerElapsed: timerElapsed + additionalSeconds,
      timerStartedAt: now
    });
  },

  // Hint actions
  useHint: (type: "reveal" | "check") => {
    const { hintsUsed, maxHints } = get();
    if (hintsUsed >= maxHints) return;

    if (type === "reveal") {
      get().revealLetter();
    } else if (type === "check") {
      get().checkWord();
    }

    set({ hintsUsed: hintsUsed + 1 });
  },

  revealLetter: () => {
    const { cursor, currentPuzzle, gridState } = get();
    if (!currentPuzzle) return;

    const key = `${cursor.row}-${cursor.col}`;

    // Find what the correct letter should be
    for (const word of currentPuzzle.words) {
      if (word.orientation === "across") {
        if (
          word.startRow === cursor.row &&
          cursor.col >= word.startCol &&
          cursor.col < word.startCol + word.answer.length
        ) {
          const letterIndex = cursor.col - word.startCol;
          get().updateCell(cursor.row, cursor.col, word.answer[letterIndex]);
          return;
        }
      } else {
        if (
          word.startCol === cursor.col &&
          cursor.row >= word.startRow &&
          cursor.row < word.startRow + word.answer.length
        ) {
          const letterIndex = cursor.row - word.startRow;
          get().updateCell(cursor.row, cursor.col, word.answer[letterIndex]);
          return;
        }
      }
    }
  },

  checkWord: () => {
    const { currentWord, gridState } = get();
    if (!currentWord) return false;

    let isCorrect = true;
    for (let i = 0; i < currentWord.answer.length; i++) {
      const row =
        currentWord.orientation === "across"
          ? currentWord.startRow
          : currentWord.startRow + i;
      const col =
        currentWord.orientation === "across"
          ? currentWord.startCol + i
          : currentWord.startCol;
      const key = `${row}-${col}`;
      const userLetter = gridState[key] || "";

      if (userLetter !== currentWord.answer[i]) {
        isCorrect = false;
        break;
      }
    }

    return isCorrect;
  },
}));
