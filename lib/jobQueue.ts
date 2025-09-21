import { databaseService } from './database';
import { aiService } from './ai';
import type { GameTopic, GameDifficulty } from '../src/types';

// Job types
export type JobType = 'generate_story_start' | 'generate_next_node' | 'generate_feedback' | 'generate_summary';

export interface JobData {
  type: JobType;
  storyId?: string;
  userId?: string;
  topic?: GameTopic;
  difficulty?: GameDifficulty;
  currentNodeId?: string;
  selectedChoiceId?: string;
  userChoice?: string;
  storyHistory?: string;
  finalOutcome?: 'won' | 'lost';
}

export interface Job {
  id: string;
  type: JobType;
  data: JobData;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  result?: any;
  retryCount: number;
  maxRetries: number;
}

class JobQueue {
  private jobs: Map<string, Job> = new Map();
  private processing: Set<string> = new Set();
  private isRunning: boolean = false;
  private concurrency: number = 3; // Process up to 3 jobs simultaneously
  private pollInterval: number = 1000; // Check for new jobs every second

  constructor() {
    this.startProcessing();
  }

  // Add a new job to the queue
  async addJob(data: JobData, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<string> {
    const jobId = this.generateJobId();
    
    const job: Job = {
      id: jobId,
      type: data.type,
      data,
      status: 'pending',
      priority,
      createdAt: new Date(),
      retryCount: 0,
      maxRetries: 3,
    };

    this.jobs.set(jobId, job);

    // Store job in database for persistence
    try {
      await databaseService.createStoryJob({
        story_id: data.storyId || 'system',
        status: 'pending',
        ai_prompt: this.getJobDescription(job),
        generated_content: null,
        completed_at: null,
      });
    } catch (error) {
      console.error('Failed to persist job to database:', error);
    }

    console.log(`Job ${jobId} added to queue with priority ${priority}`);
    return jobId;
  }

  // Get job status
  getJobStatus(jobId: string): Job | null {
    return this.jobs.get(jobId) || null;
  }

  // Get all jobs for a story
  getStoryJobs(storyId: string): Job[] {
    return Array.from(this.jobs.values()).filter(job => job.data.storyId === storyId);
  }

  // Cancel a job
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'processing' || job.status === 'completed') {
      return false;
    }

    job.status = 'failed';
    job.error = 'Job cancelled by user';
    job.completedAt = new Date();
    
    return true;
  }

  // Start processing jobs
  private startProcessing(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.processJobs();
  }

  // Main job processing loop
  private async processJobs(): Promise<void> {
    while (this.isRunning) {
      try {
        // Get pending jobs sorted by priority and creation time
        const pendingJobs = this.getPendingJobs();
        
        // Process jobs up to concurrency limit
        const availableSlots = this.concurrency - this.processing.size;
        const jobsToProcess = pendingJobs.slice(0, availableSlots);

        for (const job of jobsToProcess) {
          this.processJob(job);
        }

        // Clean up completed jobs older than 1 hour
        this.cleanupOldJobs();

      } catch (error) {
        console.error('Error in job processing loop:', error);
      }

      // Wait before next iteration
      await this.sleep(this.pollInterval);
    }
  }

  // Get pending jobs sorted by priority
  private getPendingJobs(): Job[] {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    
    return Array.from(this.jobs.values())
      .filter(job => job.status === 'pending')
      .sort((a, b) => {
        // Sort by priority first, then by creation time
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  }

  // Process a single job
  private async processJob(job: Job): Promise<void> {
    if (this.processing.has(job.id)) return;

    this.processing.add(job.id);
    job.status = 'processing';
    job.startedAt = new Date();

    console.log(`Processing job ${job.id} (${job.type})`);

    try {
      let result: any;

      switch (job.type) {
        case 'generate_story_start':
          result = await this.processStoryStartJob(job);
          break;
        case 'generate_next_node':
          result = await this.processNextNodeJob(job);
          break;
        case 'generate_feedback':
          result = await this.processFeedbackJob(job);
          break;
        case 'generate_summary':
          result = await this.processSummaryJob(job);
          break;
        default:
          throw new Error(`Unknown job type: ${job.type}`);
      }

      job.result = result;
      job.status = 'completed';
      job.completedAt = new Date();

      console.log(`Job ${job.id} completed successfully`);

    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.retryCount++;

      if (job.retryCount < job.maxRetries) {
        // Retry the job
        job.status = 'pending';
        job.startedAt = undefined;
        console.log(`Job ${job.id} will be retried (attempt ${job.retryCount + 1}/${job.maxRetries})`);
      } else {
        // Max retries reached
        job.status = 'failed';
        job.completedAt = new Date();
        console.log(`Job ${job.id} failed permanently after ${job.maxRetries} attempts`);
      }
    } finally {
      this.processing.delete(job.id);
    }
  }

  // Process story start generation job
  private async processStoryStartJob(job: Job): Promise<any> {
    const { topic, difficulty } = job.data;
    if (!topic || !difficulty) {
      throw new Error('Missing topic or difficulty for story start job');
    }

    return await aiService.generateStoryStart(topic, difficulty);
  }

  // Process next node generation job
  private async processNextNodeJob(job: Job): Promise<any> {
    const { topic, difficulty, storyHistory, userChoice, selectedChoiceId } = job.data;
    if (!topic || !difficulty || !storyHistory || !userChoice) {
      throw new Error('Missing required data for next node job');
    }

    // Determine if choice was correct (simplified logic)
    const isCorrectChoice = selectedChoiceId?.includes('correct') || false;

    return await aiService.generateNextNode(
      topic,
      difficulty,
      storyHistory,
      userChoice,
      isCorrectChoice
    );
  }

  // Process feedback generation job
  private async processFeedbackJob(job: Job): Promise<any> {
    const { topic, difficulty, userChoice } = job.data;
    if (!topic || !difficulty || !userChoice) {
      throw new Error('Missing required data for feedback job');
    }

    return await aiService.generateChoiceFeedback(topic, difficulty, userChoice, true);
  }

  // Process summary generation job
  private async processSummaryJob(job: Job): Promise<any> {
    const { topic, difficulty, storyHistory, finalOutcome } = job.data;
    if (!topic || !difficulty || !storyHistory || !finalOutcome) {
      throw new Error('Missing required data for summary job');
    }

    return await aiService.generateStorySummary(topic, difficulty, storyHistory, finalOutcome);
  }

  // Generate unique job ID
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get job description for logging
  private getJobDescription(job: Job): string {
    switch (job.type) {
      case 'generate_story_start':
        return `Generate story start for ${job.data.topic} (${job.data.difficulty})`;
      case 'generate_next_node':
        return `Generate next node after choice: ${job.data.userChoice}`;
      case 'generate_feedback':
        return `Generate feedback for choice: ${job.data.userChoice}`;
      case 'generate_summary':
        return `Generate story summary (${job.data.finalOutcome})`;
      default:
        return `Unknown job type: ${job.type}`;
    }
  }

  // Clean up old completed jobs
  private cleanupOldJobs(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    for (const [jobId, job] of this.jobs.entries()) {
      if (
        (job.status === 'completed' || job.status === 'failed') &&
        job.completedAt &&
        job.completedAt < oneHourAgo
      ) {
        this.jobs.delete(jobId);
      }
    }
  }

  // Utility sleep function
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Stop processing (for cleanup)
  stop(): void {
    this.isRunning = false;
  }

  // Get queue statistics
  getStats(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    const jobs = Array.from(this.jobs.values());
    
    return {
      total: jobs.length,
      pending: jobs.filter(j => j.status === 'pending').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
    };
  }
}

// Export singleton instance
export const jobQueue = new JobQueue();

// Utility functions for common job operations
export const jobUtils = {
  // Queue a story start generation
  async queueStoryStart(
    userId: string,
    topic: GameTopic,
    difficulty: GameDifficulty,
    priority: 'low' | 'medium' | 'high' = 'high'
  ): Promise<string> {
    return await jobQueue.addJob({
      type: 'generate_story_start',
      userId,
      topic,
      difficulty,
    }, priority);
  },

  // Queue a next node generation
  async queueNextNode(
    storyId: string,
    topic: GameTopic,
    difficulty: GameDifficulty,
    currentNodeId: string,
    selectedChoiceId: string,
    userChoice: string,
    storyHistory: string,
    priority: 'low' | 'medium' | 'high' = 'high'
  ): Promise<string> {
    return await jobQueue.addJob({
      type: 'generate_next_node',
      storyId,
      topic,
      difficulty,
      currentNodeId,
      selectedChoiceId,
      userChoice,
      storyHistory,
    }, priority);
  },

  // Queue feedback generation
  async queueFeedback(
    storyId: string,
    topic: GameTopic,
    difficulty: GameDifficulty,
    userChoice: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<string> {
    return await jobQueue.addJob({
      type: 'generate_feedback',
      storyId,
      topic,
      difficulty,
      userChoice,
    }, priority);
  },

  // Queue summary generation
  async queueSummary(
    storyId: string,
    topic: GameTopic,
    difficulty: GameDifficulty,
    storyHistory: string,
    finalOutcome: 'won' | 'lost',
    priority: 'low' | 'medium' | 'high' = 'low'
  ): Promise<string> {
    return await jobQueue.addJob({
      type: 'generate_summary',
      storyId,
      topic,
      difficulty,
      storyHistory,
      finalOutcome,
    }, priority);
  },

  // Wait for job completion
  async waitForJob(jobId: string, timeoutMs: number = 30000): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const job = jobQueue.getJobStatus(jobId);
      
      if (!job) {
        throw new Error(`Job ${jobId} not found`);
      }
      
      if (job.status === 'completed') {
        return job.result;
      }
      
      if (job.status === 'failed') {
        throw new Error(`Job ${jobId} failed: ${job.error}`);
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    throw new Error(`Job ${jobId} timed out after ${timeoutMs}ms`);
  },
};