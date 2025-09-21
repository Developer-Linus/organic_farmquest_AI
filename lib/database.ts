import { databases, db } from "./appwrite";
import { 
  UserSchema, 
  StorySchema, 
  StoryNodeSchema 
} from "../src/schemas";
import type { User, Story, StoryNode } from "../types/";

import { ID, Query } from "react-native-appwrite";

/**
 * DatabaseService
 * Wrapper for all Appwrite database operations
 */
export class DatabaseService {
  /**
   * Create a new user
   */
  async createUser(userData: Omit<User, "id">, userId?: string): Promise<User> {
    const id = userId || ID.unique();

    const validatedData = UserSchema.parse({
      ...userData,
      id,
    });

    try {
      // ✅ Prevent duplicate by email instead of ID
      const existingUsers = await databases.listDocuments(
        db.databaseId,
        db.collections.USERS,
        [Query.equal("email", validatedData.email)]
      );

      if (existingUsers.total > 0) {
        return UserSchema.parse(existingUsers.documents[0]);
      }

      // Remove id before insert (Appwrite will use it as $id)
      const { id: _, ...documentData } = validatedData;

      const response = await databases.createDocument(
        db.databaseId,
        db.collections.USERS,
        id,
        documentData
      );

      return UserSchema.parse(response);
    } catch (error: any) {
      console.error("Database createUser error:", error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  /**
   * Fetch user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await databases.getDocument(
        db.databaseId,
        db.collections.USERS,
        userId
      );
      return UserSchema.parse(response);
    } catch (error: any) {
      if (error.code === 404) return null;
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Create a new story
   */
  async createStory(storyData: Omit<Story, "story_id">): Promise<Story> {
    const validatedData = StorySchema.parse({
      ...storyData,
      story_id: ID.unique(),
    });

    try {
      const response = await databases.createDocument(
        db.databaseId,
        db.collections.STORIES,
        validatedData.story_id,
        validatedData
      );
      return StorySchema.parse(response);
    } catch (error: any) {
      throw new Error(`Failed to create story: ${error.message}`);
    }
  }

  /**
   * Get active stories for a user
   */
  async getActiveStoriesByUser(userId: string): Promise<Story[]> {
    try {
      const response = await databases.listDocuments(
        db.databaseId,
        db.collections.STORIES,
        [Query.equal("user_id", userId), Query.equal("status", "active")]
      );

      return response.documents.map((doc) => StorySchema.parse(doc));
    } catch (error: any) {
      throw new Error(`Failed to get active stories: ${error.message}`);
    }
  }

  /**
   * Get the starting node of a story
   */
  async getStoryStartNode(storyId: string): Promise<StoryNode> {
    try {
      const response = await databases.listDocuments(
        db.databaseId,
        db.collections.STORY_NODES,
        [Query.equal("story_id", storyId), Query.equal("is_root", true), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        throw new Error(`No starting node found for story ${storyId}`);
      }

      return StoryNodeSchema.parse(response.documents[0]);
    } catch (error: any) {
      throw new Error(`Failed to get story start node: ${error.message}`);
    }
  }

  /**
   * Get the next node given current node & choice
   */
  async getNextNode(currentNodeId: string, choiceId: string): Promise<StoryNode> {
    try {
      const currentNodeDoc = await databases.getDocument(
        db.databaseId,
        db.collections.STORY_NODES,
        currentNodeId
      );

      const currentNode = StoryNodeSchema.parse(currentNodeDoc);

      // ✅ Ensure choices is an array
      const choices = Array.isArray(currentNode.choices)
        ? currentNode.choices
        : JSON.parse(currentNode.choices || "[]");

      const selectedChoice = choices.find((choice: any) => choice.id === choiceId);

      if (!selectedChoice) {
        throw new Error(`Choice ${choiceId} not found in node ${currentNodeId}`);
      }

      const nextNodeDoc = await databases.getDocument(
        db.databaseId,
        db.collections.STORY_NODES,
        selectedChoice.next_node_id
      );

      return StoryNodeSchema.parse(nextNodeDoc);
    } catch (error: any) {
      throw new Error(`Failed to get next node: ${error.message}`);
    }
  }

  /**
   * Create a new story node
   */
  async createStoryNode(nodeData: Omit<StoryNode, "node_id">): Promise<StoryNode> {
    const validatedData = StoryNodeSchema.parse({
      ...nodeData,
      node_id: ID.unique(),
    });

    try {
      const response = await databases.createDocument(
        db.databaseId,
        db.collections.STORY_NODES,
        validatedData.node_id,
        validatedData
      );
      return StoryNodeSchema.parse(response);
    } catch (error: any) {
      throw new Error(`Failed to create story node: ${error.message}`);
    }
  }

  /**
   * Get story node by ID
   */
  async getStoryNodeById(nodeId: string): Promise<StoryNode | null> {
    try {
      const response = await databases.getDocument(
        db.databaseId,
        db.collections.STORY_NODES,
        nodeId
      );
      return StoryNodeSchema.parse(response);
    } catch (error: any) {
      if (error.code === 404) return null;
      throw new Error(`Failed to get story node: ${error.message}`);
    }
  }

  /**
   * Get all nodes for a story
   */
  async getStoryNodes(storyId: string): Promise<StoryNode[]> {
    try {
      const response = await databases.listDocuments(
        db.databaseId,
        db.collections.STORY_NODES,
        [Query.equal("story_id", storyId)]
      );

      return response.documents.map((doc) => StoryNodeSchema.parse(doc));
    } catch (error: any) {
      throw new Error(`Failed to get story nodes: ${error.message}`);
    }
  }
}

// Export a single shared instance
export const databaseService = new DatabaseService();
