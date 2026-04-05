import React, { useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Image, TouchableOpacity, Alert } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../context/UserContext';

const PRODUCTS = [
  { id: 1, name: "Bamboo Toothbrush set", brand: "EcoDaily", price: "₹450", points: 50, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Zero Waste" },
  { id: 2, name: "Recycled Cotton Tote", brand: "ThreadGreen", price: "₹850", points: 100, image: "https://images.unsplash.com/photo-1597484661643-2f5fef640df1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Ethical Fashion" },
  { id: 3, name: "Reusable Coffee Cup", brand: "Oasis", price: "₹1,200", points: 150, image: "https://images.unsplash.com/photo-1572913017565-df054dfde2d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Plastic Free" },
  { id: 4, name: "Organic Shampoo Bar", brand: "PureLather", price: "₹350", points: 40, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", tag: "Chemical Free" },
  { id: 5, name: "Beeswax Wrap (Set of 3)", brand: "EcoWrap", price: "₹950", points: 120, image: "https://images.unsplash.com/photo-1610419330968-306c59d9c6be?auto=format&fit=crop&w=800&q=80", tag: "Alternative" },
  { id: 6, name: "Solar Power Bank", brand: "SunVolt", price: "₹2,500", points: 300, image: "https://images.unsplash.com/photo-1585250424564-9d10787d5ba0?auto=format&fit=crop&w=800&q=80", tag: "Energy" },
  { id: 7, name: "Hemp Vegan Sneakers", brand: "WalkGreen", price: "₹4,500", points: 500, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80", tag: "Apparel" },
  { id: 8, name: "Biodegradable Phone Case", brand: "Pela", price: "₹1,800", points: 200, image: "https://images.unsplash.com/photo-1603525166030-cf8a08f5d050?auto=format&fit=crop&w=800&q=80", tag: "Compostable" },
  { id: 9, name: "Stainless Steel Straws", brand: "EcoSip", price: "₹300", points: 30, image: "https://images.unsplash.com/photo-1582299878297-f507b9da54a4?auto=format&fit=crop&w=800&q=80", tag: "Zero Waste" },
  { id: 10, name: "Upcycled Denim Jacket", brand: "ReWeave", price: "₹5,200", points: 600, image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=800&q=80", tag: "Vintage" },
  { id: 11, name: "Compost Bin", brand: "UrbanFarm", price: "₹3,400", points: 350, image: "https://images.unsplash.com/photo-1597405202403-1efb886d3b4e?auto=format&fit=crop&w=800&q=80", tag: "Home" },
  { id: 12, name: "Eco Yoga Mat", brand: "ZenEarth", price: "₹2,100", points: 250, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80", tag: "Fitness" },
  { id: 13, name: "Natural Deodorant Paste", brand: "PureLather", price: "₹650", points: 70, image: "https://images.unsplash.com/photo-1581023773413-583ebcc23f2b?auto=format&fit=crop&w=800&q=80", tag: "Vegan" },
  { id: 14, name: "Reusable Makeup Pads", brand: "EcoFace", price: "₹450", points: 50, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80", tag: "Zero Waste" },
  { id: 15, name: "Organic Cotton T-Shirt", brand: "ThreadGreen", price: "₹1,200", points: 150, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", tag: "Apparel" },
  { id: 16, name: "Bamboo Cutlery Set", brand: "EcoSip", price: "₹550", points: 60, image: "https://images.unsplash.com/photo-1587314545239-0114841e2d80?auto=format&fit=crop&w=800&q=80", tag: "Travel" },
  { id: 17, name: "Sustainably Sourced Coffee", brand: "FairBrew", price: "₹800", points: 90, image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80", tag: "Food" },
  { id: 18, name: "Glass Food Containers", brand: "Oasis", price: "₹1,500", points: 180, image: "https://images.unsplash.com/photo-1615486171448-4cbab10e64c3?auto=format&fit=crop&w=800&q=80", tag: "Home" },
  { id: 19, name: "Recycled Paper Notebook", brand: "EcoDaily", price: "₹250", points: 25, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80", tag: "Stationery" },
  { id: 20, name: "LED Bulbs Set (5x)", brand: "SunVolt", price: "₹600", points: 80, image: "https://images.unsplash.com/photo-1510346124508-333fb1199a5A?auto=format&fit=crop&w=800&q=80", tag: "Energy" }
];

export default function MarketScreen({ navigation }) {
  const { ecoPoints, cart, addToCart } = useContext(UserContext);
  const [quantities, setQuantities] = React.useState({});

  const getQty = (id) => quantities[id] || 1;

  const updateQty = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddToCart = (product) => {
    const qty = getQty(product.id);
    addToCart(product, qty);
    // Reset local qty after adding
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const navToCheckout = () => {
    navigation.navigate('Checkout');
  };

  // calculate items in cart
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <View style={styles.rightNav}>
           <View style={styles.pointsBadge}>
              <Ionicons name="leaf" size={14} color={COLORS.primary} />
              <Text style={styles.pointsText}>{ecoPoints.toLocaleString()}</Text>
           </View>
           <TouchableOpacity style={styles.cartIconBadge} onPress={navToCheckout}>
              <Ionicons name="cart" size={24} color={COLORS.text} />
              {totalCartItems > 0 && (
                <View style={styles.cartBadgeNum}>
                  <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
                </View>
              )}
           </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          <View style={[styles.categoryPill, styles.activeCategory]}>
             <Text style={styles.activeCategoryText}>All</Text>
          </View>
          <View style={styles.categoryPill}>
             <Text style={styles.categoryText}>Apparel</Text>
          </View>
          <View style={styles.categoryPill}>
             <Text style={styles.categoryText}>Home</Text>
          </View>
          <View style={styles.categoryPill}>
             <Text style={styles.categoryText}>Personal Care</Text>
          </View>
        </ScrollView>
      </View>

      {/* Products Grid */}
      <ScrollView contentContainerStyle={styles.gridContainer}>
        <View style={styles.grid}>
          {PRODUCTS.map((prod) => (
            <View key={prod.id} style={styles.productCard}>
               <View style={styles.imageContainer}>
                 <Image source={{ uri: prod.image }} style={styles.productImage} />
                 <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{prod.tag}</Text>
                 </View>
                 <TouchableOpacity style={styles.favoriteBtn}>
                    <Ionicons name="heart-outline" size={20} color={COLORS.text} />
                 </TouchableOpacity>
               </View>
               <View style={styles.productInfo}>
                 <Text style={styles.brandText}>{prod.brand}</Text>
                 <Text style={styles.productName} numberOfLines={1}>{prod.name}</Text>
                 <Text style={styles.priceText}>{prod.price}</Text>
                 <Text style={styles.pointsPrice}>Earn +{prod.points} EcoPoints</Text>
                 
                 {/* Quantity Selector */}
                 <View style={styles.qtyContainer}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(prod.id, -1)}>
                        <Ionicons name="remove" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{getQty(prod.id)}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(prod.id, 1)}>
                        <Ionicons name="add" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                 </View>

                 <TouchableOpacity style={styles.buyBtn} onPress={() => handleAddToCart(prod)}>
                    <Text style={styles.buyText}>Add to Cart</Text>
                 </TouchableOpacity>
               </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.m,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  rightNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEF7EC',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.round,
    marginRight: SPACING.m,
  },
  pointsText: {
    ...TYPOGRAPHY.caption,
    color: '#059669',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cartIconBadge: {
    padding: SPACING.xs,
    position: 'relative',
  },
  cartBadgeNum: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginBottom: SPACING.m,
  },
  categoriesScroll: {
    paddingHorizontal: SPACING.l,
  },
  categoryPill: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  activeCategoryText: {
    ...TYPOGRAPHY.caption,
    color: '#FFF',
    fontWeight: 'bold',
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  gridContainer: {
    paddingHorizontal: SPACING.l,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    marginBottom: SPACING.m,
    overflow: 'hidden',
    ...SHADOW.light,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    width: '100%',
    backgroundColor: '#E5E7EB',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  tagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    padding: SPACING.m,
  },
  brandText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  productName: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  priceText: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  pointsPrice: {
    fontSize: 10,
    color: '#059669',
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: SPACING.s,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.s,
    padding: 4,
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  buyBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: RADIUS.s,
    alignItems: 'center',
  },
  buyText: {
    ...TYPOGRAPHY.caption,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
