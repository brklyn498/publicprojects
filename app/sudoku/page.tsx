"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSudokuStore } from "@/store/sudokuStore";
import { motion, AnimatePresence } from "framer-motion";
import { Home, RotateCcw, Lightbulb, Undo, Eraser, Edit3, Clock, AlertCircle, Trophy } from "lucide-react";
import SudokuGrid from "@/components/sudoku/SudokuGrid";
import NumberPad from "@/components/sudoku/NumberPad";
import ThemeToggle from "@/components/ThemeToggle";
import confetti from "canvas-confetti";
import { Difficulty } from "@/types/sudoku";

export default function SudokuPage() {
    const router = useRouter();
    const {
        difficulty,
        gameStatus,
        timerElapsed,
        hintsUsed,
        mistakesMade,
        notesMode,
        initializeGame,
        resetGame,
        toggleNotesMode,
        useHint,
        clearCell,
        undo,
        updateTimer,
    } = useSudokuStore();

    // Initialize game on mount
    useEffect(() => {
        initializeGame(difficulty);
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
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.6 },
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        }
    }, [gameStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleDifficultyChange = (newDifficulty: Difficulty) => {
        initializeGame(newDifficulty);
    };

    const difficulties: { id: Difficulty; label: string }[] = [
        { id: "easy", label: "Easy" },
        { id: "medium", label: "Medium" },
        { id: "hard", label: "Hard" },
        { id: "expert", label: "Expert" },
    ];

    return (
        <div className="min-h-screen bg-warm-gray dark:bg-dark-bg pb-8">
            <ThemeToggle />

            {/* Header */}
            <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border py-6 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        Sudoku
                    </motion.h1>

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
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-6">
                {/* Difficulty Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-lg mx-auto">
                    {difficulties.map((diff) => (
                        <motion.button
                            key={diff.id}
                            onClick={() => handleDifficultyChange(diff.id)}
                            className={`
                px-4 py-2 rounded-lg font-medium transition-all
                ${difficulty === diff.id
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:border-blue-500"
                                }
              `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {diff.label}
                        </motion.button>
                    ))}
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3 mb-6 max-w-lg mx-auto">
                    <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-dark-border text-center">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatTime(timerElapsed)}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-dark-border text-center">
                        <AlertCircle className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{mistakesMade}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Mistakes</p>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-lg p-3 border border-gray-200 dark:border-dark-border text-center">
                        <Lightbulb className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{hintsUsed}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Hints</p>
                    </div>
                </div>

                {/* Sudoku Grid */}
                <SudokuGrid />

                {/* Number Pad */}
                <NumberPad />

                {/* Controls */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 max-w-lg mx-auto">
                    <motion.button
                        onClick={toggleNotesMode}
                        className={`
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all
              ${notesMode
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300"
                            }
            `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm">Notes</span>
                    </motion.button>

                    <motion.button
                        onClick={useHint}
                        className="
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border
              text-gray-700 dark:text-gray-300
              hover:border-yellow-500
              font-medium transition-all
            "
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Lightbulb className="w-4 h-4" />
                        <span className="text-sm">Hint</span>
                    </motion.button>

                    <motion.button
                        onClick={undo}
                        className="
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border
              text-gray-700 dark:text-gray-300
              hover:border-blue-500
              font-medium transition-all
            "
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Undo className="w-4 h-4" />
                        <span className="text-sm">Undo</span>
                    </motion.button>

                    <motion.button
                        onClick={clearCell}
                        className="
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border
              text-gray-700 dark:text-gray-300
              hover:border-red-500
              font-medium transition-all
            "
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Eraser className="w-4 h-4" />
                        <span className="text-sm">Clear</span>
                    </motion.button>

                    <motion.button
                        onClick={resetGame}
                        className="
              flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border
              text-gray-700 dark:text-gray-300
              hover:border-green-500
              font-medium transition-all sm:col-span-2
            "
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm">New Game</span>
                    </motion.button>
                </div>

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
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 mb-6">
                                    <Trophy className="w-10 h-10 text-white" />
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    Puzzle Solved! 🎉
                                </h2>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Time:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {formatTime(timerElapsed)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Mistakes:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {mistakesMade}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Hints:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {hintsUsed}
                                        </span>
                                    </div>
                                    {hintsUsed === 0 && mistakesMade === 0 && (
                                        <p className="text-sm text-green-600 dark:text-green-400 font-medium pt-2">
                                            ⭐ Perfect Game!
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
