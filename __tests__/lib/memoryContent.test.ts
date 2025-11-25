import { describe, it, expect } from 'vitest';
import {
  getContentForTheme,
  getGridSize,
  getPairCount,
  shuffleArray,
} from '@/lib/memoryContent';
import type { Difficulty, CardTheme } from '@/types/memory';

describe('Memory Game Utilities', () => {
  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled.length).toBe(original.length);
    });

    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original);
      expect(original).toEqual(originalCopy);
    });

    it('should contain all original elements', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled = shuffleArray(original);

      original.forEach(element => {
        expect(shuffled).toContain(element);
      });
    });

    it('should not add any new elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);

      shuffled.forEach(element => {
        expect(original).toContain(element);
      });
    });

    it('should work with string arrays', () => {
      const original = ['a', 'b', 'c', 'd', 'e'];
      const shuffled = shuffleArray(original);

      expect(shuffled.length).toBe(original.length);
      original.forEach(element => {
        expect(shuffled).toContain(element);
      });
    });

    it('should work with empty arrays', () => {
      const original: number[] = [];
      const shuffled = shuffleArray(original);
      expect(shuffled).toEqual([]);
    });

    it('should work with single-element arrays', () => {
      const original = [42];
      const shuffled = shuffleArray(original);
      expect(shuffled).toEqual([42]);
    });

    it('should produce different results on multiple calls (statistical test)', () => {
      const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = new Set<string>();

      // Run shuffle 20 times and expect at least some different orderings
      for (let i = 0; i < 20; i++) {
        const shuffled = shuffleArray(original);
        results.add(JSON.stringify(shuffled));
      }

      // With a 10-element array, we should get multiple different orderings
      // (there are 10! = 3,628,800 possible orderings)
      expect(results.size).toBeGreaterThan(1);
    });

    it('should have reasonable distribution (no obvious bias)', () => {
      const original = [1, 2, 3, 4, 5];
      const firstPositionCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      // Run shuffle 1000 times and count how often each element appears first
      for (let i = 0; i < 1000; i++) {
        const shuffled = shuffleArray(original);
        firstPositionCounts[shuffled[0] as keyof typeof firstPositionCounts]++;
      }

      // Each element should appear first roughly 20% of the time (200 out of 1000)
      // Allow for statistical variance: 100-300 is reasonable
      Object.values(firstPositionCounts).forEach(count => {
        expect(count).toBeGreaterThan(100);
        expect(count).toBeLessThan(300);
      });
    });
  });

  describe('getPairCount', () => {
    it('should return 8 pairs for easy difficulty', () => {
      expect(getPairCount('easy')).toBe(8);
    });

    it('should return 18 pairs for medium difficulty', () => {
      expect(getPairCount('medium')).toBe(18);
    });

    it('should return 32 pairs for hard difficulty', () => {
      expect(getPairCount('hard')).toBe(32);
    });

    it('should return consistent values', () => {
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
      difficulties.forEach(difficulty => {
        const count1 = getPairCount(difficulty);
        const count2 = getPairCount(difficulty);
        expect(count1).toBe(count2);
      });
    });
  });

  describe('getGridSize', () => {
    it('should return 4x4 grid for easy difficulty', () => {
      const size = getGridSize('easy');
      expect(size.rows).toBe(4);
      expect(size.cols).toBe(4);
    });

    it('should return 6x6 grid for medium difficulty', () => {
      const size = getGridSize('medium');
      expect(size.rows).toBe(6);
      expect(size.cols).toBe(6);
    });

    it('should return 8x8 grid for hard difficulty', () => {
      const size = getGridSize('hard');
      expect(size.rows).toBe(8);
      expect(size.cols).toBe(8);
    });

    it('should have grid size that matches pair count', () => {
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

      difficulties.forEach(difficulty => {
        const gridSize = getGridSize(difficulty);
        const pairCount = getPairCount(difficulty);
        const totalCards = gridSize.rows * gridSize.cols;

        expect(totalCards).toBe(pairCount * 2);
      });
    });
  });

  describe('getContentForTheme', () => {
    describe('emoji theme', () => {
      it('should return correct number of emojis for easy', () => {
        const content = getContentForTheme('emoji', 8);
        expect(content.length).toBe(8);
      });

      it('should return correct number of emojis for medium', () => {
        const content = getContentForTheme('emoji', 18);
        expect(content.length).toBe(18);
      });

      it('should return correct number of emojis for hard', () => {
        const content = getContentForTheme('emoji', 32);
        expect(content.length).toBe(32);
      });

      it('should return unique emojis', () => {
        const content = getContentForTheme('emoji', 20);
        const uniqueContent = new Set(content);
        expect(uniqueContent.size).toBe(content.length);
      });

      it('should return valid emoji strings', () => {
        const content = getContentForTheme('emoji', 10);
        content.forEach(emoji => {
          expect(typeof emoji).toBe('string');
          expect(emoji.length).toBeGreaterThan(0);
        });
      });
    });

    describe('numbers theme', () => {
      it('should return correct number of numbers for easy', () => {
        const content = getContentForTheme('numbers', 8);
        expect(content.length).toBe(8);
      });

      it('should return numbers in sequence starting from 1', () => {
        const content = getContentForTheme('numbers', 10);
        expect(content).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
      });

      it('should return correct sequence for different counts', () => {
        const content5 = getContentForTheme('numbers', 5);
        expect(content5).toEqual(['1', '2', '3', '4', '5']);

        const content3 = getContentForTheme('numbers', 3);
        expect(content3).toEqual(['1', '2', '3']);
      });

      it('should handle large pair counts', () => {
        const content = getContentForTheme('numbers', 32);
        expect(content.length).toBe(32);
        expect(content[0]).toBe('1');
        expect(content[31]).toBe('32');
      });
    });

    describe('icons theme', () => {
      it('should return correct number of icons for easy', () => {
        const content = getContentForTheme('icons', 8);
        expect(content.length).toBe(8);
      });

      it('should return correct number of icons for medium', () => {
        const content = getContentForTheme('icons', 18);
        expect(content.length).toBe(18);
      });

      it('should return correct number of icons for hard', () => {
        const content = getContentForTheme('icons', 32);
        expect(content.length).toBe(32);
      });

      it('should return unique icon names', () => {
        const content = getContentForTheme('icons', 20);
        const uniqueContent = new Set(content);
        expect(uniqueContent.size).toBe(content.length);
      });

      it('should return valid icon name strings', () => {
        const content = getContentForTheme('icons', 10);
        content.forEach(icon => {
          expect(typeof icon).toBe('string');
          expect(icon.length).toBeGreaterThan(0);
          // Icon names should start with capital letter (Lucide convention)
          expect(icon[0]).toMatch(/[A-Z]/);
        });
      });
    });

    describe('colors theme', () => {
      it('should return correct number of colors for easy', () => {
        const content = getContentForTheme('colors', 8);
        expect(content.length).toBe(8);
      });

      it('should return correct number of colors for medium', () => {
        const content = getContentForTheme('colors', 18);
        expect(content.length).toBe(18);
      });

      it('should return correct number of colors for hard', () => {
        const content = getContentForTheme('colors', 32);
        expect(content.length).toBe(32);
      });

      it('should return unique colors', () => {
        const content = getContentForTheme('colors', 20);
        const uniqueContent = new Set(content);
        expect(uniqueContent.size).toBe(content.length);
      });

      it('should return valid hex color codes', () => {
        const content = getContentForTheme('colors', 10);
        const hexColorPattern = /^#[0-9A-F]{6}$/i;

        content.forEach(color => {
          expect(typeof color).toBe('string');
          expect(color).toMatch(hexColorPattern);
        });
      });
    });

    describe('edge cases', () => {
      it('should handle zero pair count', () => {
        const themes: CardTheme[] = ['emoji', 'numbers', 'icons', 'colors'];
        themes.forEach(theme => {
          const content = getContentForTheme(theme, 0);
          expect(content.length).toBe(0);
        });
      });

      it('should handle single pair', () => {
        const themes: CardTheme[] = ['emoji', 'numbers', 'icons', 'colors'];
        themes.forEach(theme => {
          const content = getContentForTheme(theme, 1);
          expect(content.length).toBe(1);
        });
      });
    });

    describe('randomization', () => {
      it('should produce different orderings for emoji theme', () => {
        const results = new Set<string>();

        for (let i = 0; i < 10; i++) {
          const content = getContentForTheme('emoji', 10);
          results.add(JSON.stringify(content));
        }

        // Should get different orderings due to shuffling
        expect(results.size).toBeGreaterThan(1);
      });

      it('should produce different orderings for icons theme', () => {
        const results = new Set<string>();

        for (let i = 0; i < 10; i++) {
          const content = getContentForTheme('icons', 10);
          results.add(JSON.stringify(content));
        }

        // Should get different orderings due to shuffling
        expect(results.size).toBeGreaterThan(1);
      });

      it('should produce different orderings for colors theme', () => {
        const results = new Set<string>();

        for (let i = 0; i < 10; i++) {
          const content = getContentForTheme('colors', 10);
          results.add(JSON.stringify(content));
        }

        // Should get different orderings due to shuffling
        expect(results.size).toBeGreaterThan(1);
      });
    });
  });
});
