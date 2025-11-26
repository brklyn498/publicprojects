"use client";

import { useSnakeStore } from "@/store/snakeStore";
import { motion } from "framer-motion";
import { Difficulty } from "@/types/snake";

interface DifficultySelectorProps {
    onSelect: () => void;
}

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
    const { difficulty, setDifficulty } = useSnakeStore();

    const difficulties: { level: Difficulty; label: string; color: string; description: string }[] = [
        { level: 'easy', label: 'Easy', color: 'bg-green-400', description: 'Chill vibes' },
        { level: 'medium', label: 'Medium', color: 'bg-yellow-400', description: 'Standard speed' },
        { level: 'hard', label: 'Hard', color: 'bg-red-400', description: 'Lightning fast!' },
    ];

    const handleSelect = (level: Difficulty) => {
        setDifficulty(level);
        onSelect();
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8">
            <div className="text-center mb-4">
                <h2 className="text-5xl font-black text-black mb-2 uppercase">Choose Difficulty</h2>
                <p className="text-xl font-bold text-black">Pick your poison 🐍</p>
            </div>

            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
                {difficulties.map(({ level, label, color, description }) => (
                    <motion.button
                        key={level}
                        onClick={() => handleSelect(level)}
                        className={`
                            ${color}
                            border-[6px] border-black
                            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            p-6
                            transition-all duration-100
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                            active:translate-x-[8px] active:translate-y-[8px]
                            active:shadow-none
                            ${difficulty === level ? 'ring-4 ring-black ring-offset-4' : ''}
                        `}
                        whileTap={{ scale: 0.98 }}
                    >
                        <p className="text-3xl font-black text-black uppercase mb-2">{label}</p>
                        <p className="text-lg font-bold text-black">{description}</p>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
