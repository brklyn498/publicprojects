"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/profileStore";
import { motion } from "framer-motion";
import { Home, Trophy, TrendingUp, Calendar, Star, Award, ArrowLeft } from "lucide-react";
import WelcomeModal from "@/components/profile/WelcomeModal";

export default function ProfilePage() {
    const router = useRouter();
    const [showWelcome, setShowWelcome] = useState(false);
    const {
        profile,
        achievements,
        streak,
        gameStats,
        getTotalGamesPlayed,
        getFavoriteGame,
        getXPForNextLevel,
        getLevelProgress,
    } = useProfileStore();

    useEffect(() => {
        // If no profile exists, show the welcome modal
        if (!profile) {
            setShowWelcome(true);
        }
    }, [profile]);

    if (!profile) {
        return (
            <>
                {showWelcome && (
                    <WelcomeModal onComplete={() => {
                        setShowWelcome(false);
                        // Profile will be created and component will re-render
                    }} />
                )}
            </>
        );
    }

    const unlockedAchievements = achievements.filter((a) => a.unlocked);
    const totalGames = getTotalGamesPlayed();
    const favoriteGame = getFavoriteGame();
    const xpForNext = getXPForNextLevel();
    const levelProgress = getLevelProgress();

    return (
        <div className="min-h-screen bg-warm-gray dark:bg-dark-bg pb-8">
            {/* Header */}
            <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border py-6 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Player Profile
                    </h1>
                    <motion.button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-dark-highlight text-gray-700 dark:text-gray-300 font-medium transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </motion.button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-6xl">
                            {profile.avatar}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-2">{profile.username}</h2>
                            <div className="flex items-center gap-4 text-sm opacity-90">
                                <span>Level {profile.level}</span>
                                <span>•</span>
                                <span>{profile.xp} XP</span>
                                <span>•</span>
                                <span>🔥 {streak.current} day streak</span>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span>Level Progress</span>
                                    <span>{levelProgress}%</span>
                                </div>
                                <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                                    <div
                                        className="bg-white rounded-full h-3 transition-all duration-500"
                                        style={{ width: `${levelProgress}%` }}
                                    />
                                </div>
                                <p className="text-xs mt-1 opacity-75">
                                    {xpForNext - profile.xp} XP to next level
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                    >
                        <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {unlockedAchievements.length}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Achievements
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                    >
                        <TrendingUp className="w-8 h-8 text-blue-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {totalGames}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Games Played
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                    >
                        <Calendar className="w-8 h-8 text-green-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {streak.longest}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Best Streak
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                    >
                        <Star className="w-8 h-8 text-purple-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {favoriteGame}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Favorite Game
                        </p>
                    </motion.div>
                </div>

                {/* Achievements Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Award className="w-6 h-6 text-yellow-500" />
                            Recent Achievements
                        </h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {unlockedAchievements.length} / {achievements.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unlockedAchievements.slice(0, 6).map((achievement) => (
                            <div
                                key={achievement.id}
                                className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800"
                            >
                                <div className="text-3xl mb-2">{achievement.icon}</div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                    {achievement.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    {achievement.description}
                                </p>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-blue-600 dark:text-blue-400">
                                        +{achievement.xpReward} XP
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-500 capitalize">
                                        {achievement.tier}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {unlockedAchievements.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                            No achievements unlocked yet. Start playing to earn achievements!
                        </p>
                    )}
                </motion.div>

                {/* Game Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tic Tac Toe */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                    >
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Tic Tac Toe
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Games:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {gameStats.tictactoe.gamesPlayed}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Wins:</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    {gameStats.tictactoe.wins}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {gameStats.tictactoe.winRate}%
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Memory Match */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                    >
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Memory Match
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Games:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {gameStats.memory.gamesPlayed}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Perfect:</span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    {gameStats.memory.perfectGames}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sudoku */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                    >
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Sudoku
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {gameStats.sudoku.completions}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Perfect:</span>
                                <span className="font-semibold text-gold-600 dark:text-yellow-400">
                                    {gameStats.sudoku.perfectGames}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Crossword */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                    >
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Crossword
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {gameStats.crossword.puzzlesCompleted}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Perfect:</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {gameStats.crossword.perfectSolves}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
