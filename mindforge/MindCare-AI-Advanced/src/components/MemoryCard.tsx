import React from 'react';
import { Edit, Trash2, Calendar, Tag } from 'lucide-react';
import type { Memory } from '../types';

const categoryColors: Record<string, string> = {
  people: 'bg-blue-100 text-blue-700 border-blue-200',
  places: 'bg-green-100 text-green-700 border-green-200',
  events: 'bg-amber-100 text-amber-700 border-amber-200',
  notes: 'bg-violet-100 text-violet-700 border-violet-200',
  routines: 'bg-teal-100 text-teal-700 border-teal-200',
  favorites: 'bg-rose-100 text-rose-700 border-rose-200',
};

export function MemoryCard({ memory, onEdit, onDelete }: { memory: Memory; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">{memory.title}</h3>
          {memory.relationship && <p className="text-xs text-slate-500">{memory.relationship}</p>}
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[memory.category]}`}>{memory.category}</span>
      </div>
      <p className="text-sm text-slate-600 mb-3 leading-relaxed">{memory.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><Calendar size={11} />{new Date(memory.date).toLocaleDateString('en-IN')}</span>
          {memory.tags?.map(t => <span key={t} className="flex items-center gap-1"><Tag size={10} />{t}</span>)}
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"><Edit size={14} /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400 transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
}
