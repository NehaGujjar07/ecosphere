import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet } from 'react-native';
import { COLORS, SHADOW, RADIUS } from '../theme/Theme';
import { UserContext } from '../context/UserContext';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/main/DashboardScreen';
import ScannerScreen from '../screens/main/ScannerScreen';
import FoodScreen from '../screens/main/FoodScreen';
import MarketScreen from '../screens/main/MarketScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarShowLabel: Platform.OS !== 'web', // cleaner look on web
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 20,
          ...SHADOW.large,
          // Glass effect style for a SaaS app
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          width: Platform.OS === 'web' ? 450 : '100%',
          alignSelf: 'center',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Food') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Market') {
            iconName = focused ? 'bag-handle' : 'bag-handle-outline';
          }

          return (
            <View style={[
              styles.iconContainer,
              focused && styles.activeIconContainer
            ]}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Food" component={FoodScreen} />
      <Tab.Screen name="Market" component={MarketScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: '#ECFDF5', // Very light emerald background for active tab
  },
});

export default function AppNavigator() {
  const { user } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' // Smoother stack transitions
      }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
            <Stack.Screen 
              name="Checkout" 
              component={CheckoutScreen} 
              options={{ 
                animation: 'slide_from_bottom',
                presentation: 'modal'
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
