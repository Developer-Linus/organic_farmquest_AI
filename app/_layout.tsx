import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';

import config from '../tamagui.config';
import { GameProvider } from '../src/contexts/GameContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
    return null;
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
