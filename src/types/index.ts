export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO format YYYY-MM-DD
  paymentMethod: string;
  note?: string;
  isRecurring?: boolean;
}

export interface Budget {
  category: string;
  monthlyLimit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category?: string;
}

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface UserProfile {
  name: string;
  email: string;
  isGuest: boolean;
  avatar?: string;
}

export type ActiveView = 'overview' | 'transactions' | 'budgets' | 'analytics' | 'settings';

export interface AppState {
  version: string;
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  currency: CurrencyCode;
  darkMode: boolean;
  user: UserProfile;
  selectedMonth: string; // YYYY-MM format
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}
