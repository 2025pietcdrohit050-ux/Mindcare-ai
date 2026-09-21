import React, { useState } from 'react';
import { Gamepad2, Brain, Zap, List, Eye, Star, Trophy } from 'lucide-react';
import { GameCard } from '../components/GameCard';
import { useApp } from '../context/AppContext';
import { computeCognitiveScores, generateRecommendation } from '../utils/scoring';
import MemoryMatch from '../games/MemoryMatch';
import SequenceRecall from '../games/SequenceRecall';
import PatternMatch from '../games/PatternMatch';
import WordRecall from '../games/WordRecall';
import AttentionChallenge from '../games/AttentionChallenge';
import DailyChallenge from '../games/DailyChallenge';

type ActiveGame = 'memory-match' | 'sequence-recall' | 'pattern-match' | 'word-recall' | 'attention-challenge' | 'daily-challenge' | null;

const games = [
  { id: 'memory-match' as const, title: 'Memory Match', description: 'Flip cards and match pairs. Strengthens short-term memory.', icon: <Brain size={22} className="text-sky-600" />, estimatedTime: '5–10 min' },
  { id: 'sequence-recall' as const, title: 'Sequence Recall', description: 'Watch a sequence, then repeat it. Boosts working memory.', icon: <List size={22} className="text-teal-600" />, estimatedTime: '3–5 min' },
  { id: 'pattern-match' as const, title: 'Pattern Match', description: 'Find the missing piece in a visual pattern. Sharpens reasoning.', icon: <Eye size={22} className="text-violet-600" />, estimatedTime: '5–8 min' },
  { id: 'word-recall' as const, title: 'Word Recall', description: 'Memorize words, then recall them after a delay.', icon: <span className="text-amber-600 text-xl font-bold">W</span>, estimatedTime: '3–6 min' },
  { id: 'attention-challenge' as const, title: 'Attention Challenge', description: 'Spot targets among distractors. Trains focused attention.', icon: <Zap size={22} className="text-rose-600" />, estimatedTime: '2–4 min' },
  { id: 'daily-challenge' as const, title: 'Daily Challenge', description: 'A curated mix of mini-tasks. Complete to earn your daily streak.', icon: <Star size={22} className="text-amber-600" />, estimatedTime: '10–15 min' },
];

export default function GamesHub() {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const { state } = useApp();
  const scores = computeCognitiveScores(state.gameResults);
  const rec = generateRecommendation(scores);

  if (activeGame === 'memory-match') return <MemoryMatch onBack={() => setActiveGame(null)} />;
  if (activeGame === 'sequence-recall') return <SequenceRecall onBack={() => setActiveGame(null)} />;
  if (activeGame === 'pattern-match') return <PatternMatch onBack={() => setActiveGame(null)} />;
  if (activeGame === 'word-recall') return <WordRecall onBack={() => setActiveGame(null)} />;
  if (activeGame === 'attention-challenge') return <AttentionChallenge onBack={() => setActiveGame(null)} />;
  if (activeGame === 'daily-challenge') return <DailyChallenge onBack={() => setActiveGame(null)} />;

  const getBestScore = (gameType: string) => {
    const results = state.gameResults.filter(r => r.gameType === gameType);
    return results.length ? Math.max(...results.map(r => r.score)) : undefined;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
          <Gamepad2 size={20} className="text-sky-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cognitive Games Hub</h1>
          <p className="text-slate-500 text-sm">Play brain-training exercises tailored to your progress.</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl text-white p-5 mb-6 flex flex-wrap gap-6">
        <div><p className="text-sky-100 text-xs">Total Sessions</p><p className="text-2xl font-bold">{state.gameResults.length}</p></div>
        <div><p className="text-sky-100 text-xs">Avg Accuracy</p><p className="text-2xl font-bold">{state.gameResults.length ? Math.round(state.gameResults.reduce((s, r) => s + r.accuracy, 0) / state.gameResults.length) : 0}%</p></div>
        <div><p className="text-sky-100 text-xs">Streak</p><p className="text-2xl font-bold flex items-center gap-1"><Trophy size={18} />{state.currentStreak} days</p></div>
        <div><p className="text-sky-100 text-xs">Today's Games</p><p className="text-2xl font-bold">{state.gameResults.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length}</p></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map(g => (
          <GameCard
            key={g.id}
            title={g.title}
            description={g.description}
            icon={g.icon}
            color="bg-sky-500"
            estimatedTime={g.estimatedTime}
            bestScore={getBestScore(g.id)}
            recommended={rec.gameType === g.id}
            onPlay={() => setActiveGame(g.id)}
          />
        ))}
      </div>
    </div>
  );
}
