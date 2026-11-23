import { CurrencyCode, Transaction } from '../types';

export const CURRENCY_CONFIG: Record<CurrencyCode, { label: string; symbol: string; locale: string }> = {
  USD: { label: 'US Dollar ($)', symbol: '$', locale: 'en-US' },
  INR: { label: 'Indian Rupee (₹)', symbol: '₹', locale: 'en-IN' },
  EUR: { label: 'Euro (€)', symbol: '€', locale: 'de-DE' },
  GBP: { label: 'British Pound (£)', symbol: '£', locale: 'en-GB' },
  JPY: { label: 'Japanese Yen (¥)', symbol: '¥', locale: 'ja-JP' },
  CAD: { label: 'Canadian Dollar (CA$)', symbol: 'CA$', locale: 'en-CA' },
  AUD: { label: 'Australian Dollar (A$)', symbol: 'A$', locale: 'en-AU' },
};

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${config.symbol}${amount.toLocaleString()}`;
  }
}

export function formatNumber(amount: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatMonthYear(yearMonth: string): string {
  if (!yearMonth) return '';
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getPreviousMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const d = new Date(year, month - 2, 1);
  const prevYear = d.getFullYear();
  const prevMonth = String(d.getMonth() + 1).padStart(2, '0');
  return `${prevYear}-${prevMonth}`;
}

export function getAvailableMonths(transactions: Transaction[]): string[] {
  const set = new Set<string>();
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  set.add(currentYM);

  // Add all months from transactions
  transactions.forEach((tx) => {
    if (tx.date && tx.date.length >= 7) {
      set.add(tx.date.substring(0, 7));
    }
  });

  return Array.from(set).sort((a, b) => b.localeCompare(a));
}
