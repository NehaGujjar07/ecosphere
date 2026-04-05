import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOW, SPACING } from '../theme/Theme';

export default function PrimaryButton({ title, onPress, style }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress} 
      style={[styles.button, style]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.medium,
  },
  text: {
    ...TYPOGRAPHY.h3,
    color: '#FFF',
  },
});
