import { Achievement } from "@/types/profile";

// All achievements defined here
export const ALL_ACHIEVEMENTS: Omit<Achievement, "progress" | "unlocked" | "unlockedAt">[] = [
    // ===== GLOBAL ACHIEVEMENTS =====
    {
        id: "welcome",
        title: "Welcome!",
        description: "Create your player profile",
        icon: "👋",
        category: "global",
        requirement: 1,
        tier: "bronze",
        xpReward: 50,
    },
    {
        id: "diverse_player",
        title: "Diverse Player",
        description: "Play all 4 different games",
        icon: "🎮",
        category: "global",
        requirement: 4,
        tier: "silver",
        xpReward: 100,
    },
    {
        id: "streak_7",
        title: "Dedicated",
        description: "Play for 7 days in a row",
        icon: "🔥",
        category: "global",
        requirement: 7,
        tier: "silver",
        xpReward: 150,
    },
    {
        id: "streak_30",
        title: "True Dedication",
        description: "Play for 30 days in a row",
        icon: "⭐",
        category: "global",
        requirement: 30,
        tier: "gold",
        xpReward: 500,
    },
    {
        id: "level_10",
        title: "Rising Star",
        description: "Reach level 10",
        icon: "🌟",
        category: "global",
        requirement: 10,
        tier: "silver",
        xpReward: 200,
    },
    {
        id: "level_25",
        title: "Experienced",
        description: "Reach level 25",
        icon: "💎",
        category: "global",
        requirement: 25,
        tier: "gold",
        xpReward: 500,
    },
    {
        id: "level_50",
        title: "Master",
        description: "Reach level 50",
        icon: "👑",
        category: "global",
        requirement: 50,
        tier: "platinum",
        xpReward: 1000,
    },
    {
        id: "perfectionist",
        title: "Perfectionist",
        description: "Achieve 25 perfect games across all games",
        icon: "✨",
        category: "global",
        requirement: 25,
        tier: "gold",
        xpReward: 300,
    },

    // ===== TIC TAC TOE ACHIEVEMENTS =====
    {
        id: "ttt_first_win",
        title: "First Victory",
        description: "Win your first Tic Tac Toe game",
        icon: "🎉",
        category: "tictactoe",
        requirement: 1,
        tier: "bronze",
        xpReward: 50,
    },
    {
        id: "ttt_10_wins",
        title: "Skilled Player",
        description: "Win 10 Tic Tac Toe games",
        icon: "⚡",
        category: "tictactoe",
        requirement: 10,
        tier: "silver",
        xpReward: 100,
    },
    {
        id: "ttt_50_wins",
        title: "Unbeatable",
        description: "Win 50 Tic Tac Toe games",
        icon: "🏆",
        category: "tictactoe",
        requirement: 50,
        tier: "gold",
        xpReward: 250,
    },
    {
        id: "ttt_win_streak_5",
        title: "On Fire",
        description: "Win 5 games in a row",
        icon: "🔥",
        category: "tictactoe",
        requirement: 5,
        tier: "silver",
        xpReward: 150,
    },
    {
        id: "ttt_win_streak_10",
        title: "Unstoppable",
        description: "Win 10 games in a row",
        icon: "💪",
        category: "tictactoe",
        requirement: 10,
        tier: "gold",
        xpReward: 300,
    },
    {
        id: "ttt_100_games",
        title: "Century Club",
        description: "Play 100 Tic Tac Toe games",
        icon: "💯",
        category: "tictactoe",
        requirement: 100,
        tier: "platinum",
        xpReward: 500,
    },

    // ===== MEMORY MATCH ACHIEVEMENTS =====
    {
        id: "mem_first_win",
        title: "Memory Awakens",
        description: "Complete your first Memory Match game",
        icon: "🧠",
        category: "memory",
        requirement: 1,
        tier: "bronze",
        xpReward: 50,
    },
    {
        id: "mem_perfect_easy",
        title: "Perfect Memory",
        description: "Complete Easy with minimum moves",
        icon: "✅",
        category: "memory",
        requirement: 1,
        tier: "silver",
        xpReward: 100,
    },
    {
        id: "mem_speed_demon",
        title: "Speed Demon",
        description: "Complete Easy in under 30 seconds",
        icon: "⚡",
        category: "memory",
        requirement: 1,
        tier: "gold",
        xpReward: 200,
    },
    {
        id: "mem_expert_complete",
        title: "Master Matcher",
        description: "Complete Hard difficulty",
        icon: "🎯",
        category: "memory",
        requirement: 1,
        tier: "gold",
        xpReward: 250,
    },
    {
        id: "mem_50_games",
        title: "Marathon Runner",
        description: "Play 50 Memory Match games",
        icon: "🏃",
        category: "memory",
        requirement: 50,
        tier: "gold",
        xpReward: 300,
    },
    {
        id: "mem_10_perfect",
        title: "Photographic Memory",
        description: "Achieve 10 perfect games",
        icon: "📸",
        category: "memory",
        requirement: 10,
        tier: "platinum",
        xpReward: 400,
    },

    // ===== SUDOKU ACHIEVEMENTS =====
    {
        id: "sud_first_complete",
        title: "Logic Master",
        description: "Complete your first Sudoku puzzle",
        icon: "📊",
        category: "sudoku",
        requirement: 1,
        tier: "bronze",
        xpReward: 50,
    },
    {
        id: "sud_no_mistakes",
        title: "Flawless",
        description: "Complete a puzzle without mistakes",
        icon: "💎",
        category: "sudoku",
        requirement: 1,
        tier: "silver",
        xpReward: 150,
    },
    {
        id: "sud_no_hints",
        title: "Self-Sufficient",
        description: "Complete a puzzle without hints",
        icon: "🎓",
        category: "sudoku",
        requirement: 1,
        tier: "silver",
        xpReward: 150,
    },
    {
        id: "sud_perfect",
        title: "Sudoku Perfectionist",
        description: "Complete without hints or mistakes",
        icon: "⭐",
        category: "sudoku",
        requirement: 1,
        tier: "gold",
        xpReward: 250,
    },
    {
        id: "sud_expert_complete",
        title: "Expert Solver",
        description: "Complete Expert difficulty",
        icon: "🏆",
        category: "sudoku",
        requirement: 1,
        tier: "gold",
        xpReward: 300,
    },
    {
        id: "sud_100_puzzles",
        title: "Puzzle Enthusiast",
        description: "Complete 100 Sudoku puzzles",
        icon: "🎯",
        category: "sudoku",
        requirement: 100,
        tier: "platinum",
        xpReward: 500,
    },

    // ===== CROSSWORD ACHIEVEMENTS =====
    {
        id: "cw_first_complete",
        title: "Word Wizard",
        description: "Complete your first crossword",
        icon: "📝",
        category: "crossword",
        requirement: 1,
        tier: "bronze",
        xpReward: 50,
    },
    {
        id: "cw_perfect",
        title: "Perfect Puzzle",
        description: "Complete without using hints",
        icon: "✨",
        category: "crossword",
        requirement: 1,
        tier: "silver",
        xpReward: 150,
    },
    {
        id: "cw_speed_solver",
        title: "Speed Reader",
        description: "Complete in under 2 minutes",
        icon: "⚡",
        category: "crossword",
        requirement: 1,
        tier: "gold",
        xpReward: 200,
    },
    {
        id: "cw_50_complete",
        title: "Dedicated Solver",
        description: "Complete 50 crosswords",
        icon: "🏅",
        category: "crossword",
        requirement: 50,
        tier: "gold",
        xpReward: 300,
    },
    {
        id: "cw_10_perfect",
        title: "Crossword Master",
        description: "Complete 10 perfect puzzles",
        icon: "👑",
        category: "crossword",
        requirement: 10,
        tier: "platinum",
        xpReward: 400,
    },
];

// Helper to get initial achievements with progress
export function getInitialAchievements(): Achievement[] {
    return ALL_ACHIEVEMENTS.map((achievement) => ({
        ...achievement,
        progress: 0,
        unlocked: false,
    }));
}

// Calculate XP for next level
export function getXPForLevel(level: number): number {
    return (level + 1) * (level + 1) * 100;
}

// Calculate level from XP
export function getLevelFromXP(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100));
}

// Get level tier
export function getLevelTier(level: number): {
    name: string;
    color: string;
} {
    if (level >= 51) return { name: "Master", color: "rainbow" };
    if (level >= 26) return { name: "Expert", color: "gold" };
    if (level >= 11) return { name: "Advanced", color: "purple" };
    if (level >= 1) return { name: "Intermediate", color: "green" };
    return { name: "Beginner", color: "blue" };
}
