import React, { useState, useEffect } from 'react';
import { storageService } from '../utils/storage';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { MemoryCard } from '../components/memory-vault/MemoryCard';
import { MemoryModal } from '../components/memory-vault/MemoryModal';
import { MemoryReviewModal } from '../components/memory-vault/MemoryReviewModal';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import {
  FolderHeart,
  Plus,
  Search,
  LayoutGrid,
  CalendarDays,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import type { MemoryItem, MemoryCategory } from '../types';

export const MemoryVaultPage: React.FC = () => {
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'timeline'>('cards');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const loadMemories = () => {
    setMemories(storageService.getMemories());
  };

  useEffect(() => {
    loadMemories();
  }, []);

  const handleSaveMemory = (data: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMemory) {
      storageService.updateMemory({
        ...editingMemory,
        ...data,
      });
      addToast('Memory updated successfully', 'success');
    } else {
      storageService.addMemory(data);
      addToast('New memory preserved in vault', 'success');
    }
    loadMemories();
    setEditingMemory(null);
  };

  const handleDeleteMemory = (id: string) => {
    if (confirm('Are you sure you wish to remove this memory from your vault?')) {
      storageService.deleteMemory(id);
      addToast('Memory removed', 'info');
      loadMemories();
    }
  };

  // Filter memories
  const filteredMemories = memories.filter(m => {
    const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Entries' },
    { id: 'family', label: t('catFamily') },
    { id: 'friends', label: t('catFriends') },
    { id: 'people', label: t('catPeople') },
    { id: 'places', label: t('catPlaces') },
    { id: 'events', label: t('catEvents') },
    { id: 'notes', label: t('catNotes') },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <FolderHeart className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Personal Memory Vault
            </h1>
          </div>
          <p className="text-sm text-slate-600">
            A secure, dignified haven for cherished life stories, family portraits, and special places.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setIsReviewModalOpen(true)}
            variant="secondary"
            size="md"
            leftIcon={<Sparkles className="w-4 h-4 text-emerald-600" />}
          >
            {t('memoryReviewMode')}
          </Button>

          <Button
            onClick={() => {
              setEditingMemory(null);
              setIsAddModalOpen(true);
            }}
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t('actionAddMemory')}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search titles, people, or tags..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-slate-800"
          />
        </div>

        {/* View Switcher: Cards vs Timeline */}
        <div className="flex items-center gap-1.5 self-end md:self-auto">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase">View:</span>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Timeline</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Memories View */}
      {filteredMemories.length === 0 ? (
        <EmptyState
          icon={FolderHeart}
          title={t('memoryEmptyTitle')}
          description={t('memoryEmptyDesc')}
          actionLabel={t('actionAddMemory')}
          onAction={() => {
            setEditingMemory(null);
            setIsAddModalOpen(true);
          }}
        />
      ) : viewMode === 'cards' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map(mem => (
            <MemoryCard
              key={mem.id}
              memory={mem}
              onEdit={m => {
                setEditingMemory(m);
                setIsAddModalOpen(true);
              }}
              onDelete={handleDeleteMemory}
            />
          ))}
        </div>
      ) : (
        /* Timeline View */
        <div className="relative border-l-2 border-emerald-200 ml-4 sm:ml-6 space-y-8 py-4">
          {filteredMemories.map(mem => (
            <div key={mem.id} className="relative pl-6 sm:pl-8 group">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white shadow-xs" />
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold text-emerald-700">
                    {new Date(mem.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 capitalize">
                    {mem.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{mem.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{mem.description}</p>
                {mem.imageUrl && (
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full max-w-sm h-40 object-cover rounded-xl mb-3"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <MemoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMemory(null);
        }}
        onSave={handleSaveMemory}
        initialData={editingMemory}
      />

      {/* Memory Review Mode Quiz Modal */}
      <MemoryReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        memories={memories}
      />
    </div>
  );
};
