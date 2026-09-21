import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHeader } from '../shared/GameHeader';
import { GameSummaryModal } from '../shared/GameSummaryModal';
import { soundFx } from '../../utils/sound';
import { storageService } from '../../utils/storage';
import { adaptiveDifficultyService, type PerformanceEvaluation } from '../../services/adaptiveDifficultyService';
import type { Difficulty } from '../../types';

interface PadConfig {
  id: number;
  label: string;
  normalClass: string;
  activeClass: string;
  borderColor: string;
}

const PADS: PadConfig[] = [
  {
    id: 0,
    label: 'Emerald Grove',
    normalClass: 'bg-emerald-500 hover:bg-emerald-600',
    activeClass: 'bg-emerald-300 shadow-[0_0_35px_rgba(52,211,153,0.9)] scale-105',
    borderColor: 'border-emerald-600',
  },
  {
    id: 1,
    label: 'Ocean Breeze',
    normalClass: 'bg-sky-500 hover:bg-sky-600',
    activeClass: 'bg-sky-300 shadow-[0_0_35px_rgba(56,189,248,0.9)] scale-105',
    borderColor: 'border-sky-600',
  },
  {
    id: 2,
    label: 'Twilight Lavender',
    normalClass: 'bg-purple-500 hover:bg-purple-600',
    activeClass: 'bg-purple-300 shadow-[0_0_35px_rgba(192,132,252,0.9)] scale-105',
    borderColor: 'border-purple-600',
  },
  {
    id: 3,
    label: 'Warm Amber',
    normalClass: 'bg-amber-500 hover:bg-amber-600',
    activeClass: 'bg-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.9)] scale-105',
    borderColor: 'border-amber-600',
  },
];

export const SequenceMemoryGame: React.FC<{ initialDifficulty?: Difficulty }> = ({
  initialDifficulty = 'medium',
}) => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInputIndex, setPlayerInputIndex] = useState<number>(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    score: number;
    accuracy: number;
    evaluation: PerformanceEvaluation;
  } | null>(null);

  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const getMaxRounds = useCallback((diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 4;
      case 'hard':
        return 8;
      case 'medium':
      default:
        return 6;
    }
  }, []);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(t => clearTimeout(t));
    timeoutRefs.current = [];
  };

  // Play sequence step
  const playSequence = useCallback((seq: number[]) => {
    clearAllTimeouts();
    setIsShowingSequence(true);
    setPlayerInputIndex(0);

    const speed = difficulty === 'easy' ? 800 : difficulty === 'hard' ? 450 : 600;

    seq.forEach((padIndex, stepIdx) => {
      const showTimeout = setTimeout(() => {
        setActivePad(padIndex);
        soundFx.playSequenceNote(padIndex);

        const hideTimeout = setTimeout(() => {
          setActivePad(null);
          if (stepIdx === seq.length - 1) {
            setIsShowingSequence(false);
          }
        }, speed * 0.65);
        timeoutRefs.current.push(hideTimeout);
      }, (stepIdx + 1) * speed);

      timeoutRefs.current.push(showTimeout);
    });
  }, [difficulty]);

  // Start new round
  const startRound = useCallback((round: number) => {
    // Generate next pad in sequence
    const nextPad = Math.floor(Math.random() * 4);
    setSequence(prev => {
      const newSeq = round === 1 ? [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)] : [...prev, nextPad];
      playSequence(newSeq);
      return newSeq;
    });
    setCurrentRound(round);
  }, [playSequence]);

  const initGame = useCallback(() => {
    clearAllTimeouts();
    setSequence([]);
    setPlayerInputIndex(0);
    setActivePad(null);
    setCurrentRound(1);
    setScore(0);
    setMistakes(0);
    setSecondsElapsed(0);
    setIsCompleted(false);
    setSummaryData(null);
    startRound(1);
  }, [startRound]);

  useEffect(() => {
    initGame();
    return () => clearAllTimeouts();
  }, [initGame]);

  // Timer tick
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // User click on pad
  const handlePadClick = (padId: number) => {
    if (isShowingSequence || isCompleted) return;

    soundFx.playSequenceNote(padId);
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 200);

    // Verify player input
    if (sequence[playerInputIndex] === padId) {
      // Correct pad
      const nextIndex = playerInputIndex + 1;
      setPlayerInputIndex(nextIndex);
      setScore(s => s + 10);

      // Finished reproducing this round's sequence?
      if (nextIndex >= sequence.length) {
        soundFx.playMatchSuccess();
        const maxRounds = getMaxRounds(difficulty);
        if (currentRound >= maxRounds) {
          // Finished all rounds!
          handleGameCompletion(mistakes);
        } else {
          // Advance to next round after short pause
          setTimeout(() => {
            startRound(currentRound + 1);
          }, 800);
        }
      }
    } else {
      // Mistake!
      soundFx.playMismatch();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      if (newMistakes >= 3) {
        // Game ends after 3 mistakes
        handleGameCompletion(newMistakes);
      } else {
        // Replay current round sequence as gentle guidance
        setTimeout(() => {
          playSequence(sequence);
        }, 1000);
      }
    }
  };

  const handleGameCompletion = (finalMistakes: number) => {
    setIsCompleted(true);
    clearAllTimeouts();

    const maxRounds = getMaxRounds(difficulty);
    const accuracy = Math.max(30, Math.round(((maxRounds * 2) / (maxRounds * 2 + finalMistakes)) * 100));
    const finalScore = Math.max(40, score + 50 - finalMistakes * 10);

    const evaluation = adaptiveDifficultyService.evaluateSession(
      'sequence-memory',
      difficulty,
      {
        accuracy,
        completionTimeSeconds: secondsElapsed,
        mistakes: finalMistakes,
      },
      storageService.getSessions()
    );

    // Save session
    storageService.recordSession({
      userId: storageService.getUserProfile().id,
      gameId: 'sequence-memory',
      difficulty,
      score: finalScore,
      accuracy,
      mistakes: finalMistakes,
      completionTimeSeconds: secondsElapsed,
      adaptiveFeedback: {
        recommendation: evaluation.recommendation,
        reason: evaluation.explanation,
        nextSuggestedDifficulty: evaluation.nextSuggestedDifficulty,
      },
    });

    // Update achievement
    if (currentRound >= 5) {
      storageService.updateAchievementProgress('ach_005', 100, true);
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
        title="Sequence Memory"
        category="Working Memory"
        difficulty={difficulty}
        secondsElapsed={secondsElapsed}
        score={score}
        onQuit={() => navigate('/games')}
        onRestart={initGame}
      />

      {/* Instruction banner */}
      <div className="text-center mb-6 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
          Round {currentRound} of {getMaxRounds(difficulty)}
        </span>
        <h3 className="text-lg font-bold text-slate-800">
          {isShowingSequence
            ? '👁️ Watch the sequence carefully...'
            : '✨ Repeat the sequence in order!'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {isShowingSequence
            ? 'Pads will light up with gentle tones.'
            : `Tap the pads (${playerInputIndex} / ${sequence.length})`}
        </p>
      </div>

      {/* Interactive Simon Pads 2x2 */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-sm sm:max-w-md mx-auto p-4 bg-slate-900 rounded-3xl shadow-xl border-4 border-slate-800">
        {PADS.map(pad => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              disabled={isShowingSequence || isCompleted}
              aria-label={pad.label}
              className={`aspect-square rounded-2xl sm:rounded-3xl transition-all duration-150 transform active:scale-95 cursor-pointer border-2 ${
                pad.borderColor
              } ${isActive ? pad.activeClass : pad.normalClass} ${
                isShowingSequence ? 'cursor-not-allowed opacity-90' : 'opacity-100 hover:opacity-95'
              }`}
            />
          );
        })}
      </div>

      {/* Footer statistics */}
      <div className="flex items-center justify-around text-xs font-semibold text-slate-500 mt-6 pt-4 border-t border-slate-200">
        <span>Mistakes Allowed: {3 - mistakes} left</span>
        <span>Current Sequence Length: {sequence.length}</span>
      </div>

      {/* Summary Modal */}
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
