import { z } from 'zod';

// User schemas
export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  avatar: z.string().optional(),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
});

// Game schemas
export const GameDifficultySchema = z.enum(['easy', 'medium', 'hard']);

export const GameTopicSchema = z.enum([
  'vegetables',
  'fruits', 
  'herbs',
  'composting',
  'pest_control',
  'soil_health',
  'water_management',
  'seasonal_planning'
]);

export const CreateGameSessionSchema = z.object({
  topic: GameTopicSchema,
  difficulty: GameDifficultySchema,
  userId: z.string().uuid('Invalid user ID'),
});

export const GameSessionResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  topic: GameTopicSchema,
  difficulty: GameDifficultySchema,
  currentStoryId: z.string().optional(),
  score: z.number().min(0),
  isActive: z.boolean(),
  startedAt: z.string().transform((str) => new Date(str)),
  completedAt: z.string().transform((str) => new Date(str)).optional(),
});

// Story schemas
export const StoryChoiceSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Choice text is required'),
  points: z.number().min(0).max(100),
  consequence: z.string().optional(),
  nextStoryHint: z.string().optional(),
});

export const GenerateStoryRequestSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  previousChoice: z.string().optional(),
  context: z.string().optional(),
});

export const StoryResponseSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  content: z.string().min(1, 'Story content is required'),
  imageUrl: z.string().url().optional(),
  choices: z.array(StoryChoiceSchema).min(2, 'At least 2 choices required').max(4, 'Maximum 4 choices allowed'),
  isCompleted: z.boolean(),
  createdAt: z.string().transform((str) => new Date(str)),
});

export const MakeChoiceRequestSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  storyId: z.string().uuid('Invalid story ID'),
  choiceId: z.string().uuid('Invalid choice ID'),
});

// Progress and Achievement schemas
export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  unlockedAt: z.string().transform((str) => new Date(str)),
});

export const GameProgressResponseSchema = z.object({
  totalGamesPlayed: z.number().min(0),
  totalScore: z.number().min(0),
  averageScore: z.number().min(0),
  favoriteTopics: z.array(GameTopicSchema),
  achievements: z.array(AchievementSchema),
});

// API Response wrapper
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

// Type inference exports
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type CreateGameSessionRequest = z.infer<typeof CreateGameSessionSchema>;
export type GameSessionResponse = z.infer<typeof GameSessionResponseSchema>;
export type GenerateStoryRequest = z.infer<typeof GenerateStoryRequestSchema>;
export type StoryResponse = z.infer<typeof StoryResponseSchema>;
export type MakeChoiceRequest = z.infer<typeof MakeChoiceRequestSchema>;
export type GameProgressResponse = z.infer<typeof GameProgressResponseSchema>;
export type StoryChoice = z.infer<typeof StoryChoiceSchema>;