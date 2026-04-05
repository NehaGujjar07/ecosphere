import { Platform } from 'react-native';

export const COLORS = {
  // Primary (Forest Green)
  primary: '#1A5D1A',
  primaryLight: '#4F944F',
  primaryDark: '#0D3E0D',
  
  // Secondary (Mint / Neon accent)
  accent: '#2ecc71',
  
  // Base
  background: '#F9FAFB', // Light mode bg
  surface: '#FFFFFF', // Cards, modals
  text: '#111827', // Main text
  textMuted: '#6B7280',
  border: '#E5E7EB',
  
  // Dark mode mappings (simulated for now)
  darkBackground: '#111827',
  darkSurface: '#1F2937',
  darkText: '#F9FAFB',
  darkTextMuted: '#9CA3AF',
  darkBorder: '#374151',
  
  // Utilities
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
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
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' },
  small: { fontSize: 12, fontWeight: 'normal' },
};

export const RADIUS = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  round: 9999,
};

export const SHADOW = {
  light: Platform.select({
    web: {
      boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
  }),
  medium: Platform.select({
    web: {
      boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
  }),
  large: Platform.select({
    web: {
      boxShadow: '0px -5px 20px rgba(0,0,0,0.1)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
    },
  }),
};
