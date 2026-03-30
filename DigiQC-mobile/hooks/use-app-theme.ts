import { useColorScheme } from 'react-native';

/** Full palette for light & dark modes used across all (main) tab screens */
const light = {
  // Backgrounds
  bg: '#f8f9fa',
  card: '#ffffff',
  cardBorder: 'rgba(0,0,0,0.06)',
  cardSubtle: '#f3f4f6',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',

  // Accents
  blue: '#2563eb',
  blueSoft: 'rgba(37,99,235,0.1)',
  green: '#059669',
  greenSoft: 'rgba(5,150,105,0.1)',
  amber: '#d97706',
  amberSoft: 'rgba(217,119,6,0.1)',
  red: '#dc2626',
  redSoft: 'rgba(220,38,38,0.1)',
  purple: '#7c3aed',

  // Tab bar
  tabBg: 'rgba(255,255,255,0.96)',
  tabBorder: 'rgba(0,0,0,0.06)',
  tabActive: '#2563eb',
  tabInactive: '#9ca3af',
  tabIconActiveBg: 'rgba(37,99,235,0.1)',

  // FAB
  fabBg: '#2563eb',
  fabLabel: '#2563eb',
  fabBorder: 'rgba(37,99,235,0.2)',

  // Controls
  searchBg: '#f3f4f6',
  searchText: '#111827',
  searchPlaceholder: '#9ca3af',
  searchDivider: 'rgba(0,0,0,0.08)',

  // Glow
  glow: 'rgba(37,99,235,0.06)',
  glow2: 'rgba(5,150,105,0.04)',

  // Progress
  trackBg: '#e5e7eb',

  // Shadows
  shadow: '#000',

  // Notification dot
  notifDotBorder: '#f8f9fa',
};

const dark = {
  bg: '#0f1117',
  card: 'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.06)',
  cardSubtle: 'rgba(255,255,255,0.04)',

  textPrimary: '#f1f5f9',
  textSecondary: '#64748b',
  textMuted: '#475569',

  blue: '#3b82f6',
  blueSoft: 'rgba(59,130,246,0.12)',
  green: '#10b981',
  greenSoft: 'rgba(16,185,129,0.12)',
  amber: '#f59e0b',
  amberSoft: 'rgba(245,158,11,0.12)',
  red: '#ef4444',
  redSoft: 'rgba(239,68,68,0.12)',
  purple: '#8b5cf6',

  tabBg: 'rgba(20,22,30,0.95)',
  tabBorder: 'rgba(255,255,255,0.06)',
  tabActive: '#60a5fa',
  tabInactive: 'rgba(255,255,255,0.35)',
  tabIconActiveBg: 'rgba(96,165,250,0.15)',

  fabBg: '#3b82f6',
  fabLabel: '#60a5fa',
  fabBorder: 'rgba(255,255,255,0.15)',

  searchBg: 'rgba(255,255,255,0.06)',
  searchText: '#e2e8f0',
  searchPlaceholder: 'rgba(255,255,255,0.3)',
  searchDivider: 'rgba(255,255,255,0.08)',

  glow: 'rgba(59,130,246,0.08)',
  glow2: 'rgba(16,185,129,0.06)',

  trackBg: 'rgba(255,255,255,0.06)',

  shadow: '#000',

  notifDotBorder: '#0f1117',
};

export type AppTheme = typeof light;

export function useAppTheme(): AppTheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}
