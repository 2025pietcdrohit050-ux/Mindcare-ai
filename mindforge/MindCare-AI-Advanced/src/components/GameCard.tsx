import React from 'react';
import { Play, Star, Clock } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bestScore?: number;
  estimatedTime?: string;
  recommended?: boolean;
  onPlay: () => void;
}

export function GameCard({ title, description, icon, color, bestScore, estimatedTime, recommended, onPlay }: GameCardProps) {
  return (
    <div className={`relative rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
      {recommended && (
        <div className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Star size={10} fill="white" /> Recommended
        </div>
      )}
      <div className={`h-2 ${color}`} />
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 text-white`} style={{background: 'rgba(14,165,233,0.12)'}}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
          {estimatedTime && <span className="flex items-center gap-1"><Clock size={12} />{estimatedTime}</span>}
          {bestScore !== undefined && <span className="flex items-center gap-1"><Star size={12} />Best: {bestScore}</span>}
        </div>
        <button onClick={onPlay} className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">
          <Play size={14} fill="white" /> Play Now
        </button>
      </div>
    </div>
  );
}
