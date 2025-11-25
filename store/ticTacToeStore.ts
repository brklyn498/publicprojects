import { create } from "zustand";
import { TicTacToeState, Board, Player, WinLine } from "@/types/tictactoe";

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

export const useTicTacToeStore = create<TicTacToeState>((set, get) => ({
    board: createEmptyBoard(),
    currentPlayer: "X",
    gameStatus: "playing",
    winner: null,
    winLine: null,
    moveCount: 0,

    makeMove: (row: number, col: number) => {
        const { board, currentPlayer, gameStatus } = get();

        // Don't allow moves if game is over or cell is occupied
        if (gameStatus !== "playing" || board[row][col]) {
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
            set({ currentPlayer: currentPlayer === "X" ? "O" : "X" });
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
