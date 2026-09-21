import React, { useState } from 'react';
import { Bell, Plus, Calendar, CheckCircle2 } from 'lucide-react';
import { ReminderCard } from '../components/ReminderCard';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import type { Reminder, ReminderCategory } from '../types';

const reminderCategories: ReminderCategory[] = ['medicine', 'doctor', 'family', 'exercise', 'personal', 'other'];

function ReminderForm({ initial, onSave, onCancel }: { initial?: Partial<Reminder>; onSave: (r: Omit<Reminder, 'id' | 'completed'>) => void; onCancel: () => void }) {
  const defaultDT = new Date();
  defaultDT.setHours(defaultDT.getHours() + 1, 0, 0, 0);
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    dateTime: initial?.dateTime ? new Date(initial.dateTime).toISOString().slice(0, 16) : defaultDT.toISOString().slice(0, 16),
    category: initial?.category ?? 'personal' as ReminderCategory,
    priority: initial?.priority ?? 'medium' as 'low' | 'medium' | 'high',
    recurring: initial?.recurring ?? null as 'daily' | 'weekly' | 'monthly' | null,
  });

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...form, dateTime: new Date(form.dateTime).toISOString() }); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
        <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" placeholder="e.g. Take morning medicine" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" placeholder="Additional details..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time *</label>
        <input type="datetime-local" required value={form.dateTime} onChange={e => setForm(f => ({ ...f, dateTime: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ReminderCategory }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 capitalize">
            {reminderCategories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
          <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as 'low'|'medium'|'high' }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Recurring</label>
        <select value={form.recurring ?? ''} onChange={e => setForm(f => ({ ...f, recurring: e.target.value ? e.target.value as 'daily'|'weekly'|'monthly' : null }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300">
          <option value="">None (one-time)</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium">Save Reminder</button>
      </div>
    </form>
  );
}

type ReminderTab = 'today' | 'upcoming' | 'completed';

export default function Reminders() {
  const { state, addReminder, updateReminder, deleteReminder, markReminderDone } = useApp();
  const [tab, setTab] = useState<ReminderTab>('today');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const now = new Date();
  const today = now.toDateString();

  const todayReminders = state.reminders.filter(r => new Date(r.dateTime).toDateString() === today);
  const upcomingReminders = state.reminders.filter(r => !r.completed && new Date(r.dateTime) > now && new Date(r.dateTime).toDateString() !== today);
  const completedReminders = state.reminders.filter(r => r.completed);

  const currentList = tab === 'today' ? todayReminders : tab === 'upcoming' ? upcomingReminders : completedReminders;

  const handleAdd = (data: Omit<Reminder, 'id' | 'completed'>) => {
    addReminder({ ...data, id: `r-${Date.now()}`, completed: false });
    setShowAdd(false);
  };

  const handleEdit = (data: Omit<Reminder, 'id' | 'completed'>) => {
    if (editing) { updateReminder({ ...data, id: editing.id, completed: editing.completed }); setEditing(null); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Bell size={20} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Smart Reminders</h1>
            <p className="text-slate-500 text-sm">Never miss an important moment.</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add Reminder
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 mb-6 w-fit gap-1">
        {([['today', 'Today', todayReminders.length], ['upcoming', 'Upcoming', upcomingReminders.length], ['completed', 'Completed', completedReminders.length]] as const).map(([val, label, count]) => (
          <button key={val} onClick={() => setTab(val)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === val ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'
          }`}>
            {label} {count > 0 && <span className="ml-1 bg-sky-100 text-sky-600 text-xs px-1.5 py-0.5 rounded-full">{count}</span>}
          </button>
        ))}
      </div>

      {currentList.length === 0 ? (
        <EmptyState
          icon={tab === 'completed' ? <CheckCircle2 size={32} /> : <Calendar size={32} />}
          title={tab === 'today' ? 'No reminders today' : tab === 'upcoming' ? 'No upcoming reminders' : 'No completed reminders'}
          description={tab === 'today' ? 'Add a reminder to keep track of medicines, appointments, and activities.' : tab === 'upcoming' ? 'Schedule reminders for future events.' : 'Completed reminders will appear here.'}
          action={tab !== 'completed' ? <button onClick={() => setShowAdd(true)} className="bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-medium">Add Reminder</button> : undefined}
        />
      ) : (
        <div className="space-y-3">
          {currentList.map(r => (
            <ReminderCard
              key={r.id} reminder={r}
              onComplete={() => markReminderDone(r.id)}
              onEdit={() => setEditing(r)}
              onDelete={() => setDeleteId(r.id)}
            />
          ))}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Reminder">
        <ReminderForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Reminder">
        {editing && <ReminderForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} />}
      </Modal>
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Reminder" size="sm">
        <p className="text-slate-600 mb-4">Are you sure you want to delete this reminder?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Cancel</button>
          <button onClick={() => { if (deleteId) { deleteReminder(deleteId); setDeleteId(null); } }} className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-medium">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
