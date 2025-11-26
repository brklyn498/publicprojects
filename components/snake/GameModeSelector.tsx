"use client";

import { useSnakeStore } from "@/store/snakeStore";
import { motion } from "framer-motion";
import { GameMode } from "@/types/snake";

interface GameModeSelectorProps {
    onSelect: () => void;
}

export default function GameModeSelector({ onSelect }: GameModeSelectorProps) {
    const { gameMode, setGameMode } = useSnakeStore();

    const modes: { mode: GameMode; title: string; icon: string; description: string; color: string }[] = [
        {
            mode: 'classic',
            title: 'Classic',
            icon: '🐍',
            description: 'Infinite survival mode',
            color: 'bg-green-400'
        },
        {
            mode: 'alternative',
            title: 'Alternative',
            icon: '⭐',
            description: 'Levels & Obstacles',
            color: 'bg-purple-400'
        },
    ];

    const handleSelect = (mode: GameMode) => {
        setGameMode(mode);
        onSelect();
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8">
            <div className="text-center mb-4">
                <h2 className="text-5xl font-black text-black mb-2 uppercase">Choose Game Mode</h2>
                <p className="text-xl font-bold text-black">Pick your style 🎮</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                {modes.map(({ mode, title, icon, description, color }) => (
                    <motion.button
                        key={mode}
                        onClick={() => handleSelect(mode)}
                        className={`
                            ${color}
                            border-[6px] border-black
                            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            p-8
                            transition-all duration-100
                            hover:translate-x-[2px] hover:translate-y-[2px]
                            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                            active:translate-x-[8px] active:translate-y-[8px]
                            active:shadow-none
                            ${gameMode === mode ? 'ring-4 ring-black ring-offset-4' : ''}
                        `}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="text-6xl mb-4">{icon}</div>
                        <p className="text-3xl font-black text-black uppercase mb-2">{title}</p>
                        <p className="text-lg font-bold text-black">{description}</p>
                    </motion.button>
                ))}
            </div>

            <div className="mt-4 max-w-2xl">
                {gameMode === 'alternative' && (
                    <div className="bg-yellow-300 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
                        <p className="font-bold text-black text-sm text-center">
                            ⭐ Collect star food to complete levels • Grid grows every 3 levels • Avoid obstacles!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
