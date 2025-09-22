import { Client, Databases, ID } from 'react-native-appwrite';
import { DATABASE_CONFIG } from '../src/constants/index';
import { 
  DatabaseError, 
  DatabaseErrorHandler, 
  RetryHandler, 
  DatabaseValidator,
  CollectionNotFoundError,
  ValidationError 
} from './database-errors';

// Types for collection schemas
interface AttributeSchema {
  key: string;
  type: 'string' | 'integer' | 'boolean' | 'datetime';
  size?: number;
  required: boolean;
  default?: any;
}

interface IndexSchema {
  key: string;
  type: 'key' | 'unique' | 'fulltext';
  attributes: string[];
}

interface CollectionSchema {
  name: string;
  attributes: AttributeSchema[];
  indexes?: IndexSchema[];
}

// Collection schemas matching the Node.js script
const COLLECTION_SCHEMAS: Record<string, CollectionSchema> = {
  [DATABASE_CONFIG.COLLECTIONS.USERS]: {
    name: 'Users',
    attributes: [
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 100, required: true },
      { key: 'games_won', type: 'integer', required: false, default: 0 }
    ],
    indexes: [
      { key: 'email_index', type: 'unique', attributes: ['email'] }
    ]
  },
  [DATABASE_CONFIG.COLLECTIONS.STORIES]: {
    name: 'Stories',
    attributes: [
      { key: 'story_id', type: 'string', size: 50, required: true },
      { key: 'user_id', type: 'string', size: 50, required: true },
      { key: 'topic', type: 'string', size: 100, required: true },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'current_node_id', type: 'string', size: 50, required: false },
      { key: 'is_won', type: 'boolean', required: false, default: false }
    ],
    indexes: [
      { key: 'user_stories', type: 'key', attributes: ['user_id'] },
      { key: 'status_index', type: 'key', attributes: ['status'] }
    ]
  },
  [DATABASE_CONFIG.COLLECTIONS.STORY_NODES]: {
    name: 'Story Nodes',
    attributes: [
      { key: 'node_id', type: 'string', size: 50, required: true },
      { key: 'story_id', type: 'string', size: 50, required: true },
      { key: 'content', type: 'string', size: 2000, required: true },
      { key: 'is_root', type: 'boolean', required: false, default: false },
      { key: 'is_ending', type: 'boolean', required: false, default: false },
      { key: 'is_winning_ending', type: 'boolean', required: false, default: false },
      { key: 'choices', type: 'string', size: 10000, required: false }
    ],
    indexes: [
      { key: 'story_nodes', type: 'key', attributes: ['story_id'] },
      { key: 'node_id_index', type: 'unique', attributes: ['node_id'] }
    ]
  },
  [DATABASE_CONFIG.COLLECTIONS.STORY_JOBS]: {
    name: 'Story Jobs',
    attributes: [
      { key: 'job_id', type: 'string', size: 50, required: true },
      { key: 'story_id', type: 'string', size: 50, required: true },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'ai_prompt', type: 'string', size: 2000, required: true },
      { key: 'generated_content', type: 'string', size: 10000, required: false },
      { key: 'completed_at', type: 'datetime', required: false }
    ],
    indexes: [
      { key: 'story_jobs', type: 'key', attributes: ['story_id'] },
      { key: 'job_id_index', type: 'unique', attributes: ['job_id'] },
      { key: 'status_jobs', type: 'key', attributes: ['status'] }
    ]
  }
};

export class DatabaseInitializer {
  private client: Client;
  private databases: Databases;
  private databaseId: string;

  constructor(client: Client, databaseId: string) {
    this.client = client;
    this.databases = new Databases(client);
    this.databaseId = databaseId;
  }

  /**
   * Check if a collection exists
   */
  async collectionExists(collectionId: string): Promise<boolean> {
    try {
      DatabaseValidator.validateCollectionId(collectionId);
      await this.databases.getCollection(this.databaseId, collectionId);
      return true;
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error.code === 404) {
        return false;
      }
      const dbError = DatabaseErrorHandler.parseAppwriteError(error, {
        operation: 'checkCollection',
        collectionId
      });
      DatabaseErrorHandler.logError(dbError, 'collectionExists');
      throw dbError;
    }
  }

  async getCollectionInfo(collectionId: string) {
    try {
      DatabaseValidator.validateCollectionId(collectionId);
      return await RetryHandler.withRetry(
        () => this.databases.getCollection(this.databaseId, collectionId),
        { maxRetries: 2, delay: 500 }
      );
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error;
      }
      if (error.code === 404) {
        return null;
      }
      const dbError = DatabaseErrorHandler.parseAppwriteError(error, {
        operation: 'getCollection',
        collectionId
      });
      DatabaseErrorHandler.logError(dbError, 'getCollectionInfo');
      throw dbError;
    }
  }

  /**
   * Check if all required collections exist
   */
  async checkCollectionsStatus(): Promise<{
    allExist: boolean;
    missing: string[];
    existing: string[];
    errors: Array<{ collectionId: string; error: string }>;
  }> {
    const missing: string[] = [];
    const existing: string[] = [];
    const errors: Array<{ collectionId: string; error: string }> = [];

    for (const collectionId of Object.keys(COLLECTION_SCHEMAS)) {
      try {
        const exists = await this.collectionExists(collectionId);
        if (exists) {
          existing.push(collectionId);
        } else {
          missing.push(collectionId);
        }
      } catch (error: any) {
        errors.push({
          collectionId,
          error: error.message || 'Unknown error'
        });
        // Treat errored collections as missing for safety
        missing.push(collectionId);
      }
    }

    return {
      allExist: missing.length === 0 && errors.length === 0,
      missing,
      existing,
      errors
    };
  }

  async getStatusReport(): Promise<{
    status: 'complete' | 'partial' | 'missing' | 'error';
    message: string;
    details: {
      total: number;
      existing: number;
      missing: number;
      errors: number;
      collections: Record<string, { exists: boolean; name: string; error?: string }>;
    };
  }> {
    try {
      const collectionsStatus = await this.checkCollectionsStatus();
      const total = Object.keys(COLLECTION_SCHEMAS).length;
      const existing = collectionsStatus.existing.length;
      const missing = collectionsStatus.missing.length;
      const errorCount = collectionsStatus.errors.length;

      const collections: Record<string, { exists: boolean; name: string; error?: string }> = {};
      
      for (const [collectionId, schema] of Object.entries(COLLECTION_SCHEMAS)) {
        const error = collectionsStatus.errors.find(e => e.collectionId === collectionId);
        collections[collectionId] = {
          exists: collectionsStatus.existing.includes(collectionId),
          name: schema.name,
          ...(error && { error: error.error })
        };
      }

      let status: 'complete' | 'partial' | 'missing' | 'error';
      let message: string;

      if (errorCount > 0) {
        status = 'error';
        message = `❌ Database check failed for ${errorCount} collection(s). Please check your connection and permissions.`;
      } else if (missing === 0) {
        status = 'complete';
        message = '✅ All collections are properly configured!';
      } else if (existing > 0) {
        status = 'partial';
        message = `⚠️ ${existing}/${total} collections exist. Missing: ${collectionsStatus.missing.map(id => COLLECTION_SCHEMAS[id]?.name || id).join(', ')}`;
      } else {
        status = 'missing';
        message = '❌ No collections found. Database initialization required.';
      }

      return {
        status,
        message,
        details: {
          total,
          existing,
          missing,
          errors: errorCount,
          collections
        }
      };
    } catch (error: any) {
      const dbError = DatabaseErrorHandler.parseAppwriteError(error, {
        operation: 'getStatusReport'
      });
      DatabaseErrorHandler.logError(dbError, 'getStatusReport');
      
      return {
        status: 'error',
        message: `❌ Failed to check database status: ${DatabaseErrorHandler.getUserFriendlyMessage(dbError)}`,
        details: {
          total: Object.keys(COLLECTION_SCHEMAS).length,
          existing: 0,
          missing: 0,
          errors: 1,
          collections: {}
        }
      };
    }
  }

  /**
   * Validate that collections have the expected structure
   * Note: This is a basic check - full attribute validation would require server SDK
   */
  async validateCollectionStructure(collectionId: string): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];
    
    try {
      DatabaseValidator.validateCollectionId(collectionId);
      
      const collection = await RetryHandler.withRetry(
        () => this.databases.getCollection(this.databaseId, collectionId),
        { maxRetries: 2, delay: 500 }
      );
      
      const expectedSchema = COLLECTION_SCHEMAS[collectionId];
      
      if (!expectedSchema) {
        issues.push(`Unknown collection: ${collectionId}`);
        return { valid: false, issues };
      }

      // Basic validation - check if collection exists and has a name
      if (!collection.name) {
        issues.push('Collection has no name');
      }

      // Validate collection name matches expected
      if (collection.name !== expectedSchema.name) {
        issues.push(`Collection name mismatch. Expected: ${expectedSchema.name}, Got: ${collection.name}`);
      }

      // Note: Detailed attribute validation requires server SDK access
      // This is a placeholder for basic validation
      
      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error: any) {
      if (error instanceof ValidationError) {
        issues.push(`Validation error: ${error.message}`);
      } else {
        const dbError = DatabaseErrorHandler.parseAppwriteError(error, {
          operation: 'validateCollection',
          collectionId
        });
        DatabaseErrorHandler.logError(dbError, 'validateCollectionStructure');
        issues.push(`Failed to validate collection: ${DatabaseErrorHandler.getUserFriendlyMessage(dbError)}`);
      }
      
      return { valid: false, issues };
    }
  }
}

export function createDatabaseInitializer(client: Client, databaseId: string): DatabaseInitializer {
  return new DatabaseInitializer(client, databaseId);
}

/**
 * Quick check function for use in app startup
 */
export async function quickDatabaseCheck(client: Client, databaseId: string): Promise<{
  ready: boolean;
  message: string;
  details?: any;
}> {
  try {
    DatabaseValidator.validateDatabaseId(databaseId);
    
    const initializer = new DatabaseInitializer(client, databaseId);
    const status = await RetryHandler.withRetry(
      () => initializer.getStatusReport(),
      { maxRetries: 2, delay: 1000 }
    );
    
    return {
      ready: status.status === 'complete',
      message: status.message,
      details: status.details
    };
  } catch (error: any) {
    const dbError = error instanceof DatabaseError 
      ? error 
      : DatabaseErrorHandler.parseAppwriteError(error, { operation: 'quickCheck' });
    
    DatabaseErrorHandler.logError(dbError, 'quickDatabaseCheck');
    
    return {
      ready: false,
      message: `Database check failed: ${DatabaseErrorHandler.getUserFriendlyMessage(dbError)}`,
      details: { error: dbError.message, code: dbError.code }
    };
  }
}

export { COLLECTION_SCHEMAS };
