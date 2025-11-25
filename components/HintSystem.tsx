"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function HintSystem() {
    const { hintsUsed, maxHints, useHint, checkWord } = useGameStore();
    const [checkResult, setCheckResult] = useState<"correct" | "incorrect" | null>(null);

    const hintsRemaining = maxHints - hintsUsed;

    const handleRevealHint = () => {
        if (hintsUsed >= maxHints) return;
        useHint("reveal");
    };

    const handleCheckHint = () => {
        if (hintsUsed >= maxHints) return;

        const isCorrect = checkWord();
        setCheckResult(isCorrect ? "correct" : "incorrect");

        // Clear result after 2 seconds
        setTimeout(() => setCheckResult(null), 2000);

        if (!isCorrect) {
            useHint("check");
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Hint Counter */}
            <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-dark-border rounded-lg">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {hintsRemaining}/{maxHints}
                </span>
            </div>

            {/* Reveal Letter Button */}
            <motion.button
                onClick={handleRevealHint}
                disabled={hintsUsed >= maxHints}
                className={`
          px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-200
          ${hintsUsed >= maxHints
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                    }
        `}
                whileHover={hintsUsed < maxHints ? { scale: 1.05 } : {}}
                whileTap={hintsUsed < maxHints ? { scale: 0.95 } : {}}
            >
                Reveal Letter
            </motion.button>

            {/* Check Word Button */}
            <motion.button
                onClick={handleCheckHint}
                disabled={hintsUsed >= maxHints}
                className={`
          px-3 py-2 rounded-lg text-sm font-medium relative
          transition-all duration-200
          ${hintsUsed >= maxHints
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                    }
        `}
                whileHover={hintsUsed < maxHints ? { scale: 1.05 } : {}}
                whileTap={hintsUsed < maxHints ? { scale: 0.95 } : {}}
            >
                Check Word

                {/* Check Result Indicator */}
                {checkResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-2 -right-2"
                    >
                        {checkResult === "correct" ? (
                            <CheckCircle2 className="w-5 h-5 text-success-green" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
}
