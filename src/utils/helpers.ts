import {Investment, Fund, PortfolioSummary} from '../types';

export const calculatePortfolioSummary = (
  investments: Investment[],
  funds: Fund[]
): PortfolioSummary => {
  let totalInvested = 0;
  let totalCurrentValue = 0;

  const activeInvestments = investments.filter(inv => inv.status === 'Active');

  activeInvestments.forEach(investment => {
    totalInvested += investment.amount;
    
    // Calculate current value based on current NAV
    const fund = funds.find(f => f.id === investment.fundId);
    if (fund) {
      const currentValue = investment.units * fund.currentNAV;
      totalCurrentValue += currentValue;
      investment.currentValue = currentValue; // Update current value
    } else {
      totalCurrentValue += investment.currentValue;
    }
  });

  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return {
    totalValue: totalCurrentValue,
    totalInvested,
    totalGainLoss,
    totalGainLossPercentage,
    investments: activeInvestments,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatLargeNumber = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  return formatCurrency(amount);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const generateTransactionReference = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${random}`;
};

export const generateInvestmentId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV${timestamp}${random}`;
};

export const calculateSIP = (
  monthlyAmount: number,
  annualReturn: number,
  years: number
): {
  totalInvested: number;
  maturityValue: number;
  totalGain: number;
} => {
  const monthlyReturn = annualReturn / 12 / 100;
  const totalMonths = years * 12;
  
  const maturityValue = monthlyAmount * 
    (((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) * (1 + monthlyReturn));
  
  const totalInvested = monthlyAmount * totalMonths;
  const totalGain = maturityValue - totalInvested;
  
  return {
    totalInvested,
    maturityValue,
    totalGain,
  };
};

export const getRiskColorAndDescription = (riskLevel: string): {
  color: string;
  description: string;
} => {
  switch (riskLevel) {
    case 'Low':
      return {
        color: '#4CAF50',
        description: 'Conservative investment with stable returns and minimal risk',
      };
    case 'Medium':
      return {
        color: '#FF9800',
        description: 'Balanced investment with moderate risk and growth potential',
      };
    case 'High':
      return {
        color: '#F44336',
        description: 'Aggressive investment with high risk and high growth potential',
      };
    default:
      return {
        color: '#757575',
        description: 'Risk level not specified',
      };
  }
};

export const sortFundsByPerformance = (funds: Fund[], period: '1y' | '3y' | '5y' = '1y'): Fund[] => {
  return [...funds].sort((a, b) => {
    let returnA: number, returnB: number;
    
    switch (period) {
      case '1y':
        returnA = a.oneYearReturn;
        returnB = b.oneYearReturn;
        break;
      case '3y':
        returnA = a.threeYearReturn;
        returnB = b.threeYearReturn;
        break;
      case '5y':
        returnA = a.fiveYearReturn;
        returnB = b.fiveYearReturn;
        break;
    }
    
    return returnB - returnA; // Descending order
  });
};

export const filterFundsByRisk = (funds: Fund[], riskLevel: string): Fund[] => {
  return funds.filter(fund => fund.riskLevel === riskLevel);
};

export const searchFunds = (funds: Fund[], query: string): Fund[] => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return funds;
  
  return funds.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm) ||
    fund.description.toLowerCase().includes(searchTerm) ||
    fund.category.toLowerCase().includes(searchTerm) ||
    fund.fundManager.toLowerCase().includes(searchTerm)
  );
};
