import { create } from "zustand";
import { SudokuGameState, Cell, Difficulty, SudokuPuzzle, SudokuGameStats } from "@/types/sudoku";
import { generatePuzzle, isValidPlacement, getHintCell } from "@/lib/sudokuGenerator";

// Load stats from localStorage
const loadStats = () => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("sudoku_stats");
    return saved ? JSON.parse(saved) : [];
};

// Load best times
const loadBestTimes = () => {
    if (typeof window === "undefined") {
        return { easy: null, medium: null, hard: null, expert: null };
    }
    const saved = localStorage.getItem("sudoku_best_times");
    return saved ? JSON.parse(saved) : { easy: null, medium: null, hard: null, expert: null };
};

// Create initial empty grid
const createEmptyGrid = (): Cell[][] => {
    return Array(9)
        .fill(null)
        .map(() =>
            Array(9)
                .fill(null)
                .map(() => ({
                    value: null,
                    isGiven: false,
                    notes: [],
                    isError: false,
                    isHighlighted: false,
                }))
        );
};

// Convert puzzle to Cell grid
const puzzleToGrid = (puzzle: number[][]): Cell[][] => {
    return puzzle.map((row, r) =>
        row.map((val, c) => ({
            value: val === 0 ? null : val,
            isGiven: val !== 0,
            notes: [],
            isError: false,
            isHighlighted: false,
        }))
    );
};

export const useSudokuStore = create<SudokuGameState>((set, get) => ({
    puzzle: null,
    grid: createEmptyGrid(),
    difficulty: "easy",
    selectedCell: null,
    gameStatus: "idle",
    timerStarted: null,
    timerElapsed: 0,
    hintsUsed: 0,
    mistakesMade: 0,
    notesMode: false,
    history: [],
    maxHistory: 50,
    gameHistory: loadStats(),
    bestTimes: loadBestTimes(),

    initializeGame: (difficulty: Difficulty) => {
        const { solution, puzzle, clueCount } = generatePuzzle(difficulty);
        const puzzleData: SudokuPuzzle = {
            id: `sudoku-${Date.now()}`,
            difficulty,
            solution,
            puzzle,
            clueCount,
        };

        const grid = puzzleToGrid(puzzle);

        set({
            puzzle: puzzleData,
            grid,
            difficulty,
            selectedCell: null,
            gameStatus: "idle",
            timerStarted: null,
            timerElapsed: 0,
            hintsUsed: 0,
            mistakesMade: 0,
            notesMode: false,
            history: [],
        });
    },

    selectCell: (row: number, col: number) => {
        const { grid, gameStatus } = get();

        // Start timer on first cell selection
        if (gameStatus === "idle") {
            set({ gameStatus: "playing", timerStarted: Date.now() });
        }

        // Don't select given cells
        if (grid[row][col].isGiven) return;

        set({ selectedCell: { row, col } });
    },

    setNumber: (num: number) => {
        const { selectedCell, grid, notesMode, puzzle, history, maxHistory } = get();
        if (!selectedCell || !puzzle) return;

        const { row, col } = selectedCell;
        const cell = grid[row][col];

        // Can't modify given cells
        if (cell.isGiven) return;

        // Save to history for undo
        const newHistory = [...history, { grid: JSON.parse(JSON.stringify(grid)), timestamp: Date.now() }];
        if (newHistory.length > maxHistory) {
            newHistory.shift();
        }

        if (notesMode) {
            // Toggle note
            const newGrid = grid.map((r, ridx) =>
                r.map((c, cidx) => {
                    if (ridx === row && cidx === col) {
                        const notes = c.notes.includes(num)
                            ? c.notes.filter((n) => n !== num)
                            : [...c.notes, num].sort();
                        return { ...c, notes };
                    }
                    return c;
                })
            );

            set({ grid: newGrid, history: newHistory });
        } else {
            // Set number
            const newGrid = grid.map((r, ridx) =>
                r.map((c, cidx) => {
                    if (ridx === row && cidx === col) {
                        return { ...c, value: num, notes: [] };
                    }
                    return c;
                })
            );

            // Check if it's correct
            const isCorrect = puzzle.solution[row][col] === num;
            if (!isCorrect) {
                set((state) => ({ mistakesMade: state.mistakesMade + 1 }));
            }

            set({ grid: newGrid, history: newHistory });

            // Validate and check for win
            setTimeout(() => {
                get().validateGrid();
                get().checkSolution();
            }, 100);
        }
    },

    clearCell: () => {
        const { selectedCell, grid, history, maxHistory } = get();
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        if (grid[row][col].isGiven) return;

        // Save to history
        const newHistory = [...history, { grid: JSON.parse(JSON.stringify(grid)), timestamp: Date.now() }];
        if (newHistory.length > maxHistory) {
            newHistory.shift();
        }

        const newGrid = grid.map((r, ridx) =>
            r.map((c, cidx) => {
                if (ridx === row && cidx === col) {
                    return { ...c, value: null, notes: [], isError: false };
                }
                return c;
            })
        );

        set({ grid: newGrid, history: newHistory });
    },

    toggleNotesMode: () => {
        set((state) => ({ notesMode: !state.notesMode }));
    },

    toggleNote: (num: number) => {
        const { selectedCell, grid } = get();
        if (!selectedCell) return;

        const { row, col } = selectedCell;
        const cell = grid[row][col];
        if (cell.isGiven || cell.value !== null) return;

        get().setNumber(num);
    },

    useHint: () => {
        const { puzzle, grid } = get();
        if (!puzzle) return;

        // Convert grid to number array for hint algorithm
        const currentPuzzle = grid.map((row) => row.map((cell) => cell.value || 0));
        const hint = getHintCell(currentPuzzle, puzzle.solution);

        if (hint) {
            const { row, col, value } = hint;

            const newGrid = grid.map((r, ridx) =>
                r.map((c, cidx) => {
                    if (ridx === row && cidx === col) {
                        return { ...c, value, notes: [], isError: false };
                    }
                    return c;
                })
            );

            set((state) => ({
                grid: newGrid,
                hintsUsed: state.hintsUsed + 1,
                selectedCell: { row, col },
            }));

            // Check for win after hint
            setTimeout(() => {
                get().validateGrid();
                get().checkSolution();
            }, 100);
        }
    },

    checkSolution: () => {
        const { grid, puzzle, difficulty, timerStarted } = get();
        if (!puzzle) return false;

        // Check if all cells are filled
        const isFilled = grid.every((row) => row.every((cell) => cell.value !== null));
        if (!isFilled) return false;

        // Check if solution matches
        const isCorrect = grid.every((row, r) =>
            row.every((cell, c) => cell.value === puzzle.solution[r][c])
        );

        if (isCorrect) {
            const timeElapsed = timerStarted ? Math.floor((Date.now() - timerStarted) / 1000) : 0;
            const { hintsUsed, mistakesMade } = get();
            const isPerfect = hintsUsed === 0 && mistakesMade === 0;

            const gameStats: SudokuGameStats = {
                difficulty,
                solveTime: timeElapsed,
                hintsUsed,
                mistakesMade,
                completedAt: new Date().toISOString(),
                isPerfect,
            };

            const newHistory = [...get().gameHistory, gameStats];
            const bestTimes = { ...get().bestTimes };
            const currentBest = bestTimes[difficulty];

            if (currentBest === null || timeElapsed < currentBest) {
                bestTimes[difficulty] = timeElapsed;
            }

            // Save to localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem("sudoku_stats", JSON.stringify(newHistory));
                localStorage.setItem("sudoku_best_times", JSON.stringify(bestTimes));
            }

            set({
                gameStatus: "won",
                gameHistory: newHistory,
                bestTimes,
            });

            return true;
        }

        return false;
    },

    validateGrid: () => {
        const { grid } = get();

        const newGrid = grid.map((row, r) =>
            row.map((cell, c) => {
                if (cell.value === null || cell.isGiven) {
                    return { ...cell, isError: false };
                }

                // Check for conflicts
                const hasConflict = !isValidPlacement(
                    grid.map((row) => row.map((cell) => cell.value || 0)),
                    r,
                    c,
                    cell.value
                );

                return { ...cell, isError: hasConflict };
            })
        );

        set({ grid: newGrid });
    },

    undo: () => {
        const { history } = get();
        if (history.length === 0) return;

        const previous = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        set({
            grid: JSON.parse(JSON.stringify(previous.grid)),
            history: newHistory,
        });
    },

    resetGame: () => {
        const { difficulty } = get();
        get().initializeGame(difficulty);
    },

    updateTimer: () => {
        const { timerStarted, gameStatus } = get();
        if (gameStatus === "playing" && timerStarted) {
            const elapsed = Math.floor((Date.now() - timerStarted) / 1000);
            set({ timerElapsed: elapsed });
        }
    },

    // Statistics getters
    getTotalGamesPlayed: () => {
        return get().gameHistory.length;
    },

    getPerfectGames: () => {
        return get().gameHistory.filter((g) => g.isPerfect).length;
    },

    getAverageTime: (difficulty?: Difficulty) => {
        const history = difficulty
            ? get().gameHistory.filter((g) => g.difficulty === difficulty)
            : get().gameHistory;

        if (history.length === 0) return 0;
        const total = history.reduce((sum, g) => sum + g.solveTime, 0);
        return Math.round(total / history.length);
    },
}));
