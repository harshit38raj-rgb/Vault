import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  Plus,
  Trash2,
  Edit2,
  Repeat,
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
  X,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { TransactionType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORIES } from '../../data/seedData';

type SortField = 'date' | 'amount' | 'category';
type SortOrder = 'asc' | 'desc';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    selectedMonth,
    currency,
    openAddTxDrawer,
    openEditTxDrawer,
    deleteTransaction,
  } = useBudget();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [monthScope, setMonthScope] = useState<'current' | 'all'>('current');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (monthScope === 'current' && (!tx.date || !tx.date.startsWith(selectedMonth))) {
        return false;
      }
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCategory = tx.category.toLowerCase().includes(query);
        const matchesNote = tx.note?.toLowerCase().includes(query);
        const matchesPayment = tx.paymentMethod.toLowerCase().includes(query);
        const matchesAmount = tx.amount.toString().includes(query);
        if (!matchesCategory && !matchesNote && !matchesPayment && !matchesAmount) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, selectedMonth, monthScope, typeFilter, categoryFilter, searchQuery]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = (a.date || '').localeCompare(b.date || '');
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredTransactions, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    if (sortedTransactions.length === 0) return;

    const headers = ['ID', 'Type', 'Category', 'Amount', 'Currency', 'Date', 'PaymentMethod', 'Recurring', 'Note'];
    const rows = sortedTransactions.map((tx) => [
      tx.id,
      tx.type,
      `"${tx.category.replace(/"/g, '""')}"`,
      tx.amount,
      currency,
      tx.date,
      `"${tx.paymentMethod.replace(/"/g, '""')}"`,
      tx.isRecurring ? 'Yes' : 'No',
      `"${(tx.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vault_transactions_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allExpenseCats = CATEGORIES.expense.map((c) => c.name);
  const allIncomeCats = CATEGORIES.income.map((c) => c.name);
  const allCategories = Array.from(new Set([...allExpenseCats, ...allIncomeCats]));

  return (
    <div className="space-y-5 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
            Transactions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit, filter, and manage all your inflows and outflows
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={sortedTransactions.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-brand-purple/40 disabled:opacity-40 disabled:cursor-not-allowed transition-smooth cursor-pointer shadow-sm"
            aria-label="Export transactions as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => openAddTxDrawer('expense')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md active:scale-95 transition-smooth cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search category, note, payment method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium outline-none focus:border-brand-purple transition-smooth"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="md:col-span-3 flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-border-light dark:border-border-dark">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-smooth cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-smooth cursor-pointer ${
                typeFilter === 'income'
                  ? 'bg-semantic-income text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-smooth cursor-pointer ${
                typeFilter === 'expense'
                  ? 'bg-semantic-coral text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Expense
            </button>
          </div>

          <div className="md:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold outline-none focus:border-brand-purple transition-smooth cursor-pointer"
            >
              <option value="all">All Categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={monthScope}
              onChange={(e) => setMonthScope(e.target.value as 'current' | 'all')}
              className="w-full px-3 py-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold outline-none focus:border-brand-purple transition-smooth cursor-pointer"
            >
              <option value="current">Current Month</option>
              <option value="all">All Time History</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-slate-200 tabular-nums">{sortedTransactions.length}</strong> transactions
          </span>
          {(searchQuery || typeFilter !== 'all' || categoryFilter !== 'all' || monthScope !== 'current') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setCategoryFilter('all');
                setMonthScope('current');
              }}
              className="text-brand-purple hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {sortedTransactions.length > 0 ? (
        <>
          <div className="hidden md:block rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark overflow-hidden shadow-soft-light dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark bg-slate-50/75 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
                    <th className="py-3 px-5">
                      <button
                        onClick={() => toggleSort('date')}
                        className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                      >
                        <span>Date</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="py-3 px-5">
                      <button
                        onClick={() => toggleSort('category')}
                        className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                      >
                        <span>Category & Note</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="py-3 px-5">Payment Method</th>
                    <th className="py-3 px-5 text-right">
                      <button
                        onClick={() => toggleSort('amount')}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                      >
                        <span>Amount</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    </th>
                    <th className="py-3 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark text-xs sm:text-sm">
                  {sortedTransactions.map((tx) => {
                    const isIncome = tx.type === 'income';
                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-smooth group"
                      >
                        <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300 whitespace-nowrap font-medium tabular-nums">
                          {formatDate(tx.date)}
                        </td>

                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isIncome
                                  ? 'bg-semantic-income-bg text-semantic-income'
                                  : 'bg-semantic-coral-bg text-semantic-coral'
                              }`}
                            >
                              {isIncome ? (
                                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                              ) : (
                                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                  {tx.category}
                                </span>
                                {tx.isRecurring && (
                                  <span
                                    title="Recurring transaction"
                                    className="p-0.5 rounded bg-brand-purple/15 text-brand-purple text-[10px]"
                                  >
                                    <Repeat className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                              {tx.note && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                                  {tx.note}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-5 whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-border-light dark:border-border-dark font-medium">
                            {tx.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 text-right whitespace-nowrap font-bold tabular-nums">
                          <span
                            className={
                              isIncome ? 'text-semantic-income' : 'text-slate-900 dark:text-slate-100'
                            }
                          >
                            {isIncome ? '+' : '-'}
                            {formatCurrency(tx.amount, currency)}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-smooth">
                            <button
                              onClick={() => openEditTxDrawer(tx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-purple hover:bg-brand-purple/10 transition-smooth cursor-pointer"
                              aria-label={`Edit transaction ${tx.category}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-semantic-coral hover:bg-semantic-coral-bg transition-smooth cursor-pointer"
                              aria-label={`Delete transaction ${tx.category}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="block md:hidden space-y-3">
            {sortedTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <div
                  key={tx.id}
                  className="p-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none space-y-3 transition-smooth"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
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
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                            {tx.category}
                          </p>
                          {tx.isRecurring && (
                            <Repeat className="w-3 h-3 text-brand-purple shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-extrabold tabular-nums block ${
                          isIncome ? 'text-semantic-income' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount, currency)}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">
                        {tx.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {tx.note && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-border-light dark:border-border-dark">
                      {tx.note}
                    </p>
                  )}

                  <div className="pt-2 border-t border-border-light dark:border-border-dark flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditTxDrawer(tx)}
                      className="px-3 py-1 rounded-lg border border-border-light dark:border-border-dark text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="px-3 py-1 rounded-lg bg-semantic-coral-bg text-semantic-coral text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="py-16 px-4 rounded-2xl bg-surface-light dark:bg-surface-dark border border-dashed border-border-light dark:border-border-dark text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-800 dark:text-slate-200">
            No transactions found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your search criteria or resetting the applied filters.'
              : 'There are no transactions recorded for this period yet.'}
          </p>
          <button
            onClick={() => openAddTxDrawer('expense')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md active:scale-95 transition-smooth cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Transaction</span>
          </button>
        </div>
      )}
    </div>
  );
};
