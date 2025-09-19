// Game configuration constants
export const GAME_TOPICS = {
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  HERBS: 'herbs',
  COMPOSTING: 'composting',
  PEST_CONTROL: 'pest_control',
  SOIL_HEALTH: 'soil_health',
  WATER_MANAGEMENT: 'water_management',
  SEASONAL_PLANNING: 'seasonal_planning',
} as const;

export const GAME_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

// Topic display information
export const TOPIC_INFO = {
  [GAME_TOPICS.VEGETABLES]: {
    title: 'Vegetables',
    description: 'Learn about growing healthy vegetables organically',
    icon: '🥕',
    color: '#4CAF50',
  },
  [GAME_TOPICS.FRUITS]: {
    title: 'Fruits',
    description: 'Discover organic fruit cultivation techniques',
    icon: '🍎',
    color: '#FF5722',
  },
  [GAME_TOPICS.HERBS]: {
    title: 'Herbs',
    description: 'Master the art of growing aromatic herbs',
    icon: '🌿',
    color: '#8BC34A',
  },
  [GAME_TOPICS.COMPOSTING]: {
    title: 'Composting',
    description: 'Create nutrient-rich compost for your garden',
    icon: '♻️',
    color: '#795548',
  },
  [GAME_TOPICS.PEST_CONTROL]: {
    title: 'Pest Control',
    description: 'Natural methods to protect your crops',
    icon: '🐛',
    color: '#FF9800',
  },
  [GAME_TOPICS.SOIL_HEALTH]: {
    title: 'Soil Health',
    description: 'Build and maintain healthy soil ecosystems',
    icon: '🌱',
    color: '#607D8B',
  },
  [GAME_TOPICS.WATER_MANAGEMENT]: {
    title: 'Water Management',
    description: 'Efficient watering and irrigation strategies',
    icon: '💧',
    color: '#2196F3',
  },
  [GAME_TOPICS.SEASONAL_PLANNING]: {
    title: 'Seasonal Planning',
    description: 'Plan your garden throughout the seasons',
    icon: '📅',
    color: '#9C27B0',
  },
} as const;

// Difficulty display information
export const DIFFICULTY_INFO = {
  [GAME_DIFFICULTIES.EASY]: {
    title: 'Beginner',
    description: 'Perfect for those new to organic farming',
    color: '#4CAF50',
    pointsMultiplier: 1,
  },
  [GAME_DIFFICULTIES.MEDIUM]: {
    title: 'Intermediate',
    description: 'For gardeners with some experience',
    color: '#FF9800',
    pointsMultiplier: 1.5,
  },
  [GAME_DIFFICULTIES.HARD]: {
    title: 'Expert',
    description: 'Challenge yourself with complex scenarios',
    color: '#F44336',
    pointsMultiplier: 2,
  },
} as const;

// Scoring constants
export const SCORING = {
  MIN_CHOICE_POINTS: 0,
  MAX_CHOICE_POINTS: 100,
  PERFECT_SCORE_THRESHOLD: 90,
  GOOD_SCORE_THRESHOLD: 70,
  PASSING_SCORE_THRESHOLD: 50,
} as const;

// Achievement constants
export const ACHIEVEMENTS = {
  FIRST_GAME: 'first_game',
  PERFECT_SCORE: 'perfect_score',
  TOPIC_MASTER: 'topic_master',
  STREAK_PLAYER: 'streak_player',
  EXPLORER: 'explorer',
} as const;

// UI constants
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const SCREEN_PADDING = {
  HORIZONTAL: 16,
  VERTICAL: 20,
} as const;

// API constants
export const API_ENDPOINTS = {
  GENERATE_STORY: '/api/story/generate',
  MAKE_CHOICE: '/api/story/choice',
  GET_PROGRESS: '/api/user/progress',
  CREATE_SESSION: '/api/game/session',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  GAME_PROGRESS: 'game_progress',
  OFFLINE_DATA: 'offline_data',
} as const;