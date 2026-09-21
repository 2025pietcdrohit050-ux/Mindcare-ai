import React from 'react';
import { ArrowLeft, Clock, RotateCcw, Zap } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import type { Difficulty } from '../../types';

interface GameHeaderProps {
  title: string;
  category: string;
  difficulty: Difficulty;
  secondsElapsed: number;
  score?: number;
  onQuit: () => void;
  onRestart?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  category,
  difficulty,
  secondsElapsed,
  score,
  onQuit,
  onRestart,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const difficultyColors = {
    easy: 'emerald' as const,
    medium: 'blue' as const,
    hard: 'purple' as const,
    adaptive: 'amber' as const,
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs mb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onQuit}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Return to Games"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <Badge variant={difficultyColors[difficulty]}>
              {difficulty.toUpperCase()}
            </Badge>
          </div>
          <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            {category} Training
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100 text-slate-800 text-sm font-bold">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>{formatTime(secondsElapsed)}</span>
        </div>

        {/* Score if provided */}
        {score !== undefined && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 text-sm font-extrabold border border-emerald-200/60">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Score: {score}</span>
          </div>
        )}

        {/* Restart Button */}
        {onRestart && (
          <button
            onClick={onRestart}
            title="Restart Exercise"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
