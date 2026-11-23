import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Calendar, Tag, CreditCard, Repeat } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { CATEGORIES, PAYMENT_METHODS } from '../../data/seedData';
import { TransactionType } from '../../types';
import { CURRENCY_CONFIG } from '../../utils/formatters';

export const TransactionDrawer: React.FC = () => {
  const {
    isTxDrawerOpen,
    closeTxDrawer,
    editingTx,
    defaultTxType,
    addTransaction,
    updateTransaction,
    currency,
  } = useBudget();

  const [type, setType] = useState<TransactionType>(defaultTxType);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [note, setNote] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTx) {
      setType(editingTx.type);
      setAmount(String(editingTx.amount));
      setCategory(editingTx.category);
      setDate(editingTx.date);
      setPaymentMethod(editingTx.paymentMethod || PAYMENT_METHODS[0]);
      setNote(editingTx.note || '');
      setIsRecurring(Boolean(editingTx.isRecurring));
    } else {
      setType(defaultTxType);
      setAmount('');
      const defaultCat = defaultTxType === 'income' ? CATEGORIES.income[0].name : CATEGORIES.expense[0].name;
      setCategory(defaultCat);
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setPaymentMethod(PAYMENT_METHODS[0]);
      setNote('');
      setIsRecurring(false);
    }
    setErrors({});
  }, [editingTx, defaultTxType, isTxDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTxDrawerOpen) {
        closeTxDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTxDrawerOpen, closeTxDrawer]);

  if (!isTxDrawerOpen) return null;

  const currentCategories = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
  const currencySymbol = CURRENCY_CONFIG[currency]?.symbol || '$';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!category.trim()) {
      newErrors.category = 'Please select or enter a category';
    }
    if (!date) {
      newErrors.date = 'Please provide a valid date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amount);

    if (editingTx) {
      updateTransaction({
        ...editingTx,
        type,
        amount: parsedAmount,
        category,
        date,
        paymentMethod,
        note: note.trim() || undefined,
        isRecurring,
      });
    } else {
      addTransaction({
        type,
        amount: parsedAmount,
        category,
        date,
        paymentMethod,
        note: note.trim() || undefined,
        isRecurring,
      });
    }

    closeTxDrawer();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeTxDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-light dark:bg-surface-dark border-l border-border-light dark:border-border-dark shadow-2xl flex flex-col">
          <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
            <div>
              <h2 id="drawer-title" className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
                {editingTx ? 'Edit Transaction' : 'Record Transaction'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {editingTx ? 'Modify transaction details' : 'Keep your cash flow up to date'}
              </p>
            </div>
            <button
              onClick={closeTxDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-smooth cursor-pointer"
              aria-label="Close transaction drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-border-light dark:border-border-dark">
                <button
                  type="button"
                  onClick={() => {
                    setType('expense');
                    setCategory(CATEGORIES.expense[0].name);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-smooth cursor-pointer ${
                    type === 'expense'
                      ? 'bg-semantic-coral text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('income');
                    setCategory(CATEGORIES.income[0].name);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-smooth cursor-pointer ${
                    type === 'income'
                      ? 'bg-semantic-income text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Income</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="tx-amount" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Amount ({currency}) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                  {currencySymbol}
                </div>
                <input
                  id="tx-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  autoFocus
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-base font-semibold tabular-nums outline-none transition-smooth bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
                    errors.amount
                      ? 'border-semantic-coral focus:ring-1 focus:ring-semantic-coral'
                      : 'border-border-light dark:border-border-dark focus:border-brand-purple'
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-semantic-coral mt-1 font-medium">{errors.amount}</p>
              )}
            </div>

            <div>
              <label htmlFor="tx-category" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Category *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4" />
                </div>
                <select
                  id="tx-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-smooth bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 cursor-pointer ${
                    errors.category
                      ? 'border-semantic-coral focus:ring-1 focus:ring-semantic-coral'
                      : 'border-border-light dark:border-border-dark focus:border-brand-purple'
                  }`}
                >
                  {currentCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="text-xs text-semantic-coral mt-1 font-medium">{errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="tx-date" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  id="tx-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-smooth bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${
                    errors.date
                      ? 'border-semantic-coral focus:ring-1 focus:ring-semantic-coral'
                      : 'border-border-light dark:border-border-dark focus:border-brand-purple'
                  }`}
                />
              </div>
              {errors.date && (
                <p className="text-xs text-semantic-coral mt-1 font-medium">{errors.date}</p>
              )}
            </div>

            <div>
              <label htmlFor="tx-payment" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Payment Method
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <select
                  id="tx-payment"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium outline-none focus:border-brand-purple transition-smooth cursor-pointer"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="tx-note" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Note / Description (Optional)
              </label>
              <div className="relative">
                <textarea
                  id="tx-note"
                  rows={2}
                  placeholder="e.g. Weekly grocery haul, flight tickets..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-brand-purple transition-smooth resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-light dark:border-border-dark">
              <div className="flex items-center gap-2.5">
                <Repeat className="w-4 h-4 text-brand-purple" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                    Recurring Monthly
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    E.g. rent, payroll, software subscriptions
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                id="tx-recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-brand-purple rounded border-border-light dark:border-border-dark focus:ring-brand-purple cursor-pointer accent-brand-purple"
              />
            </div>

            <div className="pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeTxDrawer}
                className="px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-smooth cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-sm font-semibold shadow-md active:scale-[0.98] transition-smooth cursor-pointer"
              >
                {editingTx ? 'Save Changes' : 'Record Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
