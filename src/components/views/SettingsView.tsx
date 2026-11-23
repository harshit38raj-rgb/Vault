import React, { useState, useRef } from 'react';
import {
  Coins,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Code2,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { CURRENCY_CONFIG } from '../../utils/formatters';
import { CurrencyCode } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    currency,
    setCurrency,
    user,
    toggleUserMode,
    exportData,
    importData,
    resetToSampleData,
    addToast,
  } = useBudget();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `vault_budget_backup_${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast({ message: 'Backup exported successfully', type: 'success' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const result = importData(content);
      if (result.success) {
        setImportStatus('Backup loaded successfully!');
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus(`Error: ${result.error}`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
          System Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Currency formats, local-first data backup, and demo profile controls
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                  Primary Currency
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Formats all KPIs, charts, and budget limits using standard `Intl.NumberFormat`.
              </p>
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="px-4 py-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-semibold outline-none focus:border-brand-purple transition-smooth cursor-pointer"
            >
              {Object.entries(CURRENCY_CONFIG).map(([code, item]) => (
                <option key={code} value={code}>
                  {code} - {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold text-sm border border-brand-purple/30">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                    {user.name}
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      user.isGuest
                        ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        : 'bg-brand-purple/15 text-brand-purple border border-brand-purple/30'
                    }`}
                  >
                    {user.isGuest ? 'Guest Demo' : 'Pro Account'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={toggleUserMode}
              className="px-4 py-2 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-brand-purple/40 shadow-sm transition-smooth cursor-pointer"
            >
              {user.isGuest ? 'Switch to Alex Rivera' : 'Switch to Guest Mode'}
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-purple" />
              <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
                Data Sovereignty & Local Backups
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your financial records are saved offline in browser `localStorage` under key{' '}
              <code className="text-brand-purple font-mono">budget_tracker_v1</code>. No remote server tracking.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-semibold shadow-md active:scale-95 transition-smooth cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Backup</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-brand-purple/40 shadow-sm transition-smooth cursor-pointer">
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Import JSON Backup</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-semantic-coral/30 bg-semantic-coral-bg text-semantic-coral text-xs font-semibold hover:bg-semantic-coral/20 transition-smooth cursor-pointer ml-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Sample Data</span>
            </button>
          </div>

          {importStatus && (
            <p
              className={`text-xs font-medium pt-2 ${
                importStatus.startsWith('Error') ? 'text-semantic-coral' : 'text-semantic-income'
              }`}
            >
              {importStatus}
            </p>
          )}

          {showResetConfirm && (
            <div className="p-4 rounded-xl border border-semantic-coral/40 bg-semantic-coral-bg text-semantic-coral space-y-2 animate-in fade-in duration-200">
              <p className="text-xs font-bold">
                Are you sure you want to restore the initial sample dataset?
              </p>
              <p className="text-[11px] opacity-90">
                This will reset your transactions, category limits, and goals back to the initial pre-seeded state.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    resetToSampleData();
                    setShowResetConfirm(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-semantic-coral text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/20 text-slate-900 dark:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-soft-light dark:shadow-none">
          <div className="flex items-center gap-2 mb-2">
            <Code2 className="w-5 h-5 text-slate-400" />
            <h2 className="font-heading font-bold text-base text-slate-900 dark:text-slate-100">
              System Architecture
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400 mt-3">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">State Layer</p>
              <p className="text-[11px] mt-0.5">React Context + LocalStorage reducer pattern (`budget_tracker_v1`)</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Design System</p>
              <p className="text-[11px] mt-0.5">Tailwind CSS + Plus Jakarta Sans + Inter with tabular figures</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Keyboard Controls</p>
              <p className="text-[11px] mt-0.5">Full `Esc` dismiss on modals/drawers, aria-labels on icon buttons</p>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Motion System</p>
              <p className="text-[11px] mt-0.5">200ms cubic-bezier(0.16, 1, 0.3, 1) respecting `prefers-reduced-motion`</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
