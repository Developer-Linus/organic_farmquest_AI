import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Button, H1, H2, YStack, XStack, Card, Avatar } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Award, Star, TrendingUp, Edit, LogOut, Leaf, Calendar, Target } from '@tamagui/lucide-icons';
import { useGame } from '../../src/contexts/GameContext';

export default function ProfileTab() {
  const insets = useSafeAreaInsets();
  const { currentUser, isGuest, logoutUser } = useGame();

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert('Success', 'You have been logged out successfully.', [
        { text: 'OK', onPress: () => router.replace('/welcome') }
      ]);
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
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
          <YStack flex={1} paddingHorizontal="$4" paddingVertical="$6" space="$6">
            {/* Profile Header */}
            <YStack alignItems="center" space="$4">
              <View 
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#22c55e',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>👤</Text>
              </View>
              
              <YStack alignItems="center" space="$2">
                <H1
                  textAlign="center"
                  fontSize="$7"
                  fontWeight="bold"
                  color="$primary-700"
                  className="text-primary-700"
                >
                  {currentUser?.name || 'Farm Explorer'}
                </H1>
                
                <Text
                  textAlign="center"
                  fontSize="$4"
                  color="$earth-600"
                  className="text-earth-600 opacity-90"
                >
                  {isGuest ? 'Guest Player' : currentUser?.email || 'Organic Farming Enthusiast'}
                </Text>
              </YStack>
              
              {/* Authentication Section for Guest Users */}
              {(!currentUser || isGuest) ? (
                <YStack space="$4" alignItems="center" width="100%" maxWidth={300}>
                  <Text
                    textAlign="center"
                    fontSize="$5"
                    color="$earth-600"
                    className="text-earth-600"
                    lineHeight="$5"
                  >
                    Sign up to save your progress and unlock all features
                  </Text>
                  
                  <XStack space="$3" width="100%">
                    <Button
                      flex={1}
                      size="$4"
                      backgroundColor="$primary-500"
                      color="white"
                      fontWeight="600"
                      borderRadius="$5"
                      pressStyle={{ backgroundColor: '$primary-600', scale: 0.98 }}
                      onPress={() => router.push('/auth/register')}
                    >
                      Sign Up
                    </Button>
                    
                    <Button
                      flex={1}
                      size="$4"
                      variant="outlined"
                      borderColor="$primary-500"
                      color="$primary-600"
                      fontWeight="600"
                      borderRadius="$5"
                      pressStyle={{ backgroundColor: '$primary-50', scale: 0.98 }}
                      onPress={() => router.push('/auth/login')}
                    >
                      Login
                    </Button>
                  </XStack>
                </YStack>
              ) : (
                <XStack space="$3">
                  <Button
                    size="$3"
                    variant="outlined"
                    className="border-primary-300 text-primary-600"
                    borderRadius="$4"
                    onPress={handleEditProfile}
                    icon={<Edit size={16} />}
                  >
                    Edit Profile
                  </Button>
                  
                  <Button
                    size="$3"
                    variant="outlined"
                    className="border-red-300 text-red-600"
                    borderRadius="$4"
                    onPress={handleLogout}
                    icon={<LogOut size={16} />}
                  >
                    Logout
                  </Button>
                </XStack>
              )}
            </YStack>
            
            {/* Daily Farming Tip */}
            <Card
              className="bg-earth-50 border-earth-200"
              padding="$5"
              borderRadius="$6"
            >
              <YStack space="$3">
                <XStack alignItems="center" space="$3">
                  <View className="w-10 h-10 bg-earth-200 rounded-full items-center justify-center">
                    <Leaf size={20} color="#8B7355" />
                  </View>
                  <Text className="font-bold text-earth-700 text-lg">
                    Today&apos;s Farming Tip
                  </Text>
                </XStack>
                
                <Text className="text-earth-600 leading-relaxed">
                  Companion planting can naturally deter pests and improve soil health.
                  Try planting marigolds near your tomatoes to keep harmful insects away!
                </Text>
              </YStack>
            </Card>
            
            {/* Stats Overview */}
            <YStack space="$4">
              <H2
                fontSize="$6"
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Your Progress
              </H2>
              
              <XStack space="$3">
                <Card
                  flex={1}
                  className="bg-white border-primary-200"
                  padding="$4"
                  borderRadius="$5"
                >
                  <YStack alignItems="center" space="$2">
                    <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                      <Trophy size={20} color="#3b82f6" />
                    </View>
                    <Text className="text-2xl font-bold text-primary-600">0</Text>
                    <Text className="text-sm text-earth-600 text-center">
                      Level
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
                    <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center">
                      <Star size={20} color="#eab308" />
                    </View>
                    <Text className="text-2xl font-bold text-primary-600">0</Text>
                    <Text className="text-sm text-earth-600 text-center">
                      Points
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
                    <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                      <TrendingUp size={20} color="#22c55e" />
                    </View>
                    <Text className="text-2xl font-bold text-primary-600">0</Text>
                    <Text className="text-sm text-earth-600 text-center">
                      Streak
                    </Text>
                  </YStack>
                </Card>
              </XStack>
            </YStack>
            
            {/* Detailed Statistics */}
            <YStack space="$4">
              <H2
                fontSize="$6"
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Your Journey Stats
              </H2>
              
              <YStack space="$3">
                <XStack space="$3">
                  <Card
                    flex={1}
                    className="bg-white border-primary-200"
                    padding="$4"
                    borderRadius="$5"
                  >
                    <YStack alignItems="center" space="$2">
                      <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                        <Calendar size={20} color="#8b5cf6" />
                      </View>
                      <Text className="text-xl font-bold text-primary-600">0</Text>
                      <Text className="text-xs text-earth-600 text-center">
                        Days Active
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
                      <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                        <Target size={20} color="#f97316" />
                      </View>
                      <Text className="text-xl font-bold text-primary-600">0</Text>
                      <Text className="text-xs text-earth-600 text-center">
                        Goals Met
                      </Text>
                    </YStack>
                  </Card>
                </XStack>
              </YStack>
            </YStack>

            {/* Achievements */}
            <YStack space="$4">
              <H2
                fontSize="$6"
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Achievements
              </H2>
              
              <Card
                className="bg-earth-50 border-earth-200"
                padding="$5"
                borderRadius="$6"
              >
                <YStack alignItems="center" space="$3" paddingVertical="$2">
                  <View className="w-16 h-16 bg-earth-200 rounded-full items-center justify-center">
                    <Award size={32} color="#8B7355" />
                  </View>
                  <Text className="text-earth-700 font-semibold text-lg">
                    No Achievements Yet
                  </Text>
                  <Text className="text-earth-600 text-center">
                    Complete your first farming adventure to unlock achievements!
                  </Text>
                </YStack>
              </Card>
            </YStack>

            {/* Learning Progress */}
            <YStack space="$4">
              <H2
                fontSize="$6"
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Learning Topics
              </H2>
              
              <YStack space="$3">
                {[
                  { topic: 'Vegetables', progress: 0, emoji: '🥕' },
                  { topic: 'Fruits', progress: 0, emoji: '🍎' },
                  { topic: 'Herbs', progress: 0, emoji: '🌿' },
                  { topic: 'Grains', progress: 0, emoji: '🌾' },
                ].map((item, index) => (
                  <Card
                    key={index}
                    className="bg-white border-primary-200"
                    padding="$4"
                    borderRadius="$5"
                  >
                    <XStack alignItems="center" space="$4">
                      <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                        <Text className="text-2xl">{item.emoji}</Text>
                      </View>
                      
                      <YStack flex={1} space="$2">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text className="font-semibold text-primary-700">
                            {item.topic}
                          </Text>
                          <Text className="text-sm text-earth-600">
                            {item.progress}%
                          </Text>
                        </XStack>
                        
                        <View className="h-2 bg-earth-200 rounded-full overflow-hidden">
                          <View
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </View>
                      </YStack>
                    </XStack>
                  </Card>
                ))}
              </YStack>
            </YStack>

            {/* Recent Activity */}
            <YStack space="$4">
              <H2
                fontSize="$6"
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Recent Activity
              </H2>
              
              <Card
                className="bg-earth-50 border-earth-200"
                padding="$4"
                borderRadius="$5"
              >
                <YStack alignItems="center" space="$3" paddingVertical="$4">
                  <Text className="text-4xl opacity-60">📊</Text>
                  <Text className="text-earth-600 font-medium">
                    No activity yet
                  </Text>
                  <Text className="text-earth-500 text-sm text-center">
                    Start playing games to see your activity history
                  </Text>
                </YStack>
              </Card>
            </YStack>
          </YStack>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}