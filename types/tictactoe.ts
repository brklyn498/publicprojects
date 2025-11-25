export type Player = "X" | "O";
export type CellValue = Player | null;
export type Board = CellValue[][];
export type GameStatus = "playing" | "won" | "draw";
export type GameMode = "pvp" | "pvc"; // Player vs Player or Player vs Computer

export interface WinLine {
    positions: [number, number][];
}

export interface ModeStats {
    wins: number;
    losses: number;
    draws: number;
    gamesPlayed: number;
}

export interface GameStats {
    pvp: ModeStats;
    pvc: ModeStats;
    currentStreak: number;
    bestStreak: number;
    lastGameMode: GameMode | null;
    lastGameResult: "win" | "loss" | "draw" | null;
}

export interface TicTacToeState {
    board: Board;
    currentPlayer: Player;
    gameStatus: GameStatus;
    winner: Player | null;
    winLine: WinLine | null;
    moveCount: number;
    gameMode: GameMode;
    stats: GameStats;
    // Actions
    makeMove: (row: number, col: number) => void;
    resetGame: () => void;
    checkWinner: () => void;
    setGameMode: (mode: GameMode) => void;
    makeAIMove: () => void;
    recordGameResult: (result: "win" | "loss" | "draw") => void;
}
