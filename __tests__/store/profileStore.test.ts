import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProfileStore } from '@/store/profileStore';

describe('Profile Store', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Reset store to initial state
    useProfileStore.setState({
      profile: null,
      achievements: [],
      streak: { current: 0, longest: 0, lastPlayedDate: '' },
      gameStats: {
        tictactoe: { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, winRate: 0, bestStreak: 0, totalPlaytime: 0 },
        memory: { gamesPlayed: 0, gamesWon: 0, perfectGames: 0, bestTimes: { easy: null, medium: null, hard: null }, totalPlaytime: 0 },
        sudoku: { gamesPlayed: 0, completions: 0, perfectGames: 0, bestTimes: { easy: null, medium: null, hard: null, expert: null }, totalPlaytime: 0 },
        crossword: { puzzlesCompleted: 0, perfectSolves: 0, averageTime: 0, totalPlaytime: 0 },
      },
      recentActivity: [],
      isInitialized: false,
    });
  });

  describe('Profile Creation', () => {
    it('should create a new profile', () => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');

      const { profile } = useProfileStore.getState();
      expect(profile).not.toBeNull();
      expect(profile?.username).toBe('TestUser');
      expect(profile?.displayName).toBe('TestUser');
      expect(profile?.avatar).toBe('🎮');
      expect(profile?.level).toBe(1);
      expect(profile?.xp).toBe(0);
    });

    it('should set isInitialized to true after profile creation', () => {
      const store = useProfileStore.getState();
      expect(store.isInitialized).toBe(false);

      store.createProfile('TestUser', '🎮');

      const { isInitialized } = useProfileStore.getState();
      expect(isInitialized).toBe(true);
    });

    it('should save profile to localStorage', () => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');

      const saved = localStorage.getItem('user_profile');
      expect(saved).not.toBeNull();

      const profile = JSON.parse(saved!);
      expect(profile.username).toBe('TestUser');
      expect(profile.avatar).toBe('🎮');
    });

    it('should create profile with default preferences', () => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');

      const { profile } = useProfileStore.getState();
      expect(profile?.preferences).toEqual({
        theme: 'auto',
        soundEnabled: true,
        volume: 0.7,
        autoSave: true,
        showHints: true,
        confirmActions: false,
        reducedAnimations: false,
      });
    });

    it('should generate unique profile ID', () => {
      const store = useProfileStore.getState();

      vi.spyOn(Date, 'now').mockReturnValue(1234567890);
      store.createProfile('User1', '🎮');
      const profile1 = useProfileStore.getState().profile;

      vi.spyOn(Date, 'now').mockReturnValue(9876543210);
      useProfileStore.setState({ profile: null });
      store.createProfile('User2', '🎯');
      const profile2 = useProfileStore.getState().profile;

      expect(profile1?.id).not.toBe(profile2?.id);
    });
  });

  describe('Profile Updates', () => {
    beforeEach(() => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
    });

    it('should update profile fields', () => {
      const store = useProfileStore.getState();
      store.updateProfile({ displayName: 'New Name', bio: 'Test bio' });

      const { profile } = useProfileStore.getState();
      expect(profile?.displayName).toBe('New Name');
      expect(profile?.bio).toBe('Test bio');
      expect(profile?.username).toBe('TestUser'); // Unchanged
    });

    it('should update lastActive timestamp on profile update', () => {
      const store = useProfileStore.getState();
      const initialLastActive = store.profile?.lastActive;

      // Wait a bit and update
      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);

      store.updateProfile({ bio: 'Updated' });

      const { profile } = useProfileStore.getState();
      expect(profile?.lastActive).not.toBe(initialLastActive);

      vi.useRealTimers();
    });

    it('should update preferences', () => {
      const store = useProfileStore.getState();
      store.updatePreferences({ soundEnabled: false, volume: 0.5 });

      const { profile } = useProfileStore.getState();
      expect(profile?.preferences.soundEnabled).toBe(false);
      expect(profile?.preferences.volume).toBe(0.5);
      expect(profile?.preferences.theme).toBe('auto'); // Unchanged
    });

    it('should not update profile if profile is null', () => {
      useProfileStore.setState({ profile: null });

      const store = useProfileStore.getState();
      store.updateProfile({ displayName: 'Should Not Work' });

      const { profile } = useProfileStore.getState();
      expect(profile).toBeNull();
    });
  });

  describe('XP and Leveling', () => {
    beforeEach(() => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
    });

    it('should add XP to profile', () => {
      const store = useProfileStore.getState();
      store.addXP(100, 'Test reward');

      const { profile } = useProfileStore.getState();
      expect(profile?.xp).toBe(100);
    });

    it('should level up when XP threshold reached', () => {
      const store = useProfileStore.getState();

      // Level 1 starts at 0 XP, level 2 requires 400 XP
      store.addXP(400, 'Level up test');

      const { profile } = useProfileStore.getState();
      expect(profile?.level).toBeGreaterThanOrEqual(2);
    });

    it('should handle multiple XP additions', () => {
      const store = useProfileStore.getState();

      store.addXP(50, 'First');
      store.addXP(75, 'Second');
      store.addXP(100, 'Third');

      const { profile } = useProfileStore.getState();
      expect(profile?.xp).toBe(225);
    });

    it('should calculate level correctly from XP', () => {
      const store = useProfileStore.getState();

      // 10,000 XP should be level 10
      store.addXP(10000, 'Big reward');

      const { profile } = useProfileStore.getState();
      expect(profile?.level).toBe(10);
    });

    it('should not add XP if profile is null', () => {
      useProfileStore.setState({ profile: null });

      const store = useProfileStore.getState();
      store.addXP(100, 'Should not work');

      const { profile } = useProfileStore.getState();
      expect(profile).toBeNull();
    });
  });

  describe('Achievement System', () => {
    beforeEach(() => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
    });

    it('should unlock welcome achievement on profile creation', () => {
      const { achievements } = useProfileStore.getState();
      const welcomeAchievement = achievements.find(a => a.id === 'welcome');

      expect(welcomeAchievement?.unlocked).toBe(true);
    });

    it('should unlock achievement by ID', () => {
      // Manually add an achievement to test
      useProfileStore.setState({
        achievements: [
          {
            id: 'test_achievement',
            title: 'Test',
            description: 'Test achievement',
            icon: '🎯',
            category: 'global',
            requirement: 1,
            tier: 'bronze',
            xpReward: 50,
            progress: 0,
            unlocked: false,
          },
        ],
      });

      const store = useProfileStore.getState();
      store.unlockAchievement('test_achievement');

      const { achievements } = useProfileStore.getState();
      const achievement = achievements.find(a => a.id === 'test_achievement');

      expect(achievement?.unlocked).toBe(true);
      expect(achievement?.progress).toBe(1);
      expect(achievement?.unlockedAt).toBeDefined();
    });

    it('should award XP when unlocking achievement', () => {
      useProfileStore.setState({
        achievements: [
          {
            id: 'test_achievement',
            title: 'Test',
            description: 'Test achievement',
            icon: '🎯',
            category: 'global',
            requirement: 1,
            tier: 'bronze',
            xpReward: 150,
            progress: 0,
            unlocked: false,
          },
        ],
      });

      const initialXP = useProfileStore.getState().profile?.xp || 0;

      const store = useProfileStore.getState();
      store.unlockAchievement('test_achievement');

      const { profile } = useProfileStore.getState();
      expect(profile?.xp).toBe(initialXP + 150);
    });

    it('should not unlock already unlocked achievement', () => {
      useProfileStore.setState({
        achievements: [
          {
            id: 'test_achievement',
            title: 'Test',
            description: 'Test achievement',
            icon: '🎯',
            category: 'global',
            requirement: 1,
            tier: 'bronze',
            xpReward: 50,
            progress: 1,
            unlocked: true,
            unlockedAt: '2024-01-01',
          },
        ],
      });

      const initialXP = useProfileStore.getState().profile?.xp || 0;

      const store = useProfileStore.getState();
      store.unlockAchievement('test_achievement');

      const { profile } = useProfileStore.getState();
      expect(profile?.xp).toBe(initialXP); // No XP awarded
    });

    it('should not unlock non-existent achievement', () => {
      const store = useProfileStore.getState();
      const initialState = { ...useProfileStore.getState() };

      store.unlockAchievement('non_existent_achievement');

      const newState = useProfileStore.getState();
      expect(newState.achievements).toEqual(initialState.achievements);
    });

    it('should unlock level 10 achievement when reaching level 10', () => {
      useProfileStore.setState({
        achievements: [
          {
            id: 'level_10',
            title: 'Level 10',
            description: 'Reach level 10',
            icon: '⭐',
            category: 'global',
            requirement: 10,
            tier: 'silver',
            xpReward: 200,
            progress: 0,
            unlocked: false,
          },
        ],
      });

      const store = useProfileStore.getState();
      // Add enough XP to reach level 10 (12,100 XP for level 10)
      store.addXP(12100, 'Reach level 10');

      const { achievements, profile } = useProfileStore.getState();
      const level10Achievement = achievements.find(a => a.id === 'level_10');

      expect(profile?.level).toBeGreaterThanOrEqual(10);
      expect(level10Achievement?.unlocked).toBe(true);
    });
  });

  describe('Achievement Checking', () => {
    beforeEach(() => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
    });

    it('should check and unlock tic-tac-toe achievements based on stats', () => {
      useProfileStore.setState({
        achievements: [
          {
            id: 'ttt_first_win',
            title: 'First Win',
            description: 'Win first game',
            icon: '🎉',
            category: 'tictactoe',
            requirement: 1,
            tier: 'bronze',
            xpReward: 50,
            progress: 0,
            unlocked: false,
          },
        ],
        gameStats: {
          ...useProfileStore.getState().gameStats,
          tictactoe: {
            gamesPlayed: 1,
            wins: 1,
            losses: 0,
            draws: 0,
            winRate: 100,
            bestStreak: 1,
            totalPlaytime: 60,
          },
        },
      });

      const store = useProfileStore.getState();
      store.checkAchievements();

      const { achievements } = useProfileStore.getState();
      const firstWin = achievements.find(a => a.id === 'ttt_first_win');

      expect(firstWin?.unlocked).toBe(true);
    });

    it('should check memory game achievements', () => {
      useProfileStore.setState({
        achievements: [
          {
            id: 'mem_first_win',
            title: 'Memory First Win',
            description: 'Complete first memory game',
            icon: '🧠',
            category: 'memory',
            requirement: 1,
            tier: 'bronze',
            xpReward: 50,
            progress: 0,
            unlocked: false,
          },
        ],
        gameStats: {
          ...useProfileStore.getState().gameStats,
          memory: {
            gamesPlayed: 1,
            gamesWon: 1,
            perfectGames: 0,
            bestTimes: { easy: 30, medium: null, hard: null },
            totalPlaytime: 30,
          },
        },
      });

      const store = useProfileStore.getState();
      store.checkAchievements();

      const { achievements } = useProfileStore.getState();
      const memFirstWin = achievements.find(a => a.id === 'mem_first_win');

      expect(memFirstWin?.unlocked).toBe(true);
    });

    it('should check sudoku achievements', () => {
      useProfileStore.setState({
        achievements: [
          {
            id: 'sud_first_complete',
            title: 'Sudoku Complete',
            description: 'Complete first sudoku',
            icon: '📊',
            category: 'sudoku',
            requirement: 1,
            tier: 'bronze',
            xpReward: 50,
            progress: 0,
            unlocked: false,
          },
        ],
        gameStats: {
          ...useProfileStore.getState().gameStats,
          sudoku: {
            gamesPlayed: 1,
            completions: 1,
            perfectGames: 0,
            bestTimes: { easy: 300, medium: null, hard: null, expert: null },
            totalPlaytime: 300,
          },
        },
      });

      const store = useProfileStore.getState();
      store.checkAchievements();

      const { achievements } = useProfileStore.getState();
      const sudFirstComplete = achievements.find(a => a.id === 'sud_first_complete');

      expect(sudFirstComplete?.unlocked).toBe(true);
    });

    it('should check streak achievements', () => {
      useProfileStore.setState({
        achievements: [
          {
            id: 'streak_7',
            title: '7 Day Streak',
            description: 'Play for 7 days',
            icon: '🔥',
            category: 'global',
            requirement: 7,
            tier: 'silver',
            xpReward: 150,
            progress: 0,
            unlocked: false,
          },
        ],
        streak: {
          current: 7,
          longest: 7,
          lastPlayedDate: new Date().toDateString(),
        },
      });

      const store = useProfileStore.getState();
      store.checkAchievements();

      const { achievements } = useProfileStore.getState();
      const streak7 = achievements.find(a => a.id === 'streak_7');

      expect(streak7?.unlocked).toBe(true);
    });

    it('should not unlock achievements if requirements not met', () => {
      useProfileStore.setState({
        achievements: [
          {
            id: 'ttt_10_wins',
            title: '10 Wins',
            description: 'Win 10 games',
            icon: '⚡',
            category: 'tictactoe',
            requirement: 10,
            tier: 'silver',
            xpReward: 100,
            progress: 0,
            unlocked: false,
          },
        ],
        gameStats: {
          ...useProfileStore.getState().gameStats,
          tictactoe: {
            gamesPlayed: 5,
            wins: 5, // Less than 10
            losses: 0,
            draws: 0,
            winRate: 100,
            bestStreak: 5,
            totalPlaytime: 300,
          },
        },
      });

      const store = useProfileStore.getState();
      store.checkAchievements();

      const { achievements } = useProfileStore.getState();
      const ttt10Wins = achievements.find(a => a.id === 'ttt_10_wins');

      expect(ttt10Wins?.unlocked).toBe(false);
    });
  });

  describe('Streak System', () => {
    beforeEach(() => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
    });

    it('should start streak on first play', () => {
      const store = useProfileStore.getState();
      store.updateStreak();

      const { streak } = useProfileStore.getState();
      expect(streak.current).toBe(1);
      expect(streak.longest).toBe(1);
      expect(streak.lastPlayedDate).toBe(new Date().toDateString());
    });

    it('should not increment streak if played same day', () => {
      const store = useProfileStore.getState();
      store.updateStreak();

      const { streak: firstStreak } = useProfileStore.getState();
      const firstCurrent = firstStreak.current;

      // Try to update again same day
      store.updateStreak();

      const { streak: secondStreak } = useProfileStore.getState();
      expect(secondStreak.current).toBe(firstCurrent);
    });

    it('should continue streak if played yesterday', () => {
      const store = useProfileStore.getState();

      // Set last played to yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      useProfileStore.setState({
        streak: {
          current: 5,
          longest: 5,
          lastPlayedDate: yesterday.toDateString(),
        },
      });

      store.updateStreak();

      const { streak } = useProfileStore.getState();
      expect(streak.current).toBe(6);
      expect(streak.longest).toBe(6);
    });

    it('should reset streak if missed a day', () => {
      const store = useProfileStore.getState();

      // Set last played to 2 days ago
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      useProfileStore.setState({
        streak: {
          current: 5,
          longest: 10,
          lastPlayedDate: twoDaysAgo.toDateString(),
        },
      });

      store.updateStreak();

      const { streak } = useProfileStore.getState();
      expect(streak.current).toBe(1);
      expect(streak.longest).toBe(10); // Longest should remain
    });

    it('should update longest streak when current exceeds it', () => {
      const store = useProfileStore.getState();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      useProfileStore.setState({
        streak: {
          current: 10,
          longest: 8,
          lastPlayedDate: yesterday.toDateString(),
        },
      });

      store.updateStreak();

      const { streak } = useProfileStore.getState();
      expect(streak.longest).toBe(11);
    });
  });

  describe('Game Stats', () => {
    beforeEach(() => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
    });

    it('should update tic-tac-toe stats', () => {
      const store = useProfileStore.getState();
      store.updateGameStats('tictactoe', { wins: 5, gamesPlayed: 10 });

      const { gameStats } = useProfileStore.getState();
      expect(gameStats.tictactoe.wins).toBe(5);
      expect(gameStats.tictactoe.gamesPlayed).toBe(10);
    });

    it('should update memory game stats', () => {
      const store = useProfileStore.getState();
      store.updateGameStats('memory', { gamesWon: 3, perfectGames: 1 });

      const { gameStats } = useProfileStore.getState();
      expect(gameStats.memory.gamesWon).toBe(3);
      expect(gameStats.memory.perfectGames).toBe(1);
    });

    it('should update sudoku stats', () => {
      const store = useProfileStore.getState();
      store.updateGameStats('sudoku', { completions: 20, perfectGames: 5 });

      const { gameStats } = useProfileStore.getState();
      expect(gameStats.sudoku.completions).toBe(20);
      expect(gameStats.sudoku.perfectGames).toBe(5);
    });

    it('should update crossword stats', () => {
      const store = useProfileStore.getState();
      store.updateGameStats('crossword', { puzzlesCompleted: 15, perfectSolves: 8 });

      const { gameStats } = useProfileStore.getState();
      expect(gameStats.crossword.puzzlesCompleted).toBe(15);
      expect(gameStats.crossword.perfectSolves).toBe(8);
    });

    it('should save stats to localStorage', () => {
      const store = useProfileStore.getState();
      store.updateGameStats('tictactoe', { wins: 5 });

      const saved = localStorage.getItem('user_game_stats');
      expect(saved).not.toBeNull();

      const stats = JSON.parse(saved!);
      expect(stats.tictactoe.wins).toBe(5);
    });
  });

  describe('Recent Activity', () => {
    beforeEach(() => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
    });

    it('should add activity to recent activity list', () => {
      const store = useProfileStore.getState();
      store.addActivity({
        type: 'achievement',
        game: 'tictactoe',
        description: 'Won first game',
        xpGained: 50,
      });

      const { recentActivity } = useProfileStore.getState();
      expect(recentActivity).toHaveLength(1);
      expect(recentActivity[0].description).toBe('Won first game');
      expect(recentActivity[0].xpGained).toBe(50);
    });

    it('should add activity with id and timestamp', () => {
      const store = useProfileStore.getState();
      store.addActivity({
        type: 'game_complete',
        game: 'sudoku',
        description: 'Completed puzzle',
        xpGained: 100,
      });

      const { recentActivity } = useProfileStore.getState();
      expect(recentActivity[0].id).toBeDefined();
      expect(recentActivity[0].timestamp).toBeDefined();
    });

    it('should keep only last 50 activities', () => {
      const store = useProfileStore.getState();

      // Add 60 activities
      for (let i = 0; i < 60; i++) {
        store.addActivity({
          type: 'game_complete',
          game: 'tictactoe',
          description: `Activity ${i}`,
          xpGained: 10,
        });
      }

      const { recentActivity } = useProfileStore.getState();
      expect(recentActivity).toHaveLength(50);
      // Most recent should be last activity added
      expect(recentActivity[0].description).toBe('Activity 59');
    });

    it('should add new activities to the beginning', () => {
      const store = useProfileStore.getState();

      store.addActivity({
        type: 'game_complete',
        game: 'memory',
        description: 'First activity',
        xpGained: 10,
      });

      store.addActivity({
        type: 'game_complete',
        game: 'sudoku',
        description: 'Second activity',
        xpGained: 20,
      });

      const { recentActivity } = useProfileStore.getState();
      expect(recentActivity[0].description).toBe('Second activity');
      expect(recentActivity[1].description).toBe('First activity');
    });
  });

  describe('Getters', () => {
    beforeEach(() => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
    });

    describe('getTotalGamesPlayed', () => {
      it('should return total games played across all games', () => {
        useProfileStore.setState({
          gameStats: {
            tictactoe: { gamesPlayed: 10, wins: 5, losses: 3, draws: 2, winRate: 50, bestStreak: 3, totalPlaytime: 600 },
            memory: { gamesPlayed: 8, gamesWon: 5, perfectGames: 2, bestTimes: { easy: 30, medium: null, hard: null }, totalPlaytime: 240 },
            sudoku: { gamesPlayed: 15, completions: 12, perfectGames: 3, bestTimes: { easy: 300, medium: null, hard: null, expert: null }, totalPlaytime: 4500 },
            crossword: { puzzlesCompleted: 7, perfectSolves: 4, averageTime: 120, totalPlaytime: 840 },
          },
        });

        const store = useProfileStore.getState();
        const total = store.getTotalGamesPlayed();

        expect(total).toBe(40); // 10 + 8 + 15 + 7
      });

      it('should return 0 when no games played', () => {
        const store = useProfileStore.getState();
        const total = store.getTotalGamesPlayed();

        expect(total).toBe(0);
      });
    });

    describe('getFavoriteGame', () => {
      it('should return game with most plays', () => {
        useProfileStore.setState({
          gameStats: {
            tictactoe: { gamesPlayed: 5, wins: 3, losses: 2, draws: 0, winRate: 60, bestStreak: 2, totalPlaytime: 300 },
            memory: { gamesPlayed: 20, gamesWon: 15, perfectGames: 5, bestTimes: { easy: 30, medium: null, hard: null }, totalPlaytime: 600 },
            sudoku: { gamesPlayed: 10, completions: 8, perfectGames: 2, bestTimes: { easy: 300, medium: null, hard: null, expert: null }, totalPlaytime: 3000 },
            crossword: { puzzlesCompleted: 3, perfectSolves: 2, averageTime: 120, totalPlaytime: 360 },
          },
        });

        const store = useProfileStore.getState();
        const favorite = store.getFavoriteGame();

        expect(favorite).toBe('Memory Match');
      });

      it('should return "None" when no games played', () => {
        const store = useProfileStore.getState();
        const favorite = store.getFavoriteGame();

        expect(favorite).toBe('None');
      });
    });

    describe('getCompletionRate', () => {
      it('should calculate completion rate correctly', () => {
        useProfileStore.setState({
          gameStats: {
            tictactoe: { gamesPlayed: 10, wins: 6, losses: 4, draws: 0, winRate: 60, bestStreak: 3, totalPlaytime: 600 },
            memory: { gamesPlayed: 10, gamesWon: 8, perfectGames: 3, bestTimes: { easy: 30, medium: null, hard: null }, totalPlaytime: 300 },
            sudoku: { gamesPlayed: 10, completions: 7, perfectGames: 2, bestTimes: { easy: 300, medium: null, hard: null, expert: null }, totalPlaytime: 3000 },
            crossword: { puzzlesCompleted: 9, perfectSolves: 5, averageTime: 120, totalPlaytime: 1080 },
          },
        });

        const store = useProfileStore.getState();
        const rate = store.getCompletionRate();

        // (6 + 8 + 7 + 9) / (10 + 10 + 10 + 9) = 30 / 39 ≈ 77%
        expect(rate).toBeGreaterThan(75);
        expect(rate).toBeLessThan(80);
      });

      it('should return 0 when no games played', () => {
        const store = useProfileStore.getState();
        const rate = store.getCompletionRate();

        expect(rate).toBe(0);
      });

      it('should return 100 when all games completed', () => {
        useProfileStore.setState({
          gameStats: {
            tictactoe: { gamesPlayed: 5, wins: 5, losses: 0, draws: 0, winRate: 100, bestStreak: 5, totalPlaytime: 300 },
            memory: { gamesPlayed: 5, gamesWon: 5, perfectGames: 3, bestTimes: { easy: 30, medium: null, hard: null }, totalPlaytime: 150 },
            sudoku: { gamesPlayed: 5, completions: 5, perfectGames: 2, bestTimes: { easy: 300, medium: null, hard: null, expert: null }, totalPlaytime: 1500 },
            crossword: { puzzlesCompleted: 5, perfectSolves: 3, averageTime: 120, totalPlaytime: 600 },
          },
        });

        const store = useProfileStore.getState();
        const rate = store.getCompletionRate();

        expect(rate).toBe(100);
      });
    });

    describe('getXPForNextLevel', () => {
      it('should return XP required for next level', () => {
        const store = useProfileStore.getState();
        const xpForNext = store.getXPForNextLevel();

        // Profile starts at level 1, so next level is 2
        // Level 2 requires (1+1)² × 100 = 400 XP
        expect(xpForNext).toBe(400);
      });

      it('should return correct XP for higher levels', () => {
        const store = useProfileStore.getState();
        store.updateProfile({ level: 10, xp: 10000 });

        const xpForNext = store.getXPForNextLevel();

        // Next level is 11, requires (10+1)² × 100 = 12,100 XP
        expect(xpForNext).toBe(12100);
      });

      it('should return 0 if profile is null', () => {
        useProfileStore.setState({ profile: null });

        const store = useProfileStore.getState();
        const xpForNext = store.getXPForNextLevel();

        expect(xpForNext).toBe(0);
      });
    });

    describe('getLevelProgress', () => {
      it('should calculate level progress percentage', () => {
        const store = useProfileStore.getState();

        // Level 1: 0-100 XP, Level 2: 100-400 XP
        // At 50 XP, progress should be 50%
        store.updateProfile({ level: 1, xp: 50 });

        const progress = store.getLevelProgress();
        expect(progress).toBe(50);
      });

      it('should return 0 at start of level', () => {
        const store = useProfileStore.getState();
        store.updateProfile({ level: 1, xp: 0 });

        const progress = store.getLevelProgress();
        expect(progress).toBe(0);
      });

      it('should return 0 if profile is null', () => {
        useProfileStore.setState({ profile: null });

        const store = useProfileStore.getState();
        const progress = store.getLevelProgress();

        expect(progress).toBe(0);
      });
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should save achievements to localStorage', () => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');

      const saved = localStorage.getItem('user_achievements');
      expect(saved).not.toBeNull();
    });

    it('should save streak to localStorage', () => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
      store.updateStreak();

      const saved = localStorage.getItem('user_streak');
      expect(saved).not.toBeNull();

      const streak = JSON.parse(saved!);
      expect(streak.current).toBeGreaterThan(0);
    });

    it('should save recent activity to localStorage', () => {
      const store = useProfileStore.getState();
      store.createProfile('TestUser', '🎮');
      store.addActivity({
        type: 'game_complete',
        game: 'tictactoe',
        description: 'Test activity',
        xpGained: 50,
      });

      const saved = localStorage.getItem('user_activities');
      expect(saved).not.toBeNull();

      const activities = JSON.parse(saved!);
      expect(activities).toHaveLength(1);
    });
  });
});
