"use client";

import { useSnakeStore } from "@/store/snakeStore";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function GameControls() {
    const { gameStatus, score, highScore, gameMode, level, gridSize, startGame, pauseGame, resumeGame, resetGame } = useSnakeStore();

    const handlePlayPause = () => {
        if (gameStatus === 'idle') {
            startGame();
        } else if (gameStatus === 'playing') {
            pauseGame();
        } else if (gameStatus === 'paused') {
            resumeGame();
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Score Display - Neubrutalist */}
            <div className="bg-cyan-300 border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                <div className="text-center mb-4">
                    <p className="text-sm font-bold text-black uppercase tracking-wider mb-1">Score</p>
                    <p className="text-5xl font-black text-black">{score}</p>
                </div>

                <div className="border-t-4 border-black pt-4">
                    <p className="text-sm font-bold text-black uppercase tracking-wider mb-1">High Score</p>
                    <p className="text-3xl font-black text-black">{highScore}</p>
                </div>
            </div>

            {/* Level Display for Alternative Mode */}
            {gameMode === 'alternative' && (
                <div className="bg-purple-400 border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                    <div className="text-center">
                        <p className="text-sm font-bold text-black uppercase tracking-wider mb-1">Level</p>
                        <p className="text-5xl font-black text-black">{level}</p>
                        <p className="text-sm font-bold text-black mt-2">Grid: {gridSize}×{gridSize}</p>
                    </div>
                </div>
            )}

            {/* Control Buttons - Neubrutalist */}
            <div className="flex flex-col gap-3">
                <motion.button
                    onClick={handlePlayPause}
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
                    {gameStatus === 'playing' ? (
                        <>
                            <Pause className="w-6 h-6" fill="black" />
                            Pause
                        </>
                    ) : (
                        <>
                            <Play className="w-6 h-6" fill="black" />
                            {gameStatus === 'idle' ? 'Start' : 'Resume'}
                        </>
                    )}
                </motion.button>

                <motion.button
                    onClick={resetGame}
                    className="
                        bg-magenta-400 border-[5px] border-black
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
                    style={{ backgroundColor: '#FF00FF' }}
                >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                </motion.button>
            </div>

            {/* Game Status Display */}
            {gameStatus === 'paused' && (
                <div className="bg-yellow-300 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 text-center">
                    <p className="font-black text-black text-lg uppercase">⏸️ Paused</p>
                </div>
            )}
        </div>
    );
}
