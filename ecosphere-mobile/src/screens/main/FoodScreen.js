import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Dimensions, TextInput, ActivityIndicator, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOW } from '../../theme/Theme';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import EcoInsightModal from '../../components/EcoInsightModal';
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
  const [showScoreAlert, setShowScoreAlert] = useState(false);
  
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
          
          // TRIGGER ALERT IF MATCH IS LOW
          const matchVal = parseInt(data.recipe.match_percentage);
          if (matchVal < 75) {
            setShowScoreAlert(true);
          }
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

        <View style={styles.formCard}>
           <View style={{ flexDirection: 'row', gap: 12 }}>
             <View style={{ flex: 1 }}>
               <Text style={styles.inputLabel}>PERSONS</Text>
               <InputField 
                 placeholder="e.g. 2" 
                 value={persons} 
                 onChangeText={setPersons} 
                 keyboardType="numeric"
               />
             </View>
             <View style={{ flex: 1 }}>
               <Text style={styles.inputLabel}>MEALS</Text>
               <InputField 
                 placeholder="e.g. Lunch" 
                 value={dishType} 
                 onChangeText={setDishType} 
               />
             </View>
           </View>

           <Text style={styles.inputLabel}>AVAILABLE INGREDIENTS</Text>
           <TouchableOpacity 
             style={styles.ingSelection} 
             onPress={() => setModalVisible(true)}
           >
              <Text style={styles.ingSelectionText}>
                {selectedIngredients.length > 0 
                  ? `${selectedIngredients.length} items selected` 
                  : "Tap to select ingredients"}
              </Text>
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
           </TouchableOpacity>

           <PrimaryButton 
              title={loading ? "CURATING..." : "OPTIMIZE MEAL"} 
              onPress={generateRecipe} 
              style={{ marginTop: 20 }}
              disabled={loading}
           />
        </View>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Eco-AI is curating your personalized recipe...</Text>
          </View>
        )}

        {showAdvice && result && (
          <Animated.View entering={FadeInDown.duration(600)} style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <View style={styles.matchPill}>
                <Ionicons name="flash" size={14} color="#FFF" />
                <Text style={styles.matchText}>{result.match_percentage} ECO-MATCH</Text>
              </View>
              <Text style={styles.recipeTitle}>{result.dish_name}</Text>
            </View>

            <View style={styles.tabSwitcher}>
              <TouchableOpacity onPress={() => setActiveTab('ingredients')} style={[styles.tab, activeTab === 'ingredients' && styles.tabActive]}>
                <Text style={[styles.tabLabel, activeTab === 'ingredients' && styles.tabLabelActive]}>Ingredients</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('cooking')} style={[styles.tab, activeTab === 'cooking' && styles.tabActive]}>
                <Text style={[styles.tabLabel, activeTab === 'cooking' && styles.tabLabelActive]}>Cooking</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tabContent}>
               {activeTab === 'ingredients' ? (
                 result.ingredients.map((item, i) => (
                   <TouchableOpacity key={i} onPress={() => toggleChecked(item)} style={styles.checkRow}>
                      <Ionicons name={checkedItems.includes(item) ? "checkbox" : "square-outline"} size={22} color={checkedItems.includes(item) ? COLORS.primary : COLORS.border} />
                      <Text style={[styles.checkText, checkedItems.includes(item) && styles.checkTextLine]}>{item}</Text>
                   </TouchableOpacity>
                 ))
               ) : (
                 result.steps.map((step, i) => (
                   <View key={i} style={styles.stepRow}>
                      <View style={styles.stepNum}><Text style={styles.stepNumText}>{i+1}</Text></View>
                      <Text style={styles.stepContent}>{step}</Text>
                   </View>
                 ))
               )}
            </View>

            <View style={styles.wasteAlert}>
               <Ionicons name="earth" size={20} color={COLORS.primary} />
               <Text style={styles.wasteText}>This recipe avoids {result.waste_tips[0] || 'significant waste'}.</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* INGREDIENT SELECTION MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior="padding" style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Ingredients</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={28} color={COLORS.slate} /></TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {['Vegetables', 'Grains', 'Protein', 'Spices', 'Fruits'].map(cat => (
                <View key={cat} style={styles.catSection}>
                  <Text style={styles.catTitle}>{cat}</Text>
                  <View style={styles.catGrid}>
                    {INGREDIENTS_CATALOG.filter(i => i.category === cat).map(item => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={[styles.ingBtn, selectedIngredients.includes(item.name) && styles.ingBtnActive]}
                        onPress={() => toggleIngredient(item.name)}
                      >
                         <Ionicons name={item.icon} size={18} color={selectedIngredients.includes(item.name) ? "#FFF" : COLORS.primary} />
                         <Text style={[styles.ingBtnText, selectedIngredients.includes(item.name) && styles.ingBtnTextActive]}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            <PrimaryButton title="CONFIRM SELECTION" onPress={() => setModalVisible(false)} style={{ marginVertical: 20 }} />
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* SUSTAINABILITY ALERT MODAL */}
      <EcoInsightModal 
        visible={showScoreAlert}
        onClose={() => setShowScoreAlert(false)}
        onConfirm={() => setShowScoreAlert(false)}
        product={{ name: result?.dish_name, eco_rating: result?.match_percentage }}
        type="warning"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 120, width: CONTENT_WIDTH, alignSelf: 'center' },
  header: { padding: SPACING.l, paddingTop: Platform.OS === 'ios' ? 60 : 40, alignItems: 'center' },
  headerLabel: { fontSize: 10, fontWeight: '900', color: COLORS.primary, letterSpacing: 1.5, marginBottom: 8 },
  title: { ...TYPOGRAPHY.h1, color: COLORS.slate },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.slateMuted, textAlign: 'center', marginTop: 8 },
  formCard: { backgroundColor: '#FFF', margin: SPACING.l, padding: SPACING.l, borderRadius: RADIUS.xl, ...SHADOW.large },
  inputLabel: { fontSize: 10, fontWeight: '800', color: COLORS.slateMuted, marginBottom: 8, marginTop: 16, letterSpacing: 1 },
  ingSelection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 16, borderRadius: RADIUS.m, borderWidth: 1, borderColor: '#E2E8F0' },
  ingSelectionText: { fontSize: 14, fontWeight: '700', color: COLORS.slate },
  loadingBox: { padding: 40, alignItems: 'center' },
  loadingText: { ...TYPOGRAPHY.body, color: COLORS.slateMuted, marginTop: 16, textAlign: 'center' },
  resultContainer: { backgroundColor: '#FFF', margin: SPACING.l, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOW.large },
  resultHeader: { backgroundColor: COLORS.slate, padding: 24, alignItems: 'center' },
  matchPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round, marginBottom: 12 },
  matchText: { fontSize: 11, fontWeight: '900', color: '#FFF', marginLeft: 4 },
  recipeTitle: { ...TYPOGRAPHY.h2, color: '#FFF', textAlign: 'center' },
  tabSwitcher: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: COLORS.primary },
  tabLabel: { fontSize: 13, fontWeight: '700', color: COLORS.slateMuted },
  tabLabelActive: { color: COLORS.slate, fontWeight: '800' },
  tabContent: { padding: 24 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkText: { fontSize: 15, fontWeight: '600', color: COLORS.slate, marginLeft: 12 },
  checkTextLine: { textDecorationLine: 'line-through', color: COLORS.border },
  stepRow: { flexDirection: 'row', marginBottom: 24 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  stepNumText: { fontSize: 12, fontWeight: '900', color: COLORS.primary },
  stepContent: { flex: 1, fontSize: 14, color: COLORS.slate, lineHeight: 22, fontWeight: '500' },
  wasteAlert: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 16, margin: 24, borderRadius: RADIUS.m, marginTop: 0 },
  wasteText: { fontSize: 12, fontWeight: '800', color: COLORS.primary, marginLeft: 10, flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, height: '85%', padding: SPACING.l },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { ...TYPOGRAPHY.h2, color: COLORS.slate },
  modalScroll: { flex: 1 },
  catSection: { marginBottom: 24 },
  catTitle: { fontSize: 14, fontWeight: '800', color: COLORS.slateMuted, marginBottom: 12, textTransform: 'uppercase' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ingBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.round, borderWidth: 1, borderColor: '#E2E8F0' },
  ingBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ingBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.slate, marginLeft: 6 },
  ingBtnTextActive: { color: '#FFF' },
});
