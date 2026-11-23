import React from 'react';
import {
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Coins,
  Home,
  ShoppingCart,
  Utensils,
  Car,
  Zap,
  Tv,
  Activity,
  ShoppingBag,
  Plane,
  Tag,
} from 'lucide-react';

interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
  showBackground?: boolean;
}

const CATEGORY_MAP: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  // Income
  Salary: { icon: Briefcase, color: '#84CC16', bg: 'rgba(132, 204, 22, 0.15)' },
  'Freelance & Consulting': { icon: Laptop, color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  'Investments & Dividends': { icon: TrendingUp, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' },
  Bonuses: { icon: Gift, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
  'Other Income': { icon: Coins, color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)' },

  // Expenses
  'Housing & Rent': { icon: Home, color: '#6366F1', bg: 'rgba(99, 102, 241, 0.15)' },
  'Groceries & Food': { icon: ShoppingCart, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.15)' },
  'Dining & Cafes': { icon: Utensils, color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' },
  Transportation: { icon: Car, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  'Utilities & Bills': { icon: Zap, color: '#EAB308', bg: 'rgba(234, 179, 8, 0.15)' },
  'Subscriptions & Tech': { icon: Tv, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' },
  'Health & Fitness': { icon: Activity, color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.15)' },
  'Shopping & Leisure': { icon: ShoppingBag, color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.15)' },
  Travel: { icon: Plane, color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.15)' },
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 18,
  className = '',
  showBackground = false,
}) => {
  const item = CATEGORY_MAP[category] || {
    icon: Tag,
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.15)',
  };

  const IconComponent = item.icon;

  if (showBackground) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl p-2 shrink-0 ${className}`}
        style={{ backgroundColor: item.bg, color: item.color }}
        aria-hidden="true"
      >
        <IconComponent size={size} strokeWidth={2.2} />
      </div>
    );
  }

  return (
    <IconComponent
      size={size}
      strokeWidth={2.2}
      style={{ color: item.color }}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export function getCategoryColor(category: string): string {
  return CATEGORY_MAP[category]?.color || '#8B5CF6';
}
