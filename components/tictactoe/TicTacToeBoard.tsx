"use client";

import { useTicTacToeStore } from "@/store/ticTacToeStore";
import { motion } from "framer-motion";

export default function TicTacToeBoard() {
    const { board, makeMove, currentPlayer, gameStatus, winLine } = useTicTacToeStore();

    const isWinningCell = (row: number, col: number): boolean => {
        if (!winLine) return false;
        return winLine.positions.some(([r, c]) => r === row && c === col);
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div
                className="inline-grid gap-2 bg-black dark:bg-gray-600 p-2 rounded-lg shadow-2xl"
                style={{
                    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                    gridTemplateRows: "repeat(4, minmax(0, 1fr))",
                }}
            >
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isWinning = isWinningCell(rowIndex, colIndex);
                        const key = `${rowIndex}-${colIndex}`;

                        return (
                            <motion.button
                                key={key}
                                onClick={() => makeMove(rowIndex, colIndex)}
                                disabled={gameStatus !== "playing" || !!cell}
                                className={`
                  w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                  bg-white dark:bg-dark-card
                  rounded-lg
                  flex items-center justify-center
                  font-serif text-3xl sm:text-4xl md:text-5xl font-bold
                  transition-all duration-200
                  ${!cell && gameStatus === "playing" ? "hover:bg-gray-100 dark:hover:bg-dark-border cursor-pointer" : ""}
                  ${isWinning ? "bg-success-green dark:bg-success-green" : ""}
                  ${cell ? "cursor-not-allowed" : ""}
                `}
                                whileHover={!cell && gameStatus === "playing" ? { scale: 1.05 } : {}}
                                whileTap={!cell && gameStatus === "playing" ? { scale: 0.95 } : {}}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2, delay: (rowIndex * 4 + colIndex) * 0.02 }}
                            >
                                {cell && (
                                    <motion.span
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className={`
                      ${cell === "X" ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}
                      ${isWinning ? "text-white" : ""}
                    `}
                                    >
                                        {cell}
                                    </motion.span>
                                )}
                            </motion.button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
