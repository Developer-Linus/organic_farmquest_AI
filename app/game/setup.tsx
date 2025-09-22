import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Button, H1, H2, YStack, XStack, Card, RadioGroup, Input } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GAME_TOPICS, GAME_DIFFICULTIES, TOPIC_INFO, DIFFICULTY_INFO } from '../../src/constants';
import type { GameTopic, GameDifficulty } from '../../src/types';
import { useGame } from '../../src/contexts/GameContext';

export default function GameSetup() {
  const insets = useSafeAreaInsets();
  const { currentUser, isGuest, isLoading } = useGame();
  const [selectedTopic, setSelectedTopic] = useState<GameTopic>('vegetables');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GameDifficulty>('easy');
  const [customTopic, setCustomTopic] = useState<string>('');

  // Authentication guard
  useEffect(() => {
    if (isLoading) return; // Wait for auth state to be determined
    
    if (!currentUser || isGuest) {
      Alert.alert(
        'Authentication Required',
        'Please login or create an account to access the game setup.',
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
  }, [currentUser, isGuest, isLoading]);

  const handleStartGame = () => {
    // Double-check authentication before proceeding
    if (!currentUser || isGuest) {
      Alert.alert(
        'Authentication Required',
        'Please login to start the game.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
      return;
    }

    // Validate custom topic if selected
    if (selectedTopic === 'custom' && !customTopic.trim()) {
      Alert.alert(
        'Custom Topic Required',
        'Please enter a custom organic farming topic to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Navigate to game screen with selected parameters
    router.push({
      pathname: '/game/play',
      params: {
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        customTopic: selectedTopic === 'custom' ? customTopic.trim() : undefined,
      },
    });
  };

  const handleBack = () => {
    router.back();
  };

  // Show loading or return early if not authenticated
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!currentUser || isGuest) {
    return null; // The useEffect will handle the redirect
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
        colors={['#F0F8F0', '#FFFFFF', '#F8FDF8']}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <YStack flex={1} paddingHorizontal="$4" paddingVertical="$6" space="$6">
            {/* Header */}
            <YStack alignItems="center" space="$3">
              <View className="w-16 h-16 bg-primary-500 rounded-full items-center justify-center">
                <Text className="text-3xl">🎯</Text>
              </View>
              
              <H1 
                textAlign="center" 
                fontSize="$8" 
                fontWeight="bold"
                color="$primary-700"
                className="text-primary-700"
              >
                Choose Your Quest
              </H1>
              
              <Text 
                textAlign="center" 
                fontSize="$5" 
                color="$earth-600"
                className="text-earth-600 opacity-90"
                maxWidth={280}
              >
                Select a farming topic and difficulty level to begin your learning adventure
              </Text>
            </YStack>

            {/* Topic Selection */}
            <YStack space="$4">
              <H2 
                fontSize="$6" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                🌱 Choose Your Focus
              </H2>
              
              <RadioGroup
                value={selectedTopic}
                onValueChange={(value) => setSelectedTopic(value as GameTopic)}
              >
                <YStack space="$3">
                  {Object.values(GAME_TOPICS).map((topic) => (
                    <Card
                      key={topic}
                      className={`border-2 ${
                        selectedTopic === topic 
                          ? 'border-primary-400 bg-primary-50' 
                          : 'border-primary-200 bg-white'
                      }`}
                      padding="$4"
                      borderRadius="$4"
                      pressStyle={{ scale: 0.98 }}
                      onPress={() => setSelectedTopic(topic)}
                    >
                      <XStack alignItems="center" space="$3">
                        <RadioGroup.Item value={topic} id={topic}>
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        
                        <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                          <Text className="text-2xl">{TOPIC_INFO[topic].icon}</Text>
                        </View>
                        
                        <YStack flex={1}>
                          <Text className="text-lg font-semibold text-primary-700 capitalize">
                            {TOPIC_INFO[topic].name}
                          </Text>
                          <Text className="text-earth-600 opacity-80 text-sm">
                            {TOPIC_INFO[topic].description}
                          </Text>
                        </YStack>
                      </XStack>
                    </Card>
                  ))}
                </YStack>
              </RadioGroup>
              
              {/* Custom Topic Input */}
              {selectedTopic === 'custom' && (
                <YStack space="$2" marginTop="$3">
                  <Text className="text-base font-medium text-primary-700">
                    Enter your custom organic farming topic:
                  </Text>
                  <Input
                    placeholder="e.g., Mushroom cultivation, Aquaponics, Permaculture design..."
                    value={customTopic}
                    onChangeText={setCustomTopic}
                    backgroundColor="$background"
                    borderColor="$primary-300"
                    focusStyle={{
                      borderColor: '$primary-500',
                      backgroundColor: '$primary-50'
                    }}
                    padding="$3"
                    borderRadius="$3"
                    fontSize="$4"
                  />
                  <Text className="text-sm text-earth-600 opacity-80">
                    Be specific! The more detailed your topic, the better your learning experience.
                  </Text>
                </YStack>
              )}
            </YStack>

            {/* Difficulty Selection */}
            <YStack space="$4">
              <H2 
                fontSize="$6" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                ⚡ Choose Your Challenge
              </H2>
              
              <RadioGroup
                value={selectedDifficulty}
                onValueChange={(value) => setSelectedDifficulty(value as GameDifficulty)}
              >
                <YStack space="$3">
                  {Object.values(GAME_DIFFICULTIES).map((difficulty) => (
                    <Card
                      key={difficulty}
                      className={`border-2 ${
                        selectedDifficulty === difficulty 
                          ? 'border-accent-400 bg-accent-50' 
                          : 'border-primary-200 bg-white'
                      }`}
                      padding="$4"
                      borderRadius="$4"
                      pressStyle={{ scale: 0.98 }}
                      onPress={() => setSelectedDifficulty(difficulty)}
                    >
                      <XStack alignItems="center" space="$3">
                        <RadioGroup.Item value={difficulty} id={difficulty}>
                          <RadioGroup.Indicator />
                        </RadioGroup.Item>
                        
                        <View className="w-12 h-12 bg-accent-100 rounded-full items-center justify-center">
                          <Text className="text-2xl">{DIFFICULTY_INFO[difficulty].emoji}</Text>
                        </View>
                        
                        <YStack flex={1}>
                          <Text className="text-lg font-semibold text-primary-700 capitalize">
                            {DIFFICULTY_INFO[difficulty].name}
                          </Text>
                          <Text className="text-earth-600 opacity-80 text-sm">
                            {DIFFICULTY_INFO[difficulty].description}
                          </Text>
                        </YStack>
                      </XStack>
                    </Card>
                  ))}
                </YStack>
              </RadioGroup>
            </YStack>

            {/* Action Buttons */}
            <YStack space="$3" marginTop="$6">
              <Button
                size="$5"
                className="bg-primary-500 hover:bg-primary-600"
                borderRadius="$6"
                fontWeight="bold"
                fontSize="$5"
                onPress={handleStartGame}
                pressStyle={{ scale: 0.98 }}
                animation="bouncy"
              >
                <Text className="text-white font-bold text-lg">Start Adventure</Text>
              </Button>
              
              <Button
                size="$4"
                variant="outlined"
                className="border-earth-300 text-earth-600"
                borderRadius="$6"
                onPress={handleBack}
                pressStyle={{ scale: 0.98 }}
                animation="bouncy"
              >
                <Text className="text-earth-600 font-medium">Back</Text>
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}