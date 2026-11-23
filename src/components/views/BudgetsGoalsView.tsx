import React, { useState } from 'react';
import {
  Plus,
  Target,
  PiggyBank,
  Edit2,
  Check,
  X,
  Trash2,
  Calendar,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, formatDate, formatMonthYear } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';
import { AddBudgetModal } from '../budgets/AddBudgetModal';
import { AddGoalModal } from '../budgets/AddGoalModal';
import { ContributeModal } from '../budgets/ContributeModal';

export const BudgetsGoalsView: React.FC = () => {
  const {
    categorySpends,
    savingsGoals,
    selectedMonth,
    currency,
    setBudgetLimit,
    deleteBudget,
    deleteSavingsGoal,
    openContributeModal,
    setIsAddGoalModalOpen,
  } = useBudget();

  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingLimit, setEditingLimit] = useState<string>('');

  const handleStartEdit = (category: string, currentLimit: number) => {
    setEditingCategory(category);
    setEditingLimit(String(currentLimit));
  };

  const handleSaveEdit = (category: string) => {
    const parsed = parseFloat(editingLimit);
    if (!isNaN(parsed) && parsed > 0) {
      setBudgetLimit(category, parsed);
    }
    setEditingCategory(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const budgetedCategories = categorySpends.filter((cs) => cs.limit > 0);
  const totalBudgeted = budgetedCategories.reduce((acc, c) => acc + c.limit, 0);
  const totalSpentInBudget = budgetedCategories.reduce((acc, c) => acc + c.spent, 0);
  const overallBudgetPercent = totalBudgeted > 0 ? (totalSpentInBudget / totalBudgeted) * 100 : 0;

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
            Budgets & Goals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active limits for {formatMonthYear(selectedMonth)} & strategic savings targets
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddBudgetOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-brand-purple/40 shadow-sm transition-smooth cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Budget</span>
          </button>

          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md active:scale-95 transition-smooth cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Savings Goal</span>
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-purple/15 text-brand-purple flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
              Category Budgets
            </h2>
          </div>

          {totalBudgeted > 0 && (
            <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Total Cap:{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {formatCurrency(totalSpentInBudget, currency)} / {formatCurrency(totalBudgeted, currency)}
              </strong>{' '}
              ({Math.round(overallBudgetPercent)}%)
            </div>
          )}
        </div>

        {budgetedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetedCategories.map((b) => {
              const isEditing = editingCategory === b.category;
              const remaining = b.limit - b.spent;
              const percent = b.percent;

              let progressColor = 'bg-brand-purple';
              let badgeBg = 'bg-brand-purple/15 text-brand-purple';
              let statusLabel = 'On Track';

              if (percent >= 100) {
                progressColor = 'bg-semantic-coral';
                badgeBg = 'bg-semantic-coral-bg text-semantic-coral';
                statusLabel = 'Exceeded';
              } else if (percent >= 80) {
                progressColor = 'bg-semantic-amber';
                badgeBg = 'bg-semantic-amber-bg text-semantic-amber';
                statusLabel = 'Near Limit';
              }

              return (
                <div
                  key={b.category}
                  className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none transition-smooth hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CategoryIcon category={b.category} size={18} showBackground />
                        <div className="min-w-0">
                          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                            {b.category}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {remaining >= 0 ? (
                              <span>{formatCurrency(remaining, currency)} remaining</span>
                            ) : (
                              <span className="text-semantic-coral font-medium">
                                Over by {formatCurrency(Math.abs(remaining), currency)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${badgeBg}`}>
                        {statusLabel}
                      </span>
                    </div>

                    <div className="mt-4 mb-2">
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${progressColor} rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        {formatCurrency(b.spent, currency)}{' '}
                        <span className="text-slate-400 font-normal">spent</span>
                      </span>

                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            step="10"
                            autoFocus
                            value={editingLimit}
                            onChange={(e) => setEditingLimit(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(b.category);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="w-20 px-1.5 py-0.5 text-xs font-semibold tabular-nums border rounded border-brand-purple bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none"
                          />
                          <button
                            onClick={() => handleSaveEdit(b.category)}
                            className="p-1 rounded bg-semantic-income-bg text-semantic-income hover:bg-semantic-income/30 cursor-pointer"
                            aria-label="Save limit"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                            aria-label="Cancel editing"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <span className="tabular-nums font-medium">
                            Limit: {formatCurrency(b.limit, currency)}
                          </span>
                          <button
                            onClick={() => handleStartEdit(b.category, b.limit)}
                            title="Edit monthly limit"
                            className="p-1 rounded text-slate-400 hover:text-brand-purple hover:bg-slate-100 dark:hover:bg-slate-800 transition-smooth cursor-pointer"
                            aria-label={`Edit limit for ${b.category}`}
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteBudget(b.category)}
                            title="Delete this budget"
                            className="p-1 rounded text-slate-400 hover:text-semantic-coral hover:bg-semantic-coral-bg transition-smooth cursor-pointer"
                            aria-label={`Delete budget for ${b.category}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between text-[11px] text-slate-400">
                    <span>Utilization</span>
                    <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                      {percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-dashed border-border-light dark:border-border-dark text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              No category limits configured yet.
            </p>
            <button
              onClick={() => setIsAddBudgetOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-semibold shadow hover:bg-brand-purple-hover cursor-pointer"
            >
              + Create First Budget
            </button>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-slate-100">
              Savings Goals
            </h2>
          </div>
        </div>

        {savingsGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsGoals.map((goal) => {
              const current = goal.currentAmount;
              const target = goal.targetAmount;
              const percent = Math.min(100, Math.round((current / target) * 100));
              const remaining = Math.max(0, target - current);
              const isCompleted = current >= target;

              return (
                <div
                  key={goal.id}
                  className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none flex flex-col justify-between transition-smooth hover:border-slate-300 dark:hover:border-slate-700 relative overflow-hidden"
                >
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-semantic-income text-slate-950 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-bl-lg tracking-wider">
                      Target Reached 🎉
                    </div>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-purple">
                          {goal.category || 'Savings'}
                        </span>
                        <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100 truncate mt-0.5">
                          {goal.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => deleteSavingsGoal(goal.id)}
                        className="p-1 rounded text-slate-400 hover:text-semantic-coral hover:bg-semantic-coral-bg transition-smooth cursor-pointer"
                        title="Delete goal"
                        aria-label={`Delete goal ${goal.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                          {formatCurrency(current, currency)}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Target: {formatCurrency(target, currency)}
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-full border-2 border-brand-purple/20 flex flex-col items-center justify-center bg-brand-purple/5">
                        <span className="text-xs font-extrabold text-brand-purple tabular-nums">
                          {percent}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-purple to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Due {formatDate(goal.targetDate)}</span>
                      </div>
                      <span>{formatCurrency(remaining, currency)} left</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Quick Deposit</span>
                    <button
                      onClick={() => openContributeModal(goal)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-purple/15 hover:bg-brand-purple/25 text-brand-purple dark:text-purple-300 font-semibold text-xs transition-smooth cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Contribute</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-dashed border-border-light dark:border-border-dark text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              No active savings targets set.
            </p>
            <button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-semibold shadow hover:bg-brand-purple-hover cursor-pointer"
            >
              + Create First Savings Goal
            </button>
          </div>
        )}
      </section>

      <AddBudgetModal isOpen={isAddBudgetOpen} onClose={() => setIsAddBudgetOpen(false)} />
      <AddGoalModal />
      <ContributeModal />
    </div>
  );
};
