import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/Theme';

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
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'scan' : 'scan-outline';
          } else if (route.name === 'Food') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Market') {
            iconName = focused ? 'cart' : 'cart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        <Stack.Screen 
           name="Checkout" 
           component={CheckoutScreen} 
           options={{ animation: 'slide_from_bottom' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
