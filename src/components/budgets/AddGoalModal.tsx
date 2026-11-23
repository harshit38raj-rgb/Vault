import React, { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { getRelativeDate } from '../../data/seedData';

export const AddGoalModal: React.FC = () => {
  const { isAddGoalModalOpen, setIsAddGoalModalOpen, addSavingsGoal } = useBudget();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Personal');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAddGoalModalOpen) {
      setName('');
      setTargetAmount('');
      setCurrentAmount('');
      setTargetDate(getRelativeDate(-6, 15)); // 6 months in future default
      setCategory('Personal');
      setErrors({});
    }
  }, [isAddGoalModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddGoalModalOpen) {
        setIsAddGoalModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddGoalModalOpen, setIsAddGoalModalOpen]);

  if (!isAddGoalModalOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Goal name is required';
    const target = parseFloat(targetAmount);
    if (isNaN(target) || target <= 0) errs.targetAmount = 'Target amount must be > 0';
    if (!targetDate) errs.targetDate = 'Target date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addSavingsGoal({
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      targetDate,
      category,
    });

    setIsAddGoalModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-goal-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAddGoalModalOpen(false)}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-2xl p-6 transition-smooth">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 id="add-goal-title" className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                Create Savings Goal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track and fund your major financial milestones
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddGoalModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-smooth cursor-pointer"
            aria-label="Close goal modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="goal-name" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              Goal Name *
            </label>
            <input
              id="goal-name"
              type="text"
              autoFocus
              placeholder="e.g. New Laptop, Wedding, Down Payment"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium outline-none focus:border-brand-purple transition-smooth"
            />
            {errors.name && <p className="text-xs text-semantic-coral mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="goal-target" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Target Amount *
              </label>
              <input
                id="goal-target"
                type="number"
                step="1"
                min="1"
                placeholder="5000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-semibold tabular-nums outline-none focus:border-brand-purple transition-smooth"
              />
              {errors.targetAmount && <p className="text-xs text-semantic-coral mt-1">{errors.targetAmount}</p>}
            </div>

            <div>
              <label htmlFor="goal-starting" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Starting Amount
              </label>
              <input
                id="goal-starting"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-semibold tabular-nums outline-none focus:border-brand-purple transition-smooth"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="goal-date" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Target Date *
              </label>
              <input
                id="goal-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-brand-purple transition-smooth"
              />
              {errors.targetDate && <p className="text-xs text-semantic-coral mt-1">{errors.targetDate}</p>}
            </div>

            <div>
              <label htmlFor="goal-cat" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                Category
              </label>
              <select
                id="goal-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-brand-purple transition-smooth cursor-pointer"
              >
                <option value="Personal">Personal</option>
                <option value="Travel">Travel</option>
                <option value="Safety">Safety & Emergency</option>
                <option value="Tech">Tech & Gear</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-light dark:border-border-dark">
            <button
              type="button"
              onClick={() => setIsAddGoalModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-border-light dark:border-border-dark text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-smooth cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md active:scale-95 transition-smooth cursor-pointer"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
