import { Difficulty } from "@/types/sudoku";

// Shuffle array helper
function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Check if a number can be placed at position
export function isValidPlacement(
    grid: number[][],
    row: number,
    col: number,
    num: number
): boolean {
    // Check row
    for (let c = 0; c < 9; c++) {
        if (c !== col && grid[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
        if (r !== row && grid[r][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
            if ((r !== row || c !== col) && grid[r][c] === num) return false;
        }
    }

    return true;
}

// Generate a complete valid Sudoku solution
export function generateSolution(): number[][] {
    const grid: number[][] = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

    // Fill diagonal 3x3 boxes first (they don't affect each other)
    for (let box = 0; box < 9; box += 3) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        let idx = 0;
        for (let r = box; r < box + 3; r++) {
            for (let c = box; c < box + 3; c++) {
                grid[r][c] = numbers[idx++];
            }
        }
    }

    // Fill remaining cells using backtracking
    fillRemaining(grid, 0, 3);

    return grid;
}

// Backtracking to fill remaining cells
function fillRemaining(grid: number[][], row: number, col: number): boolean {
    // Move to next row if at end of column
    if (col >= 9) {
        row++;
        col = 0;
    }

    // Completed if reached end
    if (row >= 9) return true;

    // Skip if cell already filled (diagonal boxes)
    if (grid[row][col] !== 0) {
        return fillRemaining(grid, row, col + 1);
    }

    // Try numbers 1-9 in random order
    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
        if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;

            if (fillRemaining(grid, row, col + 1)) {
                return true;
            }

            grid[row][col] = 0; // Backtrack
        }
    }

    return false;
}

// Solve puzzle using backtracking
export function solvePuzzle(grid: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidPlacement(grid, row, col, num)) {
                        grid[row][col] = num;

                        if (solvePuzzle(grid)) {
                            return true;
                        }

                        grid[row][col] = 0; // Backtrack
                    }
                }
                return false; // No valid number found
            }
        }
    }
    return true; // All cells filled
}

// Count solutions (to check uniqueness)
function countSolutions(grid: number[][], limit = 2): number {
    let count = 0;

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidPlacement(grid, row, col, num)) {
                        grid[row][col] = num;
                        count += countSolutions(grid, limit);
                        grid[row][col] = 0;

                        if (count >= limit) return count;
                    }
                }
                return count;
            }
        }
    }

    return 1; // Found a solution
}

// Check if puzzle has unique solution
export function hasUniqueSolution(puzzle: number[][]): boolean {
    const testGrid = puzzle.map((row) => [...row]);
    return countSolutions(testGrid, 2) === 1;
}

// Get clue count range for difficulty
export function getClueCount(difficulty: Difficulty): number {
    switch (difficulty) {
        case "easy":
            return 40 + Math.floor(Math.random() * 5); // 40-44
        case "medium":
            return 32 + Math.floor(Math.random() * 4); // 32-35
        case "hard":
            return 27 + Math.floor(Math.random() * 3); // 27-29
        case "expert":
            return 22 + Math.floor(Math.random() * 3); // 22-24
    }
}

// Generate puzzle by removing cells from solution
export function generatePuzzle(difficulty: Difficulty): {
    solution: number[][];
    puzzle: number[][];
    clueCount: number;
} {
    const solution = generateSolution();
    const puzzle = solution.map((row) => [...row]);
    const targetClues = getClueCount(difficulty);

    // Get all cell positions
    const positions: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            positions.push([r, c]);
        }
    }

    // Shuffle positions
    const shuffledPositions = shuffle(positions);

    // Remove cells while maintaining unique solution
    let cluesRemaining = 81;

    for (const [row, col] of shuffledPositions) {
        if (cluesRemaining <= targetClues) break;

        const backup = puzzle[row][col];
        puzzle[row][col] = 0;

        // Check if still has unique solution
        if (!hasUniqueSolution(puzzle)) {
            puzzle[row][col] = backup; // Restore
        } else {
            cluesRemaining--;
        }
    }

    return {
        solution,
        puzzle,
        clueCount: cluesRemaining,
    };
}

// Get a hint cell (empty cell with fewest possibilities)
export function getHintCell(
    puzzle: number[][],
    solution: number[][]
): { row: number; col: number; value: number } | null {
    const candidates: Array<{ row: number; col: number; count: number }> = [];

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (puzzle[row][col] === 0) {
                let possibleCount = 0;
                for (let num = 1; num <= 9; num++) {
                    if (isValidPlacement(puzzle, row, col, num)) {
                        possibleCount++;
                    }
                }
                candidates.push({ row, col, count: possibleCount });
            }
        }
    }

    if (candidates.length === 0) return null;

    // Sort by fewest possibilities
    candidates.sort((a, b) => a.count - b.count);

    const { row, col } = candidates[0];
    return { row, col, value: solution[row][col] };
}
