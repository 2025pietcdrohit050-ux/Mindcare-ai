import React, { useState, useEffect } from 'react';
import { storageService } from '../utils/storage';
import { useToast } from '../hooks/useToast';
import { soundFx } from '../utils/sound';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import {
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Volume2,
  Sparkles,
  Calendar,
} from 'lucide-react';
import type { ReminderItem, ReminderCategory } from '../types';

export const RemindersPage: React.FC = () => {
  const { addToast } = useToast();
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReminderCategory>('exercise');
  const [time, setTime] = useState('10:00 AM');
  const [recurrence, setRecurrence] = useState<'daily' | 'weekly' | 'none'>('daily');

  const loadReminders = () => {
    setReminders(storageService.getReminders());
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleToggle = (id: string) => {
    storageService.toggleReminder(id);
    soundFx.playReminderChime();
    loadReminders();
    addToast('Reminder status updated', 'success');
  };

  const handleDelete = (id: string) => {
    storageService.deleteReminder(id);
    loadReminders();
    addToast('Reminder removed', 'info');
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    storageService.addReminder({
      userId: 'usr_demo_001',
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      time,
      date: 'Today',
      isCompleted: false,
      recurrence,
    });

    soundFx.playReminderChime();
    addToast('New reminder scheduled', 'success');
    loadReminders();
    setIsAddModalOpen(false);

    setTitle('');
    setDescription('');
  };

  const filteredReminders = reminders.filter(r => {
    if (activeFilter === 'pending') return !r.isCompleted;
    if (activeFilter === 'completed') return r.isCompleted;
    return true;
  });

  const categoryVariants = {
    exercise: 'emerald' as const,
    'memory-review': 'purple' as const,
    event: 'blue' as const,
    personal: 'amber' as const,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Bell className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Daily Wellness Reminders
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            Gentle prompts for brain exercises, memory reviews, hydration, and family calls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => soundFx.playReminderChime()}
            variant="outline"
            size="sm"
            leftIcon={<Volume2 className="w-4 h-4 text-emerald-600" />}
          >
            Test Chime
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Reminder
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex gap-1.5">
          {(['all', 'pending', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                activeFilter === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-semibold">
          {filteredReminders.length} reminder{filteredReminders.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.map(rem => (
          <Card
            key={rem.id}
            className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition-all ${
              rem.isCompleted ? 'bg-slate-50/70 border-slate-200 opacity-70' : 'bg-white'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => handleToggle(rem.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  rem.isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border-2 border-slate-300 hover:border-emerald-500'
                }`}
              >
                {rem.isCompleted && <CheckCircle2 className="w-5 h-5" />}
              </button>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`font-bold text-sm sm:text-base ${
                      rem.isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                  >
                    {rem.title}
                  </h3>
                  <Badge variant={categoryVariants[rem.category]} size="sm">
                    {rem.category.toUpperCase()}
                  </Badge>
                </div>
                {rem.description && (
                  <p className="text-xs text-slate-500 max-w-xl line-clamp-1">{rem.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="text-right">
                <span className="text-xs sm:text-sm font-extrabold text-emerald-800 block">
                  {rem.time}
                </span>
                <span className="text-[11px] text-slate-400 font-medium capitalize">
                  {rem.recurrence}
                </span>
              </div>

              <button
                onClick={() => handleDelete(rem.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Reminder Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Daily Reminder"
        description="Set a gentle reminder for training or personal wellness."
      >
        <form onSubmit={handleAddReminder} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reminder Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Afternoon Memory Review"
              required
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ReminderCategory)}
                className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              >
                <option value="exercise">Cognitive Exercise</option>
                <option value="memory-review">Memory Review</option>
                <option value="personal">Personal Routine</option>
                <option value="event">Special Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 04:30 PM"
                className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Recurrence
            </label>
            <select
              value={recurrence}
              onChange={e => setRecurrence(e.target.value as 'daily' | 'weekly' | 'none')}
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
            >
              <option value="daily">Every Day (Daily)</option>
              <option value="weekly">Once a Week (Weekly)</option>
              <option value="none">One Time Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Gentle details or notes..."
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Reminder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
