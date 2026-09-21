import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHeader } from '../shared/GameHeader';
import { GameSummaryModal } from '../shared/GameSummaryModal';
import { soundFx } from '../../utils/sound';
import { storageService } from '../../utils/storage';
import { adaptiveDifficultyService, type PerformanceEvaluation } from '../../services/adaptiveDifficultyService';
import type { Difficulty } from '../../types';
import { Circle, Square, Triangle, Hexagon, Star, Diamond, Check, X, ArrowRight } from 'lucide-react';

interface PatternQuestion {
  id: number;
  difficulty: Difficulty;
  sequence: { iconName: string; color: string; label: string }[];
  missingIndex: number;
  options: { id: number; iconName: string; color: string; label: string; isCorrect: boolean }[];
  explanation: string;
}

const QUESTIONS_POOL: PatternQuestion[] = [
  // Easy 1: Color alternation
  {
    id: 1,
    difficulty: 'easy',
    sequence: [
      { iconName: 'circle', color: 'text-emerald-500 bg-emerald-50', label: 'Green Circle' },
      { iconName: 'circle', color: 'text-sky-500 bg-sky-50', label: 'Blue Circle' },
      { iconName: 'circle', color: 'text-emerald-500 bg-emerald-50', label: 'Green Circle' },
      { iconName: '?', color: 'text-slate-400 bg-slate-100', label: 'Missing' },
    ],
    missingIndex: 3,
    options: [
      { id: 1, iconName: 'circle', color: 'text-sky-500 bg-sky-50', label: 'Blue Circle', isCorrect: true },
      { id: 2, iconName: 'square', color: 'text-emerald-500 bg-emerald-50', label: 'Green Square', isCorrect: false },
      { id: 3, iconName: 'triangle', color: 'text-rose-500 bg-rose-50', label: 'Red Triangle', isCorrect: false },
      { id: 4, iconName: 'circle', color: 'text-amber-500 bg-amber-50', label: 'Amber Circle', isCorrect: false },
    ],
    explanation: 'The pattern strictly alternates between Green Circle and Blue Circle.',
  },
  // Easy 2: Shape alternation
  {
    id: 2,
    difficulty: 'easy',
    sequence: [
      { iconName: 'triangle', color: 'text-indigo-500 bg-indigo-50', label: 'Triangle' },
      { iconName: 'square', color: 'text-indigo-500 bg-indigo-50', label: 'Square' },
      { iconName: 'triangle', color: 'text-indigo-500 bg-indigo-50', label: 'Triangle' },
      { iconName: '?', color: 'text-slate-400 bg-slate-100', label: 'Missing' },
    ],
    missingIndex: 3,
    options: [
      { id: 1, iconName: 'circle', color: 'text-indigo-500 bg-indigo-50', label: 'Circle', isCorrect: false },
      { id: 2, iconName: 'square', color: 'text-indigo-500 bg-indigo-50', label: 'Square', isCorrect: true },
      { id: 3, iconName: 'star', color: 'text-indigo-500 bg-indigo-50', label: 'Star', isCorrect: false },
      { id: 4, iconName: 'hexagon', color: 'text-indigo-500 bg-indigo-50', label: 'Hexagon', isCorrect: false },
    ],
    explanation: 'The geometric sequence alternates between a 3-sided triangle and 4-sided square.',
  },
  // Medium 1: Incrementing polygon vertices
  {
    id: 3,
    difficulty: 'medium',
    sequence: [
      { iconName: 'triangle', color: 'text-teal-600 bg-teal-50', label: '3 sides (Triangle)' },
      { iconName: 'square', color: 'text-teal-600 bg-teal-50', label: '4 sides (Square)' },
      { iconName: 'diamond', color: 'text-teal-600 bg-teal-50', label: '4 sides rotated' },
      { iconName: 'hexagon', color: 'text-teal-600 bg-teal-50', label: '6 sides (Hexagon)' },
      { iconName: '?', color: 'text-slate-400 bg-slate-100', label: 'Missing' },
    ],
    missingIndex: 4,
    options: [
      { id: 1, iconName: 'circle', color: 'text-teal-600 bg-teal-50', label: 'Circle', isCorrect: false },
      { id: 2, iconName: 'star', color: 'text-teal-600 bg-teal-50', label: 'Multi-point Star', isCorrect: true },
      { id: 3, iconName: 'triangle', color: 'text-teal-600 bg-teal-50', label: 'Triangle', isCorrect: false },
      { id: 4, iconName: 'square', color: 'text-teal-600 bg-teal-50', label: 'Square', isCorrect: false },
    ],
    explanation: 'The pattern progresses with increasing geometric complexity and vertex count.',
  },
  // Medium 2: Color cycle triad
  {
    id: 4,
    difficulty: 'medium',
    sequence: [
      { iconName: 'star', color: 'text-amber-500 bg-amber-50', label: 'Amber Star' },
      { iconName: 'star', color: 'text-rose-500 bg-rose-50', label: 'Rose Star' },
      { iconName: 'star', color: 'text-purple-500 bg-purple-50', label: 'Purple Star' },
      { iconName: 'star', color: 'text-amber-500 bg-amber-50', label: 'Amber Star' },
      { iconName: '?', color: 'text-slate-400 bg-slate-100', label: 'Missing' },
    ],
    missingIndex: 4,
    options: [
      { id: 1, iconName: 'star', color: 'text-emerald-500 bg-emerald-50', label: 'Green Star', isCorrect: false },
      { id: 2, iconName: 'star', color: 'text-purple-500 bg-purple-50', label: 'Purple Star', isCorrect: false },
      { id: 3, iconName: 'star', color: 'text-rose-500 bg-rose-50', label: 'Rose Star', isCorrect: true },
      { id: 4, iconName: 'circle', color: 'text-rose-500 bg-rose-50', label: 'Rose Circle', isCorrect: false },
    ],
    explanation: 'Triadic cycle: Amber -> Rose -> Purple. After Amber, Rose comes next.',
  },
  // Hard 1: Shape and Color dual progression
  {
    id: 5,
    difficulty: 'hard',
    sequence: [
      { iconName: 'circle', color: 'text-emerald-600 bg-emerald-50', label: 'Green Circle' },
      { iconName: 'triangle', color: 'text-sky-600 bg-sky-50', label: 'Blue Triangle' },
      { iconName: 'square', color: 'text-purple-600 bg-purple-50', label: 'Purple Square' },
      { iconName: 'circle', color: 'text-emerald-600 bg-emerald-50', label: 'Green Circle' },
      { iconName: '?', color: 'text-slate-400 bg-slate-100', label: 'Missing' },
    ],
    missingIndex: 4,
    options: [
      { id: 1, iconName: 'triangle', color: 'text-sky-600 bg-sky-50', label: 'Blue Triangle', isCorrect: true },
      { id: 2, iconName: 'triangle', color: 'text-emerald-600 bg-emerald-50', label: 'Green Triangle', isCorrect: false },
      { id: 3, iconName: 'square', color: 'text-sky-600 bg-sky-50', label: 'Blue Square', isCorrect: false },
      { id: 4, iconName: 'hexagon', color: 'text-purple-600 bg-purple-50', label: 'Purple Hexagon', isCorrect: false },
    ],
    explanation: 'Both the shape and color synchronize in a 3-step loop: Green Circle -> Blue Triangle -> Purple Square.',
  },
];

export const PatternRecognitionGame: React.FC<{ initialDifficulty?: Difficulty }> = ({
  initialDifficulty = 'medium',
}) => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    score: number;
    accuracy: number;
    evaluation: PerformanceEvaluation;
  } | null>(null);

  const activeQuestions = QUESTIONS_POOL.filter(
    q => difficulty === 'easy' ? q.difficulty === 'easy' : true
  );

  const currentQ = activeQuestions[currentQIndex] || activeQuestions[0];

  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  const renderIcon = (name: string, className = 'w-8 h-8') => {
    switch (name) {
      case 'circle': return <Circle className={className} />;
      case 'square': return <Square className={className} />;
      case 'triangle': return <Triangle className={className} />;
      case 'hexagon': return <Hexagon className={className} />;
      case 'star': return <Star className={className} />;
      case 'diamond': return <Diamond className={className} />;
      default: return <span className="text-xl font-bold text-slate-400">?</span>;
    }
  };

  const handleSelectOption = (optId: number) => {
    if (hasAnswered || isCompleted) return;

    setSelectedOptionId(optId);
    setHasAnswered(true);

    const option = currentQ.options.find(o => o.id === optId);
    if (option?.isCorrect) {
      soundFx.playMatchSuccess();
      setScore(s => s + 25);
    } else {
      soundFx.playMismatch();
      setMistakes(m => m + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      // Completed all questions
      handleGameCompletion();
    }
  };

  const handleGameCompletion = () => {
    setIsCompleted(true);
    const totalQ = activeQuestions.length;
    const correctCount = totalQ - mistakes;
    const accuracy = Math.max(30, Math.round((correctCount / totalQ) * 100));
    const finalScore = Math.max(40, score + 40 - mistakes * 8);

    const evaluation = adaptiveDifficultyService.evaluateSession(
      'pattern-recognition',
      difficulty,
      {
        accuracy,
        completionTimeSeconds: secondsElapsed,
        mistakes,
      },
      storageService.getSessions()
    );

    // Record session
    storageService.recordSession({
      userId: storageService.getUserProfile().id,
      gameId: 'pattern-recognition',
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

    storageService.updateAchievementProgress('ach_004', 100, true);

    setSummaryData({
      score: finalScore,
      accuracy,
      evaluation,
    });
  };

  const restartGame = () => {
    setCurrentQIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setScore(0);
    setMistakes(0);
    setSecondsElapsed(0);
    setIsCompleted(false);
    setSummaryData(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <GameHeader
        title="Pattern Recognition"
        category="Logical Reasoning"
        difficulty={difficulty}
        secondsElapsed={secondsElapsed}
        score={score}
        onQuit={() => navigate('/games')}
        onRestart={restartGame}
      />

      {/* Question Progression Banner */}
      <div className="flex items-center justify-between mb-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-slate-500">
          Puzzle {currentQIndex + 1} of {activeQuestions.length}
        </span>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
          Identify the missing tile
        </span>
      </div>

      {/* Main Pattern Display Sequence */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-6 text-center">
        <h3 className="text-base font-bold text-slate-700 mb-6">
          Observe the sequence and determine which shape belongs in place of the question mark:
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 my-4">
          {currentQ.sequence.map((item, idx) => (
            <div
              key={idx}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                item.iconName === '?'
                  ? 'border-dashed border-emerald-400 bg-emerald-50/50 shadow-inner'
                  : `border-slate-200 ${item.color}`
              }`}
            >
              {renderIcon(item.iconName, 'w-8 h-8 sm:w-10 sm:h-10')}
            </div>
          ))}
        </div>

        {/* Explanation Card upon answering */}
        {hasAnswered && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left animate-in fade-in">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Pattern Logic Explained:
            </p>
            <p className="text-sm text-slate-800 font-medium">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Multiple Choice Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {currentQ.options.map(opt => {
          const isSelected = selectedOptionId === opt.id;
          let buttonClass = 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs';

          if (hasAnswered) {
            if (opt.isCorrect) {
              buttonClass = 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm';
            } else if (isSelected && !opt.isCorrect) {
              buttonClass = 'bg-rose-50 border-rose-400 text-rose-800';
            } else {
              buttonClass = 'bg-slate-50 border-slate-200 opacity-50';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              disabled={hasAnswered}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${buttonClass}`}
            >
              <div className={`p-3 rounded-xl ${opt.color}`}>
                {renderIcon(opt.iconName, 'w-8 h-8')}
              </div>
              <span className="text-xs font-semibold text-slate-700">{opt.label}</span>
              {hasAnswered && opt.isCorrect && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                  <Check className="w-3.5 h-3.5" /> Correct
                </span>
              )}
              {hasAnswered && isSelected && !opt.isCorrect && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700">
                  <X className="w-3.5 h-3.5" /> Incorrect
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Continue button when answered */}
      {hasAnswered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span>{currentQIndex < activeQuestions.length - 1 ? 'Next Puzzle' : 'Finish Exercise'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Modal */}
      {summaryData && (
        <GameSummaryModal
          isOpen={isCompleted}
          score={summaryData.score}
          accuracy={summaryData.accuracy}
          completionTimeSeconds={secondsElapsed}
          mistakes={mistakes}
          evaluation={summaryData.evaluation}
          onPlayAgain={restartGame}
          onReturnToHub={() => navigate('/games')}
        />
      )}
    </div>
  );
};
