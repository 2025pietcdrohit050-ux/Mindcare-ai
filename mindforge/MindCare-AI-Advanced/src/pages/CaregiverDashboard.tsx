import React, { useState } from 'react';
import { Users, TrendingUp, Bell, MessageCircle, Plus, AlertCircle, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import { computeCognitiveScores, getWeeklyData } from '../utils/scoring';
import type { CaregiverNote } from '../types';

export default function CaregiverDashboard() {
  const { state, addCaregiverNote } = useApp();
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const weeklyData = getWeeklyData(state.gameResults);
  const scores = computeCognitiveScores(state.gameResults);

  const todayResults = state.gameResults.filter(r => new Date(r.date).toDateString() === new Date().toDateString());
  const weekResults = state.gameResults.filter(r => new Date(r.date) >= new Date(Date.now() - 7 * 86400000));
  const weekReminders = state.reminders.filter(r => new Date(r.dateTime) >= new Date(Date.now() - 7 * 86400000));
  const completedReminders = weekReminders.filter(r => r.completed);
  const adherence = weekReminders.length ? Math.round((completedReminders.length / weekReminders.length) * 100) : 0;

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    addCaregiverNote({ id: `cn-${Date.now()}`, content: noteText, timestamp: new Date().toISOString(), author: 'Priya Sharma' });
    setNoteText('');
    setShowNote(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Caregiver Dashboard</h1>
            <p className="text-slate-500 text-sm">Monitoring: <span className="font-medium text-slate-700">{state.user.name}</span></p>
          </div>
        </div>
        <button onClick={() => setShowNote(true)} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2.5 rounded-xl text-sm">
          <Plus size={16} /> Add Note
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-start gap-2">
        <AlertCircle size={16} className="text-amber-600 mt-0.5" />
        <p className="text-sm text-amber-700">This dashboard shows wellness activity data only. MindCare AI does not provide medical diagnoses or clinical assessments.</p>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Sessions This Week', value: weekResults.length, color: 'bg-sky-50 text-sky-600' },
          { label: 'Today\'s Sessions', value: todayResults.length, color: 'bg-teal-50 text-teal-600' },
          { label: 'Reminder Adherence', value: `${adherence}%`, color: 'bg-violet-50 text-violet-600' },
          { label: 'Activity Streak', value: `${state.currentStreak}d`, color: 'bg-amber-50 text-amber-600' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Wellness Trend */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-sky-500" />
            <h3 className="font-semibold text-slate-800">Wellness Activity Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="memory" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Memory" />
              <Line type="monotone" dataKey="attention" stroke="#14b8a6" strokeWidth={2} dot={false} name="Attention" />
              <Line type="monotone" dataKey="recall" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Recall" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Reminders */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-amber-500" />
            <h3 className="font-semibold text-slate-800">Recent Reminders</h3>
          </div>
          <div className="space-y-2">
            {state.reminders.slice(0, 5).map(r => (
              <div key={r.id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${r.completed ? 'bg-green-400' : 'bg-amber-400'}`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{r.title}</p>
                  <p className="text-xs text-slate-400 capitalize">{r.category}</p>
                </div>
                <span className={`text-xs font-medium ${r.completed ? 'text-green-600' : 'text-amber-600'}`}>{r.completed ? 'Done' : 'Pending'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance scores */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-teal-500" />
          <h3 className="font-semibold text-slate-800">Latest Performance Overview</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Memory Activity', value: scores.memoryScore, color: 'bg-sky-500' },
            { label: 'Attention Activity', value: scores.attentionScore, color: 'bg-teal-500' },
            { label: 'Recall Activity', value: scores.recallScore, color: 'bg-violet-500' },
            { label: 'Reaction Activity', value: scores.reactionScore, color: 'bg-amber-500' },
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className="w-16 h-16 mx-auto relative mb-2">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="2.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={item.color.replace('bg-', 'text-')}
                    strokeDasharray={`${item.value} ${100 - item.value}`} strokeLinecap="round" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">{item.value}%</span>
              </div>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Caregiver notes */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={16} className="text-green-500" />
          <h3 className="font-semibold text-slate-800">Caregiver Notes</h3>
        </div>
        {state.caregiverNotes.length === 0 ? (
          <p className="text-sm text-slate-400">No notes yet. Add a note to track observations.</p>
        ) : (
          <div className="space-y-3">
            {state.caregiverNotes.map(note => (
              <div key={note.id} className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-700 leading-relaxed">{note.content}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <span>{note.author}</span>
                  <span>·</span>
                  <span>{new Date(note.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showNote} onClose={() => setShowNote(false)} title="Add Caregiver Note" size="sm">
        <textarea
          rows={4}
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          placeholder="Write your observation or note..."
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none mb-4"
        />
        <div className="flex gap-3">
          <button onClick={() => setShowNote(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Cancel</button>
          <button onClick={handleAddNote} className="flex-1 py-2.5 rounded-xl bg-green-500 text-white text-sm font-medium">Save Note</button>
        </div>
      </Modal>
    </div>
  );
}
