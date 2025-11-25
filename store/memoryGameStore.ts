import { create } from "zustand";
import { MemoryGameState, Card, Difficulty, CardTheme, MemoryGameStats } from "@/types/memory";
import { getContentForTheme, getPairCount, shuffleArray } from "@/lib/memoryContent";

// Load stats from localStorage
const loadStats = () => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("memory_game_stats");
    return saved ? JSON.parse(saved) : [];
};

// Load best scores
const loadBestScores = () => {
    if (typeof window === "undefined") {
        return { easy: null, medium: null, hard: null };
    }
    const saved = localStorage.getItem("memory_best_scores");
    return saved ? JSON.parse(saved) : { easy: null, medium: null, hard: null };
};

// Generate shuffled cards
const generateCards = (difficulty: Difficulty, theme: CardTheme): Card[] => {
    const pairCount = getPairCount(difficulty);
    const content = getContentForTheme(theme, pairCount);

    const cards: Card[] = [];
    content.forEach((item, index) => {
        cards.push(
            {
                id: `${index}-a`,
                pairId: index,
                content: item,
                isFlipped: false,
                isMatched: false,
            },
            {
                id: `${index}-b`,
                pairId: index,
                content: item,
                isFlipped: false,
                isMatched: false,
            }
        );
    });

    return shuffleArray(cards);
};

export const useMemoryGameStore = create<MemoryGameState>((set, get) => ({
    cards: [],
    difficulty: "easy",
    theme: "emoji",
    flippedCards: [],
    moves: 0,
    matchesFound: 0,
    gameStatus: "idle",
    timerStarted: null,
    timerElapsed: 0,
    gameHistory: loadStats(),
    bestScores: loadBestScores(),

    initializeGame: (difficulty: Difficulty, theme: CardTheme) => {
        const cards = generateCards(difficulty, theme);
        set({
            cards,
            difficulty,
            theme,
            flippedCards: [],
            moves: 0,
            matchesFound: 0,
            gameStatus: "idle",
            timerStarted: null,
            timerElapsed: 0,
        });
    },

    startGame: () => {
        set({
            gameStatus: "playing",
            timerStarted: Date.now(),
        });
    },

    flipCard: (cardId: string) => {
        const { cards, flippedCards, gameStatus, moves } = get();

        // Don't flip if game not started, card already flipped, or 2 cards already flipped
        if (gameStatus === "idle") {
            get().startGame();
        }
        if (gameStatus !== "playing") return;
        if (flippedCards.length >= 2) return;

        const card = cards.find((c) => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        // Flip the card
        const newCards = cards.map((c) =>
            c.id === cardId ? { ...c, isFlipped: true } : c
        );
        const newFlippedCards = [...flippedCards, cardId];

        set({
            cards: newCards,
            flippedCards: newFlippedCards,
        });

        // If this is the second card, check for match
        if (newFlippedCards.length === 2) {
            set({ moves: moves + 1 });
            setTimeout(() => {
                get().checkMatch();
            }, 800); // Delay to show both cards
        }
    },

    checkMatch: () => {
        const { cards, flippedCards, matchesFound, difficulty } = get();
        const totalPairs = getPairCount(difficulty);

        if (flippedCards.length !== 2) return;

        const [firstId, secondId] = flippedCards;
        const firstCard = cards.find((c) => c.id === firstId);
        const secondCard = cards.find((c) => c.id === secondId);

        if (!firstCard || !secondCard) return;

        const isMatch = firstCard.pairId === secondCard.pairId;

        if (isMatch) {
            // Cards match!
            const newCards = cards.map((c) =>
                c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
            );
            const newMatchesFound = matchesFound + 1;

            set({
                cards: newCards,
                flippedCards: [],
                matchesFound: newMatchesFound,
            });

            // Check for win
            if (newMatchesFound === totalPairs) {
                const { moves, timerStarted } = get();
                const timeElapsed = timerStarted
                    ? Math.floor((Date.now() - timerStarted) / 1000)
                    : 0;

                const isPerfect = moves === totalPairs; // Perfect = minimum moves

                const gameStats: MemoryGameStats = {
                    difficulty,
                    moves,
                    timeElapsed,
                    matchesFound: newMatchesFound,
                    totalPairs,
                    completedAt: new Date().toISOString(),
                    isPerfect,
                };

                // Update history
                const newHistory = [...get().gameHistory, gameStats];

                // Update best scores
                const bestScores = { ...get().bestScores };
                const currentBest = bestScores[difficulty];
                if (!currentBest || timeElapsed < currentBest.timeElapsed) {
                    bestScores[difficulty] = gameStats;
                }

                // Save to localStorage
                if (typeof window !== "undefined") {
                    localStorage.setItem("memory_game_stats", JSON.stringify(newHistory));
                    localStorage.setItem("memory_best_scores", JSON.stringify(bestScores));
                }

                set({
                    gameStatus: "won",
                    gameHistory: newHistory,
                    bestScores,
                });
            }
        } else {
            // Cards don't match - flip them back
            const newCards = cards.map((c) =>
                c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            );

            set({
                cards: newCards,
                flippedCards: [],
            });
        }
    },

    updateTimer: () => {
        const { timerStarted, gameStatus } = get();
        if (gameStatus === "playing" && timerStarted) {
            const elapsed = Math.floor((Date.now() - timerStarted) / 1000);
            set({ timerElapsed: elapsed });
        }
    },

    resetGame: () => {
        const { difficulty, theme } = get();
        get().initializeGame(difficulty, theme);
    },

    // Statistics getters
    getTotalGamesPlayed: () => {
        return get().gameHistory.length;
    },

    getPerfectGames: () => {
        return get().gameHistory.filter((g) => g.isPerfect).length;
    },

    getAverageTime: () => {
        const history = get().gameHistory;
        if (history.length === 0) return 0;
        const total = history.reduce((sum, g) => sum + g.timeElapsed, 0);
        return Math.round(total / history.length);
    },
}));
