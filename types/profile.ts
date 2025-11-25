export interface UserProfile {
    id: string;
    username: string;
    displayName: string;
    avatar: string; // Emoji or avatar ID
    bio: string;
    createdAt: string;
    level: number;
    xp: number;
    totalPlaytime: number; // seconds
    lastActive: string;
    preferences: UserPreferences;
}

export interface UserPreferences {
    theme: "light" | "dark" | "auto";
    soundEnabled: boolean;
    volume: number;
    autoSave: boolean;
    showHints: boolean;
    confirmActions: boolean;
    reducedAnimations: boolean;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: "tictactoe" | "memory" | "sudoku" | "crossword" | "global";
    requirement: number;
    progress: number;
    unlocked: boolean;
    unlockedAt?: string;
    tier: "bronze" | "silver" | "gold" | "platinum";
    xpReward: number;
}

export interface PlayStreak {
    current: number; // days
    longest: number;
    lastPlayedDate: string;
}

export interface GameStats {
    tictactoe: {
        gamesPlayed: number;
        wins: number;
        losses: number;
        draws: number;
        winRate: number;
        bestStreak: number;
        totalPlaytime: number;
    };
    memory: {
        gamesPlayed: number;
        gamesWon: number;
        perfectGames: number;
        bestTimes: {
            easy: number | null;
            medium: number | null;
            hard: number | null;
        };
        totalPlaytime: number;
    };
    sudoku: {
        gamesPlayed: number;
        completions: number;
        perfectGames: number;
        bestTimes: {
            easy: number | null;
            medium: number | null;
            hard: number | null;
            expert: number | null;
        };
        totalPlaytime: number;
    };
    crossword: {
        puzzlesCompleted: number;
        perfectSolves: number;
        averageTime: number;
        totalPlaytime: number;
    };
}

export interface RecentActivity {
    id: string;
    game: "tictactoe" | "memory" | "sudoku" | "crossword";
    action: string; // "Completed Easy puzzle", "Won against AI"
    timestamp: string;
    xpEarned: number;
    achievementUnlocked?: string;
}

export interface ProfileState {
    profile: UserProfile | null;
    achievements: Achievement[];
    streak: PlayStreak;
    gameStats: GameStats;
    recentActivity: RecentActivity[];
    isInitialized: boolean;
    // Actions
    createProfile: (username: string, avatar: string) => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    updatePreferences: (prefs: Partial<UserPreferences>) => void;
    addXP: (amount: number, reason: string) => void;
    checkAchievements: () => void;
    unlockAchievement: (id: string) => void;
    updateStreak: () => void;
    addActivity: (activity: Omit<RecentActivity, "id" | "timestamp">) => void;
    updateGameStats: (game: keyof GameStats, updates: any) => void;
    // Getters
    getTotalGamesPlayed: () => number;
    getFavoriteGame: () => string;
    getCompletionRate: () => number;
    getXPForNextLevel: () => number;
    getLevelProgress: () => number;
}
