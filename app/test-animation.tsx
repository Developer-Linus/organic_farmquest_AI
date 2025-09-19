import React from 'react';
import { Button, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  withSpring, 
  useAnimatedStyle,
  runOnJS 
} from 'react-native-reanimated';

export default function TestAnimation() {
  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: 100,
      backgroundColor: 'violet',
      marginBottom: 20,
    };
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={animatedStyle} />
      <Button onPress={handlePress} title="Click me" />
    </View>
  );
}