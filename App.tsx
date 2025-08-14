import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {AuthProvider} from './src/contexts/AuthContext';
import {PortfolioProvider} from './src/contexts/PortfolioContext';
import AppNavigator from './src/components/AppNavigator';
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={COLORS.primary}
          />
          <AppNavigator />
        </SafeAreaView>
      </PortfolioProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
