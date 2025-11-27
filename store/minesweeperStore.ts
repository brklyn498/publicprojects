import { create } from 'zustand';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type CellData = {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

interface MinesweeperState {
  grid: CellData[][];
  rows: number;
  cols: number;
  totalMines: number;
  difficulty: Difficulty;
  gameStatus: GameStatus;
  flagsPlaced: number;
  timer: number;
  isFirstMove: boolean;

  initializeGame: (difficulty: Difficulty) => void;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  resetGame: () => void;
  tickTimer: () => void;
}

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

const getNeighbors = (row: number, col: number, rows: number, cols: number) => {
  const neighbors = [];
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c < cols && !(r === row && c === col)) {
        neighbors.push({ r, c });
      }
    }
  }
  return neighbors;
};

export const useMinesweeperStore = create<MinesweeperState>((set, get) => ({
  grid: [],
  rows: 9,
  cols: 9,
  totalMines: 10,
  difficulty: 'easy',
  gameStatus: 'idle',
  flagsPlaced: 0,
  timer: 0,
  isFirstMove: true,

  initializeGame: (difficulty) => {
    const config = DIFFICULTIES[difficulty];
    const newGrid: CellData[][] = [];

    // Create empty grid
    for (let r = 0; r < config.rows; r++) {
      const row: CellData[] = [];
      for (let c = 0; c < config.cols; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }

    set({
      grid: newGrid,
      rows: config.rows,
      cols: config.cols,
      totalMines: config.mines,
      difficulty,
      gameStatus: 'idle',
      flagsPlaced: 0,
      timer: 0,
      isFirstMove: true,
    });
  },

  resetGame: () => {
    const { difficulty } = get();
    get().initializeGame(difficulty);
  },

  tickTimer: () => {
    const { gameStatus, timer } = get();
    if (gameStatus === 'playing') {
      set({ timer: timer + 1 });
    }
  },

  toggleFlag: (row, col) => {
    const { grid, gameStatus, flagsPlaced } = get();
    if (gameStatus !== 'playing' && gameStatus !== 'idle') return;

    const cell = grid[row][col];
    if (cell.isRevealed) return;

    const newGrid = [...grid];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = { ...cell, isFlagged: !cell.isFlagged };

    set({
      grid: newGrid,
      flagsPlaced: flagsPlaced + (cell.isFlagged ? -1 : 1),
    });
  },

  revealCell: (row, col) => {
    const state = get();
    const { grid, rows, cols, totalMines, isFirstMove, gameStatus } = state;

    if (gameStatus !== 'idle' && gameStatus !== 'playing') return;

    // Start game on first click (or reveal)
    let currentGrid = [...grid];
    let currentStatus = gameStatus;

    if (currentStatus === 'idle') {
        currentStatus = 'playing';
        set({ gameStatus: 'playing' });
    }

    const cell = currentGrid[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    // Place mines if first move
    if (isFirstMove) {
      let minesPlaced = 0;
      const newGrid = currentGrid.map(r => r.map(c => ({ ...c }))); // Deep copy for initialization

      while (minesPlaced < totalMines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        // Don't place mine on first clicked cell or its neighbors (to ensure start is safe)
        const isSafeZone = Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1;

        if (!newGrid[r][c].isMine && !isSafeZone) {
          newGrid[r][c].isMine = true;
          minesPlaced++;
        }
      }

      // Calculate neighbor counts
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!newGrid[r][c].isMine) {
            let count = 0;
            getNeighbors(r, c, rows, cols).forEach(n => {
              if (newGrid[n.r][n.c].isMine) count++;
            });
            newGrid[r][c].neighborMines = count;
          }
        }
      }

      currentGrid = newGrid;
      set({ isFirstMove: false });
    } else {
        // Deep copy grid to avoid mutation during recursive reveal
         currentGrid = currentGrid.map(r => r.map(c => ({ ...c })));
    }

    // Reveal logic
    if (currentGrid[row][col].isMine) {
      // Game Over
      currentGrid[row][col].isRevealed = true;
      // Reveal all mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (currentGrid[r][c].isMine) {
            currentGrid[r][c].isRevealed = true;
          }
        }
      }
      set({ grid: currentGrid, gameStatus: 'lost' });
      return;
    }

    // Flood fill
    const revealRecursive = (r: number, c: number, gridToUpdate: CellData[][]) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols || gridToUpdate[r][c].isRevealed || gridToUpdate[r][c].isFlagged) {
        return;
      }

      gridToUpdate[r][c].isRevealed = true;

      if (gridToUpdate[r][c].neighborMines === 0) {
        getNeighbors(r, c, rows, cols).forEach(n => {
          revealRecursive(n.r, n.c, gridToUpdate);
        });
      }
    };

    revealRecursive(row, col, currentGrid);

    // Check Win
    let unrevealedSafeCells = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!currentGrid[r][c].isMine && !currentGrid[r][c].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      set({ grid: currentGrid, gameStatus: 'won' });
    } else {
      set({ grid: currentGrid });
    }
  },
}));
