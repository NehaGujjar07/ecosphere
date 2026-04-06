import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../context/UserContext';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  FadeOut, 
  LinearTransition,
  Layout,
  SlideInRight
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTENT_WIDTH = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 450) : SCREEN_WIDTH;
const CARD_WIDTH = (CONTENT_WIDTH - SPACING.l * 2 - SPACING.m) / 2;

const PRODUCTS = [
  { 
    id: 1, name: "Bamboo Toothbrush set", brand: "EcoDaily", price: "₹450", points: 50, 
    image: require('../../../assets/products/prod_1.png'), category: "Personal Care", tag: "Zero Waste",
    material: "Sustainable Moso Bamboo", co2_saved: 0.8, waste_avoided: 0.15, eco_rating: "5/5"
  },
  { 
    id: 2, name: "Recycled Cotton Tote", brand: "ThreadGreen", price: "₹850", points: 100, 
    image: require('../../../assets/products/prod_2.png'), category: "Apparel", tag: "Ethical Fashion",
    material: "100% Recycled Cotton", co2_saved: 2.1, waste_avoided: 0.5, eco_rating: "4.8/5"
  },
  { 
    id: 3, name: "Reusable Coffee Cup", brand: "Oasis", price: "₹1,200", points: 150, 
    image: require('../../../assets/products/prod_3.png'), category: "Home", tag: "Plastic Free",
    material: "BPA-Free Glass & Silicone", co2_saved: 3.5, waste_avoided: 1.2, eco_rating: "5/5"
  },
  { 
    id: 4, name: "Organic Shampoo Bar", brand: "PureLather", price: "₹350", points: 40, 
    image: require('../../../assets/products/prod_4.png'), category: "Personal Care", tag: "Chemical Free",
    material: "Cold-pressed Oils & Herbs", co2_saved: 0.5, waste_avoided: 0.3, eco_rating: "4.9/5"
  },
  { 
    id: 5, name: "Beeswax Wrap (Set of 3)", brand: "EcoWrap", price: "₹950", points: 120, 
    image: require('../../../assets/products/prod_5.png'), category: "Home", tag: "Alternative",
    material: "Organic Cotton & Beeswax", co2_saved: 1.2, waste_avoided: 0.8, eco_rating: "4.7/5"
  },
  { 
    id: 6, name: "Solar Power Bank", brand: "SunVolt", price: "₹2,500", points: 300, 
    image: require('../../../assets/products/prod_6.png'), category: "Home", tag: "Energy",
    material: "Monocrystalline Silicon", co2_saved: 12.0, waste_avoided: 0.4, eco_rating: "4.5/5"
  },
  { 
    id: 7, name: "Hemp Vegan Sneakers", brand: "WalkGreen", price: "₹4,500", points: 500, 
    image: require('../../../assets/products/prod_7.png'), category: "Apparel", tag: "Apparel",
    material: "Industrial Hemp Fibers", co2_saved: 8.5, waste_avoided: 1.0, eco_rating: "5/5"
  },
  { 
    id: 8, name: "Biodegradable Phone Case", brand: "Pela", price: "₹1,800", points: 200, 
    image: require('../../../assets/products/prod_8.png'), category: "Personal Care", tag: "Compostable",
    material: "Flax-based Bio-polymer", co2_saved: 1.5, waste_avoided: 0.2, eco_rating: "4.8/5"
  },
  { 
    id: 9, name: "Stainless Steel Straws", brand: "EcoSip", price: "₹300", points: 30, 
    image: require('../../../assets/products/prod_9.png'), category: "Home", tag: "Zero Waste",
    material: "Food-grade Steel", co2_saved: 0.4, waste_avoided: 1.5, eco_rating: "5/5"
  },
  { 
    id: 10, name: "Upcycled Denim Jacket", brand: "ReWeave", price: "₹5,200", points: 600, 
    image: require('../../../assets/products/prod_10.png'), category: "Apparel", tag: "Vintage",
    material: "Salvaged Denim", co2_saved: 15.0, waste_avoided: 2.5, eco_rating: "5/5"
  },
  { 
    id: 11, name: "Compost Bin", brand: "UrbanFarm", price: "₹3,400", points: 350, 
    image: require('../../../assets/products/prod_11.png'), category: "Home", tag: "Home",
    material: "Recycled HDPE", co2_saved: 5.0, waste_avoided: 40.0, eco_rating: "4.9/5"
  },
  { 
    id: 12, name: "Eco Yoga Mat", brand: "ZenEarth", price: "₹2,100", points: 250, 
    image: require('../../../assets/products/prod_12.png'), category: "Personal Care", tag: "Fitness",
    material: "Natural Tree Rubber", co2_saved: 2.8, waste_avoided: 1.5, eco_rating: "4.7/5"
  },
  { 
    id: 13, name: "Natural Deodorant Paste", brand: "PureLather", price: "₹650", points: 70, 
    image: require('../../../assets/products/prod_13.png'), category: "Personal Care", tag: "Vegan",
    material: "Coconut Oil & Shea Butter", co2_saved: 0.3, waste_avoided: 0.2, eco_rating: "5/5"
  },
  { 
    id: 14, name: "Reusable Makeup Pads", brand: "EcoFace", price: "₹450", points: 50, 
    image: require('../../../assets/products/prod_14.png'), category: "Personal Care", tag: "Zero Waste",
    material: "Bamboo & Organic Cotton", co2_saved: 0.5, waste_avoided: 2.0, eco_rating: "5/5"
  },
  { 
    id: 15, name: "Organic Cotton T-Shirt", brand: "ThreadGreen", price: "₹1,200", points: 150, 
    image: require('../../../assets/products/prod_15.png'), category: "Apparel", tag: "Apparel",
    material: "GOTS Certified Cotton", co2_saved: 3.2, waste_avoided: 0.5, eco_rating: "4.8/5"
  },
  { 
    id: 16, name: "Bamboo Cutlery Set", brand: "EcoSip", price: "₹550", points: 60, 
    image: require('../../../assets/products/prod_16.png'), category: "Home", tag: "Travel",
    material: "Heat-treated Bamboo", co2_saved: 0.6, waste_avoided: 1.8, eco_rating: "5/5"
  },
  { 
    id: 17, name: "Sustainably Sourced Coffee", brand: "FairBrew", price: "₹800", points: 90, 
    image: require('../../../assets/products/prod_17.png'), category: "Home", tag: "Food",
    material: "Shade-grown Beans", co2_saved: 1.1, waste_avoided: 0.3, eco_rating: "4.9/5"
  },
  { 
    id: 18, name: "Glass Food Containers", brand: "Oasis", price: "₹1,500", points: 180, 
    image: require('../../../assets/products/prod_18.png'), category: "Home", tag: "Home",
    material: "Borosilicate Glass", co2_saved: 2.0, waste_avoided: 3.5, eco_rating: "5/5"
  },
  { 
    id: 19, name: "Recycled Paper Notebook", brand: "EcoDaily", price: "₹250", points: 25, 
    image: require('../../../assets/products/prod_19.png'), category: "Home", tag: "Stationery",
    material: "100% Post-consumer Paper", co2_saved: 1.5, waste_avoided: 0.6, eco_rating: "4.6/5"
  },
  { 
    id: 20, name: "LED Bulbs Set (5x)", brand: "SunVolt", price: "₹600", points: 80, 
    image: require('../../../assets/products/prod_20.png'), category: "Home", tag: "Energy",
    material: "Polycarbonate Shell", co2_saved: 45.0, waste_avoided: 0.5, eco_rating: "5/5"
  }
];

export default function MarketScreen({ navigation }) {
  const { ecoPoints, cart, addToCart, updateCartQuantity } = useContext(UserContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStory, setSelectedStory] = useState(null); 
  
  const FILTER_TABS = ['All', 'Apparel', 'Home', 'Personal Care'];
  const getCartItem = (id) => cart.find(item => item.id === id);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const filteredProducts = PRODUCTS.filter(p => selectedCategory === 'All' || p.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Search & Header */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerLabel}>SHOPPING AT</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.headerLocation}>New Delhi, IN</Text>
              <Ionicons name="chevron-down" size={14} color={COLORS.primary} style={{ marginLeft: 4 }} />
            </View>
          </View>
          <View style={styles.navIcons}>
             <View style={styles.pointsPill}>
                <Ionicons name="leaf" size={14} color={COLORS.primary} />
                <Text style={styles.pointsPillText}>{ecoPoints.toLocaleString()}</Text>
             </View>
             <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Checkout')}>
                <Ionicons name="bag-handle" size={24} color={COLORS.text} />
                {totalCartItems > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{totalCartItems}</Text></View>}
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <Text style={styles.searchPlaceholder}>Search sustainable items...</Text>
        </View>
      </Animated.View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
            {FILTER_TABS.map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, selectedCategory === tab && styles.tabActive]}
                onPress={() => setSelectedCategory(tab)}
              >
                 <Text style={[styles.tabText, selectedCategory === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(300)} style={styles.sectionTitle}>Curated Collections</Animated.Text>

        <View style={styles.productGrid}>
          {filteredProducts.map((prod, index) => {
            const qty = getCartItem(prod.id)?.quantity || 0;
            return (
              <Animated.View 
                key={prod.id} 
                layout={LinearTransition}
                entering={FadeInDown.delay(400 + index * 50)}
                style={styles.cardContainer}
              >
                <TouchableOpacity 
                  activeOpacity={0.9} 
                  onLongPress={() => setSelectedStory(prod)}
                  style={styles.card}
                >
                  <View style={styles.imageBox}>
                    <Image source={prod.image} style={styles.img} />
                    <View style={styles.tag}><Text style={styles.tagText}>{prod.tag}</Text></View>
                  </View>
                  
                  <View style={styles.info}>
                    <Text style={styles.brand}>{prod.brand}</Text>
                    <Text style={styles.name} numberOfLines={1}>{prod.name}</Text>
                    
                    <View style={styles.priceRow}>
                      <Text style={styles.price}>{prod.price}</Text>
                      <View style={styles.saveBadge}>
                        <Ionicons name="leaf" size={10} color={COLORS.primary} />
                        <Text style={styles.saveText}>+{prod.points}</Text>
                      </View>
                    </View>

                    <View style={styles.actionBox}>
                      {qty > 0 ? (
                        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.stepper}>
                           <TouchableOpacity onPress={() => updateCartQuantity(prod.id, -1)} style={styles.stepBtn}>
                              <Ionicons name="remove" size={16} color={COLORS.primary} />
                           </TouchableOpacity>
                           <Text style={styles.stepQty}>{qty}</Text>
                           <TouchableOpacity onPress={() => updateCartQuantity(prod.id, 1)} style={styles.stepBtn}>
                              <Ionicons name="add" size={16} color={COLORS.primary} />
                           </TouchableOpacity>
                        </Animated.View>
                      ) : (
                        <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(prod, 1)}>
                           <Ionicons name="add" size={18} color="#FFF" />
                           <Text style={styles.addBtnText}>ADD</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* STORY MODAL (LONG-PRESS) */}
      <Modal visible={!!selectedStory} transparent animationType="fade">
        <View style={styles.modalOverlay}>
           <Animated.View entering={FadeInDown.duration(400)} style={styles.storyCard}>
              <View style={styles.storyImgBox}>
                 <Image source={selectedStory?.image} style={styles.storyImg} />
                 <TouchableOpacity style={styles.storyClose} onPress={() => setSelectedStory(null)}>
                    <Ionicons name="close-circle" size={36} color="#FFF" />
                 </TouchableOpacity>
              </View>

              <View style={styles.storyMain}>
                <Text style={styles.storyTitle}>{selectedStory?.name}</Text>
                <Text style={styles.storyMaterial}>{selectedStory?.material}</Text>

                <View style={styles.storyImpactGrid}>
                   <View style={styles.impactItem}>
                      <Ionicons name="cloud-outline" size={20} color="#0284C7" />
                      <Text style={styles.impactVal}>{selectedStory?.co2_saved}kg</Text>
                      <Text style={styles.impactLab}>CO₂ SAVED</Text>
                   </View>
                   <View style={styles.impactItem}>
                      <Ionicons name="trash-outline" size={20} color="#D97706" />
                      <Text style={styles.impactVal}>{selectedStory?.waste_avoided}kg</Text>
                      <Text style={styles.impactLab}>WASTE SAVED</Text>
                   </View>
                   <View style={styles.impactItem}>
                      <Ionicons name="sparkles-outline" size={20} color="#059669" />
                      <Text style={styles.impactVal}>{selectedStory?.eco_rating}</Text>
                      <Text style={styles.impactLab}>ECO RATING</Text>
                   </View>
                </View>

                <TouchableOpacity 
                   style={styles.storyGotIt} 
                   onPress={() => setSelectedStory(null)}
                >
                   <Text style={styles.storyGotItText}>AWESOME CHOICE</Text>
                </TouchableOpacity>
              </View>
           </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    ...SHADOW.large,
    width: CONTENT_WIDTH,
    alignSelf: 'center',
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  headerLocation: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    marginRight: 12,
  },
  pointsPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 6,
  },
  cartBtn: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.m,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginLeft: 8,
    fontWeight: '500',
  },
  scrollContent: {
    paddingTop: SPACING.m,
    paddingBottom: 120,
    width: CONTENT_WIDTH,
    alignSelf: 'center',
  },
  tabsContainer: {
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tabActive: {
    backgroundColor: COLORS.slate,
    borderColor: COLORS.slate,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.slateMuted,
  },
  tabTextActive: {
    color: '#FFF',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    paddingHorizontal: SPACING.l,
    marginVertical: SPACING.m,
    fontWeight: '800',
    color: COLORS.slate,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.l,
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: SPACING.m,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: RADIUS.l,
    overflow: 'hidden',
    ...SHADOW.medium,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  imageBox: {
    height: CARD_WIDTH * 0.9,
    width: '100%',
    backgroundColor: '#F1F5F9',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  tag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  info: {
    padding: 12,
  },
  brand: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.slate,
    marginBottom: 8,
    height: 18,
  },
  priceRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.slate,
  },
  saveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saveText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    marginLeft: 2,
  },
  actionBox: {
    height: 36,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    height: 36,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    height: 36,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepBtn: {
    paddingHorizontal: 12,
  },
  stepQty: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.slate,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyCard: {
    backgroundColor: '#FFF',
    width: '90%',
    maxWidth: 400,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOW.float,
  },
  storyImgBox: {
    height: 240,
    position: 'relative',
  },
  storyImg: {
    width: '100%',
    height: '100%',
  },
  storyClose: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  storyMain: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  storyTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.slate,
    textAlign: 'center',
    marginBottom: 4,
  },
  storyMaterial: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xl,
  },
  storyImpactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.xl,
  },
  impactItem: {
    alignItems: 'center',
    width: '30%',
  },
  impactVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.slate,
    marginTop: 4,
  },
  impactLab: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  storyGotIt: {
    backgroundColor: COLORS.slate,
    width: '100%',
    paddingVertical: 16,
    borderRadius: RADIUS.round,
    alignItems: 'center',
  },
  storyGotItText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
});
