"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";
import { CrosswordData } from "@/types";
import crosswordData from "@/crossword vocab.json";
import Game from "@/components/Game";
import { ArrowLeft } from "lucide-react";

export default function PuzzlePage() {
  const params = useParams();
  const router = useRouter();
  const { setCurrentPuzzle, resetPuzzle } = useGameStore();
  const data = crosswordData as CrosswordData;

  useEffect(() => {
    const puzzleId = params.id as string;
    const puzzle = data.puzzles.find((p) => p.id === puzzleId);

    if (puzzle) {
      resetPuzzle();
      setCurrentPuzzle(puzzle);
    } else {
      router.push("/");
    }
  }, [params.id]);

  return (
    <div className="relative">
      <button
        onClick={() => router.push("/")}
        className="
          fixed top-4 left-4 z-50
          bg-white dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-border
          border border-gray-300 dark:border-dark-border
          text-gray-900 dark:text-white
          rounded-lg px-4 py-2
          flex items-center gap-2
          transition-colors
          shadow-sm
        "
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
      </button>
      <Game />
    </div>
  );
}
