import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from './PrimaryButton';

const { width } = Dimensions.get('window');

export default function BadgeUnlockModal({ visible, badge, onClose }) {
  if (!badge) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="sparkles" size={24} color="#FBBF24" />
            <Text style={styles.congratsText}>Congratulations!</Text>
            <Ionicons name="sparkles" size={24} color="#FBBF24" />
          </View>
          
          <View style={styles.badgeContainer}>
            <View style={styles.badgeCircle}>
              <Text style={styles.badgeEmoji}>{badge.icon}</Text>
            </View>
          </View>

          <Text style={styles.badgeName}>{badge.name}</Text>
          <Text style={styles.badgeDescription}>{badge.description}</Text>

          <PrimaryButton 
            title="Awesome!" 
            onPress={onClose} 
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFF',
    width: width * 0.85,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOW.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  congratsText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginHorizontal: SPACING.s,
  },
  badgeContainer: {
    marginBottom: SPACING.l,
  },
  badgeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DEF7EC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#059669',
  },
  badgeEmoji: {
    fontSize: 60,
  },
  badgeName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  badgeDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  button: {
    width: '100%',
  },
});
