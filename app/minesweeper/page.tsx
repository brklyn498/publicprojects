"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMinesweeperStore } from "@/store/minesweeperStore";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import MinesweeperBoard from "@/components/minesweeper/MinesweeperBoard";
import GameControls from "@/components/minesweeper/GameControls";
import DifficultySelector from "@/components/minesweeper/DifficultySelector";
import GameOverModal from "@/components/minesweeper/GameOverModal";

export default function MinesweeperPage() {
    const router = useRouter();
    const [showDifficultySelector, setShowDifficultySelector] = useState(true);

    const {
        gameStatus,
        tickTimer,
        initializeGame,
    } = useMinesweeperStore();

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameStatus === 'playing') {
            interval = setInterval(() => {
                tickTimer();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameStatus, tickTimer]);

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

                        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase truncate">
                            Minesweeper 💣
                        </h1>
                    </div>
                </div>
            </header>

            {/* Difficulty Selector Overlay */}
            {showDifficultySelector && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-white border-[8px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full"
                    >
                        <DifficultySelector onSelect={(diff) => {
                            initializeGame(diff);
                            setShowDifficultySelector(false);
                        }} />
                    </motion.div>
                </div>
            )}

            {/* Game Over Modal */}
            <GameOverModal />

            {/* Main Game Area */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                    {/* Game Board */}
                    <div className="flex-1 flex justify-center w-full overflow-x-auto">
                        <MinesweeperBoard />
                    </div>

                    {/* Game Controls */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <GameControls onChangeDifficulty={() => setShowDifficultySelector(true)} />

                        {/* Controls Hint */}
                        <div className="mt-6 bg-white dark:bg-dark-card border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
                            <p className="font-bold text-black dark:text-white text-sm uppercase text-center">
                                Left Click to Reveal • Right Click to Flag
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
