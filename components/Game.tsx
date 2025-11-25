"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import CrosswordGrid from "./CrosswordGrid";
import ClueDisplay from "./ClueDisplay";
import VirtualKeyboard from "./VirtualKeyboard";
import WinModal from "./WinModal";
import CluePanel from "./CluePanel";
import Timer from "./Timer";
import HintSystem from "./HintSystem";
import { Menu, X } from "lucide-react";

export default function Game() {
  const {
    currentPuzzle,
    cursor,
    updateCell,
    setCursor,
    moveCursor,
    handleBackspace,
    checkSolution,
    gridState,
  } = useGameStore();

  const [showCluePanel, setShowCluePanel] = useState(false);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentPuzzle) return;

      // Prevent default for arrow keys and space
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }

      // Handle letter input (English and Cyrillic)
      if (/^[a-zA-Zа-яА-ЯёЁ]$/.test(e.key)) {
        handleLetterInput(e.key.toUpperCase());
        return;
      }

      // Handle special keys
      switch (e.key) {
        case "Backspace":
          handleBackspace();
          break;
        case "ArrowUp":
          moveCursor("up");
          break;
        case "ArrowDown":
          moveCursor("down");
          break;
        case "ArrowLeft":
          moveCursor("left");
          break;
        case "ArrowRight":
          moveCursor("right");
          break;
        case "Tab":
          e.preventDefault();
          moveToNextWord();
          break;
        case " ":
          e.preventDefault();
          // Toggle direction on space
          const newDirection = cursor.direction === "across" ? "down" : "across";
          setCursor({ ...cursor, direction: newDirection });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPuzzle, cursor, handleBackspace, moveCursor]);

  const handleLetterInput = (letter: string) => {
    if (!currentPuzzle) return;

    // Update current cell
    updateCell(cursor.row, cursor.col, letter);

    // Move to next cell in current direction
    const { row, col, direction } = cursor;
    if (direction === "across") {
      if (col < currentPuzzle.gridSize.cols - 1) {
        setCursor({ ...cursor, col: col + 1 });
      }
    } else {
      if (row < currentPuzzle.gridSize.rows - 1) {
        setCursor({ ...cursor, row: row + 1 });
      }
    }

    // Check if puzzle is complete after a short delay
    setTimeout(() => {
      if (isGridFull()) {
        checkSolution();
      }
    }, 100);
  };

  const isGridFull = (): boolean => {
    if (!currentPuzzle) return false;

    const totalCells = currentPuzzle.gridSize.rows * currentPuzzle.gridSize.cols;
    const filledCells = Object.keys(gridState).filter((key) => gridState[key]).length;

    return filledCells === totalCells;
  };

  const moveToNextWord = () => {
    if (!currentPuzzle) return;

    const currentWordIndex = currentPuzzle.words.findIndex((word) => {
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
    });

    // Find next word in same direction
    const sameDirectionWords = currentPuzzle.words.filter(
      (w) => w.orientation === cursor.direction
    );
    const currentIndexInDirection = sameDirectionWords.findIndex(
      (w) => w.id === currentPuzzle.words[currentWordIndex]?.id
    );

    if (currentIndexInDirection !== -1 && currentIndexInDirection < sameDirectionWords.length - 1) {
      const nextWord = sameDirectionWords[currentIndexInDirection + 1];
      setCursor({
        row: nextWord.startRow,
        col: nextWord.startCol,
        direction: cursor.direction,
      });
    } else if (sameDirectionWords.length > 0) {
      // Wrap to first word
      const firstWord = sameDirectionWords[0];
      setCursor({
        row: firstWord.startRow,
        col: firstWord.startCol,
        direction: cursor.direction,
      });
    }
  };

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No puzzle selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <WinModal />

      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {currentPuzzle.title}
            </h1>

            {/* Mobile Clue Panel Toggle */}
            <button
              onClick={() => setShowCluePanel(!showCluePanel)}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-dark-highlight transition-colors"
            >
              {showCluePanel ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-gray-100 dark:bg-dark-bg rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentPuzzle.difficulty}
            </span>
            <Timer />
            <HintSystem />
          </div>
        </div>
      </header>

      {/* Main Content - Desktop: Grid + Clue Panel, Mobile: Stack */}
      <main className="flex-1 flex overflow-hidden">
        {/* Mobile Clue Panel Overlay */}
        {showCluePanel && (
          <div className="lg:hidden fixed inset-0 z-40 bg-white dark:bg-dark-card overflow-y-auto">
            <CluePanel />
          </div>
        )}

        {/* Game Area */}
        <div className="flex-1 flex flex-col overflow-auto">
          <ClueDisplay />
          <div className="flex-1 flex items-center justify-center">
            <CrosswordGrid />
          </div>
        </div>

        {/* Desktop Clue Panel */}
        <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
          <CluePanel />
        </div>
      </main>

      {/* Virtual Keyboard */}
      <div className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border py-2">
        <VirtualKeyboard
          onKeyPress={handleLetterInput}
          onBackspace={handleBackspace}
          language={currentPuzzle.language}
        />
      </div>
    </div>
  );
}

