"use client";

import { useGameStore } from "@/store/gameStore";
import { useTicTacToeStore } from "@/store/ticTacToeStore";
import { motion } from "framer-motion";
import { Trophy, Target, Clock, Zap } from "lucide-react";

export default function OverviewStats() {
    const { getTotalPuzzlesCompleted, getPerfectSolves, getAverageCompletionTime } = useGameStore();
    const { stats: tttStats } = useTicTacToeStore();

    const totalPuzzles = getTotalPuzzlesCompleted();
    const perfectSolves = getPerfectSolves();
    const avgTime = getAverageCompletionTime();

    const totalTTTGames = tttStats.pvp.gamesPlayed + tttStats.pvc.gamesPlayed;
    const totalTTTWins = tttStats.pvp.wins + tttStats.pvc.wins;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Overall Progress
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your combined statistics across all games
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Tic Tac Toe Games */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Tic Tac Toe
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalTTTWins}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        wins from {totalTTTGames} games
                    </p>
                </motion.div>

                {/* Crossword Puzzles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Puzzles Solved
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalPuzzles}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {perfectSolves} perfect solves
                    </p>
                </motion.div>

                {/* Best Streak */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Best Streak
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {tttStats.bestStreak}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        consecutive wins
                    </p>
                </motion.div>

                {/* Average Time */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Avg. Puzzle Time
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {avgTime > 0 ? formatTime(avgTime) : "--"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        across all puzzles
                    </p>
                </motion.div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                </h3>
                <div className="space-y-3">
                    {totalTTTGames > 0 && (
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600 dark:text-gray-400">
                                Tic Tac Toe games played
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {totalTTTGames}
                            </span>
                        </div>
                    )}
                    {totalPuzzles > 0 && (
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600 dark:text-gray-400">
                                Crossword puzzles completed
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {totalPuzzles}
                            </span>
                        </div>
                    )}
                    {totalTTTGames === 0 && totalPuzzles === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-500 py-4">
                            No activity yet. Start playing to see your stats!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
