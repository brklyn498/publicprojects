"use client";

import { useEffect } from "react";
import { useTicTacToeStore } from "@/store/ticTacToeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import confetti from "canvas-confetti";

export default function WinModalTTT() {
    const { gameStatus, winner, resetGame } = useTicTacToeStore();

    useEffect(() => {
        if (gameStatus === "won") {
            // Fire confetti
            const duration = 2000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0, y: 0.8 },
                    colors: winner === "X" ? ["#2563eb", "#3b82f6", "#60a5fa"] : ["#dc2626", "#ef4444", "#f87171"],
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1, y: 0.8 },
                    colors: winner === "X" ? ["#2563eb", "#3b82f6", "#60a5fa"] : ["#dc2626", "#ef4444", "#f87171"],
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        }
    }, [gameStatus, winner]);

    return (
        <AnimatePresence>
            {gameStatus !== "playing" && (
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
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className={`
                inline-flex items-center justify-center w-20 h-20 rounded-full mb-6
                ${gameStatus === "won" ? "bg-success-green" : "bg-gray-400 dark:bg-gray-600"}
              `}
                        >
                            {gameStatus === "won" ? (
                                <Trophy className="w-10 h-10 text-white" />
                            ) : (
                                <Users className="w-10 h-10 text-white" />
                            )}
                        </motion.div>

                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {gameStatus === "won" ? `Player ${winner} Wins!` : "It's a Draw!"}
                        </h2>

                        {gameStatus === "won" && (
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Congratulations on your victory! 🎉
                            </p>
                        )}

                        {gameStatus === "draw" && (
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Great game! Nobody wins this time. 🤝
                            </p>
                        )}

                        <button
                            onClick={resetGame}
                            className="
                w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 
                text-white dark:text-black
                font-semibold py-4 px-6 rounded-lg
                transition-colors duration-200
                text-lg
              "
                        >
                            Play Again
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
