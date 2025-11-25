"use client";

import { Cell } from "@/types/sudoku";
import { motion } from "framer-motion";

interface SudokuCellProps {
    cell: Cell;
    row: number;
    col: number;
    isSelected: boolean;
    onClick: () => void;
}

export default function SudokuCell({ cell, row, col, isSelected, onClick }: SudokuCellProps) {
    // Determine cell background
    const getBackgroundClass = () => {
        if (isSelected) return "bg-blue-200 dark:bg-blue-900/40";
        if (cell.isHighlighted) return "bg-blue-50 dark:bg-blue-900/20";
        if (cell.isError) return "bg-red-50 dark:bg-red-900/20";
        if (cell.isGiven) return "bg-gray-100 dark:bg-dark-border";
        return "bg-white dark:bg-dark-card";
    };

    // Determine text color
    const getTextClass = () => {
        if (cell.isError) return "text-red-600 dark:text-red-400";
        if (cell.isGiven) return "text-gray-900 dark:text-gray-300 font-bold";
        return "text-blue-600 dark:text-blue-400 font-semibold";
    };

    // Box borders (thick every 3 cells)
    const getBordersClass = () => {
        const borders = [];
        if (col % 3 === 0 && col !== 0) borders.push("border-l-2");
        if (row % 3 === 0 && row !== 0) borders.push("border-t-2");
        return borders.join(" ");
    };

    return (
        <motion.div
            className={`
        relative aspect-square 
        border border-gray-300 dark:border-dark-border
        ${getBordersClass()}
        ${getBackgroundClass()}
        ${isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400 z-10" : ""}
        cursor-pointer
        flex items-center justify-center
        transition-colors duration-150
        hover:bg-blue-100 dark:hover:bg-blue-900/30
      `}
            onClick={onClick}
            whileHover={{ scale: cell.isGiven ? 1 : 1.02 }}
            whileTap={{ scale: cell.isGiven ? 1 : 0.98 }}
        >
            {cell.value !== null ? (
                <span className={`text-xl sm:text-2xl ${getTextClass()}`}>
                    {cell.value}
                </span>
            ) : cell.notes.length > 0 ? (
                <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div
                            key={num}
                            className="flex items-center justify-center text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400"
                        >
                            {cell.notes.includes(num) ? num : ""}
                        </div>
                    ))}
                </div>
            ) : null}
        </motion.div>
    );
}
