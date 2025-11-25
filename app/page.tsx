"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Play, Trophy } from "lucide-react";
import { CrosswordData } from "@/types";
import CrosswordStatsOverview from "@/components/CrosswordStatsOverview";
import crosswordData from "@/crossword vocab.json";

export default function Home() {
  const router = useRouter();
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const data = crosswordData as CrosswordData;

  useEffect(() => {
    // Load solved puzzles from localStorage
    const solved = JSON.parse(localStorage.getItem("solvedPuzzles") || "[]");
    setSolvedPuzzles(solved);
  }, []);

  const handleSelectPuzzle = (puzzleId: string) => {
    router.push(`/puzzle/${puzzleId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-3">
            Puzzle Games
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl mb-4">
            Choose a game to play
          </p>

          {/* View Statistics Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push('/stats')}
            className="
              inline-flex items-center gap-2
              px-6 py-3 rounded-lg
              bg-blue-600 hover:bg-blue-700
              text-white font-medium
              transition-colors shadow-md
            "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trophy className="w-5 h-5" />
            View Statistics
          </motion.button>
        </div>

        {/* Crossword Statistics */}
        <CrosswordStatsOverview />

        {/* Games Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Games
          </h2>

          {/* Tic Tac Toe Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push('/tictactoe')}
            className="
              cursor-pointer
              bg-white dark:bg-dark-card
              rounded-lg shadow-md
              hover:shadow-lg
              transition-all duration-200
              p-6
              border border-gray-200 dark:border-dark-border
              mb-6
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Tic Tac Toe 4×4
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Challenge a friend or battle the computer!
                </p>
              </div>
              <Play className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </motion.div>

          {/* Memory Match Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push('/memory')}
            className="
              cursor-pointer
              bg-white dark:bg-dark-card
              rounded-lg shadow-md
              hover:shadow-lg
              transition-all duration-200
              p-6
              border border-gray-200 dark:border-dark-border
              mb-6
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Memory Match 🎴
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Flip cards and find matching pairs!
                </p>
              </div>
              <Play className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Crossword Puzzles Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Crossword Puzzles
          </h2>

          <div className="space-y-3">
            {data.puzzles.map((puzzle, index) => {
              const isSolved = solvedPuzzles.includes(puzzle.id);
              return (
                <motion.div
                  key={puzzle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelectPuzzle(puzzle.id)}
                  className="
                    cursor-pointer
                    bg-white dark:bg-dark-card
                    rounded-lg shadow-md
                    hover:shadow-lg
                    transition-all duration-200
                    p-6
                    border border-gray-200 dark:border-dark-border
                    relative
                  "
                >
                  {isSolved && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-6 h-6 text-success-green" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {(puzzle as any).title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                            px-2 py-1 rounded text-xs font-semibold
                            ${puzzle.difficulty === "easy"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : puzzle.difficulty === "medium"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            }
                          `}
                        >
                          {puzzle.difficulty.toUpperCase()}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {(puzzle as any).gridSize.rows}×{(puzzle as any).gridSize.cols}
                        </span>
                      </div>
                    </div>
                    <Play className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
