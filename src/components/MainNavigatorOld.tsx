import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Fund} from '../types';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import FundListScreen from '../screens/funds/FundListScreen';
import FundDetailsScreen from '../screens/funds/FundDetailsScreen';
import InvestmentScreen from '../screens/funds/InvestmentScreen';
import TransactionScreen from '../screens/transactions/TransactionScreen';

type Screen = 'dashboard' | 'funds' | 'fundDetails' | 'investment' | 'transactions';

const MainNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleFundSelect = (fund: Fund) => {
    setSelectedFund(fund);
    setCurrentScreen('fundDetails');
  };

  const handleInvestInFund = (fund: Fund) => {
    setSelectedFund(fund);
    setCurrentScreen('investment');
  };

  const handleInvestmentSuccess = () => {
    setCurrentScreen('dashboard');
    setSelectedFund(null);
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setSelectedFund(null);
  };

  const handleBackToFunds = () => {
    setCurrentScreen('funds');
    setSelectedFund(null);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <DashboardScreen
            onNavigateToFunds={() => navigateToScreen('funds')}
            onNavigateToTransactions={() => navigateToScreen('transactions')}
          />
        );

      case 'funds':
        return <FundListScreen onFundSelect={handleFundSelect} />;

      case 'fundDetails':
        return selectedFund ? (
          <FundDetailsScreen
            fund={selectedFund}
            onInvest={handleInvestInFund}
            onBack={handleBackToFunds}
          />
        ) : null;

      case 'investment':
        return selectedFund ? (
          <InvestmentScreen
            fund={selectedFund}
            onSuccess={handleInvestmentSuccess}
            onBack={() => setCurrentScreen('fundDetails')}
          />
        ) : null;

      case 'transactions':
        return <TransactionScreen onBack={handleBackToDashboard} />;

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderCurrentScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainNavigator;
