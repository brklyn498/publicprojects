"use client";

import { Difficulty } from "@/types/memory";
import { motion } from "framer-motion";
import { Zap, Target, Flame } from "lucide-react";

interface DifficultySelectorProps {
    selected: Difficulty;
    onSelect: (difficulty: Difficulty) => void;
    bestTimes?: {
        easy: number | null;
        medium: number | null;
        hard: number | null;
    };
}

export default function DifficultySelector({ selected, onSelect, bestTimes }: DifficultySelectorProps) {
    const difficulties: { id: Difficulty; label: string; grid: string; icon: any; color: string }[] = [
        { id: "easy", label: "Easy", grid: "4×4", icon: Zap, color: "green" },
        { id: "medium", label: "Medium", grid: "6×6", icon: Target, color: "yellow" },
        { id: "hard", label: "Hard", grid: "8×8", icon: Flame, color: "red" },
    ];

    const formatTime = (seconds: number | null) => {
        if (!seconds) return "--";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {difficulties.map((diff) => {
                const isSelected = selected === diff.id;
                const Icon = diff.icon;
                const bestTime = bestTimes?.[diff.id];

                return (
                    <motion.button
                        key={diff.id}
                        onClick={() => onSelect(diff.id)}
                        className={`
              relative p-6 rounded-lg border-2 transition-all
              ${isSelected
                                ? `border-${diff.color}-500 bg-${diff.color}-50 dark:bg-${diff.color}-900/20`
                                : "border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card hover:border-gray-400"
                            }
            `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex flex-col items-center">
                            <Icon className={`w-8 h-8 mb-2 ${diff.color === "green" ? "text-green-600 dark:text-green-400" :
                                    diff.color === "yellow" ? "text-yellow-600 dark:text-yellow-400" :
                                        "text-red-600 dark:text-red-400"
                                }`} />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {diff.label}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {diff.grid} Grid
                            </p>
                            {bestTime && (
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    Best: {formatTime(bestTime)}
                                </p>
                            )}
                        </div>
                        {isSelected && (
                            <motion.div
                                layoutId="selector"
                                className="absolute inset-0 border-2 border-blue-500 rounded-lg"
                                transition={{ type: "spring", duration: 0.5 }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
}
