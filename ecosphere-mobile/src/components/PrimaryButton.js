import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOW, SPACING } from '../theme/Theme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolateColor 
} from 'react-native-reanimated';

export default function PrimaryButton({ title, onPress, style }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 10, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <Pressable 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed
        ]}
      >
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...SHADOW.medium,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56, // Standard mobile SaaS button height
  },
  pressed: {
    backgroundColor: COLORS.primaryDark,
  },
  text: {
    ...TYPOGRAPHY.h3,
    color: '#FFF',
    fontWeight: '700',
  },
});
