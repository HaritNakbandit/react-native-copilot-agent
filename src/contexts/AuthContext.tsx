import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthAction, User } from '../types';
import StorageService from '../services/StorageService';

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isSessionValid = await StorageService.checkUserSession();
      if (isSessionValid) {
        const user = await StorageService.getUser();
        if (user) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          return;
        }
      }
      dispatch({ type: 'LOGIN_FAILURE' });
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call - In real app, this would validate against a backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password combination
      // In production, this would validate against stored credentials
      const user: User = {
        id: `user_${Date.now()}`,
        email,
        fullName: email.split('@')[0], // Use email prefix as name for demo
        phoneNumber: '+1234567890',
        createdAt: new Date(),
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
      };

      await StorageService.saveUser(user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
  }): Promise<boolean> => {
    dispatch({ type: 'REGISTER_START' });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const user: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        createdAt: new Date(),
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
      };

      await StorageService.saveUser(user);
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'REGISTER_FAILURE' });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await StorageService.clearAllData();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) return;

    try {
      const updatedUser = { ...state.user, ...updates };
      await StorageService.saveUser(updatedUser);
      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
