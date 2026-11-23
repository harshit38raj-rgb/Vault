import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Transaction,
  Budget,
  SavingsGoal,
  CurrencyCode,
  UserProfile,
  ActiveView,
  ToastNotification,
} from '../types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_USER,
  GUEST_USER,
  getCurrentYearMonth,
} from '../data/seedData';
import { getPreviousMonth } from '../utils/formatters';

const STORAGE_KEY = 'budget_tracker_v1';

interface CategorySpend {
  category: string;
  spent: number;
  limit: number;
  percent: number;
  status: 'normal' | 'warning' | 'alert';
}

interface BudgetContextType {
  // Data
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  currency: CurrencyCode;
  darkMode: boolean;
  user: UserProfile;
  selectedMonth: string;
  activeView: ActiveView;
  toasts: ToastNotification[];

  // Dynamic Metrics for Selected Month
  activeMonthTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsRate: number;
  momNetChangePercent: number;
  categorySpends: CategorySpend[];
  budgetAlerts: CategorySpend[];
  averageDailySpend: number;
  recentTransactions: Transaction[];

  // Mutators
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  setBudgetLimit: (category: string, monthlyLimit: number) => void;
  deleteBudget: (category: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'> & { currentAmount?: number }) => void;
  updateSavingsGoal: (goal: SavingsGoal) => void;
  contributeToGoal: (id: string, amount: number) => void;
  deleteSavingsGoal: (id: string) => void;

  // Preferences & State
  setCurrency: (currency: CurrencyCode) => void;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  setUser: (user: UserProfile) => void;
  toggleUserMode: () => void;
  setSelectedMonth: (month: string) => void;
  setActiveView: (view: ActiveView) => void;
  exportData: () => string;
  importData: (jsonStr: string) => { success: boolean; error?: string };
  resetToSampleData: () => void;

  // Toast UI
  addToast: (toast: Omit<ToastNotification, 'id'>) => string;
  removeToast: (id: string) => void;

  // Drawer / Modal Controls
  isTxDrawerOpen: boolean;
  editingTx: Transaction | null;
  defaultTxType: 'income' | 'expense';
  openAddTxDrawer: (type?: 'income' | 'expense') => void;
  openEditTxDrawer: (tx: Transaction) => void;
  closeTxDrawer: () => void;

  isContributeModalOpen: boolean;
  contributeGoal: SavingsGoal | null;
  openContributeModal: (goal: SavingsGoal) => void;
  closeContributeModal: () => void;

  isAddGoalModalOpen: boolean;
  setIsAddGoalModalOpen: (open: boolean) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted state or seed data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_transactions`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading transactions from localStorage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_budgets`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading budgets from localStorage', e);
    }
    return INITIAL_BUDGETS;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_goals`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading goals from localStorage', e);
    }
    return INITIAL_SAVINGS_GOALS;
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_currency`);
      if (stored) return stored as CurrencyCode;
    } catch (e) {
      console.error('Failed reading currency from localStorage', e);
    }
    return 'USD';
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_darkMode`);
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading darkMode from localStorage', e);
    }
    return true; // Default Dark Mode as requested
  });

  const [user, setUserState] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_user`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading user from localStorage', e);
    }
    return INITIAL_USER;
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentYearMonth());
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modals & Drawers
  const [isTxDrawerOpen, setIsTxDrawerOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [defaultTxType, setDefaultTxType] = useState<'income' | 'expense'>('expense');

  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(null);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to sync transactions', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_budgets`, JSON.stringify(budgets));
    } catch (e) {
      console.error('Failed to sync budgets', e);
    }
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(savingsGoals));
    } catch (e) {
      console.error('Failed to sync goals', e);
    }
  }, [savingsGoals]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_currency`, currency);
    } catch (e) {
      console.error('Failed to sync currency', e);
    }
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_darkMode`, JSON.stringify(darkMode));
    } catch (e) {
      console.error('Failed to sync darkMode', e);
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to sync user', e);
    }
  }, [user]);

  // Toast Helpers
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastNotification, 'id'>): string => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const newToast: ToastNotification = { id, duration: 5000, ...toast };
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }
      return id;
    },
    [removeToast]
  );

  // Delete transaction with UNDO toast
  const deleteTransaction = useCallback(
    (id: string) => {
      const target = transactions.find((t) => t.id === id);
      if (!target) return;

      setTransactions((prev) => prev.filter((t) => t.id !== id));

      addToast({
        message: `Deleted transaction: ${target.category} (${target.amount})`,
        type: 'info',
        duration: 6000,
        action: {
          label: 'Undo',
          onClick: () => {
            setTransactions((prev) => [target, ...prev]);
            addToast({ message: 'Transaction restored', type: 'success', duration: 2500 });
          },
        },
      });
    },
    [transactions, addToast]
  );

  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>) => {
      const newTx: Transaction = {
        ...tx,
        id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      };
      setTransactions((prev) => [newTx, ...prev]);
      addToast({
        message: `${tx.type === 'income' ? 'Income' : 'Expense'} added successfully`,
        type: 'success',
      });
    },
    [addToast]
  );

  const updateTransaction = useCallback(
    (tx: Transaction) => {
      setTransactions((prev) => prev.map((item) => (item.id === tx.id ? tx : item)));
      addToast({ message: 'Transaction updated successfully', type: 'success' });
    },
    [addToast]
  );

  const setBudgetLimit = useCallback(
    (category: string, monthlyLimit: number) => {
      setBudgets((prev) => {
        const existing = prev.find((b) => b.category === category);
        if (existing) {
          return prev.map((b) => (b.category === category ? { ...b, monthlyLimit } : b));
        }
        return [...prev, { category, monthlyLimit }];
      });
      addToast({ message: `Budget for ${category} updated`, type: 'success' });
    },
    [addToast]
  );

  const deleteBudget = useCallback(
    (category: string) => {
      setBudgets((prev) => prev.filter((b) => b.category !== category));
      addToast({ message: `Budget for ${category} removed`, type: 'info' });
    },
    [addToast]
  );

  const addSavingsGoal = useCallback(
    (goal: Omit<SavingsGoal, 'id' | 'currentAmount'> & { currentAmount?: number }) => {
      const newGoal: SavingsGoal = {
        id: 'goal-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        currentAmount: goal.currentAmount || 0,
        ...goal,
      };
      setSavingsGoals((prev) => [...prev, newGoal]);
      addToast({ message: `Savings goal "${goal.name}" created`, type: 'success' });
    },
    [addToast]
  );

  const updateSavingsGoal = useCallback(
    (goal: SavingsGoal) => {
      setSavingsGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
      addToast({ message: `Goal "${goal.name}" updated`, type: 'success' });
    },
    [addToast]
  );

  const contributeToGoal = useCallback(
    (id: string, amount: number) => {
      if (amount <= 0) return;
      setSavingsGoals((prev) =>
        prev.map((g) => {
          if (g.id === id) {
            const nextAmount = g.currentAmount + amount;
            return { ...g, currentAmount: nextAmount };
          }
          return g;
        })
      );
      addToast({ message: `Contributed to goal!`, type: 'success' });
    },
    [addToast]
  );

  const deleteSavingsGoal = useCallback(
    (id: string) => {
      const goal = savingsGoals.find((g) => g.id === id);
      setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
      if (goal) {
        addToast({
          message: `Removed savings goal "${goal.name}"`,
          type: 'info',
        });
      }
    },
    [savingsGoals, addToast]
  );

  const setCurrency = (c: CurrencyCode) => setCurrencyState(c);
  const setDarkMode = (d: boolean) => setDarkModeState(d);
  const toggleDarkMode = () => setDarkModeState((prev) => !prev);
  const setUser = (u: UserProfile) => setUserState(u);

  const toggleUserMode = () => {
    if (user.isGuest) {
      setUserState(INITIAL_USER);
      addToast({ message: 'Switched to John / Alex profile', type: 'info' });
    } else {
      setUserState(GUEST_USER);
      addToast({ message: 'Switched to Guest Demo mode', type: 'info' });
    }
  };

  const exportData = useCallback((): string => {
    const backup = {
      version: STORAGE_KEY,
      exportedAt: new Date().toISOString(),
      currency,
      user,
      transactions,
      budgets,
      savingsGoals,
    };
    return JSON.stringify(backup, null, 2);
  }, [currency, user, transactions, budgets, savingsGoals]);

  const importData = useCallback(
    (jsonStr: string): { success: boolean; error?: string } => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (!parsed.transactions || !Array.isArray(parsed.transactions)) {
          return { success: false, error: 'Invalid backup file: Missing transactions array.' };
        }
        if (parsed.budgets && Array.isArray(parsed.budgets)) {
          setBudgets(parsed.budgets);
        }
        if (parsed.savingsGoals && Array.isArray(parsed.savingsGoals)) {
          setSavingsGoals(parsed.savingsGoals);
        }
        if (parsed.currency) {
          setCurrencyState(parsed.currency);
        }
        setTransactions(parsed.transactions);
        addToast({ message: 'Data imported successfully!', type: 'success' });
        return { success: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'JSON parse failure';
        return { success: false, error: msg };
      }
    },
    [addToast]
  );

  const resetToSampleData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setUserState(INITIAL_USER);
    addToast({ message: 'Reset to sample transactions & budgets', type: 'info' });
  }, [addToast]);

  // Drawer / Modal Handlers
  const openAddTxDrawer = (type: 'income' | 'expense' = 'expense') => {
    setDefaultTxType(type);
    setEditingTx(null);
    setIsTxDrawerOpen(true);
  };

  const openEditTxDrawer = (tx: Transaction) => {
    setEditingTx(tx);
    setDefaultTxType(tx.type);
    setIsTxDrawerOpen(true);
  };

  const closeTxDrawer = () => {
    setIsTxDrawerOpen(false);
    setEditingTx(null);
  };

  const openContributeModal = (goal: SavingsGoal) => {
    setContributeGoal(goal);
    setIsContributeModalOpen(true);
  };

  const closeContributeModal = () => {
    setIsContributeModalOpen(false);
    setContributeGoal(null);
  };

  // --- Dynamic Calculations for active selectedMonth ---
  const activeMonthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date && t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const totalIncome = useMemo(() => {
    return activeMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [activeMonthTransactions]);

  const totalExpenses = useMemo(() => {
    return activeMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [activeMonthTransactions]);

  const netBalance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  const savingsRate = useMemo(() => {
    if (totalIncome <= 0) return 0;
    const rate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    return Math.max(0, rate);
  }, [totalIncome, totalExpenses]);

  // Month-over-Month calculation
  const momNetChangePercent = useMemo(() => {
    const prevMonth = getPreviousMonth(selectedMonth);
    const prevTxs = transactions.filter((t) => t.date && t.date.startsWith(prevMonth));
    const prevIncome = prevTxs
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const prevExpenses = prevTxs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const prevNet = prevIncome - prevExpenses;

    if (prevNet === 0) {
      return netBalance > 0 ? 100 : 0;
    }
    return ((netBalance - prevNet) / Math.abs(prevNet)) * 100;
  }, [transactions, selectedMonth, netBalance]);

  // Spending by category & budget alerts
  const categorySpends = useMemo((): CategorySpend[] => {
    const spendMap: Record<string, number> = {};
    activeMonthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        spendMap[t.category] = (spendMap[t.category] || 0) + (Number(t.amount) || 0);
      });

    // Also include categories that have a budget even if 0 spent
    const allCategories = new Set<string>([
      ...Object.keys(spendMap),
      ...budgets.map((b) => b.category),
    ]);

    return Array.from(allCategories)
      .map((cat) => {
        const spent = spendMap[cat] || 0;
        const budgetObj = budgets.find((b) => b.category === cat);
        const limit = budgetObj ? budgetObj.monthlyLimit : 0;
        const percent = limit > 0 ? (spent / limit) * 100 : 0;
        let status: 'normal' | 'warning' | 'alert' = 'normal';
        if (limit > 0) {
          if (percent >= 100) status = 'alert';
          else if (percent >= 80) status = 'warning';
        }
        return { category: cat, spent, limit, percent, status };
      })
      .sort((a, b) => b.spent - a.spent);
  }, [activeMonthTransactions, budgets]);

  // Categories >= 80% limit
  const budgetAlerts = useMemo(() => {
    return categorySpends.filter((cs) => cs.limit > 0 && cs.percent >= 80);
  }, [categorySpends]);

  // Average daily spend for selected month
  const averageDailySpend = useMemo(() => {
    if (totalExpenses <= 0) return 0;
    const [year, month] = selectedMonth.split('-').map(Number);
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
    const daysInMonth = new Date(year, month, 0).getDate();
    const divisor = isCurrentMonth ? Math.max(1, now.getDate()) : daysInMonth;
    return totalExpenses / divisor;
  }, [totalExpenses, selectedMonth]);

  // 5 most recent transactions in active month (or all transactions if month is empty)
  const recentTransactions = useMemo(() => {
    const source = activeMonthTransactions.length > 0 ? activeMonthTransactions : transactions;
    return [...source]
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 5);
  }, [activeMonthTransactions, transactions]);

  const value = {
    transactions,
    budgets,
    savingsGoals,
    currency,
    darkMode,
    user,
    selectedMonth,
    activeView,
    toasts,

    activeMonthTransactions,
    totalIncome,
    totalExpenses,
    netBalance,
    savingsRate,
    momNetChangePercent,
    categorySpends,
    budgetAlerts,
    averageDailySpend,
    recentTransactions,

    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudgetLimit,
    deleteBudget,
    addSavingsGoal,
    updateSavingsGoal,
    contributeToGoal,
    deleteSavingsGoal,

    setCurrency,
    setDarkMode,
    toggleDarkMode,
    setUser,
    toggleUserMode,
    setSelectedMonth,
    setActiveView,
    exportData,
    importData,
    resetToSampleData,

    addToast,
    removeToast,

    isTxDrawerOpen,
    editingTx,
    defaultTxType,
    openAddTxDrawer,
    openEditTxDrawer,
    closeTxDrawer,

    isContributeModalOpen,
    contributeGoal,
    openContributeModal,
    closeContributeModal,

    isAddGoalModalOpen,
    setIsAddGoalModalOpen,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
