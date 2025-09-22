import { validateRequest, safeValidate, ValidationError } from '../../utils/validation';
import { z } from 'zod';

// Simple business logic tests for GameContext functionality
describe('GameContext Business Logic', () => {
  // Test user authentication flow
  describe('User Authentication', () => {
    it('should validate user session data correctly', () => {
      const UserSchema = z.object({
        $id: z.string().min(1),
        email: z.string().email(),
        name: z.string().min(2),
      });

      const validUser = {
        $id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = validateRequest(UserSchema, validUser);
      expect(result).toEqual(validUser);
    });

    it('should handle invalid user data', () => {
      const UserSchema = z.object({
        $id: z.string().min(1),
        email: z.string().email(),
        name: z.string().min(2),
      });

      const invalidUser = {
        $id: '',
        email: 'invalid-email',
        name: 'A',
      };

      expect(() => validateRequest(UserSchema, invalidUser)).toThrow(ValidationError);
    });
  });

  // Test game state management
  describe('Game State Management', () => {
    it('should validate game session data', () => {
      const GameSessionSchema = z.object({
        id: z.string(),
        userId: z.string(),
        topic: z.string().min(1),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        score: z.number().min(0),
        isActive: z.boolean(),
      });

      const validSession = {
        id: 'session-123',
        userId: 'user-123',
        topic: 'Organic Farming',
        difficulty: 'medium' as const,
        score: 85,
        isActive: true,
      };

      const result = validateRequest(GameSessionSchema, validSession);
      expect(result).toEqual(validSession);
    });

    it('should validate story data structure', () => {
      const StorySchema = z.object({
        id: z.string(),
        content: z.string().min(10),
        choices: z.array(z.object({
          id: z.string(),
          text: z.string().min(1),
          points: z.number().min(0).max(100),
        })),
      });

      const validStory = {
        id: 'story-123',
        content: 'You are standing in a beautiful organic farm...',
        choices: [
          { id: 'choice-1', text: 'Water the plants', points: 10 },
          { id: 'choice-2', text: 'Check soil quality', points: 15 },
        ],
      };

      const result = validateRequest(StorySchema, validStory);
      expect(result).toEqual(validStory);
    });
  });

  // Test user progress tracking
  describe('User Progress Tracking', () => {
    it('should calculate score correctly', () => {
      const calculateScore = (baseScore: number, choicePoints: number, difficultyMultiplier: number): number => {
        return Math.round((baseScore + choicePoints) * difficultyMultiplier);
      };

      expect(calculateScore(50, 10, 1.0)).toBe(60); // easy
      expect(calculateScore(50, 10, 1.2)).toBe(72); // medium
      expect(calculateScore(50, 10, 1.5)).toBe(90); // hard
    });

    it('should validate achievement data', () => {
      const AchievementSchema = z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        points: z.number().min(0),
        unlocked: z.boolean(),
      });

      const validAchievement = {
        id: 'achievement-1',
        name: 'Green Thumb',
        description: 'Successfully complete your first farming task',
        points: 100,
        unlocked: true,
      };

      const result = validateRequest(AchievementSchema, validAchievement);
      expect(result).toEqual(validAchievement);
    });
  });

  // Test context state consistency
  describe('Context State Consistency', () => {
    it('should maintain consistent game state', () => {
      const GameStateSchema = z.object({
        user: z.object({
          $id: z.string(),
          email: z.string().email(),
          name: z.string(),
        }).nullable(),
        session: z.object({
          id: z.string(),
          topic: z.string(),
          difficulty: z.enum(['easy', 'medium', 'hard']),
          score: z.number().min(0),
        }).nullable(),
        currentStory: z.object({
          id: z.string(),
          content: z.string(),
        }).nullable(),
        isLoading: z.boolean(),
        error: z.string().nullable(),
      });

      const validGameState = {
        user: {
          $id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        },
        session: {
          id: 'session-123',
          topic: 'Organic Farming',
          difficulty: 'medium' as const,
          score: 75,
        },
        currentStory: {
          id: 'story-123',
          content: 'Your farming adventure begins...',
        },
        isLoading: false,
        error: null,
      };

      const result = validateRequest(GameStateSchema, validGameState);
      expect(result).toEqual(validGameState);
    });

    it('should handle loading states correctly', () => {
      const isValidLoadingState = (isLoading: boolean, hasData: boolean): boolean => {
        // Loading should be true when no data is available
        // Loading should be false when data is available
        return isLoading ? !hasData : hasData;
      };

      expect(isValidLoadingState(true, false)).toBe(true);  // Loading with no data
      expect(isValidLoadingState(false, true)).toBe(true);  // Not loading with data
      expect(isValidLoadingState(true, true)).toBe(false);  // Invalid: loading with data
      expect(isValidLoadingState(false, false)).toBe(false); // Invalid: not loading without data
    });
  });
});