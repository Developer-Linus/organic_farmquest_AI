import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl } from 'react-native';
import { Button, H1, H2, H3, YStack, XStack, Card, Progress, Separator } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Play, 
  Trophy, 
  Leaf, 
  Users, 
  Target, 
  Clock, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Star,
  Calendar,
  RotateCcw,
  ChevronRight
} from '@tamagui/lucide-icons';
import { useGame } from '@/src/contexts/GameContext';

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const { currentUser, isGuest, isLoading } = useGame();
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    gamesPlayed: 12,
    gamesWon: 8,
    totalScore: 3420,
    currentStreak: 5,
    level: 7,
    experience: 2340,
    nextLevelExp: 3000,
    achievements: 15,
    hoursPlayed: 24
  });

  const [recentActivity] = useState([
    { id: 1, type: 'game_won', title: 'Organic Vegetables Mastery', score: 450, time: '2 hours ago', icon: '🥕' },
    { id: 2, type: 'achievement', title: 'Green Thumb Achievement', description: 'Won 5 games in a row', time: '1 day ago', icon: '🏆' },
    { id: 3, type: 'game_completed', title: 'Herb Garden Challenge', score: 380, time: '2 days ago', icon: '🌿' },
  ]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleStartGame = () => {
    if (!currentUser || isGuest) {
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
      router.push('/game/setup');
    }
  };

  const handleQuickPlay = () => {
    if (!currentUser || isGuest) {
      handleStartGame();
      return;
    }
    router.push({
      pathname: '/game/play',
      params: {
        topic: 'vegetables',
        difficulty: 'easy'
      }
    });
  };

  const handleViewProgress = () => {
    router.push('/(tabs)/profile');
  };

  const handleViewAchievements = () => {
    router.push('/(tabs)/profile');
  };

  const experiencePercentage = (userStats.experience / userStats.nextLevelExp) * 100;
  const winRate = userStats.gamesPlayed > 0 ? Math.round((userStats.gamesWon / userStats.gamesPlayed) * 100) : 0;

  return (
    <View 
      className="flex-1"
      style={{ 
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom + 70, 78),
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <LinearGradient
        colors={['#F0F8F0', '#FFFFFF', '#F8FDF8']}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <YStack flex={1} paddingHorizontal="$4" paddingVertical="$6" space="$6">
            
            {/* Welcome Header */}
            <YStack alignItems="center" space="$4" paddingTop="$4">
              <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center shadow-lg">
                <Text className="text-4xl">🌱</Text>
              </View>
              
              <YStack alignItems="center" space="$2">
                <H1 
                  textAlign="center" 
                  fontSize="$8" 
                  fontWeight="bold"
                  color="$primary-700"
                >
                  {currentUser && !isGuest ? `Welcome back, ${currentUser.name.split(' ')[0]}!` : 'Welcome to FarmQuest'}
                </H1>
                
                <Text 
                  textAlign="center" 
                  fontSize="$5" 
                  color="$earth-600"
                  maxWidth={300}
                  lineHeight="$5"
                >
                  {currentUser && !isGuest 
                    ? 'Ready to continue your organic farming journey?' 
                    : 'Discover the art of sustainable farming through interactive stories'
                  }
                </Text>
              </YStack>
            </YStack>

            {/* User Stats Dashboard - Only for authenticated users */}
            {currentUser && !isGuest && (
              <Card 
                backgroundColor="$background"
                borderColor="$primary-200"
                borderWidth={1}
                borderRadius="$8"
                padding="$5"
                shadowColor="$shadowColor"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={4}
                elevation={2}
              >
                <YStack space="$4">
                  <XStack alignItems="center" justifyContent="space-between">
                    <H3 color="$primary-700" fontWeight="600">Your Progress</H3>
                    <XStack alignItems="center" space="$2">
                      <Star size={16} color="#f59e0b" fill="#f59e0b" />
                      <Text fontSize="$4" fontWeight="600" color="$primary-700">Level {userStats.level}</Text>
                    </XStack>
                  </XStack>

                  {/* Experience Bar */}
                  <YStack space="$2">
                    <XStack justifyContent="space-between">
                      <Text fontSize="$3" color="$earth-600">Experience</Text>
                      <Text fontSize="$3" color="$earth-600">{userStats.experience}/{userStats.nextLevelExp} XP</Text>
                    </XStack>
                    <Progress value={experiencePercentage} backgroundColor="$primary-100">
                      <Progress.Indicator backgroundColor="$primary-500" />
                    </Progress>
                  </YStack>

                  {/* Stats Grid */}
                  <XStack space="$3">
                    <YStack flex={1} alignItems="center" space="$1">
                      <Text fontSize="$6" fontWeight="bold" color="$primary-700">{userStats.gamesWon}</Text>
                      <Text fontSize="$2" color="$earth-600" textAlign="center">Games Won</Text>
                    </YStack>
                    <Separator vertical />
                    <YStack flex={1} alignItems="center" space="$1">
                      <Text fontSize="$6" fontWeight="bold" color="$primary-700">{winRate}%</Text>
                      <Text fontSize="$2" color="$earth-600" textAlign="center">Win Rate</Text>
                    </YStack>
                    <Separator vertical />
                    <YStack flex={1} alignItems="center" space="$1">
                      <Text fontSize="$6" fontWeight="bold" color="$primary-700">{userStats.currentStreak}</Text>
                      <Text fontSize="$2" color="$earth-600" textAlign="center">Win Streak</Text>
                    </YStack>
                  </XStack>
                </YStack>
              </Card>
            )}

            {/* Quick Actions */}
            <YStack space="$4">
              <H2 fontSize="$6" fontWeight="600" color="$primary-700">Quick Actions</H2>
              
              <XStack space="$3">
                {/* Start New Game */}
                <Card 
                  flex={1}
                  backgroundColor="$primary-500"
                  padding="$4" 
                  borderRadius="$6"
                  pressStyle={{ scale: 0.98, backgroundColor: '$primary-600' }}
                  animation="bouncy"
                  onPress={handleStartGame}
                >
                  <YStack alignItems="center" space="$3">
                    <View className="w-12 h-12 bg-white bg-opacity-20 rounded-full items-center justify-center">
                      <Play size={24} color="white" />
                    </View>
                    <Text className="text-white font-semibold text-center">New Game</Text>
                  </YStack>
                </Card>

                {/* Quick Play */}
                <Card 
                  flex={1}
                  backgroundColor="$green-500"
                  padding="$4" 
                  borderRadius="$6"
                  pressStyle={{ scale: 0.98, backgroundColor: '$green-600' }}
                  animation="bouncy"
                  onPress={handleQuickPlay}
                >
                  <YStack alignItems="center" space="$3">
                    <View className="w-12 h-12 bg-white bg-opacity-20 rounded-full items-center justify-center">
                      <Clock size={24} color="white" />
                    </View>
                    <Text className="text-white font-semibold text-center">Quick Play</Text>
                  </YStack>
                </Card>
              </XStack>

              <XStack space="$3">
                {/* View Progress */}
                <Card 
                  flex={1}
                  backgroundColor="$background"
                  borderColor="$earth-300"
                  borderWidth={1}
                  padding="$4" 
                  borderRadius="$6"
                  pressStyle={{ scale: 0.98, backgroundColor: '$earth-50' }}
                  animation="bouncy"
                  onPress={handleViewProgress}
                >
                  <YStack alignItems="center" space="$3">
                    <View className="w-12 h-12 bg-earth-100 rounded-full items-center justify-center">
                      <TrendingUp size={24} color="#8B7355" />
                    </View>
                    <Text className="text-earth-700 font-semibold text-center">Progress</Text>
                  </YStack>
                </Card>

                {/* Achievements */}
                <Card 
                  flex={1}
                  backgroundColor="$background"
                  borderColor="$orange-300"
                  borderWidth={1}
                  padding="$4" 
                  borderRadius="$6"
                  pressStyle={{ scale: 0.98, backgroundColor: '$orange-50' }}
                  animation="bouncy"
                  onPress={handleViewAchievements}
                >
                  <YStack alignItems="center" space="$3">
                    <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
                      <Trophy size={24} color="#f97316" />
                    </View>
                    <Text className="text-orange-700 font-semibold text-center">Achievements</Text>
                  </YStack>
                </Card>
              </XStack>
            </YStack>

            {/* Recent Activity - Only for authenticated users */}
            {currentUser && !isGuest && (
              <YStack space="$4">
                <XStack alignItems="center" justifyContent="space-between">
                  <H2 fontSize="$6" fontWeight="600" color="$primary-700">Recent Activity</H2>
                  <Button 
                    size="$3" 
                    variant="ghost" 
                    color="$primary-600"
                    onPress={handleViewProgress}
                    iconAfter={<ChevronRight size={16} />}
                  >
                    View All
                  </Button>
                </XStack>
                
                <YStack space="$3">
                  {recentActivity.map((activity) => (
                    <Card 
                      key={activity.id}
                      backgroundColor="$background"
                      borderColor="$gray-200"
                      borderWidth={1}
                      padding="$4"
                      borderRadius="$6"
                      pressStyle={{ backgroundColor: '$gray-50' }}
                    >
                      <XStack alignItems="center" space="$3">
                        <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center">
                          <Text className="text-lg">{activity.icon}</Text>
                        </View>
                        <YStack flex={1} space="$1">
                          <Text fontSize="$4" fontWeight="600" color="$primary-700">
                            {activity.title}
                          </Text>
                          {activity.description && (
                            <Text fontSize="$3" color="$earth-600">
                              {activity.description}
                            </Text>
                          )}
                          {activity.score && (
                            <Text fontSize="$3" color="$green-600" fontWeight="500">
                              +{activity.score} points
                            </Text>
                          )}
                        </YStack>
                        <Text fontSize="$2" color="$gray-500">
                          {activity.time}
                        </Text>
                      </XStack>
                    </Card>
                  ))}
                </YStack>
              </YStack>
            )}

            {/* What You'll Learn */}
            <YStack space="$4">
              <H2 fontSize="$6" fontWeight="600" color="$primary-700">What You&apos;ll Learn</H2>
              
              <YStack space="$3">
                {[
                  { icon: '🥕', title: 'Crop Selection', desc: 'Choose the right plants for your climate and soil' },
                  { icon: '🌿', title: 'Natural Methods', desc: 'Pesticide-free farming and organic techniques' },
                  { icon: '🌱', title: 'Soil Health', desc: 'Build rich, fertile growing conditions naturally' },
                  { icon: '💧', title: 'Water Management', desc: 'Efficient irrigation and conservation methods' },
                ].map((item, index) => (
                  <Card 
                    key={index}
                    backgroundColor="$background"
                    borderColor="$primary-200"
                    borderWidth={1}
                    padding="$4" 
                    borderRadius="$6"
                  >
                    <XStack alignItems="center" space="$4">
                      <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                        <Text className="text-2xl">{item.icon}</Text>
                      </View>
                      <YStack flex={1}>
                        <Text fontSize="$4" fontWeight="600" color="$primary-700">
                          {item.title}
                        </Text>
                        <Text fontSize="$3" color="$earth-600">
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
              <Card
                backgroundColor="$background"
                borderColor="$primary-200"
                borderWidth={2}
                borderRadius="$8"
                padding="$6"
                shadowColor="$shadowColor"
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={8}
                elevation={4}
              >
                <YStack space="$4" alignItems="center">
                  <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center">
                    <Text className="text-3xl">🌱</Text>
                  </View>
                  
                  <H2 
                    textAlign="center"
                    fontSize="$7" 
                    fontWeight="600"
                    color="$primary-700"
                  >
                    Join the FarmQuest Community!
                  </H2>
                  
                  <Text 
                    textAlign="center" 
                    fontSize="$4" 
                    color="$earth-600"
                    lineHeight="$5"
                  >
                    🎮 Save your progress across devices{'\n'}
                    🏆 Track your achievements and stats{'\n'}
                    🌾 Unlock exclusive content and challenges{'\n'}
                    👥 Connect with fellow farmers
                  </Text>
                  
                  <YStack space="$3" width="100%">
                    <Button
                      size="$5"
                      backgroundColor="$primary-500"
                      color="white"
                      fontWeight="600"
                      borderRadius="$6"
                      pressStyle={{ backgroundColor: '$primary-600', scale: 0.98 }}
                      onPress={() => router.push('/auth/register')}
                      icon={<Users size={20} color="white" />}
                    >
                      Create Account
                    </Button>
                    
                    <Button
                      size="$5"
                      variant="outlined"
                      borderColor="$primary-500"
                      color="$primary-600"
                      fontWeight="600"
                      borderRadius="$6"
                      pressStyle={{ backgroundColor: '$primary-50', scale: 0.98 }}
                      onPress={() => router.push('/auth/login')}
                    >
                      Sign In
                    </Button>
                    
                    <Text 
                      textAlign="center" 
                      fontSize="$3" 
                      color="$earth-500"
                      marginTop="$2"
                    >
                      You can explore as a guest, but some features require an account
                    </Text>
                  </YStack>
                </YStack>
              </Card>
            )}

          </YStack>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}