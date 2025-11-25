import { create } from "zustand";
import { ProfileState, UserProfile, Achievement, GameStats, PlayStreak, RecentActivity } from "@/types/profile";
import { getInitialAchievements, getLevelFromXP, getXPForLevel } from "@/lib/achievements";

// Load profile from localStorage
const loadProfile = (): UserProfile | null => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("user_profile");
    return saved ? JSON.parse(saved) : null;
};

// Load achievements from localStorage
const loadAchievements = (): Achievement[] => {
    if (typeof window === "undefined") return getInitialAchievements();
    const saved = localStorage.getItem("user_achievements");
    return saved ? JSON.parse(saved) : getInitialAchievements();
};

// Load game stats 
const loadGameStats = (): GameStats => {
    if (typeof window === "undefined") {
        return {
            tictactoe: { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, winRate: 0, bestStreak: 0, totalPlaytime: 0 },
            memory: { gamesPlayed: 0, gamesWon: 0, perfectGames: 0, bestTimes: { easy: null, medium: null, hard: null }, totalPlaytime: 0 },
            sudoku: { gamesPlayed: 0, completions: 0, perfectGames: 0, bestTimes: { easy: null, medium: null, hard: null, expert: null }, totalPlaytime: 0 },
            crossword: { puzzlesCompleted: 0, perfectSolves: 0, averageTime: 0, totalPlaytime: 0 },
        };
    }
    const saved = localStorage.getItem("user_game_stats");
    if (saved) return JSON.parse(saved);

    return {
        tictactoe: { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, winRate: 0, bestStreak: 0, totalPlaytime: 0 },
        memory: { gamesPlayed: 0, gamesWon: 0, perfectGames: 0, bestTimes: { easy: null, medium: null, hard: null }, totalPlaytime: 0 },
        sudoku: { gamesPlayed: 0, completions: 0, perfectGames: 0, bestTimes: { easy: null, medium: null, hard: null, expert: null }, totalPlaytime: 0 },
        crossword: { puzzlesCompleted: 0, perfectSolves: 0, averageTime: 0, totalPlaytime: 0 },
    };
};

// Load streak
const loadStreak = (): PlayStreak => {
    if (typeof window === "undefined") return { current: 0, longest: 0, lastPlayedDate: "" };
    const saved = localStorage.getItem("user_streak");
    return saved ? JSON.parse(saved) : { current: 0, longest: 0, lastPlayedDate: "" };
};

// Load recent activity
const loadActivity = (): RecentActivity[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("user_activities");
    return saved ? JSON.parse(saved) : [];
};

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: loadProfile(),
    achievements: loadAchievements(),
    streak: loadStreak(),
    gameStats: loadGameStats(),
    recentActivity: loadActivity(),
    isInitialized: loadProfile() !== null,

    createProfile: (username: string, avatar: string) => {
        const newProfile: UserProfile = {
            id: `user-${Date.now()}`,
            username,
            displayName: username,
            avatar,
            bio: "",
            createdAt: new Date().toISOString(),
            level: 1,
            xp: 0,
            totalPlaytime: 0,
            lastActive: new Date().toISOString(),
            preferences: {
                theme: "auto",
                soundEnabled: true,
                volume: 0.7,
                autoSave: true,
                showHints: true,
                confirmActions: false,
                reducedAnimations: false,
            },
        };

        set({ profile: newProfile, isInitialized: true });

        // Save to localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("user_profile", JSON.stringify(newProfile));
        }

        // Unlock welcome achievement
        get().unlockAchievement("welcome");
        get().updateStreak();
    },

    updateProfile: (updates: Partial<UserProfile>) => {
        const { profile } = get();
        if (!profile) return;

        const updatedProfile = { ...profile, ...updates, lastActive: new Date().toISOString() };
        set({ profile: updatedProfile });

        if (typeof window !== "undefined") {
            localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
        }
    },

    updatePreferences: (prefs: Partial<UserProfile["preferences"]>) => {
        const { profile } = get();
        if (!profile) return;

        const updatedProfile = {
            ...profile,
            preferences: { ...profile.preferences, ...prefs },
        };

        set({ profile: updatedProfile });

        if (typeof window !== "undefined") {
            localStorage.setItem("user_profile", JSON.stringify(updatedProfile));
        }
    },

    addXP: (amount: number, reason: string) => {
        const { profile } = get();
        if (!profile) return;

        const newXP = profile.xp + amount;
        const newLevel = getLevelFromXP(newXP);
        const leveledUp = newLevel > profile.level;

        get().updateProfile({ xp: newXP, level: newLevel });

        // Check for level achievements
        if (leveledUp) {
            if (newLevel === 10) get().unlockAchievement("level_10");
            if (newLevel === 25) get().unlockAchievement("level_25");
            if (newLevel === 50) get().unlockAchievement("level_50");
        }
    },

    checkAchievements: () => {
        const { achievements, gameStats, streak, profile } = get();
        if (!profile) return;

        let updated = false;

        achievements.forEach((achievement) => {
            if (achievement.unlocked) return;

            let currentProgress = 0;

            // Check achievement criteria based on ID
            switch (achievement.id) {
                // Tic Tac Toe
                case "ttt_first_win":
                    currentProgress = gameStats.tictactoe.wins >= 1 ? 1 : 0;
                    break;
                case "ttt_10_wins":
                    currentProgress = gameStats.tictactoe.wins;
                    break;
                case "ttt_50_wins":
                    currentProgress = gameStats.tictactoe.wins;
                    break;
                case "ttt_win_streak_5":
                    currentProgress = gameStats.tictactoe.bestStreak >= 5 ? 5 : 0;
                    break;
                case "ttt_win_streak_10":
                    currentProgress = gameStats.tictactoe.bestStreak >= 10 ? 10 : 0;
                    break;
                case "ttt_100_games":
                    currentProgress = gameStats.tictactoe.gamesPlayed;
                    break;

                // Memory Match
                case "mem_first_win":
                    currentProgress = gameStats.memory.gamesWon >= 1 ? 1 : 0;
                    break;
                case "mem_perfect_easy":
                    currentProgress = gameStats.memory.perfectGames >= 1 ? 1 : 0;
                    break;
                case "mem_50_games":
                    currentProgress = gameStats.memory.gamesPlayed;
                    break;
                case "mem_10_perfect":
                    currentProgress = gameStats.memory.perfectGames;
                    break;

                // Sudoku
                case "sud_first_complete":
                    currentProgress = gameStats.sudoku.completions >= 1 ? 1 : 0;
                    break;
                case "sud_perfect":
                    currentProgress = gameStats.sudoku.perfectGames >= 1 ? 1 : 0;
                    break;
                case "sud_100_puzzles":
                    currentProgress = gameStats.sudoku.completions;
                    break;

                // Crossword
                case "cw_first_complete":
                    currentProgress = gameStats.crossword.puzzlesCompleted >= 1 ? 1 : 0;
                    break;
                case "cw_perfect":
                    currentProgress = gameStats.crossword.perfectSolves >= 1 ? 1 : 0;
                    break;
                case "cw_50_complete":
                    currentProgress = gameStats.crossword.puzzlesCompleted;
                    break;

                // Global
                case "streak_7":
                    currentProgress = streak.longest >= 7 ? 7 : 0;
                    break;
                case "streak_30":
                    currentProgress = streak.longest >= 30 ? 30 : 0;
                    break;
                case "level_10":
                    currentProgress = profile.level >= 10 ? 10 : 0;
                    break;
                case "level_25":
                    currentProgress = profile.level >= 25 ? 25 : 0;
                    break;
                case "level_50":
                    currentProgress = profile.level >= 50 ? 50 : 0;
                    break;
            }

            if (currentProgress >= achievement.requirement && !achievement.unlocked) {
                get().unlockAchievement(achievement.id);
                updated = true;
            }
        });

        if (updated) {
            if (typeof window !== "undefined") {
                localStorage.setItem("user_achievements", JSON.stringify(get().achievements));
            }
        }
    },

    unlockAchievement: (id: string) => {
        const { achievements } = get();

        const index = achievements.findIndex((a) => a.id === id);
        if (index === -1 || achievements[index].unlocked) return;

        const updated = [...achievements];
        updated[index] = {
            ...updated[index],
            unlocked: true,
            unlockedAt: new Date().toISOString(),
            progress: updated[index].requirement,
        };

        set({ achievements: updated });

        // Award XP
        get().addXP(updated[index].xpReward, `Unlocked achievement: ${updated[index].title}`);

        // Save to localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("user_achievements", JSON.stringify(updated));
        }
    },

    updateStreak: () => {
        const { streak } = get();
        const today = new Date().toDateString();
        const lastPlayed = new Date(streak.lastPlayedDate || today).toDateString();

        if (today === lastPlayed) return; // Already counted today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak = { ...streak };

        if (lastPlayed === yesterdayStr) {
            // Continue streak
            newStreak.current++;
            if (newStreak.current > newStreak.longest) {
                newStreak.longest = newStreak.current;
            }
        } else {
            // Streak broken
            newStreak.current = 1;
        }

        newStreak.lastPlayedDate = today;
        set({ streak: newStreak });

        // Save to localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("user_streak", JSON.stringify(newStreak));
        }

        // Check streak achievements
        get().checkAchievements();
    },

    addActivity: (activity: Omit<RecentActivity, "id" | "timestamp">) => {
        const newActivity: RecentActivity = {
            ...activity,
            id: `activity-${Date.now()}`,
            timestamp: new Date().toISOString(),
        };

        const updated = [newActivity, ...get().recentActivity].slice(0, 50); // Keep last 50
        set({ recentActivity: updated });

        if (typeof window !== "undefined") {
            localStorage.setItem("user_activities", JSON.stringify(updated));
        }
    },

    updateGameStats: (game: keyof GameStats, updates: any) => {
        const { gameStats } = get();
        const updated = {
            ...gameStats,
            [game]: { ...gameStats[game], ...updates },
        };

        set({ gameStats: updated });

        if (typeof window !== "undefined") {
            localStorage.setItem("user_game_stats", JSON.stringify(updated));
        }
    },

    // Getters
    getTotalGamesPlayed: () => {
        const { gameStats } = get();
        return (
            gameStats.tictactoe.gamesPlayed +
            gameStats.memory.gamesPlayed +
            gameStats.sudoku.gamesPlayed +
            gameStats.crossword.puzzlesCompleted
        );
    },

    getFavoriteGame: () => {
        const { gameStats } = get();
        const games = [
            { name: "Tic Tac Toe", count: gameStats.tictactoe.gamesPlayed },
            { name: "Memory Match", count: gameStats.memory.gamesPlayed },
            { name: "Sudoku", count: gameStats.sudoku.gamesPlayed },
            { name: "Crossword", count: gameStats.crossword.puzzlesCompleted },
        ];

        games.sort((a, b) => b.count - a.count);
        return games[0].count > 0 ? games[0].name : "None";
    },

    getCompletionRate: () => {
        const { gameStats } = get();
        const total = get().getTotalGamesPlayed();
        if (total === 0) return 0;

        const completed =
            gameStats.tictactoe.wins +
            gameStats.memory.gamesWon +
            gameStats.sudoku.completions +
            gameStats.crossword.puzzlesCompleted;

        return Math.round((completed / total) * 100);
    },

    getXPForNextLevel: () => {
        const { profile } = get();
        if (!profile) return 0;
        return getXPForLevel(profile.level);
    },

    getLevelProgress: () => {
        const { profile } = get();
        if (!profile) return 0;

        const currentLevelXP = profile.level * profile.level * 100;
        const nextLevelXP = getXPForLevel(profile.level);
        const progress = profile.xp - currentLevelXP;
        const required = nextLevelXP - currentLevelXP;

        return Math.round((progress / required) * 100);
    },
}));
