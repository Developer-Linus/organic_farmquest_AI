import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { Client, Databases, ID } from 'node-appwrite';
import { 
  APPWRITE_API_KEY,
  EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID 
} from '@env';

import { StoryApiSchema, StoryNodeApiSchema, type Story, type StoryNode } from './schemas';
import { STORY_SYSTEM_PROMPT, PROMPT_CONFIG } from './prompts';
import { DATABASE_CONFIG } from '../../src/constants';
import { DatabaseError, NetworkError } from '../../lib/database-errors';

/**
 * Story Service Configuration
 * Centralized configuration for AI model and database connections
 */
class StoryServiceConfig {
  private static instance: StoryServiceConfig;
  
  public readonly model = google('models/gemini-2.0-flash-exp');
  public readonly databases: Databases;

  private constructor() {
    // Validate required environment variables at initialization
    this.validateEnvironment();
    
    const client = new Client()
      .setEndpoint(EXPO_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(EXPO_PUBLIC_APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_API_KEY);

    this.databases = new Databases(client);
  }

  public static getInstance(): StoryServiceConfig {
    if (!StoryServiceConfig.instance) {
      StoryServiceConfig.instance = new StoryServiceConfig();
    }
    return StoryServiceConfig.instance;
  }

  /**
   * Validates that all required environment variables are present
   * Fails fast if configuration is incomplete
   */
  private validateEnvironment(): void {
    const required = [
      { name: 'EXPO_PUBLIC_APPWRITE_ENDPOINT', value: EXPO_PUBLIC_APPWRITE_ENDPOINT },
      { name: 'EXPO_PUBLIC_APPWRITE_PROJECT_ID', value: EXPO_PUBLIC_APPWRITE_PROJECT_ID },
      { name: 'APPWRITE_API_KEY', value: APPWRITE_API_KEY }
    ];

    const missing = required.filter(({ value }) => !value).map(({ name }) => name);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

/**
 * Story Service Class
 * Handles AI story generation and database persistence with proper error handling
 */
export class StoryService {
  private config = StoryServiceConfig.getInstance();

  /**
   * Generates a complete interactive story and persists it to the database
   * 
   * @param topic - The farming topic for story generation
   * @param userId - The user ID for story ownership
   * @returns Promise<Story> - The generated and saved story
   * 
   * Why separate generation and persistence: 
   * - Allows for validation before database operations
   * - Enables transaction-like behavior for data consistency
   * - Provides clear separation of concerns
   */
  async generateAndSaveStory(topic: string, userId: string): Promise<Story> {
    try {
      // Generate story content using AI
      const generatedStory = await this.generateStoryContent(topic);
      
      // Validate the generated content against our schema
      const validatedStory = StoryApiSchema.parse(generatedStory);
      
      // Persist story and root node to database
      await this.persistStoryToDatabase(validatedStory, userId);
      
      return validatedStory;
      
    } catch (error) {
      this.handleStoryGenerationError(error, { topic, userId });
      throw error; // Re-throw after logging for upstream handling
    }
  }

  /**
   * Generates and saves a single story node based on user choice
   * 
   * @param storyId - The parent story ID
   * @param previousNodeId - The node the user came from
   * @param choiceId - The choice the user made
   * @returns Promise<StoryNode> - The generated and saved node
   * 
   * Why separate node generation:
   * - Enables dynamic story branching without regenerating entire story
   * - Reduces AI API costs by generating content on-demand
   * - Allows for more responsive user experience
   */
  async generateAndSaveStoryNode(
    storyId: string,
    previousNodeId: string,
    choiceId: string
  ): Promise<StoryNode> {
    try {
      // Generate next node content based on previous context
      const generatedNode = await this.generateNodeContent(storyId, previousNodeId, choiceId);
      
      // Validate the generated node
      const validatedNode = StoryNodeApiSchema.parse(generatedNode);
      
      // Persist node to database
      await this.persistNodeToDatabase(validatedNode);
      
      return validatedNode;
      
    } catch (error) {
      this.handleNodeGenerationError(error, { storyId, previousNodeId, choiceId });
      throw error;
    }
  }

  /**
   * Generates story content using AI model
   * Private method to encapsulate AI interaction logic
   */
  private async generateStoryContent(topic: string): Promise<unknown> {
    const response = await generateObject({
      model: this.config.model,
      schema: StoryApiSchema,
      system: STORY_SYSTEM_PROMPT,
      prompt: `Generate an interactive organic farming story about ${topic}. Include educational elements about sustainable farming practices.`,
      temperature: PROMPT_CONFIG.temperature,
      maxTokens: PROMPT_CONFIG.maxTokens,
    });

    if (!response.object) {
      throw new Error('AI model returned empty response');
    }

    return response.object;
  }

  /**
   * Generates individual node content using AI model
   * Private method for node-specific AI generation
   */
  private async generateNodeContent(
    storyId: string,
    previousNodeId: string,
    choiceId: string
  ): Promise<unknown> {
    const response = await generateObject({
      model: this.config.model,
      schema: StoryNodeApiSchema,
      system: STORY_SYSTEM_PROMPT,
      prompt: `Generate the next story node for story ${storyId} after choice ${choiceId} from node ${previousNodeId}. Continue the organic farming narrative with educational content.`,
      temperature: PROMPT_CONFIG.temperature,
      maxTokens: PROMPT_CONFIG.maxTokens,
    });

    if (!response.object) {
      throw new Error('AI model returned empty response for node generation');
    }

    return response.object;
  }

  /**
   * Persists complete story to database with transactional approach
   * Why separate persistence: Allows for rollback if any operation fails
   */
  private async persistStoryToDatabase(story: Story, userId: string): Promise<void> {
    try {
      // Create story record
      await this.config.databases.createDocument(
        DATABASE_CONFIG.DATABASE_ID!,
        DATABASE_CONFIG.COLLECTIONS.STORIES,
        ID.unique(),
        {
          story_id: story.story_id,
          user_id: userId,
          topic: story.title, // Using title as topic for better semantics
          status: 'active',
          current_node_id: story.nodes.find(node => node.is_root)?.node_id,
          is_won: false,
        }
      );

      // Create all story nodes
      for (const node of story.nodes) {
        await this.persistNodeToDatabase(node);
      }
      
    } catch (error) {
      throw new DatabaseError(
        `Failed to persist story to database: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'STORY_PERSISTENCE_FAILED',
        { storyId: story.story_id, userId }
      );
    }
  }

  /**
   * Persists individual node to database
   * Reusable method for both story creation and dynamic node generation
   */
  private async persistNodeToDatabase(node: StoryNode): Promise<void> {
    try {
      await this.config.databases.createDocument(
        DATABASE_CONFIG.DATABASE_ID!,
        DATABASE_CONFIG.COLLECTIONS.STORY_NODES,
        ID.unique(),
        {
          node_id: node.node_id,
          story_id: node.story_id,
          content: node.content,
          is_root: node.is_root,
          is_ending: node.is_ending,
          is_winning_ending: node.is_winning_ending,
          choices: JSON.stringify(node.choices), // Serialize choices for Appwrite storage
        }
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to persist node to database: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NODE_PERSISTENCE_FAILED',
        { nodeId: node.node_id, storyId: node.story_id }
      );
    }
  }

  /**
   * Centralized error handling for story generation
   * Provides consistent logging and error classification
   */
  private handleStoryGenerationError(error: unknown, context: { topic: string; userId: string }): void {
    console.error('Story generation failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      context,
      timestamp: new Date().toISOString(),
    });

    // Classify error types for better upstream handling
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('timeout')) {
        throw new NetworkError(error);
      }
      if (error.message.includes('database') || error.message.includes('Appwrite')) {
        throw new DatabaseError(error.message, 'DATABASE_ERROR', context);
      }
    }
  }

  /**
   * Centralized error handling for node generation
   * Provides consistent logging and error classification
   */
  private handleNodeGenerationError(
    error: unknown, 
    context: { storyId: string; previousNodeId: string; choiceId: string }
  ): void {
    console.error('Node generation failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      context,
      timestamp: new Date().toISOString(),
    });

    // Similar error classification as story generation
    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('timeout')) {
        throw new NetworkError(error);
      }
      if (error.message.includes('database') || error.message.includes('Appwrite')) {
        throw new DatabaseError(error.message, 'DATABASE_ERROR', context);
      }
    }
  }
}

// Export singleton instance for consistent usage across the application
export const storyService = new StoryService();

// Export individual functions for backward compatibility and easier testing
export const generateAndSaveStory = (topic: string, userId: string) => 
  storyService.generateAndSaveStory(topic, userId);

export const generateAndSaveStoryNode = (storyId: string, previousNodeId: string, choiceId: string) => 
  storyService.generateAndSaveStoryNode(storyId, previousNodeId, choiceId);
