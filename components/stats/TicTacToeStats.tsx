"use client";

import { useTicTacToeStore } from "@/store/ticTacToeStore";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Users, Cpu, Target } from "lucide-react";

export default function TicTacToeStats() {
    const { stats } = useTicTacToeStore();

    const pvpWinRate = stats.pvp.gamesPlayed > 0
        ? ((stats.pvp.wins / stats.pvp.gamesPlayed) * 100).toFixed(1)
        : "0.0";

    const pvcWinRate = stats.pvc.gamesPlayed > 0
        ? ((stats.pvc.wins / stats.pvc.gamesPlayed) * 100).toFixed(1)
        : "0.0";

    const totalGames = stats.pvp.gamesPlayed + stats.pvc.gamesPlayed;
    const totalWins = stats.pvp.wins + stats.pvc.wins;
    const totalLosses = stats.pvp.losses + stats.pvc.losses;
    const totalDraws = stats.pvp.draws + stats.pvc.draws;

    const overallWinRate = totalGames > 0
        ? ((totalWins / totalGames) * 100).toFixed(1)
        : "0.0";

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Tic Tac Toe Statistics
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Detailed breakdown of your Tic Tac Toe performance
                </p>
            </div>

            {totalGames === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Games Played Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Start playing Tic Tac Toe to see your statistics here!
                    </p>
                </div>
            ) : (
                <>
                    {/* Overall Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={<Target className="w-6 h-6" />}
                            label="Total Games"
                            value={totalGames.toString()}
                            color="blue"
                        />
                        <StatCard
                            icon={<Trophy className="w-6 h-6" />}
                            label="Total Wins"
                            value={totalWins.toString()}
                            sublabel={`${overallWinRate}% win rate`}
                            color="green"
                        />
                        <StatCard
                            icon={<TrendingUp className="w-6 h-6" />}
                            label="Current Streak"
                            value={stats.currentStreak.toString()}
                            sublabel={`Best: ${stats.bestStreak}`}
                            color="purple"
                        />
                        <StatCard
                            icon={<Trophy className="w-6 h-6" />}
                            label="Best Streak"
                            value={stats.bestStreak.toString()}
                            sublabel="consecutive wins"
                            color="yellow"
                        />
                    </div>

                    {/* Win/Loss/Draw Distribution */}
                    <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Game Results Distribution
                        </h3>
                        <div className="space-y-4">
                            <ProgressBar
                                label="Wins"
                                value={totalWins}
                                total={totalGames}
                                color="green"
                            />
                            <ProgressBar
                                label="Losses"
                                value={totalLosses}
                                total={totalGames}
                                color="red"
                            />
                            <ProgressBar
                                label="Draws"
                                value={totalDraws}
                                total={totalGames}
                                color="gray"
                            />
                        </div>
                    </div>

                    {/* Mode Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* PvP Stats */}
                        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    vs Player
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <StatRow label="Games Played" value={stats.pvp.gamesPlayed} />
                                <StatRow label="Wins" value={stats.pvp.wins} />
                                <StatRow label="Losses" value={stats.pvp.losses} />
                                <StatRow label="Draws" value={stats.pvp.draws} />
                                <div className="pt-3 border-t border-gray-200 dark:border-dark-border">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                                            Win Rate
                                        </span>
                                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {pvpWinRate}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PvC Stats */}
                        <div className="bg-white dark:bg-dark-card rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                    <Cpu className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    vs Computer
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <StatRow label="Games Played" value={stats.pvc.gamesPlayed} />
                                <StatRow label="Wins" value={stats.pvc.wins} />
                                <StatRow label="Losses" value={stats.pvc.losses} />
                                <StatRow label="Draws" value={stats.pvc.draws} />
                                <div className="pt-3 border-t border-gray-200 dark:border-dark-border">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                                            Win Rate
                                        </span>
                                        <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            {pvcWinRate}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Helper Components
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

function ProgressBar({ label, value, total, color }: {
    label: string;
    value: number;
    total: number;
    color: string;
}) {
    const percentage = total > 0 ? (value / total) * 100 : 0;

    const colors = {
        green: "bg-green-500 dark:bg-green-600",
        red: "bg-red-500 dark:bg-red-600",
        gray: "bg-gray-500 dark:bg-gray-600",
    };

    return (
        <div>
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
                <span className="text-gray-600 dark:text-gray-400">
                    {value} ({percentage.toFixed(1)}%)
                </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`h-full ${colors[color as keyof typeof colors]}`}
                />
            </div>
        </div>
    );
}

function StatRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
        </div>
    );
}
