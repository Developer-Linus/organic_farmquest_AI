import { generateObject, generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import type { GameTopic, GameDifficulty } from '../src/types';
import { 
  generateStoryStartPrompt, 
  generateNextNodePrompt, 
  generateChoiceFeedbackPrompt, 
  generateStorySummaryPrompt,
  validatePromptResponse,
  sanitizeContent,
  PROMPT_CONFIG 
} from './prompts';

// Validation schemas for AI responses
const StoryStartResponseSchema = z.object({
  content: z.string().min(50).max(2000),
  choices: z.array(z.object({
    id: z.string(),
    text: z.string().min(10).max(200),
    is_correct: z.boolean(),
  })).min(2).max(4),
});

const NextNodeResponseSchema = z.object({
  content: z.string().min(50).max(2000),
  isEnding: z.boolean(),
  isWinning: z.boolean().optional(),
  choices: z.array(z.object({
    id: z.string(),
    text: z.string().min(10).max(200),
    is_correct: z.boolean(),
  })).min(0).max(4),
});

const SummaryResponseSchema = z.object({
  summary: z.string().min(100).max(1000),
  keyLessons: z.array(z.string()).min(1).max(5),
  encouragement: z.string().min(20).max(300),
});

export interface StoryContext {
  topic: GameTopic;
  difficulty: GameDifficulty;
  storyHistory: string;
  currentScore?: number;
}

export class AIService {
  private model = google('gemini-1.5-flash');

  /**
   * Generate the initial story node for a new game
   */
  async generateStoryStart(topic: GameTopic, difficulty: GameDifficulty): Promise<{
    content: string;
    choices: Array<{
      id: string;
      text: string;
      is_correct: boolean;
      next_node_id: string;
    }>;
  }> {
    try {
      const prompt = generateStoryStartPrompt(topic, difficulty);
      
      const result = await generateObject({
        model: this.model,
        schema: StoryStartResponseSchema,
        prompt,
        temperature: PROMPT_CONFIG.temperature,
        maxTokens: PROMPT_CONFIG.maxTokens,
      });

      // Sanitize content and add next_node_id placeholders
      const sanitizedContent = sanitizeContent(result.object.content);
      const processedChoices = result.object.choices.map((choice, index) => ({
        ...choice,
        next_node_id: 'pending', // Will be filled when next node is generated
      }));

      return {
        content: sanitizedContent,
        choices: processedChoices,
      };

    } catch (error) {
      console.error('Error generating story start:', error);
      throw new Error(`Failed to generate story start: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate the next story node based on player choice
   */
  async generateNextNode(
    topic: GameTopic,
    difficulty: GameDifficulty,
    storyHistory: string,
    userChoice: string,
    isCorrectChoice: boolean
  ): Promise<{
    content: string;
    choices: Array<{
      id: string;
      text: string;
      is_correct: boolean;
      next_node_id: string;
    }>;
    isEnding: boolean;
    isWinning?: boolean;
  }> {
    try {
      const prompt = generateNextNodePrompt(topic, difficulty, storyHistory, userChoice, isCorrectChoice);
      
      const result = await generateObject({
        model: this.model,
        schema: NextNodeResponseSchema,
        prompt,
        temperature: PROMPT_CONFIG.temperature,
        maxTokens: PROMPT_CONFIG.maxTokens,
      });

      // Sanitize content and add next_node_id placeholders
      const sanitizedContent = sanitizeContent(result.object.content);
      const processedChoices = result.object.choices?.map((choice, index) => ({
        ...choice,
        next_node_id: 'pending',
      })) || [];

      return {
        content: sanitizedContent,
        choices: processedChoices,
        isEnding: result.object.isEnding,
        isWinning: result.object.isWinning,
      };

    } catch (error) {
      console.error('Error generating next node:', error);
      throw new Error(`Failed to generate next node: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate feedback for a player's choice
   */
  async generateChoiceFeedback(
    topic: GameTopic,
    difficulty: GameDifficulty,
    choice: string,
    isCorrect: boolean
  ): Promise<string> {
    try {
      const prompt = generateChoiceFeedbackPrompt(topic, difficulty, choice, isCorrect);
      
      const result = await generateText({
        model: this.model,
        prompt,
        temperature: PROMPT_CONFIG.temperature,
        maxTokens: 200,
      });

      return sanitizeContent(result.text);

    } catch (error) {
      console.error('Error generating choice feedback:', error);
      throw new Error(`Failed to generate feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a story summary at the end of the game
   */
  async generateStorySummary(
    topic: GameTopic,
    difficulty: GameDifficulty,
    storyHistory: string,
    finalOutcome: 'won' | 'lost'
  ): Promise<{
    summary: string;
    keyLessons: string[];
    encouragement: string;
  }> {
    try {
      const prompt = generateStorySummaryPrompt(topic, difficulty, storyHistory, finalOutcome);
      
      const result = await generateObject({
        model: this.model,
        schema: SummaryResponseSchema,
        prompt,
        temperature: PROMPT_CONFIG.temperature,
        maxTokens: PROMPT_CONFIG.maxTokens,
      });

      return {
        summary: sanitizeContent(result.object.summary),
        keyLessons: result.object.keyLessons.map(lesson => sanitizeContent(lesson)),
        encouragement: sanitizeContent(result.object.encouragement),
      };

    } catch (error) {
      console.error('Error generating story summary:', error);
      throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const aiService = new AIService();