"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { Trophy, Clock, Lightbulb, CheckCircle2 } from "lucide-react";

export default function CrosswordStatsOverview() {
    const {
        getTotalPuzzlesCompleted,
        getPerfectSolves,
        getAverageCompletionTime,
        puzzleStats
    } = useGameStore();

    const totalPuzzles = getTotalPuzzlesCompleted();
    const perfectSolves = getPerfectSolves();
    const avgTime = getAverageCompletionTime();
    const totalCompletions = puzzleStats.length;

    const perfectSolvePercentage = totalCompletions > 0
        ? ((perfectSolves / totalCompletions) * 100).toFixed(1)
        : "0.0";

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (totalPuzzles === 0) return null; // Don't show if no puzzles completed

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border mb-6"
        >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Crossword Progress
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Total Puzzles */}
                <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalPuzzles}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        {totalPuzzles === 1 ? "Puzzle" : "Puzzles"} Solved
                    </div>
                </div>

                {/* Perfect Solves */}
                <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 dark:bg-green-900/20">
                        <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {perfectSolves}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        Perfect Solves
                        <div className="text-[10px] text-gray-500 dark:text-gray-500">
                            ({perfectSolvePercentage}%)
                        </div>
                    </div>
                </div>

                {/* Average Time */}
                <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                        <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatTime(avgTime)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        Avg. Time
                    </div>
                </div>

                {/* Total Completions */}
                <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-orange-100 dark:bg-orange-900/20">
                        <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalCompletions}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        Total Wins
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
