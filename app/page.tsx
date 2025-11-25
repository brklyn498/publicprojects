"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Play } from "lucide-react";
import { CrosswordData } from "@/types";
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
            Crossword Puzzles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl">
            Choose a puzzle to get started
          </p>
        </div>

        {/* Puzzle List */}
        <div className="space-y-4">
          {data.puzzles.map((puzzle, index) => {
            const isSolved = solvedPuzzles.includes(puzzle.id);

            return (
              <motion.button
                key={puzzle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleSelectPuzzle(puzzle.id)}
                className="
                  w-full bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-border
                  border-2 border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-500
                  rounded-xl p-6 sm:p-8
                  transition-all duration-200
                  group relative
                  shadow-sm hover:shadow-md
                "
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {puzzle.title}
                      </h2>
                      {isSolved && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-success-green" />
                        </motion.div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-bg rounded-full text-sm font-medium">
                        {puzzle.difficulty}
                      </span>
                      <span className="text-sm">
                        {puzzle.gridSize.rows} × {puzzle.gridSize.cols}
                      </span>
                      <span className="text-sm">
                        {puzzle.words.filter((w) => w.orientation === "across").length}{" "}
                        Across, {puzzle.words.filter((w) => w.orientation === "down").length}{" "}
                        Down
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div
                      className="
                        w-12 h-12 sm:w-14 sm:h-14
                        bg-black dark:bg-white group-hover:bg-gray-800 dark:group-hover:bg-gray-200
                        rounded-full flex items-center justify-center
                        transition-colors
                      "
                    >
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white dark:text-black ml-1" />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm"
        >
          <p>Use your keyboard or the virtual keyboard to play</p>
          <p className="mt-1">Click a cell twice to change direction</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
