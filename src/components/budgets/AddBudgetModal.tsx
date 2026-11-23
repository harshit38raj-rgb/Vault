import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { CATEGORIES } from '../../data/seedData';
import { CURRENCY_CONFIG } from '../../utils/formatters';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ isOpen, onClose }) => {
  const { budgets, setBudgetLimit, currency } = useBudget();
  const [category, setCategory] = useState<string>(CATEGORIES.expense[0].name);
  const [limit, setLimit] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const currencySymbol = CURRENCY_CONFIG[currency]?.symbol || '$';
  const existingCategories = new Set(budgets.map((b) => b.category));
  const availableCategories = CATEGORIES.expense.map((c) => c.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      setError('Limit must be greater than 0');
      return;
    }

    setBudgetLimit(category, parsedLimit);
    setLimit('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-budget-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-2xl p-6 transition-smooth">
        <div className="flex items-center justify-between pb-3 border-b border-border-light dark:border-border-dark">
          <div>
            <h3 id="add-budget-title" className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
              Set Category Budget
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monthly spending cap
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-smooth cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="budget-cat-select" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Category
            </label>
            <select
              id="budget-cat-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium outline-none focus:border-brand-purple transition-smooth cursor-pointer"
            >
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} {existingCategories.has(cat) ? '(Update Existing)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget-limit-input" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Monthly Limit ({currency})
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                {currencySymbol}
              </div>
              <input
                id="budget-limit-input"
                type="number"
                step="10"
                min="10"
                autoFocus
                placeholder="500"
                value={limit}
                onChange={(e) => {
                  setLimit(e.target.value);
                  setError('');
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-semibold tabular-nums outline-none focus:border-brand-purple transition-smooth"
              />
            </div>
            {error && <p className="text-xs text-semantic-coral mt-1 font-medium">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border-light dark:border-border-dark text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-smooth cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md active:scale-95 transition-smooth cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
