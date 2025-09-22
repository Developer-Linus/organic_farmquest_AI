import { z } from 'zod';

// Validation schemas for API requests and responses
export const UserSchema = z.object({
  // id is optional when inserting, but required when reading
  id: z.string().min(1).optional().transform((val, ctx) => {
    const raw: any = ctx?.parent;
    return raw?.$id ?? val; // use $id from Appwrite if present
  }),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  games_won: z.number().int().nonnegative().default(0),
});

// Registration request schema (includes password validation)
export const UserRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login request schema
export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const StoryChoiceSchema = z.object({
  choice_id: z.string().min(1),
  text: z.string().min(1).max(500),
  next_node: z.string().min(1),
});

export const StorySchema = z.object({
  story_id: z.string().min(1),
  title: z.string().min(1).max(200),
  nodes: z.array(StoryNodeSchema).optional().default([]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const GameSessionSchema = z.object({
  story_id: z.string().min(1),
  user_id: z.string().min(1),
  topic: z.string().min(1).max(100),
  status: z.enum(['active', 'completed', 'failed']),
  current_node_id: z.string().min(1).optional(),
  is_won: z.boolean().default(false),
});

export const StoryNodeSchema = z.object({
  node_id: z.string().min(1),
  story_id: z.string().min(1),
  content: z.string().min(1).max(2000),
  is_root: z.boolean().default(false),
  is_ending: z.boolean().default(false),
  is_winning_ending: z.boolean().default(false),
  choices: z.array(StoryChoiceSchema).max(4),
});

export const StoryJobSchema = z.object({
  job_id: z.string().min(1),
  story_id: z.string().min(1),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  ai_prompt: z.string().min(1),
  generated_content: z.string().optional(),
  completed_at: z.date().optional(),
});

// Export inferred types for use in application
export type UserData = z.infer<typeof UserSchema>;
export type UserRegistrationData = z.infer<typeof UserRegistrationSchema>;
export type UserLoginData = z.infer<typeof UserLoginSchema>;
export type StoryData = z.infer<typeof StorySchema>;
export type GameSessionData = z.infer<typeof GameSessionSchema>;
export type StoryNodeData = z.infer<typeof StoryNodeSchema>;
export type StoryJobData = z.infer<typeof StoryJobSchema>;