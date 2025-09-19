// Core application types and interfaces
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSession {
  id: string;
  userId: string;
  topic: string;
  difficulty: GameDifficulty;
  currentStoryId?: string;
  score: number;
  isActive: boolean;
  startedAt: Date;
  completedAt?: Date;
}

export interface Story {
  id: string;
  sessionId: string;
  content: string;
  imageUrl?: string;
  choices: StoryChoice[];
  isCompleted: boolean;
  createdAt: Date;
}

export interface StoryChoice {
  id: string;
  text: string;
  points: number;
  consequence?: string;
  nextStoryHint?: string;
}

export interface GameProgress {
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  favoriteTopics: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export type GameDifficulty = 'easy' | 'medium' | 'hard';

export type GameTopic = 
  | 'vegetables'
  | 'fruits'
  | 'herbs'
  | 'composting'
  | 'pest_control'
  | 'soil_health'
  | 'water_management'
  | 'seasonal_planning';

// Navigation types
export interface RootStackParamList {
  index: undefined;
  welcome: undefined;
  game: undefined;
  story: { sessionId: string };
  profile: undefined;
  settings: undefined;
  'game/setup': undefined;
  'game/play': { sessionId: string };
  'game/results': { sessionId: string };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// App State types
export interface AppState {
  user: User | null;
  currentSession: GameSession | null;
  isLoading: boolean;
  error: string | null;
}

export interface GameState {
  session: GameSession | null;
  currentStory: Story | null;
  isGeneratingStory: boolean;
  error: string | null;
}