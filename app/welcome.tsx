import React from 'react';
import { View, Text } from 'react-native';
import { Button, H1, H2, YStack, XStack, Card, Image } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  const insets = useSafeAreaInsets();

  const handleGetStarted = () => {
    router.push('/game/setup');
  };

  const handleLearnMore = () => {
    // Navigate to about/info screen (to be implemented)
    console.log('Learn more pressed');
  };

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
        colors={['#E8F5E8', '#F0F8F0', '#FFFFFF']}
        className="flex-1"
      >
        <YStack flex={1} paddingHorizontal="$4" paddingVertical="$6" space="$4">
          {/* Header Section */}
          <YStack alignItems="center" space="$3" marginTop="$8">
            <View className="w-24 h-24 bg-primary-500 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🌱</Text>
            </View>
            
            <H1 
              textAlign="center" 
              fontSize="$9" 
              fontWeight="bold"
              color="$primary-700"
              className="text-primary-700"
            >
              Organic FarmQuest AI
            </H1>
            
            <H2 
              textAlign="center" 
              fontSize="$6" 
              color="$earth-600"
              className="text-earth-600 opacity-90"
              maxWidth={300}
            >
              Learn organic farming through interactive AI-powered stories
            </H2>
          </YStack>

          {/* Features Section */}
          <YStack flex={1} justifyContent="center" space="$4" marginVertical="$6">
            <Card 
              className="bg-white/80 border-primary-200" 
              padding="$4" 
              borderRadius="$6"
              shadowColor="$primary-300"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
            >
              <XStack alignItems="center" space="$3">
                <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center">
                  <Text className="text-2xl">🎮</Text>
                </View>
                <YStack flex={1}>
                  <Text className="text-lg font-semibold text-primary-700">Interactive Learning</Text>
                  <Text className="text-earth-600 opacity-80">
                    Make choices that shape your farming journey
                  </Text>
                </YStack>
              </XStack>
            </Card>

            <Card 
              className="bg-white/80 border-primary-200" 
              padding="$4" 
              borderRadius="$6"
              shadowColor="$primary-300"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
            >
              <XStack alignItems="center" space="$3">
                <View className="w-12 h-12 bg-accent-100 rounded-full items-center justify-center">
                  <Text className="text-2xl">🤖</Text>
                </View>
                <YStack flex={1}>
                  <Text className="text-lg font-semibold text-primary-700">AI-Powered Stories</Text>
                  <Text className="text-earth-600 opacity-80">
                    Unique scenarios generated just for you
                  </Text>
                </YStack>
              </XStack>
            </Card>

            <Card 
              className="bg-white/80 border-primary-200" 
              padding="$4" 
              borderRadius="$6"
              shadowColor="$primary-300"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
            >
              <XStack alignItems="center" space="$3">
                <View className="w-12 h-12 bg-earth-100 rounded-full items-center justify-center">
                  <Text className="text-2xl">🌿</Text>
                </View>
                <YStack flex={1}>
                  <Text className="text-lg font-semibold text-primary-700">Organic Focus</Text>
                  <Text className="text-earth-600 opacity-80">
                    Learn sustainable, chemical-free farming methods
                  </Text>
                </YStack>
              </XStack>
            </Card>
          </YStack>

          {/* Action Buttons */}
          <YStack space="$3" marginBottom="$4">
            <Button
              size="$6"
              theme="green"
              onPress={() => router.push('/game/setup')}
              backgroundColor="$primary-700"
              color="white"
              borderRadius="$4"
              fontWeight="600"
              pressStyle={{ backgroundColor: '$primary-800' }}
            >
              Start Your Farm Adventure
            </Button>
            
            <Button
              size="$4"
              variant="outlined"
              onPress={() => router.push('/test-animation')}
              borderColor="$primary-700"
              color="$primary-700"
              borderRadius="$4"
              fontWeight="500"
              pressStyle={{ backgroundColor: '$primary-50' }}
            >
              Test Animation
            </Button>
            
            <Button
              size="$4"
              variant="outlined"
              className="border-primary-300 text-primary-600"
              borderRadius="$6"
              onPress={handleLearnMore}
              pressStyle={{ scale: 0.98 }}
              animation="bouncy"
            >
              <Text className="text-primary-600 font-medium">Learn More</Text>
            </Button>
          </YStack>

          {/* Footer */}
          <Text 
            textAlign="center" 
            className="text-earth-500 opacity-70 text-sm"
            marginTop="$2"
          >
            Grow your knowledge, nurture the earth 🌍
          </Text>
        </YStack>
      </LinearGradient>
    </View>
  );
}