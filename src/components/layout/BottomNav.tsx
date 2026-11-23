import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { ActiveView } from '../../types';

interface NavTab {
  id: ActiveView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: NavTab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Activity', icon: ArrowLeftRight },
  { id: 'budgets', label: 'Budgets', icon: PiggyBank },
  { id: 'analytics', label: 'Insights', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, openAddTxDrawer } = useBudget();

  return (
    <>
      {/* Floating Action Button (FAB) for Mobile - Fixed bottom-right above bottom bar */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
        <button
          onClick={() => openAddTxDrawer('expense')}
          className="w-13 h-13 rounded-2xl bg-brand-purple hover:bg-brand-purple-hover text-white shadow-glow-purple flex items-center justify-center active:scale-95 transition-smooth cursor-pointer border border-white/20"
          aria-label="Add New Transaction"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Sticky Bottom Navigation Bar for Mobile (< 768px) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden h-16 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md px-2 flex items-center justify-around transition-smooth shadow-lg"
        aria-label="Mobile Navigation"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-smooth cursor-pointer ${
                isActive
                  ? 'text-brand-purple dark:text-purple-400 font-semibold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`p-1 rounded-xl transition-smooth ${
                  isActive ? 'bg-brand-purple/15 dark:bg-brand-purple/25' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
