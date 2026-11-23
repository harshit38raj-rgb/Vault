import React from 'react';
import {
  Sun,
  Moon,
  Calendar,
  Wallet,
  Plus,
  Coins,
  ChevronDown,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { formatMonthYear, getAvailableMonths, CURRENCY_CONFIG } from '../../utils/formatters';
import { CurrencyCode } from '../../types';

export const TopBar: React.FC = () => {
  const {
    transactions,
    selectedMonth,
    setSelectedMonth,
    darkMode,
    toggleDarkMode,
    user,
    toggleUserMode,
    currency,
    setCurrency,
    openAddTxDrawer,
  } = useBudget();

  const availableMonths = getAvailableMonths(transactions);

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border-light dark:border-border-dark bg-surface-light/85 dark:bg-surface-dark/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-smooth">
      {/* Left Mobile Brand & Desktop Context */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo */}
        <div className="flex md:hidden items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-purple/15 text-brand-purple flex items-center justify-center border border-brand-purple/30">
            <Wallet className="w-4 h-4 text-brand-purple" />
          </div>
          <span className="font-heading font-extrabold text-base tracking-tight bg-gradient-to-r from-brand-purple to-indigo-400 bg-clip-text text-transparent">
            VAULT
          </span>
        </div>

        {/* Month Selector with Calendar Icon */}
        <div className="relative inline-flex items-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900/80 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 shadow-sm transition-smooth hover:border-brand-purple/50">
            <Calendar className="w-3.5 h-3.5 text-brand-purple shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer pr-4 font-heading font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 appearance-none"
              aria-label="Select Active Month"
            >
              {availableMonths.map((ym) => (
                <option
                  key={ym}
                  value={ym}
                  className="bg-white dark:bg-surface-dark text-slate-900 dark:text-slate-100 py-1"
                >
                  {formatMonthYear(ym)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 -ml-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right Controls: Currency Switcher, Theme Toggle, Profile Badge, Mobile Add */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Currency Quick Dropdown */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-transparent border-none outline-none cursor-pointer text-xs font-semibold text-slate-900 dark:text-slate-100"
            aria-label="Select Currency"
          >
            {Object.entries(CURRENCY_CONFIG).map(([code, item]) => (
              <option
                key={code}
                value={code}
                className="bg-white dark:bg-surface-dark text-slate-900 dark:text-slate-100"
              >
                {code} ({item.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-brand-purple dark:hover:text-brand-purple hover:border-brand-purple/40 shadow-sm transition-smooth cursor-pointer"
          aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* User Demo Badge */}
        <button
          onClick={toggleUserMode}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900/80 hover:border-brand-purple/40 transition-smooth cursor-pointer shadow-sm text-xs"
          title={`Click to switch between Alex and Guest demo`}
          aria-label="Toggle User or Guest Mode"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden bg-brand-purple/20 flex items-center justify-center text-[10px] font-bold text-brand-purple">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <span className="hidden md:inline font-medium text-slate-700 dark:text-slate-300">
            {user.name.split(' ')[0]}
          </span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              user.isGuest
                ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                : 'bg-brand-purple/15 text-brand-purple border border-brand-purple/30'
            }`}
          >
            {user.isGuest ? 'Guest' : 'Pro'}
          </span>
        </button>

        {/* Quick Add Button (Mobile header shortcut) */}
        <button
          onClick={() => openAddTxDrawer('expense')}
          className="flex md:hidden p-2 rounded-xl bg-brand-purple text-white shadow-md active:scale-95 transition-smooth"
          aria-label="Add transaction"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
