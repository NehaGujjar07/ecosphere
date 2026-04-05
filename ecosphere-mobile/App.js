import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/theme/Theme';
import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider style={styles.safeArea}>
        <StatusBar style="auto" />
        <View style={styles.webWrapper}>
          <View style={styles.mobileContainer}>
            <AppNavigator />
          </View>
        </View>
      </SafeAreaProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#F3F4F6' : COLORS.background,
  },
  webWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 450 : '100%',
    maxHeight: Platform.OS === 'web' ? 900 : '100%',
    backgroundColor: COLORS.background,
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
      borderRadius: 16,
      marginVertical: 20,
    }),
  },
});
