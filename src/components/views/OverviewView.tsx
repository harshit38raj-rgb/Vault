import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  Plus,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, formatMonthYear, formatPercentage } from '../../utils/formatters';

export const OverviewView: React.FC = () => {
  const {
    activeMonthTransactions,
    totalIncome,
    totalExpenses,
    netBalance,
    savingsRate,
    momNetChangePercent,
    categorySpends,
    budgetAlerts,
    recentTransactions,
    selectedMonth,
    currency,
    openAddTxDrawer,
    setActiveView,
  } = useBudget();

  const CATEGORY_COLORS: Record<string, string> = {
    'Housing & Rent': '#6366F1',
    'Groceries & Food': '#EC4899',
    'Dining & Cafes': '#F97316',
    'Transportation': '#3B82F6',
    'Utilities & Bills': '#EAB308',
    'Subscriptions & Tech': '#8B5CF6',
    'Health & Fitness': '#14B8A6',
    'Shopping & Leisure': '#F43F5E',
    'Travel': '#0EA5E9',
    'Salary': '#84CC16',
    'Freelance & Consulting': '#10B981',
    'Investments & Dividends': '#06B6D4',
  };

  const dailyFlowData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const dataMap: Record<number, { day: string; income: number; expense: number; net: number }> = {};

    for (let d = 1; d <= daysInMonth; d++) {
      dataMap[d] = {
        day: String(d).padStart(2, '0'),
        income: 0,
        expense: 0,
        net: 0,
      };
    }

    activeMonthTransactions.forEach((tx) => {
      const parts = tx.date.split('-');
      if (parts.length === 3) {
        const dayNum = parseInt(parts[2], 10);
        if (dataMap[dayNum]) {
          if (tx.type === 'income') {
            dataMap[dayNum].income += tx.amount;
          } else {
            dataMap[dayNum].expense += tx.amount;
          }
          dataMap[dayNum].net = dataMap[dayNum].income - dataMap[dayNum].expense;
        }
      }
    });

    return Object.values(dataMap);
  }, [selectedMonth, activeMonthTransactions]);

  const categoryChartData = useMemo(() => {
    return categorySpends
      .filter((cs) => cs.spent > 0)
      .map((cs) => ({
        name: cs.category,
        value: cs.spent,
        color: CATEGORY_COLORS[cs.category] || '#8B5CF6',
      }));
  }, [categorySpends]);

  const hasTransactions = activeMonthTransactions.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {budgetAlerts.length > 0 && (
        <div className="space-y-2 animate-in fade-in duration-200">
          {budgetAlerts.map((alert) => {
            const isExceeded = alert.percent >= 100;
            return (
              <div
                key={alert.category}
                className={`flex items-center justify-between p-3.5 rounded-xl border ${
                  isExceeded
                    ? 'bg-semantic-coral-bg border-semantic-coral/40 text-semantic-coral'
                    : 'bg-semantic-amber-bg border-semantic-amber/40 text-semantic-amber'
                }`}
                role="alert"
              >
                <div className="flex items-center gap-3">
                  {isExceeded ? (
                    <AlertOctagon className="w-5 h-5 shrink-0 stroke-[2]" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 shrink-0 stroke-[2]" />
                  )}
                  <div>
                    <p className="text-xs sm:text-sm font-bold tracking-tight">
                      {isExceeded ? 'Budget Exceeded!' : 'Budget Alert'} — {alert.category}
                    </p>
                    <p className="text-[11px] sm:text-xs opacity-90">
                      Spent {formatCurrency(alert.spent, currency)} of{' '}
                      {formatCurrency(alert.limit, currency)} limit ({Math.round(alert.percent)}%)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('budgets')}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-smooth cursor-pointer shrink-0"
                >
                  Adjust Limit
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-light via-slate-50 to-purple-50/30 dark:from-surface-dark dark:via-[#131b31] dark:to-purple-950/20 border border-border-light dark:border-border-dark p-6 shadow-soft-light dark:shadow-elevated-dark backdrop-blur-md">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net Balance ({formatMonthYear(selectedMonth)})
            </span>
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums ${
                momNetChangePercent >= 0
                  ? 'bg-semantic-income-bg text-semantic-income border border-semantic-income/20'
                  : 'bg-semantic-coral-bg text-semantic-coral border border-semantic-coral/20'
              }`}
            >
              {momNetChangePercent >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{formatPercentage(momNetChangePercent)} MoM</span>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight tabular-nums">
              {formatCurrency(netBalance, currency)}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {netBalance >= 0
                ? 'Surplus capital retained this cycle'
                : 'Deficit incurred; review discretionary spending'}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-border-light dark:border-border-dark/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span>
                Savings efficiency:{' '}
                <strong className="text-brand-purple dark:text-purple-300 tabular-nums">
                  {savingsRate.toFixed(1)}%
                </strong>
              </span>
            </div>
            <button
              onClick={() => openAddTxDrawer('expense')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-hover active:scale-95 transition-smooth cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none flex flex-col justify-between transition-smooth hover:border-semantic-income/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Income
              </span>
              <div className="w-8 h-8 rounded-xl bg-semantic-income-bg text-semantic-income flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-heading font-bold text-2xl text-slate-900 dark:text-white tabular-nums">
                {formatCurrency(totalIncome, currency)}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activeMonthTransactions.filter((t) => t.type === 'income').length} deposits recorded
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none flex flex-col justify-between transition-smooth hover:border-semantic-coral/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Expenses
              </span>
              <div className="w-8 h-8 rounded-xl bg-semantic-coral-bg text-semantic-coral flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-heading font-bold text-2xl text-slate-900 dark:text-white tabular-nums">
                {formatCurrency(totalExpenses, currency)}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activeMonthTransactions.filter((t) => t.type === 'expense').length} charges cleared
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none flex flex-col justify-between transition-smooth hover:border-brand-purple/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Savings Rate
              </span>
              <div className="w-8 h-8 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center">
                <PiggyBank className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
            <div className="mt-4">
              <p className="font-heading font-bold text-2xl text-slate-900 dark:text-white tabular-nums">
                {savingsRate.toFixed(1)}%
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Target: &gt; 20.0%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                Daily Cash Flow
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Income vs Expense activity across {formatMonthYear(selectedMonth)}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-semantic-income">
                <span className="w-2.5 h-2.5 rounded-full bg-semantic-income inline-block" />
                <span>Income</span>
              </div>
              <div className="flex items-center gap-1.5 text-semantic-coral">
                <span className="w-2.5 h-2.5 rounded-full bg-semantic-coral inline-block" />
                <span>Expense</span>
              </div>
            </div>
          </div>

          {hasTransactions ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84CC16" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#84CC16" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
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
                        return (
                          <div className="rounded-xl bg-surface-dark border border-border-dark p-3 shadow-xl text-xs space-y-1">
                            <p className="font-semibold text-slate-200">Day {label}</p>
                            <p className="text-semantic-income">
                              Income: {formatCurrency(Number(payload[0]?.value) || 0, currency)}
                            </p>
                            <p className="text-semantic-coral">
                              Expense: {formatCurrency(Number(payload[1]?.value) || 0, currency)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#84CC16"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#incomeGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#F43F5E"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#expenseGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border-light dark:border-border-dark rounded-xl">
              <Calendar className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No activity recorded in this month
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Add an income or expense transaction to see live trends.
              </p>
              <button
                onClick={() => openAddTxDrawer('expense')}
                className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-semibold shadow hover:bg-brand-purple-hover cursor-pointer"
              >
                + Add Transaction
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none flex flex-col justify-between">
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
              Spending by Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of total {formatCurrency(totalExpenses, currency)} expenses
            </p>
          </div>

          {categoryChartData.length > 0 ? (
            <div className="my-auto py-2">
              <div className="h-44 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [formatCurrency(val, currency), 'Spent']}
                      contentStyle={{
                        backgroundColor: '#0F1629',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#F8FAFC',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Categories</span>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {categoryChartData.length}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {categoryChartData.slice(0, 4).map((item) => {
                  const share = totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(0) : '0';
                  return (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-700 dark:text-slate-300 truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                        {share}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No category spending in this cycle.
            </div>
          )}

          <div className="pt-4 border-t border-border-light dark:border-border-dark flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Detailed breakdown</span>
            <button
              onClick={() => setActiveView('analytics')}
              className="text-brand-purple hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              Analytics <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
              Recent Transactions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest financial activity
            </p>
          </div>
          <button
            onClick={() => setActiveView('transactions')}
            className="flex items-center gap-1 text-xs font-semibold text-brand-purple hover:text-brand-purple-hover cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-2 rounded-xl transition-smooth"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-semantic-income-bg text-semantic-income'
                          : 'bg-semantic-coral-bg text-semantic-coral'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {tx.category}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {tx.note || tx.paymentMethod} • {tx.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        isIncome ? 'text-semantic-income' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, currency)}
                    </p>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                      {tx.paymentMethod}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No transactions found for this period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
