import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Alert, TextInput, Modal, Dimensions } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../context/UserContext';
import PrimaryButton from '../../components/PrimaryButton';
import BadgeUnlockModal from '../../components/BadgeUnlockModal';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 450) : SCREEN_WIDTH;

export default function CheckoutScreen({ navigation }) {
  const { cart, clearCart, user, syncProfile, AVAILABLE_VOUCHERS } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderPoints, setOrderPoints] = useState(0);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [activeVoucherMessage, setActiveVoucherMessage] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const totalAmount = cart.reduce((acc, item) => {
    const rawPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
    return acc + (rawPrice * item.quantity);
  }, 0);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const pointsToEarn = totalItems * 5;
  const totalCO2Saved = cart.reduce((acc, item) => acc + (item.co2_saved * item.quantity), 0);
  const totalWasteAvoided = cart.reduce((acc, item) => acc + (item.waste_avoided * item.quantity), 0);

  const handleApplyVoucher = () => {
    if (!voucherCode) return;
    const codeToApply = voucherCode.trim().toUpperCase();
    const voucher = AVAILABLE_VOUCHERS.find(v => v.code === codeToApply);
    
    if (!voucher) {
      Alert.alert('Invalid Voucher', 'Code not found. Try ECOFRUIT15.');
      return;
    }

    let discountAmt = voucher.type === 'percent' ? totalAmount * (voucher.discount / 100) : voucher.discount;
    setAppliedDiscount(Math.min(discountAmt, totalAmount));
    setActiveVoucherMessage(`You saved ₹${Math.round(discountAmt)} using ${voucher.title}!`);
    setShowVoucherModal(true);
  };

  const finalAmount = Math.max(0, totalAmount - appliedDiscount);

  const handleCheckout = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/game/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user.id, 
          items_count: totalItems,
          co2_saved: totalCO2Saved,
          waste_avoided: totalWasteAvoided
        }),
      });
      const data = await res.json();
      if (data.success) {
        await syncProfile();
        clearCart();
        setAppliedDiscount(0);
        const newBadges = data.new_badges || [];
        if (newBadges.length > 0) {
          setNewBadge(newBadges[0]);
          setShowBadgeModal(true);
        } else {
          setOrderPoints(data.points_awarded);
          setShowOrderModal(true);
        }
      }
    } catch (e) {
      Alert.alert('Checkout Failed', 'Please try again later.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* SUCCESS MODALS */}
      <Modal visible={showOrderModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInUp} style={styles.successCard}>
             <Ionicons name="checkmark-done-circle" size={80} color={COLORS.primary} />
             <Text style={styles.successTitle}>Order Secured!</Text>
             <Text style={styles.successSubtitle}>Eco Warriors earned +{orderPoints} pts!</Text>
             <PrimaryButton 
                title="BACK TO IMPACT" 
                onPress={() => { setShowOrderModal(false); navigation.navigate('MainApp'); }} 
                style={{ width: '100%', marginTop: SPACING.l }}
             />
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={showVoucherModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInUp} style={styles.voucherModalContent}>
            <Ionicons name="gift" size={60} color={COLORS.primary} style={{ marginBottom: SPACING.m }} />
            <Text style={styles.voucherModalTitle}>SAVINGS APPLIED!</Text>
            <Text style={styles.voucherModalBody}>{activeVoucherMessage}</Text>
            <PrimaryButton 
               title="AWESOME" 
               onPress={() => setShowVoucherModal(false)} 
               style={{ width: '100%', marginTop: SPACING.l }}
            />
          </Animated.View>
        </View>
      </Modal>

      <BadgeUnlockModal visible={showBadgeModal} badge={newBadge} onClose={() => { setShowBadgeModal(false); navigation.navigate('MainApp'); }} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={COLORS.slate} />
        </TouchableOpacity>
        <Text style={styles.title}>Review Order</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cart.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="bag-outline" size={80} color={COLORS.border} />
            <Text style={styles.emptyText}>Your bag is empty warrior!</Text>
            <PrimaryButton title="Go Shopping" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
          </View>
        ) : (
          <>
            {/* PAYMENT */}
            <Animated.View entering={FadeInDown.delay(100)} style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Focus</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200)} style={styles.paymentCard}>
              <TouchableOpacity style={styles.payRow} onPress={() => setPaymentMethod('cod')}>
                <View style={styles.payInfo}>
                  <View style={[styles.payIcon, paymentMethod === 'cod' && styles.payIconActive]}>
                    <Ionicons name="cash" size={20} color={paymentMethod === 'cod' ? '#FFF' : COLORS.textMuted} />
                  </View>
                  <Text style={[styles.payTitle, paymentMethod === 'cod' && styles.payTitleActive]}>Cash on Delivery</Text>
                </View>
                <Ionicons name={paymentMethod === 'cod' ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={paymentMethod === 'cod' ? COLORS.primary : COLORS.border} />
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.payRow} onPress={() => setPaymentMethod('card')}>
                <View style={styles.payInfo}>
                  <View style={[styles.payIcon, paymentMethod === 'card' && styles.payIconActive]}>
                    <Ionicons name="card" size={20} color={paymentMethod === 'card' ? '#FFF' : COLORS.textMuted} />
                  </View>
                  <Text style={[styles.payTitle, paymentMethod === 'card' && styles.payTitleActive]}>Eco Card (Coming Soon)</Text>
                </View>
                <Ionicons name="lock-closed" size={20} color={COLORS.border} />
              </TouchableOpacity>
            </Animated.View>

            {/* VOUCHER */}
            <Animated.View entering={FadeInDown.delay(300)} style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Promo Code</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(400)} style={styles.voucherRow}>
              <TextInput 
                style={styles.vInput}
                placeholder="Enter Code"
                value={voucherCode}
                onChangeText={setVoucherCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.vApply} onPress={handleApplyVoucher}>
                <Text style={styles.vApplyText}>APPLY</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* SUMMARY */}
            <Animated.View entering={FadeInDown.delay(500)} style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(600)} style={styles.summaryCard}>
              {cart.map((item, index) => (
                <View key={index} style={styles.sumRow}>
                  <View style={styles.sumLabelCol}>
                    <Text style={styles.sumItemName}>{item.name}</Text>
                    <Text style={styles.sumItemQty}>QTY: {item.quantity}</Text>
                  </View>
                  <Text style={styles.sumItemPrice}>{item.price}</Text>
                </View>
              ))}
              
              <View style={styles.divider} />
              
              <View style={styles.billLine}>
                <Text style={styles.billLab}>Subtotal</Text>
                <Text style={styles.billVal}>₹{totalAmount.toLocaleString()}</Text>
              </View>
              
              {appliedDiscount > 0 && (
                <Animated.View entering={FadeInRight} style={styles.billLine}>
                  <Text style={[styles.billLab, { color: COLORS.primary }]}>Eco Savings</Text>
                  <Text style={[styles.billVal, { color: COLORS.primary }]}>- ₹{Math.round(appliedDiscount)}</Text>
                </Animated.View>
              )}
              
              <View style={styles.divider} />
              
              <View style={styles.billLine}>
                <Text style={[styles.billLab, { color: COLORS.slate, fontSize: 18, fontWeight: '800' }]}>Total</Text>
                <Text style={[styles.billVal, { color: COLORS.slate, fontSize: 24, fontWeight: '800' }]}>₹{Math.round(finalAmount).toLocaleString()}</Text>
              </View>

              <View style={styles.impactRecap}>
                <Ionicons name="planet" size={20} color={COLORS.primary} />
                <Text style={styles.impactText}>This order saves {totalCO2Saved.toFixed(1)}kg of CO₂</Text>
              </View>
            </Animated.View>
          </>
        )}
      </ScrollView>

      {cart.length > 0 && (
        <Animated.View entering={FadeInUp.delay(800)} style={styles.footer}>
          <PrimaryButton
            title={loading ? 'PROCESSING...' : `PLACE ORDER • ₹${Math.round(finalAmount).toLocaleString()}`}
            onPress={handleCheckout}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
    backgroundColor: '#FFF',
    ...SHADOW.medium,
  },
  title: { ...TYPOGRAPHY.h3, color: COLORS.slate, fontWeight: '800' },
  backBtn: { padding: 4 },
  scrollContent: { 
    paddingHorizontal: SPACING.l, 
    paddingBottom: 160, 
    width: CONTENT_WIDTH, 
    alignSelf: 'center' 
  },
  emptyBox: { alignItems: 'center', marginTop: 80, padding: SPACING.xl },
  emptyText: { ...TYPOGRAPHY.h3, color: COLORS.textMuted, textAlign: 'center' },
  
  sectionHeader: { marginTop: SPACING.xl, marginBottom: SPACING.m },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: 1 },
  
  paymentCard: { backgroundColor: '#FFF', borderRadius: RADIUS.l, padding: SPACING.l, ...SHADOW.medium },
  payRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  payInfo: { flexDirection: 'row', alignItems: 'center' },
  payIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  payIconActive: { backgroundColor: COLORS.primary },
  payTitle: { fontSize: 15, fontWeight: '600', color: COLORS.slateMuted },
  payTitleActive: { color: COLORS.slate, fontWeight: '800' },
  
  voucherRow: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: RADIUS.l, overflow: 'hidden', paddingLeft: SPACING.l, ...SHADOW.medium, height: 56, alignItems: 'center' },
  vInput: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.slate },
  vApply: { backgroundColor: COLORS.slate, height: '100%', paddingHorizontal: 20, justifyContent: 'center' },
  vApplyText: { color: '#FFF', fontWeight: '900', fontSize: 12 },
  
  summaryCard: { backgroundColor: '#FFF', borderRadius: RADIUS.l, padding: SPACING.xl, ...SHADOW.large },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sumLabelCol: { flex: 1 },
  sumItemName: { fontSize: 14, fontWeight: '700', color: COLORS.slate },
  sumItemQty: { fontSize: 11, fontWeight: '800', color: COLORS.textMuted, marginTop: 2 },
  sumItemPrice: { fontSize: 14, fontWeight: '800', color: COLORS.slate },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  billLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  billLab: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  billVal: { fontSize: 14, fontWeight: '700', color: COLORS.slate },
  
  impactRecap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ECFDF5', padding: 12, borderRadius: RADIUS.m, marginTop: 16 },
  impactText: { fontSize: 12, fontWeight: '800', color: COLORS.primary, marginLeft: 8 },
  
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', padding: SPACING.xl, borderTopWidth: 1, borderTopColor: '#F1F5F9', ...SHADOW.large },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'center', alignItems: 'center' },
  successCard: { backgroundColor: '#FFF', padding: SPACING.xl, borderRadius: RADIUS.xl, alignItems: 'center', width: '85%', maxWidth: 380, ...SHADOW.float },
  successTitle: { ...TYPOGRAPHY.h2, color: COLORS.slate, marginTop: 16 },
  successSubtitle: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.primary, marginTop: 4 },
  
  voucherModalContent: { backgroundColor: '#FFF', padding: SPACING.xl, borderRadius: RADIUS.xl, alignItems: 'center', width: '85%', maxWidth: 380, ...SHADOW.float },
  voucherModalTitle: { ...TYPOGRAPHY.h2, color: COLORS.primary, marginBottom: 8 },
  voucherModalBody: { ...TYPOGRAPHY.body, color: COLORS.slateMuted, textAlign: 'center' },
});
