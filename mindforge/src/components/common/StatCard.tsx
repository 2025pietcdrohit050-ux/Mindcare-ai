import React from 'react';
import { Card } from './Card';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  badge?: {
    text: string;
    trend?: 'up' | 'down' | 'neutral';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = 'text-emerald-600',
  iconBg = 'bg-emerald-50',
  badge,
}) => {
  return (
    <Card hover className="flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold text-slate-500 tracking-wide">{label}</span>
        <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
          {badge && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                badge.trend === 'up'
                  ? 'bg-emerald-100 text-emerald-800'
                  : badge.trend === 'down'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subtext && <p className="text-xs text-slate-500 mt-1 font-medium">{subtext}</p>}
      </div>
    </Card>
  );
};
