// Database Configuration
export const DATABASE_CONFIG = {
  DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  COLLECTIONS: {
    USERS: 'users',
    STORIES: 'stories',
    STORY_NODES: 'story_nodes',
    STORY_JOBS: 'story_jobs',
  }
} as const;

// Game Configuration
export const GAME_CONFIG = {
  MAX_STORIES: 5,
  SCORE_THRESHOLDS: {
    EXCELLENT: 400,
    GOOD: 300,
    FAIR: 200,
    POOR: 0,
  },
  MAX_SCORE_PER_STORY: 100,
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
  HERBS: 'herbs',
  FRUITS: 'fruits',
  CUSTOM: 'custom',
} as const;

// Game Difficulties
export const GAME_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

// Topic Information
export const TOPIC_INFO = {
  [GAME_TOPICS.VEGETABLES]: {
    name: 'Organic Vegetables',
    icon: '🥕',
    description: 'Learn sustainable vegetable farming techniques'
  },
  [GAME_TOPICS.HERBS]: {
    name: 'Medicinal Herbs',
    icon: '🌿',
    description: 'Discover organic herb cultivation and natural remedies'
  },
  [GAME_TOPICS.FRUITS]: {
    name: 'Organic Fruits',
    icon: '🍎',
    description: 'Master organic fruit growing and orchard management'
  },
  [GAME_TOPICS.CUSTOM]: {
    name: 'Custom Topic',
    icon: '✨',
    description: 'Explore your own organic farming interest'
  },
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
