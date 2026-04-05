import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../context/UserContext';
import PrimaryButton from '../../components/PrimaryButton';
import BadgeUnlockModal from '../../components/BadgeUnlockModal';

export default function CheckoutScreen({ navigation }) {
  const { cart, clearCart, user, syncProfile } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  const totalAmount = cart.reduce((acc, item) => {
    const rawPrice = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
    return acc + (rawPrice * item.quantity);
  }, 0);

  // Total items count (each item * its quantity)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const pointsToEarn = totalItems * 5; // 5 pts per item

  const handleCheckout = async () => {
    if (!user?.id) {
      Alert.alert('Not logged in', 'Please log in to complete your purchase.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/game/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, items_count: totalItems }),
      });
      const data = await res.json();

      if (data.success) {
        // Sync the new live points/badges into context
        await syncProfile();
        clearCart();

        // Check for newly unlocked badges
        const newBadges = data.new_badges || [];
        if (newBadges.length > 0) {
          setNewBadge(newBadges[0]); // Show the first new badge in the modal
          setShowBadgeModal(true);
        } else {
          Alert.alert(
            '✅ Purchase Complete!',
            `You earned +${data.points_awarded} EcoPoints! Total: ${data.total_points} pts`,
            [{ text: 'View Dashboard', onPress: () => navigation.navigate('MainApp') }]
          );
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Could not connect to the server to record your purchase.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <BadgeUnlockModal 
        visible={showBadgeModal} 
        badge={newBadge} 
        onClose={() => {
          setShowBadgeModal(false);
          navigation.navigate('MainApp');
        }} 
      />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Your cart is empty.</Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>

            <View style={styles.card}>
              {cart.map((item, index) => (
                <View key={`${item.id}-${index}`} style={styles.cartItem}>
                  <View style={styles.cartInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                  </View>
                  <View style={styles.cartPrices}>
                    <Text style={styles.itemPrice}>{item.price}</Text>
                    <Text style={styles.itemPoints}>+{item.quantity * 5} pts</Text>
                  </View>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{totalAmount.toLocaleString()}</Text>
              </View>

              <View style={styles.pointsEarnRow}>
                <Ionicons name="leaf" size={20} color="#059669" />
                <Text style={styles.pointsEarnText}>
                  You will earn {pointsToEarn} EcoPoints ({totalItems} items × 5 pts)
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View style={styles.footer}>
          <PrimaryButton
            title={loading ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString()}`}
            onPress={handleCheckout}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.l, marginBottom: SPACING.xl },
  backBtn: { padding: SPACING.s, marginLeft: -SPACING.s, marginRight: SPACING.m },
  title: { ...TYPOGRAPHY.h2, color: COLORS.text },
  scrollContainer: { paddingHorizontal: SPACING.l, paddingBottom: 120 },
  emptyCart: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { ...TYPOGRAPHY.body, color: COLORS.textMuted, marginTop: SPACING.m },
  sectionHeader: { marginBottom: SPACING.m },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.l, padding: SPACING.l, ...SHADOW.light },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.m },
  cartInfo: { flex: 1 },
  itemName: { ...TYPOGRAPHY.body, fontWeight: 'bold', color: COLORS.text },
  itemQty: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, marginTop: 4 },
  cartPrices: { alignItems: 'flex-end' },
  itemPrice: { ...TYPOGRAPHY.body, color: COLORS.text },
  itemPoints: { ...TYPOGRAPHY.caption, fontWeight: 'bold', color: '#059669', marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.m },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.l },
  totalLabel: { ...TYPOGRAPHY.h3, color: COLORS.text },
  totalValue: { ...TYPOGRAPHY.h2, color: COLORS.text },
  pointsEarnRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ECFDF5', padding: SPACING.m, borderRadius: RADIUS.s,
  },
  pointsEarnText: { ...TYPOGRAPHY.body, color: '#065F46', fontWeight: 'bold', marginLeft: SPACING.s },
  footer: {
    position: 'absolute', bottom: 0, width: '100%',
    backgroundColor: COLORS.surface, padding: SPACING.xl,
    borderTopWidth: 1, borderTopColor: COLORS.border, ...SHADOW.large,
  },
});
