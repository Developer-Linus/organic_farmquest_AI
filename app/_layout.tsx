import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import { View, Text, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import config from '../tamagui.config';
import { GameProvider } from '../src/contexts/GameContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Animated Loading Screen Component
function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();

    // Continuous rotation animation for the plant icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing animation for the loading indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, rotateAnim, pulseAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#E8F5E8', '#F0F8F0', '#FFFFFF']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: 'center',
            marginBottom: 40
          }}
        >
          {/* Animated Plant Icon */}
          <Animated.View
            style={{
              transform: [{ rotate: spin }, { scale: pulseAnim }],
              marginBottom: 20,
            }}
          >
            <View style={{ 
              width: 80, 
              height: 80, 
              backgroundColor: '#22c55e', 
              borderRadius: 40, 
              justifyContent: 'center', 
              alignItems: 'center',
              shadowColor: '#22c55e',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8
            }}>
              <Text style={{ fontSize: 40 }}>🌱</Text>
            </View>
          </Animated.View>
          
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#15803d',
            marginBottom: 8,
            textAlign: 'center'
          }}>
            Organic FarmQuest AI
          </Text>
          
          <Text style={{ 
            fontSize: 16, 
            color: '#65a30d',
            opacity: 0.8,
            textAlign: 'center',
            marginBottom: 30
          }}>
            Preparing your farming adventure...
          </Text>
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <ActivityIndicator size="large" color="#22c55e" />
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <LoadingScreen />;
  }

  return (
    <TamaguiProvider config={config}>
      <SafeAreaProvider>
        <GameProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen 
              name="game/setup" 
              options={{ 
                headerShown: false,
                presentation: 'card'
              }} 
            />
            <Stack.Screen 
              name="game/play" 
              options={{ 
                headerShown: false,
                presentation: 'card',
                gestureEnabled: false // Prevent accidental swipe back during game
              }} 
            />
            <Stack.Screen name="test-animation" options={{ title: 'Test Animation' }} />
          </Stack>
        </GameProvider>
      </SafeAreaProvider>
    </TamaguiProvider>
  );
}
