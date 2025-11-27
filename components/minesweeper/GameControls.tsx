"use client";

import { useMinesweeperStore } from "@/store/minesweeperStore";
import { Flag, Clock, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface GameControlsProps {
    onChangeDifficulty: () => void;
}

export default function GameControls({ onChangeDifficulty }: GameControlsProps) {
    const { totalMines, flagsPlaced, timer, resetGame } = useMinesweeperStore();
    const minesLeft = totalMines - flagsPlaced;

    return (
        <div className="flex flex-col gap-6">
            {/* Status Panel */}
            <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                <h3 className="text-2xl font-black mb-4 uppercase text-center border-b-[4px] border-black pb-2">
                    Status
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Flag className="w-6 h-6" strokeWidth={3} />
                            <span className="font-bold text-lg">Mines</span>
                        </div>
                        <span className="font-black text-2xl font-mono">{minesLeft}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6" strokeWidth={3} />
                            <span className="font-bold text-lg">Time</span>
                        </div>
                        <span className="font-black text-2xl font-mono">
                            {Math.floor(timer / 60).toString().padStart(2, '0')}:
                            {(timer % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
                <motion.button
                    onClick={resetGame}
                    className="
                        bg-cyan-300 border-[4px] border-black
                        p-4
                        font-black uppercase text-lg
                        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        active:translate-x-[6px] active:translate-y-[6px]
                        active:shadow-none
                        flex items-center justify-center gap-2
                    "
                    whileTap={{ scale: 0.98 }}
                >
                    <RotateCcw className="w-5 h-5" strokeWidth={3} />
                    Reset Board
                </motion.button>

                <motion.button
                    onClick={onChangeDifficulty}
                    className="
                        bg-purple-300 border-[4px] border-black
                        p-4
                        font-black uppercase text-lg
                        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                        hover:translate-x-[2px] hover:translate-y-[2px]
                        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        active:translate-x-[6px] active:translate-y-[6px]
                        active:shadow-none
                    "
                    whileTap={{ scale: 0.98 }}
                >
                    Change Level
                </motion.button>
            </div>
        </div>
    );
}
