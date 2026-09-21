import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storageService } from '../utils/storage';
import { useToast } from '../hooks/useToast';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  ArrowLeft,
  Calendar,
  Tag,
  Users,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import type { MemoryItem } from '../types';

export const MemoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [memory, setMemory] = useState<MemoryItem | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (id) {
      const found = storageService.getMemories().find(m => m.id === id);
      if (found) setMemory(found);
    }
  }, [id]);

  if (!memory) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Memory Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">This memory entry does not exist or has been removed.</p>
        <Link to="/vault">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Memory Vault
          </Button>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this memory?')) {
      storageService.deleteMemory(memory.id);
      addToast('Memory removed from vault', 'info');
      navigate('/vault');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link to="/vault" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Memory Vault</span>
        </Link>

        <button
          onClick={handleDelete}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Entry</span>
        </button>
      </div>

      {/* Main Memory Card */}
      <Card className="p-6 sm:p-8 overflow-hidden">
        {/* Photo */}
        {memory.imageUrl && (
          <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 mb-6 shadow-sm">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="emerald" size="md">
              {memory.category.toUpperCase()}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(memory.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {memory.isCaregiverShared ? (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Shared with Caregiver
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Private Entry
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">{memory.title}</h1>
        <p className="text-slate-700 text-base leading-relaxed mb-6">{memory.description}</p>

        {/* Tags */}
        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100">
            {memory.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg"
              >
                <Tag className="w-3 h-3 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Gentle Memory Recall Exercise Card */}
      <Card className="p-6 bg-gradient-to-br from-emerald-50/60 to-white border-emerald-200/80">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-slate-900 text-lg">Gentle Memory Recall Prompt</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Test your memory recall on the details of this moment:
        </p>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs mb-4">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-bold text-slate-800">
                {memory.recallPrompts && memory.recallPrompts[0]
                  ? memory.recallPrompts[0]
                  : `What was the most heartwarming highlight from "${memory.title}"?`}
              </p>
              <span className="text-xs text-slate-400">
                Think back to who was with you, what you were feeling, and the sights around you.
              </span>
            </div>
          </div>
        </div>

        {showAnswer ? (
          <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-slate-800 text-sm leading-relaxed animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Story Detail:</span>
            </div>
            <p>{memory.description}</p>
          </div>
        ) : (
          <Button
            onClick={() => setShowAnswer(true)}
            variant="secondary"
            size="md"
            leftIcon={<Eye className="w-4 h-4" />}
          >
            Check My Recollection
          </Button>
        )}
      </Card>
    </div>
  );
};
