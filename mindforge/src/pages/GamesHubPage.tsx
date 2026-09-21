import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { storageService } from '../utils/storage';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Gamepad2,
  Brain,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Trophy,
  Zap,
} from 'lucide-react';
import type { GameType, Difficulty } from '../types';

interface GameCardMeta {
  id: GameType;
  titleKey: 'gameMemoryMatch' | 'gameSequenceMemory' | 'gamePatternRecognition' | 'gameRecallChallenge';
  descKey: 'gameMemoryMatchDesc' | 'gameSequenceMemoryDesc' | 'gamePatternRecognitionDesc' | 'gameRecallChallengeDesc';
  modality: 'Visual Memory' | 'Working Memory' | 'Logical Reasoning' | 'Narrative Recall';
  estimatedMinutes: number;
  icon: typeof Brain;
  color: string;
  bgGradient: string;
}

export const GamesHubPage: React.FC = () => {
  const { t } = useLanguage();
  const sessions = storageService.getSessions();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Record<GameType, Difficulty>>({
    'memory-match': 'medium',
    'sequence-memory': 'medium',
    'pattern-recognition': 'medium',
    'recall-challenge': 'medium',
  });

  const games: GameCardMeta[] = [
    {
      id: 'memory-match',
      titleKey: 'gameMemoryMatch',
      descKey: 'gameMemoryMatchDesc',
      modality: 'Visual Memory',
      estimatedMinutes: 3,
      icon: Brain,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      bgGradient: 'from-emerald-50/40 to-white',
    },
    {
      id: 'sequence-memory',
      titleKey: 'gameSequenceMemory',
      descKey: 'gameSequenceMemoryDesc',
      modality: 'Working Memory',
      estimatedMinutes: 4,
      icon: Layers,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      bgGradient: 'from-sky-50/40 to-white',
    },
    {
      id: 'pattern-recognition',
      titleKey: 'gamePatternRecognition',
      descKey: 'gamePatternRecognitionDesc',
      modality: 'Logical Reasoning',
      estimatedMinutes: 4,
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      bgGradient: 'from-purple-50/40 to-white',
    },
    {
      id: 'recall-challenge',
      titleKey: 'gameRecallChallenge',
      descKey: 'gameRecallChallengeDesc',
      modality: 'Narrative Recall',
      estimatedMinutes: 5,
      icon: BookOpen,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      bgGradient: 'from-amber-50/40 to-white',
    },
  ];

  const getPersonalBest = (gameId: GameType) => {
    const gameSessions = sessions.filter(s => s.gameId === gameId);
    if (gameSessions.length === 0) return null;
    const bestScore = Math.max(...gameSessions.map(s => s.score));
    const bestAcc = Math.max(...gameSessions.map(s => s.accuracy));
    return { score: bestScore, accuracy: bestAcc };
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Gamepad2 className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cognitive Training Games
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Scientifically curated exercises to stimulate memory, concentration, and pattern reasoning.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-700">Adaptive AI Scaling Active</span>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map(game => {
          const Icon = game.icon;
          const pb = getPersonalBest(game.id);
          const currentDiff = selectedDifficulty[game.id];

          return (
            <Card
              key={game.id}
              hover
              className={`p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-br ${game.bgGradient}`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-3.5 rounded-2xl border ${game.color}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">{t(game.titleKey)}</h3>
                      <span className="text-xs font-semibold text-slate-500">{game.modality}</span>
                    </div>
                  </div>
                  <Badge variant="slate" size="sm">
                    <Clock className="w-3 h-3 inline mr-1" />
                    ~{game.estimatedMinutes}m
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {t(game.descKey)}
                </p>

                {/* Personal Best Snapshot */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-slate-200/70 mb-5 text-xs">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    Personal Best:
                  </span>
                  {pb ? (
                    <span className="font-extrabold text-slate-800">
                      {pb.score} pts ({pb.accuracy}% accuracy)
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">No sessions yet</span>
                  )}
                </div>

                {/* Difficulty Selector */}
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Select Starting Difficulty:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                      <button
                        key={d}
                        onClick={() =>
                          setSelectedDifficulty(prev => ({
                            ...prev,
                            [game.id]: d,
                          }))
                        }
                        className={`py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                          currentDiff === d
                            ? 'bg-white text-emerald-700 shadow-xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <Link to={`/games/${game.id}?diff=${currentDiff}`}>
                <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Play {t(game.titleKey)}
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
