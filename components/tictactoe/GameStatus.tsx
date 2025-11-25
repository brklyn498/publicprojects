"use client";

import { useTicTacToeStore } from "@/store/ticTacToeStore";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export default function GameStatus() {
    const { currentPlayer, gameStatus, winner, resetGame } = useTicTacToeStore();

    return (
        <div className="flex flex-col items-center gap-4 mb-6">
            <div className="text-center">
                {gameStatus === "playing" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
                    >
                        Current Player:{" "}
                        <span className={currentPlayer === "X" ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}>
                            {currentPlayer}
                        </span>
                    </motion.div>
                )}

                {gameStatus === "won" && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="text-2xl sm:text-3xl font-bold"
                    >
                        <span className={winner === "X" ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}>
                            Player {winner} Wins! 🎉
                        </span>
                    </motion.div>
                )}

                {gameStatus === "draw" && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-400"
                    >
                        It's a Draw! 🤝
                    </motion.div>
                )}
            </div>

            {gameStatus !== "playing" && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={resetGame}
                    className="
            flex items-center gap-2
            bg-black dark:bg-white
            hover:bg-gray-800 dark:hover:bg-gray-200
            text-white dark:text-black
            font-semibold py-3 px-6 rounded-lg
            transition-colors duration-200
          "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <RotateCcw className="w-5 h-5" />
                    New Game
                </motion.button>
            )}
        </div>
    );
}
