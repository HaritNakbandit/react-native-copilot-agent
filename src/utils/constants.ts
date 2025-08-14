export const STORAGE_KEYS = {
  USER_SESSION: '@user_session',
  USER_PROFILE: '@user_profile',
  USER_SETTINGS: '@user_settings',
  INVESTMENTS: '@investments',
  TRANSACTIONS: '@transactions',
  FUNDS_DATA: '@funds_data',
  PORTFOLIO_CACHE: '@portfolio_cache'
};

export const COLORS = {
  primary: '#2E7D32',      // Green for investments
  secondary: '#1976D2',     // Blue for information
  success: '#4CAF50',       // Green for gains
  error: '#F44336',         // Red for losses
  warning: '#FF9800',       // Orange for alerts
  background: '#F5F5F5',    // Light grey background
  surface: '#FFFFFF',       // White cards
  text: '#212121',          // Dark text
  textSecondary: '#757575', // Grey text
  lightGrey: '#E0E0E0',
  darkGrey: '#424242',
  transparent: 'transparent',
};

export const DARK_COLORS = {
  primary: '#388E3C',
  secondary: '#1E88E5',
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  lightGrey: '#424242',
  darkGrey: '#757575',
  transparent: 'transparent',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const RISK_LEVELS = {
  Low: { color: '#4CAF50', description: 'Conservative investment with stable returns' },
  Medium: { color: '#FF9800', description: 'Balanced risk with moderate growth potential' },
  High: { color: '#F44336', description: 'Aggressive investment with high growth potential' },
};

export const FUND_CATEGORIES = [
  'Equity',
  'Debt',
  'Hybrid',
  'Index',
  'ELSS',
  'International',
  'Sectoral',
  'Thematic',
];

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s\-\(\)]{10,}$/,
  password: {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
  },
};
