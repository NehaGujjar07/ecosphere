import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, SHADOW } from '../../theme/Theme';
import InputField from '../../components/InputField';
import PrimaryButton from '../../components/PrimaryButton';
import { UserContext } from '../../context/UserContext';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const { loginUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert('Missing fields', 'Please enter all required fields.');
      return;
    }
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister 
      ? { email: email.trim(), password, name: name.trim() } 
      : { email: email.trim(), password };

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.detail || 'Something went wrong.');
      } else {
        loginUser(data.user);
        navigation.replace('MainApp');
      }
    } catch (e) {
      Alert.alert('Connection Error', 'Could not reach the server. Make sure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <LinearGradient colors={['#10B981', '#1A5D1A']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.headerContainer}>
          <Text style={styles.logoText}>EcoSphere</Text>
          <Text style={styles.subtitle}>Your Sustainable Lifestyle Assistant</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>{isRegister ? 'Create Account' : 'Welcome Back'}</Text>

          {isRegister && (
            <InputField
              icon="person-outline"
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          )}

          <InputField
            icon="mail-outline"
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            icon="lock-closed-outline"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
          ) : (
            <PrimaryButton
              title={isRegister ? 'Create Account' : 'Sign In'}
              onPress={handleSubmit}
              style={styles.loginButton}
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
              <Text style={styles.signupText}>{isRegister ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1, justifyContent: 'flex-end' },
  headerContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoText: { ...TYPOGRAPHY.h1, color: '#FFF', fontSize: 42, marginBottom: SPACING.s },
  subtitle: { ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  formContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: 50,
    width: width,
    maxWidth: Platform.OS === 'web' ? 450 : width,
    ...Platform.select({ web: { borderBottomLeftRadius: 32, borderBottomRightRadius: 32 } }),
    ...SHADOW.large,
  },
  welcomeText: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: SPACING.xl },
  loginButton: { marginTop: SPACING.m },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  footerText: { ...TYPOGRAPHY.body, color: COLORS.textMuted },
  signupText: { ...TYPOGRAPHY.body, color: COLORS.primary, fontWeight: 'bold' },
});
