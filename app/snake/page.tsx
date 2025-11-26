"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSnakeStore } from "@/store/snakeStore";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import SnakeBoard from "@/components/snake/SnakeBoard";
import GameControls from "@/components/snake/GameControls";
import DifficultySelector from "@/components/snake/DifficultySelector";
import GameOverModal from "@/components/snake/GameOverModal";
import GameModeSelector from "@/components/snake/GameModeSelector";
import LevelCompleteModal from "@/components/snake/LevelCompleteModal";

export default function SnakePage() {
    const router = useRouter();
    const [showModeSelector, setShowModeSelector] = useState(true);
    const [showDifficultySelector, setShowDifficultySelector] = useState(false);

    const {
        gameStatus,
        gameSpeed,
        moveSnake,
        changeDirection,
        pauseGame,
        resumeGame,
        levelCompleting,
    } = useSnakeStore();

    // Keyboard controls
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (gameStatus !== 'playing') {
            if (e.key === ' ' && gameStatus === 'paused') {
                resumeGame();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                changeDirection('UP');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                changeDirection('DOWN');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                changeDirection('LEFT');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                changeDirection('RIGHT');
                break;
            case ' ':
                e.preventDefault();
                pauseGame();
                break;
        }
    }, [gameStatus, changeDirection, pauseGame, resumeGame]);

    // Set up keyboard event listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    // Game loop
    useEffect(() => {
        if (gameStatus !== 'playing') return;

        const gameLoop = setInterval(() => {
            moveSnake();
        }, gameSpeed);

        return () => {
            clearInterval(gameLoop);
        };
    }, [gameStatus, gameSpeed, moveSnake]);

    return (
        <div className="min-h-screen bg-warm-gray dark:bg-dark-bg pb-8">
            {/* Header - Neubrutalist */}
            <header className="bg-yellow-300 border-b-[6px] border-black py-6 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.button
                            onClick={() => router.push("/")}
                            className="
                                bg-cyan-300 border-[4px] border-black
                                shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                                px-4 py-3 rounded-none
                                font-bold text-black
                                flex items-center gap-2
                                transition-all duration-100
                                hover:translate-x-[2px] hover:translate-y-[2px]
                                hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                active:translate-x-[6px] active:translate-y-[6px]
                                active:shadow-none
                            "
                            whileTap={{ scale: 0.98 }}
                        >
                            <ArrowLeft className="w-5 h-5" strokeWidth={3} />
                            <span className="font-black uppercase">Back</span>
                        </motion.button>

                        <h1 className="text-5xl font-black text-black uppercase">
                            Snake 🐍
                        </h1>
                    </div>
                </div>
            </header>

            {/* Game Mode Selector Overlay */}
            {showModeSelector && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-white border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-4xl"
                    >
                        <GameModeSelector onSelect={() => {
                            setShowModeSelector(false);
                            setShowDifficultySelector(true);
                        }} />
                    </motion.div>
                </div>
            )}

            {/* Difficulty Selector Overlay */}
            {showDifficultySelector && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-white border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-2xl"
                    >
                        <DifficultySelector onSelect={() => setShowDifficultySelector(false)} />
                    </motion.div>
                </div>
            )}

            {/* Level Complete Modal */}
            {levelCompleting && <LevelCompleteModal />}

            {/* Game Over Modal */}
            {gameStatus === 'gameOver' && <GameOverModal />}

            {/* Main Game Area */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                    {/* Game Board */}
                    <div>
                        <SnakeBoard />

                        {/* Controls Hint */}
                        <div className="mt-6 bg-white dark:bg-dark-card border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
                            <p className="font-bold text-black dark:text-white text-sm uppercase text-center">
                                Use Arrow Keys or WASD • Space to Pause
                            </p>
                        </div>
                    </div>

                    {/* Game Controls */}
                    <div className="w-full lg:w-auto lg:min-w-[280px]">
                        <GameControls />
                    </div>
                </div>
            </main>
        </div>
    );
}
