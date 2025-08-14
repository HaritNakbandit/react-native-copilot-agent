import React from 'react';
import {Alert} from 'react-native';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react-native';
import {it, describe, expect, beforeEach, jest} from '@jest/globals';
import LoginScreen from '../src/screens/auth/LoginScreen';

// Mock Alert
jest.spyOn(Alert, 'alert');

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
const mockLogin = jest.fn();
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  describe('Component Rendering', () => {
    it('renders correctly with all expected elements', () => {
      render(<LoginScreen />);

      // Check header text
      expect(screen.getByText('Welcome Back')).toBeTruthy();
      expect(
        screen.getByText('Sign in to your investment account'),
      ).toBeTruthy();

      // Check form elements
      expect(screen.getByText('Email Address')).toBeTruthy();
      expect(screen.getByTestId('input-email')).toBeTruthy();
      expect(screen.getByText('Password')).toBeTruthy();
      expect(screen.getByTestId('input-password')).toBeTruthy();

      // Check buttons
      expect(screen.getByTestId('login-button')).toBeTruthy();
      expect(screen.getByText('Sign In')).toBeTruthy();
      expect(screen.getByText("Don't have an account? ")).toBeTruthy();
      expect(screen.getByTestId('register-button')).toBeTruthy();
      expect(screen.getByText('Sign Up')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('shows error when email is empty', async () => {
      render(<LoginScreen />);

      const loginButton = screen.getByTestId('login-button');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      expect(screen.getByTestId('error-email')).toBeTruthy();
      expect(screen.getByText('Email is required')).toBeTruthy();
    });

    it('shows error when email is invalid', async () => {
      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.changeText(emailInput, 'invalid-email');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      expect(screen.getByTestId('error-email')).toBeTruthy();
      expect(
        screen.getByText('Please enter a valid email address'),
      ).toBeTruthy();
    });

    it('shows error when password is empty', async () => {
      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.changeText(emailInput, 'test@example.com');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      expect(screen.getByTestId('error-password')).toBeTruthy();
      expect(screen.getByText('Password is required')).toBeTruthy();
    });

    it('shows error when password is too short', async () => {
      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, '123');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      expect(screen.getByTestId('error-password')).toBeTruthy();
      expect(
        screen.getByText('Password must be at least 8 characters'),
      ).toBeTruthy();
    });

    it('does not show errors when form is valid', async () => {
      mockLogin.mockResolvedValue(true);
      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      expect(screen.queryByTestId('error-email')).toBeFalsy();
      expect(screen.queryByTestId('error-password')).toBeFalsy();
    });
  });

  describe('User Interactions', () => {
    it('updates email input value when text changes', () => {
      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      fireEvent.changeText(emailInput, 'test@example.com');

      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('updates password input value when text changes', () => {
      render(<LoginScreen />);

      const passwordInput = screen.getByTestId('input-password');
      fireEvent.changeText(passwordInput, 'mypassword');

      expect(passwordInput.props.value).toBe('mypassword');
    });

    it('navigates to register screen when Sign Up is pressed', () => {
      render(<LoginScreen />);

      const registerButton = screen.getByTestId('register-button');
      fireEvent.press(registerButton);

      expect(mockNavigate).toHaveBeenCalledWith('Register');
    });
  });

  describe('Authentication Flow', () => {
    it('calls login function with correct parameters on successful validation', async () => {
      mockLogin.mockResolvedValue(true);
      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          'test@example.com',
          'password123',
        );
      });
    });

    it('shows alert when login fails', async () => {
      mockLogin.mockResolvedValue(false);
      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Login Failed',
          'Invalid email or password. Please try again.',
        );
      });
    });

    it('shows alert when login throws an error', async () => {
      mockLogin.mockRejectedValue(new Error('Network error'));
      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'An error occurred during login. Please try again.',
        );
      });
    });

    it('handles loading state correctly', async () => {
      // Mock a delayed response to test loading state
      mockLogin.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(true), 100)),
      );

      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      // Check that button shows loading text
      expect(screen.getByText('Loading...')).toBeTruthy();

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeTruthy();
      });
    });

    it('passes email as-is to login function when validation succeeds', async () => {
      mockLogin.mockResolvedValue(true);
      render(<LoginScreen />);

      const emailInput = screen.getByTestId('input-email');
      const passwordInput = screen.getByTestId('input-password');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      await act(async () => {
        fireEvent.press(loginButton);
      });

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          'test@example.com',
          'password123',
        );
      });
    });
  });
});
