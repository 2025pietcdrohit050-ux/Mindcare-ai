import React from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { computeCognitiveScores, generateRecommendation } from '../utils/scoring';
import { useApp } from '../context/AppContext';

const gameNames: Record<string, string> = {
  'memory-match': 'Memory Match',
  'sequence-recall': 'Sequence Recall',
  'pattern-match': 'Pattern Match',
  'word-recall': 'Word Recall',
  'attention-challenge': 'Attention Challenge',
  'daily-challenge': 'Daily Challenge',
};

interface AIRecommendationProps {
  onStartGame: (gameType: string) => void;
}

export function AIRecommendation({ onStartGame }: AIRecommendationProps) {
  const { state } = useApp();
  const scores = computeCognitiveScores(state.gameResults);
  const rec = generateRecommendation(scores);
  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-white p-5 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={18} className="text-yellow-200" />
        <span className="font-semibold text-sm">AI Recommendation</span>
      </div>
      <p className="text-sm leading-relaxed text-sky-50 mb-4">{rec.reason}</p>
      <button
        onClick={() => onStartGame(rec.gameType)}
        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
      >
        Start {gameNames[rec.gameType]} <ChevronRight size={14} />
      </button>
      <p className="mt-3 text-xs text-sky-200 italic">* This is a wellness activity suggestion, not a medical assessment.</p>
    </div>
  );
}
