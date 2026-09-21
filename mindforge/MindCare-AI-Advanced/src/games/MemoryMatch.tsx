import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Clock, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { GameResult, Difficulty } from '../types';

const CARD_SYMBOLS = ['🍎', '🌟', '🎵', '🌸', '🦋', '🎯', '🌊', '🔥', '🎨', '🌙', '⚡', '🎪'];

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

function makeCards(count: number): Card[] {
  const symbols = CARD_SYMBOLS.slice(0, count / 2);
  const doubled = [...symbols, ...symbols];
  return doubled.sort(() => Math.random() - 0.5).map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }));
}

const difficultyConfig: Record<Difficulty, { pairs: number; label: string }> = {
  easy: { pairs: 4, label: 'Easy (4 pairs)' },
  medium: { pairs: 8, label: 'Medium (8 pairs)' },
  hard: { pairs: 12, label: 'Hard (12 pairs)' },
};

interface MemoryMatchProps { onBack: () => void; }

export default function MemoryMatch({ onBack }: MemoryMatchProps) {
  const { addGameResult } = useApp();
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const startGame = useCallback((diff: Difficulty = difficulty) => {
    setDifficulty(diff);
    setCards(makeCards(difficultyConfig[diff].pairs * 2));
    setFlipped([]);
    setMoves(0);
    setTime(0);
    setRunning(false);
    setGameOver(false);
    setStarted(true);
  }, [difficulty]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const handleFlip = (id: number) => {
    if (!running) setRunning(true);
    const card = cards[id];
    if (card.flipped || card.matched || flipped.length === 2) return;
    const newFlipped = [...flipped, id];
    setCards(cs => cs.map(c => c.id === id ? { ...c, flipped: true } : c));
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(i => cards[i]);
      if (a.symbol === b.symbol) {
        setCards(cs => cs.map(c => newFlipped.includes(c.id) ? { ...c, matched: true } : c));
        setFlipped([]);
        const matched = cards.filter(c => c.matched).length + 2;
        if (matched === cards.length) {
          setRunning(false);
          setGameOver(true);
          const accuracy = Math.max(10, Math.round(100 - (moves / (cards.length / 2)) * 5));
          const score = Math.max(100, 1000 - moves * 20 - time * 2);
          addGameResult({ id: `gr-${Date.now()}`, gameType: 'memory-match', score, accuracy, duration: time, difficulty, date: new Date().toISOString() });
        }
      } else {
        setTimeout(() => {
          setCards(cs => cs.map(c => newFlipped.includes(c.id) ? { ...c, flipped: false } : c));
          setFlipped([]);
        }, 900);
      }
    } else {
      setFlipped(newFlipped);
    }
  };

  if (!started) {
    return (
      <div className="max-w-lg mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm"><ArrowLeft size={16} /> Back to Games</button>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Memory Match</h2>
          <p className="text-slate-500 mb-6">Flip cards to find matching pairs. Complete all pairs with the fewest moves.</p>
          <div className="flex flex-col gap-3 mb-6">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => startGame(d)} className={`w-full py-3 rounded-xl font-medium transition-colors ${
                d === 'easy' ? 'bg-green-100 hover:bg-green-200 text-green-700' : d === 'medium' ? 'bg-sky-100 hover:bg-sky-200 text-sky-700' : 'bg-violet-100 hover:bg-violet-200 text-violet-700'
              }`}>{difficultyConfig[d].label}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const accuracy = Math.max(10, Math.round(100 - (moves / (cards.length / 2)) * 5));
    const score = Math.max(100, 1000 - moves * 20 - time * 2);
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Well done!</h2>
          <p className="text-slate-500 mb-6">You completed Memory Match!</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-sky-50 rounded-xl p-3">
              <Trophy size={20} className="text-sky-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{score}</p>
              <p className="text-xs text-slate-500">Score</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-3">
              <Zap size={20} className="text-teal-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{moves}</p>
              <p className="text-xs text-slate-500">Moves</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <Clock size={20} className="text-amber-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-800">{time}s</p>
              <p className="text-xs text-slate-500">Time</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => startGame()} className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium">Play Again</button>
            <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium">Back to Hub</button>
          </div>
        </div>
      </div>
    );
  }

  const cols = difficulty === 'easy' ? 'grid-cols-4' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-6';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm"><ArrowLeft size={16} /> Back</button>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-slate-600"><Clock size={14} />{time}s</span>
          <span className="flex items-center gap-1 text-slate-600"><Zap size={14} />{moves} moves</span>
          <button onClick={() => startGame()} className="flex items-center gap-1 text-slate-400 hover:text-slate-600"><RotateCcw size={14} />Reset</button>
        </div>
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">Memory Match — {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
      <div className={`grid ${cols} gap-2 md:gap-3`}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className={`aspect-square rounded-xl text-2xl transition-all duration-300 border-2 ${
              card.matched ? 'bg-green-100 border-green-300 opacity-70' :
              card.flipped ? 'bg-sky-100 border-sky-300' :
              'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50 cursor-pointer'
            }`}
          >
            {(card.flipped || card.matched) ? card.symbol : '❓'}
          </button>
        ))}
      </div>
      <div className="mt-4 text-center text-sm text-slate-500">
        {cards.filter(c => c.matched).length / 2} / {cards.length / 2} pairs found
      </div>
    </div>
  );
}
