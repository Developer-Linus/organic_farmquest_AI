/**
 * Story API Example Component
 * Demonstrates usage of the story API client with proper state management and error handling
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { storyApi } from '../lib/storyApi';
import {
  Story,
  StoryNode,
  StoryChoice,
  ApiClientError,
  NetworkError,
  ValidationError,
  ServerError,
} from '../lib/api-types';

// Component state interface
interface StoryApiExampleState {
  // Story creation
  topic: string;
  userId: string;
  currentStory: Story | null;
  
  // Story progression
  currentNode: StoryNode | null;
  storyHistory: StoryNode[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Progress tracking
  isStoryCompleted: boolean;
  isStoryWon: boolean;
}

/**
 * Example component demonstrating story API usage
 * Shows best practices for API integration in React Native
 */
export const StoryApiExample: React.FC = () => {
  // State management with proper typing
  const [state, setState] = useState<StoryApiExampleState>({
    topic: '',
    userId: '550e8400-e29b-41d4-a716-446655440000', // Example UUID
    currentStory: null,
    currentNode: null,
    storyHistory: [],
    isLoading: false,
    error: null,
    isStoryCompleted: false,
    isStoryWon: false,
  });

  /**
   * Updates state immutably
   * Helper function to maintain state consistency
   */
  const updateState = useCallback((updates: Partial<StoryApiExampleState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, []);

  /**
   * Handles story creation with comprehensive error handling
   * Demonstrates proper async/await usage with loading states
   */
  const handleCreateStory = useCallback(async () => {
    if (!state.topic.trim()) {
      Alert.alert('Validation Error', 'Please enter a story topic');
      return;
    }

    updateState({ isLoading: true, error: null });

    try {
      console.log('Creating story with topic:', state.topic);
      
      const story = await storyApi.createStory(state.topic, state.userId);
      
      // Find the root node to start the story
      const rootNode = story.nodes.find(node => node.is_root);
      
      if (!rootNode) {
        throw new Error('Story created but no root node found');
      }

      updateState({
        currentStory: story,
        currentNode: rootNode,
        storyHistory: [rootNode],
        isStoryCompleted: false,
        isStoryWon: false,
        error: null,
      });

      // Update progress to track story start
      await storyApi.updateProgress(story.story_id, rootNode.node_id);

      Alert.alert('Success', 'Story created successfully!');

    } catch (error) {
      console.error('Story creation failed:', error);
      
      const errorMessage = handleApiError(error);
      updateState({ error: errorMessage });
      
      Alert.alert('Error', errorMessage);
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.topic, state.userId, updateState]);

  /**
   * Handles story choice selection and node generation
   * Demonstrates dynamic story progression with proper state updates
   */
  const handleChoiceSelection = useCallback(async (choice: StoryChoice) => {
    if (!state.currentStory || !state.currentNode) {
      Alert.alert('Error', 'No active story or current node');
      return;
    }

    updateState({ isLoading: true, error: null });

    try {
      console.log('Generating next node for choice:', choice.id);
      
      const nextNode = await storyApi.generateStoryNode(
        state.currentStory.story_id,
        state.currentNode.node_id,
        choice.id
      );

      // Update story history and current node
      const newHistory = [...state.storyHistory, nextNode];
      
      updateState({
        currentNode: nextNode,
        storyHistory: newHistory,
        isStoryCompleted: nextNode.is_ending,
        isStoryWon: nextNode.is_winning_ending,
        error: null,
      });

      // Update progress in the backend
      await storyApi.updateProgress(
        state.currentStory.story_id,
        nextNode.node_id,
        nextNode.is_ending ? nextNode.is_winning_ending : undefined
      );

      // Show completion message if story ended
      if (nextNode.is_ending) {
        const message = nextNode.is_winning_ending 
          ? 'Congratulations! You completed the story successfully!' 
          : 'Story completed. Better luck next time!';
        
        Alert.alert('Story Complete', message);
      }

    } catch (error) {
      console.error('Choice selection failed:', error);
      
      const errorMessage = handleApiError(error);
      updateState({ error: errorMessage });
      
      Alert.alert('Error', errorMessage);
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.currentStory, state.currentNode, state.storyHistory, updateState]);

  /**
   * Resets the component to initial state
   * Useful for starting a new story
   */
  const handleReset = useCallback(() => {
    updateState({
      topic: '',
      currentStory: null,
      currentNode: null,
      storyHistory: [],
      isStoryCompleted: false,
      isStoryWon: false,
      error: null,
    });
  }, [updateState]);

  /**
   * Handles different types of API errors with appropriate user messages
   * Demonstrates proper error classification and user feedback
   */
  const handleApiError = (error: unknown): string => {
    if (error instanceof ValidationError) {
      return `Validation Error: ${error.message}`;
    }
    
    if (error instanceof NetworkError) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    if (error instanceof ServerError) {
      return `Server error (${error.statusCode}): ${error.message}`;
    }
    
    if (error instanceof ApiClientError) {
      return `API Error: ${error.message}`;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Story API Example</Text>
      
      {/* Error Display */}
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      )}

      {/* Story Creation Section */}
      {!state.currentStory && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create New Story</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter story topic (e.g., 'organic vegetable farming')"
            value={state.topic}
            onChangeText={(text) => updateState({ topic: text })}
            editable={!state.isLoading}
            multiline
          />
          
          <TextInput
            style={styles.input}
            placeholder="User ID (UUID format)"
            value={state.userId}
            onChangeText={(text) => updateState({ userId: text })}
            editable={!state.isLoading}
          />
          
          <TouchableOpacity
            style={[styles.button, state.isLoading && styles.buttonDisabled]}
            onPress={handleCreateStory}
            disabled={state.isLoading}
          >
            {state.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Story</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Story Display Section */}
      {state.currentStory && state.currentNode && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {state.currentStory.title}
          </Text>
          
          {/* Story Progress */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Node {state.storyHistory.length} • {state.isStoryCompleted ? 'Complete' : 'In Progress'}
            </Text>
            {state.isStoryCompleted && (
              <Text style={[styles.progressText, state.isStoryWon ? styles.winText : styles.loseText]}>
                {state.isStoryWon ? '🎉 Victory!' : '💔 Try Again'}
              </Text>
            )}
          </View>

          {/* Current Node Content */}
          <View style={styles.nodeContainer}>
            <Text style={styles.nodeContent}>{state.currentNode.content}</Text>
          </View>

          {/* Choices */}
          {!state.isStoryCompleted && state.currentNode.choices && (
            <View style={styles.choicesContainer}>
              <Text style={styles.choicesTitle}>Choose your action:</Text>
              {state.currentNode.choices.map((choice, index) => (
                <TouchableOpacity
                  key={choice.id}
                  style={[styles.choiceButton, state.isLoading && styles.buttonDisabled]}
                  onPress={() => handleChoiceSelection(choice)}
                  disabled={state.isLoading}
                >
                  <Text style={styles.choiceText}>
                    {index + 1}. {choice.text}
                  </Text>
                  {choice.points !== undefined && (
                    <Text style={styles.pointsText}>+{choice.points} pts</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Loading Indicator */}
          {state.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Generating next part...</Text>
            </View>
          )}

          {/* Reset Button */}
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Start New Story</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E7D32',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1B5E20',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FF5722',
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  winText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  loseText: {
    color: '#FF5722',
    fontWeight: '600',
  },
  nodeContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  nodeContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  choicesContainer: {
    marginBottom: 16,
  },
  choicesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1B5E20',
  },
  choiceButton: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  choiceText: {
    fontSize: 15,
    color: '#2E7D32',
    flex: 1,
  },
  pointsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default StoryApiExample;