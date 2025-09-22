import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button, H1, H2, YStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Welcome() {
  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };



  return (
    <View 
      style={{ 
        flex: 1,
        backgroundColor: '#f5f2e8' // Fallback background color
      }}
    >
      <View 
        className="flex-1"
        style={{ 
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <YStack 
          flex={1} 
          paddingHorizontal="$6" 
          paddingVertical="$8"
          space="$6"
          minHeight="100%"
        >
          {/* App Logo/Icon */}
          <YStack alignItems="center" marginTop="$4">
            <View 
              style={{
                width: 96,
                height: 96,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 48,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#8B7355',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 48 }}>🌱</Text>
            </View>
          </YStack>

          {/* App Title and Description */}
          <YStack alignItems="center" space="$4" flex={1} justifyContent="center">
            <H1 
              textAlign="center" 
              fontSize="$9" 
              fontWeight="bold"
              color="$primary-800"
              style={{
                textShadowColor: 'rgba(255, 255, 255, 0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}
            >
              Organic FarmQuest
            </H1>
            
            <H2 
              textAlign="center" 
              fontSize="$5" 
              color="$earth-700"
              maxWidth={320}
              lineHeight="$6"
              paddingHorizontal="$4"
              style={{
                textShadowColor: 'rgba(255, 255, 255, 0.6)',
                textShadowOffset: { width: 0.5, height: 0.5 },
                textShadowRadius: 1,
              }}
            >
              Learn organic farming through interactive stories that adapt to your choices and help you master sustainable agriculture techniques.
            </H2>

            {/* Features List */}
            <YStack space="$3" marginTop="$6" maxWidth={300}>
              <Text 
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#5D4E37',
                  fontWeight: '500',
                  textShadowColor: 'rgba(255, 255, 255, 0.5)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                }}
              >
                🌱 Interactive story-based learning
              </Text>
              <Text 
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#5D4E37',
                  fontWeight: '500',
                  textShadowColor: 'rgba(255, 255, 255, 0.5)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                }}
              >
                🎯 Make choices that shape your farm
              </Text>
              <Text 
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#5D4E37',
                  fontWeight: '500',
                  textShadowColor: 'rgba(255, 255, 255, 0.5)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                }}
              >
                📚 Learn real organic farming techniques
              </Text>
            </YStack>
          </YStack>

          {/* Action Buttons - Fixed at bottom */}
          <YStack space="$4" width="100%" paddingBottom="$4">
            <Button
              size="$5"
              backgroundColor="$primary-600"
              color="white"
              borderRadius="$4"
              fontWeight="600"
              fontSize="$4"
              onPress={handleLogin}
              pressStyle={{ backgroundColor: '$primary-700', scale: 0.98 }}
              style={{
                shadowColor: '#8B7355',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 6,
              }}
            >
              Login
            </Button>
            
            <Button
              size="$5"
              variant="outlined"
              borderColor="$primary-600"
              color="$primary-700"
              borderRadius="$4"
              fontWeight="600"
              fontSize="$4"
              onPress={handleRegister}
              pressStyle={{ backgroundColor: '$primary-50', scale: 0.98 }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                shadowColor: '#8B7355',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              Create Account
            </Button>

            {/* Simple Footer */}
            <Text 
              style={{
                textAlign: 'center',
                color: '#8B7355',
                fontSize: 14,
                marginTop: 16,
                textShadowColor: 'rgba(255, 255, 255, 0.6)',
                textShadowOffset: { width: 0.5, height: 0.5 },
                textShadowRadius: 1,
              }}
            >
              Start your farming journey today
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
      </View>
    </View>
  );
}