import { Platform } from 'react-native';

export const COLORS = {
  // Primary (Emerald SaaS Green)
  primary: '#059669',
  primaryLight: '#34D399',
  primaryDark: '#064E3B',
  
  // Secondary (Slate SaaS Dark)
  accent: '#10B981',
  slate: '#0F172A',
  slateLight: '#1E293B',
  slateMuted: '#475569',
  
  // Base
  background: '#F8FAFC', // Soft SaaS gray-blue
  surface: '#FFFFFF',    // Pure cards
  text: '#0F172A',       // High contrast slate
  textMuted: '#64748B',  // Accessible muted text
  border: '#E2E8F0',     // Subtle borders
  
  // Dynamic
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  transparent: 'transparent',
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  h3: { fontSize: 20, fontWeight: '600', letterSpacing: -0.2 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
};

export const RADIUS = {
  s: 8,
  m: 12,
  l: 20, // More rounded for professional look
  xl: 32,
  round: 9999,
};

export const SHADOW = {
  light: Platform.select({
    web: {
      boxShadow: '0px 1px 3px rgba(0,0,0,0.05), 0px 1px 2px rgba(0,0,0,0.06)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
  }),
  medium: Platform.select({
    web: {
      boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
  }),
  large: Platform.select({
    web: {
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 6,
    },
  }),
  float: Platform.select({
    web: {
      boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px rgba(0,0,0,0.04)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.1,
      shadowRadius: 25,
      elevation: 10,
    },
  }),
};
