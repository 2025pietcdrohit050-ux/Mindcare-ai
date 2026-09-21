import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHeader } from '../shared/GameHeader';
import { GameSummaryModal } from '../shared/GameSummaryModal';
import { soundFx } from '../../utils/sound';
import { storageService } from '../../utils/storage';
import { adaptiveDifficultyService, type PerformanceEvaluation } from '../../services/adaptiveDifficultyService';
import type { Difficulty } from '../../types';
import { Eye, Clock, Check, X, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';

interface RecallScenario {
  id: number;
  title: string;
  category: string;
  memorizeDurationSeconds: number;
  storySnippet: string;
  bulletDetails: { label: string; value: string }[];
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

const SCENARIOS: RecallScenario[] = [
  {
    id: 1,
    title: 'The Sunday Garden Market',
    category: 'Daily Life',
    memorizeDurationSeconds: 12,
    storySnippet:
      'On a sunny Sunday morning, Meera walked to the market at 8:30 AM wearing a turquoise cardigan. She bought 4 golden mangoes, 2 bunches of fresh mint, and a small clay planter from vendor Rajesh at Stall #7.',
    bulletDetails: [
      { label: 'Time of visit', value: '8:30 AM' },
      { label: 'Cardigan Color', value: 'Turquoise' },
      { label: 'Number of Mangoes', value: '4 golden mangoes' },
      { label: 'Vendor & Stall', value: 'Rajesh at Stall #7' },
    ],
    questions: [
      {
        question: 'What color cardigan was Meera wearing?',
        options: ['Turquoise', 'Bright Yellow', 'Forest Green', 'Navy Blue'],
        correctAnswer: 'Turquoise',
      },
      {
        question: 'How many golden mangoes did she purchase?',
        options: ['2 mangoes', '4 mangoes', '6 mangoes', '3 mangoes'],
        correctAnswer: '4 mangoes',
      },
      {
        question: 'What stall number did vendor Rajesh have?',
        options: ['Stall #4', 'Stall #7', 'Stall #12', 'Stall #3'],
        correctAnswer: 'Stall #7',
      },
    ],
  },
  {
    id: 2,
    title: 'Express Train Journey to Jaipur',
    category: 'Travel & Schedules',
    memorizeDurationSeconds: 14,
    storySnippet:
      'Train #12985, the Pink City Express, departs from Platform 3 at 6:45 AM. Coach B4, Seat 23 is a window seat booked under PNR 84210. Breakfast served on board includes warm ginger tea and vegetable cutlets.',
    bulletDetails: [
      { label: 'Train Name', value: 'Pink City Express' },
      { label: 'Platform & Time', value: 'Platform 3 at 6:45 AM' },
      { label: 'Coach & Seat', value: 'Coach B4, Seat 23 (Window)' },
      { label: 'Breakfast Beverage', value: 'Warm ginger tea' },
    ],
    questions: [
      {
        question: 'From which platform does the train depart?',
        options: ['Platform 1', 'Platform 3', 'Platform 5', 'Platform 7'],
        correctAnswer: 'Platform 3',
      },
      {
        question: 'What is the booked coach number?',
        options: ['Coach A1', 'Coach B4', 'Coach C2', 'Coach S6'],
        correctAnswer: 'Coach B4',
      },
      {
        question: 'What warm beverage is served for breakfast?',
        options: ['Filter Coffee', 'Ginger Tea', 'Cardamom Milk', 'Green Tea'],
        correctAnswer: 'Ginger Tea',
      },
    ],
  },
];

export const RecallChallengeGame: React.FC<{ initialDifficulty?: Difficulty }> = ({
  initialDifficulty = 'medium',
}) => {
  const navigate = useNavigate();
  const [difficulty] = useState<Difficulty>(initialDifficulty);
  const [stage, setStage] = useState<'memorize' | 'recall'>('memorize');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [countdown, setCountdown] = useState(12);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    score: number;
    accuracy: number;
    evaluation: PerformanceEvaluation;
  } | null>(null);

  const scenario = SCENARIOS[scenarioIndex] || SCENARIOS[0];
  const question = scenario.questions[currentQIndex];

  // Overall game timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Memorize countdown
  useEffect(() => {
    if (stage !== 'memorize') return;
    setCountdown(scenario.memorizeDurationSeconds);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStage('recall');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, scenarioIndex, scenario.memorizeDurationSeconds]);

  const handleStartRecallNow = () => {
    setStage('recall');
  };

  const handleSelectOption = (answer: string) => {
    if (hasAnsweredCurrent || isCompleted) return;

    setSelectedAnswer(answer);
    setHasAnsweredCurrent(true);

    if (answer === question.correctAnswer) {
      soundFx.playMatchSuccess();
      setScore(s => s + 30);
    } else {
      soundFx.playMismatch();
      setMistakes(m => m + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < scenario.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setHasAnsweredCurrent(false);
    } else {
      // Finished all questions in scenario
      handleGameCompletion();
    }
  };

  const handleGameCompletion = () => {
    setIsCompleted(true);
    const totalQ = scenario.questions.length;
    const correctCount = totalQ - mistakes;
    const accuracy = Math.max(30, Math.round((correctCount / totalQ) * 100));
    const finalScore = Math.max(40, score + 40 - mistakes * 10);

    const evaluation = adaptiveDifficultyService.evaluateSession(
      'recall-challenge',
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
      gameId: 'recall-challenge',
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

    if (accuracy === 100) {
      storageService.updateAchievementProgress('ach_007', 100, true);
    }

    setSummaryData({
      score: finalScore,
      accuracy,
      evaluation,
    });
  };

  const restartGame = () => {
    setStage('memorize');
    setCurrentQIndex(0);
    setSelectedAnswer(null);
    setHasAnsweredCurrent(false);
    setScore(0);
    setMistakes(0);
    setSecondsElapsed(0);
    setIsCompleted(false);
    setSummaryData(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <GameHeader
        title="Recall Challenge"
        category="Narrative Memory"
        difficulty={difficulty}
        secondsElapsed={secondsElapsed}
        score={score}
        onQuit={() => navigate('/games')}
        onRestart={restartGame}
      />

      {/* Memorization Stage */}
      {stage === 'memorize' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-800 text-lg">
                Stage 1: Observation & Memory
              </h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
              <span>Hiding in {countdown}s</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">
            Read carefully and pay attention to specific names, numbers, and colors:
          </p>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 mb-6">
            <h4 className="font-bold text-slate-900 text-base mb-2">{scenario.title}</h4>
            <p className="text-slate-800 text-base leading-relaxed">{scenario.storySnippet}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            {scenario.bulletDetails.map((b, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                <span className="text-slate-400 block font-semibold">{b.label}</span>
                <span className="text-slate-800 font-bold">{b.value}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleStartRecallNow}
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              I’m Ready! Hide & Test Me
            </Button>
          </div>
        </div>
      )}

      {/* Recall Stage */}
      {stage === 'recall' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md animate-in fade-in">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">
                Question {currentQIndex + 1} of {scenario.questions.length}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Information Hidden
            </span>
          </div>

          <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-6">
            {question.question}
          </h4>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
            {question.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              let btnClass = 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';

              if (hasAnsweredCurrent) {
                if (opt === question.correctAnswer) {
                  btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm';
                } else if (isSelected && opt !== question.correctAnswer) {
                  btnClass = 'bg-rose-50 border-rose-400 text-rose-900';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 opacity-50 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasAnsweredCurrent}
                  className={`p-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {hasAnsweredCurrent && opt === question.correctAnswer && (
                    <Check className="w-5 h-5 text-emerald-600" />
                  )}
                  {hasAnsweredCurrent && isSelected && opt !== question.correctAnswer && (
                    <X className="w-5 h-5 text-rose-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Continue button */}
          {hasAnsweredCurrent && (
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleNextQuestion}
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentQIndex < scenario.questions.length - 1 ? 'Next Question' : 'View Results'}
              </Button>
            </div>
          )}
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
