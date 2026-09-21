import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { soundFx } from '../../utils/sound';
import type { PerformanceEvaluation } from '../../services/adaptiveDifficultyService';

interface GameSummaryModalProps {
  isOpen: boolean;
  score: number;
  accuracy: number;
  completionTimeSeconds: number;
  mistakes: number;
  evaluation?: PerformanceEvaluation;
  onPlayAgain: () => void;
  onReturnToHub: () => void;
}

export const GameSummaryModal: React.FC<GameSummaryModalProps> = ({
  isOpen,
  score,
  accuracy,
  completionTimeSeconds,
  mistakes,
  evaluation,
  onPlayAgain,
  onReturnToHub,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundFx.playVictoryFanfare();
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
      });
    }
  }, [isOpen]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onReturnToHub} maxWidth="lg">
      <div className="text-center">
        {/* Victory Icon */}
        <div className="w-18 h-18 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-500/10">
          <Trophy className="w-10 h-10" />
        </div>

        <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Activity Completed!</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          Wonderful effort! Daily stimulation nurtures brain plasticity and mental clarity.
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-700 block mb-0.5">Score</span>
            <span className="text-2xl font-black text-emerald-900">{score}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-100">
            <span className="text-xs font-semibold text-sky-700 block mb-0.5">Accuracy</span>
            <span className="text-2xl font-black text-sky-900">{accuracy}%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100">
            <span className="text-xs font-semibold text-purple-700 block mb-0.5">Time</span>
            <span className="text-2xl font-black text-purple-900">{formatTime(completionTimeSeconds)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-100">
            <span className="text-xs font-semibold text-amber-700 block mb-0.5">Mistakes</span>
            <span className="text-2xl font-black text-amber-900">{mistakes}</span>
          </div>
        </div>

        {/* Adaptive AI Calibration Card */}
        {evaluation && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border border-emerald-200/80 text-left mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                Adaptive AI Calibration
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {evaluation.explanation}
            </p>
            <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-900">
              <span>Next Recommended Difficulty:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-200/80 uppercase">
                {evaluation.nextSuggestedDifficulty}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onPlayAgain}
            variant="outline"
            size="md"
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Play Again
          </Button>
          <Button
            onClick={onReturnToHub}
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Return to Games Hub
          </Button>
        </div>
      </div>
    </Modal>
  );
};
