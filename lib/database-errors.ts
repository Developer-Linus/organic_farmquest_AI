/**
 * Custom error classes for database operations
 */

export class DatabaseError extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code: string = 'DATABASE_ERROR', details?: any) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.details = details;
  }
}

export class CollectionNotFoundError extends DatabaseError {
  constructor(collectionId: string) {
    super(
      `Collection '${collectionId}' not found. Please run database initialization.`,
      'COLLECTION_NOT_FOUND',
      { collectionId }
    );
    this.name = 'CollectionNotFoundError';
  }
}

export class CollectionCreationError extends DatabaseError {
  constructor(collectionId: string, originalError: any) {
    super(
      `Failed to create collection '${collectionId}': ${originalError.message}`,
      'COLLECTION_CREATION_FAILED',
      { collectionId, originalError }
    );
    this.name = 'CollectionCreationError';
  }
}

export class AttributeCreationError extends DatabaseError {
  constructor(collectionId: string, attributeKey: string, originalError: any) {
    super(
      `Failed to create attribute '${attributeKey}' in collection '${collectionId}': ${originalError.message}`,
      'ATTRIBUTE_CREATION_FAILED',
      { collectionId, attributeKey, originalError }
    );
    this.name = 'AttributeCreationError';
  }
}

export class IndexCreationError extends DatabaseError {
  constructor(collectionId: string, indexKey: string, originalError: any) {
    super(
      `Failed to create index '${indexKey}' in collection '${collectionId}': ${originalError.message}`,
      'INDEX_CREATION_FAILED',
      { collectionId, indexKey, originalError }
    );
    this.name = 'IndexCreationError';
  }
}

export class ValidationError extends DatabaseError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class PermissionError extends DatabaseError {
  constructor(operation: string) {
    super(
      `Insufficient permissions to perform operation: ${operation}. Please check your API key permissions.`,
      'PERMISSION_ERROR',
      { operation }
    );
    this.name = 'PermissionError';
  }
}

export class NetworkError extends DatabaseError {
  constructor(originalError: any) {
    super(
      `Network error during database operation: ${originalError.message}`,
      'NETWORK_ERROR',
      { originalError }
    );
    this.name = 'NetworkError';
  }
}

/**
 * Error handler utility functions
 */
export class DatabaseErrorHandler {
  /**
   * Parse Appwrite error and convert to appropriate custom error
   */
  static parseAppwriteError(error: any, context?: { operation?: string; collectionId?: string; attributeKey?: string; indexKey?: string }): DatabaseError {
    const message = error.message || 'Unknown database error';
    const code = error.code || error.status;

    // Handle specific Appwrite error codes
    switch (code) {
      case 404:
        if (context?.collectionId) {
          return new CollectionNotFoundError(context.collectionId);
        }
        return new DatabaseError(message, 'NOT_FOUND', error);

      case 401:
      case 403:
        return new PermissionError(context?.operation || 'database operation');

      case 409:
        if (message.includes('already exists')) {
          return new DatabaseError(
            `Resource already exists: ${message}`,
            'RESOURCE_EXISTS',
            error
          );
        }
        return new DatabaseError(message, 'CONFLICT', error);

      case 400:
        return new ValidationError(message, error);

      case 500:
      case 502:
      case 503:
      case 504:
        return new DatabaseError(
          `Server error: ${message}`,
          'SERVER_ERROR',
          error
        );

      default:
        // Check for network-related errors
        if (error.name === 'NetworkError' || message.includes('network') || message.includes('fetch')) {
          return new NetworkError(error);
        }

        // Check for specific operation errors
        if (context?.operation === 'createCollection') {
          return new CollectionCreationError(context.collectionId || 'unknown', error);
        }
        if (context?.operation === 'createAttribute') {
          return new AttributeCreationError(
            context.collectionId || 'unknown',
            context.attributeKey || 'unknown',
            error
          );
        }
        if (context?.operation === 'createIndex') {
          return new IndexCreationError(
            context.collectionId || 'unknown',
            context.indexKey || 'unknown',
            error
          );
        }

        return new DatabaseError(message, 'UNKNOWN_ERROR', error);
    }
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: DatabaseError): string {
    switch (error.code) {
      case 'COLLECTION_NOT_FOUND':
        return 'Database setup incomplete. Please contact support or try refreshing the app.';
      
      case 'PERMISSION_ERROR':
        return 'Access denied. Please check your account permissions.';
      
      case 'NETWORK_ERROR':
        return 'Connection problem. Please check your internet connection and try again.';
      
      case 'VALIDATION_ERROR':
        return 'Invalid data provided. Please check your input and try again.';
      
      case 'SERVER_ERROR':
        return 'Server temporarily unavailable. Please try again in a few moments.';
      
      case 'RESOURCE_EXISTS':
        return 'This resource already exists. No action needed.';
      
      case 'COLLECTION_CREATION_FAILED':
      case 'ATTRIBUTE_CREATION_FAILED':
      case 'INDEX_CREATION_FAILED':
        return 'Database setup failed. Please contact support for assistance.';
      
      default:
        return 'An unexpected error occurred. Please try again or contact support.';
    }
  }

  /**
   * Check if error is recoverable (user can retry)
   */
  static isRecoverable(error: DatabaseError): boolean {
    const recoverableCodes = [
      'NETWORK_ERROR',
      'SERVER_ERROR',
      'VALIDATION_ERROR'
    ];
    return recoverableCodes.includes(error.code);
  }

  /**
   * Check if error requires immediate attention (critical)
   */
  static isCritical(error: DatabaseError): boolean {
    const criticalCodes = [
      'COLLECTION_NOT_FOUND',
      'PERMISSION_ERROR',
      'COLLECTION_CREATION_FAILED',
      'ATTRIBUTE_CREATION_FAILED',
      'INDEX_CREATION_FAILED'
    ];
    return criticalCodes.includes(error.code);
  }

  /**
   * Log error with appropriate level
   */
  static logError(error: DatabaseError, context?: string): void {
    const logData = {
      name: error.name,
      code: error.code,
      message: error.message,
      details: error.details,
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack
    };

    if (this.isCritical(error)) {
      console.error('🚨 Critical Database Error:', logData);
    } else if (this.isRecoverable(error)) {
      console.warn('⚠️ Recoverable Database Error:', logData);
    } else {
      console.error('❌ Database Error:', logData);
    }
  }
}

/**
 * Retry utility for database operations
 */
export class RetryHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    options: {
      maxRetries?: number;
      delay?: number;
      backoff?: boolean;
      retryCondition?: (error: any) => boolean;
    } = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      delay = 1000,
      backoff = true,
      retryCondition = (error) => DatabaseErrorHandler.isRecoverable(error)
    } = options;

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry on last attempt or if error is not recoverable
        if (attempt === maxRetries || !retryCondition(error)) {
          break;
        }

        // Calculate delay with optional backoff
        const currentDelay = backoff ? delay * Math.pow(2, attempt) : delay;
        
        console.warn(`Database operation failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${currentDelay}ms...`, error);
        
        await new Promise(resolve => setTimeout(resolve, currentDelay));
      }
    }

    throw lastError;
  }
}

/**
 * Validation utilities
 */
export class DatabaseValidator {
  /**
   * Validate collection ID format
   */
  static validateCollectionId(collectionId: string): void {
    if (!collectionId || typeof collectionId !== 'string') {
      throw new ValidationError('Collection ID must be a non-empty string');
    }
    
    if (collectionId.length < 1 || collectionId.length > 36) {
      throw new ValidationError('Collection ID must be between 1 and 36 characters');
    }
    
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(collectionId)) {
      throw new ValidationError('Collection ID contains invalid characters');
    }
  }

  /**
   * Validate attribute configuration
   */
  static validateAttribute(attribute: any): void {
    if (!attribute || typeof attribute !== 'object') {
      throw new ValidationError('Attribute must be an object');
    }
    
    if (!attribute.key || typeof attribute.key !== 'string') {
      throw new ValidationError('Attribute key must be a non-empty string');
    }
    
    const validTypes = ['string', 'integer', 'boolean', 'datetime'];
    if (!validTypes.includes(attribute.type)) {
      throw new ValidationError(`Attribute type must be one of: ${validTypes.join(', ')}`);
    }
    
    if (attribute.type === 'string' && attribute.size && (attribute.size < 1 || attribute.size > 1073741824)) {
      throw new ValidationError('String attribute size must be between 1 and 1073741824');
    }
  }

  /**
   * Validate index configuration
   */
  static validateIndex(index: any): void {
    if (!index || typeof index !== 'object') {
      throw new ValidationError('Index must be an object');
    }
    
    if (!index.key || typeof index.key !== 'string') {
      throw new ValidationError('Index key must be a non-empty string');
    }
    
    const validTypes = ['key', 'unique', 'fulltext'];
    if (!validTypes.includes(index.type)) {
      throw new ValidationError(`Index type must be one of: ${validTypes.join(', ')}`);
    }
    
    if (!Array.isArray(index.attributes) || index.attributes.length === 0) {
      throw new ValidationError('Index must have at least one attribute');
    }
  }
}