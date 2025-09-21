import React, { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { Button, H1, H2, YStack, XStack, Card } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bell, 
  Volume2, 
  Moon, 
  Globe, 
  Shield, 
  HelpCircle, 
  Info, 
  ChevronRight,
  Smartphone
} from '@tamagui/lucide-icons';

export default function SettingsTab() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleAbout = () => {
    // TODO: Navigate to about screen
    console.log('About');
  };

  const handleHelp = () => {
    // TODO: Navigate to help screen
    console.log('Help');
  };

  const handlePrivacy = () => {
    // TODO: Navigate to privacy policy
    console.log('Privacy');
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showToggle = false, 
    toggleValue = false, 
    onToggle 
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
  }) => (
    <Card 
      className="bg-white border-primary-200" 
      padding="$4" 
      borderRadius="$5"
      pressStyle={onPress ? { scale: 0.98 } : undefined}
      animation="bouncy"
      onPress={onPress}
    >
      <XStack alignItems="center" space="$4">
        <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center">
          <Icon size={20} color="#22c55e" />
        </View>
        
        <YStack flex={1}>
          <Text className="font-semibold text-primary-700 text-base">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-earth-600 text-sm opacity-80">
              {subtitle}
            </Text>
          )}
        </YStack>
        
        {showToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
            thumbColor={toggleValue ? '#ffffff' : '#f3f4f6'}
          />
        ) : (
          <ChevronRight size={20} color="#9ca3af" />
        )}
      </XStack>
    </Card>
  );

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
                <Text className="text-3xl">⚙️</Text>
              </View>
              
              <H1 
                textAlign="center" 
                fontSize="$8" 
                fontWeight="bold"
                color="$primary-700"
                className="text-primary-700"
              >
                Settings
              </H1>
              
              <Text 
                textAlign="center" 
                fontSize="$5" 
                color="$earth-600"
                className="text-earth-600 opacity-90"
                maxWidth={280}
              >
                Customize your farming experience
              </Text>
            </YStack>

            {/* App Preferences */}
            <YStack space="$4">
              <H2 
                fontSize="$6" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Preferences
              </H2>
              
              <YStack space="$3">
                <SettingItem
                  icon={Bell}
                  title="Notifications"
                  subtitle="Get reminders and updates"
                  showToggle={true}
                  toggleValue={notifications}
                  onToggle={setNotifications}
                />
                
                <SettingItem
                  icon={Volume2}
                  title="Sound Effects"
                  subtitle="Play audio feedback"
                  showToggle={true}
                  toggleValue={soundEffects}
                  onToggle={setSoundEffects}
                />
                
                <SettingItem
                  icon={Moon}
                  title="Dark Mode"
                  subtitle="Switch to dark theme"
                  showToggle={true}
                  toggleValue={darkMode}
                  onToggle={setDarkMode}
                />
                
                <SettingItem
                  icon={Globe}
                  title="Language"
                  subtitle="English"
                  onPress={() => console.log('Language settings')}
                />
              </YStack>
            </YStack>

            {/* Game Settings */}
            <YStack space="$4">
              <H2 
                fontSize="$6" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Game Settings
              </H2>
              
              <YStack space="$3">
                <SettingItem
                  icon={Smartphone}
                  title="Difficulty Level"
                  subtitle="Adjust game challenge"
                  onPress={() => console.log('Difficulty settings')}
                />
              </YStack>
            </YStack>

            {/* Support & Info */}
            <YStack space="$4">
              <H2 
                fontSize="$6" 
                fontWeight="600"
                color="$primary-700"
                className="text-primary-700"
              >
                Support & Information
              </H2>
              
              <YStack space="$3">
                <SettingItem
                  icon={HelpCircle}
                  title="Help & FAQ"
                  subtitle="Get help and find answers"
                  onPress={handleHelp}
                />
                
                <SettingItem
                  icon={Shield}
                  title="Privacy Policy"
                  subtitle="How we protect your data"
                  onPress={handlePrivacy}
                />
                
                <SettingItem
                  icon={Info}
                  title="About"
                  subtitle="App version and credits"
                  onPress={handleAbout}
                />
              </YStack>
            </YStack>

            {/* App Info */}
            <Card 
              className="bg-earth-50 border-earth-200" 
              padding="$5" 
              borderRadius="$6"
            >
              <YStack alignItems="center" space="$3">
                <View className="w-12 h-12 bg-primary-500 rounded-full items-center justify-center">
                  <Text className="text-2xl">🌱</Text>
                </View>
                
                <YStack alignItems="center" space="$1">
                  <Text className="font-bold text-primary-700 text-lg">
                    Organic FarmQuest
                  </Text>
                  <Text className="text-earth-600 text-sm">
                    Version 1.0.0
                  </Text>
                  <Text className="text-earth-500 text-xs text-center">
                    Learn sustainable farming through interactive storytelling
                  </Text>
                </YStack>
              </YStack>
            </Card>

            {/* Reset/Clear Data */}
            <YStack space="$3">
              <Button
                size="$4"
                variant="outlined"
                className="border-red-300 text-red-600"
                borderRadius="$5"
                onPress={() => console.log('Clear data')}
              >
                <Text className="text-red-600 font-medium">Clear All Data</Text>
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}