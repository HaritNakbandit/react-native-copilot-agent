import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FundListScreen from '../screens/funds/FundListScreen';
import FundDetailsScreen from '../screens/funds/FundDetailsScreen';
import InvestmentScreen from '../screens/funds/InvestmentScreen';
import { FundsStackParamList } from '../types/navigation';
import { COLORS } from '../utils/constants';

const FundsStack = createNativeStackNavigator<FundsStackParamList>();

const FundsNavigator: React.FC = () => {
  return (
    <FundsStack.Navigator
      initialRouteName="FundList"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <FundsStack.Screen 
        name="FundList" 
        component={FundListScreen}
        options={{ title: 'Investment Funds' }}
      />
      <FundsStack.Screen 
        name="FundDetails" 
        component={FundDetailsScreen}
        options={{ title: 'Fund Details' }}
      />
      <FundsStack.Screen 
        name="Investment" 
        component={InvestmentScreen}
        options={{ title: 'Invest in Fund' }}
      />
    </FundsStack.Navigator>
  );
};

export default FundsNavigator;
