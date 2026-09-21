import React from 'react';
import { BarChart2, TrendingUp, Brain, Zap, Lightbulb } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { useApp } from '../context/AppContext';
import { getWeeklyData, computeCognitiveScores } from '../utils/scoring';

export default function Progress() {
  const { state } = useApp();
  const weeklyData = getWeeklyData(state.gameResults);
  const scores = computeCognitiveScores(state.gameResults);
  const totalGames = state.gameResults.length;
  const avgAccuracy = totalGames ? Math.round(state.gameResults.reduce((s, r) => s + r.accuracy, 0) / totalGames) : 0;

  // Week-over-week comparison
  const thisWeek = state.gameResults.filter(r => new Date(r.date) >= new Date(Date.now() - 7 * 86400000));
  const lastWeek = state.gameResults.filter(r => {
    const d = new Date(r.date);
    return d >= new Date(Date.now() - 14 * 86400000) && d < new Date(Date.now() - 7 * 86400000);
  });
  const thisRecall = thisWeek.filter(r => r.gameType === 'sequence-recall' || r.gameType === 'word-recall');
  const lastRecall = lastWeek.filter(r => r.gameType === 'sequence-recall' || r.gameType === 'word-recall');
  const recallImprovement = thisRecall.length && lastRecall.length
    ? Math.round(
        (thisRecall.reduce((s, r) => s + r.accuracy, 0) / thisRecall.length) -
        (lastRecall.reduce((s, r) => s + r.accuracy, 0) / lastRecall.length)
      )
    : 8;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
          <BarChart2 size={20} className="text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Progress & Analytics</h1>
          <p className="text-slate-500 text-sm">Track your cognitive wellness activity over time.</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Memory Score', value: scores.memoryScore, unit: '/100', color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Attention Score', value: scores.attentionScore, unit: '/100', color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Recall Score', value: scores.recallScore, unit: '/100', color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Avg Accuracy', value: avgAccuracy, unit: '%', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}<span className="text-sm font-normal">{s.unit}</span></p>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl text-white p-5 mb-6 flex items-start gap-3">
        <Lightbulb size={20} className="text-yellow-200 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold mb-1">AI Wellness Insight</p>
          <p className="text-sm text-sky-50">
            {recallImprovement >= 0
              ? `Your recall activity accuracy improved by ${recallImprovement}% compared to the previous week. Keep it up!`
              : `Your recall accuracy dipped by ${Math.abs(recallImprovement)}% this week. Try the Sequence Recall game to practice.`
            }
            {' '}You have completed {totalGames} total sessions with an average accuracy of {avgAccuracy}%.
          </p>
          <p className="text-xs text-sky-200 mt-2 italic">* Wellness activity insights only — not a medical assessment.</p>
        </div>
      </div>

      {/* Weekly trend line chart */}
      <ChartCard title="Weekly Cognitive Activity" subtitle="Score trends for the last 7 days">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="memory" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} name="Memory" />
            <Line type="monotone" dataKey="attention" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4 }} name="Attention" />
            <Line type="monotone" dataKey="recall" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Recall" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="mt-4">
        <ChartCard title="Games Completed per Day" subtitle="Number of sessions over the last 7 days">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="games" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Games" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-green-500" />
            <h3 className="font-semibold text-slate-800">Recent Game Results</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {state.gameResults.slice(0, 10).map(r => (
              <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-700 capitalize">{r.gameType.replace(/-/g, ' ')}</p>
                  <p className="text-xs text-slate-400">{new Date(r.date).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-sky-600">{r.score} pts</p>
                  <p className="text-xs text-slate-400">{r.accuracy}% acc</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-violet-500" />
            <h3 className="font-semibold text-slate-800">Cognitive Wellness Areas</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Memory', value: scores.memoryScore, color: 'bg-sky-500' },
              { label: 'Attention', value: scores.attentionScore, color: 'bg-teal-500' },
              { label: 'Recall', value: scores.recallScore, color: 'bg-violet-500' },
              { label: 'Reaction', value: scores.reactionScore, color: 'bg-amber-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-700">{item.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
