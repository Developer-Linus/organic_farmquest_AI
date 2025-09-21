import { z } from 'zod';
import { aiService } from '../lib/ai';
import { databaseService } from '../lib/database';
import { ID } from 'node-appwrite';
import type { GameTopic, GameDifficulty } from '../src/types';

// Request validation schema
const GenerateStoryRequestSchema = z.object({
  userId: z.string().min(1),
  topic: z.enum(['vegetables', 'fruits', 'herbs', 'grains', 'livestock']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

// Response schema
const GenerateStoryResponseSchema = z.object({
  success: z.boolean(),
  story: z.object({
    story_id: z.string(),
    user_id: z.string(),
    topic: z.string(),
    status: z.string(),
    current_node_id: z.string(),
    is_won: z.boolean(),
  }).optional(),
  rootNode: z.object({
    node_id: z.string(),
    story_id: z.string(),
    content: z.string(),
    is_root: z.boolean(),
    is_ending: z.boolean(),
    is_winning_ending: z.boolean(),
    choices: z.array(z.object({
      id: z.string(),
      text: z.string(),
      is_correct: z.boolean(),
      next_node_id: z.string(),
    })),
  }).optional(),
  error: z.string().optional(),
});

// Types for the API functions
type GenerateStoryRequest = z.infer<typeof GenerateStoryRequestSchema>;
type GenerateStoryResponse = z.infer<typeof GenerateStoryResponseSchema>;

// Generate story function
export async function generateStory(request: GenerateStoryRequest): Promise<GenerateStoryResponse> {
  try {
    const validatedRequest = GenerateStoryRequestSchema.parse(request);
    const { userId, topic, difficulty } = validatedRequest;

    // Generate story content using AI service
    const storyData = await aiService.generateStoryStart(
      topic as GameTopic,
      difficulty as GameDifficulty
    );

    // Create story record in database
    const story = await databaseService.createStory({
      user_id: userId,
      topic,
      status: 'active',
      current_node_id: '', // Will be updated after creating root node
      is_won: false,
    });

    // Create root story node
    const rootNode = await databaseService.createStoryNode({
      story_id: story.story_id,
      content: storyData.content,
      is_root: true,
      is_ending: false,
      is_winning_ending: false,
      choices: storyData.choices,
    });

    // Update story with root node ID
    await databaseService.updateStory(story.story_id, {
      current_node_id: rootNode.node_id,
    });

    // Create a story job record for tracking
    await databaseService.createStoryJob({
      story_id: story.story_id,
      status: 'completed',
      ai_prompt: `Generate story start for ${topic} (${difficulty})`,
      generated_content: storyData.content,
      completed_at: new Date(),
    });

    const response = {
      success: true,
      story: {
        ...story,
        current_node_id: rootNode.node_id,
      },
      rootNode,
    };

    return GenerateStoryResponseSchema.parse(response);

  } catch (error) {
    console.error('Error in generateStory:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid request data: ' + error.errors.map(e => e.message).join(', '),
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate story',
    };
  }
}

// Get stories function
export async function getStories(params: { storyId?: string; userId?: string }) {
  try {
    const { storyId, userId } = params;

    if (!storyId && !userId) {
      return {
        success: false,
        error: 'Either storyId or userId is required',
      };
    }

    let stories;
    if (storyId) {
      // Get specific story
      const story = await databaseService.getStoryById(storyId);
      if (!story) {
        return {
          success: false,
          error: 'Story not found',
        };
      }
      stories = [story];
    } else if (userId) {
      // Get user's stories
      stories = await databaseService.getUserStories(userId);
    }

    return {
      success: true,
      stories,
    };

  } catch (error) {
    console.error('Error in getStories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve stories',
    };
  }
}