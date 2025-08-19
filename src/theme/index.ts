import { Theme, ThemeColors, Typography, Spacing } from '../types';

const typography: Typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  heading: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  subheading: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  body: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.4,
  },
};

const spacing: Spacing = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  xxl: '4rem',
};

const lightColors: ThemeColors = {
  primary: '#3B82F6',
  primaryLight: '#93C5FD',
  primaryDark: '#1E40AF',
  secondary: '#14B8A6',
  secondaryLight: '#5EEAD4',
  accent: '#F97316',
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkColors: ThemeColors = {
  primary: '#60A5FA',
  primaryLight: '#93C5FD',
  primaryDark: '#3B82F6',
  secondary: '#34D399',
  secondaryLight: '#6EE7B7',
  accent: '#FB923C',
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  surface: '#334155',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textLight: '#94A3B8',
  border: '#475569',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius: '0.5rem',
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
    large: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  },
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius: '0.5rem',
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15)',
    large: '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.15)',
  },
};