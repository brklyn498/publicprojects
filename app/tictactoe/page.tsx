"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import TicTacToeBoard from "@/components/tictactoe/TicTacToeBoard";
import GameStatus from "@/components/tictactoe/GameStatus";
import GameModeSelector from "@/components/tictactoe/GameModeSelector";
import StatsDisplay from "@/components/tictactoe/StatsDisplay";
import WinModalTTT from "@/components/tictactoe/WinModalTTT";
import ThemeToggle from "@/components/ThemeToggle";

export default function TicTacToePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col bg-warm-gray dark:bg-dark-bg">
            <ThemeToggle />
            <WinModalTTT />

            {/* Header */}
            <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border py-6 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
                    >
                        Tic Tac Toe 4×4
                    </motion.h1>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => router.push("/")}
                        className="
              flex items-center gap-2
              px-4 py-2 rounded-lg
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
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-2xl"
                >
                    <StatsDisplay />
                    <GameModeSelector />
                    <GameStatus />
                    <TicTacToeBoard />

                    {/* Instructions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm"
                    >
                        <p>Get 4 in a row to win!</p>
                        <p className="mt-1">Rows, columns, or diagonals count</p>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
