import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { MemoryItem, MemoryCategory } from '../../types';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: MemoryItem | null;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MemoryCategory>('family');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [isCaregiverShared, setIsCaregiverShared] = useState(true);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setDate(initialData.date);
      setImageUrl(initialData.imageUrl || '');
      setTagsString(initialData.tags.join(', '));
      setIsCaregiverShared(initialData.isCaregiverShared);
    } else {
      setTitle('');
      setDescription('');
      setCategory('family');
      setDate(new Date().toISOString().split('T')[0]);
      setImageUrl('');
      setTagsString('');
      setIsCaregiverShared(true);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Please provide a short description or memory notes';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tags = tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onSave({
      userId: 'usr_demo_001',
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      imageUrl: imageUrl.trim() || undefined,
      tags,
      isCaregiverShared,
      recallPrompts: [
        `What do you remember most about ${title.trim()}?`,
        `When did this special moment take place?`,
      ],
    });

    onClose();
  };

  const samplePhotos = [
    { label: 'Family Diya', url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mountain Retreat', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Graduation', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80' },
    { label: 'Tea Time', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Treasured Memory' : 'Preserve a New Memory'}
      description="Record people, places, and milestones for gentle recollection."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Memory Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Diwali Courtyard Celebration with Rhea"
            className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as MemoryCategory)}
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
            >
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="people">Important People</option>
              <option value="places">Places & Travel</option>
              <option value="events">Special Events</option>
              <option value="notes">Personal Notes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Approximate Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Photo URL or Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Photo URL (Optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="Paste image link or choose sample below"
            className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
          />
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 font-medium">Quick sample photos:</span>
            {samplePhotos.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(sp.url)}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Story / Details / Sensory Notes *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Who was there? What was the atmosphere, sound, or feeling?"
            className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsString}
            onChange={e => setTagsString(e.target.value)}
            placeholder="e.g. Rhea, Diwali, Courtyard, Joy"
            className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
          />
        </div>

        {/* Caregiver Privacy Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Share with Connected Caregiver</span>
            <span className="text-[11px] text-slate-500">Allow caregiver to view this memory for joint conversation</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCaregiverShared(!isCaregiverShared)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              isCaregiverShared ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                isCaregiverShared ? 'translate-x-6' : 'translate-x-1'
              } top-1 absolute`}
            />
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Memory' : 'Save to Vault'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
