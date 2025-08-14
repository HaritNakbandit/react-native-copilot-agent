export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  profilePicture?: string;
  createdAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
  biometricEnabled: boolean;
}

export interface NotificationSettings {
  transactionAlerts: boolean;
  performanceUpdates: boolean;
  marketNews: boolean;
  pushNotifications: boolean;
}

export interface Fund {
  id: string;
  name: string;
  category: string;
  description: string;
  minimumInvestment: number;
  currentNAV: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  fundManager: string;
  inceptionDate: Date;
  totalAssets: number;
  expenseRatio: number;
  benchmark: string;
}

export interface Investment {
  id: string;
  userId: string;
  fundId: string;
  amount: number;
  units: number;
  purchaseNAV: number;
  purchaseDate: Date;
  currentValue: number;
  status: 'Active' | 'Redeemed' | 'Partial';
}

export interface Transaction {
  id: string;
  userId: string;
  fundId: string;
  type: 'SUBSCRIPTION' | 'REDEMPTION';
  amount: number;
  units: number;
  nav: number;
  date: Date;
  status: 'Completed' | 'Processing' | 'Failed';
  reference?: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  investments: Investment[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface AppState {
  auth: AuthState;
  funds: Fund[];
  investments: Investment[];
  transactions: Transaction[];
  portfolio: PortfolioSummary | null;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE' };

export type AppAction = AuthAction | 
  { type: 'SET_FUNDS'; payload: Fund[] } |
  { type: 'SET_INVESTMENTS'; payload: Investment[] } |
  { type: 'SET_TRANSACTIONS'; payload: Transaction[] } |
  { type: 'SET_PORTFOLIO'; payload: PortfolioSummary } |
  { type: 'ADD_INVESTMENT'; payload: Investment } |
  { type: 'ADD_TRANSACTION'; payload: Transaction };

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
}

export interface InvestmentFormData {
  fundId: string;
  amount: number;
  paymentMethod: string;
}

export interface RedemptionFormData {
  investmentId: string;
  redemptionType: 'full' | 'partial';
  amount?: number;
  units?: number;
}
