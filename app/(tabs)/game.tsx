import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, H1, H2, YStack, XStack, Card } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, RotateCcw, Target, Clock } from '@tamagui/lucide-icons';

export default function GameTab() {
  const insets = useSafeAreaInsets();

  const handleNewGame = () => {
    router.push('/game/setup');
  };

  const handleContinueGame = () => {
    // TODO: Implement continue game functionality
    router.push('/game/play');
  };

  return (
    <View 
      className="flex-1"
      style={{ 
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom + 70, 78), // Account for tab bar height + safe area
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <LinearGradient
        colors={['#F8FDF8', '#FFFFFF', '#F0F8F0']}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <YStack flex={1} paddingHorizontal="$4" paddingVertical="$6" space="$6">
            {/* Header */}
            <YStack alignItems="center" space="$3">
              <View className="w-16 h-16 bg-primary-500 rounded-full items-center justify-center">
                <Text className="text-3xl">🎮</Text>
              </View>
              
              <H1 
                textAlign="center" 
                fontSize="$8" 
                fontWeight="bold"
                color="$primary-700"
                className="text-primary-700"
              >
                Game Center
              </H1>
              
              <Text 
                textAlign="center" 
                fontSize="$5" 
                color="$earth-600"
                className="text-earth-600 opacity-90"
                maxWidth={280}
              >
                Start new adventures or continue your farming journey
              </Text>
            </YStack>

            {/* Main Actions */}
            <YStack space="$4">
              <Card 
                className="bg-gradient-to-r from-primary-500 to-primary-600" 
                padding="$5" 
                borderRadius="$6"
                pressStyle={{ scale: 0.98 }}
                animation="bouncy"
                onPress={handleNewGame}
              >
                <XStack alignItems="center" space="$4">
                  <View className="w-14 h-14 bg-white bg-opacity-20 rounded-full items-center justify-center">
                    <Play size={28} color="white" />
                  </View>
                  <YStack flex={1}>
                    <Text className="text-white font-bold text-xl">
                      New Adventure
                    </Text>
                    <Text className="text-white opacity-90 text-base">
                      Choose your farming topic and difficulty
                    </Text>
                  </YStack>
                </XStack>
              </Card>

              <Card 
                className="bg-white border-primary-200" 
                padding="$5" 
                borderRadius="$6"
                pressStyle={{ scale: 0.98 }}
                animation="bouncy"
                onPress={handleContinueGame}
              >
                <XStack alignItems="center" space="$4">
                  <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center">
                    <RotateCcw size={28} color="#3b82f6" />
                  </View>
                  <YStack flex={1}>
                    <Text className="text-primary-700 font-bold text-xl">
                      Continue Game
                    </Text>
                    <Text className="text-earth-600 opacity-90 text-base">
                      Resume your last farming session
                    </Text>
                  </YStack>
                </XStack>
              </Card>
            </YStack>

            {/* Game Modes */}
            <YStack space="$4">
              <H2 
                fontSize="$6" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Game Modes
              </H2>
              
              <XStack space="$3">
                <Card 
                  flex={1}
                  className="bg-white border-primary-200" 
                  padding="$4" 
                  borderRadius="$5"
                  pressStyle={{ scale: 0.98 }}
                  animation="bouncy"
                >
                  <YStack alignItems="center" space="$3">
                    <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                      <Target size={24} color="#22c55e" />
                    </View>
                    <Text className="text-center font-semibold text-primary-700">
                      Challenge Mode
                    </Text>
                    <Text className="text-center text-sm text-earth-600 opacity-80">
                      Test your skills
                    </Text>
                  </YStack>
                </Card>
                
                <Card 
                  flex={1}
                  className="bg-white border-primary-200" 
                  padding="$4" 
                  borderRadius="$5"
                  pressStyle={{ scale: 0.98 }}
                  animation="bouncy"
                >
                  <YStack alignItems="center" space="$3">
                    <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
                      <Clock size={24} color="#f97316" />
                    </View>
                    <Text className="text-center font-semibold text-primary-700">
                      Quick Play
                    </Text>
                    <Text className="text-center text-sm text-earth-600 opacity-80">
                      5-minute sessions
                    </Text>
                  </YStack>
                </Card>
              </XStack>
            </YStack>

            {/* Recent Games */}
            <YStack space="$4">
              <H2 
                fontSize="$6" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Recent Games
              </H2>
              
              <Card 
                className="bg-earth-50 border-earth-200" 
                padding="$4" 
                borderRadius="$5"
              >
                <YStack alignItems="center" space="$3" paddingVertical="$4">
                  <Text className="text-4xl opacity-60">🌾</Text>
                  <Text className="text-earth-600 font-medium">
                    No recent games
                  </Text>
                  <Text className="text-earth-500 text-sm text-center">
                    Start your first farming adventure to see your game history here
                  </Text>
                </YStack>
              </Card>
            </YStack>

            {/* Game Statistics */}
            <YStack space="$4">
              <H2 
                fontSize="$6" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Your Stats
              </H2>
              
              <XStack space="$3">
                <Card 
                  flex={1}
                  className="bg-white border-primary-200" 
                  padding="$4" 
                  borderRadius="$5"
                >
                  <YStack alignItems="center" space="$2">
                    <Text className="text-2xl font-bold text-primary-600">0</Text>
                    <Text className="text-sm text-earth-600 text-center">
                      Games Completed
                    </Text>
                  </YStack>
                </Card>
                
                <Card 
                  flex={1}
                  className="bg-white border-primary-200" 
                  padding="$4" 
                  borderRadius="$5"
                >
                  <YStack alignItems="center" space="$2">
                    <Text className="text-2xl font-bold text-primary-600">0</Text>
                    <Text className="text-sm text-earth-600 text-center">
                      Best Score
                    </Text>
                  </YStack>
                </Card>
                
                <Card 
                  flex={1}
                  className="bg-white border-primary-200" 
                  padding="$4" 
                  borderRadius="$5"
                >
                  <YStack alignItems="center" space="$2">
                    <Text className="text-2xl font-bold text-primary-600">0h</Text>
                    <Text className="text-sm text-earth-600 text-center">
                      Time Played
                    </Text>
                  </YStack>
                </Card>
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}