"use client";

import { motion } from "framer-motion";
import { Difficulty } from "@/store/minesweeperStore";

interface DifficultySelectorProps {
    onSelect: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
    return (
        <div className="text-center p-8">
            <h2 className="text-4xl font-black mb-8 uppercase">Select Difficulty</h2>
            <div className="grid gap-6">
                {[
                    { id: 'easy', label: 'Easy', details: '9x9 • 10 Mines', color: 'bg-green-400' },
                    { id: 'medium', label: 'Medium', details: '16x16 • 40 Mines', color: 'bg-yellow-400' },
                    { id: 'hard', label: 'Hard', details: '30x16 • 99 Mines', color: 'bg-red-400' },
                ].map((level) => (
                    <motion.button
                        key={level.id}
                        onClick={() => onSelect(level.id as Difficulty)}
                        className={`
                            ${level.color}
                            border-[4px] border-black
                            p-6
                            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                            active:translate-x-[8px] active:translate-y-[8px]
                            active:shadow-none
                            transition-all
                        `}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="text-2xl font-black uppercase">{level.label}</div>
                        <div className="font-bold mt-1 text-black/80">{level.details}</div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
