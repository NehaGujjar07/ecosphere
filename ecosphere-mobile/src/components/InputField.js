import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import { COLORS, TYPOGRAPHY, RADIUS, SPACING, SHADOW } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function InputField({ icon, placeholder, secureTextEntry, value, onChangeText }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      {icon && <Ionicons name={icon} size={20} color={isFocused ? COLORS.primary : COLORS.textMuted} style={styles.icon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.l,
    paddingHorizontal: SPACING.m,
    height: 56,
    marginBottom: SPACING.m,
  },
  containerFocused: {
    borderColor: COLORS.primary,
    ...SHADOW.light,
  },
  icon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
});
