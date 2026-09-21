import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  color: 'blue' | 'teal' | 'violet' | 'amber' | 'green' | 'rose';
  trend?: number;
}

const colorMap = {
  blue: 'from-sky-50 to-sky-100 border-sky-200 text-sky-600',
  teal: 'from-teal-50 to-teal-100 border-teal-200 text-teal-600',
  violet: 'from-violet-50 to-violet-100 border-violet-200 text-violet-600',
  amber: 'from-amber-50 to-amber-100 border-amber-200 text-amber-600',
  green: 'from-green-50 to-green-100 border-green-200 text-green-600',
  rose: 'from-rose-50 to-rose-100 border-rose-200 text-rose-600',
};

export function StatCard({ label, value, unit, icon, color, trend }: StatCardProps) {
  const cls = colorMap[color];
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${cls} p-5 shadow-sm transition-shadow hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60">{icon}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-slate-800">{value}</span>
        {unit && <span className="text-sm text-slate-500 mb-1">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className={`mt-2 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last week
        </div>
      )}
    </div>
  );
}
