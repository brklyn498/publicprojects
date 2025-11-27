"use client";

import { useMinesweeperStore } from "@/store/minesweeperStore";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Trophy, Skull } from "lucide-react";

export default function GameOverModal() {
    const { gameStatus, resetGame } = useMinesweeperStore();

    if (gameStatus !== 'won' && gameStatus !== 'lost') return null;

    const isWin = gameStatus === 'won';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className={`
                        ${isWin ? 'bg-green-400' : 'bg-red-400'}
                        border-[8px] border-black
                        shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]
                        p-8 max-w-md w-full text-center
                    `}
                >
                    <div className="mb-6 flex justify-center">
                        {isWin ? (
                            <Trophy className="w-24 h-24 text-black stroke-[1.5]" />
                        ) : (
                            <Skull className="w-24 h-24 text-black stroke-[1.5]" />
                        )}
                    </div>

                    <h2 className="text-4xl font-black mb-2 uppercase text-black">
                        {isWin ? "You Won!" : "Game Over"}
                    </h2>

                    <p className="text-xl font-bold mb-8 text-black/80">
                        {isWin ? "All mines cleared successfully!" : "You stepped on a mine!"}
                    </p>

                    <motion.button
                        onClick={resetGame}
                        className="
                            bg-white
                            border-[4px] border-black
                            px-8 py-4
                            text-xl font-black uppercase
                            flex items-center gap-3 mx-auto
                            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                            active:translate-x-[6px] active:translate-y-[6px]
                            active:shadow-none
                            transition-all
                        "
                        whileTap={{ scale: 0.95 }}
                    >
                        <RefreshCw className="w-6 h-6" strokeWidth={3} />
                        Play Again
                    </motion.button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
