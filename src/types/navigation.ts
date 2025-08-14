import { Fund, Transaction } from './index';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Funds: undefined;
  Transactions: undefined;
  Settings: undefined;
};

export type FundsStackParamList = {
  FundList: undefined;
  FundDetails: { fund: Fund };
  Investment: { fund: Fund };
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  PortfolioDetails: undefined;
};

export type TransactionsStackParamList = {
  TransactionList: undefined;
  TransactionDetails: { transaction: Transaction };
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Profile: undefined;
  Security: undefined;
  Notifications: undefined;
  Theme: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
