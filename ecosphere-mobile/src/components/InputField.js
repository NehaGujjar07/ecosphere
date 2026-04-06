import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { COLORS, TYPOGRAPHY, RADIUS, SPACING, SHADOW } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';

export default function InputField({ icon, placeholder, secureTextEntry, value, onChangeText, autoCapitalize }) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnim.value,
      [0, 1],
      [COLORS.border, COLORS.primary]
    );
    const elevation = withTiming(focusAnim.value * 4);
    
    return {
      borderColor: borderColor,
      transform: [{ translateY: withTiming(focusAnim.value * -2) }],
    };
  });

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={20} 
          color={isFocused ? COLORS.primary : COLORS.textMuted} 
          style={styles.icon} 
        />
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCapitalize={autoCapitalize || 'none'}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderRadius: RADIUS.l,
    paddingHorizontal: SPACING.m,
    height: 56,
    marginBottom: SPACING.m,
    ...SHADOW.light,
  },
  icon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    height: '100%',
  },
});
