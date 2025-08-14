import { it, describe, expect } from '@jest/globals';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';

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
const mockRegister = jest.fn().mockResolvedValue(true);
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
    state: {
      user: null,
      isAuthenticated: false,
      loading: false,
    },
  }),
}));

describe('form submit', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockRegister.mockClear();
    });

    test('form submit pass validate', async () => {
        render(<RegisterScreen />);

        const inputFullName = screen.getByTestId('input-full-name');
        const inputEmail = screen.getByTestId('input-email');
        const inputPhoneNumber = screen.getByTestId('input-phone-number');
        const inputPassword = screen.getByTestId('input-password');
        const inputConfirmPassword = screen.getByTestId('input-confirm-password');
        const buttonRegister = screen.getByTestId('register-button');

        // Fill out the form
        fireEvent.changeText(inputFullName, 'test test');
        fireEvent.changeText(inputEmail, 'test@gmail.com');
        fireEvent.changeText(inputPhoneNumber, '0957656645');
        fireEvent.changeText(inputPassword, '123456789zZ');
        fireEvent.changeText(inputConfirmPassword, '123456789zZ');

        // Submit the form
        await act(async () => {
            fireEvent.press(buttonRegister);
        });

        // Wait for async operations to complete
        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                fullName: 'test test',
                email: 'test@gmail.com',
                phoneNumber: '0957656645',
                password: '123456789zZ'
            });
        });
    });
})