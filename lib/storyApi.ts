/**
 * Story API Client
 * Provides type-safe methods for interacting with story-related endpoints
 */

import { ApiClient } from './api-client';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';
import {
  CreateStoryRequest,
  CreateStoryResponse,
  GenerateStoryNodeRequest,
  GenerateStoryNodeResponse,
  UpdateProgressRequest,
  UpdateProgressResponse,
  Story,
  StoryNode,
  ValidationError,
} from './api-types';

// Create API client instance with proper base URL
const apiClient = new ApiClient({
  baseUrl: EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8081',
  timeout: 30000, // 30 seconds for story generation
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Story API Service Class
 * Encapsulates all story-related API operations with proper validation and error handling
 */
export class StoryApiService {
  constructor(private client = apiClient) {}

  async createStory(topic: string, userId: string): Promise<Story> {
    // Input validation
    this.validateCreateStoryInput(topic, userId);

    const request: CreateStoryRequest = {
      topic: topic.trim(),
      userId: userId.trim(),
    };

    try {
      const response = await this.client.post<CreateStoryResponse>(
        '/api/stories+api',
        request
      );

      // Extract story data from response
      const story = this.extractStoryFromResponse(response);
      
      console.log('Story created successfully:', {
        storyId: story.story_id,
        topic: story.title,
        nodeCount: story.nodes?.length || 0,
      });

      return story;

    } catch (error) {
      console.error('Failed to create story:', {
        topic,
        userId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Generates the next story node based on user choice
   * 
   * @param storyId - The parent story ID
   * @param previousNodeId - The node the user came from
   * @param choiceId - The choice the user made
   * @returns Promise<StoryNode> - The generated node object
   * 
   * Why dynamic node generation:
   * - Enables branching narratives without pre-generating all paths
   * - Reduces initial story creation time
   * - Allows for more responsive user experience
   */
  async generateStoryNode(
    storyId: string,
    previousNodeId: string,
    choiceId: string
  ): Promise<StoryNode> {
    // Input validation
    this.validateGenerateNodeInput(storyId, previousNodeId, choiceId);

    const request: GenerateStoryNodeRequest = {
      storyId: storyId.trim(),
      previousNodeId: previousNodeId.trim(),
      choiceId: choiceId.trim(),
    };

    try {
      const response = await this.client.post<GenerateStoryNodeResponse>(
        '/api/story-node+api',
        request
      );

      // Extract node data from response
      const node = this.extractNodeFromResponse(response);
      
      console.log('Story node generated successfully:', {
        nodeId: node.node_id,
        storyId: node.story_id,
        isEnding: node.is_ending,
        choiceCount: node.choices?.length || 0,
      });

      return node;

    } catch (error) {
      console.error('Failed to generate story node:', {
        storyId,
        previousNodeId,
        choiceId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async updateProgress(
    storyId: string,
    currentNodeId: string,
    isWon?: boolean
  ): Promise<{ success: true }> {
    // Input validation
    this.validateUpdateProgressInput(storyId, currentNodeId);

    const request: UpdateProgressRequest = {
      storyId: storyId.trim(),
      currentNodeId: currentNodeId.trim(),
      ...(isWon !== undefined && { isWon }),
    };

    try {
      const response = await this.client.patch<UpdateProgressResponse>(
        '/api/progress',
        request
      );

      // Extract success confirmation from response
      const result = this.extractProgressFromResponse(response);
      
      console.log('Story progress updated successfully:', {
        storyId,
        currentNodeId,
        isWon,
      });

      return result;

    } catch (error) {
      console.error('Failed to update story progress:', {
        storyId,
        currentNodeId,
        isWon,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Validates input for story creation
   * Private method to ensure data integrity
   */
  private validateCreateStoryInput(topic: string, userId: string): void {
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      throw new ValidationError('Topic is required and must be a non-empty string');
    }

    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new ValidationError('User ID is required and must be a non-empty string');
    }

    if (topic.trim().length > 100) {
      throw new ValidationError('Topic must be 100 characters or less');
    }

    // Basic UUID format validation for userId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId.trim())) {
      throw new ValidationError('User ID must be a valid UUID format');
    }
  }

  /**
   * Validates input for node generation
   * Private method to ensure data integrity
   */
  private validateGenerateNodeInput(
    storyId: string,
    previousNodeId: string,
    choiceId: string
  ): void {
    if (!storyId || typeof storyId !== 'string' || storyId.trim().length === 0) {
      throw new ValidationError('Story ID is required and must be a non-empty string');
    }

    if (!previousNodeId || typeof previousNodeId !== 'string' || previousNodeId.trim().length === 0) {
      throw new ValidationError('Previous node ID is required and must be a non-empty string');
    }

    if (!choiceId || typeof choiceId !== 'string' || choiceId.trim().length === 0) {
      throw new ValidationError('Choice ID is required and must be a non-empty string');
    }
  }

  /**
   * Validates input for progress updates
   * Private method to ensure data integrity
   */
  private validateUpdateProgressInput(storyId: string, currentNodeId: string): void {
    if (!storyId || typeof storyId !== 'string' || storyId.trim().length === 0) {
      throw new ValidationError('Story ID is required and must be a non-empty string');
    }

    if (!currentNodeId || typeof currentNodeId !== 'string' || currentNodeId.trim().length === 0) {
      throw new ValidationError('Current node ID is required and must be a non-empty string');
    }
  }

  /**
   * Extracts story data from API response
   * Private method to handle different response formats
   */
  private extractStoryFromResponse(response: any): Story {
    // The backend returns the story object directly
    if (response.story_id && response.title && response.nodes) {
      return response as Story;
    }

    // Handle wrapped response format (fallback)
    if (response.data && response.data.story_id) {
      return response.data;
    }

    throw new ValidationError('Invalid story response format');
  }

  /**
   * Extracts node data from API response
   * Private method to handle different response formats
   */
  private extractNodeFromResponse(response: any): StoryNode {
    // The backend returns the node object directly
    if (response.node_id && response.story_id && response.content) {
      return response as StoryNode;
    }

    // Handle wrapped response format (fallback)
    if (response.data && response.data.node_id) {
      return response.data;
    }

    throw new ValidationError('Invalid story node response format');
  }

  /**
   * Extracts progress data from API response
   * Private method to handle different response formats
   */
  private extractProgressFromResponse(response: UpdateProgressResponse): { success: true } {
    // Handle wrapped response format
    if (response.data) {
      return response.data;
    }

    // Handle direct success object
    if (response.success) {
      return { success: true };
    }

    throw new ValidationError('Invalid progress response format');
  }
}

// Create and export singleton instance
export const storyApi = new StoryApiService();

// Export individual methods for convenience and backward compatibility
export const createStory = (topic: string, userId: string) => 
  storyApi.createStory(topic, userId);

export const generateStoryNode = (storyId: string, previousNodeId: string, choiceId: string) => 
  storyApi.generateStoryNode(storyId, previousNodeId, choiceId);

export const updateProgress = (storyId: string, currentNodeId: string, isWon?: boolean) => 
  storyApi.updateProgress(storyId, currentNodeId, isWon);

// Export factory function for custom configurations
export const createStoryApiService = (baseUrl?: string) => {
  const customClient = createApiClient({ baseUrl });
  return new StoryApiService(customClient);
};