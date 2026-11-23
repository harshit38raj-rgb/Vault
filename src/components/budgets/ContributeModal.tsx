import React, { useState, useEffect } from 'react';
import { X, Sparkles, PlusCircle } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/formatters';

export const ContributeModal: React.FC = () => {
  const { isContributeModalOpen, contributeGoal, closeContributeModal, contributeToGoal, currency } = useBudget();
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setAmount('');
    setError('');
  }, [isContributeModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isContributeModalOpen) {
        closeContributeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isContributeModalOpen, closeContributeModal]);

  if (!isContributeModalOpen || !contributeGoal) return null;

  const current = contributeGoal.currentAmount;
  const target = contributeGoal.targetAmount;
  const parsedAdd = parseFloat(amount) || 0;
  const projectedTotal = current + parsedAdd;
  const currentPercent = Math.min(100, Math.round((current / target) * 100));
  const projectedPercent = Math.min(100, Math.round((projectedTotal / target) * 100));

  const quickPresets = [50, 100, 250, 500];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedAdd <= 0) {
      setError('Please enter an amount greater than 0');
      return;
    }
    contributeToGoal(contributeGoal.id, parsedAdd);
    closeContributeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contribute-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeContributeModal}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-2xl p-6 transition-smooth">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="contribute-title" className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                Contribute to Goal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {contributeGoal.name}
              </p>
            </div>
          </div>
          <button
            onClick={closeContributeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-smooth cursor-pointer"
            aria-label="Close contribute modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Preview */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-light dark:border-border-dark space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Current Progress</span>
            <span className="text-slate-900 dark:text-slate-100 tabular-nums">
              {formatCurrency(current, currency)} / {formatCurrency(target, currency)} ({currentPercent}%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
            {/* Projected bar */}
            <div
              className="h-full bg-brand-purple/40 rounded-full transition-all duration-300"
              style={{ width: `${projectedPercent}%` }}
            />
            {/* Current bar */}
            <div
              className="absolute top-0 left-0 h-full bg-brand-purple rounded-full transition-all duration-300"
              style={{ width: `${currentPercent}%` }}
            />
          </div>

          {parsedAdd > 0 && (
            <p className="text-[11px] text-brand-purple dark:text-purple-300 font-medium pt-1">
              + {formatCurrency(parsedAdd, currency)} will bring your goal to {projectedPercent}%!
            </p>
          )}
        </div>

        {/* Quick presets */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            Quick Add
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                className="py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-purple hover:text-brand-purple transition-smooth cursor-pointer tabular-nums"
              >
                +{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="custom-contribute-amount" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Contribution Amount
            </label>
            <input
              id="custom-contribute-amount"
              type="number"
              step="1"
              min="1"
              autoFocus
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-semibold tabular-nums outline-none focus:border-brand-purple transition-smooth"
            />
            {error && <p className="text-xs text-semantic-coral mt-1 font-medium">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeContributeModal}
              className="px-4 py-2 rounded-xl border border-border-light dark:border-border-dark text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-smooth cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md active:scale-95 transition-smooth cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Confirm Contribution</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
