"use client";

import { useSudokuStore } from "@/store/sudokuStore";
import { motion } from "framer-motion";

export default function NumberPad() {
    const { setNumber, selectedCell, notesMode } = useSudokuStore();

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div className="grid grid-cols-9 gap-2 max-w-lg mx-auto mt-6">
            {numbers.map((num) => (
                <motion.button
                    key={num}
                    onClick={() => setNumber(num)}
                    disabled={!selectedCell}
                    className={`
            aspect-square
            rounded-lg
            text-lg sm:text-xl font-bold
            transition-all
            ${selectedCell
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                            : "bg-gray-300 dark:bg-dark-border text-gray-500 cursor-not-allowed"
                        }
            ${notesMode ? "ring-2 ring-purple-500 dark:ring-purple-400" : ""}
          `}
                    whileHover={selectedCell ? { scale: 1.1 } : {}}
                    whileTap={selectedCell ? { scale: 0.95 } : {}}
                >
                    {num}
                </motion.button>
            ))}
        </div>
    );
}
