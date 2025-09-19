import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Alert } from 'react-native';
import { Button, H1, H2, YStack, XStack, Input, Label } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock } from '@tamagui/lucide-icons';

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
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // TODO: Implement Appwrite registration
      console.log('Registration data:', formData);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/auth/login') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
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