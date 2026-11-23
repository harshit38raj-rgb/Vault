import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Settings,
  Plus,
  Wallet,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { ActiveView } from '../../types';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'budgets', label: 'Budgets & Goals', icon: PiggyBank },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, openAddTxDrawer, user, toggleUserMode } = useBudget();

  return (
    <aside
      className="hidden md:flex flex-col w-[240px] shrink-0 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark select-none h-screen sticky top-0 z-30"
      aria-label="Desktop Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-border-light dark:border-border-dark">
        <div className="w-9 h-9 rounded-xl bg-brand-purple/15 text-brand-purple flex items-center justify-center border border-brand-purple/30 shadow-glow-purple">
          <Wallet className="w-5 h-5 text-brand-purple" />
        </div>
        <div>
          <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-purple via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            VAULT
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 block -mt-1 uppercase">
            Budget Studio
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-4">
        <button
          onClick={() => openAddTxDrawer('expense')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-hover active:scale-[0.98] text-white font-medium text-sm shadow-md transition-smooth cursor-pointer"
          aria-label="Add New Transaction"
        >
          <Plus className="w-4 h-4" />
          <span>New Transaction</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-smooth cursor-pointer text-left ${
                isActive
                  ? 'bg-brand-purple/15 text-brand-purple font-semibold dark:bg-brand-purple/20 dark:text-purple-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-4 h-4 transition-smooth ${
                  isActive ? 'text-brand-purple dark:text-purple-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User / Guest Switcher Footer */}
      <div className="p-3 border-t border-border-light dark:border-border-dark">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-border-light dark:border-border-dark flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-purple/20 shrink-0 border border-brand-purple/30 flex items-center justify-center text-xs font-bold text-brand-purple">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user.isGuest ? 'Guest Mode' : 'Pro Account'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleUserMode}
            title={user.isGuest ? 'Switch to Alex Rivera' : 'Switch to Guest Mode'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-purple hover:bg-white dark:hover:bg-slate-800 transition-smooth cursor-pointer"
            aria-label="Toggle Guest or Pro user"
          >
            {user.isGuest ? (
              <UserX className="w-4 h-4 text-amber-500" />
            ) : (
              <UserCheck className="w-4 h-4 text-semantic-income" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
