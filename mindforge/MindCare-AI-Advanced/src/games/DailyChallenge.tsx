import React, { useState } from 'react';
import { ArrowLeft, Trophy, Star, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

type MiniGame = 'pattern' | 'word' | 'sequence' | 'attention';
const MINI_GAMES: MiniGame[] = ['pattern', 'word', 'sequence', 'attention'];

const PATTERN_QUESTIONS = [
  { pattern: ['🔴', '🔵', '🔴', '🔵', '❓'], answer: '🔴', options: ['🟢', '🔴', '🟡', '🔵'] },
  { pattern: ['⬛', '⬜', '⬛', '⬜', '❓'], answer: '⬛', options: ['🟡', '⬛', '🔵', '🟢'] },
  { pattern: ['🟢', '🟡', '🟢', '❓', '🟢'], answer: '🟡', options: ['🔴', '🟡', '🔵', '⬛'] },
];

const TRIVIA = [
  { q: 'What is the capital of India?', answer: 'New Delhi', options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'] },
  { q: 'How many days are in a week?', answer: '7', options: ['5', '6', '7', '8'] },
  { q: 'Which planet is known as the Red Planet?', answer: 'Mars', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'] },
];

export default function DailyChallenge({ onBack }: { onBack: () => void }) {
  const { addGameResult, state } = useApp();
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Pattern mini
  const [patternIdx, setPatternIdx] = useState(0);
  const [patternAns, setPatternAns] = useState<boolean | null>(null);
  // Word mini
  const wordSet = ['River', 'Clock', 'Garden', 'Mirror', 'Stone'];
  const [wordPhase, setWordPhase] = useState<'study' | 'recall' | 'done'>('study');
  const [wordInput, setWordInput] = useState('');
  const [wordScore, setWordScore] = useState(0);
  // Trivia mini
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [triviaAns, setTriviaAns] = useState<boolean | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);
  // Attention mini
  const TARGET = '⭐';
  const attGrid = ['⭐', '🔵', '🟢', '🟡', '🔴', '🟠', '🔷', '⬛', '🟢'].sort(() => Math.random() - 0.5);
  const attTargetIdx = attGrid.indexOf('⭐');
  const [attDone, setAttDone] = useState(false);
  const [attCorrect, setAttCorrect] = useState<boolean | null>(null);

  const finishChallenge = () => {
    const final = score;
    const acc = Math.round((final / 400) * 100);
    addGameResult({ id: `gr-${Date.now()}`, gameType: 'daily-challenge', score: final, accuracy: acc, duration: 600, difficulty: 'medium', date: new Date().toISOString() });
    setDone(true);
  };

  if (!started) {
    const todayCompleted = state.gameResults.some(r => r.gameType === 'daily-challenge' && new Date(r.date).toDateString() === new Date().toDateString());
    return (
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6 text-sm"><ArrowLeft size={16} />Back</button>
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Daily Challenge</h2>
          <p className="text-slate-500 mb-2">A mix of pattern, word recall, trivia, and attention tasks.</p>
          {todayCompleted && <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm text-green-700">✅ You've already completed today's challenge!</div>}
          <div className="bg-amber-50 rounded-xl p-3 mb-6 text-sm text-amber-700 flex items-center justify-center gap-2">
            <Flame size={14} />{state.currentStreak} day streak
          </div>
          <button onClick={() => setStarted(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl">Start Daily Challenge</button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="text-5xl mb-3">🎊</div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Daily Challenge Complete!</h2>
          <div className="my-6 bg-amber-50 rounded-xl p-5">
            <Trophy size={32} className="text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-amber-600">{score} pts</p>
            <p className="text-sm text-slate-500">Today's Score</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setStarted(false); setStep(0); setScore(0); setDone(false); setPatternIdx(0); setWordPhase('study'); setWordInput(''); setTriviaIdx(0); setTriviaScore(0); setAttDone(false); }} className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-medium">Try Again</button>
            <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium">Back</button>
          </div>
        </div>
      </div>
    );
  }

  const steps = ['Pattern Recognition', 'Word Recall', 'General Knowledge', 'Attention Spot'];

  return (
    <div className="max-w-md mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-4 text-sm"><ArrowLeft size={16} />Back</button>
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        {/* Progress */}
        <div className="flex justify-between mb-4">
          {steps.map((s, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full mx-0.5 ${i <= step ? 'bg-amber-400' : 'bg-slate-100'}`} />
          ))}
        </div>
        <p className="text-sm text-slate-500 mb-4 text-center">{steps[step]} ({step + 1}/4)</p>
        <div className="font-semibold text-slate-700 text-right mb-4 text-sm">Score: {score}</div>

        {/* Step 0: Pattern */}
        {step === 0 && (
          <div className="text-center">
            <p className="text-slate-700 font-medium mb-4">Complete the pattern:</p>
            <div className="flex justify-center gap-2 mb-6">
              {PATTERN_QUESTIONS[patternIdx].pattern.map((s, i) => (
                <div key={i} className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${s === '❓' ? 'bg-sky-100 border-2 border-sky-300' : 'bg-slate-100'}`}>{s}</div>
              ))}
            </div>
            {patternAns === null ? (
              <div className="grid grid-cols-2 gap-2">
                {PATTERN_QUESTIONS[patternIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => {
                    const correct = opt === PATTERN_QUESTIONS[patternIdx].answer;
                    setPatternAns(correct);
                    if (correct) setScore(s => s + 100);
                    setTimeout(() => {
                      setPatternAns(null);
                      if (patternIdx < PATTERN_QUESTIONS.length - 1) setPatternIdx(pi => pi + 1);
                      else setStep(1);
                    }, 700);
                  }} className="py-3 rounded-xl bg-slate-100 hover:bg-sky-100 text-2xl">{opt}</button>
                ))}
              </div>
            ) : <p className={`mt-2 font-medium ${patternAns ? 'text-green-600' : 'text-rose-600'}`}>{patternAns ? '✅ Correct!' : '❌ Wrong!'}</p>}
          </div>
        )}

        {/* Step 1: Word Recall */}
        {step === 1 && (
          <div>
            {wordPhase === 'study' && (
              <div className="text-center">
                <p className="text-slate-600 mb-3 text-sm">Memorize these 5 words:</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {wordSet.map(w => <div key={w} className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center font-medium text-amber-800">{w}</div>)}
                </div>
                <button onClick={() => setWordPhase('recall')} className="w-full bg-amber-500 text-white py-2.5 rounded-xl font-medium">I'm Ready — Hide Words</button>
              </div>
            )}
            {wordPhase === 'recall' && (
              <div>
                <p className="text-slate-600 mb-3 text-sm">Type the words you remember (comma separated):</p>
                <textarea rows={3} value={wordInput} onChange={e => setWordInput(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none mb-3" placeholder="River, Clock, ..." />
                <button onClick={() => {
                  const entered = wordInput.split(',').map(w => w.trim().toLowerCase());
                  const correct = entered.filter(w => wordSet.map(x => x.toLowerCase()).includes(w));
                  const s = correct.length * 20;
                  setWordScore(s);
                  setScore(p => p + s);
                  setWordPhase('done');
                }} className="w-full bg-amber-500 text-white py-2.5 rounded-xl font-medium">Submit</button>
              </div>
            )}
            {wordPhase === 'done' && (
              <div className="text-center">
                <p className="text-lg font-bold text-slate-800 mb-2">+{wordScore} points</p>
                <p className="text-sm text-slate-500 mb-4">Word Recall complete.</p>
                <button onClick={() => setStep(2)} className="w-full bg-amber-500 text-white py-2.5 rounded-xl font-medium">Next Task →</button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Trivia */}
        {step === 2 && (
          <div className="text-center">
            <p className="text-slate-700 font-medium mb-4">{TRIVIA[triviaIdx].q}</p>
            {triviaAns === null ? (
              <div className="grid grid-cols-2 gap-2">
                {TRIVIA[triviaIdx].options.map((opt, i) => (
                  <button key={i} onClick={() => {
                    const correct = opt === TRIVIA[triviaIdx].answer;
                    setTriviaAns(correct);
                    if (correct) { setScore(s => s + 50); setTriviaScore(t => t + 50); }
                    setTimeout(() => {
                      setTriviaAns(null);
                      if (triviaIdx < TRIVIA.length - 1) setTriviaIdx(ti => ti + 1);
                      else setStep(3);
                    }, 700);
                  }} className="py-3 rounded-xl bg-slate-100 hover:bg-violet-100 text-sm font-medium text-slate-700">{opt}</button>
                ))}
              </div>
            ) : <p className={`font-medium ${triviaAns ? 'text-green-600' : 'text-rose-600'}`}>{triviaAns ? '✅ Correct!' : `❌ Answer: ${TRIVIA[triviaIdx].answer}`}</p>}
          </div>
        )}

        {/* Step 3: Attention */}
        {step === 3 && (
          <div className="text-center">
            <p className="text-slate-700 font-medium mb-4">Find the ⭐ star quickly!</p>
            {!attDone ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {attGrid.map((sym, i) => (
                  <button key={i} onClick={() => {
                    const correct = i === attTargetIdx;
                    setAttCorrect(correct);
                    setAttDone(true);
                    if (correct) setScore(s => s + 100);
                    setTimeout(finishChallenge, 800);
                  }} className="aspect-square rounded-xl bg-slate-100 hover:bg-sky-100 text-2xl flex items-center justify-center">{sym}</button>
                ))}
              </div>
            ) : <p className={`font-medium mt-4 ${attCorrect ? 'text-green-600' : 'text-rose-600'}`}>{attCorrect ? '✅ Found it!' : '❌ Missed!'}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
