export type Difficulty = "easy" | "medium" | "hard";
export type CardTheme = "emoji" | "numbers" | "icons" | "colors";

export interface Card {
    id: string;
    pairId: number; // Cards with same pairId are matches
    content: string; // Emoji, number, icon name, or color
    isFlipped: boolean;
    isMatched: boolean;
}

export interface MemoryGameStats {
    difficulty: Difficulty;
    moves: number;
    timeElapsed: number; // seconds
    matchesFound: number;
    totalPairs: number;
    completedAt: string; // ISO timestamp
    isPerfect: boolean; // Minimum possible moves
}

export interface MemoryGameState {
    cards: Card[];
    difficulty: Difficulty;
    theme: CardTheme;
    flippedCards: string[]; // IDs of currently flipped cards
    moves: number;
    matchesFound: number;
    gameStatus: "idle" | "playing" | "won";
    timerStarted: number | null;
    timerElapsed: number;
    gameHistory: MemoryGameStats[];
    bestScores: {
        easy: MemoryGameStats | null;
        medium: MemoryGameStats | null;
        hard: MemoryGameStats | null;
    };
    // Actions
    initializeGame: (difficulty: Difficulty, theme: CardTheme) => void;
    flipCard: (cardId: string) => void;
    resetGame: () => void;
    checkMatch: () => void;
    updateTimer: () => void;
    startGame: () => void;
    // Statistics
    getTotalGamesPlayed: () => number;
    getPerfectGames: () => number;
    getAverageTime: () => number;
}
