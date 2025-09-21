import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Button, H1, H2, YStack, XStack, Input, Label } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from '@tamagui/lucide-icons';
import { account } from '@/lib/appwrite';
import { databaseService } from '@/lib/database';
import { UserLoginSchema } from '@/src/schemas';
import { useGame } from '@/src/contexts/GameContext';
import { BookTexture } from '@/components/BookTexture';

export default function Login() {
  const insets = useSafeAreaInsets();
  const { loginUser } = useGame();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    try {
      UserLoginSchema.parse(formData);
      return true;
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Please check your input';
      Alert.alert('Validation Error', errorMessage);
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Ensure no active session exists before login
      try {
        await account.deleteSession('current');
        console.log('Cleared existing session before login');
      } catch (sessionError) {
        // No active session to clear, which is expected for new logins
        console.log('No existing session to clear');
      }

      // Authenticate user with Appwrite
      const session = await account.createEmailPasswordSession(formData.email, formData.password);
      
      // Get the current user from Appwrite Auth
      const currentUser = await account.get();
      
      // Fetch user profile from our database using the authenticated user's ID
      const userProfile = await databaseService.getUserById(currentUser.$id);
      
      if (!userProfile) {
        // If user profile doesn't exist in our database, create it
        // This handles cases where users were created in Appwrite but not in our database
        const newUserProfile = await databaseService.createUser({
          name: currentUser.name || 'User',
          email: currentUser.email,
          hashed_password: 'appwrite_managed', // Placeholder since Appwrite manages auth
          games_won: 0
        }, currentUser.$id); // Pass the userId as a separate parameter
        await loginUser(newUserProfile);
      } else {
        await loginUser(userProfile);
      }
      
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => router.push('/game/setup') }
      ]);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Appwrite errors
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error.code === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    router.back();
  };

  const handleGoToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <BookTexture />
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
          keyboardShouldPersistTaps="handled"
        >
          <YStack 
            flex={1} 
            paddingHorizontal="$6" 
            paddingVertical="$4"
            space="$4"
            minHeight="100%"
          >
            {/* Header with Back Button */}
            <XStack alignItems="center" justifyContent="space-between" marginTop="$2">
              <Button
                size="$3"
                variant="ghost"
                onPress={handleBackToWelcome}
                icon={ArrowLeft}
                color="$primary-700"
                pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              />
              <Text 
                style={{
                  fontSize: 16,
                  color: '#5D4E37',
                  fontWeight: '500',
                  textShadowColor: 'rgba(255, 255, 255, 0.6)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                }}
              >
                Welcome Back
              </Text>
              <View style={{ width: 40 }} />
            </XStack>

            {/* App Logo */}
            <YStack alignItems="center" marginTop="$6">
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

            {/* Title */}
            <YStack alignItems="center" space="$2" marginTop="$6">
              <H1 
                textAlign="center" 
                fontSize="$8" 
                fontWeight="bold"
                color="$primary-800"
                style={{
                  textShadowColor: 'rgba(255, 255, 255, 0.8)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}
              >
                Welcome Back
              </H1>
              
              <H2 
                textAlign="center" 
                fontSize="$4" 
                color="$earth-700"
                maxWidth={280}
                style={{
                  textShadowColor: 'rgba(255, 255, 255, 0.6)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                }}
              >
                Continue your farming adventure
              </H2>
            </YStack>

            {/* Login Form */}
            <YStack space="$4" marginTop="$8" flex={1}>
              {/* Email Field */}
              <YStack space="$2">
                <Label 
                  htmlFor="login-email"
                  color="$earth-700"
                  fontSize="$4"
                  fontWeight="500"
                  style={{
                    textShadowColor: 'rgba(255, 255, 255, 0.5)',
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 1,
                  }}
                >
                  Email Address
                </Label>
                <XStack 
                  alignItems="center" 
                  backgroundColor="rgba(255, 255, 255, 0.9)"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$primary-300"
                  paddingHorizontal="$3"
                  style={{
                    shadowColor: '#8B7355',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Mail size={20} color="$earth-600" />
                  <Input
                    id="login-email"
                    flex={1}
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    fontSize="$4"
                    color="$earth-800"
                  />
                </XStack>
              </YStack>

              {/* Password Field */}
              <YStack space="$2">
                <Label 
                  htmlFor="login-password"
                  color="$earth-700"
                  fontSize="$4"
                  fontWeight="500"
                  style={{
                    textShadowColor: 'rgba(255, 255, 255, 0.5)',
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 1,
                  }}
                >
                  Password
                </Label>
                <XStack 
                  alignItems="center" 
                  backgroundColor="rgba(255, 255, 255, 0.9)"
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$primary-300"
                  paddingHorizontal="$3"
                  style={{
                    shadowColor: '#8B7355',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Lock size={20} color="$earth-600" />
                  <Input
                    id="login-password"
                    flex={1}
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    secureTextEntry={!showPassword}
                    fontSize="$4"
                    color="$earth-800"
                  />
                  <Button
                    size="$2"
                    variant="ghost"
                    onPress={() => setShowPassword(!showPassword)}
                    icon={showPassword ? EyeOff : Eye}
                    color="$earth-600"
                  />
                </XStack>
              </YStack>
            </YStack>

            {/* Action Buttons */}
            <YStack space="$3" marginTop="$8" paddingBottom="$4">
              <Button
                size="$5"
                backgroundColor="$primary-600"
                color="white"
                borderRadius="$4"
                fontWeight="600"
                fontSize="$4"
                onPress={handleLogin}
                disabled={isLoading}
                style={{
                  shadowColor: '#8B7355',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 6,
                }}
                pressStyle={{ backgroundColor: '$primary-700', scale: 0.98 }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Register Link */}
              <XStack justifyContent="center" alignItems="center" space="$2">
                <Text 
                  style={{
                    fontSize: 14,
                    color: '#8B7355',
                    textShadowColor: 'rgba(255, 255, 255, 0.6)',
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 1,
                  }}
                >
                  Don&apos;t have an account?
                </Text>
                <Button
                  size="$3"
                  variant="ghost"
                  onPress={handleGoToRegister}
                  color="$primary-700"
                  fontWeight="600"
                  pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  Create Account
                </Button>
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>
      </View>
    </View>
  );
}