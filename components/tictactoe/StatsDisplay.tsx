"use client";

import { useTicTacToeStore } from "@/store/ticTacToeStore";
import { motion } from "framer-motion";
import { Trophy, Target, TrendingUp, Users, Cpu } from "lucide-react";

export default function StatsDisplay() {
    const { stats } = useTicTacToeStore();

    const pvpWinRate = stats.pvp.gamesPlayed > 0
        ? ((stats.pvp.wins / stats.pvp.gamesPlayed) * 100).toFixed(1)
        : "0.0";

    const pvcWinRate = stats.pvc.gamesPlayed > 0
        ? ((stats.pvc.wins / stats.pvc.gamesPlayed) * 100).toFixed(1)
        : "0.0";

    const totalGames = stats.pvp.gamesPlayed + stats.pvc.gamesPlayed;

    if (totalGames === 0) return null; // Don't show if no games played

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white dark:bg-dark-card rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-dark-border"
        >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Your Statistics
            </h3>

            {/* Win Streak */}
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-900 dark:text-white">Win Streak</span>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.currentStreak}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Best: {stats.bestStreak}
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Mode Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PvP Stats */}
                <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            vs Player
                        </h4>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Record:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {stats.pvp.wins}W-{stats.pvp.losses}L-{stats.pvp.draws}D
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Games:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {stats.pvp.gamesPlayed}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                                {pvpWinRate}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* PvC Stats */}
                <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Cpu className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            vs Computer
                        </h4>
                    </div>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Record:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {stats.pvc.wins}W-{stats.pvc.losses}L-{stats.pvc.draws}D
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Games:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {stats.pvc.gamesPlayed}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                                {pvcWinRate}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Games */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">Total Games</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                        {totalGames}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
