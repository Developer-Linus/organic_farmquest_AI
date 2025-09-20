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
