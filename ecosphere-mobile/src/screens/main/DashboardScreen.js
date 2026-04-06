import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../context/UserContext';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 450) : SCREEN_WIDTH;

export default function DashboardScreen({ navigation }) {
  const { 
    ecoPoints, level, badges, allBadges, syncProfile, user, logoutUser, 
    AVAILABLE_VOUCHERS, claimedVouchers, claimVoucher, 
    co2Saved, wasteAvoided 
  } = useContext(UserContext);
  const [showLogout, setShowLogout] = React.useState(false);

  useEffect(() => {
    syncProfile();
  }, []);

  // Animated progress bar
  const progress = useSharedValue(0);
  useEffect(() => {
    if (level?.progress_percent) {
      progress.value = withDelay(500, withSpring(level.progress_percent / 100, { damping: 15 }));
    }
  }, [level]);

  const progressBarInfo = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Explorer'} 👋</Text>
            <Text style={styles.title}>Your Impact</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={() => setShowLogout(!showLogout)}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.avatarGradient}
            >
              <Ionicons name="person" size={22} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Logout Popover */}
        {showLogout && (
          <Animated.View entering={FadeInDown.duration(200)} style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownItem} onPress={logoutUser}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
              <Text style={styles.dropdownText}>Sign Out</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Main Score Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <LinearGradient
            colors={['#064E3B', '#059669']}
            style={styles.pointsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="leaf" size={140} color="rgba(255,255,255,0.08)" style={styles.bgIcon} />
            <View style={styles.pointsHeader}>
              <View>
                <Text style={styles.pointsLabel}>ECO POINTS BALANCE</Text>
                <Text style={styles.pointsValue}>{ecoPoints.toLocaleString()}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>LVL {level?.level || 1}</Text>
              </View>
            </View>

            <View style={styles.levelContainer}>
              <View style={styles.levelHeader}>
                <Text style={styles.levelTitle}>{level?.title || 'Green Beginner'}</Text>
                <Text style={styles.progressPercent}>{level?.progress_percent || 0}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <Animated.View style={[styles.progressBarFill, progressBarInfo]} />
              </View>
               <Text style={styles.progressText}>
                 {level?.pts_to_next_level > 0 
                   ? `${level.pts_to_next_level} pts to unlock ${level.next_level_title}` 
                   : '🏆 Maximum Level Reached'}
               </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Environmental Savings */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Planet Impact</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { borderBottomColor: '#0284C7', borderBottomWidth: 3 }]}>
              <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="cloud-done" size={24} color="#0284C7" />
              </View>
              <Text style={styles.statValue}>{co2Saved.toFixed(1)}kg</Text>
              <Text style={styles.statLabel}>CO₂ OFFSET</Text>
            </View>
            
            <View style={[styles.statBox, { borderBottomColor: '#D97706', borderBottomWidth: 3 }]}>
              <View style={[styles.iconWrapper, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="trash" size={24} color="#D97706" />
              </View>
              <Text style={styles.statValue}>{wasteAvoided.toFixed(1)}kg</Text>
              <Text style={styles.statLabel}>WASTE SAVED</Text>
            </View>
          </View>
        </Animated.View>

        {/* Rewards Section */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)}>
          <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Eco Rewards</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Market')}><Text style={styles.seeAll}>VIEW SHOP</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vouchersScroll}>
              {AVAILABLE_VOUCHERS.map((v, index) => {
                  const isClaimed = claimedVouchers.includes(v.code);
                  return (
                    <Animated.View key={v.id} entering={FadeInRight.delay(700 + index * 100)}>
                      <TouchableOpacity 
                        style={[styles.voucherCard, isClaimed && styles.voucherClaimed]}
                        onPress={() => claimVoucher(v.code)}
                        disabled={isClaimed}
                      >
                          <View style={styles.voucherTop}>
                            <Text style={[styles.voucherBrand, { color: v.color }]}>{v.brand}</Text>
                            {isClaimed && <Ionicons name="checkmark-seal" size={20} color={v.color} />}
                          </View>
                          <Text style={styles.voucherTitle}>{v.title}</Text>
                          <View style={[styles.codeBadge, { borderColor: v.color }]}>
                              <Text style={[styles.codeText, { color: v.color }]}>{isClaimed ? 'REDEEMED' : v.code}</Text>
                          </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
              })}
          </ScrollView>
        </Animated.View>

        {/* Badges */}
        <Animated.View entering={FadeInDown.delay(800).duration(800)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Milestones</Text>
            <View style={styles.badgeCountBadge}>
              <Text style={styles.badgeCountText}>{badges.length}/{allBadges.length || 3}</Text>
            </View>
          </View>
          <View style={styles.badgesContainer}>
            {((allBadges && allBadges.length > 0) ? allBadges : [
              { id: 'eco_warrior',        name: 'Eco Warrior',        icon: '🛡️', points_required: 40 },
              { id: 'sustainability_pro', name: 'Sustainability Pro', icon: '🌟', points_required: 80 },
              { id: 'planet_hero',        name: 'Planet Hero',        icon: '💎', points_required: 120 },
            ]).map((badge, index) => {
              const unlocked = badges.some(b => b.id === badge.id);
              return (
                <View key={badge.id} style={styles.badgeWrapper}>
                  <View style={[styles.badgeIconBox, !unlocked && styles.badgeLocked]}>
                    <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                    {!unlocked && <View style={styles.lockOverlay}><Ionicons name="lock-closed" size={12} color="#FFF" /></View>}
                  </View>
                  <Text style={[styles.badgeLabel, !unlocked && styles.textMuted]}>{badge.name}</Text>
                  <Text style={styles.badgePointsReq}>{badge.points_required} pts</Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    width: CONTENT_WIDTH,
    alignSelf: 'center',
  },
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: 120,
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
    fontWeight: '500',
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    ...SHADOW.medium,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    right: SPACING.l,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    zIndex: 1000,
    ...SHADOW.large,
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
    right: -20,
    bottom: -20,
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  pointsLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  pointsValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -1,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  levelBadgeText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
  },
  levelContainer: {
    marginTop: SPACING.l,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: SPACING.m,
    borderRadius: RADIUS.l,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressPercent: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
    marginTop: SPACING.s,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
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
    padding: SPACING.l,
    marginHorizontal: 6,
    ...SHADOW.medium,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    fontSize: 22,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  vouchersScroll: {
    marginBottom: SPACING.xl,
    paddingLeft: 2,
    paddingBottom: 8,
  },
  voucherCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.l,
    borderRadius: RADIUS.l,
    marginRight: SPACING.m,
    width: 220,
    ...SHADOW.medium,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  voucherClaimed: {
    backgroundColor: '#F8FAFC',
    opacity: 0.8,
  },
  voucherTop: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
  },
  voucherBrand: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  voucherTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  codeBadge: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.s,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    padding: SPACING.l,
    borderRadius: RADIUS.xl,
    ...SHADOW.medium,
  },
  badgeWrapper: {
    alignItems: 'center',
  },
  badgeIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  badgeLocked: {
    opacity: 0.3,
    backgroundColor: '#F1F5F9',
  },
  badgeEmoji: {
    fontSize: 32,
  },
  lockOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#64748B',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },
  badgePointsReq: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  badgeCountBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  badgeCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  textMuted: {
    color: COLORS.textMuted,
  },
});
