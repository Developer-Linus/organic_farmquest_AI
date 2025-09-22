import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Button, H2, YStack, XStack, Card, Spinner } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { GameTopic, GameDifficulty, Story, StoryChoice, StoryNode, GameSession } from '../../src/types';
import { useGame } from '../../src/contexts/GameContext';
import { GAME_CONFIG } from '../../src/constants';
import { StoryApiService } from '../../lib/storyApi';
import { ApiClientError, NetworkError, ValidationError } from '../../lib/api-types';

export default function PlayScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    topic: GameTopic;
    difficulty: GameDifficulty;
    customTopic?: string;
  }>();

  const { currentUser, isGuest, authLoading } = useGame();
  
  // Game state
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [storyCount, setStoryCount] = useState(1);
  const [storyHistory, setStoryHistory] = useState<Array<{id: string, choice: string, points: number}>>([]);

  // Authentication check
  useEffect(() => {
    if (!authLoading && (!currentUser || isGuest)) {
      Alert.alert(
        'Authentication Required',
        'Please login or create an account to play the game.',
        [
          {
            text: 'Login',
            onPress: () => router.replace('/auth/login'),
            style: 'default'
          },
          {
            text: 'Create Account',
            onPress: () => router.replace('/auth/register'),
            style: 'default'
          },
          {
            text: 'Go Back',
            onPress: () => router.replace('/(tabs)'),
            style: 'cancel'
          }
        ]
      );
    }
  }, [currentUser, isGuest, authLoading]);

  useEffect(() => {
    if (currentUser && !isGuest) {
      initializeGame();
    }
  }, [currentUser, isGuest]);

  const initializeGame = async () => {
    const topic = params.customTopic || params.topic;
    if (!topic) {
      handleApiError(new Error('No topic provided'), 'No topic provided');
      return;
    }

    setIsLoading(true);
    try {
      // Get user ID from GameContext - use authenticated user or fallback to temp user
      const userId = currentUser?.id || 'temp-user-' + Date.now();
      
      const storyApiService = new StoryApiService();
      const story = await storyApiService.createStory(topic, userId);
      
      if (!story || !story.nodes || story.nodes.length === 0) {
        throw new Error('Invalid story structure received');
      }

      // Find the root node
      const rootNode = story.nodes.find(node => node.is_root);
      if (!rootNode) {
        throw new Error('No root node found in story');
      }
      
      setCurrentStory(story);
      setCurrentNode(rootNode);
      
      // Create game session
      const session: GameSession = {
        story_id: story.story_id,
        user_id: userId,
        topic: topic,
        status: 'active',
        current_node_id: rootNode.node_id,
        is_won: false,
        score: 0
      };
      setGameSession(session);
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      handleApiError(error, 'Failed to start the game');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSelect = async (choice: StoryChoice) => {
    if (!currentStory || !currentNode || !gameSession) return;
    
    setSelectedChoice(choice.choice_id);
    setIsLoading(true);
    
    try {
      // Calculate new score
      const newScore = score + (choice.points || 0);
      setScore(newScore);
      
      // Add to story history
      const historyEntry = {
        id: currentNode.node_id,
        choice: choice.text,
        points: choice.points || 0
      };
      setStoryHistory(prev => [...prev, historyEntry]);
      
      // Generate next story node
      const storyApiService = new StoryApiService();
      const nextNode = await storyApiService.generateStoryNode(
        currentStory.story_id,
        currentNode.node_id,
        choice.choice_id
      );
      
      // Update current node
      setCurrentNode(nextNode);
      
      // Update game session
      const updatedSession: GameSession = {
        ...gameSession,
        current_node_id: nextNode.node_id,
        is_won: nextNode.is_winning_ending,
        score: newScore
      };
      setGameSession(updatedSession);
      
      // Check if game should end
      if (nextNode.is_ending) {
        setTimeout(() => {
          handleGameComplete(newScore, nextNode.is_winning_ending);
        }, 1000);
      } else {
        setStoryCount(prev => prev + 1);
      }
      
    } catch (error) {
      console.error('Failed to process choice:', error);
      handleApiError(error, 'Failed to process your choice');
    } finally {
      setIsLoading(false);
      setSelectedChoice(null);
    }
  };

  const handleGameComplete = (finalScore: number, isWon: boolean) => {
    // Navigate to completion screen with results
    router.replace({
      pathname: '/game/complete',
      params: {
        score: finalScore.toString(),
        maxScore: (GAME_CONFIG.MAX_STORIES * GAME_CONFIG.MAX_SCORE_PER_STORY).toString(),
        topic: params.topic,
        difficulty: params.difficulty,
        customTopic: params.customTopic,
        storiesCompleted: storyCount.toString(),
        isWon: isWon.toString()
      }
    });
  };

  const handleApiError = (error: unknown, fallbackMessage: string) => {
    let errorMessage = fallbackMessage;
    
    if (error instanceof ValidationError) {
      errorMessage = `Validation Error: ${error.message}`;
    } else if (error instanceof NetworkError) {
      errorMessage = 'Network connection failed. Please check your internet connection.';
    } else if (error instanceof ApiClientError) {
      errorMessage = `API Error: ${error.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    Alert.alert('Error', errorMessage, [
      {
        text: 'Try Again',
        onPress: () => {
          if (!currentStory) {
            initializeGame();
          }
        }
      },
      {
        text: 'Go Back',
        onPress: () => router.replace('/(tabs)'),
        style: 'cancel'
      }
    ]);
  };

  const handleQuit = () => {
    Alert.alert(
      'End Adventure?',
      'Are you sure you want to end your farming journey?',
      [
        {
          text: 'Continue Playing',
          style: 'cancel'
        },
        {
          text: 'End Game',
          style: 'destructive',
          onPress: () => router.replace('/(tabs)')
        }
      ]
    );
  };

  // Loading state
  if (isLoading && !currentNode) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LinearGradient
          colors={['#4ade80', '#22c55e', '#16a34a']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <YStack space="$4" alignItems="center">
          <Spinner size="large" color="white" />
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
            Creating your farming adventure...
          </Text>
        </YStack>
      </View>
    );
  }

  // Main game interface
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <LinearGradient
        colors={['#4ade80', '#22c55e', '#16a34a']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <YStack space="$4">
          {/* Header */}
          <XStack justifyContent="space-between" alignItems="center">
            <YStack>
              <H2 color="white" fontWeight="bold">
                🌱 Farm Quest
              </H2>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                {params.customTopic || params.topic} • {params.difficulty}
              </Text>
            </YStack>
            <YStack alignItems="flex-end">
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                Score: {score}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                Story {storyCount}
              </Text>
            </YStack>
          </XStack>

          {/* Story Content */}
          {currentNode && (
            <Card
              backgroundColor="rgba(255,255,255,0.95)"
              padding="$4"
              borderRadius="$4"
              shadowColor="rgba(0,0,0,0.1)"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.25}
              shadowRadius={3.84}
              elevation={5}
            >
              <YStack space="$4">
                <Text style={{ 
                  fontSize: 16, 
                  lineHeight: 24, 
                  color: '#374151',
                  textAlign: 'justify'
                }}>
                  {currentNode.content}
                </Text>

                {/* Choices */}
                <YStack space="$3">
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '600', 
                    color: '#6b7280',
                    marginBottom: 8
                  }}>
                    What would you like to do?
                  </Text>
                  
                  {currentNode.choices.map((choice, index) => (
                    <Button
                      key={choice.choice_id}
                      onPress={() => handleChoiceSelect(choice)}
                      disabled={isLoading}
                      backgroundColor={selectedChoice === choice.choice_id ? '#16a34a' : '#f3f4f6'}
                      borderColor={selectedChoice === choice.choice_id ? '#16a34a' : '#d1d5db'}
                      borderWidth={1}
                      padding="$3"
                      borderRadius="$3"
                      pressStyle={{ 
                        backgroundColor: '#e5e7eb',
                        transform: [{ scale: 0.98 }]
                      }}
                    >
                      <XStack justifyContent="space-between" alignItems="center" width="100%">
                        <Text style={{ 
                          color: selectedChoice === choice.choice_id ? 'white' : '#374151',
                          fontSize: 14,
                          fontWeight: '500',
                          flex: 1,
                          textAlign: 'left'
                        }}>
                          {String.fromCharCode(65 + index)}. {choice.text}
                        </Text>
                        {choice.points && (
                          <Text style={{ 
                            color: selectedChoice === choice.choice_id ? 'rgba(255,255,255,0.8)' : '#6b7280',
                            fontSize: 12,
                            fontWeight: '600',
                            marginLeft: 8
                          }}>
                            +{choice.points}
                          </Text>
                        )}
                      </XStack>
                    </Button>
                  ))}
                </YStack>

                {/* Loading indicator for choice processing */}
                {isLoading && selectedChoice && (
                  <XStack justifyContent="center" alignItems="center" space="$2">
                    <Spinner size="small" color="#16a34a" />
                    <Text style={{ color: '#6b7280', fontSize: 14 }}>
                      Processing your choice...
                    </Text>
                  </XStack>
                )}
              </YStack>
            </Card>
          )}

          {/* Action Buttons */}
          <XStack space="$3" justifyContent="center">
            <Button
              onPress={handleQuit}
              backgroundColor="rgba(239, 68, 68, 0.9)"
              color="white"
              borderRadius="$3"
              paddingHorizontal="$4"
              pressStyle={{ 
                backgroundColor: 'rgba(220, 38, 38, 0.9)',
                transform: [{ scale: 0.98 }]
              }}
            >
              End Game
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </View>
  );
}