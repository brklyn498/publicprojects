"use client";

import { motion } from "framer-motion";
import { Card } from "@/types/memory";

interface MemoryCardProps {
    card: Card;
    onClick: () => void;
    theme: string;
}

export default function MemoryCard({ card, onClick, theme }: MemoryCardProps) {
    const isRevealed = card.isFlipped || card.isMatched;

    return (
        <motion.div
            className="relative w-full aspect-square cursor-pointer"
            onClick={onClick}
            whileHover={!isRevealed ? { scale: 1.05 } : {}}
            whileTap={!isRevealed ? { scale: 0.95 } : {}}
        >
            <motion.div
                className="relative w-full h-full"
                initial={false}
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Card Back (Hidden side) */}
                <div
                    className="absolute w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center shadow-lg"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                    }}
                >
                    <div className="text-white text-6xl opacity-30">?</div>
                </div>

                {/* Card Front (Revealed content) */}
                <div
                    className={`
            absolute w-full h-full rounded-lg flex items-center justify-center shadow-lg
            ${card.isMatched
                            ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                            : "bg-white dark:bg-dark-card border-2 border-gray-300 dark:border-dark-border"
                        }
          `}
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    {theme === "emoji" && (
                        <span className="text-4xl sm:text-5xl md:text-6xl">{card.content}</span>
                    )}
                    {theme === "numbers" && (
                        <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 dark:text-blue-400">
                            {card.content}
                        </span>
                    )}
                    {theme === "colors" && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg shadow-md"
                            style={{ backgroundColor: card.content }}
                        />
                    )}
                    {theme === "icons" && (
                        <div className="text-blue-600 dark:text-blue-400">
                            {/* Icon placeholder - would need dynamic icon import */}
                            <span className="text-4xl">🎯</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
