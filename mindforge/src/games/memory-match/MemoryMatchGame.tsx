import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHeader } from '../shared/GameHeader';
import { GameSummaryModal } from '../shared/GameSummaryModal';
import { soundFx } from '../../utils/sound';
import { storageService } from '../../utils/storage';
import { adaptiveDifficultyService, type PerformanceEvaluation } from '../../services/adaptiveDifficultyService';
import type { Difficulty } from '../../types';
import {
  Sun,
  Moon,
  Heart,
  Star,
  Cloud,
  Coffee,
  TreePine,
  Feather,
  Music,
  Compass,
  Palette,
  Flower2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CardItem {
  id: number;
  symbolId: string;
  icon: LucideIcon;
  label: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const AVAILABLE_CARDS: { symbolId: string; icon: LucideIcon; label: string; color: string }[] = [
  { symbolId: 'sun', icon: Sun, label: 'Sun', color: 'text-amber-500 bg-amber-50' },
  { symbolId: 'moon', icon: Moon, label: 'Moon', color: 'text-indigo-500 bg-indigo-50' },
  { symbolId: 'heart', icon: Heart, label: 'Heart', color: 'text-rose-500 bg-rose-50' },
  { symbolId: 'star', icon: Star, label: 'Star', color: 'text-yellow-500 bg-yellow-50' },
  { symbolId: 'cloud', icon: Cloud, label: 'Cloud', color: 'text-sky-500 bg-sky-50' },
  { symbolId: 'coffee', icon: Coffee, label: 'Warm Cup', color: 'text-amber-700 bg-amber-50' },
  { symbolId: 'tree', icon: TreePine, label: 'Pine Tree', color: 'text-emerald-600 bg-emerald-50' },
  { symbolId: 'feather', icon: Feather, label: 'Feather', color: 'text-teal-600 bg-teal-50' },
  { symbolId: 'music', icon: Music, label: 'Music Note', color: 'text-purple-600 bg-purple-50' },
  { symbolId: 'compass', icon: Compass, label: 'Compass', color: 'text-blue-600 bg-blue-50' },
];

export const MemoryMatchGame: React.FC<{ initialDifficulty?: Difficulty }> = ({
  initialDifficulty = 'medium',
}) => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    score: number;
    accuracy: number;
    evaluation: PerformanceEvaluation;
  } | null>(null);

  // Determine pair count based on difficulty
  const getPairCount = useCallback((diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 4; // 8 cards (4x2)
      case 'hard':
        return 8; // 16 cards (4x4)
      case 'medium':
      default:
        return 6; // 12 cards (4x3)
    }
  }, []);

  const initGame = useCallback(() => {
    const pairCount = getPairCount(difficulty);
    const selected = AVAILABLE_CARDS.slice(0, pairCount);
    const deck: CardItem[] = [];

    selected.forEach((item, idx) => {
      deck.push({
        id: idx * 2,
        symbolId: item.symbolId,
        icon: item.icon,
        label: item.label,
        color: item.color,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idx * 2 + 1,
        symbolId: item.symbolId,
        icon: item.icon,
        label: item.label,
        color: item.color,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMistakes(0);
    setMatchedPairs(0);
    setSecondsElapsed(0);
    setIsCompleted(false);
    setSummaryData(null);
    setIsGameActive(true);
  }, [difficulty, getPairCount]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer tick
  useEffect(() => {
    if (!isGameActive || isCompleted) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameActive, isCompleted]);

  // Handle card click
  const handleCardClick = (index: number) => {
    if (!isGameActive || isCompleted) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    soundFx.playCardFlip();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.symbolId === secondCard.symbolId) {
        // MATCH!
        setTimeout(() => {
          soundFx.playMatchSuccess();
          setCards(prev =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setMatchedPairs(p => {
            const nextP = p + 1;
            const targetPairs = getPairCount(difficulty);
            if (nextP >= targetPairs) {
              handleGameCompletion();
            }
            return nextP;
          });
          setFlippedIndices([]);
        }, 300);
      } else {
        // MISMATCH
        setMistakes(m => m + 1);
        setTimeout(() => {
          soundFx.playMismatch();
          setCards(prev =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleGameCompletion = () => {
    setIsGameActive(false);
    setIsCompleted(true);

    const pairCount = getPairCount(difficulty);
    const totalMoves = moves + 1;
    // Accuracy based on minimum moves vs actual moves
    const accuracy = Math.min(100, Math.max(40, Math.round((pairCount / totalMoves) * 100)));
    const baseScore = pairCount * 15;
    const timeBonus = Math.max(0, 50 - Math.floor(secondsElapsed / 2));
    const finalScore = Math.max(50, baseScore + timeBonus - mistakes * 4);

    const evaluation = adaptiveDifficultyService.evaluateSession(
      'memory-match',
      difficulty,
      {
        accuracy,
        completionTimeSeconds: secondsElapsed,
        mistakes,
      },
      storageService.getSessions()
    );

    // Save session
    storageService.recordSession({
      userId: storageService.getUserProfile().id,
      gameId: 'memory-match',
      difficulty,
      score: finalScore,
      accuracy,
      mistakes,
      completionTimeSeconds: secondsElapsed,
      adaptiveFeedback: {
        recommendation: evaluation.recommendation,
        reason: evaluation.explanation,
        nextSuggestedDifficulty: evaluation.nextSuggestedDifficulty,
      },
    });

    // Update achievements
    storageService.updateAchievementProgress('ach_001', 100, true);
    if (accuracy >= 90) {
      storageService.updateAchievementProgress('ach_003', 100, true);
    }

    setSummaryData({
      score: finalScore,
      accuracy,
      evaluation,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <GameHeader
        title="Memory Match"
        category="Visual Memory"
        difficulty={difficulty}
        secondsElapsed={secondsElapsed}
        score={matchedPairs * 15}
        onQuit={() => navigate('/games')}
        onRestart={initGame}
      />

      {/* Difficulty Switcher during prep */}
      <div className="flex items-center justify-between gap-2 mb-6 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Exercise Level:
        </span>
        <div className="flex gap-1.5">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                difficulty === d
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Card Grid */}
      <div
        className={`grid gap-3 sm:gap-4 mx-auto ${
          difficulty === 'easy'
            ? 'grid-cols-4 max-w-lg'
            : difficulty === 'medium'
            ? 'grid-cols-3 sm:grid-cols-4 max-w-xl'
            : 'grid-cols-4 max-w-2xl'
        }`}
      >
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={isRevealed || flippedIndices.length >= 2}
              aria-label={isRevealed ? card.label : 'Hidden card'}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform select-none cursor-pointer border-2 ${
                card.isMatched
                  ? 'bg-emerald-50/80 border-emerald-300 opacity-90 scale-95 shadow-none'
                  : card.isFlipped
                  ? 'bg-white border-emerald-500 shadow-md scale-100'
                  : 'bg-gradient-to-tr from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 border-slate-300/80 shadow-xs hover:scale-102'
              }`}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center p-2 animate-in zoom-in-75">
                  <div className={`p-3 rounded-2xl ${card.color}`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-1 hidden sm:block">
                    {card.label}
                  </span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center text-slate-400 font-black text-sm">
                  ?
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-around text-xs font-semibold text-slate-500 mt-6 pt-4 border-t border-slate-200">
        <span>Moves: {moves}</span>
        <span>Mistakes: {mistakes}</span>
        <span>
          Pairs Matched: {matchedPairs} / {getPairCount(difficulty)}
        </span>
      </div>

      {/* Completion Modal */}
      {summaryData && (
        <GameSummaryModal
          isOpen={isCompleted}
          score={summaryData.score}
          accuracy={summaryData.accuracy}
          completionTimeSeconds={secondsElapsed}
          mistakes={mistakes}
          evaluation={summaryData.evaluation}
          onPlayAgain={initGame}
          onReturnToHub={() => navigate('/games')}
        />
      )}
    </div>
  );
};
