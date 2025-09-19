import { z } from 'zod';

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates data against a Zod schema and throws ValidationError on failure
 */
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessage = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    throw new ValidationError(`Validation failed: ${errorMessage}`, result.error.errors);
  }
  return result.data;
};

/**
 * Validates data against a Zod schema and returns result with success flag
 */
export const safeValidate = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessage = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    return {
      success: false,
      error: errorMessage
    };
  }
  return {
    success: true,
    data: result.data
  };
};

/**
 * Validates form data and returns formatted errors for UI display
 */
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): {
  isValid: boolean;
  data?: T;
  fieldErrors?: Record<string, string>;
  generalError?: string;
} => {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    let generalError: string | undefined;
    
    result.error.errors.forEach(err => {
      if (err.path.length > 0) {
        const fieldName = err.path.join('.');
        fieldErrors[fieldName] = err.message;
      } else {
        generalError = err.message;
      }
    });
    
    return {
      isValid: false,
      fieldErrors: Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined,
      generalError
    };
  }
  
  return {
    isValid: true,
    data: result.data
  };
};