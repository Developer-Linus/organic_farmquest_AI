import React, { useState } from "react";
import { View, Text, ScrollView, ImageBackground, Alert } from "react-native";
import { Button, H1, H2, YStack, XStack, Input, Label } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock } from "@tamagui/lucide-icons";
import { account } from "@/lib/appwrite";
import { databaseService } from "@/lib/database";
import { UserRegistrationSchema } from "@/src/schemas";
import { ID } from "react-native-appwrite";
import { useGame } from "@/src/contexts/GameContext";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: FormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// 🔹 Reusable form field component
const FormField = ({
  label,
  icon: Icon,
  secure,
  value,
  onChange,
  toggleSecure,
  showSecure,
  placeholder,
}: {
  label: string;
  icon: any;
  secure?: boolean;
  value: string;
  onChange: (t: string) => void;
  toggleSecure?: () => void;
  showSecure?: boolean;
  placeholder: string;
}) => (
  <YStack space="$2">
    <Label fontWeight="500" color="$earth-700">
      {label}
    </Label>
    <XStack
      alignItems="center"
      backgroundColor="rgba(255,255,255,0.9)"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$primary-300"
      paddingHorizontal="$3"
    >
      <Icon size={20} color="#5D4E37" />
      <Input
        flex={1}
        borderWidth={0}
        backgroundColor="transparent"
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure && !showSecure}
        autoCapitalize="none"
      />
      {secure && toggleSecure && (
        <Button
          size="$2"
          variant="ghost"
          onPress={toggleSecure}
          icon={showSecure ? EyeOff : Eye}
          color="$earth-600"
        />
      )}
    </XStack>
  </YStack>
);

export default function Register() {
  const insets = useSafeAreaInsets();
  const { loginUser } = useGame();

  const [formData, setFormData] = useState<FormData>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    try {
      UserRegistrationSchema.parse(formData);
      return true;
    } catch (err: any) {
      const message = err.errors?.[0]?.message || "Invalid input";
      Alert.alert("Validation Error", message);
      return false;
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      // Clear any existing session
      try {
        await account.deleteSession("current");
      } catch {}

      // Create Auth account
      const userId = ID.unique();
      await account.create(userId, formData.email, formData.password, formData.fullName);
      await account.createEmailPasswordSession(formData.email, formData.password);

      // Create DB profile
      const profile = await databaseService.createUser(
        { name: formData.fullName, email: formData.email, games_won: 0 },
        userId
      );

      await loginUser(profile);

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.push("/game/setup") },
      ]);
    } catch (err: any) {
      console.error("Registration error:", err);
      let msg = "Failed to create account. Please try again.";
      if (err.code === 409) msg = "Email already registered. Please login instead.";
      if (err.code === 400) msg = "Invalid email or password format.";
      Alert.alert("Registration Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/book-texture.svg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <YStack flex={1} padding="$6" space="$4" minHeight="100%">
            {/* Header */}
            <XStack alignItems="center" justifyContent="space-between">
              <Button size="$3" variant="ghost" onPress={() => router.back()} icon={ArrowLeft} />
              <Text style={{ fontSize: 16, fontWeight: "500", color: "#5D4E37" }}>
                Create Account
              </Text>
              <View style={{ width: 40 }} />
            </XStack>

            {/* Logo */}
            <YStack alignItems="center" marginTop="$4">
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 40 }}>🌱</Text>
              </View>
            </YStack>

            {/* Title */}
            <YStack alignItems="center" space="$2" marginTop="$4">
              <H1>Join FarmQuest</H1>
              <H2 color="$earth-700">Start your organic farming journey</H2>
            </YStack>

            {/* Form */}
            <YStack space="$4" marginTop="$6">
              <FormField
                label="Full Name"
                icon={User}
                value={formData.fullName}
                onChange={(t) => handleChange("fullName", t)}
                placeholder="Enter your full name"
              />
              <FormField
                label="Email Address"
                icon={Mail}
                value={formData.email}
                onChange={(t) => handleChange("email", t)}
                placeholder="Enter your email"
              />
              <FormField
                label="Password"
                icon={Lock}
                secure
                value={formData.password}
                onChange={(t) => handleChange("password", t)}
                toggleSecure={() => setShowPassword(!showPassword)}
                showSecure={showPassword}
                placeholder="Create a password"
              />
              <FormField
                label="Confirm Password"
                icon={Lock}
                secure
                value={formData.confirmPassword}
                onChange={(t) => handleChange("confirmPassword", t)}
                toggleSecure={() => setShowConfirm(!showConfirm)}
                showSecure={showConfirm}
                placeholder="Confirm your password"
              />
              <Text style={{ fontSize: 12, textAlign: "center", color: "#8B7355" }}>
                Password must be at least 8 characters long
              </Text>
            </YStack>

            {/* Buttons */}
            <YStack space="$3" marginTop="$6">
              <Button
                size="$5"
                backgroundColor="$primary-600"
                color="white"
                borderRadius="$4"
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <XStack justifyContent="center" alignItems="center" space="$2">
                <Text style={{ fontSize: 14, color: "#8B7355" }}>Already have an account?</Text>
                <Button size="$3" variant="ghost" onPress={() => router.push("/auth/login")}>
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