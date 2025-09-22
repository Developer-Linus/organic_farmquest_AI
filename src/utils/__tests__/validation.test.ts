import { validateRequest, safeValidate, validateForm, ValidationError } from '../validation';
import { z } from 'zod';

describe('Validation Business Logic', () => {
  describe('validateRequest', () => {
    it('should validate correct user data', () => {
      const UserSchema = z.object({
        id: z.string().uuid(),
        name: z.string().min(2),
        email: z.string().email(),
        games_won: z.number().min(0),
      });

      const validUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'john@example.com',
        games_won: 5,
      };

      const result = validateRequest(UserSchema, validUser);
      expect(result).toEqual(validUser);
    });

    it('should throw ValidationError for invalid data', () => {
      const UserSchema = z.object({
        id: z.string().uuid(),
        name: z.string().min(2),
        email: z.string().email(),
        games_won: z.number().min(0),
      });

      const invalidUser = {
        id: 'invalid-uuid',
        name: 'A',
        email: 'invalid-email',
        games_won: -1,
      };

      expect(() => validateRequest(UserSchema, invalidUser)).toThrow(ValidationError);
    });

    it('should validate story data correctly', () => {
      const StorySchema = z.object({
        story_id: z.string(),
        title: z.string().min(1),
        content: z.string().min(10),
        topic: z.enum(['vegetables', 'fruits', 'livestock', 'sustainability']),
        difficulty: z.enum(['easy', 'medium', 'hard']),
      });

      const validStory = {
        story_id: 'story-123',
        title: 'Organic Vegetable Garden',
        content: 'You are standing in a beautiful organic vegetable garden...',
        topic: 'vegetables' as const,
        difficulty: 'medium' as const,
      };

      const result = validateRequest(StorySchema, validStory);
      expect(result).toEqual(validStory);
    });

    it('should validate story node data correctly', () => {
      const StoryNodeSchema = z.object({
        node_id: z.string(),
        story_id: z.string(),
        content: z.string().min(1),
        is_root: z.boolean(),
        is_ending: z.boolean(),
        is_winning_ending: z.boolean(),
        choices: z.array(z.object({
          id: z.string(),
          text: z.string().min(1),
          points: z.number().min(0).max(100),
        })),
      });

      const validNode = {
        node_id: 'node-123',
        story_id: 'story-123',
        content: 'What would you like to do next?',
        is_root: true,
        is_ending: false,
        is_winning_ending: false,
        choices: [
          { id: 'choice-1', text: 'Water the plants', points: 10 },
          { id: 'choice-2', text: 'Check soil quality', points: 15 },
        ],
      };

      const result = validateRequest(StoryNodeSchema, validNode);
      expect(result).toEqual(validNode);
    });
  });

  describe('safeValidate', () => {
    it('should return success for valid data', () => {
      const NumberSchema = z.number().min(0).max(100);
      const result = safeValidate(NumberSchema, 50);

      expect(result.success).toBe(true);
      expect(result.data).toBe(50);
      expect(result.error).toBeUndefined();
    });

    it('should return error for invalid data', () => {
      const NumberSchema = z.number().min(0).max(100);
      const result = safeValidate(NumberSchema, -10);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toContain('Too small');
    });

    it('should validate game session data', () => {
      const GameSessionSchema = z.object({
        session_id: z.string(),
        user_id: z.string(),
        story_id: z.string(),
        topic: z.string(),
        status: z.enum(['active', 'completed', 'failed']),
        score: z.number().min(0),
        is_won: z.boolean(),
      });

      const validSession = {
        session_id: 'session-123',
        user_id: 'user-123',
        story_id: 'story-123',
        topic: 'vegetables',
        status: 'active' as const,
        score: 75,
        is_won: false,
      };

      const result = safeValidate(GameSessionSchema, validSession);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validSession);
    });

    it('should handle choice validation', () => {
      const ChoiceSchema = z.object({
        choice_id: z.string(),
        node_id: z.string(),
        text: z.string().min(1),
        points: z.number().min(0).max(100),
        leads_to_node: z.string().optional(),
      });

      const validChoice = {
        choice_id: 'choice-123',
        node_id: 'node-123',
        text: 'Use organic fertilizer',
        points: 20,
        leads_to_node: 'node-456',
      };

      const result = safeValidate(ChoiceSchema, validChoice);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validChoice);
    });
  });

  describe('validateForm', () => {
    it('should validate form data successfully', () => {
      const FormSchema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        age: z.number().min(13),
      });

      const validFormData = {
        username: 'johndoe',
        email: 'john@example.com',
        age: 25,
      };

      const result = validateForm(FormSchema, validFormData);
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validFormData);
      expect(result.fieldErrors).toBeUndefined();
      expect(result.generalError).toBeUndefined();
    });

    it('should return field errors for invalid form data', () => {
      const FormSchema = z.object({
        username: z.string().min(3),
        email: z.string().email(),
        age: z.number().min(13),
      });

      const invalidFormData = {
        username: 'jo',
        email: 'invalid-email',
        age: 10,
      };

      const result = validateForm(FormSchema, invalidFormData);
      expect(result.isValid).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.fieldErrors).toBeDefined();
      expect(result.fieldErrors?.username).toContain('Too small');
      expect(result.fieldErrors?.email).toContain('Invalid email');
      expect(result.fieldErrors?.age).toContain('Too small');
    });

    it('should validate game configuration form', () => {
      const GameConfigSchema = z.object({
        topic: z.enum(['vegetables', 'fruits', 'livestock', 'sustainability']),
        difficulty: z.enum(['easy', 'medium', 'hard']),
        player_name: z.string().min(2).max(50),
      });

      const validConfig = {
        topic: 'vegetables' as const,
        difficulty: 'medium' as const,
        player_name: 'Alice',
      };

      const result = validateForm(GameConfigSchema, validConfig);
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validConfig);
    });

    it('should validate achievement data', () => {
      const AchievementSchema = z.object({
        achievement_id: z.string(),
        name: z.string().min(1),
        description: z.string().min(10),
        points_required: z.number().min(1),
        category: z.enum(['farming', 'sustainability', 'knowledge', 'completion']),
      });

      const validAchievement = {
        achievement_id: 'achievement-123',
        name: 'Green Thumb',
        description: 'Successfully complete your first farming task',
        points_required: 100,
        category: 'farming' as const,
      };

      const result = validateForm(AchievementSchema, validAchievement);
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validAchievement);
    });
  });

  describe('ValidationError', () => {
    it('should create ValidationError with message', () => {
      const errorMessage = 'Test validation error';
      const error = new ValidationError(errorMessage);

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe(errorMessage);
    });

    it('should create ValidationError with details', () => {
      const errorMessage = 'Validation failed';
      const errorDetails = [
        { code: 'invalid_type', expected: 'string', received: 'number', path: ['name'], message: 'Expected string, received number' }
      ];
      const error = new ValidationError(errorMessage, errorDetails as any);

      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe(errorMessage);
      expect(error.details).toEqual(errorDetails);
    });
  });
});