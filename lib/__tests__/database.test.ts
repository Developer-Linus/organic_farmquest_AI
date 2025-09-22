import { databaseService } from '../database';
import { databases } from '../appwrite';
import { ID, Query } from 'react-native-appwrite';
import type { Story, StoryNode } from "../api-types";

// Define User type locally since it's not exported from api-types
interface User {
  id: string;
  name: string;
  email: string;
  games_won: number;
}

// Mock Appwrite
jest.mock('../appwrite');
jest.mock('react-native-appwrite');

const mockDatabases = databases as jest.Mocked<typeof databases>;
const mockID = ID as jest.Mocked<typeof ID>;
const mockQuery = Query as jest.Mocked<typeof Query>;

describe('Database Business Logic Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockID.unique.mockReturnValue('mock-unique-id');
    mockQuery.equal.mockReturnValue('mock-query-equal' as any);
    mockQuery.limit.mockReturnValue('mock-query-limit' as any);
    mockQuery.orderDesc.mockReturnValue('mock-query-order' as any);
  });

  describe('User Management Operations', () => {
    it('should successfully create new user with generated ID', async () => {
      const userData = {
        name: 'John Farmer',
        email: 'john@farmquest.com',
        games_won: 0,
      };

      const expectedUser = {
        id: 'mock-unique-id',
        ...userData,
      };

      // Mock no existing users
      mockDatabases.listDocuments.mockResolvedValue({
        total: 0,
        documents: [],
      } as any);

      mockDatabases.createDocument.mockResolvedValue(expectedUser as any);

      const result = await databaseService.createUser(userData);

      expect(result).toEqual(expectedUser);
      expect(mockDatabases.listDocuments).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        [expect.any(String)]
      );
      expect(mockDatabases.createDocument).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'mock-unique-id',
        userData
      );
    });

    it('should return existing user when email already exists', async () => {
      const userData = {
        name: 'Jane Farmer',
        email: 'jane@farmquest.com',
        games_won: 5,
      };

      const existingUser = {
        id: 'existing-user-id',
        ...userData,
      };

      // Mock existing user found
      mockDatabases.listDocuments.mockResolvedValue({
        total: 1,
        documents: [existingUser],
      } as any);

      const result = await databaseService.createUser(userData);

      expect(result).toEqual(existingUser);
      expect(mockDatabases.createDocument).not.toHaveBeenCalled();
    });

    it('should successfully create user with custom ID', async () => {
      const userData = {
        name: 'Custom User',
        email: 'custom@farmquest.com',
        games_won: 3,
      };
      const customId = 'custom-user-id';

      const expectedUser = {
        id: customId,
        ...userData,
      };

      mockDatabases.listDocuments.mockResolvedValue({
        total: 0,
        documents: [],
      } as any);

      mockDatabases.createDocument.mockResolvedValue(expectedUser as any);

      const result = await databaseService.createUser(userData, customId);

      expect(result).toEqual(expectedUser);
      expect(mockDatabases.createDocument).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        customId,
        userData
      );
    });

    it('should successfully retrieve user by ID', async () => {
      const userId = 'test-user-id';
      const expectedUser = {
        id: userId,
        name: 'Test User',
        email: 'test@farmquest.com',
        games_won: 10,
      };

      mockDatabases.getDocument.mockResolvedValue(expectedUser as any);

      const result = await databaseService.getUserById(userId);

      expect(result).toEqual(expectedUser);
      expect(mockDatabases.getDocument).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        userId
      );
    });

    it('should return null when user not found', async () => {
      const userId = 'non-existent-user';

      mockDatabases.getDocument.mockRejectedValue({ code: 404 });

      const result = await databaseService.getUserById(userId);

      expect(result).toBeNull();
    });
  });

  describe('Story Management Operations', () => {
    it('should successfully create new story with generated ID', async () => {
      const storyData = {
        title: 'Vegetable Garden Adventure',
        nodes: [],
        created_at: new Date().toISOString(),
      };

      const expectedStory = {
        story_id: 'mock-unique-id',
        ...storyData,
      };

      mockDatabases.createDocument.mockResolvedValue(expectedStory as any);

      const result = await databaseService.createStory(storyData);

      expect(result).toEqual(expectedStory);
      expect(mockDatabases.createDocument).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'mock-unique-id',
        expectedStory
      );
    });

    it('should successfully retrieve active stories for user', async () => {
      const userId = 'test-user-id';
      const activeStories = [
        {
          story_id: 'story-1',
          title: 'Herb Garden Quest',
          nodes: [],
          created_at: new Date().toISOString(),
        },
        {
          story_id: 'story-2',
          title: 'Fruit Orchard Adventure',
          nodes: [],
          created_at: new Date().toISOString(),
        },
      ];

      mockDatabases.listDocuments.mockResolvedValue({
        total: 2,
        documents: activeStories,
      } as any);

      const result = await databaseService.getActiveStoriesByUser(userId);

      expect(result).toEqual(activeStories);
      expect(mockDatabases.listDocuments).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Array)
      );
    });

    it('should successfully get story start node', async () => {
      const storyId = 'test-story-id';
      const startNode = {
        node_id: 'root-node-id',
        story_id: storyId,
        content: 'Welcome to your farming adventure!',
        is_root: true,
        is_ending: false,
        is_winning_ending: false,
        choices: [
          { choice_id: 'choice-1', text: 'Start planting vegetables', next_node: 'node-2' },
          { choice_id: 'choice-2', text: 'Prepare the soil first', next_node: 'node-3' },
        ],
      };

      mockDatabases.listDocuments.mockResolvedValue({
        total: 1,
        documents: [startNode],
      } as any);

      const result = await databaseService.getStoryStartNode(storyId);

      expect(result).toEqual(startNode);
      expect(result.is_root).toBe(true);
      expect(result.choices).toHaveLength(2);
    });

    it('should successfully get next node based on choice', async () => {
      const currentNodeId = 'current-node-id';
      const choiceId = 'choice-1';
      const nextNode = {
        node_id: 'next-node-id',
        story_id: 'test-story-id',
        content: 'You decided to start planting vegetables...',
        is_root: false,
        is_ending: false,
        is_winning_ending: false,
        choices: [
          { choice_id: 'choice-3', text: 'Plant tomatoes', next_node: 'node-4' },
          { choice_id: 'choice-4', text: 'Plant carrots', next_node: 'node-5' },
        ],
      };

      mockDatabases.listDocuments.mockResolvedValue({
        total: 1,
        documents: [nextNode],
      } as any);

      const result = await databaseService.getNextNode(currentNodeId, choiceId);

      expect(result).toEqual(nextNode);
      expect(result.is_root).toBe(false);
      expect(result.choices).toHaveLength(2);
    });
  });

  describe('Story Node Operations', () => {
    it('should successfully create story node with generated ID', async () => {
      const nodeData = {
        story_id: 'test-story-id',
        content: 'Your vegetables are growing well!',
        is_root: false,
        is_ending: false,
        is_winning_ending: false,
        choices: [
          { choice_id: 'choice-5', text: 'Water the plants', next_node: 'node-6' },
          { choice_id: 'choice-6', text: 'Add fertilizer', next_node: 'node-7' },
        ],
      };

      const expectedNode = {
        node_id: 'mock-unique-id',
        ...nodeData,
      };

      mockDatabases.createDocument.mockResolvedValue(expectedNode as any);

      const result = await databaseService.createStoryNode(nodeData);

      expect(result).toEqual(expectedNode);
      expect(mockDatabases.createDocument).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        'mock-unique-id',
        expectedNode
      );
    });

    it('should successfully retrieve story node by ID', async () => {
      const nodeId = 'test-node-id';
      const expectedNode = {
        node_id: nodeId,
        story_id: 'test-story-id',
        content: 'The harvest is ready!',
        is_root: false,
        is_ending: true,
        is_winning_ending: true,
        choices: [],
      };

      mockDatabases.getDocument.mockResolvedValue(expectedNode as any);

      const result = await databaseService.getStoryNodeById(nodeId);

      expect(result).toEqual(expectedNode);
      expect(result?.is_ending).toBe(true);
      expect(result?.is_winning_ending).toBe(true);
      expect(result?.choices).toHaveLength(0);
    });

    it('should return null when story node not found', async () => {
      const nodeId = 'non-existent-node';

      mockDatabases.getDocument.mockRejectedValue({ code: 404 });

      const result = await databaseService.getStoryNodeById(nodeId);

      expect(result).toBeNull();
    });

    it('should successfully retrieve all nodes for a story', async () => {
      const storyId = 'test-story-id';
      const storyNodes = [
        {
          node_id: 'node-1',
          story_id: storyId,
          content: 'Root node content',
          is_root: true,
          is_ending: false,
          is_winning_ending: false,
          choices: [{ choice_id: 'choice-1', text: 'Start farming', next_node: 'node-2' }],
        },
        {
          node_id: 'node-2',
          story_id: storyId,
          content: 'Middle node content',
          is_root: false,
          is_ending: false,
          is_winning_ending: false,
          choices: [{ choice_id: 'choice-2', text: 'Continue farming', next_node: 'node-3' }],
        },
        {
          node_id: 'node-3',
          story_id: storyId,
          content: 'Ending node content',
          is_root: false,
          is_ending: true,
          is_winning_ending: true,
          choices: [],
        },
      ];

      mockDatabases.listDocuments.mockResolvedValue({
        total: 3,
        documents: storyNodes,
      } as any);

      const result = await databaseService.getStoryNodes(storyId);

      expect(result).toEqual(storyNodes);
      expect(result).toHaveLength(3);
      expect(result[0].is_root).toBe(true);
      expect(result[2].is_ending).toBe(true);
    });
  });

  describe('Business Logic Integration', () => {
    it('should handle complete story creation workflow', async () => {
      const storyData = {
        title: 'Complete Farm Adventure',
        nodes: [],
        created_at: new Date().toISOString(),
      };

      const rootNodeData = {
        story_id: 'mock-unique-id',
        content: 'Welcome to your farm!',
        is_root: true,
        is_ending: false,
        is_winning_ending: false,
        choices: [
          { choice_id: 'choice-1', text: 'Plant crops', next_node: 'node-2' },
          { choice_id: 'choice-2', text: 'Raise animals', next_node: 'node-3' },
        ],
      };

      const expectedStory = {
        story_id: 'mock-unique-id',
        ...storyData,
      };

      const expectedRootNode = {
        node_id: 'mock-unique-id',
        ...rootNodeData,
      };

      mockDatabases.createDocument
        .mockResolvedValueOnce(expectedStory as any)
        .mockResolvedValueOnce(expectedRootNode as any);

      // Create story
      const story = await databaseService.createStory(storyData);
      expect(story).toEqual(expectedStory);

      // Create root node
      const rootNode = await databaseService.createStoryNode(rootNodeData);
      expect(rootNode).toEqual(expectedRootNode);
      expect(rootNode.is_root).toBe(true);
      expect(rootNode.choices).toHaveLength(2);
    });

    it('should handle user progression tracking', async () => {
      const userId = 'progression-user-id';
      const initialUser = {
        id: userId,
        name: 'Progress Tracker',
        email: 'progress@farmquest.com',
        games_won: 0,
      };

      const updatedUser = {
        ...initialUser,
        games_won: 1,
      };

      // Initial user creation
      mockDatabases.listDocuments.mockResolvedValue({
        total: 0,
        documents: [],
      } as any);
      mockDatabases.createDocument.mockResolvedValue(initialUser as any);

      const createdUser = await databaseService.createUser({
        name: initialUser.name,
        email: initialUser.email,
        games_won: initialUser.games_won,
      }, userId);

      expect(createdUser.games_won).toBe(0);

      // Simulate game completion and user update
      mockDatabases.getDocument.mockResolvedValue(updatedUser as any);

      const retrievedUser = await databaseService.getUserById(userId);
      expect(retrievedUser?.games_won).toBe(1);
    });

    it('should handle story node navigation flow', async () => {
      const storyId = 'navigation-story-id';
      
      // Root node
      const rootNode = {
        node_id: 'root-node',
        story_id: storyId,
        content: 'Choose your farming path',
        is_root: true,
        is_ending: false,
        is_winning_ending: false,
        choices: [
          { choice_id: 'vegetables', text: 'Grow vegetables', next_node: 'vegetable-node' },
          { choice_id: 'fruits', text: 'Grow fruits', next_node: 'fruit-node' },
        ],
      };

      // Next node after choice
      const vegetableNode = {
        node_id: 'vegetable-node',
        story_id: storyId,
        content: 'You chose to grow vegetables!',
        is_root: false,
        is_ending: false,
        is_winning_ending: false,
        choices: [
          { choice_id: 'tomatoes', text: 'Plant tomatoes', next_node: 'winning-node' },
          { choice_id: 'carrots', text: 'Plant carrots', next_node: 'losing-node' },
        ],
      };

      // Winning end node
      const winningNode = {
        node_id: 'winning-node',
        story_id: storyId,
        content: 'Congratulations! Your farm is thriving!',
        is_root: false,
        is_ending: true,
        is_winning_ending: true,
        choices: [],
      };

      // Mock the navigation flow
      mockDatabases.listDocuments
        .mockResolvedValueOnce({ total: 1, documents: [rootNode] } as any)
        .mockResolvedValueOnce({ total: 1, documents: [vegetableNode] } as any)
        .mockResolvedValueOnce({ total: 1, documents: [winningNode] } as any);

      // Get start node
      const startNode = await databaseService.getStoryStartNode(storyId);
      expect(startNode.is_root).toBe(true);
      expect(startNode.choices).toHaveLength(2);

      // Navigate to next node
      const nextNode = await databaseService.getNextNode('root-node', 'vegetables');
      expect(nextNode.content).toContain('vegetables');
      expect(nextNode.choices).toHaveLength(2);

      // Navigate to winning node
      const finalNode = await databaseService.getNextNode('vegetable-node', 'tomatoes');
      expect(finalNode.is_ending).toBe(true);
      expect(finalNode.is_winning_ending).toBe(true);
      expect(finalNode.choices).toHaveLength(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle database connection errors gracefully', async () => {
      const userData = {
        name: 'Error Test User',
        email: 'error@farmquest.com',
        games_won: 0,
      };

      mockDatabases.listDocuments.mockRejectedValue(new Error('Database connection failed'));

      await expect(databaseService.createUser(userData)).rejects.toThrow('Failed to create user');
    });

    it('should handle story creation with validation', async () => {
      const validStoryData = {
        title: 'Valid Story Title',
        nodes: [],
        created_at: new Date().toISOString(),
      };

      const expectedStory = {
        story_id: 'mock-unique-id',
        ...validStoryData,
      };

      mockDatabases.createDocument.mockResolvedValue(expectedStory as any);

      const result = await databaseService.createStory(validStoryData);

      expect(result.title).toBe(validStoryData.title);
      expect(result.story_id).toBe('mock-unique-id');
      expect(Array.isArray(result.nodes)).toBe(true);
    });
  });
});