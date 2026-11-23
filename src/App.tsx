import React from 'react';
import { BudgetProvider, useBudget } from './context/BudgetContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';
import { TransactionDrawer } from './components/transactions/TransactionDrawer';
import { OverviewView } from './components/views/OverviewView';
import { TransactionsView } from './components/views/TransactionsView';
import { BudgetsGoalsView } from './components/views/BudgetsGoalsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeView } = useBudget();

  return (
    <div className="min-h-screen flex bg-canvas-light dark:bg-canvas-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 240px Fixed Left Sidebar on Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Sticky Top Bar */}
        <TopBar />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {activeView === 'overview' && <OverviewView />}
          {activeView === 'transactions' && <TransactionsView />}
          {activeView === 'budgets' && <BudgetsGoalsView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation (< 768px) & Floating Action Button */}
      <BottomNav />

      {/* Global Transaction Drawer */}
      <TransactionDrawer />

      {/* Undo Delete & Action Toasts */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BudgetProvider>
      <MainLayout />
    </BudgetProvider>
  );
};

export default App;
