"use client";

import { useGameStore } from "@/store/gameStore";
import { Word } from "@/types";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function CluePanel() {
  const { currentPuzzle, cursor, setCursor, gridState } = useGameStore();

  if (!currentPuzzle) return null;

  const acrossWords = currentPuzzle.words.filter((w) => w.orientation === "across");
  const downWords = currentPuzzle.words.filter((w) => w.orientation === "down");

  // Check if a word is completed
  const isWordCompleted = (word: Word): boolean => {
    for (let i = 0; i < word.answer.length; i++) {
      const row = word.orientation === "across" ? word.startRow : word.startRow + i;
      const col = word.orientation === "across" ? word.startCol + i : word.startCol;
      const key = `${row}-${col}`;
      const userLetter = gridState[key] || "";
      
      if (userLetter !== word.answer[i]) {
        return false;
      }
    }
    return true;
  };

  // Check if a word is currently active
  const isWordActive = (word: Word): boolean => {
    if (word.orientation !== cursor.direction) return false;

    if (cursor.direction === "across") {
      return (
        word.startRow === cursor.row &&
        cursor.col >= word.startCol &&
        cursor.col < word.startCol + word.answer.length
      );
    } else {
      return (
        word.startCol === cursor.col &&
        cursor.row >= word.startRow &&
        cursor.row < word.startRow + word.answer.length
      );
    }
  };

  // Handle clue click - navigate to that word
  const handleClueClick = (word: Word) => {
    setCursor({
      row: word.startRow,
      col: word.startCol,
      direction: word.orientation,
    });
  };

  // Get the clue number from word ID
  const getClueNumber = (word: Word): string => {
    const match = word.id.match(/(\d+)-/);
    return match ? match[1] : "";
  };

  // Calculate completion progress
  const completedAcross = acrossWords.filter(isWordCompleted).length;
  const completedDown = downWords.filter(isWordCompleted).length;
  const totalCompleted = completedAcross + completedDown;
  const totalWords = currentPuzzle.words.length;

  const ClueItem = ({ word }: { word: Word }) => {
    const completed = isWordCompleted(word);
    const active = isWordActive(word);
    const clueNumber = getClueNumber(word);

    return (
      <motion.button
        onClick={() => handleClueClick(word)}
        className={`
          w-full text-left px-3 py-2 rounded-lg
          transition-all duration-200
          ${active ? "bg-highlight-blue dark:bg-dark-highlight-active" : ""}
          ${!active && !completed ? "hover:bg-gray-100 dark:hover:bg-dark-border" : ""}
          ${completed ? "bg-success-green/10 dark:bg-success-green/20" : ""}
        `}
        whileHover={{ x: 2 }}
      >
        <div className="flex items-start gap-2">
          <span className="font-bold text-gray-900 dark:text-white min-w-[2rem] flex-shrink-0">
            {clueNumber}.
          </span>
          <span className={`flex-1 ${completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
            {word.clue}
          </span>
          {completed && (
            <CheckCircle2 className="w-4 h-4 text-success-green flex-shrink-0 mt-0.5" />
          )}
        </div>
      </motion.button>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-dark-card border-l border-gray-200 dark:border-dark-border">
      <div className="sticky top-0 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border p-4 z-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Clues</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-success-green" />
            <span>
              {totalCompleted}/{totalWords} complete
            </span>
          </div>
          <span>•</span>
          <span>
            {Math.round((totalCompleted / totalWords) * 100)}%
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Across Clues */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>Across</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({completedAcross}/{acrossWords.length})
            </span>
          </h3>
          <div className="space-y-1">
            {acrossWords.map((word) => (
              <ClueItem key={word.id} word={word} />
            ))}
          </div>
        </div>

        {/* Down Clues */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>Down</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({completedDown}/{downWords.length})
            </span>
          </h3>
          <div className="space-y-1">
            {downWords.map((word) => (
              <ClueItem key={word.id} word={word} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
