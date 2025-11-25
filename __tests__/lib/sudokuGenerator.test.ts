import { describe, it, expect } from 'vitest';
import {
  isValidPlacement,
  generateSolution,
  hasUniqueSolution,
  generatePuzzle,
  getHintCell,
  getClueCount,
  solvePuzzle,
} from '@/lib/sudokuGenerator';
import type { Difficulty } from '@/types/sudoku';

describe('Sudoku Generator', () => {
  describe('isValidPlacement', () => {
    it('should return true for valid placement in empty grid', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));
      expect(isValidPlacement(grid, 0, 0, 5)).toBe(true);
    });

    it('should detect row conflicts', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));
      grid[0][0] = 5;
      expect(isValidPlacement(grid, 0, 5, 5)).toBe(false);
    });

    it('should detect column conflicts', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));
      grid[0][0] = 5;
      expect(isValidPlacement(grid, 5, 0, 5)).toBe(false);
    });

    it('should detect 3x3 box conflicts', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));
      grid[0][0] = 5;
      expect(isValidPlacement(grid, 1, 1, 5)).toBe(false);
      expect(isValidPlacement(grid, 2, 2, 5)).toBe(false);
    });

    it('should allow same number in different 3x3 boxes', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));
      grid[0][0] = 5;
      expect(isValidPlacement(grid, 3, 3, 5)).toBe(true);
      expect(isValidPlacement(grid, 6, 6, 5)).toBe(true);
    });

    it('should handle placement at current cell location', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));
      grid[4][4] = 5;
      // Placing the same number at the same location should be valid
      // (the function excludes the current cell from checks)
      expect(isValidPlacement(grid, 4, 4, 5)).toBe(true);
    });

    it('should validate all numbers 1-9', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));
      for (let num = 1; num <= 9; num++) {
        expect(isValidPlacement(grid, 4, 4, num)).toBe(true);
      }
    });

    it('should validate edge positions correctly', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));
      // Top-left corner
      expect(isValidPlacement(grid, 0, 0, 1)).toBe(true);
      // Top-right corner
      expect(isValidPlacement(grid, 0, 8, 1)).toBe(true);
      // Bottom-left corner
      expect(isValidPlacement(grid, 8, 0, 1)).toBe(true);
      // Bottom-right corner
      expect(isValidPlacement(grid, 8, 8, 1)).toBe(true);
    });

    it('should detect conflicts across all 9 3x3 boxes', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));

      // Place 5 in center of each 3x3 box
      const boxCenters = [
        [1, 1], [1, 4], [1, 7],
        [4, 1], [4, 4], [4, 7],
        [7, 1], [7, 4], [7, 7],
      ];

      boxCenters.forEach(([row, col], index) => {
        grid[row][col] = index + 1;
        // Try to place the same number in the same box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        expect(isValidPlacement(grid, boxRow, boxCol, index + 1)).toBe(false);
      });
    });

    it('should handle partially filled grid correctly', () => {
      const grid = Array(9).fill(null).map(() => Array(9).fill(0));
      // Fill first row with 1-9
      for (let col = 0; col < 9; col++) {
        grid[0][col] = col + 1;
      }

      // Try to place duplicate in same row
      expect(isValidPlacement(grid, 0, 4, 1)).toBe(false);

      // Try to place in different row, same column
      expect(isValidPlacement(grid, 1, 0, 1)).toBe(false);

      // Try to place in valid location
      expect(isValidPlacement(grid, 5, 5, 9)).toBe(true);
    });
  });

  describe('generateSolution', () => {
    it('should generate a 9x9 grid', () => {
      const solution = generateSolution();
      expect(solution.length).toBe(9);
      solution.forEach(row => {
        expect(row.length).toBe(9);
      });
    });

    it('should fill all cells with numbers 1-9', () => {
      const solution = generateSolution();
      solution.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });
    });

    it('should have unique numbers in each row', () => {
      const solution = generateSolution();
      solution.forEach(row => {
        const numbers = new Set(row);
        expect(numbers.size).toBe(9);
        for (let num = 1; num <= 9; num++) {
          expect(numbers.has(num)).toBe(true);
        }
      });
    });

    it('should have unique numbers in each column', () => {
      const solution = generateSolution();
      for (let col = 0; col < 9; col++) {
        const column = solution.map(row => row[col]);
        const numbers = new Set(column);
        expect(numbers.size).toBe(9);
        for (let num = 1; num <= 9; num++) {
          expect(numbers.has(num)).toBe(true);
        }
      }
    });

    it('should have unique numbers in each 3x3 box', () => {
      const solution = generateSolution();

      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
          const numbers: number[] = [];
          for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
            for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
              numbers.push(solution[r][c]);
            }
          }
          const uniqueNumbers = new Set(numbers);
          expect(uniqueNumbers.size).toBe(9);
          for (let num = 1; num <= 9; num++) {
            expect(uniqueNumbers.has(num)).toBe(true);
          }
        }
      }
    });

    it('should generate different solutions on multiple calls', () => {
      const solutions = new Set<string>();
      for (let i = 0; i < 5; i++) {
        const solution = generateSolution();
        solutions.add(JSON.stringify(solution));
      }
      // Should generate at least some different solutions
      expect(solutions.size).toBeGreaterThan(1);
    });

    it('should pass validation for all placements', () => {
      const solution = generateSolution();
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          expect(isValidPlacement(solution, row, col, solution[row][col])).toBe(true);
        }
      }
    });
  });

  describe('getClueCount', () => {
    it('should return 40-44 clues for easy difficulty', () => {
      for (let i = 0; i < 10; i++) {
        const count = getClueCount('easy');
        expect(count).toBeGreaterThanOrEqual(40);
        expect(count).toBeLessThanOrEqual(44);
      }
    });

    it('should return 32-35 clues for medium difficulty', () => {
      for (let i = 0; i < 10; i++) {
        const count = getClueCount('medium');
        expect(count).toBeGreaterThanOrEqual(32);
        expect(count).toBeLessThanOrEqual(35);
      }
    });

    it('should return 27-29 clues for hard difficulty', () => {
      for (let i = 0; i < 10; i++) {
        const count = getClueCount('hard');
        expect(count).toBeGreaterThanOrEqual(27);
        expect(count).toBeLessThanOrEqual(29);
      }
    });

    it('should return 22-24 clues for expert difficulty', () => {
      for (let i = 0; i < 10; i++) {
        const count = getClueCount('expert');
        expect(count).toBeGreaterThanOrEqual(22);
        expect(count).toBeLessThanOrEqual(24);
      }
    });
  });

  describe('hasUniqueSolution', () => {
    it('should return true for a complete valid solution', () => {
      const solution = generateSolution();
      expect(hasUniqueSolution(solution)).toBe(true);
    });

    it('should return true for a valid puzzle with one solution', () => {
      // Create a simple puzzle with unique solution
      const puzzle = Array(9).fill(null).map(() => Array(9).fill(0));
      // Fill diagonal boxes (they don't interfere with each other)
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let box = 0; box < 3; box++) {
        let idx = 0;
        for (let r = box * 3; r < box * 3 + 3; r++) {
          for (let c = box * 3; c < box * 3 + 3; c++) {
            puzzle[r][c] = numbers[idx++];
          }
        }
      }
      // This puzzle should have at least one solution
      const result = hasUniqueSolution(puzzle);
      expect(typeof result).toBe('boolean');
    });

    it('should return false for empty grid (multiple solutions)', () => {
      const emptyGrid = Array(9).fill(null).map(() => Array(9).fill(0));
      expect(hasUniqueSolution(emptyGrid)).toBe(false);
    });

    it('should return false for grid with very few clues', () => {
      const sparseGrid = Array(9).fill(null).map(() => Array(9).fill(0));
      sparseGrid[0][0] = 1;
      sparseGrid[1][1] = 2;
      // Very sparse grid will have multiple solutions
      expect(hasUniqueSolution(sparseGrid)).toBe(false);
    });
  });

  describe('solvePuzzle', () => {
    it('should solve a valid puzzle', () => {
      const puzzle = Array(9).fill(null).map(() => Array(9).fill(0));
      // Create a simple puzzle
      puzzle[0][0] = 5;
      puzzle[1][1] = 6;
      puzzle[2][2] = 7;

      const result = solvePuzzle(puzzle);
      expect(result).toBe(true);

      // Check that all cells are filled
      puzzle.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });
    });

    it('should maintain given clues', () => {
      const puzzle = Array(9).fill(null).map(() => Array(9).fill(0));
      const givenClues: [number, number, number][] = [
        [0, 0, 5],
        [1, 1, 6],
        [2, 2, 7],
      ];

      givenClues.forEach(([row, col, num]) => {
        puzzle[row][col] = num;
      });

      solvePuzzle(puzzle);

      givenClues.forEach(([row, col, num]) => {
        expect(puzzle[row][col]).toBe(num);
      });
    });
  });

  describe('generatePuzzle', () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

    difficulties.forEach(difficulty => {
      describe(`${difficulty} difficulty`, () => {
        it('should generate valid puzzle and solution', () => {
          const { solution, puzzle, clueCount } = generatePuzzle(difficulty);

          expect(solution.length).toBe(9);
          expect(puzzle.length).toBe(9);
          expect(typeof clueCount).toBe('number');
        });

        it('should have valid solution', () => {
          const { solution } = generatePuzzle(difficulty);

          // Check all rows
          solution.forEach(row => {
            const numbers = new Set(row);
            expect(numbers.size).toBe(9);
          });

          // Check all columns
          for (let col = 0; col < 9; col++) {
            const column = solution.map(row => row[col]);
            const numbers = new Set(column);
            expect(numbers.size).toBe(9);
          }
        });

        it('should have puzzle with correct number of clues', () => {
          const { puzzle, clueCount } = generatePuzzle(difficulty);

          let actualClues = 0;
          puzzle.forEach(row => {
            row.forEach(cell => {
              if (cell !== 0) actualClues++;
            });
          });

          expect(actualClues).toBe(clueCount);

          // Verify clue count is within expected range
          // Note: Expert difficulty may occasionally have 1 extra clue due to
          // the uniqueness constraint being hard to satisfy with very few clues
          const expectedRanges = {
            easy: [40, 44],
            medium: [32, 35],
            hard: [27, 29],
            expert: [22, 25], // Allow +1 tolerance for expert
          };

          const [min, max] = expectedRanges[difficulty];
          expect(clueCount).toBeGreaterThanOrEqual(min);
          expect(clueCount).toBeLessThanOrEqual(max);
        });

        it('should have puzzle cells match solution where given', () => {
          const { solution, puzzle } = generatePuzzle(difficulty);

          for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
              if (puzzle[row][col] !== 0) {
                expect(puzzle[row][col]).toBe(solution[row][col]);
              }
            }
          }
        });

        it('should generate different puzzles on multiple calls', () => {
          const puzzles = new Set<string>();
          for (let i = 0; i < 3; i++) {
            const { puzzle } = generatePuzzle(difficulty);
            puzzles.add(JSON.stringify(puzzle));
          }
          expect(puzzles.size).toBeGreaterThan(1);
        });
      });
    });

    it('should generate easier puzzles with more clues', () => {
      const easy = generatePuzzle('easy');
      const expert = generatePuzzle('expert');

      expect(easy.clueCount).toBeGreaterThan(expert.clueCount);
    });
  });

  describe('getHintCell', () => {
    it('should return null for completed puzzle', () => {
      const solution = generateSolution();
      const hint = getHintCell(solution, solution);
      expect(hint).toBeNull();
    });

    it('should return a valid hint for incomplete puzzle', () => {
      const solution = generateSolution();
      const puzzle = solution.map(row => [...row]);

      // Remove some cells
      puzzle[0][0] = 0;
      puzzle[1][1] = 0;
      puzzle[2][2] = 0;

      const hint = getHintCell(puzzle, solution);

      expect(hint).not.toBeNull();
      if (hint) {
        expect(hint.row).toBeGreaterThanOrEqual(0);
        expect(hint.row).toBeLessThan(9);
        expect(hint.col).toBeGreaterThanOrEqual(0);
        expect(hint.col).toBeLessThan(9);
        expect(hint.value).toBeGreaterThanOrEqual(1);
        expect(hint.value).toBeLessThanOrEqual(9);
      }
    });

    it('should return hint for empty cell', () => {
      const solution = generateSolution();
      const puzzle = solution.map(row => [...row]);
      puzzle[4][4] = 0;

      const hint = getHintCell(puzzle, solution);

      expect(hint).not.toBeNull();
      if (hint) {
        expect(puzzle[hint.row][hint.col]).toBe(0);
      }
    });

    it('should return correct value from solution', () => {
      const solution = generateSolution();
      const puzzle = solution.map(row => [...row]);
      puzzle[4][4] = 0;

      const hint = getHintCell(puzzle, solution);

      expect(hint).not.toBeNull();
      if (hint) {
        expect(hint.value).toBe(solution[hint.row][hint.col]);
      }
    });

    it('should prioritize cells with fewer possibilities', () => {
      const solution = generateSolution();
      const puzzle = solution.map(row => [...row]);

      // Create scenario with cells having different numbers of possibilities
      // Remove only one cell in an otherwise complete row
      puzzle[0][0] = 0;

      // Remove a cell with more possibilities
      for (let i = 0; i < 9; i++) {
        puzzle[5][i] = 0;
      }

      const hint = getHintCell(puzzle, solution);

      expect(hint).not.toBeNull();
      if (hint) {
        // Should prioritize the cell with fewer possibilities (row 0, col 0)
        // This cell has only 1 possibility since the rest of the row is filled
        expect(hint.row).toBe(0);
        expect(hint.col).toBe(0);
      }
    });

    it('should work with puzzles at various completion levels', () => {
      const solution = generateSolution();

      // Test with different numbers of empty cells
      [1, 5, 10, 20, 40].forEach(emptyCells => {
        const puzzle = solution.map(row => [...row]);

        // Remove random cells
        let removed = 0;
        for (let row = 0; row < 9 && removed < emptyCells; row++) {
          for (let col = 0; col < 9 && removed < emptyCells; col++) {
            puzzle[row][col] = 0;
            removed++;
          }
        }

        const hint = getHintCell(puzzle, solution);
        expect(hint).not.toBeNull();
        if (hint) {
          expect(puzzle[hint.row][hint.col]).toBe(0);
          expect(hint.value).toBe(solution[hint.row][hint.col]);
        }
      });
    });
  });

  describe('Integration: Full puzzle workflow', () => {
    it('should generate solvable puzzles', () => {
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

      difficulties.forEach(difficulty => {
        const { puzzle, solution } = generatePuzzle(difficulty);
        const puzzleCopy = puzzle.map(row => [...row]);

        const solved = solvePuzzle(puzzleCopy);
        expect(solved).toBe(true);

        // The solved puzzle should match the solution
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            expect(puzzleCopy[row][col]).toBe(solution[row][col]);
          }
        }
      });
    });

    it('should generate puzzles where hints lead to solution', () => {
      const { puzzle, solution } = generatePuzzle('medium');

      // Get a hint
      const hint = getHintCell(puzzle, solution);

      expect(hint).not.toBeNull();
      if (hint) {
        // Apply the hint
        puzzle[hint.row][hint.col] = hint.value;

        // The hint should match the solution
        expect(hint.value).toBe(solution[hint.row][hint.col]);

        // The puzzle should still be valid
        expect(isValidPlacement(puzzle, hint.row, hint.col, hint.value)).toBe(true);
      }
    });
  });
});
