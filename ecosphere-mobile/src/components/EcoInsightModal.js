import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeOutDown } from 'react-native-reanimated';
import PrimaryButton from './PrimaryButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 450) : SCREEN_WIDTH;

export default function EcoInsightModal({ visible, onClose, onConfirm, type = 'warning', product }) {
  const isWarning = type === 'warning';
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View 
          entering={FadeInUp.duration(400)} 
          exiting={FadeOutDown.duration(300)}
          style={styles.card}
        >
          <View style={[styles.header, isWarning ? styles.headerWarning : styles.headerInfo]}>
             <Ionicons 
                name={isWarning ? "alert-triangle" : "bulb"} 
                size={40} 
                color="#FFF" 
             />
             <Text style={styles.headerText}>{isWarning ? "ECO-ALERT" : "ECO-INSIGHT"}</Text>
          </View>

          <View style={styles.body}>
             <Text style={styles.title}>{isWarning ? "Low Sustainability Score" : "Sustainability Tip"}</Text>
             <Text style={styles.description}>
                {isWarning 
                  ? `The item "${product?.name}" has a low Eco-Rating (${product?.eco_rating}). It may contain high-waste materials or have a significant carbon footprint.` 
                  : "Consider checking out some of our carbon-neutral alternatives for a similar experience!"
                }
             </Text>

             {isWarning && (
                <View style={styles.warningBox}>
                   <View style={styles.warningRow}>
                      <Ionicons name="trash" size={16} color="#DC2626" />
                      <Text style={styles.warningText}>Non-Recyclable Packaging</Text>
                   </View>
                   <View style={styles.warningRow}>
                      <Ionicons name="cloud" size={16} color="#DC2626" />
                      <Text style={styles.warningText}>High Carbon Impact</Text>
                   </View>
                </View>
             )}

             <View style={styles.actionRow}>
                <PrimaryButton 
                   title="BACK TO SHOP" 
                   onPress={onClose} 
                   style={styles.fullBtn}
                />
                <TouchableOpacity style={styles.anywayBtn} onPress={onConfirm}>
                   <Text style={styles.anywayBtnText}>
                      {isWarning ? "Add Anyway" : "Go to Market"}
                   </Text>
                </TouchableOpacity>
             </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    width: '90%',
    maxWidth: 380,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.float,
  },
  header: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  headerWarning: { backgroundColor: '#DC2626' },
  headerInfo: { backgroundColor: COLORS.primary },
  headerText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFF',
    marginLeft: 12,
    letterSpacing: 1.5,
  },
  body: {
    padding: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.slate,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.slateMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  warningBox: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: RADIUS.m,
    marginBottom: 24,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
    marginLeft: 10,
  },
  actionRow: {
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  fullBtn: {
    width: '100%',
    marginBottom: 16,
  },
  anywayBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  anywayBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.slateMuted,
    textDecorationLine: 'underline',
    letterSpacing: 0.5,
  },
});
