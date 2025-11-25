import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useMemoryGameStore } from '@/store/memoryGameStore';

describe('Memory Game Store', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Reset store to initial state
    useMemoryGameStore.setState({
      cards: [],
      difficulty: 'easy',
      theme: 'emoji',
      flippedCards: [],
      moves: 0,
      matchesFound: 0,
      gameStatus: 'idle',
      timerStarted: null,
      timerElapsed: 0,
      gameHistory: [],
      bestScores: { easy: null, medium: null, hard: null },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Game Initialization', () => {
    it('should initialize game with easy difficulty', () => {
      useMemoryGameStore.getState().initializeGame('easy', 'emoji');

      const { cards, difficulty, theme } = useMemoryGameStore.getState();

      expect(difficulty).toBe('easy');
      expect(theme).toBe('emoji');
      expect(cards.length).toBe(16); // 8 pairs × 2 = 16 cards
    });

    it('should initialize game with medium difficulty', () => {
      useMemoryGameStore.getState().initializeGame('medium', 'numbers');

      const { cards, difficulty } = useMemoryGameStore.getState();

      expect(difficulty).toBe('medium');
      expect(cards.length).toBe(36); // 18 pairs × 2 = 36 cards
    });

    it('should initialize game with hard difficulty', () => {
      useMemoryGameStore.getState().initializeGame('hard', 'colors');

      const { cards, difficulty } = useMemoryGameStore.getState();

      expect(difficulty).toBe('hard');
      expect(cards.length).toBe(64); // 32 pairs × 2 = 64 cards
    });

    it('should create cards in pairs', () => {
      useMemoryGameStore.getState().initializeGame('easy', 'numbers');

      const { cards } = useMemoryGameStore.getState();

      // Count pairs by pairId
      const pairCounts: Record<number, number> = {};
      cards.forEach(card => {
        pairCounts[card.pairId] = (pairCounts[card.pairId] || 0) + 1;
      });

      // All pairs should have exactly 2 cards
      Object.values(pairCounts).forEach(count => {
        expect(count).toBe(2);
      });
    });

    it('should initialize all cards as not flipped and not matched', () => {
      useMemoryGameStore.getState().initializeGame('easy', 'emoji');

      const { cards } = useMemoryGameStore.getState();

      cards.forEach(card => {
        expect(card.isFlipped).toBe(false);
        expect(card.isMatched).toBe(false);
      });
    });

    it('should reset game state on initialization', () => {
      // Set some game state
      useMemoryGameStore.setState({
        moves: 10,
        matchesFound: 5,
        flippedCards: ['1', '2'],
        gameStatus: 'playing',
      });

      // Reinitialize
      useMemoryGameStore.getState().initializeGame('easy', 'emoji');

      const { moves, matchesFound, flippedCards, gameStatus } = useMemoryGameStore.getState();

      expect(moves).toBe(0);
      expect(matchesFound).toBe(0);
      expect(flippedCards).toEqual([]);
      expect(gameStatus).toBe('idle');
    });
  });

  describe('Starting Game', () => {
    beforeEach(() => {
      useMemoryGameStore.getState().initializeGame('easy', 'emoji');
    });

    it('should set game status to playing', () => {
      useMemoryGameStore.getState().startGame();

      const { gameStatus } = useMemoryGameStore.getState();
      expect(gameStatus).toBe('playing');
    });

    it('should start timer', () => {
      useMemoryGameStore.getState().startGame();

      const { timerStarted } = useMemoryGameStore.getState();
      expect(timerStarted).not.toBeNull();
      expect(timerStarted).toBeGreaterThan(0);
    });
  });

  describe('Flipping Cards', () => {
    beforeEach(() => {
      useMemoryGameStore.getState().initializeGame('easy', 'emoji');
    });

    it('should flip a card', () => {
      const firstCard = useMemoryGameStore.getState().cards[0];

      useMemoryGameStore.getState().flipCard(firstCard.id);

      const { cards } = useMemoryGameStore.getState();
      const flippedCard = cards.find(c => c.id === firstCard.id);

      expect(flippedCard?.isFlipped).toBe(true);
    });

    it('should start game automatically on first card flip', () => {
      const firstCard = useMemoryGameStore.getState().cards[0];

      expect(useMemoryGameStore.getState().gameStatus).toBe('idle');

      useMemoryGameStore.getState().flipCard(firstCard.id);

      const { gameStatus } = useMemoryGameStore.getState();
      expect(gameStatus).toBe('playing');
    });

    it('should add card to flippedCards array', () => {
      const firstCard = useMemoryGameStore.getState().cards[0];

      useMemoryGameStore.getState().flipCard(firstCard.id);

      const { flippedCards } = useMemoryGameStore.getState();
      expect(flippedCards).toContain(firstCard.id);
      expect(flippedCards).toHaveLength(1);
    });

    it('should allow flipping two cards', () => {
      const [firstCard, secondCard] = useMemoryGameStore.getState().cards;

      useMemoryGameStore.getState().flipCard(firstCard.id);
      useMemoryGameStore.getState().flipCard(secondCard.id);

      const { flippedCards } = useMemoryGameStore.getState();
      expect(flippedCards).toHaveLength(2);
    });

    it('should not flip more than two cards at once', () => {
      const [card1, card2, card3] = useMemoryGameStore.getState().cards;

      useMemoryGameStore.getState().flipCard(card1.id);
      useMemoryGameStore.getState().flipCard(card2.id);
      useMemoryGameStore.getState().flipCard(card3.id); // This should be ignored

      const { flippedCards } = useMemoryGameStore.getState();
      expect(flippedCards).toHaveLength(2);
    });

    it('should not flip already matched cards', () => {
      const firstCard = useMemoryGameStore.getState().cards[0];

      // Mark card as matched
      useMemoryGameStore.setState({
        cards: useMemoryGameStore.getState().cards.map(c =>
          c.id === firstCard.id ? { ...c, isMatched: true } : c
        ),
      });

      useMemoryGameStore.getState().flipCard(firstCard.id);

      const { flippedCards } = useMemoryGameStore.getState();
      expect(flippedCards).toHaveLength(0);
    });

    it('should not flip already flipped cards', () => {
      const firstCard = useMemoryGameStore.getState().cards[0];

      // Flip card once
      useMemoryGameStore.getState().flipCard(firstCard.id);

      const { flippedCards: firstFlip } = useMemoryGameStore.getState();
      expect(firstFlip).toHaveLength(1);

      // Try to flip same card again
      useMemoryGameStore.getState().flipCard(firstCard.id);

      const { flippedCards: secondFlip } = useMemoryGameStore.getState();
      expect(secondFlip).toHaveLength(1); // Should still be 1
    });
  });

  describe('Match Detection', () => {
    beforeEach(() => {
      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();
    });

    it('should detect matching cards', async () => {
      vi.useFakeTimers();

      // Find two cards with the same pairId
      const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === 0);
      const [card1, card2] = matchingCards;

      useMemoryGameStore.getState().flipCard(card1.id);
      useMemoryGameStore.getState().flipCard(card2.id);

      // Wait for match check delay
      vi.advanceTimersByTime(800);

      const { cards, matchesFound } = useMemoryGameStore.getState();

      const matchedCard1 = cards.find(c => c.id === card1.id);
      const matchedCard2 = cards.find(c => c.id === card2.id);

      expect(matchedCard1?.isMatched).toBe(true);
      expect(matchedCard2?.isMatched).toBe(true);
      expect(matchesFound).toBe(1);
    });

    it('should flip back non-matching cards', async () => {
      vi.useFakeTimers();

      // Find two cards with different pairIds
      const card1 = useMemoryGameStore.getState().cards.find(c => c.pairId === 0)!;
      const card2 = useMemoryGameStore.getState().cards.find(c => c.pairId === 1)!;

      useMemoryGameStore.getState().flipCard(card1.id);
      useMemoryGameStore.getState().flipCard(card2.id);

      // Wait for match check delay
      vi.advanceTimersByTime(800);

      const { cards } = useMemoryGameStore.getState();

      const flippedCard1 = cards.find(c => c.id === card1.id);
      const flippedCard2 = cards.find(c => c.id === card2.id);

      expect(flippedCard1?.isFlipped).toBe(false);
      expect(flippedCard2?.isFlipped).toBe(false);
    });

    it('should clear flippedCards after match', async () => {
      vi.useFakeTimers();

      const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === 0);
      const [card1, card2] = matchingCards;

      useMemoryGameStore.getState().flipCard(card1.id);
      useMemoryGameStore.getState().flipCard(card2.id);

      vi.advanceTimersByTime(800);

      const { flippedCards } = useMemoryGameStore.getState();
      expect(flippedCards).toEqual([]);
    });

    it('should increment moves counter on second card flip', () => {
      const [card1, card2] = useMemoryGameStore.getState().cards;

      expect(useMemoryGameStore.getState().moves).toBe(0);

      useMemoryGameStore.getState().flipCard(card1.id);
      expect(useMemoryGameStore.getState().moves).toBe(0);

      useMemoryGameStore.getState().flipCard(card2.id);
      expect(useMemoryGameStore.getState().moves).toBe(1);
    });
  });

  describe('Win Detection', () => {
    it('should detect win when all pairs matched', async () => {
      vi.useFakeTimers();

      useMemoryGameStore.getState().initializeGame('easy', 'numbers'); // 8 pairs
      useMemoryGameStore.getState().startGame();

      // Match all 8 pairs
      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      const { gameStatus, matchesFound } = useMemoryGameStore.getState();

      expect(matchesFound).toBe(8);
      expect(gameStatus).toBe('won');
    });

    it('should record game stats on win', async () => {
      vi.useFakeTimers();

      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();

      // Match all pairs
      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      const { gameHistory } = useMemoryGameStore.getState();

      expect(gameHistory).toHaveLength(1);
      expect(gameHistory[0].difficulty).toBe('easy');
      expect(gameHistory[0].moves).toBe(8);
      expect(gameHistory[0].matchesFound).toBe(8);
      expect(gameHistory[0].totalPairs).toBe(8);
    });

    it('should detect perfect game (minimum moves)', async () => {
      vi.useFakeTimers();

      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();

      // Match all pairs with perfect moves (8 pairs = 8 moves)
      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      const { gameHistory } = useMemoryGameStore.getState();

      expect(gameHistory[0].isPerfect).toBe(true);
    });

    it('should not mark as perfect if extra moves made', async () => {
      vi.useFakeTimers();

      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();

      // Make one wrong match
      const card1 = useMemoryGameStore.getState().cards.find(c => c.pairId === 0)!;
      const card2 = useMemoryGameStore.getState().cards.find(c => c.pairId === 1)!;

      useMemoryGameStore.getState().flipCard(card1.id);
      useMemoryGameStore.getState().flipCard(card2.id);
      vi.advanceTimersByTime(800);

      // Now match all pairs correctly
      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      const { gameHistory, moves } = useMemoryGameStore.getState();

      expect(moves).toBeGreaterThan(8);
      expect(gameHistory[0].isPerfect).toBe(false);
    });
  });

  describe('Best Scores', () => {
    it('should update best score for first completion', async () => {
      vi.useFakeTimers();

      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();

      // Complete game
      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      const { bestScores } = useMemoryGameStore.getState();

      expect(bestScores.easy).not.toBeNull();
      expect(bestScores.easy?.difficulty).toBe('easy');
    });

    it('should update best score only if faster', async () => {
      vi.useFakeTimers();

      // First game - 10 seconds
      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();

      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      vi.advanceTimersByTime(10000); // Simulate 10 seconds passed

      const { bestScores: firstBest } = useMemoryGameStore.getState();
      const firstTime = firstBest.easy?.timeElapsed;

      // Second game - faster (5 seconds)
      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();

      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      vi.advanceTimersByTime(5000);

      const { bestScores: secondBest } = useMemoryGameStore.getState();
      const secondTime = secondBest.easy?.timeElapsed;

      expect(secondTime).toBeLessThan(firstTime!);
    });

    it('should not update best score if slower', async () => {
      vi.useFakeTimers();

      // Set an existing best score
      useMemoryGameStore.setState({
        bestScores: {
          easy: {
            difficulty: 'easy',
            moves: 8,
            timeElapsed: 10,
            matchesFound: 8,
            totalPairs: 8,
            completedAt: new Date().toISOString(),
            isPerfect: true,
          },
          medium: null,
          hard: null,
        },
      });

      // Play a slower game
      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();

      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      vi.advanceTimersByTime(20000); // Slower time

      const { bestScores } = useMemoryGameStore.getState();

      expect(bestScores.easy?.timeElapsed).toBe(10); // Should keep faster time
    });
  });

  describe('Timer', () => {
    it('should update timer while game is playing', () => {
      vi.useFakeTimers();

      useMemoryGameStore.getState().initializeGame('easy', 'emoji');
      useMemoryGameStore.getState().startGame();

      vi.advanceTimersByTime(5000);
      useMemoryGameStore.getState().updateTimer();

      const { timerElapsed } = useMemoryGameStore.getState();
      expect(timerElapsed).toBeGreaterThan(0);
    });

    it('should not update timer when game is idle', () => {
      useMemoryGameStore.getState().initializeGame('easy', 'emoji');

      useMemoryGameStore.getState().updateTimer();

      const { timerElapsed } = useMemoryGameStore.getState();
      expect(timerElapsed).toBe(0);
    });

    it('should track elapsed time in seconds', () => {
      vi.useFakeTimers();

      useMemoryGameStore.getState().initializeGame('easy', 'emoji');
      useMemoryGameStore.getState().startGame();

      vi.advanceTimersByTime(10000); // 10 seconds
      useMemoryGameStore.getState().updateTimer();

      const { timerElapsed } = useMemoryGameStore.getState();
      expect(timerElapsed).toBe(10);
    });
  });

  describe('Reset Game', () => {
    it('should reset game with same difficulty and theme', () => {
      useMemoryGameStore.getState().initializeGame('medium', 'colors');

      // Play a bit
      useMemoryGameStore.setState({
        moves: 5,
        matchesFound: 2,
        gameStatus: 'playing',
      });

      useMemoryGameStore.getState().resetGame();

      const { difficulty, theme, moves, matchesFound, gameStatus } = useMemoryGameStore.getState();

      expect(difficulty).toBe('medium');
      expect(theme).toBe('colors');
      expect(moves).toBe(0);
      expect(matchesFound).toBe(0);
      expect(gameStatus).toBe('idle');
    });
  });

  describe('Statistics Getters', () => {
    beforeEach(() => {
      useMemoryGameStore.getState().initializeGame('easy', 'emoji');
    });

    describe('getTotalGamesPlayed', () => {
      it('should return total games played', () => {
        useMemoryGameStore.setState({
          gameHistory: [
            {
              difficulty: 'easy',
              moves: 8,
              timeElapsed: 30,
              matchesFound: 8,
              totalPairs: 8,
              completedAt: new Date().toISOString(),
              isPerfect: true,
            },
            {
              difficulty: 'medium',
              moves: 20,
              timeElapsed: 60,
              matchesFound: 18,
              totalPairs: 18,
              completedAt: new Date().toISOString(),
              isPerfect: false,
            },
          ],
        });

        const total = useMemoryGameStore.getState().getTotalGamesPlayed();

        expect(total).toBe(2);
      });

      it('should return 0 when no games played', () => {
        const total = useMemoryGameStore.getState().getTotalGamesPlayed();

        expect(total).toBe(0);
      });
    });

    describe('getPerfectGames', () => {
      it('should count perfect games', () => {
        useMemoryGameStore.setState({
          gameHistory: [
            {
              difficulty: 'easy',
              moves: 8,
              timeElapsed: 30,
              matchesFound: 8,
              totalPairs: 8,
              completedAt: new Date().toISOString(),
              isPerfect: true,
            },
            {
              difficulty: 'easy',
              moves: 10,
              timeElapsed: 40,
              matchesFound: 8,
              totalPairs: 8,
              completedAt: new Date().toISOString(),
              isPerfect: false,
            },
            {
              difficulty: 'medium',
              moves: 18,
              timeElapsed: 60,
              matchesFound: 18,
              totalPairs: 18,
              completedAt: new Date().toISOString(),
              isPerfect: true,
            },
          ],
        });

        const perfect = useMemoryGameStore.getState().getPerfectGames();

        expect(perfect).toBe(2);
      });

      it('should return 0 when no perfect games', () => {
        useMemoryGameStore.setState({
          gameHistory: [
            {
              difficulty: 'easy',
              moves: 10,
              timeElapsed: 40,
              matchesFound: 8,
              totalPairs: 8,
              completedAt: new Date().toISOString(),
              isPerfect: false,
            },
          ],
        });

        const perfect = useMemoryGameStore.getState().getPerfectGames();

        expect(perfect).toBe(0);
      });
    });

    describe('getAverageTime', () => {
      it('should calculate average time', () => {
        useMemoryGameStore.setState({
          gameHistory: [
            {
              difficulty: 'easy',
              moves: 8,
              timeElapsed: 30,
              matchesFound: 8,
              totalPairs: 8,
              completedAt: new Date().toISOString(),
              isPerfect: true,
            },
            {
              difficulty: 'easy',
              moves: 10,
              timeElapsed: 40,
              matchesFound: 8,
              totalPairs: 8,
              completedAt: new Date().toISOString(),
              isPerfect: false,
            },
            {
              difficulty: 'easy',
              moves: 9,
              timeElapsed: 50,
              matchesFound: 8,
              totalPairs: 8,
              completedAt: new Date().toISOString(),
              isPerfect: false,
            },
          ],
        });

        const average = useMemoryGameStore.getState().getAverageTime();

        expect(average).toBe(40); // (30 + 40 + 50) / 3 = 40
      });

      it('should return 0 when no games played', () => {
        const average = useMemoryGameStore.getState().getAverageTime();

        expect(average).toBe(0);
      });
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should save game history to localStorage', async () => {
      vi.useFakeTimers();

      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();

      // Complete game
      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      const saved = localStorage.getItem('memory_game_stats');
      expect(saved).not.toBeNull();

      const stats = JSON.parse(saved!);
      expect(stats).toHaveLength(1);
    });

    it('should save best scores to localStorage', async () => {
      vi.useFakeTimers();

      useMemoryGameStore.getState().initializeGame('easy', 'numbers');
      useMemoryGameStore.getState().startGame();

      // Complete game
      for (let pairId = 0; pairId < 8; pairId++) {
        const matchingCards = useMemoryGameStore.getState().cards.filter(c => c.pairId === pairId);
        const [card1, card2] = matchingCards;

        useMemoryGameStore.getState().flipCard(card1.id);
        useMemoryGameStore.getState().flipCard(card2.id);

        vi.advanceTimersByTime(800);
      }

      const saved = localStorage.getItem('memory_best_scores');
      expect(saved).not.toBeNull();

      const bestScores = JSON.parse(saved!);
      expect(bestScores.easy).not.toBeNull();
    });
  });
});
