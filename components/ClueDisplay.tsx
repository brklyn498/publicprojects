"use client";

import { useGameStore } from "@/store/gameStore";

export default function ClueDisplay() {
  const { currentWord } = useGameStore();

  if (!currentWord) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 border-2 border-gray-200 dark:border-dark-border">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <span className="inline-block bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded font-semibold text-sm">
              {currentWord.id.replace("-", " ").toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
              {currentWord.clue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
