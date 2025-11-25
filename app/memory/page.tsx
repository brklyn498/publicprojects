"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMemoryGameStore } from "@/store/memoryGameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Home, RotateCcw, Clock, Target, Trophy } from "lucide-react";
import MemoryBoard from "@/components/memory/MemoryBoard";
import DifficultySelector from "@/components/memory/DifficultySelector";
import ThemeToggle from "@/components/ThemeToggle";
import confetti from "canvas-confetti";

export default function MemoryGamePage() {
    const router = useRouter();
    const {
        difficulty,
        theme,
        moves,
        matchesFound,
        gameStatus,
        timerElapsed,
        bestScores,
        initializeGame,
        resetGame,
        updateTimer,
    } = useMemoryGameStore();

    // Initialize game on mount
    useEffect(() => {
        initializeGame(difficulty, theme);
    }, []);

    // Timer update
    useEffect(() => {
        if (gameStatus === "playing") {
            const interval = setInterval(() => {
                updateTimer();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameStatus, updateTimer]);

    // Confetti on win
    useEffect(() => {
        if (gameStatus === "won") {
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.6 },
                    colors: ["#FFD700", "#FFA500", "#FF6347"],
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                    colors: ["#FFD700", "#FFA500", "#FF6347"],
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        }
    }, [gameStatus]);

    const handleDifficultyChange = (newDifficulty: typeof difficulty) => {
        initializeGame(newDifficulty, theme);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getPairCount = () => {
        return difficulty === "easy" ? 8 : difficulty === "medium" ? 18 : 32;
    };

    return (
        <div className="min-h-screen bg-warm-gray dark:bg-dark-bg">
            <ThemeToggle />

            {/* Header */}
            <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border py-6 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        Memory Match
                    </motion.h1>

                    <div className="flex items-center gap-2">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={resetGame}
                            className="
                flex items-center gap-2 px-3 py-2 rounded-lg
                bg-gray-100 dark:bg-dark-border
                hover:bg-gray-200 dark:hover:bg-dark-highlight
                text-gray-700 dark:text-gray-300
                font-medium transition-colors
              "
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="New Game"
                        >
                            <RotateCcw className="w-5 h-5" />
                            <span className="hidden sm:inline">New Game</span>
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => router.push("/")}
                            className="
                flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gray-100 dark:bg-dark-border
                hover:bg-gray-200 dark:hover:bg-dark-highlight
                text-gray-700 dark:text-gray-300
                font-medium transition-colors
              "
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Home className="w-5 h-5" />
                            <span className="hidden sm:inline">Home</span>
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Difficulty Selector */}
                <DifficultySelector
                    selected={difficulty}
                    onSelect={handleDifficultyChange}
                    bestTimes={{
                        easy: bestScores.easy?.timeElapsed || null,
                        medium: bestScores.medium?.timeElapsed || null,
                        hard: bestScores.hard?.timeElapsed || null,
                    }}
                />

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Time</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatTime(timerElapsed)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Target className="w-4 h-4" />
                            <span className="text-sm">Moves</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {moves}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm">Pairs</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {matchesFound}/{getPairCount()}
                        </p>
                    </div>
                </div>

                {/* Game Board */}
                <MemoryBoard />

                {/* Win Modal */}
                <AnimatePresence>
                    {gameStatus === "won" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            onClick={resetGame}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500 mb-6">
                                    <Trophy className="w-10 h-10 text-white" />
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    Congratulations! 🎉
                                </h2>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Time:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatTime(timerElapsed)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Moves:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {moves}
                                        </span>
                                    </div>
                                    {bestScores[difficulty]?.timeElapsed === timerElapsed && (
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                            ⭐ New Best Time!
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={resetGame}
                                    className="
                    w-full bg-blue-600 hover:bg-blue-700
                    text-white font-semibold py-4 px-6 rounded-lg
                    transition-colors text-lg
                  "
                                >
                                    Play Again
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
