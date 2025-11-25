import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useSudokuStore } from '@/store/sudokuStore';

describe('Sudoku Store', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Reset store to initial state
    useSudokuStore.setState({
      puzzle: null,
      grid: [],
      difficulty: 'easy',
      selectedCell: null,
      gameStatus: 'idle',
      timerStarted: null,
      timerElapsed: 0,
      hintsUsed: 0,
      mistakesMade: 0,
      notesMode: false,
      history: [],
      maxHistory: 50,
      gameHistory: [],
      bestTimes: { easy: null, medium: null, hard: null, expert: null },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Game Initialization', () => {
    it('should initialize game with easy difficulty', () => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      const { puzzle, grid, difficulty, gameStatus } = useSudokuStore.getState();

      expect(puzzle).not.toBeNull();
      expect(puzzle?.difficulty).toBe('easy');
      expect(grid.length).toBe(9);
      expect(grid[0].length).toBe(9);
      expect(difficulty).toBe('easy');
      expect(gameStatus).toBe('idle');
    });

    it('should initialize game with correct clue count for difficulty', () => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      const { puzzle } = useSudokuStore.getState();

      // Easy should have 40-44 clues
      expect(puzzle?.clueCount).toBeGreaterThanOrEqual(40);
      expect(puzzle?.clueCount).toBeLessThanOrEqual(44);
    });

    it('should mark given cells correctly', () => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      const { grid, puzzle } = useSudokuStore.getState();
      let givenCount = 0;

      grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.isGiven) {
            givenCount++;
            expect(cell.value).toBe(puzzle?.puzzle[r][c]);
          }
        });
      });

      expect(givenCount).toBe(puzzle?.clueCount);
    });

    it('should reset game state on initialization', () => {
      const store = useSudokuStore.getState();

      // Set some state
      useSudokuStore.setState({
        hintsUsed: 5,
        mistakesMade: 3,
        gameStatus: 'playing',
        notesMode: true,
      });

      store.initializeGame('easy');

      const { hintsUsed, mistakesMade, gameStatus, notesMode } = useSudokuStore.getState();

      expect(hintsUsed).toBe(0);
      expect(mistakesMade).toBe(0);
      expect(gameStatus).toBe('idle');
      expect(notesMode).toBe(false);
    });
  });

  describe('Cell Selection', () => {
    beforeEach(() => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');
    });

    it('should select a cell', () => {
      const store = useSudokuStore.getState();

      // Find an empty cell
      let emptyRow = 0, emptyCol = 0;
      store.grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell.isGiven) {
            emptyRow = r;
            emptyCol = c;
          }
        });
      });

      store.selectCell(emptyRow, emptyCol);

      const { selectedCell } = useSudokuStore.getState();
      expect(selectedCell).toEqual({ row: emptyRow, col: emptyCol });
    });

    it('should start game on first cell selection', () => {
      const store = useSudokuStore.getState();

      // Find an empty cell
      let emptyRow = 0, emptyCol = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!store.grid[r][c].isGiven) {
            emptyRow = r;
            emptyCol = c;
            break;
          }
        }
      }

      expect(store.gameStatus).toBe('idle');

      store.selectCell(emptyRow, emptyCol);

      const { gameStatus, timerStarted } = useSudokuStore.getState();
      expect(gameStatus).toBe('playing');
      expect(timerStarted).not.toBeNull();
    });

    it('should not select given cells', () => {
      const store = useSudokuStore.getState();

      // Find a given cell
      let givenRow = 0, givenCol = 0;
      store.grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.isGiven) {
            givenRow = r;
            givenCol = c;
          }
        });
      });

      store.selectCell(givenRow, givenCol);

      const { selectedCell } = useSudokuStore.getState();
      expect(selectedCell).toBeNull();
    });
  });

  describe('Setting Numbers', () => {
    beforeEach(() => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      // Select an empty cell
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!store.grid[r][c].isGiven) {
            store.selectCell(r, c);
            break;
          }
        }
      }
    });

    it('should set a number in selected cell', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      const { selectedCell } = store;

      if (selectedCell) {
        store.setNumber(5);

        vi.advanceTimersByTime(150);

        const { grid } = useSudokuStore.getState();
        expect(grid[selectedCell.row][selectedCell.col].value).toBe(5);
      }
    });

    it('should track mistakes when wrong number entered', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      const { selectedCell, puzzle } = store;

      if (selectedCell && puzzle) {
        const correctValue = puzzle.solution[selectedCell.row][selectedCell.col];
        const wrongValue = correctValue === 1 ? 2 : 1;

        store.setNumber(wrongValue);

        vi.advanceTimersByTime(150);

        const { mistakesMade } = useSudokuStore.getState();
        expect(mistakesMade).toBe(1);
      }
    });

    it('should not track mistakes when correct number entered', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      const { selectedCell, puzzle } = store;

      if (selectedCell && puzzle) {
        const correctValue = puzzle.solution[selectedCell.row][selectedCell.col];

        store.setNumber(correctValue);

        vi.advanceTimersByTime(150);

        const { mistakesMade } = useSudokuStore.getState();
        expect(mistakesMade).toBe(0);
      }
    });

    it('should add to history when setting number', () => {
      const store = useSudokuStore.getState();
      const { selectedCell } = store;

      if (selectedCell) {
        expect(store.history.length).toBe(0);

        store.setNumber(5);

        const { history } = useSudokuStore.getState();
        expect(history.length).toBe(1);
      }
    });

    it('should not modify given cells', () => {
      const store = useSudokuStore.getState();

      // Find a given cell
      let givenCell = null;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (store.grid[r][c].isGiven) {
            givenCell = { row: r, col: c };
            break;
          }
        }
      }

      if (givenCell) {
        const originalValue = store.grid[givenCell.row][givenCell.col].value;

        useSudokuStore.setState({ selectedCell: givenCell });
        store.setNumber(9);

        const { grid } = useSudokuStore.getState();
        expect(grid[givenCell.row][givenCell.col].value).toBe(originalValue);
      }
    });
  });

  describe('Notes Mode', () => {
    beforeEach(() => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      // Select an empty cell
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!store.grid[r][c].isGiven) {
            store.selectCell(r, c);
            break;
          }
        }
      }
    });

    it('should toggle notes mode', () => {
      const store = useSudokuStore.getState();
      expect(store.notesMode).toBe(false);

      store.toggleNotesMode();
      expect(useSudokuStore.getState().notesMode).toBe(true);

      store.toggleNotesMode();
      expect(useSudokuStore.getState().notesMode).toBe(false);
    });

    it('should add notes when in notes mode', () => {
      const store = useSudokuStore.getState();
      const { selectedCell } = store;

      if (selectedCell) {
        store.toggleNotesMode();
        store.setNumber(5);

        const { grid } = useSudokuStore.getState();
        expect(grid[selectedCell.row][selectedCell.col].notes).toContain(5);
      }
    });

    it('should remove notes when number is set', () => {
      const store = useSudokuStore.getState();
      const { selectedCell } = store;

      if (selectedCell) {
        // Add some notes
        store.toggleNotesMode();
        store.setNumber(5);
        store.setNumber(6);

        // Switch to normal mode and set number
        store.toggleNotesMode();
        store.setNumber(7);

        const { grid } = useSudokuStore.getState();
        expect(grid[selectedCell.row][selectedCell.col].notes).toEqual([]);
        expect(grid[selectedCell.row][selectedCell.col].value).toBe(7);
      }
    });

    it('should toggle notes on/off', () => {
      const store = useSudokuStore.getState();
      const { selectedCell } = store;

      if (selectedCell) {
        store.toggleNotesMode();
        store.setNumber(5);

        const { grid: grid1 } = useSudokuStore.getState();
        expect(grid1[selectedCell.row][selectedCell.col].notes).toContain(5);

        // Toggle same note should remove it
        store.setNumber(5);

        const { grid: grid2 } = useSudokuStore.getState();
        expect(grid2[selectedCell.row][selectedCell.col].notes).not.toContain(5);
      }
    });
  });

  describe('Hints', () => {
    beforeEach(() => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');
    });

    it('should provide a hint', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      const initialHints = store.hintsUsed;

      store.useHint();

      vi.advanceTimersByTime(150);

      const { hintsUsed, selectedCell, grid, puzzle } = useSudokuStore.getState();

      expect(hintsUsed).toBe(initialHints + 1);
      expect(selectedCell).not.toBeNull();

      if (selectedCell && puzzle) {
        const cellValue = grid[selectedCell.row][selectedCell.col].value;
        const correctValue = puzzle.solution[selectedCell.row][selectedCell.col];
        expect(cellValue).toBe(correctValue);
      }
    });

    it('should increment hints used counter', () => {
      const store = useSudokuStore.getState();

      expect(store.hintsUsed).toBe(0);

      store.useHint();

      const { hintsUsed } = useSudokuStore.getState();
      expect(hintsUsed).toBe(1);
    });

    it('should select the hinted cell', () => {
      const store = useSudokuStore.getState();

      store.useHint();

      const { selectedCell } = useSudokuStore.getState();
      expect(selectedCell).not.toBeNull();
    });
  });

  describe('Clear Cell', () => {
    beforeEach(() => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      // Select and fill an empty cell
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!store.grid[r][c].isGiven) {
            store.selectCell(r, c);
            store.setNumber(5);
            break;
          }
        }
      }
    });

    it('should clear selected cell', () => {
      const store = useSudokuStore.getState();
      const { selectedCell } = store;

      if (selectedCell) {
        store.clearCell();

        const { grid } = useSudokuStore.getState();
        expect(grid[selectedCell.row][selectedCell.col].value).toBeNull();
      }
    });

    it('should clear notes when clearing cell', () => {
      const store = useSudokuStore.getState();
      const { selectedCell } = store;

      if (selectedCell) {
        // Add some notes
        store.toggleNotesMode();
        store.setNumber(7);
        store.toggleNotesMode();

        store.clearCell();

        const { grid } = useSudokuStore.getState();
        expect(grid[selectedCell.row][selectedCell.col].notes).toEqual([]);
      }
    });

    it('should add to history when clearing cell', () => {
      const store = useSudokuStore.getState();
      const historyLength = store.history.length;

      store.clearCell();

      const { history } = useSudokuStore.getState();
      expect(history.length).toBe(historyLength + 1);
    });
  });

  describe('Undo', () => {
    beforeEach(() => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      // Select an empty cell
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!store.grid[r][c].isGiven) {
            store.selectCell(r, c);
            break;
          }
        }
      }
    });

    it('should undo last move', () => {
      const store = useSudokuStore.getState();
      const { selectedCell } = store;

      if (selectedCell) {
        const originalValue = store.grid[selectedCell.row][selectedCell.col].value;

        store.setNumber(5);

        const { grid: afterSet } = useSudokuStore.getState();
        expect(afterSet[selectedCell.row][selectedCell.col].value).toBe(5);

        store.undo();

        const { grid: afterUndo } = useSudokuStore.getState();
        expect(afterUndo[selectedCell.row][selectedCell.col].value).toBe(originalValue);
      }
    });

    it('should maintain history limit', () => {
      const store = useSudokuStore.getState();

      // Make more than maxHistory moves
      for (let i = 0; i < 60; i++) {
        store.setNumber((i % 9) + 1);
      }

      const { history, maxHistory } = useSudokuStore.getState();
      expect(history.length).toBeLessThanOrEqual(maxHistory);
    });

    it('should do nothing if no history', () => {
      const store = useSudokuStore.getState();
      const { grid: initialGrid } = store;

      store.undo();

      const { grid: afterUndo } = useSudokuStore.getState();
      expect(afterUndo).toEqual(initialGrid);
    });
  });

  describe('Solution Checking', () => {
    it('should detect incomplete puzzle', () => {
      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      const result = store.checkSolution();

      expect(result).toBe(false);
      expect(store.gameStatus).not.toBe('won');
    });

    it('should detect win when puzzle completed correctly', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      // Fill grid with solution
      const { puzzle } = store;
      if (puzzle) {
        const newGrid = puzzle.solution.map((row, r) =>
          row.map((val, c) => ({
            value: val,
            isGiven: puzzle.puzzle[r][c] !== 0,
            notes: [],
            isError: false,
            isHighlighted: false,
          }))
        );

        useSudokuStore.setState({ grid: newGrid, gameStatus: 'playing', timerStarted: Date.now() });

        vi.advanceTimersByTime(10000);

        store.checkSolution();

        const { gameStatus, gameHistory } = useSudokuStore.getState();

        expect(gameStatus).toBe('won');
        expect(gameHistory.length).toBe(1);
      }
    });

    it('should detect perfect game', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      // Complete without hints or mistakes
      const { puzzle } = store;
      if (puzzle) {
        const newGrid = puzzle.solution.map((row, r) =>
          row.map((val, c) => ({
            value: val,
            isGiven: puzzle.puzzle[r][c] !== 0,
            notes: [],
            isError: false,
            isHighlighted: false,
          }))
        );

        useSudokuStore.setState({
          grid: newGrid,
          gameStatus: 'playing',
          timerStarted: Date.now(),
          hintsUsed: 0,
          mistakesMade: 0,
        });

        vi.advanceTimersByTime(10000);

        store.checkSolution();

        const { gameHistory } = useSudokuStore.getState();

        expect(gameHistory[0].isPerfect).toBe(true);
        expect(gameHistory[0].hintsUsed).toBe(0);
        expect(gameHistory[0].mistakesMade).toBe(0);
      }
    });

    it('should not be perfect if hints used', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      const { puzzle } = store;
      if (puzzle) {
        const newGrid = puzzle.solution.map((row, r) =>
          row.map((val, c) => ({
            value: val,
            isGiven: puzzle.puzzle[r][c] !== 0,
            notes: [],
            isError: false,
            isHighlighted: false,
          }))
        );

        useSudokuStore.setState({
          grid: newGrid,
          gameStatus: 'playing',
          timerStarted: Date.now(),
          hintsUsed: 2,
          mistakesMade: 0,
        });

        vi.advanceTimersByTime(10000);

        store.checkSolution();

        const { gameHistory } = useSudokuStore.getState();

        expect(gameHistory[0].isPerfect).toBe(false);
      }
    });
  });

  describe('Best Times', () => {
    it('should record best time for first completion', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      const { puzzle } = store;
      if (puzzle) {
        const newGrid = puzzle.solution.map((row, r) =>
          row.map((val, c) => ({
            value: val,
            isGiven: puzzle.puzzle[r][c] !== 0,
            notes: [],
            isError: false,
            isHighlighted: false,
          }))
        );

        useSudokuStore.setState({ grid: newGrid, gameStatus: 'playing', timerStarted: Date.now() });

        vi.advanceTimersByTime(10000);

        store.checkSolution();

        const { bestTimes } = useSudokuStore.getState();

        expect(bestTimes.easy).not.toBeNull();
      }
    });

    it('should update best time only if faster', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();

      // Set existing best time
      useSudokuStore.setState({
        bestTimes: { easy: 20, medium: null, hard: null, expert: null },
      });

      // Complete faster
      store.initializeGame('easy');

      const { puzzle } = store;
      if (puzzle) {
        const newGrid = puzzle.solution.map((row, r) =>
          row.map((val, c) => ({
            value: val,
            isGiven: puzzle.puzzle[r][c] !== 0,
            notes: [],
            isError: false,
            isHighlighted: false,
          }))
        );

        useSudokuStore.setState({ grid: newGrid, gameStatus: 'playing', timerStarted: Date.now() });

        vi.advanceTimersByTime(10000); // 10 seconds, faster than 20

        store.checkSolution();

        const { bestTimes } = useSudokuStore.getState();

        expect(bestTimes.easy).toBe(10);
      }
    });
  });

  describe('Statistics Getters', () => {
    it('should return total games played', () => {
      useSudokuStore.setState({
        gameHistory: [
          {
            difficulty: 'easy',
            solveTime: 300,
            hintsUsed: 0,
            mistakesMade: 0,
            completedAt: new Date().toISOString(),
            isPerfect: true,
          },
          {
            difficulty: 'medium',
            solveTime: 600,
            hintsUsed: 2,
            mistakesMade: 1,
            completedAt: new Date().toISOString(),
            isPerfect: false,
          },
        ],
      });

      const store = useSudokuStore.getState();
      const total = store.getTotalGamesPlayed();

      expect(total).toBe(2);
    });

    it('should count perfect games', () => {
      useSudokuStore.setState({
        gameHistory: [
          {
            difficulty: 'easy',
            solveTime: 300,
            hintsUsed: 0,
            mistakesMade: 0,
            completedAt: new Date().toISOString(),
            isPerfect: true,
          },
          {
            difficulty: 'medium',
            solveTime: 600,
            hintsUsed: 2,
            mistakesMade: 1,
            completedAt: new Date().toISOString(),
            isPerfect: false,
          },
          {
            difficulty: 'easy',
            solveTime: 250,
            hintsUsed: 0,
            mistakesMade: 0,
            completedAt: new Date().toISOString(),
            isPerfect: true,
          },
        ],
      });

      const store = useSudokuStore.getState();
      const perfect = store.getPerfectGames();

      expect(perfect).toBe(2);
    });

    it('should calculate average time', () => {
      useSudokuStore.setState({
        gameHistory: [
          {
            difficulty: 'easy',
            solveTime: 300,
            hintsUsed: 0,
            mistakesMade: 0,
            completedAt: new Date().toISOString(),
            isPerfect: true,
          },
          {
            difficulty: 'easy',
            solveTime: 400,
            hintsUsed: 1,
            mistakesMade: 0,
            completedAt: new Date().toISOString(),
            isPerfect: false,
          },
          {
            difficulty: 'easy',
            solveTime: 500,
            hintsUsed: 0,
            mistakesMade: 2,
            completedAt: new Date().toISOString(),
            isPerfect: false,
          },
        ],
      });

      const store = useSudokuStore.getState();
      const average = store.getAverageTime('easy');

      expect(average).toBe(400); // (300 + 400 + 500) / 3 = 400
    });

    it('should return 0 average time when no games played', () => {
      const store = useSudokuStore.getState();
      const average = store.getAverageTime();

      expect(average).toBe(0);
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should save game history to localStorage', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      const { puzzle } = store;
      if (puzzle) {
        const newGrid = puzzle.solution.map((row, r) =>
          row.map((val, c) => ({
            value: val,
            isGiven: puzzle.puzzle[r][c] !== 0,
            notes: [],
            isError: false,
            isHighlighted: false,
          }))
        );

        useSudokuStore.setState({ grid: newGrid, gameStatus: 'playing', timerStarted: Date.now() });

        vi.advanceTimersByTime(10000);

        store.checkSolution();

        const saved = localStorage.getItem('sudoku_stats');
        expect(saved).not.toBeNull();

        const stats = JSON.parse(saved!);
        expect(stats).toHaveLength(1);
      }
    });

    it('should save best times to localStorage', async () => {
      vi.useFakeTimers();

      const store = useSudokuStore.getState();
      store.initializeGame('easy');

      const { puzzle } = store;
      if (puzzle) {
        const newGrid = puzzle.solution.map((row, r) =>
          row.map((val, c) => ({
            value: val,
            isGiven: puzzle.puzzle[r][c] !== 0,
            notes: [],
            isError: false,
            isHighlighted: false,
          }))
        );

        useSudokuStore.setState({ grid: newGrid, gameStatus: 'playing', timerStarted: Date.now() });

        vi.advanceTimersByTime(10000);

        store.checkSolution();

        const saved = localStorage.getItem('sudoku_best_times');
        expect(saved).not.toBeNull();

        const bestTimes = JSON.parse(saved!);
        expect(bestTimes.easy).not.toBeNull();
      }
    });
  });
});
