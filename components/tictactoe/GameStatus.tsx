"use client";

import { useTicTacToeStore } from "@/store/ticTacToeStore";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

export default function GameStatus() {
    const { currentPlayer, gameStatus, winner, resetGame, gameMode } = useTicTacToeStore();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleRestartClick = () => {
        if (gameStatus === "playing") {
            setShowConfirmation(true);
        } else {
            resetGame();
        }
    };

    const confirmRestart = () => {
        resetGame();
        setShowConfirmation(false);
    };

    const cancelRestart = () => {
        setShowConfirmation(false);
    };

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
                        {gameMode === "pvc" && currentPlayer === "O" && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                (Computer thinking...)
                            </span>
                        )}
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
                            {gameMode === "pvc" && winner === "O" ? "Computer Wins! 🤖" : `Player ${winner} Wins! 🎉`}
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

            {/* Restart Button - Always visible */}
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleRestartClick}
                className="
          flex items-center gap-2
          bg-gray-200 dark:bg-dark-border
          hover:bg-gray-300 dark:hover:bg-dark-highlight
          text-gray-900 dark:text-white
          font-semibold py-2 px-4 rounded-lg
          transition-colors duration-200
          text-sm
        "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <RotateCcw className="w-4 h-4" />
                {gameStatus === "playing" ? "Restart Game" : "New Game"}
            </motion.button>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="bg-white dark:bg-dark-card rounded-lg p-6 max-w-sm w-full"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                            Restart Game?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Are you sure you want to restart? The current game will be lost.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={cancelRestart}
                                className="
                  flex-1 py-2 px-4 rounded-lg
                  bg-gray-200 dark:bg-dark-border
                  hover:bg-gray-300 dark:hover:bg-dark-highlight
                  text-gray-900 dark:text-white
                  font-medium transition-colors
                "
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRestart}
                                className="
                  flex-1 py-2 px-4 rounded-lg
                  bg-red-600 hover:bg-red-700
                  text-white
                  font-medium transition-colors
                "
                            >
                                Restart
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
