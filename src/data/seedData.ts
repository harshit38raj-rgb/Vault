import { Transaction, Budget, SavingsGoal, UserProfile } from '../types';

// Helper to get formatted ISO date (YYYY-MM-DD)
export function getRelativeDate(monthsAgo: number, day: number): string {
  const d = new Date();
  d.setDate(1); // Pin to day 1 first to prevent end-of-month rollover
  d.setMonth(d.getMonth() - monthsAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dateStr = String(Math.min(day, 28)).padStart(2, '0');
  return `${year}-${month}-${dateStr}`;
}

export function getCurrentYearMonth(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export const CATEGORIES = {
  income: [
    { name: 'Salary', icon: 'Briefcase', color: '#84CC16' },
    { name: 'Freelance & Consulting', icon: 'Laptop', color: '#10B981' },
    { name: 'Investments & Dividends', icon: 'TrendingUp', color: '#06B6D4' },
    { name: 'Bonuses', icon: 'Gift', color: '#8B5CF6' },
    { name: 'Other Income', icon: 'Coins', color: '#6366F1' },
  ],
  expense: [
    { name: 'Housing & Rent', icon: 'Home', color: '#6366F1' },
    { name: 'Groceries & Food', icon: 'ShoppingCart', color: '#EC4899' },
    { name: 'Dining & Cafes', icon: 'Utensils', color: '#F97316' },
    { name: 'Transportation', icon: 'Car', color: '#3B82F6' },
    { name: 'Utilities & Bills', icon: 'Zap', color: '#EAB308' },
    { name: 'Subscriptions & Tech', icon: 'Tv', color: '#8B5CF6' },
    { name: 'Health & Fitness', icon: 'Activity', color: '#14B8A6' },
    { name: 'Shopping & Leisure', icon: 'ShoppingBag', color: '#F43F5E' },
    { name: 'Travel', icon: 'Plane', color: '#0EA5E9' },
  ],
};

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'UPI',
  'Cash',
  'Apple Pay',
];

export const INITIAL_USER: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@craftui.design',
  isGuest: false,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const GUEST_USER: UserProfile = {
  name: 'Guest Explorer',
  email: 'guest@vault.local',
  isGuest: true,
};

export const INITIAL_BUDGETS: Budget[] = [
  { category: 'Housing & Rent', monthlyLimit: 1800 },
  { category: 'Groceries & Food', monthlyLimit: 600 },
  { category: 'Dining & Cafes', monthlyLimit: 350 },
  { category: 'Transportation', monthlyLimit: 250 },
  { category: 'Subscriptions & Tech', monthlyLimit: 120 },
  { category: 'Shopping & Leisure', monthlyLimit: 300 },
  { category: 'Utilities & Bills', monthlyLimit: 220 },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Emergency Fund (6 Mos)',
    targetAmount: 15000,
    currentAmount: 11250,
    targetDate: getRelativeDate(-8, 15), // 8 months in future
    category: 'Safety',
  },
  {
    id: 'goal-2',
    name: 'Kyoto Autumn Voyage',
    targetAmount: 4500,
    currentAmount: 3200,
    targetDate: getRelativeDate(-4, 20), // 4 months in future
    category: 'Travel',
  },
  {
    id: 'goal-3',
    name: 'Studio Workstation Upgrade',
    targetAmount: 3200,
    currentAmount: 1800,
    targetDate: getRelativeDate(-2, 10), // 2 months in future
    category: 'Tech',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Current Month (0 months ago)
  {
    id: 'tx-01',
    type: 'income',
    amount: 5400,
    category: 'Salary',
    date: getRelativeDate(0, 1),
    paymentMethod: 'Bank Transfer',
    note: 'Monthly primary salary payout',
    isRecurring: true,
  },
  {
    id: 'tx-02',
    type: 'income',
    amount: 1150,
    category: 'Freelance & Consulting',
    date: getRelativeDate(0, 5),
    paymentMethod: 'Bank Transfer',
    note: 'Fintech Design System Advisory',
    isRecurring: false,
  },
  {
    id: 'tx-03',
    type: 'expense',
    amount: 1750,
    category: 'Housing & Rent',
    date: getRelativeDate(0, 2),
    paymentMethod: 'Bank Transfer',
    note: 'Downtown loft rent',
    isRecurring: true,
  },
  {
    id: 'tx-04',
    type: 'expense',
    amount: 168.40,
    category: 'Groceries & Food',
    date: getRelativeDate(0, 4),
    paymentMethod: 'Credit Card',
    note: 'Organic market haul & pantry restocking',
    isRecurring: false,
  },
  {
    id: 'tx-05',
    type: 'expense',
    amount: 94.50,
    category: 'Dining & Cafes',
    date: getRelativeDate(0, 7),
    paymentMethod: 'Credit Card',
    note: 'Omakase dinner with team',
    isRecurring: false,
  },
  {
    id: 'tx-06',
    type: 'expense',
    amount: 65.00,
    category: 'Transportation',
    date: getRelativeDate(0, 9),
    paymentMethod: 'Credit Card',
    note: 'Metropolitan monthly transit pass',
    isRecurring: true,
  },
  {
    id: 'tx-07',
    type: 'expense',
    amount: 114.99,
    category: 'Subscriptions & Tech',
    date: getRelativeDate(0, 11),
    paymentMethod: 'Credit Card',
    note: 'Figma, GitHub Copilot & Spotify Duo',
    isRecurring: true,
  },
  {
    id: 'tx-08',
    type: 'expense',
    amount: 312.00,
    category: 'Dining & Cafes',
    date: getRelativeDate(0, 14),
    paymentMethod: 'Credit Card',
    note: 'Weekend bistro celebration & wine tasting',
    isRecurring: false,
  },
  {
    id: 'tx-09',
    type: 'expense',
    amount: 185.00,
    category: 'Utilities & Bills',
    date: getRelativeDate(0, 16),
    paymentMethod: 'Bank Transfer',
    note: 'Fiber Gigabit Internet & Hydro electric',
    isRecurring: true,
  },
  {
    id: 'tx-10',
    type: 'expense',
    amount: 285.50,
    category: 'Shopping & Leisure',
    date: getRelativeDate(0, 18),
    paymentMethod: 'Apple Pay',
    note: 'Noise-cancelling headphones replacement',
    isRecurring: false,
  },
  {
    id: 'tx-11',
    type: 'expense',
    amount: 195.00,
    category: 'Groceries & Food',
    date: getRelativeDate(0, 21),
    paymentMethod: 'Credit Card',
    note: 'Trader Joe & Whole Foods run',
    isRecurring: false,
  },

  // 1 Month Ago
  {
    id: 'tx-12',
    type: 'income',
    amount: 5400,
    category: 'Salary',
    date: getRelativeDate(1, 1),
    paymentMethod: 'Bank Transfer',
    note: 'Monthly primary salary payout',
    isRecurring: true,
  },
  {
    id: 'tx-13',
    type: 'income',
    amount: 850,
    category: 'Investments & Dividends',
    date: getRelativeDate(1, 12),
    paymentMethod: 'Bank Transfer',
    note: 'Q3 Index Fund dividend distribution',
    isRecurring: false,
  },
  {
    id: 'tx-14',
    type: 'expense',
    amount: 1750,
    category: 'Housing & Rent',
    date: getRelativeDate(1, 2),
    paymentMethod: 'Bank Transfer',
    note: 'Downtown loft rent',
    isRecurring: true,
  },
  {
    id: 'tx-15',
    type: 'expense',
    amount: 520.00,
    category: 'Groceries & Food',
    date: getRelativeDate(1, 10),
    paymentMethod: 'Credit Card',
    note: 'Monthly grocery provisions',
    isRecurring: false,
  },
  {
    id: 'tx-16',
    type: 'expense',
    amount: 230.00,
    category: 'Dining & Cafes',
    date: getRelativeDate(1, 15),
    paymentMethod: 'Credit Card',
    note: 'Weekly espresso & dinner dates',
    isRecurring: false,
  },
  {
    id: 'tx-17',
    type: 'expense',
    amount: 98.00,
    category: 'Subscriptions & Tech',
    date: getRelativeDate(1, 18),
    paymentMethod: 'Credit Card',
    note: 'Cloud services & tools',
    isRecurring: true,
  },

  // 2 Months Ago
  {
    id: 'tx-18',
    type: 'income',
    amount: 5400,
    category: 'Salary',
    date: getRelativeDate(2, 1),
    paymentMethod: 'Bank Transfer',
    note: 'Monthly primary salary payout',
    isRecurring: true,
  },
  {
    id: 'tx-19',
    type: 'income',
    amount: 1200,
    category: 'Bonuses',
    date: getRelativeDate(2, 20),
    paymentMethod: 'Bank Transfer',
    note: 'Mid-year performance recognition',
    isRecurring: false,
  },
  {
    id: 'tx-20',
    type: 'expense',
    amount: 1750,
    category: 'Housing & Rent',
    date: getRelativeDate(2, 2),
    paymentMethod: 'Bank Transfer',
    note: 'Downtown loft rent',
    isRecurring: true,
  },
  {
    id: 'tx-21',
    type: 'expense',
    amount: 480.00,
    category: 'Groceries & Food',
    date: getRelativeDate(2, 12),
    paymentMethod: 'Credit Card',
    note: 'Bi-weekly meal prep stock',
    isRecurring: false,
  },
  {
    id: 'tx-22',
    type: 'expense',
    amount: 140.00,
    category: 'Transportation',
    date: getRelativeDate(2, 22),
    paymentMethod: 'Credit Card',
    note: 'Airport ride & city transit',
    isRecurring: false,
  },
];
