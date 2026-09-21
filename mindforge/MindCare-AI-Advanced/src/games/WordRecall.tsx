import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const WORD_SETS = [
  ['Apple', 'Chair', 'River', 'Music', 'Cloud'],
  ['Garden', 'Mirror', 'Candle', 'Bridge', 'Forest', 'Window'],
  ['Elephant', 'Sunlight', 'Journey', 'Whisper', 'Meadow', 'Diamond', 'Thunder'],
  ['Harmony', 'Butterfly', 'Mountain', 'Lantern', 'Serenade', 'Compass', 'Blossom', 'Cascade'],
];

type Phase = 'start' | 'study' | 'recall' | 'result';

export default function WordRecall({ onBack }: { onBack: () => void }) {
  const { addGameResult } = useApp();
  const [phase, setPhase] = useState<Phase>('start');
  const [level, setLevel] = useState(0);
  const [timer, setTimer] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [recalled, setRecalled] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (phase !== 'study') return;
    setTimer(words.length * 2);
  }, [phase, words]);

  useEffect(() => {
    if (phase !== 'study' || timer <= 0) return;
    const t = setInterval(() => setTimer(p => {
      if (p <= 1) { clearInterval(t); setPhase('recall'); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase, timer]);

  const startGame = (lvl: number) => {
    const wordSet = WORD_SETS[Math.min(lvl, WORD_SETS.length - 1)];
    setWords(wordSet);
    setLevel(lvl);
    setRecalled([]);
    setInput('');
    setSubmitted(false);
    setPhase('study');
  };

  const handleSubmit = () => {
    const entered = input.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
    const correct = entered.filter(w => words.map(x => x.toLowerCase()).includes(w));
    setRecalled(correct);
    setSubmitted(true);
    const acc = Math.round((correct.length / words.length) * 100);
    addGameResult({ id: `gr-${Date.now()}`, gameType: 'word-recall', score: correct.length * 100, accuracy: acc, duration: words.length * 2, difficulty: level === 0 ? 'easy' : level <= 1 ? 'medium' : 'hard', date: new Date().toISOString() });
    setPhase('result');
  };

  if (phase === 'start') {
    return (
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6 text-sm"><ArrowLeft size={16} />Back</button>
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Word Recall</h2>
          <p className="text-slate-500 mb-6">Study the words, then recall as many as you can.</p>
          <div className="flex flex-col gap-3">
            {['Easy (5 words)', 'Medium (6 words)', 'Hard (7 words)', 'Expert (8 words)'].map((label, i) => (
              <button key={i} onClick={() => startGame(i)} className="w-full py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium">{label}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'study') {
    return (
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-4 text-sm"><ArrowLeft size={16} />Back</button>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
              <Eye size={16} /> Study these words
            </div>
            <div className="flex items-center gap-1 text-slate-600 text-sm">
              <Clock size={14} /> {timer}s
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {words.map((w, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center font-medium text-amber-800">{w}</div>
            ))}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-amber-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${(timer / (words.length * 2)) * 100}%` }} />
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'recall') {
    return (
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-4 text-sm"><ArrowLeft size={16} />Back</button>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-700">
            <EyeOff size={16} /> <span className="font-medium">Now recall the words!</span>
          </div>
          <p className="text-sm text-slate-500 mb-4">Type all the words you remember, separated by commas.</p>
          <textarea
            rows={4}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. Apple, Chair, River..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none mb-4"
          />
          <button onClick={handleSubmit} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl">Submit Recall</button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const acc = Math.round((recalled.length / words.length) * 100);
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{acc >= 80 ? '🌟' : acc >= 60 ? '👍' : '💪'}</div>
            <h2 className="text-xl font-bold text-slate-800">Result</h2>
            <p className="text-slate-500">You recalled {recalled.length} of {words.length} words</p>
          </div>
          <div className="bg-sky-50 rounded-xl p-4 mb-4 text-center">
            <p className="text-3xl font-bold text-sky-600">{acc}%</p>
            <p className="text-sm text-slate-500">Accuracy</p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Words to remember:</p>
            <div className="flex flex-wrap gap-2">
              {words.map(w => (
                <span key={w} className={`text-sm px-3 py-1 rounded-full font-medium ${
                  recalled.includes(w.toLowerCase()) ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'
                }`}>{w}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => startGame(level)} className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-medium">Play Again</button>
            <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium">Back</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
