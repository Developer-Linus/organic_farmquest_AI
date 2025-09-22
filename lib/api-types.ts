/**
 * API Types and Interfaces for Story Service Client
 * Defines all request/response types for the story API endpoints
 */

// Base API Response Structure
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// Error Response Structure
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Story API Request Types
export interface CreateStoryRequest {
  topic: string;
  userId: string;
}

export interface GenerateStoryNodeRequest {
  storyId: string;
  previousNodeId: string;
  choiceId: string;
}

export interface UpdateProgressRequest {
  storyId: string;
  currentNodeId: string;
  isWon?: boolean;
}

// Story API Response Types
export interface StoryChoice {
  choice_id: string;
  text: string;
  next_node: string;
}

export interface StoryNode {
  node_id: string;
  story_id: string;
  content: string;
  is_root: boolean;
  is_ending: boolean;
  is_winning_ending: boolean;
  choices: StoryChoice[];
}

export interface Story {
  story_id: string;
  title: string;
  nodes: StoryNode[];
  created_at?: string;
  updated_at?: string;
}

// User interface for database operations
export interface User {
  id: string;
  name: string;
  email: string;
  games_won: number;
}

export interface CreateStoryResponse extends ApiResponse<Story> {}

export interface GenerateStoryNodeResponse extends ApiResponse<StoryNode> {}

export interface UpdateProgressResponse extends ApiResponse<{ success: true }> {}

// API Client Configuration
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// HTTP Method Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request Options
export interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

// Custom Error Classes
export class ApiClientError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;
  public readonly timestamp: string;

  constructor(message: string, code: string = 'API_ERROR', details?: Record<string, any>) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export class NetworkError extends ApiClientError {
  constructor(message: string = 'Network request failed', details?: Record<string, any>) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiClientError {
  constructor(message: string = 'Request validation failed', details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class ServerError extends ApiClientError {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number, details?: Record<string, any>) {
    super(message, 'SERVER_ERROR', details);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}