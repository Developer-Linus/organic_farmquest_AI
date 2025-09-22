import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, H1, H2, YStack, XStack, Card } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GAME_CONFIG, TOPIC_INFO } from '../../src/constants';
import type { GameTopic, GameDifficulty } from '../../src/types';

export default function GameComplete() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ 
    score: string; 
    topic: GameTopic; 
    difficulty: GameDifficulty;
    storiesCompleted: string;
    customTopic?: string;
  }>();

  const score = parseInt(params.score || '0');
  const storiesCompleted = parseInt(params.storiesCompleted || '0');
  const maxScore = GAME_CONFIG.MAX_STORIES * GAME_CONFIG.MAX_SCORE_PER_STORY;
  const scorePercentage = Math.round((score / maxScore) * 100);

  const getPerformanceData = () => {
    if (score >= GAME_CONFIG.SCORE_THRESHOLDS.EXCELLENT) {
      return {
        level: 'Excellent',
        emoji: '🏆',
        color: '$green-600',
        bgColor: '$green-50',
        borderColor: '$green-200',
        message: 'Outstanding! You\'ve mastered organic farming principles and made excellent decisions throughout your journey.',
        badge: 'Master Farmer'
      };
    } else if (score >= GAME_CONFIG.SCORE_THRESHOLDS.GOOD) {
      return {
        level: 'Good',
        emoji: '🥈',
        color: '$blue-600',
        bgColor: '$blue-50',
        borderColor: '$blue-200',
        message: 'Well done! You\'ve shown good understanding of organic farming practices with room for improvement.',
        badge: 'Skilled Farmer'
      };
    } else if (score >= GAME_CONFIG.SCORE_THRESHOLDS.FAIR) {
      return {
        level: 'Fair',
        emoji: '🥉',
        color: '$orange-600',
        bgColor: '$orange-50',
        borderColor: '$orange-200',
        message: 'Not bad! You\'ve learned some organic farming basics, but there\'s more to discover.',
        badge: 'Learning Farmer'
      };
    } else {
      return {
        level: 'Needs Improvement',
        emoji: '🌱',
        color: '$gray-600',
        bgColor: '$gray-50',
        borderColor: '$gray-200',
        message: 'Keep learning! Organic farming takes practice, and every farmer starts somewhere.',
        badge: 'Novice Farmer'
      };
    }
  };

  const performance = getPerformanceData();
  const topicInfo = params.topic === 'custom' 
    ? { 
        name: params.customTopic || 'Custom Topic', 
        icon: '🌱', 
        description: 'Your custom organic farming topic' 
      }
    : TOPIC_INFO[params.topic as keyof typeof TOPIC_INFO];

  return (
    <View 
      className="flex-1 bg-gradient-to-b from-primary-50 to-white"
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
        <ScrollView className="flex-1">
          <YStack flex={1} paddingHorizontal="$4" paddingVertical="$6" space="$6">
            {/* Header */}
            <YStack alignItems="center" space="$4">
              <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center">
                <Text className="text-6xl">{performance.emoji}</Text>
              </View>
              
              <YStack alignItems="center" space="$2">
                <H1 
                  fontSize="$8" 
                  fontWeight="700"
                  color={performance.color}
                  textAlign="center"
                >
                  Game Complete!
                </H1>
                <Text 
                  fontSize="$6" 
                  fontWeight="600"
                  color={performance.color}
                  className="text-center"
                >
                  {performance.level} Performance
                </Text>
              </YStack>
            </YStack>

            {/* Performance Badge */}
            <Card 
              className={`border-2`}
              style={{ 
                backgroundColor: performance.bgColor,
                borderColor: performance.borderColor 
              }}
              padding="$4" 
              borderRadius="$6"
            >
              <YStack alignItems="center" space="$3">
                <Text 
                  fontSize="$5" 
                  fontWeight="600"
                  color={performance.color}
                >
                  🎖️ {performance.badge}
                </Text>
                <Text 
                  fontSize="$4" 
                  textAlign="center"
                  color="$gray-700"
                  lineHeight="$5"
                >
                  {performance.message}
                </Text>
              </YStack>
            </Card>

            {/* Score Summary */}
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
                <H2 
                  fontSize="$6" 
                  fontWeight="600"
                  color="$primary-700"
                  textAlign="center"
                >
                  📊 Your Results
                </H2>
                
                <YStack space="$3">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$4" color="$gray-700">Final Score:</Text>
                    <Text fontSize="$5" fontWeight="600" color="$primary-700">
                      {score}/{maxScore} points
                    </Text>
                  </XStack>
                  
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$4" color="$gray-700">Percentage:</Text>
                    <Text fontSize="$5" fontWeight="600" color="$primary-700">
                      {scorePercentage}%
                    </Text>
                  </XStack>
                  
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$4" color="$gray-700">Stories Completed:</Text>
                    <Text fontSize="$5" fontWeight="600" color="$primary-700">
                      {storiesCompleted}/{GAME_CONFIG.MAX_STORIES}
                    </Text>
                  </XStack>
                  
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$4" color="$gray-700">Topic:</Text>
                    <Text fontSize="$5" fontWeight="600" color="$primary-700">
                      {topicInfo?.icon} {topicInfo?.name}
                    </Text>
                  </XStack>
                  
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize="$4" color="$gray-700">Difficulty:</Text>
                    <Text fontSize="$5" fontWeight="600" color="$primary-700">
                      {params.difficulty?.charAt(0).toUpperCase() + params.difficulty?.slice(1)}
                    </Text>
                  </XStack>
                </YStack>
              </YStack>
            </Card>

            {/* Achievements */}
            <Card 
              className="bg-white border-primary-200" 
              padding="$5" 
              borderRadius="$6"
            >
              <YStack space="$4">
                <H2 
                  fontSize="$6" 
                  fontWeight="600"
                  color="$primary-700"
                  textAlign="center"
                >
                  🏅 Achievements
                </H2>
                
                <YStack space="$3">
                  {storiesCompleted >= GAME_CONFIG.MAX_STORIES && (
                    <XStack alignItems="center" space="$3">
                      <Text fontSize="$5">✅</Text>
                      <Text fontSize="$4" color="$gray-700">Journey Complete</Text>
                    </XStack>
                  )}
                  
                  {score >= GAME_CONFIG.SCORE_THRESHOLDS.EXCELLENT && (
                    <XStack alignItems="center" space="$3">
                      <Text fontSize="$5">🌟</Text>
                      <Text fontSize="$4" color="$gray-700">Perfect Farmer</Text>
                    </XStack>
                  )}
                  
                  {score >= GAME_CONFIG.SCORE_THRESHOLDS.GOOD && (
                    <XStack alignItems="center" space="$3">
                      <Text fontSize="$5">🎯</Text>
                      <Text fontSize="$4" color="$gray-700">Good Decision Maker</Text>
                    </XStack>
                  )}
                  
                  {scorePercentage >= 50 && (
                    <XStack alignItems="center" space="$3">
                      <Text fontSize="$5">📈</Text>
                      <Text fontSize="$4" color="$gray-700">Above Average</Text>
                    </XStack>
                  )}
                  
                  <XStack alignItems="center" space="$3">
                    <Text fontSize="$5">🌱</Text>
                    <Text fontSize="$4" color="$gray-700">Organic Farming Explorer</Text>
                  </XStack>
                </YStack>
              </YStack>
            </Card>

            {/* Action Buttons */}
            <YStack space="$3">
              <Button
                size="$5"
                className="bg-primary-600 text-white"
                onPress={() => router.replace('/game/setup')}
              >
                <Text className="text-white font-semibold text-lg">🎮 Play Again</Text>
              </Button>
              
              <Button
                size="$5"
                variant="outlined"
                className="border-primary-300 text-primary-700"
                onPress={() => router.replace('/(tabs)')}
              >
                <Text className="text-primary-700 font-semibold text-lg">🏠 Home</Text>
              </Button>
              
              <Button
                size="$5"
                variant="outlined"
                className="border-earth-300 text-earth-600"
                onPress={() => router.replace('/(tabs)/profile')}
              >
                <Text className="text-earth-600 font-semibold text-lg">📊 View Profile</Text>
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}