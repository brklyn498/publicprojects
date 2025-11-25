import { create } from "zustand";
import { TicTacToeState, Board, Player, WinLine, GameMode } from "@/types/tictactoe";

// Initialize empty 4x4 board
const createEmptyBoard = (): Board => {
    return Array(4).fill(null).map(() => Array(4).fill(null));
};

// Check all possible win conditions for 4x4 board
const checkWinner = (board: Board): { winner: Player | null; winLine: WinLine | null } => {
    // Check rows
    for (let row = 0; row < 4; row++) {
        if (
            board[row][0] &&
            board[row][0] === board[row][1] &&
            board[row][1] === board[row][2] &&
            board[row][2] === board[row][3]
        ) {
            return {
                winner: board[row][0],
                winLine: { positions: [[row, 0], [row, 1], [row, 2], [row, 3]] },
            };
        }
    }

    // Check columns
    for (let col = 0; col < 4; col++) {
        if (
            board[0][col] &&
            board[0][col] === board[1][col] &&
            board[1][col] === board[2][col] &&
            board[2][col] === board[3][col]
        ) {
            return {
                winner: board[0][col],
                winLine: { positions: [[0, col], [1, col], [2, col], [3, col]] },
            };
        }
    }

    // Check diagonal (top-left to bottom-right)
    if (
        board[0][0] &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2] &&
        board[2][2] === board[3][3]
    ) {
        return {
            winner: board[0][0],
            winLine: { positions: [[0, 0], [1, 1], [2, 2], [3, 3]] },
        };
    }

    // Check diagonal (top-right to bottom-left)
    if (
        board[0][3] &&
        board[0][3] === board[1][2] &&
        board[1][2] === board[2][1] &&
        board[2][1] === board[3][0]
    ) {
        return {
            winner: board[0][3],
            winLine: { positions: [[0, 3], [1, 2], [2, 1], [3, 0]] },
        };
    }

    return { winner: null, winLine: null };
};

// Get empty cells
const getEmptyCells = (board: Board): [number, number][] => {
    const empty: [number, number][] = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (!board[row][col]) {
                empty.push([row, col]);
            }
        }
    }
    return empty;
};

// Simple AI: Strategic move selection
const getBestMove = (board: Board): [number, number] | null => {
    const emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) return null;

    // 1. Check if AI can win in next move
    for (const [row, col] of emptyCells) {
        const testBoard = board.map(r => [...r]);
        testBoard[row][col] = "O";
        const { winner } = checkWinner(testBoard);
        if (winner === "O") return [row, col];
    }

    // 2. Block player from winning
    for (const [row, col] of emptyCells) {
        const testBoard = board.map(r => [...r]);
        testBoard[row][col] = "X";
        const { winner } = checkWinner(testBoard);
        if (winner === "X") return [row, col];
    }

    // 3. Take center cells if available
    const centerCells: [number, number][] = [[1, 1], [1, 2], [2, 1], [2, 2]];
    for (const [row, col] of centerCells) {
        if (!board[row][col]) return [row, col];
    }

    // 4. Take corners
    const corners: [number, number][] = [[0, 0], [0, 3], [3, 0], [3, 3]];
    for (const [row, col] of corners) {
        if (!board[row][col]) return [row, col];
    }

    // 5. Take any available cell
    return emptyCells[0];
};

export const useTicTacToeStore = create<TicTacToeState>((set, get) => ({
    board: createEmptyBoard(),
    currentPlayer: "X",
    gameStatus: "playing",
    winner: null,
    winLine: null,
    moveCount: 0,
    gameMode: "pvp",

    setGameMode: (mode: GameMode) => {
        set({ gameMode: mode });
        get().resetGame();
    },

    makeMove: (row: number, col: number) => {
        const { board, currentPlayer, gameStatus, gameMode } = get();

        // Don't allow moves if game is over or cell is occupied
        if (gameStatus !== "playing" || board[row][col]) {
            return;
        }

        // Don't allow player to move if it's AI's turn
        if (gameMode === "pvc" && currentPlayer === "O") {
            return;
        }

        // Make the move
        const newBoard = board.map((r, rowIndex) =>
            r.map((cell, colIndex) =>
                rowIndex === row && colIndex === col ? currentPlayer : cell
            )
        );

        set({ board: newBoard, moveCount: get().moveCount + 1 });

        // Check for winner
        const { winner, winLine } = checkWinner(newBoard);

        if (winner) {
            set({ gameStatus: "won", winner, winLine });
        } else if (get().moveCount + 1 === 16) {
            // All cells filled, it's a draw
            set({ gameStatus: "draw" });
        } else {
            // Switch player
            const nextPlayer = currentPlayer === "X" ? "O" : "X";
            set({ currentPlayer: nextPlayer });

            // If AI mode and it's AI's turn, make AI move after a delay
            if (gameMode === "pvc" && nextPlayer === "O") {
                setTimeout(() => {
                    get().makeAIMove();
                }, 500); // 500ms delay for better UX
            }
        }
    },

    makeAIMove: () => {
        const { board, gameStatus } = get();

        if (gameStatus !== "playing") return;

        const move = getBestMove(board);
        if (move) {
            const [row, col] = move;
            get().makeMove(row, col);
        }
    },

    resetGame: () => {
        set({
            board: createEmptyBoard(),
            currentPlayer: "X",
            gameStatus: "playing",
            winner: null,
            winLine: null,
            moveCount: 0,
        });
    },

    checkWinner: () => {
        const { board } = get();
        const { winner, winLine } = checkWinner(board);
        if (winner) {
            set({ gameStatus: "won", winner, winLine });
        }
    },
}));
