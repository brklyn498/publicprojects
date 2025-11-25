"use client";

import { useGameStore } from "@/store/gameStore";
import { Word } from "@/types";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function CrosswordGrid() {
  const {
    currentPuzzle,
    gridState,
    cursor,
    setCursor,
    toggleDirection,
    isComplete,
  } = useGameStore();

  if (!currentPuzzle) return null;

  const { rows, cols } = currentPuzzle.gridSize;

  // Build a map of which cells are active (part of any word)
  const activeCellsMap = useMemo(() => {
    const map = new Set<string>();

    currentPuzzle.words.forEach((word) => {
      for (let i = 0; i < word.answer.length; i++) {
        const row = word.orientation === "across" ? word.startRow : word.startRow + i;
        const col = word.orientation === "across" ? word.startCol + i : word.startCol;
        map.add(`${row}-${col}`);
      }
    });

    return map;
  }, [currentPuzzle]);

  // Calculate cell numbers
  const getCellNumber = (row: number, col: number): number | undefined => {
    const wordsAtCell = currentPuzzle.words.filter(
      (word) => word.startRow === row && word.startCol === col
    );

    if (wordsAtCell.length === 0) return undefined;

    // Find the smallest word ID number
    const numbers = wordsAtCell.map((word) => {
      const match = word.id.match(/(\d+)-/);
      return match ? parseInt(match[1]) : 999;
    });

    return Math.min(...numbers);
  };

  // Get words that pass through this cell
  const getWordsAtCell = (row: number, col: number): Word[] => {
    return currentPuzzle.words.filter((word) => {
      if (word.orientation === "across") {
        return (
          word.startRow === row &&
          col >= word.startCol &&
          col < word.startCol + word.answer.length
        );
      } else {
        return (
          word.startCol === col &&
          row >= word.startRow &&
          row < word.startRow + word.answer.length
        );
      }
    });
  };

  // Check if cell is part of current word
  const isPartOfCurrentWord = (row: number, col: number): boolean => {
    const wordsAtCell = getWordsAtCell(row, col);
    return wordsAtCell.some((word) => word.orientation === cursor.direction);
  };

  const handleCellClick = (row: number, col: number) => {
    const cellKey = `${row}-${col}`;

    // Don't allow clicking black cells
    if (!activeCellsMap.has(cellKey)) return;

    // If clicking the same cell, toggle direction
    if (cursor.row === row && cursor.col === col) {
      toggleDirection();
    } else {
      // Set cursor to clicked cell, maintain current direction if possible
      const wordsAtCell = getWordsAtCell(row, col);
      const wordInCurrentDirection = wordsAtCell.find(
        (w) => w.orientation === cursor.direction
      );

      if (wordInCurrentDirection) {
        setCursor({ row, col, direction: cursor.direction });
      } else if (wordsAtCell.length > 0) {
        setCursor({ row, col, direction: wordsAtCell[0].orientation });
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-4 overflow-auto max-h-[70vh] w-full">
      <div
        className="inline-grid gap-0 bg-black dark:bg-gray-600 border-2 border-black dark:border-gray-600"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const isActiveCell = activeCellsMap.has(key);
            const cellNumber = getCellNumber(rowIndex, colIndex);
            const letter = gridState[key] || "";
            const isActive = cursor.row === rowIndex && cursor.col === colIndex;
            const isInCurrentWord = isPartOfCurrentWord(rowIndex, colIndex);

            // Render black cell
            if (!isActiveCell) {
              return (
                <div
                  key={key}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black dark:bg-gray-800"
                />
              );
            }

            // Render active cell
            return (
              <motion.div
                key={key}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                  border border-black dark:border-gray-600 cursor-pointer
                  transition-colors duration-150
                  ${isComplete ? "bg-success-green dark:bg-success-green" : "bg-white dark:bg-dark-card"}
                  ${isActive && !isComplete ? "bg-highlight-blue-dark dark:bg-dark-highlight-active" : ""}
                  ${isInCurrentWord && !isActive && !isComplete ? "bg-highlight-blue dark:bg-dark-highlight" : ""}
                `}
                animate={{
                  scale: isComplete ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 0.3,
                  delay: (rowIndex * cols + colIndex) * 0.01,
                }}
              >
                {cellNumber && (
                  <span className="absolute top-0 left-0.5 text-[6px] sm:text-[7px] md:text-[8px] font-medium text-gray-700 dark:text-gray-400">
                    {cellNumber}
                  </span>
                )}
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className={`
                      font-serif text-sm sm:text-base md:text-xl font-bold
                      ${isComplete ? "text-white" : "text-black dark:text-white"}
                    `}
                  >
                    {letter}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
