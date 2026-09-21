import React from 'react';
import { Check, Edit, Trash2, Clock, AlertCircle } from 'lucide-react';
import type { Reminder } from '../types';

const categoryColors: Record<string, string> = {
  medicine: 'bg-rose-100 text-rose-700',
  doctor: 'bg-blue-100 text-blue-700',
  family: 'bg-pink-100 text-pink-700',
  exercise: 'bg-green-100 text-green-700',
  personal: 'bg-violet-100 text-violet-700',
  other: 'bg-slate-100 text-slate-700',
};

const priorityColors: Record<string, string> = {
  high: 'text-rose-500',
  medium: 'text-amber-500',
  low: 'text-green-500',
};

interface ReminderCardProps {
  reminder: Reminder;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ReminderCard({ reminder, onComplete, onEdit, onDelete }: ReminderCardProps) {
  const dt = new Date(reminder.dateTime);
  const isOverdue = !reminder.completed && dt < new Date();
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm transition-opacity ${reminder.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <button onClick={onComplete} className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${reminder.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-sky-400'}`}>
          {reminder.completed && <Check size={10} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-medium text-slate-800 text-sm ${reminder.completed ? 'line-through' : ''}`}>{reminder.title}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[reminder.category]}`}>{reminder.category}</span>
            {reminder.priority === 'high' && <AlertCircle size={14} className={priorityColors[reminder.priority]} />}
          </div>
          {reminder.description && <p className="text-xs text-slate-500 mt-0.5">{reminder.description}</p>}
          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
            <Clock size={11} />
            <span className={isOverdue ? 'text-rose-500 font-medium' : ''}>
              {dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isOverdue && <span className="text-rose-500 font-medium">· Overdue</span>}
            {reminder.recurring && <span className="text-slate-400">· Recurring ({reminder.recurring})</span>}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><Edit size={14} /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400 transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}
