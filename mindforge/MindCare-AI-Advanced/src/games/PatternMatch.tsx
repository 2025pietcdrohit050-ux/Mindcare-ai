import React, { useState, useCallback } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SHAPES = ['🔴', '🔵', '🟢', '🟡', '🔺', '⬛'];

function generateQuestion(level: number) {
  const len = 3 + Math.min(level, 4);
  const pattern = Array.from({ length: len }, () => SHAPES[Math.floor(Math.random() * 4)]);
  const answerIdx = Math.floor(Math.random() * len);
  const answer = pattern[answerIdx];
  const displayPattern = pattern.map((s, i) => i === answerIdx ? '❓' : s);
  const wrongOptions = SHAPES.filter(s => s !== answer).sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [...wrongOptions, answer].sort(() => Math.random() - 0.5);
  return { displayPattern, answer, options, answerIdx };
}

export default function PatternMatch({ onBack }: { onBack: () => void }) {
  const { addGameResult } = useApp();
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [question, setQuestion] = useState(generateQuestion(1));
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const nextQuestion = useCallback((lvl: number) => {
    setQuestion(generateQuestion(lvl));
    setFeedback(null);
  }, []);

  const handleAnswer = (opt: string) => {
    if (feedback) return;
    const isCorrect = opt === question.answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (isCorrect) {
      setScore(s => s + 100 + level * 20);
      setCorrect(c => c + 1);
    }
    setTimeout(() => {
      if (total + 1 >= 10) {
        const acc = Math.round(((isCorrect ? correct + 1 : correct) / (total + 1)) * 100);
        addGameResult({ id: `gr-${Date.now()}`, gameType: 'pattern-match', score, accuracy: acc, duration: 0, difficulty: level <= 2 ? 'easy' : level <= 4 ? 'medium' : 'hard', date: new Date().toISOString() });
        setGameOver(true);
      } else {
        setLevel(l => l + (isCorrect ? 1 : 0));
        nextQuestion(level + (isCorrect ? 1 : 0));
      }
    }, 900);
  };

  if (!started) {
    return (
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6 text-sm"><ArrowLeft size={16} />Back</button>
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">🔷</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Pattern Match</h2>
          <p className="text-slate-500 mb-6">Find the missing shape in the pattern. 10 questions per round.</p>
          <button onClick={() => setStarted(true)} className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-3 rounded-xl">Start Game</button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const acc = total ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Round Complete!</h2>
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="bg-sky-50 rounded-xl p-3"><p className="text-2xl font-bold text-sky-600">{score}</p><p className="text-xs text-slate-500">Score</p></div>
            <div className="bg-green-50 rounded-xl p-3"><p className="text-2xl font-bold text-green-600">{correct}/{total}</p><p className="text-xs text-slate-500">Correct</p></div>
            <div className="bg-violet-50 rounded-xl p-3"><p className="text-2xl font-bold text-violet-600">{acc}%</p><p className="text-xs text-slate-500">Accuracy</p></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setStarted(false); setLevel(1); setScore(0); setCorrect(0); setTotal(0); setGameOver(false); }} className="flex-1 py-3 rounded-xl bg-violet-500 text-white font-medium">Play Again</button>
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
          <span>Question {total + 1}/10</span>
          <span className="font-medium text-violet-600">{score} pts</span>
        </div>
        <p className="text-center text-slate-700 font-medium mb-5">What shape fills the ❓?</p>
        <div className="flex justify-center gap-3 mb-6">
          {question.displayPattern.map((s, i) => (
            <div key={i} className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
              s === '❓' ? 'bg-sky-100 border-2 border-sky-300 animate-pulse' : 'bg-slate-100'
            }`}>{s}</div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt, i) => (
            <button
              key={i} onClick={() => handleAnswer(opt)}
              className={`py-4 rounded-xl text-3xl transition-all ${
                feedback === null ? 'bg-slate-100 hover:bg-sky-100 hover:border-sky-300 border border-slate-200' :
                opt === question.answer ? 'bg-green-100 border-2 border-green-400' :
                feedback === 'wrong' && opt !== question.answer ? 'bg-slate-100 opacity-50' : 'bg-rose-100 border-2 border-rose-300'
              }`}
            >{opt}</button>
          ))}
        </div>
        {feedback && <p className={`text-center mt-4 font-medium ${feedback === 'correct' ? 'text-green-600' : 'text-rose-600'}`}>{feedback === 'correct' ? '✅ Correct!' : '❌ Wrong!'}</p>}
      </div>
    </div>
  );
}
