import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Dimensions, TextInput, ActivityIndicator, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients' | 'steps'
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
    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient!");
      return;
    }
    setLoading(true);
    setShowAdvice(false);
    
    const ingredients = selectedIngredients.join(", ");
    
    try {
      const response = await fetch('http://localhost:8000/api/food/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persons, days, dishType, ingredients })
      });
      
      const data = await response.json();
      if (data.success && data.recipe) {
         setResult(data.recipe);
         setShowAdvice(true);
      } else {
         alert("Failed to generate recipe.");
      }
    } catch (e) {
      alert("Failed to connect to backend server.");
    }
    
    setLoading(false);
  };

  const openRecipeDetails = () => {
    setActiveTab('ingredients');
    setCurrentStep(0);
    setCheckedItems([]);
    setModalVisible(true);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Recipe Optimizer</Text>
          <Text style={styles.subtitle}>Cook sustainable, healthy meals with what you already have at home.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selection-Based Inventory</Text>
          <Text style={styles.sectionHeading}>I have at home:</Text>
          
          <View style={styles.ingredientsGrid}>
             {INGREDIENTS_CATALOG.map((item) => {
               const active = selectedIngredients.includes(item.name);
               return (
                 <TouchableOpacity 
                    key={item.id} 
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => toggleIngredient(item.name)}
                  >
                    <Ionicons name={item.icon} size={14} color={active ? '#FFF' : COLORS.textMuted} />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
                 </TouchableOpacity>
               );
             })}
          </View>

          <View style={styles.divider} />
          <Text style={styles.sectionHeading}>Cooking Details:</Text>

          <InputField 
            icon="people-outline" 
            placeholder="For how many people?" 
            value={persons}
            onChangeText={setPersons}
          />
          <InputField 
            icon="calendar-outline" 
            placeholder="For how many days?" 
            value={days}
            onChangeText={setDays}
          />
          <InputField 
            icon="restaurant-outline" 
            placeholder="Preferred Cuisine / Dish Type" 
            value={dishType}
            onChangeText={setDishType}
          />

          {loading ? (
             <View style={{ marginTop: SPACING.l, alignItems: 'center' }}>
               <ActivityIndicator size="large" color={COLORS.primary} />
             </View>
          ) : (
            <PrimaryButton 
              title="Curate Recipe" 
              onPress={generateRecipe} 
              style={styles.generateBtn}
            />
          )}
        </View>

        {showAdvice && result && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsHeader}>Curated For You</Text>
            
            <View style={styles.recipeCard}>
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeTitle}>{result.title}</Text>
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{result.match_percentage}</Text>
                </View>
              </View>

              <Text style={styles.recipeDescription}>
                {result.description}
              </Text>

              <View style={styles.divider} />

              <View style={styles.sustainabilityBox}>
                 <View style={styles.boxHeaderRow}>
                   <Ionicons name="leaf" size={20} color="#059669" />
                   <Text style={styles.boxTitleGreen}>Why is this Sustainable?</Text>
                 </View>
                 <Text style={styles.boxBody}>
                   {result.carbon_impact}
                 </Text>
              </View>

              <View style={styles.actionRow}>
                 <PrimaryButton 
                   title="Let's Cook This" 
                   onPress={openRecipeDetails} 
                   style={styles.cookBtn}
                 />
              </View>
            </View>
          </View>
        )}

        {/* MOBILE-NATIVE STEP-BY-STEP MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                 <View style={styles.modalHeaderInfo}>
                   <Text style={styles.modalTitle}>{result?.title}</Text>
                   <Text style={styles.modalSubtitle}>{result?.match_percentage} Sustainable Match</Text>
                 </View>
                 <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-circle" size={32} color={COLORS.textMuted} />
                 </TouchableOpacity>
              </View>

              {/* TABS */}
              <View style={styles.tabBar}>
                 <TouchableOpacity 
                    style={[styles.tab, activeTab === 'ingredients' && styles.tabActive]}
                    onPress={() => setActiveTab('ingredients')}
                  >
                    <Text style={[styles.tabText, activeTab === 'ingredients' && styles.tabTextActive]}>Ingredients</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                    style={[styles.tab, activeTab === 'steps' && styles.tabActive]}
                    onPress={() => setActiveTab('steps')}
                  >
                    <Text style={[styles.tabText, activeTab === 'steps' && styles.tabTextActive]}>Cooking Steps</Text>
                 </TouchableOpacity>
              </View>

              {/* TAB CONTENT */}
              <View style={styles.contentContainer}>
                {activeTab === 'ingredients' ? (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.checkSection}>
                       <Text style={styles.checkTitle}>Check items as you prep:</Text>
                       {result?.proportions?.map((item, i) => (
                         <TouchableOpacity 
                            key={i} 
                            style={styles.checkRow}
                            onPress={() => toggleChecked(item)}
                          >
                           <Ionicons 
                              name={checkedItems.includes(item) ? "checkbox" : "square-outline"} 
                              size={24} 
                              color={checkedItems.includes(item) ? COLORS.primary : COLORS.textMuted} 
                            />
                           <Text style={[styles.checkText, checkedItems.includes(item) && styles.checkTextDone]}>{item}</Text>
                         </TouchableOpacity>
                       ))}
                    </View>
                    <View style={styles.healthTipBox}>
                       <Text style={styles.healthTipTitle}>AI Health Tip</Text>
                       <Text style={styles.healthTipText}>{result?.health_benefits}</Text>
                    </View>
                    <PrimaryButton 
                       title="Start Cooking" 
                       onPress={() => setActiveTab('steps')}
                       style={{marginTop: SPACING.l}}
                    />
                  </ScrollView>
                ) : (
                  <View style={{ flex: 1 }}>
                    {/* PROGRESS BAR */}
                    <View style={styles.progressContainer}>
                       <View style={styles.progressLabelRow}>
                          <Text style={styles.progressLabel}>Step {currentStep + 1} of {result?.instructions?.length}</Text>
                          <Text style={styles.progressPercent}>{Math.round(((currentStep + 1) / result?.instructions?.length) * 100)}%</Text>
                       </View>
                       <View style={styles.progressBarBg}>
                          <View style={[styles.progressBarFill, { width: `${((currentStep + 1) / result?.instructions?.length) * 100}%` }]} />
                       </View>
                    </View>

                    {/* FOCUS STEP CARD */}
                    <View style={styles.stepCard}>
                       <ScrollView showsVerticalScrollIndicator={false}>
                          <Text style={styles.stepInstructionText}>
                             {result?.instructions[currentStep]}
                          </Text>
                       </ScrollView>
                    </View>

                    {/* NAVIGATION BUTTONS */}
                    <View style={styles.navButtons}>
                       <TouchableOpacity 
                          style={[styles.navBtn, currentStep === 0 && styles.navBtnDisabled]}
                          onPress={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                          disabled={currentStep === 0}
                        >
                          <Ionicons name="arrow-back" size={20} color={currentStep === 0 ? COLORS.border : COLORS.primary} />
                          <Text style={[styles.navBtnText, currentStep === 0 && styles.navBtnTextDisabled]}>Back</Text>
                       </TouchableOpacity>

                       {currentStep < result?.instructions?.length - 1 ? (
                         <TouchableOpacity 
                            style={styles.nextBtn}
                            onPress={() => setCurrentStep(prev => prev + 1)}
                          >
                            <Text style={styles.nextBtnText}>Next Step</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                         </TouchableOpacity>
                       ) : (
                         <TouchableOpacity 
                            style={[styles.nextBtn, { backgroundColor: '#059669' }]}
                            onPress={() => setModalVisible(false)}
                          >
                            <Text style={styles.nextBtnText}>Finish Cooking</Text>
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

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    padding: SPACING.l,
    ...SHADOW.medium,
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  sectionHeading: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    marginBottom: SPACING.s,
    marginTop: SPACING.m,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.m,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.m,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 4,
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.m,
  },
  generateBtn: {
    marginTop: SPACING.s,
  },
  resultsContainer: {
    marginTop: SPACING.s,
  },
  resultsHeader: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  recipeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.l,
    padding: SPACING.l,
    ...SHADOW.large,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  recipeTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    flex: 1,
    marginRight: SPACING.s,
  },
  matchBadge: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: SPACING.m,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
  },
  matchText: {
    ...TYPOGRAPHY.caption,
    color: '#059669',
    fontWeight: 'bold',
  },
  recipeDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.m,
    lineHeight: 24,
  },
  sustainabilityBox: {
    backgroundColor: '#ECFDF5',
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    marginBottom: SPACING.l,
  },
  boxHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  boxTitleGreen: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: '#065F46',
    marginLeft: SPACING.xs,
  },
  boxBody: {
    ...TYPOGRAPHY.caption,
    color: '#374151',
    lineHeight: 20,
  },
  cookBtn: {
    width: '100%',
  },
  // Modal Native Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: RADIUS.xl * 1.5,
    borderTopRightRadius: RADIUS.xl * 1.5,
    height: height * 0.9,
    padding: SPACING.l,
    ...SHADOW.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
    paddingHorizontal: SPACING.s,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    fontSize: 18,
  },
  modalSubtitle: {
    ...TYPOGRAPHY.caption,
    color: '#059669',
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.m,
    padding: 4,
    marginBottom: SPACING.l,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: RADIUS.m,
  },
  tabActive: {
    backgroundColor: '#FFF',
    ...SHADOW.small,
  },
  tabText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
  },
  checkSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    marginBottom: SPACING.l,
  },
  checkTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    marginBottom: SPACING.m,
    color: COLORS.text,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  checkText: {
    marginLeft: SPACING.m,
    ...TYPOGRAPHY.body,
    fontSize: 15,
  },
  checkTextDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  healthTipBox: {
    backgroundColor: '#F0F9FF',
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    borderLeftWidth: 4,
    borderLeftColor: '#0284C7',
  },
  healthTipTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 4,
  },
  healthTipText: {
    ...TYPOGRAPHY.caption,
    color: '#0C4A6E',
    lineHeight: 18,
  },
  progressContainer: {
    marginBottom: SPACING.l,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  progressLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  progressPercent: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stepInstructionText: {
    ...TYPOGRAPHY.h3,
    lineHeight: 30,
    color: COLORS.text,
    textAlign: 'center',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  navBtnText: {
    marginLeft: 8,
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  navBtnTextDisabled: {
    color: COLORS.border,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: 14,
    borderRadius: RADIUS.round,
    ...SHADOW.medium,
  },
  nextBtnText: {
    marginRight: 8,
    color: '#FFF',
    fontWeight: 'bold',
    ...TYPOGRAPHY.body,
  },
});
