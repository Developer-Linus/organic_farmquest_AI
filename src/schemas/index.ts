import { NotepadText } from '@tamagui/lucide-icons';
import { z } from 'zod';

// Validation schemas for API requests and responses
export const UserSchema = z.object(
  {
    user_id: z.string().min(1),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    games_won: z.number().int().nonnegative().default(0),
    created_at: z.date().default(() => new Date()),
  }
)
export const StoryChoiceSchema = z.object(
  {
    id: z.string().min(1),
    text: z.string().min(1).max(500),
    is_correct: z.boolean(),
    next_node_id: z.string().min(1),
  }
)
export const StoryNodeSchema = z.object(
  {
    node_id: z.string().min(1),
    story_id: z.string().min(1),
    content: z.string().min(1).max(2000),
    is_root: z.boolean().default(false),
    is_ending: z.boolean().default(false),
    is_winning_node: z.boolean().default(false),
    choices: z.array(StoryChoiceSchema).max(2),
    created_at: z.date(),
  }
)

// Export inferred types for use in application
export type UserData = z.infer<typeof UserSchema>
export type StoryNodeData = z.infer<typeof StoryNodeSchema>