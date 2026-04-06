import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Dimensions, TextInput, ActivityIndicator, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  Layout,
  FadeIn
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTENT_WIDTH = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, 450) : SCREEN_WIDTH;

const INGREDIENTS_CATALOG = [
  { id: 'v1', name: 'Spinach', category: 'Vegetables', icon: 'leaf' },
  { id: 'v2', name: 'Potato', category: 'Vegetables', icon: 'ellipse' },
  { id: 'v3', name: 'Onion', category: 'Vegetables', icon: 'radio-button-on' },
  { id: 'v4', name: 'Tomato', category: 'Vegetables', icon: 'disc' },
  { id: 'v5', name: 'Garlic', category: 'Vegetables', icon: 'cog' },
  { id: 'v6', name: 'Carrot', category: 'Vegetables', icon: 'flame' },
  { id: 'g1', name: 'Rice', category: 'Grains', icon: 'list' },
  { id: 'g2', name: 'Wheat', category: 'Grains', icon: 'reorder-four' },
  { id: 'g3', name: 'Bread', category: 'Grains', icon: 'square' },
  { id: 'g4', name: 'Pasta', category: 'Grains', icon: 'infinite' },
  { id: 'p1', name: 'Eggs', category: 'Protein', icon: 'egg' },
  { id: 'p2', name: 'Tofu', category: 'Protein', icon: 'cube' },
  { id: 'p3', name: 'Lentils', category: 'Protein', icon: 'grid' },
  { id: 'p4', name: 'Chickpeas', category: 'Protein', icon: 'apps' },
  { id: 'p5', name: 'Paneer', category: 'Protein', icon: 'stop' },
  { id: 's1', name: 'Turmeric', category: 'Spices', icon: 'color-palette' },
  { id: 's2', name: 'Cumin', category: 'Spices', icon: 'nuclear' },
  { id: 's3', name: 'Chili', category: 'Spices', icon: 'flame' },
  { id: 'f1', name: 'Lemon', category: 'Fruits', icon: 'sunny' },
  { id: 'f2', name: 'Apple', category: 'Fruits', icon: 'heart' },
];

export default function FoodScreen() {
  const [persons, setPersons] = useState('');
  const [days, setDays] = useState('');
  const [dishType, setDishType] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showAdvice, setShowAdvice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleIngredient = (name) => {
    setSelectedIngredients(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const toggleChecked = (name) => {
    setCheckedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const generateRecipe = async () => {
    if (selectedIngredients.length === 0) return;
    setLoading(true);
    setShowAdvice(false);
    
    try {
      const response = await fetch('http://localhost:8000/api/food/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persons, days, dishType, ingredients: selectedIngredients.join(", ") })
      });
      const data = await response.json();
      if (data.success && data.recipe) {
         setResult(data.recipe);
         setShowAdvice(true);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.headerLabel}>AI ASSISTANT</Text>
          <Text style={styles.title}>Recipe Optimizer</Text>
          <Text style={styles.subtitle}>Transform your leftover ingredients into zero-waste gourmet meals.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.mainCard}>
          <Text style={styles.sectionHeading}>I HAVE THESE AT HOME</Text>
          <View style={styles.ingredientsGrid}>
             {INGREDIENTS_CATALOG.map((item, index) => {
               const active = selectedIngredients.includes(item.name);
               return (
                 <TouchableOpacity 
                    key={item.id} 
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleIngredient(item.name)}
                  >
                    <Ionicons name={item.icon} size={14} color={active ? '#FFF' : COLORS.slateMuted} />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
                 </TouchableOpacity>
               );
             })}
          </View>

          <View style={styles.divider} />
          
          <View style={styles.inputRows}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.smallLabel}>SERVINGS</Text>
              <InputField icon="people" placeholder="e.g. 2" value={persons} onChangeText={setPersons} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.smallLabel}>DURATION</Text>
              <InputField icon="time" placeholder="e.g. 1 Day" value={days} onChangeText={setDays} />
            </View>
          </View>

          <Text style={styles.smallLabel}>CUISINE PREFERENCE</Text>
          <InputField icon="restaurant" placeholder="e.g. Italian, Spicy, Salad" value={dishType} onChangeText={setDishType} />

          {loading ? (
             <View style={styles.loaderContainer}>
               <ActivityIndicator size="large" color={COLORS.primary} />
               <Text style={styles.loadingText}>AI is curating your sustainable meal...</Text>
             </View>
          ) : (
            <PrimaryButton 
              title="OPTIMIZE MY MEAL" 
              onPress={generateRecipe} 
              style={{ marginTop: 8 }}
            />
          )}
        </Animated.View>

        {showAdvice && result && (
          <Animated.View entering={FadeInDown.duration(800)} style={styles.resultsWrapper}>
            <View style={styles.recipeCard}>
              <View style={styles.matchBadge}>
                <Ionicons name="sparkles" size={14} color="#FFF" />
                <Text style={styles.matchText}>{result.match_percentage} OPTIMIZED</Text>
              </View>
              
              <Text style={styles.recipeTitle}>{result.title}</Text>
              <Text style={styles.recipeDesc}>{result.description}</Text>

              <View style={styles.impactBox}>
                 <View style={styles.impactHeader}>
                    <Ionicons name="leaf" size={18} color={COLORS.primary} />
                    <Text style={styles.impactTitle}>PLANET IMPACT</Text>
                 </View>
                 <Text style={styles.impactContent}>{result.carbon_impact}</Text>
              </View>

              <PrimaryButton 
                title="START COOKING GUIDE" 
                onPress={() => {
                  setActiveTab('ingredients');
                  setCurrentStep(0);
                  setCheckedItems([]);
                  setModalVisible(true);
                }} 
              />
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* FULL-SCREEN COOKING MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Ionicons name="chevron-down" size={28} color={COLORS.slate} />
              </TouchableOpacity>
              <View style={styles.modalHeaderTitleBox}>
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>{result?.title}</Text>
                <Text style={styles.modalHeaderSubtitle}>{result?.match_percentage} Eco-Match</Text>
              </View>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.tabNav}>
              <TouchableOpacity style={[styles.tabBtn, activeTab === 'ingredients' && styles.tabBtnActive]} onPress={() => setActiveTab('ingredients')}>
                <Text style={[styles.tabBtnText, activeTab === 'ingredients' && styles.tabBtnTextActive]}>PREP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabBtn, activeTab === 'steps' && styles.tabBtnActive]} onPress={() => setActiveTab('steps')}>
                <Text style={[styles.tabBtnText, activeTab === 'steps' && styles.tabBtnTextActive]}>COOK</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              {activeTab === 'ingredients' ? (
                <ScrollView showsVerticalScrollIndicator={false} style={styles.prepContent}>
                  <Text style={styles.listTitle}>INGREDIENTS CHECKLIST</Text>
                  {result?.proportions?.map((item, i) => (
                    <TouchableOpacity 
                      key={i} 
                      style={styles.prepRow} 
                      onPress={() => toggleChecked(item)}
                    >
                      <Ionicons 
                        name={checkedItems.includes(item) ? "checkmark-circle" : "ellipse-outline"} 
                        size={24} 
                        color={checkedItems.includes(item) ? COLORS.primary : COLORS.border} 
                      />
                      <Text style={[styles.prepText, checkedItems.includes(item) && styles.prepTextDone]}>{item}</Text>
                    </TouchableOpacity>
                  ))}

                  <View style={styles.healthCoachBox}>
                    <View style={styles.coachHeader}>
                      <Ionicons name="heart" size={18} color="#EF4444" />
                      <Text style={styles.coachTitle}>AI HEALTH COACH</Text>
                    </View>
                    <Text style={styles.coachText}>{result?.health_benefits}</Text>
                  </View>

                  <PrimaryButton 
                    title="I'M READY TO COOK" 
                    onPress={() => setActiveTab('steps')} 
                    style={{ marginTop: 24 }}
                  />
                </ScrollView>
              ) : (
                <View style={styles.cookView}>
                  <View style={styles.stepProgressContainer}>
                    <Text style={styles.stepCount}>STEP {currentStep + 1} OF {result?.instructions?.length}</Text>
                    <View style={styles.barBg}>
                      <View style={[styles.barFill, { width: `${((currentStep + 1) / result?.instructions?.length) * 100}%` }]} />
                    </View>
                  </View>

                  <View style={styles.stepCard}>
                    <ScrollView centerContent>
                      <Text style={styles.stepMainText}>{result?.instructions[currentStep]}</Text>
                    </ScrollView>
                  </View>

                  <View style={styles.navRow}>
                    <TouchableOpacity 
                      style={[styles.smallNav, currentStep === 0 && { opacity: 0 }]} 
                      onPress={() => setCurrentStep(s => Math.max(0, s - 1))}
                    >
                      <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                      <Text style={styles.smallNavText}>BACK</Text>
                    </TouchableOpacity>

                    {currentStep < (result?.instructions?.length || 0) - 1 ? (
                      <TouchableOpacity style={styles.mainNext} onPress={() => setCurrentStep(s => s + 1)}>
                        <Text style={styles.mainNextText}>NEXT STEP</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFF" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={[styles.mainNext, { backgroundColor: COLORS.success }]} onPress={() => setModalVisible(false)}>
                        <Text style={styles.mainNextText}>FINISH MEAL</Text>
                        <Ionicons name="checkmark-done" size={20} color="#FFF" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { 
    padding: SPACING.l, 
    width: CONTENT_WIDTH, 
    alignSelf: 'center', 
    paddingBottom: 120 
  },
  header: { marginTop: Platform.OS === 'ios' ? 40 : 20, marginBottom: SPACING.xl },
  headerLabel: { fontSize: 10, fontWeight: '800', color: COLORS.primary, letterSpacing: 1.5, marginBottom: 4 },
  title: { ...TYPOGRAPHY.h1, color: COLORS.slate },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.slateMuted, marginTop: 4, lineHeight: 22 },
  
  mainCard: { backgroundColor: '#FFF', borderRadius: RADIUS.xl, padding: SPACING.xl, ...SHADOW.large },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: COLORS.slateMuted, letterSpacing: 1, marginBottom: 12 },
  ingredientsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: SPACING.m },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.round, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: COLORS.slate, borderColor: COLORS.slate },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.slateMuted, marginLeft: 6 },
  chipTextActive: { color: '#FFF' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: SPACING.l },
  inputRows: { flexDirection: 'row', justifyContent: 'space-between' },
  smallLabel: { fontSize: 10, fontWeight: '800', color: COLORS.slate, marginBottom: 8 },
  loaderContainer: { alignItems: 'center', marginVertical: SPACING.xl },
  loadingText: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginTop: 12 },
  
  resultsWrapper: { marginTop: SPACING.xl },
  recipeCard: { backgroundColor: '#FFF', borderRadius: RADIUS.xl, padding: SPACING.xl, ...SHADOW.float, borderTopWidth: 6, borderTopColor: COLORS.primary },
  matchBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.slate, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round, marginBottom: 12 },
  matchText: { fontSize: 10, fontWeight: '800', color: '#FFF', marginLeft: 4 },
  recipeTitle: { ...TYPOGRAPHY.h2, color: COLORS.slate, marginBottom: 8 },
  recipeDesc: { ...TYPOGRAPHY.body, color: COLORS.slateMuted, marginBottom: SPACING.xl, lineHeight: 24 },
  impactBox: { backgroundColor: '#F0FDF4', padding: SPACING.m, borderRadius: RADIUS.m, marginBottom: SPACING.xl },
  impactHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  impactTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primary, marginLeft: 6 },
  impactContent: { fontSize: 13, color: '#064E3B', lineHeight: 18, fontWeight: '500' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', height: SCREEN_HEIGHT * 0.9, width: CONTENT_WIDTH, alignSelf: 'center', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.l },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.l },
  modalClose: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  modalHeaderTitleBox: { flex: 1, alignItems: 'center' },
  modalHeaderTitle: { fontSize: 16, fontWeight: '800', color: COLORS.slate },
  modalHeaderSubtitle: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  tabNav: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: RADIUS.l, padding: 4, marginBottom: SPACING.xl },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.m },
  tabBtnActive: { backgroundColor: '#FFF', ...SHADOW.small },
  tabBtnText: { fontSize: 12, fontWeight: '800', color: COLORS.slateMuted },
  tabBtnTextActive: { color: COLORS.primary },
  
  prepContent: { flex: 1 },
  listTitle: { fontSize: 12, fontWeight: '800', color: COLORS.slate, letterSpacing: 1, marginBottom: 16 },
  prepRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  prepText: { fontSize: 16, fontWeight: '500', color: COLORS.slate, marginLeft: 16 },
  prepTextDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  healthCoachBox: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: RADIUS.l, marginTop: 24, borderLeftWidth: 4, borderLeftColor: '#EF4444' },
  coachHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  coachTitle: { fontSize: 11, fontWeight: '800', color: '#B91C1C', marginLeft: 6 },
  coachText: { fontSize: 13, color: '#7F1D1D', lineHeight: 18, fontWeight: '500' },

  cookView: { flex: 1 },
  stepProgressContainer: { marginBottom: 24 },
  stepCount: { fontSize: 12, fontWeight: '800', color: COLORS.textMuted, marginBottom: 8 },
  barBg: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4 },
  barFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  stepCard: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: RADIUS.xl, padding: 32, justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9' },
  stepMainText: { fontSize: 24, fontWeight: '700', color: COLORS.slate, textAlign: 'center', lineHeight: 36 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 24 },
  smallNav: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  smallNavText: { fontSize: 12, fontWeight: '800', color: COLORS.primary, marginLeft: 4 },
  mainNext: { backgroundColor: COLORS.slate, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: RADIUS.round, ...SHADOW.medium },
  mainNextText: { fontSize: 13, fontWeight: '800', color: '#FFF', marginRight: 8 },
});
