import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/formatters';

export const AnalyticsView: React.FC = () => {
  const {
    transactions,
    selectedMonth,
    currency,
    averageDailySpend,
    totalIncome,
    totalExpenses,
    savingsRate,
    categorySpends,
  } = useBudget();

  // Compute 6-month historical Income vs Expense
  const sixMonthHistory = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthsList: string[] = [];

    // Go back 5 months + current month = 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      monthsList.push(`${y}-${m}`);
    }

    return monthsList.map((ym) => {
      const [y, m] = ym.split('-').map(Number);
      const label = new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short' });

      const txs = transactions.filter((t) => t.date && t.date.startsWith(ym));
      const income = txs
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      const expense = txs
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      return {
        month: label,
        fullMonth: ym,
        income,
        expense,
        net: income - expense,
      };
    });
  }, [transactions, selectedMonth]);

  // Top spending categories ranked
  const topCategories = useMemo(() => {
    return categorySpends
      .filter((c) => c.spent > 0)
      .slice(0, 5)
      .map((c) => ({
        ...c,
        share: totalExpenses > 0 ? (c.spent / totalExpenses) * 100 : 0,
      }));
  }, [categorySpends, totalExpenses]);

  // Projected end of month spend based on daily average
  const [year, month] = selectedMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const projectedMonthlySpend = averageDailySpend * daysInMonth;

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
          Financial Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Longitudinal insights, daily run-rates, and category allocation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg Daily Spend
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-2xl text-slate-900 dark:text-white mt-3 tabular-nums">
            {formatCurrency(averageDailySpend, currency)}
            <span className="text-xs font-normal text-slate-400 ml-1">/ day</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Projected monthly run-rate: {formatCurrency(projectedMonthlySpend, currency)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Savings Retention
            </span>
            <div className="w-8 h-8 rounded-xl bg-semantic-income-bg text-semantic-income flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-2xl text-slate-900 dark:text-white mt-3 tabular-nums">
            {savingsRate.toFixed(1)}%
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Net positive retainment of total income
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Selected Cycle Outflow
            </span>
            <div className="w-8 h-8 rounded-xl bg-semantic-coral-bg text-semantic-coral flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="font-heading font-bold text-2xl text-slate-900 dark:text-white mt-3 tabular-nums">
            {formatCurrency(totalExpenses, currency)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Across {categorySpends.filter((c) => c.spent > 0).length} active spend categories
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
              6-Month Income vs. Expense Comparison
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregated inflows and outflows over the past six billing cycles
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-semantic-income">
              <span className="w-3 h-3 rounded bg-semantic-income inline-block" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5 text-semantic-coral">
              <span className="w-3 h-3 rounded bg-semantic-coral inline-block" />
              <span>Expense</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sixMonthHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const inc = Number(payload[0]?.value) || 0;
                    const exp = Number(payload[1]?.value) || 0;
                    return (
                      <div className="rounded-xl bg-surface-dark border border-border-dark p-3 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-200">{label}</p>
                        <p className="text-semantic-income">Income: {formatCurrency(inc, currency)}</p>
                        <p className="text-semantic-coral">Expense: {formatCurrency(exp, currency)}</p>
                        <p className="text-brand-purple pt-1 border-t border-border-dark">
                          Net: {formatCurrency(inc - exp, currency)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="income" fill="#84CC16" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#F43F5E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
          <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100 mb-1">
            Top Outflow Concentrations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Categories consuming the largest fraction of monthly capital
          </p>

          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((cat, idx) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">
                      {idx + 1}. {cat.category}
                    </span>
                    <span className="text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatCurrency(cat.spent, currency)} ({cat.share.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-purple rounded-full transition-all duration-500"
                      style={{ width: `${cat.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No expenses recorded in this period.
            </div>
          )}
        </div>

        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-semantic-income" />
              <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                Health Scorecard
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Rule of thumb: 50% Needs, 30% Wants, 20% Savings
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-light dark:border-border-dark flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Savings Rate</p>
                  <p className="text-[11px] text-slate-500">Target &gt; 20%</p>
                </div>
                <span
                  className={`font-bold tabular-nums px-2 py-0.5 rounded ${
                    savingsRate >= 20
                      ? 'bg-semantic-income-bg text-semantic-income'
                      : 'bg-semantic-amber-bg text-semantic-amber'
                  }`}
                >
                  {savingsRate.toFixed(1)}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-light dark:border-border-dark flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Budget Discipline</p>
                  <p className="text-[11px] text-slate-500">Categories exceeding limit</p>
                </div>
                <span className="font-bold tabular-nums px-2 py-0.5 rounded bg-brand-purple/15 text-brand-purple">
                  {categorySpends.filter((c) => c.status === 'alert').length} Exceeded
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-light dark:border-border-dark flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Cash Flow Ratio</p>
                  <p className="text-[11px] text-slate-500">Income to Expense factor</p>
                </div>
                <span className="font-bold tabular-nums px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {totalExpenses > 0 ? (totalIncome / totalExpenses).toFixed(2) : '∞'}x
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark text-[11px] text-slate-400">
            Calculated in real-time from active month transactions.
          </div>
        </div>
      </div>
    </div>
  );
};
