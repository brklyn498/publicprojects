"use client";

import { useSnakeStore } from "@/store/snakeStore";
import { motion } from "framer-motion";

export default function SnakeBoard() {
    const { snake, food, obstacles, starFood, gridSize } = useSnakeStore();

    const isSnakeSegment = (x: number, y: number) => {
        return snake.some(segment => segment.x === x && segment.y === y);
    };

    const isSnakeHead = (x: number, y: number) => {
        return snake[0].x === x && snake[0].y === y;
    };

    const isFood = (x: number, y: number) => {
        return food.x === x && food.y === y;
    };

    const isObstacle = (x: number, y: number) => {
        return obstacles.some(obs => obs.x === x && obs.y === y);
    };

    const isStarFood = (x: number, y: number) => {
        return starFood !== null && starFood.x === x && starFood.y === y;
    };

    return (
        <div className="relative">
            {/* Game Board - Neubrutalist Style */}
            <div
                className="
                    grid gap-0
                    bg-yellow-300
                    border-[6px] border-black
                    shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
                    p-2
                "
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                    width: '500px',
                    height: '500px',
                }}
            >
                {Array.from({ length: gridSize * gridSize }).map((_, index) => {
                    const x = index % gridSize;
                    const y = Math.floor(index / gridSize);
                    const isSnake = isSnakeSegment(x, y);
                    const isHead = isSnakeHead(x, y);
                    const isFoodCell = isFood(x, y);
                    const isObstacleCell = isObstacle(x, y);
                    const isStarFoodCell = isStarFood(x, y);

                    // Determine cell styling - obstacles take priority
                    let cellClasses = '';
                    if (isObstacleCell) {
                        cellClasses = 'bg-gray-800 border-[3px] border-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
                    } else if (isSnake) {
                        cellClasses = isHead
                            ? 'bg-green-600 border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-green-500 border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
                    } else if (isStarFoodCell) {
                        cellClasses = 'bg-yellow-400 border-[2px] border-black shadow-[0_0_20px_rgba(255,215,0,0.8)]';
                    } else if (isFoodCell) {
                        cellClasses = 'bg-red-500 border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
                    } else {
                        cellClasses = 'bg-gray-100 border-[2px] border-black';
                    }

                    // Determine cell type for key
                    const cellType = isObstacleCell ? 'obstacle'
                        : isSnake ? 'snake'
                            : isStarFoodCell ? 'star'
                                : isFoodCell ? 'food'
                                    : 'empty';

                    return (
                        <motion.div
                            key={`${x}-${y}-${cellType}`}
                            className={cellClasses}
                            initial={false}
                            animate={isFoodCell ? {
                                scale: [1, 1.1, 1],
                            } : isStarFoodCell ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 360],
                            } : {
                                scale: 1,
                                rotate: 0,
                            }}
                            transition={isFoodCell ? {
                                duration: 0.5,
                                repeat: Infinity,
                            } : isStarFoodCell ? {
                                duration: 2,
                                repeat: Infinity,
                            } : {
                                duration: 0,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
