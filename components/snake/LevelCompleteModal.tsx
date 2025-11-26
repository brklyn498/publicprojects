"use client";

import { useSnakeStore } from "@/store/snakeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

export default function LevelCompleteModal() {
    const { level, score } = useSnakeStore();

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="
                    bg-gradient-to-br from-purple-400 to-pink-400
                    border-[8px] border-black
                    shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]
                    p-8 max-w-md w-full
                "
            >
                {/* Star Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex justify-center mb-6"
                >
                    <div className="bg-yellow-300 border-[6px] border-black rounded-full p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <Star className="w-16 h-16 fill-yellow-500 text-yellow-500" />
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-black text-black text-center mb-2 uppercase"
                >
                    Level {level - 1}
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-black text-center mb-6"
                >
                    Complete! 🎉
                </motion.p>

                {/* Score Info */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 mb-6"
                >
                    <p className="text-lg font-bold text-black text-center">
                        Score: <span className="text-2xl">{score}</span>
                    </p>
                </motion.div>

                {/* Next Level Info */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-cyan-300 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 mb-6"
                >
                    <div className="flex items-center justify-center gap-2">
                        <p className="text-xl font-black text-black">
                            Level {level}
                        </p>
                        <ArrowRight className="w-6 h-6" strokeWidth={3} />
                        <p className="text-lg font-bold text-black">
                            Get Ready!
                        </p>
                    </div>
                </motion.div>

                {/* Loading animation */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 2, ease: "linear" }}
                    className="h-3 bg-green-400 border-[3px] border-black origin-left"
                />
            </motion.div>
        </div>
    );
}
