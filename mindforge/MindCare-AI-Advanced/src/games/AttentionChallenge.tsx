import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Zap, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TARGETS = ['⭐', '❤️', '🎯'];
const DISTRACTORS = ['🔵', '🟢', '🟡', '🟠', '🔷', '🔶', '⬛', '⬜'];

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeGrid(size: number, targetSymbol: string) {
  const total = size * size;
  const targetIdx = Math.floor(Math.random() * total);
  const distractors = Array.from({ length: total }, (_, i) => {
    if (i === targetIdx) return targetSymbol;
    return DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)];
  });
  return { grid: distractors, targetIdx };
}

export default function AttentionChallenge({ onBack }: { onBack: () => void }) {
  const { addGameResult } = useApp();
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [maxRounds] = useState(10);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [grid, setGrid] = useState<string[]>([]);
  const [targetSymbol, setTargetSymbol] = useState('');
  const [targetIdx, setTargetIdx] = useState(0);
  const [showAt, setShowAt] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [size, setSize] = useState(4);

  const nextRound = useCallback((r: number) => {
    const sym = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    const s = Math.min(4 + Math.floor(r / 3), 6);
    setSize(s);
    setTargetSymbol(sym);
    const { grid, targetIdx } = makeGrid(s, sym);
    setGrid(grid);
    setTargetIdx(targetIdx);
    setShowAt(Date.now());
    setFeedback(null);
  }, []);

  const handleClick = (idx: number) => {
    if (feedback) return;
    const rt = Date.now() - showAt;
    const isCorrect = idx === targetIdx;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setReactionTimes(t => [...t, rt]);
    const newRound = round + 1;
    setTimeout(() => {
      if (newRound >= maxRounds) {
        const allRTs = isCorrect ? [...reactionTimes, rt] : reactionTimes;
        const avgRT = allRTs.length ? Math.round(allRTs.reduce((a, b) => a + b, 0) / allRTs.length) : 2000;
        const acc = Math.round(((isCorrect ? reactionTimes.length + 1 : reactionTimes.length) / maxRounds) * 100);
        const score = Math.max(100, 2000 - avgRT / 5);
        addGameResult({ id: `gr-${Date.now()}`, gameType: 'attention-challenge', score: Math.round(score), accuracy: acc, duration: maxRounds * 3, difficulty: 'medium', date: new Date().toISOString() });
        setGameOver(true);
      } else {
        setRound(newRound);
        nextRound(newRound);
      }
    }, 700);
  };

  if (!started) {
    return (
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6 text-sm"><ArrowLeft size={16} />Back</button>
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Attention Challenge</h2>
          <p className="text-slate-500 mb-6">Find the target emoji among distractors as fast as possible! 10 rounds.</p>
          <button onClick={() => { setStarted(true); setRound(0); setReactionTimes([]); nextRound(0); }} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-xl">Start Game</button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const avgRT = reactionTimes.length ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;
    const acc = Math.round((reactionTimes.length / maxRounds) * 100);
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-3">⚡</div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Challenge Complete!</h2>
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="bg-rose-50 rounded-xl p-3"><p className="text-xl font-bold text-rose-600">{avgRT}ms</p><p className="text-xs text-slate-500">Avg Reaction</p></div>
            <div className="bg-green-50 rounded-xl p-3"><p className="text-xl font-bold text-green-600">{reactionTimes.length}/{maxRounds}</p><p className="text-xs text-slate-500">Correct</p></div>
            <div className="bg-sky-50 rounded-xl p-3"><p className="text-xl font-bold text-sky-600">{acc}%</p><p className="text-xs text-slate-500">Accuracy</p></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setStarted(false); setGameOver(false); setRound(0); setReactionTimes([]); }} className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-medium">Play Again</button>
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
        <div className="flex justify-between mb-3 text-sm">
          <span className="text-slate-500">Round {round + 1}/{maxRounds}</span>
          <span className="font-medium text-rose-600">Find: {targetSymbol}</span>
        </div>
        <p className="text-center text-slate-600 text-sm mb-4">Click the <strong>{targetSymbol}</strong> as fast as you can!</p>
        <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {grid.map((sym, i) => (
            <button
              key={i} onClick={() => handleClick(i)}
              className={`aspect-square rounded-xl text-xl flex items-center justify-center transition-all ${
                feedback === null ? 'bg-slate-100 hover:bg-sky-100 active:scale-95' :
                i === targetIdx ? 'bg-green-100 scale-110' :
                feedback === 'wrong' ? 'bg-slate-100' : 'bg-slate-100'
              }`}
            >{sym}</button>
          ))}
        </div>
        {feedback && <p className={`text-center mt-3 text-sm font-medium ${feedback === 'correct' ? 'text-green-600' : 'text-rose-600'}`}>{feedback === 'correct' ? `✅ ${Date.now() - showAt}ms` : '❌ Missed!'}</p>}
      </div>
    </div>
  );
}
