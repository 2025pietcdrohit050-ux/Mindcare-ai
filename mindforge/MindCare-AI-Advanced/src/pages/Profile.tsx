import React, { useState } from 'react';
import { User, Save, Bell, Accessibility } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { state, updateUser } = useApp();
  const [form, setForm] = useState({
    name: state.user.name,
    age: state.user.age,
    dailyGoal: state.user.dailyGoal,
    language: state.user.language,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser({ name: form.name, age: form.age, dailyGoal: form.dailyGoal, language: form.language });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
          <User size={20} className="text-sky-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Profile</h1>
          <p className="text-slate-500 text-sm">Manage your preferences and settings.</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4 flex items-center gap-5">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {state.user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">{state.user.name}</h2>
          <p className="text-sm text-slate-500">Age {state.user.age} · Demo Patient</p>
          <p className="text-xs text-sky-600 font-medium mt-1">SIH26003 · MindCare AI Demo</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
        <h3 className="font-semibold text-slate-800 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input type="number" min={1} max={120} value={form.age} onChange={e => setForm(f => ({ ...f, age: +e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Language</label>
              <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value as 'en'|'hi' }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300">
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Daily Goal (minutes)</label>
            <input type="number" min={5} max={120} value={form.dailyGoal} onChange={e => setForm(f => ({ ...f, dailyGoal: +e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
          </div>
        </div>
        <button onClick={handleSave} className={`mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white'}`}>
          <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Notification Prefs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-amber-500" />
          <h3 className="font-semibold text-slate-800">Notification Preferences</h3>
        </div>
        {[
          { key: 'reminders' as const, label: 'Reminder Notifications', desc: 'Medicine, doctor, and activity reminders' },
          { key: 'dailyChallenge' as const, label: 'Daily Challenge Alert', desc: 'Notify when daily challenge is ready' },
          { key: 'caregiverAlerts' as const, label: 'Caregiver Alerts', desc: 'Notes and updates from your caregiver' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
            <button
              onClick={() => updateUser({ notificationPrefs: { ...state.user.notificationPrefs, [item.key]: !state.user.notificationPrefs[item.key] } })}
              className={`w-11 h-6 rounded-full transition-colors relative ${state.user.notificationPrefs[item.key] ? 'bg-sky-500' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${state.user.notificationPrefs[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Accessibility */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Accessibility size={16} className="text-violet-500" />
          <h3 className="font-semibold text-slate-800">Accessibility Preferences</h3>
        </div>
        {[
          { key: 'largeText' as const, label: 'Large Text Mode', desc: 'Increase font size across the app' },
          { key: 'highContrast' as const, label: 'High Contrast Mode', desc: 'Improve text visibility' },
          { key: 'reducedMotion' as const, label: 'Reduced Motion', desc: 'Minimize animations and transitions' },
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
            <button
              onClick={() => updateUser({ accessibilityPrefs: { ...state.user.accessibilityPrefs, [item.key]: !state.user.accessibilityPrefs[item.key] } })}
              className={`w-11 h-6 rounded-full transition-colors relative ${state.user.accessibilityPrefs[item.key] ? 'bg-violet-500' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${state.user.accessibilityPrefs[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
