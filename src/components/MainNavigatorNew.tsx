import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import TransactionScreen from '../screens/transactions/TransactionScreen';
import FundsNavigator from './FundsNavigator';
import { MainTabParamList, DashboardStackParamList, TransactionsStackParamList } from '../types/navigation';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const TransactionsStack = createNativeStackNavigator<TransactionsStackParamList>();

const DashboardNavigator: React.FC = () => {
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <DashboardStack.Screen 
        name="DashboardHome" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
    </DashboardStack.Navigator>
  );
};

const TransactionsNavigator: React.FC = () => {
  return (
    <TransactionsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <TransactionsStack.Screen 
        name="TransactionList" 
        component={TransactionScreen}
        options={{ title: 'Transactions' }}
      />
    </TransactionsStack.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.lightGrey,
        },
      }}>
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardNavigator}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Funds" 
        component={FundsNavigator}
        options={{
          tabBarLabel: 'Funds',
        }}
      />
      <Tab.Screen 
        name="Transactions" 
        component={TransactionsNavigator}
        options={{
          tabBarLabel: 'Transactions',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
