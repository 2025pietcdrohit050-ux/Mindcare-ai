import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { soundFx } from '../../utils/sound';
import { Heart, Sparkles, CheckCircle2, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import type { MemoryItem } from '../../types';

interface MemoryReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
}

export const MemoryReviewModal: React.FC<MemoryReviewModalProps> = ({
  isOpen,
  onClose,
  memories,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const activeMemories = memories.length > 0 ? memories : [];
  const currentMemory = activeMemories[currentIndex];

  const handleReveal = () => {
    soundFx.playCardFlip();
    setRevealed(true);
    setReviewedCount(c => c + 1);
  };

  const handleNext = () => {
    if (currentIndex < activeMemories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setRevealed(false);
    } else {
      setIsFinished(true);
      soundFx.playMatchSuccess();
    }
  };

  const restartReview = () => {
    setCurrentIndex(0);
    setRevealed(false);
    setReviewedCount(0);
    setIsFinished(false);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="text-center">
        {!isFinished && currentMemory ? (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Memory Recall Review ({currentIndex + 1} of {activeMemories.length})</span>
            </div>

            {/* Photo if present */}
            {currentMemory.imageUrl && (
              <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 mb-4 shadow-sm">
                <img
                  src={currentMemory.imageUrl}
                  alt="Review scene"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Gentle Recall Prompts */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left mb-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Recall Inquiry</span>
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-800 mb-2">
                {currentMemory.recallPrompts && currentMemory.recallPrompts[0]
                  ? currentMemory.recallPrompts[0]
                  : `What special moments do you recall about this ${currentMemory.category}?`}
              </p>
              <p className="text-xs text-slate-500">
                Take a relaxed moment to picture the setting, the people, and the day.
              </p>
            </div>

            {/* Revealed Answer / Details */}
            {revealed ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left mb-6 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-emerald-800 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Memory Recollection</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">{currentMemory.title}</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{currentMemory.description}</p>
                <span className="inline-block text-xs font-semibold text-emerald-700 mt-2">
                  Date: {new Date(currentMemory.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            ) : (
              <div className="mb-6">
                <Button onClick={handleReveal} variant="primary" size="lg">
                  Reveal Story & Details
                </Button>
              </div>
            )}

            {revealed && (
              <div className="flex justify-end gap-2">
                <Button onClick={handleNext} variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {currentIndex < activeMemories.length - 1 ? 'Next Memory' : 'Complete Review'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Finished Screen */
          <div className="py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 fill-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Review Session Completed</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
              Recalling meaningful personal stories exercises emotional warmth, episodic memory, and cognitive connection.
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-xs mx-auto mb-6">
              <span className="text-xs text-emerald-700 font-semibold block">Memories Visited</span>
              <span className="text-3xl font-black text-emerald-950">{reviewedCount}</span>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={restartReview} variant="outline" leftIcon={<RotateCcw className="w-4 h-4" />}>
                Review Again
              </Button>
              <Button onClick={onClose} variant="primary">
                Return to Vault
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
