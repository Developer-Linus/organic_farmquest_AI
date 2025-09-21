// Database Configuration
export const DATABASE_CONFIG = {
  DATABASE_ID: 'farmquest',
  COLLECTIONS: {
    USERS: 'users',
    STORIES: 'stories',
    STORY_NODES: 'story_nodes',
    STORY_JOBS: 'story_jobs',
  }
} as const;

// Story status enums
export const STORY_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Game Topics
export const GAME_TOPICS = {
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  HERBS: 'herbs',
  GRAINS: 'grains',
  LIVESTOCK: 'livestock',
} as const;

// Game Difficulties
export const GAME_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

// Topic Information
export const TOPIC_INFO = {
  vegetables: {
    name: 'Vegetables',
    icon: '🥕',
    description: 'Learn about growing healthy vegetables organically'
  },
  fruits: {
    name: 'Fruits',
    icon: '🍎',
    description: 'Discover organic fruit cultivation techniques'
  },
  herbs: {
    name: 'Herbs',
    icon: '🌿',
    description: 'Master the art of growing aromatic herbs'
  },
  grains: {
    name: 'Grains',
    icon: '🌾',
    description: 'Explore sustainable grain farming methods'
  },
  livestock: {
    name: 'Livestock',
    icon: '🐄',
    description: 'Learn ethical and organic animal husbandry'
  }
} as const;

// Difficulty Information
export const DIFFICULTY_INFO = {
  easy: {
    name: 'Beginner',
    emoji: '🌱',
    description: 'Perfect for those new to organic farming'
  },
  medium: {
    name: 'Intermediate',
    emoji: '🌿',
    description: 'For farmers with some experience'
  },
  hard: {
    name: 'Expert',
    emoji: '🌳',
    description: 'Advanced challenges for seasoned farmers'
  }
} as const;
