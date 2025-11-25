"use client";

import { useMemoryGameStore } from "@/store/memoryGameStore";
import MemoryCard from "./MemoryCard";
import { getGridSize } from "@/lib/memoryContent";
import { motion } from "framer-motion";

export default function MemoryBoard() {
    const { cards, difficulty, theme, flipCard } = useMemoryGameStore();
    const gridSize = getGridSize(difficulty);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto p-4"
        >
            <div
                className="grid gap-2 sm:gap-3 md:gap-4"
                style={{
                    gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${gridSize.rows}, minmax(0, 1fr))`,
                }}
            >
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                    >
                        <MemoryCard
                            card={card}
                            onClick={() => flipCard(card.id)}
                            theme={theme}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
