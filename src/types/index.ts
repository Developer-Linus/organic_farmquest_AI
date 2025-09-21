// Core domain interfaces for internal application use
export interface User {
  id: string;
  name: string;
  email: string;
  games_won: number;
}

// Game-related types
export type GameTopic = 'vegetables' | 'fruits' | 'herbs' | 'grains' | 'livestock';
export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface Story {
  story_id: string;
  user_id: string;
  topic: string;
  status: 'active' | 'completed' | 'failed';
  current_node_id?: string;
  is_won: boolean;
}
export interface StoryChoice {
  id: string;
  text: string;
  is_correct: boolean;
  next_node_id: string;
}
export interface StoryNode{
  node_id: string;
  story_id: string;
  content: string;
  is_root: boolean;
  is_ending: boolean;
  is_winning_ending: boolean;
  choices: StoryChoice[];
}
export interface StoryJob{
  job_id: string;
  story_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  ai_prompt: string;
  generated_content?: string;
  completed_at?: Date;
}
export interface GameContextType {
  currentUser: User | null;
  currentStory: Story | null;
  currentNode: StoryNode | null;
  isLoading: boolean;
  isGuest: boolean;

  // Actions
  createNewStory: (topic: string) => Promise<void>;
  makeChoice: (choiceId: string) => Promise<void>;
  
  // User session management
  loginUser: (userProfile: User) => Promise<void>;
  logoutUser: () => Promise<void>;
  initializeUserSession: () => Promise<void>;
}