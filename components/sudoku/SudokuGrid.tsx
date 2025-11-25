"use client";

import { useSudokuStore } from "@/store/sudokuStore";
import SudokuCell from "./SudokuCell";
import { motion } from "framer-motion";

export default function SudokuGrid() {
    const { grid, selectedCell, selectCell } = useSudokuStore();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto"
        >
            <div className="grid grid-cols-9 border-2 border-gray-800 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-800 dark:bg-gray-600">
                {grid.map((row, rowIdx) =>
                    row.map((cell, colIdx) => (
                        <SudokuCell
                            key={`${rowIdx}-${colIdx}`}
                            cell={cell}
                            row={rowIdx}
                            col={colIdx}
                            isSelected={
                                selectedCell?.row === rowIdx && selectedCell?.col === colIdx
                            }
                            onClick={() => selectCell(rowIdx, colIdx)}
                        />
                    ))
                )}
            </div>
        </motion.div>
    );
}
