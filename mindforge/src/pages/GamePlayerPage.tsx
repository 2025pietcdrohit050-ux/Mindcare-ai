import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { MemoryMatchGame } from '../games/memory-match/MemoryMatchGame';
import { SequenceMemoryGame } from '../games/sequence-memory/SequenceMemoryGame';
import { PatternRecognitionGame } from '../games/pattern-recognition/PatternRecognitionGame';
import { RecallChallengeGame } from '../games/recall-challenge/RecallChallengeGame';
import type { Difficulty } from '../types';
import { Button } from '../components/common/Button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const GamePlayerPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const diffParam = searchParams.get('diff') as Difficulty | null;
  const initialDifficulty: Difficulty = diffParam || 'medium';

  switch (gameId) {
    case 'memory-match':
      return <MemoryMatchGame initialDifficulty={initialDifficulty} />;
    case 'sequence-memory':
      return <SequenceMemoryGame initialDifficulty={initialDifficulty} />;
    case 'pattern-recognition':
      return <PatternRecognitionGame initialDifficulty={initialDifficulty} />;
    case 'recall-challenge':
      return <RecallChallengeGame initialDifficulty={initialDifficulty} />;
    default:
      return (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Game Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            The requested cognitive game could not be identified.
          </p>
          <Link to="/games">
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Games Hub
            </Button>
          </Link>
        </div>
      );
  }
};
