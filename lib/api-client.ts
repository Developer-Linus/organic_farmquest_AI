/**
 * Core API Client for React Native
 * Provides a robust, type-safe HTTP client with proper error handling
 */

import {
  ApiClientConfig,
  ApiResponse,
  RequestOptions,
  HttpMethod,
  ApiClientError,
  NetworkError,
  ValidationError,
  ServerError,
} from './api-types';

/**
 * Core API Client Class
 * Handles HTTP requests with proper error handling, timeouts, and response parsing
 */
export class ApiClient {
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 10000, // 10 seconds default timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...config,
    };
  }

  /**
   * Makes an HTTP request with comprehensive error handling
   * 
   * @param endpoint - The API endpoint (relative to baseUrl)
   * @param options - Request options including method, headers, and body
   * @returns Promise<T> - Parsed response data
   * 
   * Why comprehensive error handling:
   * - Provides consistent error classification across the app
   * - Enables proper retry logic and user feedback
   * - Maintains type safety throughout the request lifecycle
   */
  async request<T = any>(endpoint: string, options: RequestOptions): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const timeout = options.timeout || this.config.timeout;

    // Merge headers with defaults
    const headers = {
      ...this.config.headers,
      ...options.headers,
    };

    // Prepare request body
    const body = options.body ? JSON.stringify(options.body) : undefined;

    try {
      // Create abort controller for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: options.method,
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        await this.handleHttpError(response);
      }

      // Parse and validate response
      const data = await this.parseResponse<T>(response);
      return data;

    } catch (error) {
      this.handleRequestError(error, { url, method: options.method });
      throw error; // Re-throw after handling
    }
  }

  /**
   * Convenience method for GET requests
   */
  async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  /**
   * Convenience method for POST requests
   */
  async post<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers });
  }

  /**
   * Convenience method for PATCH requests
   */
  async patch<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers });
  }

  /**
   * Convenience method for PUT requests
   */
  async put<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers });
  }

  /**
   * Convenience method for DELETE requests
   */
  async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  /**
   * Parses response based on content type
   * Private method to handle different response formats
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      const jsonData = await response.json();
      
      // Handle API response wrapper format
      if (this.isApiResponse(jsonData)) {
        if (!jsonData.success && jsonData.error) {
          throw new ServerError(jsonData.error, response.status, jsonData);
        }
        return jsonData.data || jsonData;
      }
      
      return jsonData;
    }

    // Handle text responses
    if (contentType?.includes('text/')) {
      return (await response.text()) as unknown as T;
    }

    // Default to JSON parsing
    try {
      return await response.json();
    } catch {
      return (await response.text()) as unknown as T;
    }
  }

  /**
   * Type guard to check if response follows ApiResponse format
   */
  private isApiResponse(data: any): data is ApiResponse {
    return typeof data === 'object' && data !== null && 'success' in data;
  }

  /**
   * Handles HTTP error responses
   * Private method for consistent error handling
   */
  private async handleHttpError(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetails: Record<string, any> = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
      if (errorData.error) {
        errorMessage = errorData.error;
      }
      errorDetails = { ...errorDetails, ...errorData };
    } catch {
      // If we can't parse error response, use default message
    }

    // Classify errors by status code
    if (response.status >= 400 && response.status < 500) {
      if (response.status === 400) {
        throw new ValidationError(errorMessage, errorDetails);
      }
      throw new ApiClientError(errorMessage, 'CLIENT_ERROR', errorDetails);
    }

    if (response.status >= 500) {
      throw new ServerError(errorMessage, response.status, errorDetails);
    }

    throw new ApiClientError(errorMessage, 'HTTP_ERROR', errorDetails);
  }

  /**
   * Handles request-level errors (network, timeout, etc.)
   * Private method for consistent error classification
   */
  private handleRequestError(
    error: unknown,
    context: { url: string; method: HttpMethod }
  ): void {
    console.error('API request failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      context,
      timestamp: new Date().toISOString(),
    });

    // Don't re-wrap our custom errors
    if (error instanceof ApiClientError) {
      return;
    }

    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new NetworkError('Request timeout', context);
      }
      
      if (error.message.includes('Network request failed') || 
          error.message.includes('fetch')) {
        throw new NetworkError(error.message, context);
      }
    }

    // Default to generic API error
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Unknown request error',
      'REQUEST_ERROR',
      context
    );
  }

  /**
   * Updates the base configuration
   * Useful for changing base URL or default headers
   */
  updateConfig(newConfig: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Gets current configuration (read-only)
   */
  getConfig(): Readonly<Required<ApiClientConfig>> {
    return { ...this.config };
  }
}

/**
 * Default API client instance
 * Can be configured based on environment variables or app settings
 */
export const createApiClient = (config?: Partial<ApiClientConfig>): ApiClient => {
  const defaultConfig: ApiClientConfig = {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  return new ApiClient({ ...defaultConfig, ...config });
};

// Export a default instance for convenience
export const apiClient = createApiClient();

/**
 * Updates the API client with authentication headers
 * Should be called after user login to include auth token in requests
 */
export const setAuthToken = (token: string) => {
  apiClient.updateConfig({
    headers: {
      ...apiClient.getConfig().headers,
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Removes authentication headers from API client
 * Should be called after user logout
 */
export const clearAuthToken = () => {
  const config = apiClient.getConfig();
  const { Authorization, ...headersWithoutAuth } = config.headers;
  
  apiClient.updateConfig({
    headers: headersWithoutAuth,
  });
};