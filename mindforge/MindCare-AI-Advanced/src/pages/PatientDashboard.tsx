import React from 'react';
import { Brain, Flame, Calendar, Bell, Play, Mic, BookHeart, BarChart2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { AIRecommendation } from '../components/AIRecommendation';
import { ProgressBar } from '../components/ProgressBar';
import { useApp } from '../context/AppContext';
import { computeCognitiveScores } from '../utils/scoring';

export default function PatientDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const scores = computeCognitiveScores(state.gameResults);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const todayReminders = state.reminders.filter(r => {
    const d = new Date(r.dateTime);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const todayResults = state.gameResults.filter(r => {
    return new Date(r.date).toDateString() === new Date().toDateString();
  });

  const completedToday = todayReminders.filter(r => r.completed).length;
  const totalGoalMins = state.user.dailyGoal;
  const playedMins = todayResults.reduce((s, r) => s + Math.round(r.duration / 60), 0);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">👋</span>
          <h1 className="text-2xl font-bold text-slate-800">{greeting}, {state.user.name.split(' ')[0]}!</h1>
        </div>
        <p className="text-slate-500">Here's your cognitive wellness summary for today.</p>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1 rounded-full">
          <Flame size={12} /> {state.currentStreak} day streak — Keep it up!
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Memory Score" value={scores.memoryScore} unit="/100" icon={<Brain size={18} className="text-sky-600" />} color="blue" trend={5} />
        <StatCard label="Attention Score" value={scores.attentionScore} unit="/100" icon={<span className="text-teal-600">🎯</span>} color="teal" trend={3} />
        <StatCard label="Recall Score" value={scores.recallScore} unit="/100" icon={<span className="text-violet-600">🔁</span>} color="violet" trend={-2} />
        <StatCard label="Reaction Score" value={scores.reactionScore} unit="/100" icon={<span className="text-amber-600">⚡</span>} color="amber" trend={8} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* AI Recommendation */}
        <div className="lg:col-span-2">
          <AIRecommendation onStartGame={(gt) => navigate('/games')} />
        </div>

        {/* Daily Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Today's Goal</h3>
          <ProgressBar value={playedMins} max={totalGoalMins} label={`${playedMins} / ${totalGoalMins} min`} color="teal" />
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Games Played</span>
              <span className="font-medium text-slate-700">{todayResults.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Reminders Done</span>
              <span className="font-medium text-slate-700">{completedToday}/{todayReminders.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Streak</span>
              <span className="font-medium text-slate-700 flex items-center gap-1"><Flame size={14} className="text-amber-500" />{state.currentStreak} days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-sky-500" />
            <h3 className="font-semibold text-slate-800">Today's Schedule</h3>
          </div>
          {todayReminders.length === 0 ? (
            <p className="text-sm text-slate-400">No reminders scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {todayReminders.map(r => (
                <div key={r.id} className={`flex items-center gap-3 p-2 rounded-xl ${r.completed ? 'opacity-60' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${r.completed ? 'bg-green-400' : r.priority === 'high' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium text-slate-700 ${r.completed ? 'line-through' : ''}`}>{r.title}</p>
                    <p className="text-xs text-slate-400">{new Date(r.dateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {r.completed && <span className="text-xs text-green-600 font-medium">Done</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-sky-500" />
            <h3 className="font-semibold text-slate-800">Upcoming Reminders</h3>
          </div>
          {state.reminders.filter(r => !r.completed && new Date(r.dateTime) > new Date()).slice(0, 4).map(r => (
            <div key={r.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-lg">
                {r.category === 'medicine' ? '💊' : r.category === 'doctor' ? '🏥' : r.category === 'exercise' ? '🚶' : r.category === 'family' ? '👨👩👧' : '📌'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{r.title}</p>
                <p className="text-xs text-slate-400">{new Date(r.dateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {new Date(r.dateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          <Link to="/reminders" className="text-xs text-sky-600 hover:text-sky-700 font-medium mt-2 block">View all reminders →</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: <Play size={20} />, label: 'Play Games', to: '/games', color: 'bg-sky-50 text-sky-600' },
            { icon: <BookHeart size={20} />, label: 'Memory Vault', to: '/memory-vault', color: 'bg-violet-50 text-violet-600' },
            { icon: <BarChart2 size={20} />, label: 'Progress', to: '/progress', color: 'bg-teal-50 text-teal-600' },
            { icon: <Bell size={20} />, label: 'Reminders', to: '/reminders', color: 'bg-amber-50 text-amber-600' },
            { icon: <Mic size={20} />, label: 'Voice AI', to: '/dashboard', color: 'bg-rose-50 text-rose-600', isVoice: true },
            { icon: <Brain size={20} />, label: 'Caregiver', to: '/caregiver', color: 'bg-green-50 text-green-600' },
          ].map((a, i) => (
            <Link key={i} to={a.to} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${a.color} hover:scale-105 transition-transform cursor-pointer text-center`}>
              {a.icon}
              <span className="text-xs font-medium">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-xs text-center text-slate-400 mt-6">
        MindCare AI is a cognitive wellness and assistance platform. It does not diagnose or treat medical conditions.
      </p>
    </div>
  );
}
