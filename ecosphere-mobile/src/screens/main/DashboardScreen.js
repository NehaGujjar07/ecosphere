import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../context/UserContext';

const ALL_BADGES = [
  { id: 'eco_starter',   name: 'Eco Starter',   icon: '🌱', points_required: 20,  description: 'Earned 20 EcoPoints' },
  { id: 'green_shopper', name: 'Green Shopper', icon: '🛒', points_required: 40,  description: 'Earned 40 EcoPoints' },
  { id: 'eco_champion',  name: 'Eco Champion',  icon: '🏆', points_required: 100, description: 'Earned 100 EcoPoints' },
];

export default function DashboardScreen() {
  const { ecoPoints, level, badges, syncProfile, user, logoutUser } = useContext(UserContext);
  const [showLogout, setShowLogout] = React.useState(false);

  useEffect(() => {
    syncProfile();
  }, []);

  const VOUCHERS = [
    { id: 1, title: '15% Off Organic Groceries', code: 'ECOFRUIT15', brand: 'FreshEarth', color: '#10B981' },
    { id: 2, title: '₹200 Off Bamboo Home Decor', code: 'BAMBOO200', brand: 'EcoHome', color: '#3B82F6' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'Eco Warrior'} 👋</Text>
            <Text style={styles.title}>Your Impact</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={() => setShowLogout(!showLogout)}
          >
            <Ionicons name="person" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Logout Dropdown (Simple overlay) */}
        {showLogout && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownItem} onPress={logoutUser}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Points Card */}
        <LinearGradient
          colors={[COLORS.primaryLight, COLORS.primary]}
          style={styles.pointsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="leaf" size={48} color="rgba(255,255,255,0.2)" style={styles.bgIcon} />
          <Text style={styles.pointsLabel}>Total Eco Points</Text>
          <Text style={styles.pointsValue}>{ecoPoints.toLocaleString()}</Text>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>{level?.title || '🌱 Green Beginner'}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${level?.progress_percent || 0}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {level?.pts_to_next_level > 0 ? `${level.pts_to_next_level} pts to next level` : '🏆 Max Level!'}
            </Text>
          </View>
        </LinearGradient>

        {/* Vouchers Section */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Vouchers</Text>
            <Text style={styles.seeAll}>See All</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vouchersScroll}>
            {VOUCHERS.map(v => (
                <View key={v.id} style={[styles.voucherCard, { borderLeftColor: v.color }]}>
                    <Text style={styles.voucherBrand}>{v.brand}</Text>
                    <Text style={styles.voucherTitle}>{v.title}</Text>
                    <View style={styles.codeBadge}>
                        <Text style={styles.codeText}>{v.code}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>

        {/* Stats Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Environmental Savings</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="cloud-outline" size={24} color="#0284C7" />
            </View>
            <Text style={styles.statValue}>12.4 kg</Text>
            <Text style={styles.statLabel}>CO₂ Reduced</Text>
          </View>
          
          <View style={styles.statBox}>
            <View style={[styles.iconWrapper, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="trash-bin-outline" size={24} color="#D97706" />
            </View>
            <Text style={styles.statValue}>4.2 kg</Text>
            <Text style={styles.statLabel}>Waste Avoided</Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Badges</Text>
          <Text style={styles.badgeSubtitle}>{badges.length}/{ALL_BADGES.length} Unlocked</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
          {ALL_BADGES.map((badge) => {
            const unlocked = badges.some(b => b.id === badge.id);
            return (
              <View key={badge.id} style={[styles.badgeCard, !unlocked && styles.badgeLocked]}>
                <View style={[styles.badgeIconCircle, { backgroundColor: unlocked ? '#DEF7EC' : '#F3F4F6' }]}>
                  <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                </View>
                <Text style={[styles.badgeName, !unlocked && styles.badgeNameLocked]}>{badge.name}</Text>
                <Text style={styles.badgePts}>{badge.points_required} pts</Text>
              </View>
            );
          })}
        </ScrollView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: 100, // accommodate bottom tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.light,
  },
  dropdownContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    right: SPACING.l,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    zIndex: 1000,
    ...SHADOW.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
  },
  dropdownText: {
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.s,
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  pointsCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOW.large,
    marginBottom: SPACING.xl,
  },
  bgIcon: {
    position: 'absolute',
    right: -10,
    top: -10,
    transform: [{ scale: 4 }],
  },
  pointsLabel: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.xs,
  },
  pointsValue: {
    ...TYPOGRAPHY.h1,
    fontSize: 48,
    color: '#FFF',
    marginBottom: SPACING.m,
  },
  levelContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: RADIUS.m,
    padding: SPACING.m,
  },
  levelText: {
    ...TYPOGRAPHY.caption,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: SPACING.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 3,
  },
  progressText: {
    ...TYPOGRAPHY.small,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  seeAll: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  vouchersScroll: {
    marginBottom: SPACING.xl,
    marginLeft: -SPACING.xs,
  },
  voucherCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    marginHorizontal: SPACING.xs,
    width: 200,
    ...SHADOW.light,
    borderLeftWidth: 4,
  },
  voucherBrand: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  voucherTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 4,
  },
  codeBadge: {
    backgroundColor: COLORS.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  codeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    marginHorizontal: SPACING.xs,
    ...SHADOW.light,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  badgesScroll: {
    paddingVertical: SPACING.s,
    marginLeft: -SPACING.xs,
  },
  badgeCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    marginHorizontal: SPACING.xs,
    width: 110,
    ...SHADOW.light,
  },
  badgeIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  badgeName: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  badgeNameLocked: {
    color: COLORS.textMuted,
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeEmoji: {
    fontSize: 30,
  },
  badgePts: {
    ...TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badgeSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
