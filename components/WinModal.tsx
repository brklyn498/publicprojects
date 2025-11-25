"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Clock, Lightbulb, Award } from "lucide-react";
import confetti from "canvas-confetti";

export default function WinModal() {
  const { isComplete, currentPuzzle, timerElapsed, hintsUsed, puzzleStats } = useGameStore();
  const router = useRouter();

  useEffect(() => {
    if (isComplete) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ["#10b981", "#3b82f6", "#f59e0b"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ["#10b981", "#3b82f6", "#f59e0b"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isComplete]);

  const handleBackToMenu = () => {
    router.push("/");
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get best time for this puzzle
  const getBestTime = (): number | null => {
    if (!currentPuzzle) return null;
    const completions = puzzleStats.filter((s) => s.puzzleId === currentPuzzle.id);
    if (completions.length === 0) return null;
    return Math.min(...completions.map((s) => s.completionTime));
  };

  const bestTime = getBestTime();
  const isNewBest = bestTime === timerElapsed;

  return (
    <AnimatePresence>
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackToMenu}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-success-green rounded-full mb-6"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Puzzle Complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              You successfully solved{" "}
              <span className="font-semibold">{currentPuzzle?.title}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Difficulty: {currentPuzzle?.difficulty}
            </p>

            {/* Statistics */}
            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">Time</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatTime(timerElapsed)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700 dark:text-gray-300">Hints Used</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {hintsUsed}
                </span>
              </div>

              {bestTime && bestTime < timerElapsed && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Best Time</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatTime(bestTime)}
                  </span>
                </div>
              )}

              {isNewBest && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  🎉 New Best Time!
                </motion.div>
              )}
            </div>

            <button
              onClick={handleBackToMenu}
              className="
                w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black
                font-semibold py-4 px-6 rounded-lg
                transition-colors duration-200
                text-lg
              "
            >
              Back to Menu
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

