"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { Trophy, Clock, Lightbulb, CheckCircle2, Target } from "lucide-react";

export default function CrosswordStats() {
    const {
        getTotalPuzzlesCompleted,
        getPerfectSolves,
        getAverageCompletionTime,
        puzzleStats,
    } = useGameStore();

    const totalPuzzles = getTotalPuzzlesCompleted();
    const perfectSolves = getPerfectSolves();
    const avgTime = getAverageCompletionTime();
    const totalCompletions = puzzleStats.length;

    const perfectSolvePercentage = totalCompletions > 0
        ? ((perfectSolves / totalCompletions) * 100).toFixed(1)
        : "0.0";

    const totalHints = puzzleStats.reduce((sum, s) => sum + s.hintsUsed, 0);
    const avgHints = totalCompletions > 0
        ? (totalHints / totalCompletions).toFixed(1)
        : "0.0";

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Crossword Statistics
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Detailed breakdown of your crossword puzzle performance
                </p>
            </div>

            {totalPuzzles === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Puzzles Completed Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Complete your first crossword puzzle to see your statistics!
                    </p>
                </div>
            ) : (
                <>
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={<CheckCircle2 className="w-6 h-6" />}
                            label="Puzzles Completed"
                            value={totalPuzzles.toString()}
                            sublabel={`${totalCompletions} total solves`}
                            color="blue"
                        />
                        <StatCard
                            icon={<Trophy className="w-6 h-6" />}
                            label="Perfect Solves"
                            value={perfectSolves.toString()}
                            sublabel={`${perfectSolvePercentage}% of completions`}
                            color="green"
                        />
                        <StatCard
                            icon={<Clock className="w-6 h-6" />}
                            label="Avg. Time"
                            value={avgTime > 0 ? formatTime(avgTime) : "--"}
                            sublabel="per puzzle"
                            color="purple"
                        />
                        <StatCard
                            icon={<Lightbulb className="w-6 h-6" />}
                            label="Avg. Hints"
                            value={avgHints}
                            sublabel="per puzzle"
                            color="yellow"
                        />
                    </div>

                    {/* Performance Breakdown */}
                    <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Performance Breakdown
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        Perfect Solves (0 hints)
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {perfectSolves} / {totalCompletions}
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${perfectSolvePercentage}%` }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="h-full bg-green-500 dark:bg-green-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                        Puzzles with Hints
                                    </span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {totalCompletions - perfectSolves} / {totalCompletions}
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${((totalCompletions - perfectSolves) / totalCompletions * 100).toFixed(1)}%`
                                        }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="h-full bg-yellow-500 dark:bg-yellow-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Completions */}
                    <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Recent Completions
                        </h3>
                        <div className="space-y-3">
                            {puzzleStats
                                .slice()
                                .reverse()
                                .slice(0, 5)
                                .map((stat, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            {stat.hintsUsed === 0 ? (
                                                <Trophy className="w-5 h-5 text-yellow-500" />
                                            ) : (
                                                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    Puzzle {stat.puzzleId}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {new Date(stat.completedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {formatTime(stat.completionTime)}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {stat.hintsUsed} hints
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Total Hints Used
                            </h3>
                            <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                                {totalHints}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Average {avgHints} hints per puzzle
                            </p>
                        </div>

                        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Total Completions
                            </h3>
                            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                {totalCompletions}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {totalPuzzles} unique puzzles solved
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Helper Component
function StatCard({ icon, label, value, sublabel, color }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    sublabel?: string;
    color: string;
}) {
    const colors = {
        blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
        purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
        yellow: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border"
        >
            <div className={`inline-flex p-3 rounded-lg mb-3 ${colors[color as keyof typeof colors]}`}>
                {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {label}
            </h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {sublabel && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{sublabel}</p>
            )}
        </motion.div>
    );
}
