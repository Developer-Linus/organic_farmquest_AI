import { z } from 'zod';
import { aiService } from '../lib/ai';
import { databaseService } from '../lib/database';
import type { StoryChoice } from '../src/types';

// Request validation schema
const GenerateNodeRequestSchema = z.object({
  storyId: z.string().min(1),
  currentNodeId: z.string().min(1),
  selectedChoiceId: z.string().min(1),
  userChoice: z.string().min(1),
});

// Response schema
const GenerateNodeResponseSchema = z.object({
  success: z.boolean(),
  node: z.object({
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
  storyComplete: z.boolean(),
  isWinning: z.boolean().optional(),
  error: z.string().optional(),
});

// Types for the API functions
type GenerateNodeRequest = z.infer<typeof GenerateNodeRequestSchema>;
type GenerateNodeResponse = z.infer<typeof GenerateNodeResponseSchema>;

// Generate node function
export async function generateNode(request: GenerateNodeRequest): Promise<GenerateNodeResponse> {
  try {
    const validatedRequest = GenerateNodeRequestSchema.parse(request);
    const { storyId, currentNodeId, selectedChoiceId, userChoice } = validatedRequest;

    // Get current story and node
    const story = await databaseService.getStoryById(storyId);
    if (!story) {
      return {
        success: false,
        error: 'Story not found',
        storyComplete: false,
      };
    }

    const currentNode = await databaseService.getStoryNodeById(currentNodeId);
    if (!currentNode) {
      return {
        success: false,
        error: 'Current node not found',
        storyComplete: false,
      };
    }

    // Find the selected choice
    const selectedChoice = currentNode.choices.find(choice => choice.id === selectedChoiceId);
    if (!selectedChoice) {
      return {
        success: false,
        error: 'Selected choice not found',
        storyComplete: false,
      };
    }

    // Check if this choice already has a next node
    if (selectedChoice.next_node_id && selectedChoice.next_node_id !== 'pending') {
      // Node already exists, retrieve it
      const existingNode = await databaseService.getStoryNodeById(selectedChoice.next_node_id);
      if (existingNode) {
        // Update story's current node
        await databaseService.updateStory(storyId, {
          current_node_id: existingNode.node_id,
        });

        return GenerateNodeResponseSchema.parse({
          success: true,
          node: existingNode,
          storyComplete: existingNode.is_ending,
          isWinning: existingNode.is_winning_ending,
        });
      }
    }

    // Generate new node content using AI
    const nodeData = await aiService.generateStoryNode(
      story.topic,
      story.difficulty as any,
      currentNode.content,
      userChoice,
      selectedChoice.is_correct
    );

    // Create new story node
    const newNode = await databaseService.createStoryNode({
      story_id: storyId,
      content: nodeData.content,
      is_root: false,
      is_ending: nodeData.isEnding,
      is_winning_ending: nodeData.isWinning,
      choices: nodeData.choices || [],
    });

    // Update the selected choice to point to the new node
    await databaseService.updateStoryNodeChoice(
      currentNodeId,
      selectedChoiceId,
      newNode.node_id
    );

    // Update story's current node
    await databaseService.updateStory(storyId, {
      current_node_id: newNode.node_id,
      is_won: nodeData.isEnding && nodeData.isWinning,
    });

    // Create a story job record for tracking
    await databaseService.createStoryJob({
      story_id: storyId,
      status: 'completed',
      ai_prompt: `Generate story node for choice: ${userChoice}`,
      generated_content: nodeData.content,
      completed_at: new Date(),
    });

    const response = {
      success: true,
      node: newNode,
      storyComplete: nodeData.isEnding,
      isWinning: nodeData.isWinning,
    };

    return GenerateNodeResponseSchema.parse(response);

  } catch (error) {
    console.error('Error in generateNode:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Invalid request data: ' + error.errors.map(e => e.message).join(', '),
        storyComplete: false,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate story node',
      storyComplete: false,
    };
  }
}

// Get story node function
export async function getStoryNode(params: { nodeId?: string; storyId?: string }) {
  try {
    const { nodeId, storyId } = params;

    if (!nodeId && !storyId) {
      return {
        success: false,
        error: 'Either nodeId or storyId is required',
      };
    }

    if (nodeId) {
      // Get specific node
      const node = await databaseService.getStoryNodeById(nodeId);
      if (!node) {
        return {
          success: false,
          error: 'Story node not found',
        };
      }

      return {
        success: true,
        node,
        storyComplete: node.is_ending,
        isWinning: node.is_winning_ending,
      };
    } else if (storyId) {
      // Get current node for story
      const story = await databaseService.getStoryById(storyId);
      if (!story) {
        return {
          success: false,
          error: 'Story not found',
        };
      }

      const currentNode = await databaseService.getStoryNodeById(story.current_node_id);
      if (!currentNode) {
        return {
          success: false,
          error: 'Current story node not found',
        };
      }

      return {
        success: true,
        node: currentNode,
        storyComplete: currentNode.is_ending,
        isWinning: currentNode.is_winning_ending,
      };
    }

  } catch (error) {
    console.error('Error in getStoryNode:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve story node',
    };
  }
}