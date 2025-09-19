import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Button, H2, YStack, XStack, Card, Spinner } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { GameTopic, GameDifficulty, Story, StoryChoice } from '../../src/types';

// Mock story data - in real app, this would come from AI API
const mockStory: Story = {
  id: '1',
  content: `You stand at the edge of your new organic farm, the morning sun casting long shadows across the fertile soil. The previous owner left behind some conventional farming equipment and a small greenhouse that needs repair.

Your neighbor approaches with a friendly smile. "Welcome to the valley!" she says. "I've been farming organically here for 15 years. The soil is rich, but there are some challenges you should know about."

She points to different areas of your land: "That section over there has been treated with synthetic fertilizers for years. The greenhouse could be perfect for starting seedlings, but it needs some work. And see those weeds? They're actually beneficial - some farmers would spray them, but they can help your soil if managed properly."

What's your first priority as you begin your organic farming journey?`,
  choices: [
    {
      id: 'choice1',
      text: 'Focus on soil restoration and testing the previously treated area',
      points: 25,
      consequence: 'You discover the soil needs time to recover, but you\'re building a strong foundation for future crops.'
    },
    {
      id: 'choice2', 
      text: 'Repair the greenhouse to start growing seedlings immediately',
      points: 20,
      consequence: 'The greenhouse becomes your controlled environment for nurturing young plants, giving you a head start.'
    },
    {
      id: 'choice3',
      text: 'Learn about the beneficial weeds and how to manage them naturally',
      points: 30,
      consequence: 'You gain valuable knowledge about companion planting and natural pest control methods.'
    }
  ],
  topic: 'vegetables',
  difficulty: 'easy'
};

export default function GamePlay() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ topic: GameTopic; difficulty: GameDifficulty }>();
  
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [storyCount, setStoryCount] = useState(1);

  useEffect(() => {
    loadStory();
  }, []);

  const loadStory = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real app, this would be an API call to generate story based on params
      setCurrentStory(mockStory);
    } catch (error) {
      Alert.alert('Error', 'Failed to load story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSelect = (choice: StoryChoice) => {
    setSelectedChoice(choice.id);
    setScore(prev => prev + choice.points);
    
    // Show consequence and continue to next story
    Alert.alert(
      'Great Choice!',
      choice.consequence,
      [
        {
          text: 'Continue',
          onPress: () => {
            setStoryCount(prev => prev + 1);
            setSelectedChoice(null);
            loadStory(); // Load next story
          }
        }
      ]
    );
  };

  const handleQuit = () => {
    Alert.alert(
      'End Adventure?',
      'Are you sure you want to end your farming journey?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Game', 
          style: 'destructive',
          onPress: () => router.push('/') 
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary-50">
        <LinearGradient
          colors={['#F0F8F0', '#FFFFFF', '#F8FDF8']}
          className="flex-1 w-full justify-center items-center"
        >
          <YStack alignItems="center" space="$4">
            <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center">
              <Text className="text-4xl">🌱</Text>
            </View>
            <Spinner size="large" color="$primary-500" />
            <Text className="text-lg font-medium text-primary-700">
              Generating your farming story...
            </Text>
            <Text className="text-earth-600 opacity-80 text-center max-w-xs">
              Our AI is crafting a unique organic farming scenario just for you
            </Text>
          </YStack>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View 
      className="flex-1"
      style={{ 
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <LinearGradient
        colors={['#F8FDF8', '#FFFFFF', '#F0F8F0']}
        className="flex-1"
      >
        {/* Header */}
        <XStack 
          justifyContent="space-between" 
          alignItems="center" 
          paddingHorizontal="$4" 
          paddingVertical="$3"
          className="border-b border-primary-200"
        >
          <YStack>
            <Text className="text-sm font-medium text-earth-600 opacity-80">
              Story {storyCount} • {params.topic} • {params.difficulty}
            </Text>
            <Text className="text-lg font-bold text-primary-700">
              Score: {score} points
            </Text>
          </YStack>
          
          <Button
            size="$3"
            variant="outlined"
            className="border-earth-300 text-earth-600"
            onPress={handleQuit}
          >
            <Text className="text-earth-600">End Game</Text>
          </Button>
        </XStack>

        <ScrollView className="flex-1">
          <YStack flex={1} paddingHorizontal="$4" paddingVertical="$6" space="$6">
            {/* Story Content */}
            <Card 
              className="bg-white border-primary-200" 
              padding="$5" 
              borderRadius="$6"
              shadowColor="$primary-300"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
            >
              <YStack space="$4">
                <XStack alignItems="center" space="$3">
                  <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                    <Text className="text-2xl">📖</Text>
                  </View>
                  <H2 
                    fontSize="$6" 
                    fontWeight="600"
                    color="$primary-700"
                    className="text-primary-700"
                  >
                    Your Farming Story
                  </H2>
                </XStack>
                
                <Text 
                  className="text-story-base leading-story text-earth-700"
                  fontSize="$4"
                  lineHeight="$6"
                >
                  {currentStory?.content}
                </Text>
              </YStack>
            </Card>

            {/* Choices */}
            <YStack space="$4">
              <H2 
                fontSize="$6" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                🤔 What will you do?
              </H2>
              
              <YStack space="$3">
                {currentStory?.choices.map((choice, index) => (
                  <Card
                    key={choice.id}
                    className={`border-2 ${
                      selectedChoice === choice.id 
                        ? 'border-accent-400 bg-accent-50' 
                        : 'border-primary-200 bg-white hover:border-primary-300'
                    }`}
                    padding="$4"
                    borderRadius="$5"
                    pressStyle={{ scale: 0.98 }}
                    onPress={() => handleChoiceSelect(choice)}
                    disabled={selectedChoice !== null}
                  >
                    <XStack alignItems="center" space="$3">
                      <View className="w-10 h-10 bg-accent-100 rounded-full items-center justify-center">
                        <Text className="text-lg font-bold text-accent-600">
                          {String.fromCharCode(65 + index)}
                        </Text>
                      </View>
                      
                      <YStack flex={1}>
                        <Text className="text-base font-medium text-primary-700 leading-5">
                          {choice.text}
                        </Text>
                        <Text className="text-sm text-accent-600 font-medium mt-1">
                          +{choice.points} points
                        </Text>
                      </YStack>
                    </XStack>
                  </Card>
                ))}
              </YStack>
            </YStack>

            {/* Progress Indicator */}
            <Card 
              className="bg-primary-50 border-primary-200" 
              padding="$4" 
              borderRadius="$5"
            >
              <XStack alignItems="center" justifyContent="center" space="$2">
                <Text className="text-2xl">🌱</Text>
                <Text className="text-primary-700 font-medium">
                  Growing your organic farming knowledge...
                </Text>
              </XStack>
            </Card>
          </YStack>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}