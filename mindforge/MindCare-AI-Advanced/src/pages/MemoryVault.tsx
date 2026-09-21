import React, { useState } from 'react';
import { BookHeart, Plus, Search, Users, MapPin, Calendar, FileText, Clock, Heart } from 'lucide-react';
import { MemoryCard } from '../components/MemoryCard';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import type { Memory, MemoryCategory } from '../types';

const categories: { value: MemoryCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'people', label: 'People', icon: <Users size={16} /> },
  { value: 'places', label: 'Places', icon: <MapPin size={16} /> },
  { value: 'events', label: 'Events', icon: <Calendar size={16} /> },
  { value: 'notes', label: 'Notes', icon: <FileText size={16} /> },
  { value: 'routines', label: 'Routines', icon: <Clock size={16} /> },
  { value: 'favorites', label: 'Favorites', icon: <Heart size={16} /> },
];

function MemoryForm({ initial, onSave, onCancel }: { initial?: Partial<Memory>; onSave: (m: Omit<Memory, 'id'>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    category: initial?.category ?? 'people' as MemoryCategory,
    relationship: initial?.relationship ?? '',
    description: initial?.description ?? '',
    date: initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    reminder: initial?.reminder ?? '',
  });

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...form, date: new Date(form.date).toISOString(), reminder: form.reminder || undefined }); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
        <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" placeholder="e.g. Sunita Sharma" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as MemoryCategory }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300">
          {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Relationship / Role</label>
        <input value={form.relationship} onChange={e => setForm(f => ({ ...f, relationship: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" placeholder="e.g. Wife, Doctor, Friend" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
        <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none" placeholder="Write a helpful description..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reminder (optional)</label>
          <input type="datetime-local" value={form.reminder} onChange={e => setForm(f => ({ ...f, reminder: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50">Cancel</button>
        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors">Save Memory</button>
      </div>
    </form>
  );
}

export default function MemoryVault() {
  const { state, addMemory, updateMemory, deleteMemory } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MemoryCategory | 'all'>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Memory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = state.memories.filter(m => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (data: Omit<Memory, 'id'>) => {
    addMemory({ ...data, id: `m-${Date.now()}` });
    setShowAdd(false);
  };

  const handleEdit = (data: Omit<Memory, 'id'>) => {
    if (editing) { updateMemory({ ...data, id: editing.id }); setEditing(null); }
  };

  const handleDelete = () => {
    if (deleteId) { deleteMemory(deleteId); setDeleteId(null); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <BookHeart size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Memory Vault</h1>
            <p className="text-slate-500 text-sm">Your personal memory book — people, places, and things that matter.</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Add Memory
        </button>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search memories..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCategory('all')} className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All ({state.memories.length})</button>
          {categories.map(c => (
            <button key={c.value} onClick={() => setActiveCategory(c.value)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${activeCategory === c.value ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {c.icon} {c.label} ({state.memories.filter(m => m.category === c.value).length})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BookHeart size={32} />} title="No memories found" description="Add your first memory — people, places, events, or anything that matters to you." action={<button onClick={() => setShowAdd(true)} className="bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-medium">Add Memory</button>} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(m => <MemoryCard key={m.id} memory={m} onEdit={() => setEditing(m)} onDelete={() => setDeleteId(m.id)} />)}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Memory">
        <MemoryForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Memory">
        {editing && <MemoryForm initial={editing} onSave={handleEdit} onCancel={() => setEditing(null)} />}
      </Modal>
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Memory" size="sm">
        <p className="text-slate-600 mb-4">Are you sure you want to delete this memory? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium">Cancel</button>
          <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
