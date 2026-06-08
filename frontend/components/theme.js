export const Colors = {
  primary: '#16C47F',
  primaryDark: '#0E9F6E',
  primaryLight: '#D8F5E9',
  primarySoft: '#EAFBF3',
  accent: '#FF8A3D',
  accentLight: '#FFF0E6',
  background: '#F4FBF7',
  backgroundAlt: '#EAF7F0',
  card: '#FFFFFF',
  text: '#0F2A22',
  textPrimary: '#0F2A22',
  textSecondary: '#5B6B66',
  textMuted: '#9AAAA4',
  border: '#E6EFEA',
  borderLight: '#F0F5F2',
  success: '#16C47F',
  warning: '#F6B23A',
  error: '#F2545B',
  white: '#FFFFFF',
  black: '#000000',
  headerGradientStart: '#0E9F6E',
  headerGradientEnd: '#16C47F',
  orange: '#FF8A3D',
  orangeLight: '#FFE2CC',
  blue: '#3B82F6',
  blueLight: '#DBEAFE',
  purple: '#8B5CF6',
  purpleLight: '#EDE9FE',
  red: '#F2545B',
  redLight: '#FDE3E4',
  glass: 'rgba(255,255,255,0.85)',
};

// Gradient presets — arrays consumable by expo-linear-gradient `colors`
export const Gradients = {
  primary: ['#16C47F', '#0E9F6E'],
  primaryVivid: ['#3BE0A0', '#0E9F6E'],
  header: ['#16C47F', '#0BA968'],
  accent: ['#FFB066', '#FF8A3D'],
  sky: ['#5AA9FF', '#3B82F6'],
  purple: ['#A78BFA', '#8B5CF6'],
  sunrise: ['#FFD194', '#FF8A3D'],
  screen: ['#F4FBF7', '#EAF7F0'],
  card: ['#FFFFFF', '#F4FBF7'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Shadow = {
  sm: {
    shadowColor: '#0E9F6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0E9F6E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  lg: {
    shadowColor: '#0E9F6E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  },
  // Soft neutral shadow for white cards on tinted backgrounds
  card: {
    shadowColor: '#1A3A2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },
};
