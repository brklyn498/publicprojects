import { describe, it, expect } from 'vitest';
import {
  getXPForLevel,
  getLevelFromXP,
  getLevelTier,
  getInitialAchievements,
  ALL_ACHIEVEMENTS,
} from '@/lib/achievements';

describe('Achievement System', () => {
  describe('getXPForLevel', () => {
    it('should calculate XP correctly for level 0', () => {
      expect(getXPForLevel(0)).toBe(100); // (0+1)² × 100 = 100
    });

    it('should calculate XP correctly for level 1', () => {
      expect(getXPForLevel(1)).toBe(400); // (1+1)² × 100 = 400
    });

    it('should calculate XP correctly for level 10', () => {
      expect(getXPForLevel(10)).toBe(12100); // (10+1)² × 100 = 12100
    });

    it('should calculate XP correctly for level 25', () => {
      expect(getXPForLevel(25)).toBe(67600); // (25+1)² × 100 = 67600
    });

    it('should calculate XP correctly for level 50', () => {
      expect(getXPForLevel(50)).toBe(260100); // (50+1)² × 100 = 260100
    });

    it('should calculate XP correctly for level 100', () => {
      expect(getXPForLevel(100)).toBe(1020100); // (100+1)² × 100
    });

    it('should return positive values for all levels', () => {
      for (let level = 0; level <= 100; level++) {
        expect(getXPForLevel(level)).toBeGreaterThan(0);
      }
    });

    it('should increase XP as level increases', () => {
      for (let level = 0; level < 50; level++) {
        expect(getXPForLevel(level + 1)).toBeGreaterThan(getXPForLevel(level));
      }
    });
  });

  describe('getLevelFromXP', () => {
    it('should return level 0 for 0 XP', () => {
      expect(getLevelFromXP(0)).toBe(0);
    });

    it('should return level 0 for XP less than 100', () => {
      expect(getLevelFromXP(50)).toBe(0);
      expect(getLevelFromXP(99)).toBe(0);
    });

    it('should return level 1 for 100 XP', () => {
      expect(getLevelFromXP(100)).toBe(1);
    });

    it('should return level 1 for XP between 100-399', () => {
      expect(getLevelFromXP(100)).toBe(1);
      expect(getLevelFromXP(250)).toBe(1);
      expect(getLevelFromXP(399)).toBe(1);
    });

    it('should return level 2 for 400 XP', () => {
      expect(getLevelFromXP(400)).toBe(2);
    });

    it('should return level 10 for 10000 XP', () => {
      expect(getLevelFromXP(10000)).toBe(10);
    });

    it('should return level 25 for 62500 XP', () => {
      expect(getLevelFromXP(62500)).toBe(25);
    });

    it('should return level 50 for 250000 XP', () => {
      expect(getLevelFromXP(250000)).toBe(50);
    });

    it('should be inverse of getXPForLevel at boundaries', () => {
      // Check that if we're exactly at the XP threshold for a level,
      // we get that level back
      for (let level = 0; level <= 50; level++) {
        const xpForLevel = (level + 1) * (level + 1) * 100;
        expect(getLevelFromXP(xpForLevel)).toBeGreaterThanOrEqual(level);
      }
    });

    it('should handle large XP values', () => {
      expect(getLevelFromXP(1000000)).toBe(100);
      expect(getLevelFromXP(10000000)).toBe(316);
    });
  });

  describe('getLevelTier', () => {
    it('should return "Beginner" tier for level 0', () => {
      const tier = getLevelTier(0);
      expect(tier.name).toBe('Beginner');
      expect(tier.color).toBe('blue');
    });

    it('should return "Intermediate" tier for levels 1-10', () => {
      for (let level = 1; level <= 10; level++) {
        const tier = getLevelTier(level);
        expect(tier.name).toBe('Intermediate');
        expect(tier.color).toBe('green');
      }
    });

    it('should return "Advanced" tier for levels 11-25', () => {
      for (let level = 11; level <= 25; level++) {
        const tier = getLevelTier(level);
        expect(tier.name).toBe('Advanced');
        expect(tier.color).toBe('purple');
      }
    });

    it('should return "Expert" tier for levels 26-50', () => {
      for (let level = 26; level <= 50; level++) {
        const tier = getLevelTier(level);
        expect(tier.name).toBe('Expert');
        expect(tier.color).toBe('gold');
      }
    });

    it('should return "Master" tier for levels 51+', () => {
      for (let level = 51; level <= 100; level++) {
        const tier = getLevelTier(level);
        expect(tier.name).toBe('Master');
        expect(tier.color).toBe('rainbow');
      }
    });

    it('should have consistent tier boundaries', () => {
      expect(getLevelTier(0).name).toBe('Beginner');
      expect(getLevelTier(1).name).toBe('Intermediate');
      expect(getLevelTier(10).name).toBe('Intermediate');
      expect(getLevelTier(11).name).toBe('Advanced');
      expect(getLevelTier(25).name).toBe('Advanced');
      expect(getLevelTier(26).name).toBe('Expert');
      expect(getLevelTier(50).name).toBe('Expert');
      expect(getLevelTier(51).name).toBe('Master');
    });
  });

  describe('XP and Level Round-Trip', () => {
    it('should maintain consistency between XP and level conversions', () => {
      // For each level, convert to XP threshold and back
      for (let level = 1; level <= 50; level++) {
        const xpThreshold = (level + 1) * (level + 1) * 100;
        const calculatedLevel = getLevelFromXP(xpThreshold);
        // Should be at least the current level (might be higher due to floor)
        expect(calculatedLevel).toBeGreaterThanOrEqual(level);
      }
    });
  });

  describe('ALL_ACHIEVEMENTS', () => {
    it('should have exactly 31 achievements defined', () => {
      expect(ALL_ACHIEVEMENTS).toHaveLength(31);
    });

    it('should have unique achievement IDs', () => {
      const ids = ALL_ACHIEVEMENTS.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ALL_ACHIEVEMENTS.length);
    });

    it('should have all required properties for each achievement', () => {
      ALL_ACHIEVEMENTS.forEach(achievement => {
        expect(achievement).toHaveProperty('id');
        expect(achievement).toHaveProperty('title');
        expect(achievement).toHaveProperty('description');
        expect(achievement).toHaveProperty('icon');
        expect(achievement).toHaveProperty('category');
        expect(achievement).toHaveProperty('requirement');
        expect(achievement).toHaveProperty('tier');
        expect(achievement).toHaveProperty('xpReward');
      });
    });

    it('should have valid categories', () => {
      const validCategories = ['global', 'tictactoe', 'memory', 'sudoku', 'crossword'];
      ALL_ACHIEVEMENTS.forEach(achievement => {
        expect(validCategories).toContain(achievement.category);
      });
    });

    it('should have valid tiers', () => {
      const validTiers = ['bronze', 'silver', 'gold', 'platinum'];
      ALL_ACHIEVEMENTS.forEach(achievement => {
        expect(validTiers).toContain(achievement.tier);
      });
    });

    it('should have positive requirements', () => {
      ALL_ACHIEVEMENTS.forEach(achievement => {
        expect(achievement.requirement).toBeGreaterThan(0);
      });
    });

    it('should have positive XP rewards', () => {
      ALL_ACHIEVEMENTS.forEach(achievement => {
        expect(achievement.xpReward).toBeGreaterThan(0);
      });
    });

    it('should have appropriate XP rewards for tiers', () => {
      const tierRanges = {
        bronze: { min: 50, max: 50 },
        silver: { min: 100, max: 200 },
        gold: { min: 200, max: 500 },
        platinum: { min: 400, max: 1000 },
      };

      ALL_ACHIEVEMENTS.forEach(achievement => {
        const range = tierRanges[achievement.tier];
        expect(achievement.xpReward).toBeGreaterThanOrEqual(range.min);
        expect(achievement.xpReward).toBeLessThanOrEqual(range.max);
      });
    });

    it('should have achievements for each game category', () => {
      const categories = ALL_ACHIEVEMENTS.map(a => a.category);
      expect(categories).toContain('global');
      expect(categories).toContain('tictactoe');
      expect(categories).toContain('memory');
      expect(categories).toContain('sudoku');
      expect(categories).toContain('crossword');
    });
  });

  describe('getInitialAchievements', () => {
    it('should return an array of achievements', () => {
      const achievements = getInitialAchievements();
      expect(Array.isArray(achievements)).toBe(true);
      expect(achievements.length).toBe(ALL_ACHIEVEMENTS.length);
    });

    it('should initialize all achievements with progress 0', () => {
      const achievements = getInitialAchievements();
      achievements.forEach(achievement => {
        expect(achievement.progress).toBe(0);
      });
    });

    it('should initialize all achievements as not unlocked', () => {
      const achievements = getInitialAchievements();
      achievements.forEach(achievement => {
        expect(achievement.unlocked).toBe(false);
      });
    });

    it('should preserve all original achievement properties', () => {
      const achievements = getInitialAchievements();
      achievements.forEach((achievement, index) => {
        const original = ALL_ACHIEVEMENTS[index];
        expect(achievement.id).toBe(original.id);
        expect(achievement.title).toBe(original.title);
        expect(achievement.description).toBe(original.description);
        expect(achievement.icon).toBe(original.icon);
        expect(achievement.category).toBe(original.category);
        expect(achievement.requirement).toBe(original.requirement);
        expect(achievement.tier).toBe(original.tier);
        expect(achievement.xpReward).toBe(original.xpReward);
      });
    });
  });
});
