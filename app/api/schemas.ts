import { z } from 'zod';

/**
 * API-specific validation schemas for story service
 * These schemas validate data at API boundaries following the hybrid TypeScript + Zod approach
 */

// Story choice schema for API responses
export const StoryChoiceApiSchema = z.object({
  choice_id: z.string().min(1, 'Choice ID is required'),
  text: z.string().min(10, 'Choice text must be at least 10 characters').max(200, 'Choice text too long'),
  next_node: z.string().min(1, 'Next node reference is required'),
});

// Story node schema for API responses
export const StoryNodeApiSchema = z.object({
  node_id: z.string().min(1, 'Node ID is required'),
  story_id: z.string().min(1, 'Story ID is required'),
  content: z.string().min(50, 'Story content must be substantial').max(2000, 'Story content too long'),
  choices: z.array(StoryChoiceApiSchema).min(0).max(4, 'Maximum 4 choices allowed'),
  is_root: z.boolean(),
  is_ending: z.boolean(),
  is_winning_ending: z.boolean(),
});

// Complete story schema for API responses
export const StoryApiSchema = z.object({
  story_id: z.string().min(1, 'Story ID is required'),
  title: z.string().min(1, 'Story title is required').max(100, 'Title too long'),
  nodes: z.array(StoryNodeApiSchema).min(1, 'Story must have at least one node'),
});

// AI generation request schemas
export const GenerateStoryRequestSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(100, 'Topic too long'),
  userId: z.string().min(1, 'User ID is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
});

export const GenerateNodeRequestSchema = z.object({
  storyId: z.string().min(1, 'Story ID is required'),
  previousNodeId: z.string().min(1, 'Previous node ID is required'),
  choiceId: z.string().min(1, 'Choice ID is required'),
});

// Export inferred types for use in the application
export type Story = z.infer<typeof StoryApiSchema>;
export type StoryNode = z.infer<typeof StoryNodeApiSchema>;
export type StoryChoice = z.infer<typeof StoryChoiceApiSchema>;
export type GenerateStoryRequest = z.infer<typeof GenerateStoryRequestSchema>;
export type GenerateNodeRequest = z.infer<typeof GenerateNodeRequestSchema>;