// Core domain interfaces for internal application use
export interface User {
  id: string;
  name: string;
  email: string;
  hashed_password: string;
  games_won: number;
  createdAt: string;
  updatedAt: string;
}
export interface Story {
  story_id: string;
  user_id: string;
  topic: string;
  status: 'active' | 'completed' | 'failed';
  current_node_id?: string;
  is_won: boolean;
  created_at: Date;
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
  created_at: Date;
  completed_at?: Date;
}
export interface GameContextType {
  currentUser: User | null;
  currentStory: Story | null;
  currentNode: StoryNode | null;

  // Actions
  createNewStory: (topic: string) => Promise<void>;
  makeChoice: (choiceId: string) => Promise<void>;
}