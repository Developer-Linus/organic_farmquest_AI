import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Button, H1, H2, YStack, XStack, Card } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Trophy, Leaf, Users } from '@tamagui/lucide-icons';
import { useGame } from '@/src/contexts/GameContext';

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const { currentUser, isGuest, isLoading } = useGame();

  const handleStartGame = () => {
    // Check if user is authenticated
    if (!currentUser || isGuest) {
      // Show authentication options
      Alert.alert(
        'Authentication Required',
        'Please login or create an account to start your farming journey!',
        [
          {
            text: 'Login',
            onPress: () => router.push('/auth/login'),
            style: 'default'
          },
          {
            text: 'Create Account',
            onPress: () => router.push('/auth/register'),
            style: 'default'
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } else {
      // User is authenticated, proceed to game setup
      router.push('/game/setup');
    }
  };

  const handleViewProgress = () => {
    router.push('/(tabs)/profile');
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
        colors={['#F0F8F0', '#FFFFFF', '#F8FDF8']}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <YStack flex={1} paddingHorizontal="$4" paddingVertical="$8" space="$8" alignItems="center">
            {/* Welcome Header */}
            <YStack alignItems="center" space="$4" paddingTop="$6">
              <View className="w-24 h-24 bg-primary-500 rounded-full items-center justify-center shadow-lg">
                <Text className="text-5xl">🌱</Text>
              </View>
              
              <H1 
                textAlign="center" 
                fontSize="$9" 
                fontWeight="bold"
                color="$primary-700"
                className="text-primary-700"
              >
                Welcome to FarmQuest
              </H1>
              
              <Text 
                textAlign="center" 
                fontSize="$6" 
                color="$earth-600"
                className="text-earth-600 opacity-90"
                maxWidth={320}
                lineHeight="$6"
              >
                Discover the art of sustainable farming through interactive stories and hands-on learning
              </Text>
            </YStack>

            {/* Primary Action */}
            <Card 
              className="bg-gradient-to-r from-primary-500 to-primary-600" 
              padding="$6" 
              borderRadius="$8"
              pressStyle={{ scale: 0.98 }}
              animation="bouncy"
              onPress={handleStartGame}
              width="100%"
              maxWidth={350}
            >
              <XStack alignItems="center" justifyContent="center" space="$4">
                <View className="w-14 h-14 bg-white bg-opacity-20 rounded-full items-center justify-center">
                  <Play size={28} color="white" />
                </View>
                <YStack flex={1} alignItems="center">
                  <Text className="text-white font-bold text-xl">
                    Start Your Journey
                  </Text>
                  <Text className="text-white opacity-90 text-base">
                    Begin learning organic farming
                  </Text>
                </YStack>
              </XStack>
            </Card>

            {/* What You'll Learn */}
            <YStack space="$4" width="100%" maxWidth={350}>
              <H2 
                textAlign="center"
                fontSize="$7" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                What You&apos;ll Learn
              </H2>
              
              <YStack space="$3">
                {[
                  { icon: '🥕', title: 'Crop Selection', desc: 'Choose the right plants for your climate' },
                  { icon: '🌿', title: 'Natural Methods', desc: 'Pesticide-free farming techniques' },
                  { icon: '🌱', title: 'Soil Health', desc: 'Build rich, fertile growing conditions' },
                ].map((item, index) => (
                  <Card 
                    key={index}
                    className="bg-white border-primary-200" 
                    padding="$4" 
                    borderRadius="$6"
                  >
                    <XStack alignItems="center" space="$4">
                      <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                        <Text className="text-2xl">{item.icon}</Text>
                      </View>
                      <YStack flex={1}>
                        <Text className="font-semibold text-primary-700 text-base">
                          {item.title}
                        </Text>
                        <Text className="text-earth-600 text-sm">
                          {item.desc}
                        </Text>
                      </YStack>
                    </XStack>
                  </Card>
                ))}
              </YStack>
            </YStack>

            {/* Authentication Section for Guest Users */}
            {(!currentUser || isGuest) && (
              <YStack space="$4" width="100%" maxWidth={350}>
                <H2 
                  textAlign="center"
                  fontSize="$7" 
                  fontWeight="600"
                  color="$primary-700"
                  className="text-primary-700"
                >
                  Join the Community
                </H2>
                
                <Text 
                  textAlign="center" 
                  fontSize="$5" 
                  color="$earth-600"
                  className="text-earth-600"
                  lineHeight="$5"
                >
                  Create an account to save your progress and unlock all features
                </Text>
                
                <XStack space="$3" width="100%">
                  <Button
                    flex={1}
                    size="$5"
                    backgroundColor="$primary-500"
                    color="white"
                    fontWeight="600"
                    borderRadius="$6"
                    pressStyle={{ backgroundColor: '$primary-600', scale: 0.98 }}
                    onPress={() => router.push('/auth/register')}
                  >
                    Sign Up
                  </Button>
                  
                  <Button
                    flex={1}
                    size="$5"
                    variant="outlined"
                    borderColor="$primary-500"
                    color="$primary-600"
                    fontWeight="600"
                    borderRadius="$6"
                    pressStyle={{ backgroundColor: '$primary-50', scale: 0.98 }}
                    onPress={() => router.push('/auth/login')}
                  >
                    Login
                  </Button>
                </XStack>
              </YStack>
            )}

            {/* Quick Access */}
            <Card 
              className="bg-earth-50 border-earth-200" 
              padding="$5" 
              borderRadius="$6"
              width="100%"
              maxWidth={350}
              pressStyle={{ scale: 0.98 }}
              animation="bouncy"
              onPress={handleViewProgress}
            >
              <XStack alignItems="center" justifyContent="center" space="$4">
                <View className="w-12 h-12 bg-earth-200 rounded-full items-center justify-center">
                  <Trophy size={24} color="#8B7355" />
                </View>
                <YStack flex={1} alignItems="center">
                  <Text className="font-bold text-earth-700 text-lg">
                    View Your Progress
                  </Text>
                  <Text className="text-earth-600 text-sm">
                    Track achievements and learning
                  </Text>
                </YStack>
              </XStack>
            </Card>
          </YStack>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}