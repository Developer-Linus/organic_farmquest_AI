/**
 * Error Handling Utilities
 * Provides comprehensive error management for the React Native application
 */

import { ApiClientError, NetworkError, ValidationError, ServerError } from './api-types';

/**
 * Error severity levels for logging and user feedback
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error categories for better error classification
 */
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

/**
 * Enhanced error information for logging and debugging
 */
export interface ErrorInfo {
  category: ErrorCategory;
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage: string;
  shouldRetry: boolean;
  retryAfter?: number; // seconds
  context?: Record<string, any>;
}

/**
 * Error classification utility
 * Analyzes errors and provides structured information for handling
 */
export class ErrorClassifier {
  /**
   * Classifies an error and returns structured error information
   * @param error - The error to classify
   * @param context - Additional context for error analysis
   * @returns Structured error information
   */
  static classify(error: unknown, context?: Record<string, any>): ErrorInfo {
    // Handle custom API errors
    if (error instanceof ValidationError) {
      return {
        category: ErrorCategory.VALIDATION,
        severity: ErrorSeverity.LOW,
        userMessage: 'Please check your input and try again.',
        technicalMessage: error.message,
        shouldRetry: false,
        context,
      };
    }

    if (error instanceof NetworkError) {
      return {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'Network connection issue. Please check your internet and try again.',
        technicalMessage: error.message,
        shouldRetry: true,
        retryAfter: 5,
        context,
      };
    }

    if (error instanceof ServerError) {
      const severity = error.statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM;
      const shouldRetry = error.statusCode >= 500 || error.statusCode === 429;
      
      return {
        category: ErrorCategory.SERVER,
        severity,
        userMessage: this.getServerErrorMessage(error.statusCode),
        technicalMessage: `Server error ${error.statusCode}: ${error.message}`,
        shouldRetry,
        retryAfter: error.statusCode === 429 ? 30 : 10,
        context,
      };
    }

    if (error instanceof ApiClientError) {
      return {
        category: ErrorCategory.CLIENT,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'Something went wrong. Please try again.',
        technicalMessage: error.message,
        shouldRetry: true,
        retryAfter: 5,
        context,
      };
    }

    // Handle standard JavaScript errors
    if (error instanceof TypeError) {
      return {
        category: ErrorCategory.CLIENT,
        severity: ErrorSeverity.HIGH,
        userMessage: 'An unexpected error occurred. Please restart the app.',
        technicalMessage: error.message,
        shouldRetry: false,
        context,
      };
    }

    if (error instanceof Error) {
      // Check for specific error patterns
      if (error.message.includes('fetch')) {
        return {
          category: ErrorCategory.NETWORK,
          severity: ErrorSeverity.MEDIUM,
          userMessage: 'Network error. Please check your connection.',
          technicalMessage: error.message,
          shouldRetry: true,
          retryAfter: 5,
          context,
        };
      }

      if (error.message.includes('timeout')) {
        return {
          category: ErrorCategory.NETWORK,
          severity: ErrorSeverity.MEDIUM,
          userMessage: 'Request timed out. Please try again.',
          technicalMessage: error.message,
          shouldRetry: true,
          retryAfter: 10,
          context,
        };
      }

      return {
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.MEDIUM,
        userMessage: 'An unexpected error occurred.',
        technicalMessage: error.message,
        shouldRetry: true,
        retryAfter: 5,
        context,
      };
    }

    // Handle unknown error types
    return {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.HIGH,
      userMessage: 'An unexpected error occurred. Please restart the app.',
      technicalMessage: String(error),
      shouldRetry: false,
      context,
    };
  }

  /**
   * Gets user-friendly message for server error status codes
   * @param statusCode - HTTP status code
   * @returns User-friendly error message
   */
  private static getServerErrorMessage(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Our team has been notified.';
      case 502:
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      case 504:
        return 'Request timed out. Please try again.';
      default:
        return 'Server error. Please try again later.';
    }
  }
}

/**
 * Error logging utility for debugging and monitoring
 */
export class ErrorLogger {
  private static isDevelopment = __DEV__;

  /**
   * Logs error information with appropriate level
   * @param errorInfo - Structured error information
   * @param originalError - Original error object
   */
  static log(errorInfo: ErrorInfo, originalError?: unknown): void {
    const logData = {
      timestamp: new Date().toISOString(),
      category: errorInfo.category,
      severity: errorInfo.severity,
      userMessage: errorInfo.userMessage,
      technicalMessage: errorInfo.technicalMessage,
      shouldRetry: errorInfo.shouldRetry,
      retryAfter: errorInfo.retryAfter,
      context: errorInfo.context,
      stack: originalError instanceof Error ? originalError.stack : undefined,
    };

    // Console logging for development
    if (this.isDevelopment) {
      switch (errorInfo.severity) {
        case ErrorSeverity.LOW:
          console.info('🔵 Error (Low):', logData);
          break;
        case ErrorSeverity.MEDIUM:
          console.warn('🟡 Error (Medium):', logData);
          break;
        case ErrorSeverity.HIGH:
          console.error('🟠 Error (High):', logData);
          break;
        case ErrorSeverity.CRITICAL:
          console.error('🔴 Error (Critical):', logData);
          break;
      }
    }

    // In production, you would send this to your logging service
    // Example: Sentry, LogRocket, Crashlytics, etc.
    if (!this.isDevelopment && errorInfo.severity !== ErrorSeverity.LOW) {
      this.sendToLoggingService(logData);
    }
  }

  /**
   * Sends error data to external logging service
   * @param logData - Structured log data
   */
  private static sendToLoggingService(logData: any): void {
    // Implementation would depend on your logging service
    // Example implementations:
    
    // Sentry
    // Sentry.captureException(logData);
    
    // Custom logging endpoint
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(logData),
    // }).catch(() => {
    //   // Silently fail to avoid infinite error loops
    // });
    
    console.log('📤 Would send to logging service:', logData);
  }
}

/**
 * Retry utility for handling retryable errors
 */
export class RetryHandler {
  /**
   * Executes a function with retry logic
   * @param fn - Function to execute
   * @param maxRetries - Maximum number of retry attempts
   * @param baseDelay - Base delay between retries in milliseconds
   * @param backoffMultiplier - Multiplier for exponential backoff
   * @returns Promise resolving to function result
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: unknown;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Check if error is retryable
        const errorInfo = ErrorClassifier.classify(error);
        if (!errorInfo.shouldRetry) {
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = baseDelay * Math.pow(backoffMultiplier, attempt);
        const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
        const totalDelay = delay + jitter;
        
        console.log(`🔄 Retrying in ${Math.round(totalDelay)}ms (attempt ${attempt + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, totalDelay));
      }
    }
    
    throw lastError;
  }
}

/**
 * Global error handler for unhandled errors
 */
export class GlobalErrorHandler {
  private static isInitialized = false;

  /**
   * Initializes global error handling
   */
  static initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Handle unhandled promise rejections
    if (typeof global !== 'undefined' && global.process) {
      global.process.on?.('unhandledRejection', (reason: any) => {
        const errorInfo = ErrorClassifier.classify(reason, {
          type: 'unhandledRejection',
        });
        
        ErrorLogger.log(errorInfo, reason);
        
        // In development, you might want to show an alert
        if (__DEV__) {
          console.error('🚨 Unhandled Promise Rejection:', reason);
        }
      });
    }

    // Handle uncaught exceptions (React Native specific)
    if (typeof ErrorUtils !== 'undefined') {
      const originalHandler = ErrorUtils.getGlobalHandler();
      
      ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
        const errorInfo = ErrorClassifier.classify(error, {
          type: 'uncaughtException',
          isFatal,
        });
        
        ErrorLogger.log(errorInfo, error);
        
        // Call original handler to maintain default behavior
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }

    this.isInitialized = true;
    console.log('✅ Global error handler initialized');
  }
}

/**
 * Utility functions for common error handling patterns
 */
export const ErrorUtils = {
  /**
   * Safely executes an async function and handles errors
   * @param fn - Async function to execute
   * @param context - Additional context for error logging
   * @returns Promise resolving to result or null on error
   */
  async safeAsync<T>(
    fn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      const errorInfo = ErrorClassifier.classify(error, context);
      ErrorLogger.log(errorInfo, error);
      return null;
    }
  },

  /**
   * Creates a user-friendly error message from any error
   * @param error - Error to convert
   * @returns User-friendly error message
   */
  getUserMessage(error: unknown): string {
    const errorInfo = ErrorClassifier.classify(error);
    return errorInfo.userMessage;
  },

  /**
   * Checks if an error is retryable
   * @param error - Error to check
   * @returns True if error should be retried
   */
  isRetryable(error: unknown): boolean {
    const errorInfo = ErrorClassifier.classify(error);
    return errorInfo.shouldRetry;
  },

  /**
   * Gets recommended retry delay for an error
   * @param error - Error to analyze
   * @returns Retry delay in seconds, or null if not retryable
   */
  getRetryDelay(error: unknown): number | null {
    const errorInfo = ErrorClassifier.classify(error);
    return errorInfo.shouldRetry ? (errorInfo.retryAfter || 5) : null;
  },
};

// Initialize global error handling
GlobalErrorHandler.initialize();