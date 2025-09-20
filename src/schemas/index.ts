import { NotepadText } from '@tamagui/lucide-icons';
import { z } from 'zod';

// Validation schemas for API requests and responses
export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  hashed_password: z.string().min(1),
  games_won: z.number().int().nonnegative().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
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
  id: z.string().min(1),
  text: z.string().min(1).max(500),
  is_correct: z.boolean(),
  next_node_id: z.string().min(1),
});

export const StoryNodeSchema = z.object({
  node_id: z.string().min(1),
  story_id: z.string().min(1),
  content: z.string().min(1).max(2000),
  is_root: z.boolean().default(false),
  is_ending: z.boolean().default(false),
  is_winning_node: z.boolean().default(false),
  choices: z.array(StoryChoiceSchema).max(2),
  created_at: z.date(),
});

// Export inferred types for use in application
export type UserData = z.infer<typeof UserSchema>;
export type UserRegistrationData = z.infer<typeof UserRegistrationSchema>;
export type UserLoginData = z.infer<typeof UserLoginSchema>;
export type StoryNodeData = z.infer<typeof StoryNodeSchema>;