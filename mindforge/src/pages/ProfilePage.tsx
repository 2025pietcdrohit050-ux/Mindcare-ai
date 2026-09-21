import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { User, Mail, Shield, Sliders, Globe, Heart, Save } from 'lucide-react';
import type { Difficulty } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [baselineDifficulty, setBaselineDifficulty] = useState<Difficulty>(user.baselineDifficulty);
  const [caregiverName, setCaregiverName] = useState(user.caregiverName || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      baselineDifficulty,
      caregiverName: caregiverName.trim() || undefined,
    });
    addToast('Profile changes saved successfully', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <User className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            User Profile & Preferences
          </h1>
        </div>
        <p className="text-sm text-slate-600">
          Manage your personal information, cognitive training baseline, and caregiver connections.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6 text-left">
          {/* Avatar & Role Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              {name.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{name}</h3>
              <p className="text-xs text-slate-500">Member since {user.joinedDate || 'August 2026'}</p>
              <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                {user.role} View
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Baseline Exercise Difficulty
              </label>
              <select
                value={baselineDifficulty}
                onChange={e => setBaselineDifficulty(e.target.value as Difficulty)}
                className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none capitalize"
              >
                <option value="easy">Easy (Gentle)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="hard">Hard (Stimulating)</option>
                <option value="adaptive">Adaptive AI Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Authorized Caregiver Contact
              </label>
              <input
                type="text"
                value={caregiverName}
                onChange={e => setCaregiverName(e.target.value)}
                placeholder="e.g. Dr. Sunita Sharma"
                className="w-full text-sm rounded-xl px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
              Save Profile Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
