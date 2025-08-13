import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {AuthProvider, useAuth} from './src/contexts/AuthContext';
import {PortfolioProvider} from './src/contexts/PortfolioContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import MainNavigator from './src/components/MainNavigator';
import StorageService from './src/services/StorageService';
import {SAMPLE_FUNDS} from './src/utils/sampleData';
import {COLORS} from './src/utils/constants';

// Initialize sample data on app start
const initializeSampleData = async () => {
  try {
    const existingFunds = await StorageService.getFunds();
    if (existingFunds.length === 0) {
      await StorageService.saveFunds(SAMPLE_FUNDS);
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

// Initialize data when app starts
initializeSampleData();

const AppContent: React.FC = () => {
  const {state, login, register} = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    return await login(email, password);
  };

  const handleRegister = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
  }): Promise<boolean> => {
    return await register(userData);
  };

  const handleNavigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  if (state.loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          {/* Add loading spinner component here */}
        </View>
      </SafeAreaView>
    );
  }

  if (!state.isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        {currentScreen === 'login' ? (
          <LoginScreen
            onLogin={handleLogin}
            onNavigateToRegister={handleNavigateToRegister}
          />
        ) : (
          <RegisterScreen
            onRegister={handleRegister}
            onNavigateToLogin={handleNavigateToLogin}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <MainNavigator />
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default App;
