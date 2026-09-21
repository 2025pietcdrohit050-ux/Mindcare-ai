import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'teal' | 'violet' | 'amber' | 'green';
  label?: string;
  showValue?: boolean;
}

const colorMap = {
  blue: 'bg-sky-500',
  teal: 'bg-teal-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
};

export function ProgressBar({ value, max = 100, color = 'blue', label, showValue = true }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      {(label || showValue) && (
        <div className="flex justify-between text-sm text-slate-600 mb-1">
          {label && <span>{label}</span>}
          {showValue && <span className="font-medium">{pct}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorMap[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
