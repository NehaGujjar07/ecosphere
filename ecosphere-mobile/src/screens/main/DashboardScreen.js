import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Dimensions, TextInput } from 'react-native';
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
  withTiming,
  Layout
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 450) : SCREEN_WIDTH;

// --- INTERNAL CHART COMPONENT ---
const TrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.co2 + d.waste), 5);
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartTitleRow}>
        <Text style={styles.chartTitle}>IMPACT HISTORY (6m)</Text>
        <View style={styles.legend}>
           <View style={[styles.dot, { backgroundColor: '#0284C7' }]} /><Text style={styles.legendText}>CO2</Text>
           <View style={[styles.dot, { backgroundColor: '#D97706' }]} /><Text style={styles.legendText}>Waste</Text>
        </View>
      </View>
      <View style={styles.barsArea}>
         {data.map((item, i) => (
           <View key={i} style={styles.barColumn}>
              <View style={styles.barStack}>
                 <Animated.View 
                    entering={FadeInDown.delay(i * 100).duration(800)}
                    style={[styles.barPart, { backgroundColor: '#0284C7', height: `${(item.co2/maxVal)*100}%` }]} 
                 />
                 <Animated.View 
                    entering={FadeInDown.delay(i * 100 + 50).duration(800)}
                    style={[styles.barPart, { backgroundColor: '#D97706', height: `${(item.waste/maxVal)*100}%` }]} 
                 />
              </View>
              <Text style={styles.barLabel}>{item.month}</Text>
           </View>
         ))}
      </View>
    </View>
  );
};

// --- SCENARIO SIMULATOR COMPONENT ---
const ScenarioSimulator = () => {
  const [bottles, setBottles] = useState(5);
  const [meatFree, setMeatFree] = useState(2);
  
  const simCO2 = (bottles * 0.5) + (meatFree * 2.5);
  const simWaste = (bottles * 0.1);

  return (
    <View style={styles.simCard}>
       <View style={styles.simHeader}>
         <Ionicons name="flask" size={20} color={COLORS.primary} />
         <Text style={styles.simTitle}>WHAT-IF SCENARIO</Text>
       </View>
       <Text style={styles.simDesc}>If I change my habits next month...</Text>
       
       <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Skip Plastic Bottles: {bottles}</Text>
          <View style={styles.sliderControls}>
             <TouchableOpacity onPress={() => setBottles(Math.max(0, bottles-1))} style={styles.circleBtn}><Ionicons name="remove" size={16} color={COLORS.primary} /></TouchableOpacity>
             <TouchableOpacity onPress={() => setBottles(bottles+1)} style={styles.circleBtn}><Ionicons name="add" size={16} color={COLORS.primary} /></TouchableOpacity>
          </View>
       </View>

       <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>Meat-free Days: {meatFree}</Text>
          <View style={styles.sliderControls}>
             <TouchableOpacity onPress={() => setMeatFree(Math.max(0, meatFree-1))} style={styles.circleBtn}><Ionicons name="remove" size={16} color={COLORS.primary} /></TouchableOpacity>
             <TouchableOpacity onPress={() => setMeatFree(meatFree+1)} style={styles.circleBtn}><Ionicons name="add" size={16} color={COLORS.primary} /></TouchableOpacity>
          </View>
       </View>

       <View style={styles.simResult}>
          <View style={styles.simResultItem}>
             <Text style={styles.simResultValue}>{simCO2.toFixed(1)}kg</Text>
             <Text style={styles.simResultLabel}>CO2 SAVED</Text>
          </View>
          <View style={styles.simResultDivider} />
          <View style={styles.simResultItem}>
             <Text style={styles.simResultValue}>{simWaste.toFixed(2)}kg</Text>
             <Text style={styles.simResultLabel}>WASTE AVOIDED</Text>
          </View>
       </View>
    </View>
  );
};

export default function DashboardScreen({ navigation }) {
  const { 
    ecoPoints, level, badges, allBadges, syncProfile, user, logoutUser, 
    AVAILABLE_VOUCHERS, claimedVouchers, claimVoucher, 
    co2Saved, wasteAvoided, history, trends
  } = useContext(UserContext);
  const [showLogout, setShowLogout] = React.useState(false);

  useEffect(() => {
    syncProfile();
  }, []);

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
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.avatarGradient}>
              <Ionicons name="person" size={22} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {showLogout && (
          <Animated.View entering={FadeInDown.duration(200)} style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownItem} onPress={logoutUser}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
              <Text style={styles.dropdownText}>Sign Out</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Global Impact Summary */}
        <Animated.View entering={FadeInDown.delay(200).duration(800)}>
          <LinearGradient colors={['#064E3B', '#10B981']} style={styles.impactHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
             <View style={styles.heroRow}>
                <View>
                   <Text style={styles.heroLabel}>IMPACT POINTS</Text>
                   <Text style={styles.heroPoints}>{ecoPoints.toLocaleString()}</Text>
                </View>
                <View style={styles.levelPill}>
                   <Text style={styles.levelPillText}>LVL {level?.level || 1}</Text>
                </View>
             </View>
             <View style={styles.progressSection}>
                <View style={styles.progressBarBg}><Animated.View style={[styles.progressBarFill, progressBarInfo]} /></View>
                <Text style={styles.heroSubText}>{level?.title || 'Eco Starter'}</Text>
             </View>
          </LinearGradient>
        </Animated.View>

        {/* Analytics Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(800)}>
            <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Analytics & Insights</Text>
            </View>
            <TrendChart data={trends} />
            <ScenarioSimulator />
        </Animated.View>

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
           <View style={[styles.statBox, { borderLeftColor: '#0284C7', borderLeftWidth: 4 }]}>
              <Text style={styles.statLabel}>CO2 SAVED</Text>
              <Text style={styles.statValue}>{co2Saved.toFixed(1)}kg</Text>
           </View>
           <View style={[styles.statBox, { borderLeftColor: '#D97706', borderLeftWidth: 4 }]}>
              <Text style={styles.statLabel}>WASTE SAVED</Text>
              <Text style={styles.statValue}>{wasteAvoided.toFixed(1)}kg</Text>
           </View>
        </View>

        {/* Sustainability Ledger */}
        <Animated.View entering={FadeInDown.delay(600).duration(800)}>
           <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Eco Ledger</Text>
              <Text style={styles.seeAll}>RECENTS</Text>
           </View>
           <View style={styles.ledgerArea}>
              {history && history.length > 0 ? (
                history.map((item, idx) => (
                  <View key={idx} style={styles.ledgerItem}>
                     <View style={styles.ledgerDate}>
                        <Text style={styles.dayText}>{item.date?.split('-')[2]?.split(' ')[0] || '06'}</Text>
                        <Text style={styles.monthText}>APR</Text>
                     </View>
                     <View style={styles.ledgerInfo}>
                        <Text style={styles.ledgerTitle}>{item.items_count} items purchased</Text>
                        <Text style={styles.ledgerSub}>Impact: +{item.points_awarded} pts</Text>
                     </View>
                     <View style={styles.ledgerImpact}>
                        <Text style={styles.impactText}>-{item.co2_saved.toFixed(1)}kg CO2</Text>
                     </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No transactions recorded yet.</Text>
              )}
           </View>
        </Animated.View>

        {/* Vouchers and Rewards (Scrollable) */}
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Rewards</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vouchersScroll}>
           {AVAILABLE_VOUCHERS.map(v => (
             <TouchableOpacity key={v.id} style={styles.voucherCard} onPress={() => claimVoucher(v.code)}>
                <Text style={[styles.voucherBrand, { color: v.color }]}>{v.brand}</Text>
                <Text style={styles.voucherTitle}>{v.title}</Text>
                <View style={styles.voucherFooter}><Text style={styles.voucherLabel}>USE CODE: {v.code}</Text></View>
             </TouchableOpacity>
           ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1, width: CONTENT_WIDTH, alignSelf: 'center' },
  scrollContent: { padding: SPACING.l, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 40 : 20, marginBottom: SPACING.l },
  greeting: { fontSize: 13, color: COLORS.slateMuted, fontWeight: '600' },
  title: { ...TYPOGRAPHY.h1, color: COLORS.slate },
  avatarContainer: { width: 44, height: 44, borderRadius: 22, ...SHADOW.medium },
  avatarGradient: { width: '100%', height: '100%', borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  dropdownContainer: { position: 'absolute', top: 100, right: 20, backgroundColor: '#FFF', borderRadius: 12, padding: 12, zIndex: 10, ...SHADOW.large },
  dropdownItem: { flexDirection: 'row', alignItems: 'center' },
  dropdownText: { marginLeft: 10, fontWeight: 'bold', color: COLORS.danger },
  impactHero: { padding: 24, borderRadius: RADIUS.xl, marginBottom: 24, ...SHADOW.large },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  heroPoints: { fontSize: 36, fontWeight: '900', color: '#FFF' },
  levelPill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  levelPillText: { fontSize: 10, fontWeight: '900', color: '#FFF' },
  progressSection: { marginTop: 20 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 3 },
  heroSubText: { fontSize: 13, color: '#FFF', fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.slate },
  seeAll: { fontSize: 10, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },
  chartContainer: { backgroundColor: '#FFF', padding: 20, borderRadius: RADIUS.l, marginBottom: 16, ...SHADOW.medium },
  chartTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  chartTitle: { fontSize: 10, fontWeight: '900', color: COLORS.slateMuted, letterSpacing: 0.5 },
  legend: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 4, marginLeft: 12 },
  legendText: { fontSize: 10, fontWeight: '800', color: COLORS.slateMuted },
  barsArea: { height: 120, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  barColumn: { alignItems: 'center', flex: 1 },
  barStack: { width: 12, height: '100%', backgroundColor: '#F1F5F9', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  barPart: { width: '100%', borderRadius: 6 },
  barLabel: { marginTop: 8, fontSize: 10, fontWeight: '800', color: COLORS.slateMuted },
  simCard: { backgroundColor: '#FFF', padding: 20, borderRadius: RADIUS.l, marginBottom: 20, ...SHADOW.medium },
  simHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  simTitle: { fontSize: 11, fontWeight: '900', color: COLORS.primary, marginLeft: 8 },
  simDesc: { fontSize: 14, fontWeight: '700', color: COLORS.slate, marginBottom: 20 },
  sliderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sliderLabel: { fontSize: 12, fontWeight: '600', color: COLORS.slateMuted },
  sliderControls: { flexDirection: 'row', alignItems: 'center' },
  circleBtn: { width: 32, height: 32, borderRadius: 16, borderWeight: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  simResult: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginTop: 8 },
  simResultItem: { flex: 1, alignItems: 'center' },
  simResultValue: { fontSize: 16, fontWeight: '900', color: COLORS.slate },
  simResultLabel: { fontSize: 9, fontWeight: '800', color: COLORS.slateMuted, marginTop: 4 },
  simResultDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: '#FFF', padding: 16, borderRadius: 12, ...SHADOW.small },
  statLabel: { fontSize: 9, fontWeight: '900', color: COLORS.slateMuted, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '900', color: COLORS.slate },
  ledgerArea: { backgroundColor: '#FFF', borderRadius: RADIUS.l, padding: 12, ...SHADOW.small, marginBottom: 24 },
  ledgerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  ledgerDate: { width: 45, alignItems: 'center' },
  dayText: { fontSize: 16, fontWeight: '900', color: COLORS.slate },
  monthText: { fontSize: 9, fontWeight: '800', color: COLORS.primary },
  ledgerInfo: { flex: 1, marginLeft: 12 },
  ledgerTitle: { fontSize: 13, fontWeight: '700', color: COLORS.slate },
  ledgerSub: { fontSize: 11, color: COLORS.slateMuted, marginTop: 2 },
  ledgerImpact: { alignItems: 'flex-end' },
  impactText: { fontSize: 12, fontWeight: '900', color: '#059669' },
  vouchersScroll: { paddingBottom: 10 },
  voucherCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginRight: 12, width: 200, ...SHADOW.small, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  voucherBrand: { fontSize: 10, fontWeight: '900', marginBottom: 4 },
  voucherTitle: { fontSize: 13, fontWeight: '700', color: COLORS.slate, marginBottom: 12 },
  voucherFooter: { backgroundColor: '#F8FAFC', padding: 6, borderRadius: 4 },
  voucherLabel: { fontSize: 9, fontWeight: '800', color: COLORS.slateMuted },
  emptyText: { textAlign: 'center', padding: 20, color: COLORS.slateMuted, fontStyle: 'italic' },
});
