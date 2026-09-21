import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Trophy, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { GameResult } from '../types';

const COLORS = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];
const COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink'];

type Phase = 'start' | 'show' | 'input' | 'result' | 'gameover';

export default function SequenceRecall({ onBack }: { onBack: () => void }) {
  const { addGameResult } = useApp();
  const [phase, setPhase] = useState<Phase>('start');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [showIdx, setShowIdx] = useState(-1);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [startTime, setStartTime] = useState(0);

  const generateSequence = useCallback((len: number) => {
    return Array.from({ length: len }, () => Math.floor(Math.random() * COLORS.length));
  }, []);

  const startLevel = useCallback((lvl: number) => {
    const seq = generateSequence(lvl + 2);
    setSequence(seq);
    setUserSeq([]);
    setShowIdx(0);
    setPhase('show');
  }, [generateSequence]);

  useEffect(() => {
    if (phase === 'show' && showIdx < sequence.length) {
      const t = setTimeout(() => {
        setShowIdx(i => i + 1);
      }, 800);
      return () => clearTimeout(t);
    } else if (phase === 'show' && showIdx === sequence.length) {
      const t = setTimeout(() => { setPhase('input'); setStartTime(Date.now()); }, 500);
      return () => clearTimeout(t);
    }
  }, [phase, showIdx, sequence]);

  const handleInput = (colorIdx: number) => {
    const newSeq = [...userSeq, colorIdx];
    setUserSeq(newSeq);
    if (newSeq[newSeq.length - 1] !== sequence[newSeq.length - 1]) {
      // Wrong
      const duration = Math.round((Date.now() - startTime) / 1000);
      const acc = Math.round((correct / Math.max(total + 1, 1)) * 100);
      addGameResult({ id: `gr-${Date.now()}`, gameType: 'sequence-recall', score: correct * 100, accuracy: acc, duration, difficulty: level <= 3 ? 'easy' : level <= 6 ? 'medium' : 'hard', date: new Date().toISOString() });
      setTotal(t => t + 1);
      setPhase('gameover');
      return;
    }
    if (newSeq.length === sequence.length) {
      setCorrect(c => c + 1);
      setTotal(t => t + 1);
      setPhase('result');
    }
  };

  if (phase === 'start') {
    return (
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6 text-sm"><ArrowLeft size={16} />Back</button>
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">🔢</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sequence Recall</h2>
          <p className="text-slate-500 mb-6">Watch the color sequence, then repeat it in order. Each level adds one more color!</p>
          <button onClick={() => { setLevel(1); setCorrect(0); setTotal(0); startLevel(1); }} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 rounded-xl">Start Game</button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Level {level} Complete!</h2>
          <p className="text-slate-500 mb-6">Great recall! Next level will be harder.</p>
          <button onClick={() => { setLevel(l => l + 1); startLevel(level + 1); }} className="w-full bg-sky-500 text-white py-3 rounded-xl font-medium">Next Level →</button>
        </div>
      </div>
    );
  }

  if (phase === 'gameover') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-3">🎯</div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Game Over</h2>
          <p className="text-slate-500 mb-4">You reached level {level}.</p>
          <div className="bg-sky-50 rounded-xl p-4 mb-6">
            <p className="text-3xl font-bold text-sky-600">{correct} / {total}</p>
            <p className="text-sm text-slate-500">Sequences Recalled Correctly</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setLevel(1); setCorrect(0); setTotal(0); setPhase('start'); }} className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-medium">Play Again</button>
            <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium">Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-4 text-sm"><ArrowLeft size={16} />Back</button>
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex justify-between mb-4 text-sm text-slate-500">
          <span>Level {level} — Sequence of {sequence.length}</span>
          <span>Correct: {correct}</span>
        </div>
        {phase === 'show' && (
          <div className="text-center mb-4">
            <p className="text-slate-600 mb-4 font-medium">Watch the sequence carefully...</p>
            <div className="flex justify-center gap-3">
              {COLORS.map((c, i) => (
                <div key={i} className={`w-14 h-14 rounded-xl transition-all duration-200 ${
                  showIdx === i || (showIdx > i && sequence[i] !== undefined && i === showIdx - 1) ? `${COLORS[sequence[i] ?? 0]} scale-110 shadow-lg` : 'bg-slate-100'
                }`} />
              ))}
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {sequence.map((s, i) => (
                <div key={i} className={`w-8 h-8 rounded-lg ${i < showIdx ? COLORS[s] : 'bg-slate-200'} transition-all`} />
              ))}
            </div>
          </div>
        )}
        {phase === 'input' && (
          <div>
            <p className="text-center text-slate-600 mb-4 font-medium">Now repeat the sequence! ({userSeq.length}/{sequence.length})</p>
            <div className="flex justify-center gap-2 mb-4">
              {sequence.map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-lg ${i < userSeq.length ? COLORS[userSeq[i]] : 'bg-slate-100'} transition-all`} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map((c, i) => (
                <button key={i} onClick={() => handleInput(i)} className={`${c} hover:opacity-90 active:scale-95 h-16 rounded-xl text-white font-medium transition-all`}>{COLOR_NAMES[i]}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
