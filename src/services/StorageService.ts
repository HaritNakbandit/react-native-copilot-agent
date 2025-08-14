import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Investment, Transaction, Fund, UserSettings, PortfolioSummary } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  // User related methods
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify({ 
        isAuthenticated: true, 
        userId: user.id,
        timestamp: new Date().getTime()
      }));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    } catch (error) {
      console.error('Error clearing user:', error);
      throw error;
    }
  }

  async checkUserSession(): Promise<boolean> {
    try {
      const sessionData = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      const currentTime = new Date().getTime();
      const sessionAge = currentTime - session.timestamp;
      
      // Session expires after 30 days
      const maxAge = 30 * 24 * 60 * 60 * 1000;
      return sessionAge < maxAge;
    } catch (error) {
      console.error('Error checking user session:', error);
      return false;
    }
  }

  // Settings methods
  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  async getSettings(): Promise<UserSettings | null> {
    try {
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return settingsData ? JSON.parse(settingsData) : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }

  // Investment methods
  async saveInvestment(investment: Investment): Promise<void> {
    try {
      const investments = await this.getInvestments();
      const updatedInvestments = [...investments, investment];
      await AsyncStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(updatedInvestments));
    } catch (error) {
      console.error('Error saving investment:', error);
      throw error;
    }
  }

  async getInvestments(): Promise<Investment[]> {
    try {
      const investmentsData = await AsyncStorage.getItem(STORAGE_KEYS.INVESTMENTS);
      return investmentsData ? JSON.parse(investmentsData) : [];
    } catch (error) {
      console.error('Error getting investments:', error);
      return [];
    }
  }

  async updateInvestment(investmentId: string, updates: Partial<Investment>): Promise<void> {
    try {
      const investments = await this.getInvestments();
      const updatedInvestments = investments.map(inv => 
        inv.id === investmentId ? { ...inv, ...updates } : inv
      );
      await AsyncStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(updatedInvestments));
    } catch (error) {
      console.error('Error updating investment:', error);
      throw error;
    }
  }

  // Transaction methods
  async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const updatedTransactions = [...transactions, transaction];
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    try {
      const transactionsData = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return transactionsData ? JSON.parse(transactionsData) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  // Fund methods
  async saveFunds(funds: Fund[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FUNDS_DATA, JSON.stringify(funds));
    } catch (error) {
      console.error('Error saving funds:', error);
      throw error;
    }
  }

  async getFunds(): Promise<Fund[]> {
    try {
      const fundsData = await AsyncStorage.getItem(STORAGE_KEYS.FUNDS_DATA);
      return fundsData ? JSON.parse(fundsData) : [];
    } catch (error) {
      console.error('Error getting funds:', error);
      return [];
    }
  }

  async searchFunds(query: string, category?: string): Promise<Fund[]> {
    try {
      const funds = await this.getFunds();
      return funds.filter(fund => {
        const matchesQuery = fund.name.toLowerCase().includes(query.toLowerCase()) ||
                           fund.description.toLowerCase().includes(query.toLowerCase()) ||
                           fund.fundManager.toLowerCase().includes(query.toLowerCase());
        
        const matchesCategory = !category || fund.category === category;
        
        return matchesQuery && matchesCategory;
      });
    } catch (error) {
      console.error('Error searching funds:', error);
      return [];
    }
  }

  // Portfolio cache methods
  async savePortfolioCache(portfolio: PortfolioSummary): Promise<void> {
    try {
      const cacheData = {
        portfolio,
        timestamp: new Date().getTime()
      };
      await AsyncStorage.setItem(STORAGE_KEYS.PORTFOLIO_CACHE, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving portfolio cache:', error);
      throw error;
    }
  }

  async getPortfolioCache(): Promise<PortfolioSummary | null> {
    try {
      const cacheData = await AsyncStorage.getItem(STORAGE_KEYS.PORTFOLIO_CACHE);
      if (!cacheData) return null;

      const cache = JSON.parse(cacheData);
      const currentTime = new Date().getTime();
      const cacheAge = currentTime - cache.timestamp;
      
      // Cache expires after 1 hour
      const maxAge = 60 * 60 * 1000;
      if (cacheAge > maxAge) {
        await AsyncStorage.removeItem(STORAGE_KEYS.PORTFOLIO_CACHE);
        return null;
      }

      return cache.portfolio;
    } catch (error) {
      console.error('Error getting portfolio cache:', error);
      return null;
    }
  }

  // Clear all data (for logout)
  async clearAllData(): Promise<void> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Backup and restore methods
  async exportData(): Promise<string> {
    try {
      const allData: Record<string, any> = {};
      const keys = Object.values(STORAGE_KEYS);
      
      for (const key of keys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          allData[key] = JSON.parse(data);
        }
      }
      
      return JSON.stringify(allData);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async importData(dataString: string): Promise<void> {
    try {
      const data = JSON.parse(dataString);
      
      for (const [key, value] of Object.entries(data)) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

export default new StorageService();
