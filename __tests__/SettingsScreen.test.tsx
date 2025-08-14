import React from 'react';
import { render } from '@testing-library/react-native';
import SettingsScreen from '../src/screens/settings/SettingsScreen';

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// Mock the AuthContext
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    state: {
      user: {
        fullName: 'Test User',
        email: 'test@example.com',
        settings: {
          theme: 'light',
          language: 'en',
          notifications: {
            transactionAlerts: true,
            performanceUpdates: true,
            marketNews: false,
            pushNotifications: true,
          },
          biometricEnabled: false,
        },
      },
      isAuthenticated: true,
      loading: false,
    },
    logout: jest.fn(),
  }),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders correctly', () => {
    const { getByText } = render(<SettingsScreen />);
    
    expect(getByText('Profile Settings')).toBeTruthy();
    expect(getByText('Security')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Theme')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
  });

  it('displays user information when logged in', () => {
    const { getByText } = render(<SettingsScreen />);
    
    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
    expect(getByText('Version 1.0.0')).toBeTruthy();
  });
});
