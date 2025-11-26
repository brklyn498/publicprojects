"use client";

import { motion } from "framer-motion";
import { useSnakeStore } from "@/store/snakeStore";
import { Trophy, RotateCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GameOverModal() {
    const { score, highScore, resetGame } = useSnakeStore();
    const router = useRouter();
    const isNewHighScore = score === highScore && score > 0;

    const handlePlayAgain = () => {
        resetGame();
    };

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="
                    bg-red-400
                    border-[8px] border-black
                    shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]
                    p-8 max-w-md w-full
                "
            >
                {/* Title */}
                <h2 className="text-6xl font-black text-black text-center mb-6 uppercase">
                    Game Over!
                </h2>

                {/* Score Display */}
                <div className="bg-yellow-300 border-[6px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
                    <div className="text-center">
                        <p className="text-lg font-bold text-black uppercase mb-2">Final Score</p>
                        <p className="text-6xl font-black text-black">{score}</p>
                    </div>

                    {isNewHighScore && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-4 pt-4 border-t-4 border-black"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Trophy className="w-8 h-8" />
                                <p className="text-2xl font-black text-black uppercase">New High Score!</p>
                            </div>
                        </motion.div>
                    )}

                    {!isNewHighScore && highScore > 0 && (
                        <div className="mt-4 pt-4 border-t-4 border-black text-center">
                            <p className="text-sm font-bold text-black uppercase mb-1">High Score</p>
                            <p className="text-3xl font-black text-black">{highScore}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <motion.button
                        onClick={handlePlayAgain}
                        className="
                            bg-green-400 border-[5px] border-black
                            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                            px-6 py-4
                            font-black text-xl text-black uppercase
                            flex items-center justify-center gap-3
                            transition-all duration-100
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            active:translate-x-[6px] active:translate-y-[6px]
                            active:shadow-none
                        "
                        whileTap={{ scale: 0.98 }}
                    >
                        <RotateCcw className="w-6 h-6" />
                        Play Again
                    </motion.button>

                    <motion.button
                        onClick={handleGoHome}
                        className="
                            bg-cyan-300 border-[5px] border-black
                            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                            px-6 py-4
                            font-black text-lg text-black uppercase
                            flex items-center justify-center gap-3
                            transition-all duration-100
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            active:translate-x-[6px] active:translate-y-[6px]
                            active:shadow-none
                        "
                        whileTap={{ scale: 0.98 }}
                    >
                        <Home className="w-6 h-6" />
                        Back to Menu
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
