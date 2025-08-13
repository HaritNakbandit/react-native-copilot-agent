import React, {createContext, useContext, useReducer, useEffect, ReactNode} from 'react';
import {Fund, Investment, Transaction, PortfolioSummary} from '../types';
import StorageService from '../services/StorageService';
import {calculatePortfolioSummary} from '../utils/helpers';
import {useAuth} from './AuthContext';

interface PortfolioState {
  funds: Fund[];
  investments: Investment[];
  transactions: Transaction[];
  portfolioSummary: PortfolioSummary | null;
  loading: boolean;
}

type PortfolioAction =
  | {type: 'SET_LOADING'; payload: boolean}
  | {type: 'SET_FUNDS'; payload: Fund[]}
  | {type: 'SET_INVESTMENTS'; payload: Investment[]}
  | {type: 'SET_TRANSACTIONS'; payload: Transaction[]}
  | {type: 'SET_PORTFOLIO_SUMMARY'; payload: PortfolioSummary}
  | {type: 'ADD_INVESTMENT'; payload: Investment}
  | {type: 'ADD_TRANSACTION'; payload: Transaction}
  | {type: 'UPDATE_INVESTMENT'; payload: {id: string; updates: Partial<Investment>}}
  | {type: 'RESET_DATA'};

const initialState: PortfolioState = {
  funds: [],
  investments: [],
  transactions: [],
  portfolioSummary: null,
  loading: true,
};

const portfolioReducer = (state: PortfolioState, action: PortfolioAction): PortfolioState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_FUNDS':
      return {
        ...state,
        funds: action.payload,
      };
    case 'SET_INVESTMENTS':
      return {
        ...state,
        investments: action.payload,
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'SET_PORTFOLIO_SUMMARY':
      return {
        ...state,
        portfolioSummary: action.payload,
      };
    case 'ADD_INVESTMENT':
      return {
        ...state,
        investments: [...state.investments, action.payload],
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'UPDATE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map(inv =>
          inv.id === action.payload.id
            ? {...inv, ...action.payload.updates}
            : inv
        ),
      };
    case 'RESET_DATA':
      return {
        ...initialState,
        loading: false,
      };
    default:
      return state;
  }
};

interface PortfolioContextType {
  state: PortfolioState;
  loadData: () => Promise<void>;
  addInvestment: (investment: Investment) => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateInvestment: (id: string, updates: Partial<Investment>) => Promise<void>;
  refreshPortfolioSummary: () => void;
  getFundById: (id: string) => Fund | undefined;
  getUserInvestments: () => Investment[];
  getUserTransactions: () => Transaction[];
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);
  const {state: authState} = useAuth();

  useEffect(() => {
    if (authState.isAuthenticated) {
      loadData();
    } else {
      dispatch({type: 'RESET_DATA'});
    }
  }, [authState.isAuthenticated]);

  useEffect(() => {
    if (state.funds.length > 0 && state.investments.length >= 0) {
      refreshPortfolioSummary();
    }
  }, [state.funds, state.investments]);

  const loadData = async () => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});

      const [funds, investments, transactions] = await Promise.all([
        StorageService.getFunds(),
        StorageService.getInvestments(),
        StorageService.getTransactions(),
      ]);

      dispatch({type: 'SET_FUNDS', payload: funds});
      dispatch({type: 'SET_INVESTMENTS', payload: investments});
      dispatch({type: 'SET_TRANSACTIONS', payload: transactions});
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const addInvestment = async (investment: Investment) => {
    try {
      await StorageService.saveInvestment(investment);
      dispatch({type: 'ADD_INVESTMENT', payload: investment});
    } catch (error) {
      console.error('Error adding investment:', error);
      throw error;
    }
  };

  const addTransaction = async (transaction: Transaction) => {
    try {
      await StorageService.saveTransaction(transaction);
      dispatch({type: 'ADD_TRANSACTION', payload: transaction});
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateInvestment = async (id: string, updates: Partial<Investment>) => {
    try {
      await StorageService.updateInvestment(id, updates);
      dispatch({type: 'UPDATE_INVESTMENT', payload: {id, updates}});
    } catch (error) {
      console.error('Error updating investment:', error);
      throw error;
    }
  };

  const refreshPortfolioSummary = () => {
    const userInvestments = getUserInvestments();
    const portfolioSummary = calculatePortfolioSummary(userInvestments, state.funds);
    dispatch({type: 'SET_PORTFOLIO_SUMMARY', payload: portfolioSummary});
  };

  const getFundById = (id: string): Fund | undefined => {
    return state.funds.find(fund => fund.id === id);
  };

  const getUserInvestments = (): Investment[] => {
    if (!authState.user) return [];
    return state.investments.filter(inv => inv.userId === authState.user!.id);
  };

  const getUserTransactions = (): Transaction[] => {
    if (!authState.user) return [];
    return state.transactions.filter(txn => txn.userId === authState.user!.id);
  };

  const value: PortfolioContextType = {
    state,
    loadData,
    addInvestment,
    addTransaction,
    updateInvestment,
    refreshPortfolioSummary,
    getFundById,
    getUserInvestments,
    getUserTransactions,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
