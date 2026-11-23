import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBudget();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-brand-purple shrink-0" />;
        let borderClass = 'border-brand-purple/30';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-semantic-income shrink-0" />;
          borderClass = 'border-semantic-income/30';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-semantic-amber shrink-0" />;
          borderClass = 'border-semantic-amber/30';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-semantic-coral shrink-0" />;
          borderClass = 'border-semantic-coral/30';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-light dark:bg-surface-dark border ${borderClass} shadow-elevated-dark backdrop-blur-md transition-smooth animate-in slide-in-from-bottom-2 fade-in duration-200`}
            role="status"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {icon}
              <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                {toast.message}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-brand-purple/20 hover:bg-brand-purple/30 text-brand-purple dark:text-purple-300 font-semibold text-xs transition-smooth cursor-pointer"
                >
                  {toast.action.label}
                </button>
              )}
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-smooth cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
