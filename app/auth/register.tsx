import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Alert } from 'react-native';
import { Button, H1, H2, YStack, XStack, Input, Label } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock } from '@tamagui/lucide-icons';
import { account } from '@/lib/appwrite';
import { databaseService } from '@/lib/database';
import { UserRegistrationSchema } from '@/src/schemas';
import { ID } from 'react-native-appwrite';

export default function Register() {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    try {
      UserRegistrationSchema.parse(formData);
      return true;
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Please check your input';
      Alert.alert('Validation Error', errorMessage);
      return false;
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Create user account with Appwrite Auth
      const userId = ID.unique();
      const authResponse = await account.create(
        userId,
        formData.email,
        formData.password,
        formData.fullName
      );

      // Create user profile in database with the same ID as auth user
      // Note: We use a placeholder for hashed_password since Appwrite handles auth separately
      await databaseService.createUser({
        id: userId, // Use the same ID as the auth user
        name: formData.fullName,
        email: formData.email,
        hashed_password: 'appwrite_managed', // Placeholder since Appwrite manages auth
        games_won: 0
      });

      // Automatically log in the user after registration
      await account.createEmailPasswordSession(formData.email, formData.password);

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/game/setup') }
      ]);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific Appwrite errors
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 409) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 400) {
        errorMessage = 'Invalid email or password format.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToWelcome = () => {
    router.back();
  };

  const handleGoToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/book-texture.svg')}
      style={{ flex: 1 }}
      resizeMode="cover"
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
                Create Account
              </Text>
              <View style={{ width: 40 }} />
            </XStack>

            {/* App Logo */}
            <YStack alignItems="center" marginTop="$4">
              <View 
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#8B7355',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Text style={{ fontSize: 40 }}>🌱</Text>
              </View>
            </YStack>

            {/* Title */}
            <YStack alignItems="center" space="$2" marginTop="$4">
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
                Join FarmQuest
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
                Start your organic farming journey
              </H2>
            </YStack>

            {/* Registration Form */}
            <YStack space="$4" marginTop="$6" flex={1}>
              {/* Full Name Field */}
              <YStack space="$2">
                <Label 
                  htmlFor="fullName"
                  color="$earth-700"
                  fontSize="$4"
                  fontWeight="500"
                  style={{
                    textShadowColor: 'rgba(255, 255, 255, 0.5)',
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 1,
                  }}
                >
                  Full Name
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
                  <User size={20} color="$earth-600" />
                  <Input
                    id="fullName"
                    flex={1}
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChangeText={(text) => handleInputChange('fullName', text)}
                    fontSize="$4"
                    color="$earth-800"
                  />
                </XStack>
              </YStack>

              {/* Email Field */}
              <YStack space="$2">
                <Label 
                  htmlFor="register-email"
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
                    id="register-email"
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
                  htmlFor="register-password"
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
                    id="register-password"
                    flex={1}
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholder="Create a password"
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

              {/* Confirm Password Field */}
              <YStack space="$2">
                <Label 
                  htmlFor="confirmPassword"
                  color="$earth-700"
                  fontSize="$4"
                  fontWeight="500"
                  style={{
                    textShadowColor: 'rgba(255, 255, 255, 0.5)',
                    textShadowOffset: { width: 0.5, height: 0.5 },
                    textShadowRadius: 1,
                  }}
                >
                  Confirm Password
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
                    id="confirmPassword"
                    flex={1}
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    secureTextEntry={!showConfirmPassword}
                    fontSize="$4"
                    color="$earth-800"
                  />
                  <Button
                    size="$2"
                    variant="ghost"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    icon={showConfirmPassword ? EyeOff : Eye}
                    color="$earth-600"
                  />
                </XStack>
              </YStack>

              {/* Password Requirements */}
              <Text 
                style={{
                  fontSize: 12,
                  color: '#8B7355',
                  textAlign: 'center',
                  marginTop: 8,
                  textShadowColor: 'rgba(255, 255, 255, 0.6)',
                  textShadowOffset: { width: 0.5, height: 0.5 },
                  textShadowRadius: 1,
                }}
              >
                Password must be at least 8 characters long
              </Text>
            </YStack>

            {/* Action Buttons */}
            <YStack space="$3" marginTop="$6" paddingBottom="$4">
              <Button
                size="$5"
                backgroundColor="$primary-600"
                color="white"
                borderRadius="$4"
                fontWeight="600"
                fontSize="$4"
                onPress={handleRegister}
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Login Link */}
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
                  Already have an account?
                </Text>
                <Button
                  size="$3"
                  variant="ghost"
                  onPress={handleGoToLogin}
                  color="$primary-700"
                  fontWeight="600"
                  pressStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  Login
                </Button>
              </XStack>
            </YStack>
          </YStack>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}