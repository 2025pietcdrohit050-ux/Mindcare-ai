import React from 'react';
import type { MemoryItem } from '../../types';
import { Badge } from '../common/Badge';
import { Calendar, Tag, Users, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MemoryCardProps {
  memory: MemoryItem;
  onEdit: (memory: MemoryItem) => void;
  onDelete: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onEdit, onDelete }) => {
  const categoryVariants = {
    family: 'emerald' as const,
    friends: 'blue' as const,
    people: 'purple' as const,
    places: 'amber' as const,
    events: 'rose' as const,
    notes: 'slate' as const,
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Photo if available */}
        {memory.imageUrl ? (
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-3 right-3 flex gap-1.5">
              <Badge variant={categoryVariants[memory.category]} size="sm">
                {memory.category.toUpperCase()}
              </Badge>
              {memory.isCaregiverShared && (
                <span className="p-1 rounded-md bg-white/90 text-emerald-700 shadow-xs" title="Shared with caregiver">
                  <Users className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 pb-0 flex justify-between items-center">
            <Badge variant={categoryVariants[memory.category]} size="sm">
              {memory.category.toUpperCase()}
            </Badge>
            {memory.isCaregiverShared && (
              <span className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                <Users className="w-3.5 h-3.5" /> Shared
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(memory.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">
            {memory.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
            {memory.description}
          </p>

          {/* Tags */}
          {memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {memory.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/vault/${memory.id}`}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Recall Prompts</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(memory)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Edit Memory"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(memory.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Memory"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
