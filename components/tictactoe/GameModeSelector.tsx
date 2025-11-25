"use client";

import { useTicTacToeStore } from "@/store/ticTacToeStore";
import { motion } from "framer-motion";
import { Users, Cpu } from "lucide-react";
import { GameMode } from "@/types/tictactoe";

export default function GameModeSelector() {
    const { gameMode, setGameMode, gameStatus } = useTicTacToeStore();

    // Only show mode selector at the start of the game
    if (gameStatus !== "playing" || gameMode !== "pvp") return null;

    const handleModeSelect = (mode: GameMode) => {
        setGameMode(mode);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 flex flex-col items-center gap-4"
        >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Game Mode
            </h3>
            <div className="flex gap-4">
                <motion.button
                    onClick={() => handleModeSelect("pvp")}
                    className="
            flex flex-col items-center gap-2
            px-6 py-4 rounded-lg
            bg-white dark:bg-dark-card
            border-2 border-gray-300 dark:border-dark-border
            hover:border-blue-500 dark:hover:border-blue-400
            transition-colors
          "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        2 Players
                    </span>
                </motion.button>

                <motion.button
                    onClick={() => handleModeSelect("pvc")}
                    className="
            flex flex-col items-center gap-2
            px-6 py-4 rounded-lg
            bg-white dark:bg-dark-card
            border-2 border-gray-300 dark:border-dark-border
            hover:border-red-500 dark:hover:border-red-400
            transition-colors
          "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Cpu className="w-8 h-8 text-red-600 dark:text-red-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                        vs Computer
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
}
